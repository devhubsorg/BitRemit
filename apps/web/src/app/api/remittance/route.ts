import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { JsonRpcProvider, Wallet, Contract, parseUnits } from "ethers";
import { requireAuth } from "web3";
import prisma from "@bitremit/database";

// ---------------------------------------------------------------------------
// Contract config
// ---------------------------------------------------------------------------

const ROUTER_ADDRESS =
  process.env.NEXT_PUBLIC_ROUTER_ADDRESS ??
  "0xb03843007F051c73b739a0CCe126c5Ed45E7626e";

// Human-readable ABI — sufficient for a single write call.
const ROUTER_ABI = [
  "function sendRemittance(bytes32 recipientPhoneHash, uint256 amount, string calldata railType) external",
];

// ---------------------------------------------------------------------------
// Default fiat currency per payment rail
// (actual fiat amount is set by the off-ramp webhook once settled)
// ---------------------------------------------------------------------------

const RAIL_CURRENCY: Record<string, string> = {
  MPESA: "KES",
  GCASH: "PHP",
  MTNMOMO: "GHS",
};

// ---------------------------------------------------------------------------
// Input schema
// ---------------------------------------------------------------------------

const remittanceSchema = z.object({
  recipientId: z.string().min(1),
  // Decimal string — e.g. "50.00". parseUnits handles arbitrary precision.
  amount: z
    .string()
    .regex(/^\d+(\.\d+)?$/, "amount must be a positive decimal string"),
  railType: z.enum(["MPESA", "GCASH", "MTNMOMO"]),
});

// ---------------------------------------------------------------------------
// POST /api/remittance
//
// Required env vars:
//   BACKEND_SIGNER_PRIVATE_KEY  — 0x-prefixed private key of the relayer wallet
//   MEZO_RPC_URL                — Mezo JSON-RPC endpoint (optional override)
//   NEXT_PUBLIC_ROUTER_ADDRESS  — RemittanceRouter proxy address (optional override)
// ---------------------------------------------------------------------------

export async function POST(request: NextRequest) {
  // ── Auth ────────────────────────────────────────────────────────────────
  const auth = await requireAuth(request);
  if (auth instanceof Response) return auth;
  const { userId } = auth;

  // ── Parse & validate body ───────────────────────────────────────────────
  let rawBody: unknown;
  try {
    rawBody = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = remittanceSchema.safeParse(rawBody);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request body", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { recipientId, amount, railType } = parsed.data;

  // ── Validate recipient exists ────────────────────────────────────────────
  const recipient = await prisma.recipient.findUnique({
    where: { id: recipientId },
  });
  if (!recipient) {
    return NextResponse.json(
      { error: "Recipient not found" },
      { status: 404 },
    );
  }

  // ── Validate MUSD balance ────────────────────────────────────────────────
  const vault = await prisma.vaultPosition.findUnique({
    where: { userId },
  });
  if (!vault) {
    return NextResponse.json(
      { error: "No vault position found. Deposit collateral first." },
      { status: 400 },
    );
  }

  // Use BigInt() instead of 'n' suffix — tsconfig target is ES2017.
  const amountWei = parseUnits(amount, 18);
  const feeWei = amountWei / BigInt(100); // 1% protocol fee
  const totalWei = amountWei + feeWei;

  // DB stores borrowedMUSD as a full-precision decimal string.
  const borrowedMUSDWei = parseUnits(vault.borrowedMUSD.toString(), 18);

  if (totalWei > borrowedMUSDWei) {
    return NextResponse.json(
      { error: "Insufficient MUSD balance" },
      { status: 400 },
    );
  }

  // ── Validate signer key ──────────────────────────────────────────────────
  const signerPrivateKey = process.env.BACKEND_SIGNER_PRIVATE_KEY;
  if (!signerPrivateKey) {
    return NextResponse.json(
      { error: "Server configuration error" },
      { status: 500 },
    );
  }

  // ── Call RemittanceRouter.sendRemittance on-chain ────────────────────────
  const rpcUrl =
    process.env.MEZO_RPC_URL ?? "https://rpc.test.mezo.org";

  const provider = new JsonRpcProvider(rpcUrl);
  const signer = new Wallet(signerPrivateKey, provider);
  const router = new Contract(ROUTER_ADDRESS, ROUTER_ABI, signer);

  let txHash: string;
  let blockNumber: number;

  try {
    const tx = await router.sendRemittance(
      recipient.phoneHash,
      amountWei,
      railType,
    );
    const receipt = await tx.wait(1);
    txHash = receipt.hash as string;
    blockNumber = receipt.blockNumber as number;
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.toLowerCase().includes("already registered") || msg.toLowerCase().includes("not registered")) {
      return NextResponse.json(
        { error: "Recipient is not registered on-chain" },
        { status: 422 },
      );
    }
    throw err;
  }

  // ── Persist Transaction ──────────────────────────────────────────────────
  // fiatAmount starts at 0 — updated by the off-ramp webhook once settled.
  const fiatCurrency = RAIL_CURRENCY[railType] ?? "USD";

  const transaction = await prisma.transaction.create({
    data: {
      senderId: userId,
      recipientId: recipient.id,
      txHash,
      musdAmount: amount,
      feeAmount: (Number(feeWei) / 1e18).toFixed(18),
      railType,
      status: "PENDING",
      fiatAmount: 0,
      fiatCurrency,
      blockNumber,
    },
  });

  return NextResponse.json(
    { txHash, transactionId: transaction.id },
    { status: 201 },
  );
}
