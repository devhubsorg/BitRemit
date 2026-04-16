import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Wallet, keccak256, toUtf8Bytes } from "ethers";
import {
  createPublicClient,
  createWalletClient,
  http,
  type Address,
  type Chain,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import twilio from "twilio";
import { requireAuth } from "web3";
import prisma from "@bitremit/database";

// ---------------------------------------------------------------------------
// Chain & contract config
// ---------------------------------------------------------------------------

const MEZO_TESTNET = {
  id: 31611,
  name: "Mezo Testnet",
  nativeCurrency: { name: "BTC", symbol: "BTC", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://rpc.test.mezo.org"] },
  },
} as const satisfies Chain;

const REGISTRY_ADDRESS =
  (process.env.RECIPIENT_REGISTRY_ADDRESS as Address | undefined) ??
  ("0x4877a1fC542ed05e570913a7fFD9Ba4A161fcB69" as Address);

const REGISTRY_ABI = [
  {
    name: "registerRecipient",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "phoneHash", type: "bytes32" },
      { name: "custodialAddress", type: "address" },
    ],
    outputs: [],
  },
] as const;

// ---------------------------------------------------------------------------
// Input schema
// ---------------------------------------------------------------------------

const E164_REGEX = /^\+[1-9]\d{1,14}$/;

const recipientSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  phoneNumber: z
    .string()
    .regex(
      E164_REGEX,
      "phoneNumber must be in E.164 format (e.g. +254712345678)",
    ),
  paymentRail: z.enum(["MPESA", "GCASH", "MTNMOMO"]),
});

// ---------------------------------------------------------------------------
// SMS rail display names
// ---------------------------------------------------------------------------

const RAIL_NAMES: Record<string, string> = {
  MPESA: "M-Pesa",
  GCASH: "GCash",
  MTNMOMO: "MTN MoMo",
};

// ---------------------------------------------------------------------------
// GET /api/recipients
//
// Design choice: The Recipient model has no direct sender field. The schema
// links users to recipients via Transaction records (sender → recipient).
// Rather than requiring a schema migration to add a join table, we query the
// existing relation: find all recipients that appear in transactions sent by
// the current userId. This means a newly created recipient appears here only
// after a first transaction is sent — consistent with how real remittance
// apps surface contact history.
// ---------------------------------------------------------------------------

export async function GET(request: NextRequest) {
  const auth = await requireAuth(request);
  if (auth instanceof NextResponse) return auth;
  const { userId } = auth;

  const recipients = await prisma.recipient.findMany({
    where: {
      receivedTxs: {
        some: { senderId: userId },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(recipients);
}

// ---------------------------------------------------------------------------
// POST /api/recipients
//
// Required env vars:
//   BACKEND_SIGNER_PRIVATE_KEY  — hex private key (0x-prefixed) of the
//                                  authorised registrar wallet on-chain
//   TWILIO_ACCOUNT_SID          — Twilio account SID
//   TWILIO_AUTH_TOKEN           — Twilio auth token
//   TWILIO_PHONE_NUMBER         — Twilio sender number (E.164)
//   MEZO_RPC_URL                — optional override for Mezo JSON-RPC endpoint
//   RECIPIENT_REGISTRY_ADDRESS  — optional override for contract address
// ---------------------------------------------------------------------------

export async function POST(request: NextRequest) {
  // ── Auth ────────────────────────────────────────────────────────────────
  const auth = await requireAuth(request);
  if (auth instanceof NextResponse) return auth;
  // userId is available but recipients are not user-scoped in the current
  // schema — the Recipient is protocol-global, keyed by phone hash.

  // ── Parse & validate body ───────────────────────────────────────────────
  let rawBody: unknown;
  try {
    rawBody = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = recipientSchema.safeParse(rawBody);
  if (!parsed.success) {
    const phoneIssue = parsed.error.issues.find((i) =>
      i.path.includes("phoneNumber"),
    );
    if (phoneIssue) {
      return NextResponse.json(
        {
          error:
            "Invalid phone number format. Must be E.164 (e.g. +254712345678)",
        },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: "Invalid request body", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { name, phoneNumber, paymentRail } = parsed.data;

  // ── Hash phone number (mirrors on-chain RecipientRegistry key) ──────────
  const phoneHash = keccak256(toUtf8Bytes(phoneNumber)) as `0x${string}`;

  // ── Generate custodial wallet ────────────────────────────────────────────
  // NOTE: The private key produced here is NOT persisted. In production this
  // should be stored encrypted in a KMS/HSM before the DB write.
  const custodialWallet = Wallet.createRandom();
  const custodialAddress = custodialWallet.address as Address;

  // ── Call RecipientRegistry.registerRecipient on-chain ──────────────────
  const signerPrivateKey = process.env.BACKEND_SIGNER_PRIVATE_KEY;
  if (!signerPrivateKey) {
    return NextResponse.json(
      { error: "Server configuration error" },
      { status: 500 },
    );
  }

  const account = privateKeyToAccount(signerPrivateKey as `0x${string}`);
  const walletClient = createWalletClient({
    account,
    chain: MEZO_TESTNET,
    transport: http(process.env.MEZO_RPC_URL ?? "https://rpc.test.mezo.org"),
  });

  // Pair a public client for awaiting the tx receipt.
  const publicClient = createPublicClient({
    chain: MEZO_TESTNET,
    transport: http(process.env.MEZO_RPC_URL ?? "https://rpc.test.mezo.org"),
  });

  try {
    const txHash = await walletClient.writeContract({
      address: REGISTRY_ADDRESS,
      abi: REGISTRY_ABI,
      functionName: "registerRecipient",
      args: [phoneHash, custodialAddress],
    });

    await publicClient.waitForTransactionReceipt({ hash: txHash });
  } catch (err: unknown) {
    // Surface a 409 early if the phone hash is already registered on-chain
    // (contract reverts with recognisable message).
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.toLowerCase().includes("already registered")) {
      return NextResponse.json(
        { error: "Phone number already registered" },
        { status: 409 },
      );
    }
    throw err;
  }

  // ── Persist to DB ────────────────────────────────────────────────────────
  let recipient;
  try {
    recipient = await prisma.recipient.create({
      data: {
        name,
        phoneNumber,
        phoneHash,
        custodialAddress,
        paymentRail,
      },
    });
  } catch (err: unknown) {
    // P2002 = Prisma unique constraint violation (phone already in DB).
    if (
      err !== null &&
      typeof err === "object" &&
      "code" in err &&
      err.code === "P2002"
    ) {
      return NextResponse.json(
        { error: "Phone number already registered" },
        { status: 409 },
      );
    }
    throw err;
  }

  // ── Send welcome SMS via Twilio ──────────────────────────────────────────
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_PHONE_NUMBER;

  if (accountSid && authToken && fromNumber) {
    try {
      const twilioClient = twilio(accountSid, authToken);
      await twilioClient.messages.create({
        from: fromNumber,
        to: phoneNumber,
        body: `Your family set up a BitRemit account for you. You'll receive money via ${RAIL_NAMES[paymentRail]}.`,
      });
    } catch {
      // SMS failure is non-fatal — the recipient record is already created.
      // Log the error in production monitoring rather than aborting.
      console.error("[BitRemit] Twilio welcome SMS failed for", phoneNumber);
    }
  }

  return NextResponse.json(recipient, { status: 201 });
}
