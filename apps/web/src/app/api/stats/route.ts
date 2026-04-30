import { NextResponse } from "next/server";
import { prisma } from "@bitremit/database";
import { requireAuth } from "web3";

// ---------------------------------------------------------------------------
// GET /api/stats
//
// Public endpoint — no authentication required.
// Returns high-level protocol statistics aggregated from the database.
// Response is cached by Next.js for 60 seconds (ISR revalidation).
// ---------------------------------------------------------------------------

export const dynamic = "force-dynamic";
export const revalidate = 60;

export async function GET(request: Request) {
  const auth = await requireAuth(request);
  const userId = auth instanceof Response ? null : auth.userId;

  const [sumResult, totalTransactions, activeSenders, userSumResult, distinctRecipients, completedTransfers] = await Promise.all([
    prisma.transaction.aggregate({
      _sum: { musdAmount: true },
      where: { status: "COMPLETED" },
    }),
    prisma.transaction.count({ where: { status: "COMPLETED" } }),
    prisma.user.count({
      where: { sentTxs: { some: { status: "COMPLETED" } } },
    }),
    userId
      ? prisma.transaction.aggregate({
          _sum: { musdAmount: true },
          where: { senderId: userId, status: "COMPLETED" },
        })
      : Promise.resolve({ _sum: { musdAmount: 0 } }),
    userId
      ? prisma.transaction.findMany({
          where: { senderId: userId, status: "COMPLETED" },
          distinct: ["recipientId"],
          select: { recipientId: true },
        })
      : Promise.resolve([]),
    userId
      ? prisma.transaction.findMany({
          where: {
            senderId: userId,
            status: "COMPLETED",
            completedAt: { not: null },
          },
          select: { createdAt: true, completedAt: true },
        })
      : Promise.resolve([]),
  ]);

  const avgTransferTimeSeconds = completedTransfers.length
    ? Math.round(
        completedTransfers.reduce((total, transaction) => {
          return total + Math.max(0, ((transaction.completedAt?.getTime() ?? transaction.createdAt.getTime()) - transaction.createdAt.getTime()) / 1000);
        }, 0) / completedTransfers.length,
      )
    : 0;

  return NextResponse.json({
    totalSentUSD: (sumResult._sum.musdAmount ?? 0).toString(),
    totalTransactions,
    averageFeePercent: "1",
    activeSenders,
    totalSentMUSD: (userSumResult._sum.musdAmount ?? 0).toString(),
    totalRecipients: distinctRecipients.length,
    avgTransferTimeSeconds,
  });
}
