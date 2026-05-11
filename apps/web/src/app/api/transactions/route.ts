import { type NextRequest, NextResponse } from "next/server";
import { requireAuth } from "web3/authMiddleware";
import prisma from "@bitremit/database";

export interface TransactionsQuery {
  page: number;
  limit: number;
  status: string;
  railType: string;
  startDate: string;
  endDate: string;
  searchQuery: string;
}

export function parseTransactionsQuery(searchParams: URLSearchParams): TransactionsQuery {
  return {
    page: Math.max(1, parseInt(searchParams.get("page") ?? "1")),
    limit: Math.min(100, parseInt(searchParams.get("limit") ?? "10")),
    status: searchParams.get("status") ?? "",
    railType: searchParams.get("railType") ?? "",
    startDate: searchParams.get("startDate") ?? "",
    endDate: searchParams.get("endDate") ?? "",
    searchQuery: searchParams.get("searchQuery") ?? "",
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function buildTransactionsWhere(userId: string, query: TransactionsQuery): Record<string, any> {
  const { status, railType, startDate, endDate, searchQuery } = query;
  return {
    senderId: userId,
    ...(status && status !== "ALL" ? { status } : {}),
    ...(railType && railType !== "ALL" ? { railType } : {}),
    ...(startDate || endDate
      ? {
          createdAt: {
            ...(startDate ? { gte: new Date(startDate) } : {}),
            ...(endDate
              ? { lte: new Date(new Date(endDate).setHours(23, 59, 59)) }
              : {}),
          },
        }
      : {}),
    ...(searchQuery
      ? {
          recipient: {
            name: { contains: searchQuery, mode: "insensitive" },
          },
        }
      : {}),
  };
}

export function buildRecipientInitials(name: string): string {
  return name
    .split(" ")
    .map((p: string) => p[0])
    .slice(0, 2)
    .join("");
}

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    if (auth instanceof Response) return auth;
    const { userId } = auth;

    const { searchParams } = new URL(request.url);

    const query = parseTransactionsQuery(searchParams);
    const { page, limit } = query;
    const where = buildTransactionsWhere(userId, query);

    const skip = (page - 1) * limit;

    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
        include: {
          recipient: { select: { name: true, phoneNumber: true } },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.transaction.count({ where }),
    ]);

    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);

    const [monthlyTxs, railCounts] = await Promise.all([
      prisma.transaction.aggregate({
        where: { senderId: userId, createdAt: { gte: monthStart } },
        _sum: { musdAmount: true, feeAmount: true },
      }),
      prisma.transaction.groupBy({
        by: ["railType"],
        where: { senderId: userId, createdAt: { gte: monthStart } },
        _count: { railType: true },
        orderBy: { _count: { railType: "desc" } },
        take: 1,
      }),
    ]);

    const shaped = transactions.map((tx) => ({
      id: tx.id,
      createdAt: tx.createdAt.toISOString(),
      confirmedAt: null,
      completedAt: tx.completedAt?.toISOString() ?? null,
      recipient: {
        name: tx.recipient.name,
        phoneNumber: tx.recipient.phoneNumber,
        initials: buildRecipientInitials(tx.recipient.name),
      },
      railType: tx.railType,
      musdAmount: tx.musdAmount.toString(),
      fiatAmount: tx.fiatAmount.toString(),
      fiatCurrency: tx.fiatCurrency,
      status: tx.status,
      txHash: tx.txHash ?? null,
      blockNumber: tx.blockNumber ?? null,
      railReference: tx.railReference ?? null,
      feeAmount: tx.feeAmount.toString(),
    }));

    return NextResponse.json({
      transactions: shaped,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      summary: {
        totalSentMUSD: monthlyTxs._sum.musdAmount?.toString() ?? "0",
        totalFeesMUSD: monthlyTxs._sum.feeAmount?.toString() ?? "0",
        mostUsedRail: railCounts[0]?.railType ?? null,
      },
    });
  } catch (err) {
    console.error("[GET /api/transactions] error:", err);
    return NextResponse.json(
      { error: "Failed to fetch transactions", transactions: [], total: 0, page: 1, totalPages: 0 },
      { status: 500 }
    );
  }
}
