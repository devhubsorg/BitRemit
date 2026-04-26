import { NextResponse } from "next/server";
import { prisma } from "@bitremit/database";

// ---------------------------------------------------------------------------
// GET /api/stats
//
// Public endpoint — no authentication required.
// Returns high-level protocol statistics aggregated from the database.
// Response is cached by Next.js for 60 seconds (ISR revalidation).
// ---------------------------------------------------------------------------

export const dynamic = "force-dynamic";
export const revalidate = 60;

export async function GET() {
  const [sumResult, totalTransactions, activeSenders] = await Promise.all([
    prisma.transaction.aggregate({
      _sum: { musdAmount: true },
      where: { status: "COMPLETED" },
    }),
    prisma.transaction.count({ where: { status: "COMPLETED" } }),
    prisma.user.count({
      where: { sentTxs: { some: { status: "COMPLETED" } } },
    }),
  ]);

  return NextResponse.json({
    totalSentUSD: (sumResult._sum.musdAmount ?? 0).toString(),
    totalTransactions,
    averageFeePercent: "1",
    activeSenders,
  });
}
