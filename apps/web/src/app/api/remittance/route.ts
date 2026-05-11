import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { parseUnits, formatUnits } from "viem";
import { requireAuth } from "web3/authMiddleware";
import prisma from "@bitremit/database";

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
  txHash: z
    .string()
    .regex(/^0x[a-fA-F0-9]{64}$/, "txHash must be a valid 32-byte hash"),
  // Decimal string — e.g. "50.00". parseUnits handles arbitrary precision.
  amount: z
    .string()
    .regex(/^\d+(\.\d+)?$/, "amount must be a positive decimal string"),
  railType: z.enum(["MPESA", "GCASH", "MTNMOMO"]),
});

// ---------------------------------------------------------------------------
// POST /api/remittance
//
// Required inputs from frontend:
//   txHash      — hash of the user-signed wallet tx
//   recipientId — local recipient id
//   amount      — mUSD amount as decimal string
//   railType    — payment rail enum
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

  const { recipientId, txHash, amount, railType } = parsed.data;

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

  // UI shows Mezo fee (1%) + off-ramp fee (1%) => total needed = amount * 1.02
  const amountWei = parseUnits(amount, 18);
  const feeWei = amountWei / BigInt(50); // 2% total fees
  const totalWei = amountWei + feeWei;

  // DB stores borrowedMUSD as a full-precision decimal string.
  const borrowedMUSDWei = parseUnits(vault.borrowedMUSD.toString(), 18);

  if (totalWei > borrowedMUSDWei) {
    return NextResponse.json(
      { error: "Insufficient MUSD balance" },
      { status: 400 },
    );
  }

  // Ensure recipient/payment rail stay in sync.
  if (recipient.paymentRail !== railType) {
    return NextResponse.json(
      { error: "Recipient payment rail mismatch" },
      { status: 400 },
    );
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
      feeAmount: formatUnits(feeWei, 18),
      railType,
      status: "PENDING",
      fiatAmount: 0,
      fiatCurrency,
      blockNumber: null,
    },
  });

  return NextResponse.json(
    { txHash, transactionId: transaction.id },
    { status: 201 },
  );
}
