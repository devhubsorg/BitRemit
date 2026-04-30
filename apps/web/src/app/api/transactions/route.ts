import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAuth } from "web3";
import prisma from "@bitremit/database";

// ---------------------------------------------------------------------------
// Query-param schema
// All params are optional — defaults applied below.
// ---------------------------------------------------------------------------

const TxStatusValues = [
  "PENDING",
  "CONFIRMED_ONCHAIN",
  "OFFRAMP_PROCESSING",
  "COMPLETED",
  "FAILED",
] as const;

const RailTypeValues = ["MPESA", "GCASH", "MTNMOMO"] as const;

const querySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  status: z.enum(TxStatusValues).optional(),
  railType: z.enum(RailTypeValues).optional(),
  // ISO-8601 date strings — e.g. "2025-01-01" or "2025-01-01T00:00:00Z"
  startDate: z.string().datetime({ offset: true }).optional(),
  endDate: z.string().datetime({ offset: true }).optional(),
});

// ---------------------------------------------------------------------------
// GET /api/transactions
//
// Returns a paginated list of all transactions sent by the authenticated user,
// with the linked Recipient record joined.
//
// Query params:
//   page       — page number (default 1)
//   limit      — items per page (default 20, max 100)
//   status     — filter by TxStatus enum value
//   railType   — filter by PaymentRail enum value
//   startDate  — inclusive lower bound on createdAt (ISO-8601)
//   endDate    — exclusive upper bound on createdAt (ISO-8601)
//
// Response: { transactions, total, page, totalPages }
// ---------------------------------------------------------------------------

export async function GET(request: NextRequest) {
  // ── Auth ────────────────────────────────────────────────────────────────
  const auth = await requireAuth(request);
  if (auth instanceof Response) return auth;
  const { userId } = auth;

  // ── Parse query params ───────────────────────────────────────────────────
  const rawParams = Object.fromEntries(request.nextUrl.searchParams.entries());
  const parsed = querySchema.safeParse(rawParams);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid query parameters", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { page, limit, status, railType, startDate, endDate } = parsed.data;

  // ── Build where clause ───────────────────────────────────────────────────
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: Record<string, any> = {
    senderId: userId,
  };

  if (status) {
    where.status = status;
  }

  if (railType) {
    where.railType = railType;
  }

  if (startDate || endDate) {
    where.createdAt = {
      ...(startDate ? { gte: new Date(startDate) } : {}),
      ...(endDate ? { lt: new Date(endDate) } : {}),
    };
  }

  // ── Paginated query ──────────────────────────────────────────────────────
  const skip = (page - 1) * limit;

  const [transactions, total] = await Promise.all([
    prisma.transaction.findMany({
      where,
      include: {
        recipient: true,
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.transaction.count({ where }),
  ]);

  const totalPages = Math.ceil(total / limit);
  const normalizedTransactions = transactions.map((transaction) => ({
    id: transaction.id,
    recipient: {
      name: transaction.recipient.name,
      phoneNumber: transaction.recipient.phoneNumber,
      initials: transaction.recipient.name
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() ?? "")
        .join("") || "NA",
    },
    railType: transaction.railType,
    musdAmount: transaction.musdAmount.toString(),
    fiatAmount: transaction.fiatAmount.toString(),
    fiatCurrency: transaction.fiatCurrency,
    status: transaction.status,
    createdAt: transaction.createdAt.toISOString(),
    txHash: transaction.txHash ?? undefined,
  }));

  return NextResponse.json({
    transactions: normalizedTransactions,
    total,
    page,
    totalPages,
  });
}
