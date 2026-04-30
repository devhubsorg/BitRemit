import { type NextRequest, NextResponse } from "next/server";
import { requireAuth } from "web3";
import prisma from "@bitremit/database";

// ---------------------------------------------------------------------------
// GET /api/remittance/[id]
//
// Returns a single Transaction (with Recipient included) belonging to the
// authenticated user. The frontend polls this route every 3 s on the success
// screen to reflect status transitions driven by the off-ramp webhook.
// ---------------------------------------------------------------------------

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  // ── Auth ────────────────────────────────────────────────────────────────
  const auth = await requireAuth(request);
  if (auth instanceof Response) return auth;
  const { userId } = auth;

  const { id } = await params;

  // ── Fetch transaction ────────────────────────────────────────────────────
  const transaction = await prisma.transaction.findUnique({
    where: { id },
    include: {
      recipient: true,
    },
  });

  if (!transaction) {
    return NextResponse.json(
      { error: "Transaction not found" },
      { status: 404 },
    );
  }

  // ── Ownership check ──────────────────────────────────────────────────────
  // Prevents users from polling other users' transaction details.
  if (transaction.senderId !== userId) {
    return NextResponse.json(
      { error: "Transaction not found" },
      { status: 404 },
    );
  }

  return NextResponse.json(transaction);
}
