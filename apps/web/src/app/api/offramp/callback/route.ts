import { type NextRequest, NextResponse } from "next/server";
import prisma from "@bitremit/database";

// ---------------------------------------------------------------------------
// POST /api/offramp/callback
//
// Receives settlement notifications from the three off-ramp rails after an
// outbound payment finishes processing:
//
//   • GCash   — body.rail === 'gcash'            → railReference = body.paymentId
//   • MTN     — body.financialTransactionId      → railReference = body.financialTransactionId
//   • M-Pesa  — body.CheckoutRequestID           → railReference = body.CheckoutRequestID
//
// Security:
//   Every inbound request must carry the header:
//     X-Callback-Secret: <value of OFFRAMP_CALLBACK_SECRET>
//   Requests that omit or mismatch the header are rejected with 401.
//
// Idempotency:
//   Transactions already in a terminal state (COMPLETED / FAILED) are silently
//   skipped so duplicate callbacks are harmless.
//
// Response:
//   Always 200 — mock servers (and real Daraja / GCash webhooks) treat any
//   non-200 as a delivery failure and may retry.  Return 200 unconditionally
//   after validating the secret, even for unknown or already-settled refs.
// ---------------------------------------------------------------------------

export async function POST(request: NextRequest) {
  // ── Secret verification ──────────────────────────────────────────────────
  const expectedSecret = process.env.OFFRAMP_CALLBACK_SECRET ?? "";
  const incomingSecret = request.headers.get("x-callback-secret");

  if (!expectedSecret || incomingSecret !== expectedSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // ── Parse body ───────────────────────────────────────────────────────────
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  // ── Detect rail ──────────────────────────────────────────────────────────
  // Prefer explicit `rail` field; fall back to characteristic field presence.
  let rail = typeof body.rail === "string" ? body.rail.toLowerCase() : null;

  if (!rail) {
    if ("financialTransactionId" in body) rail = "mtnmomo";
    else if ("CheckoutRequestID" in body) rail = "mpesa";
    else if ("paymentId" in body) rail = "gcash";
  }

  // ── Extract railReference and success flag ────────────────────────────────
  let railReference: string | null = null;
  let isSuccess: boolean;

  switch (rail) {
    case "gcash":
      railReference =
        typeof body.paymentId === "string" ? body.paymentId : null;
      isSuccess = body.status === "SUCCESS";
      break;

    case "mtnmomo":
      railReference =
        typeof body.financialTransactionId === "string"
          ? body.financialTransactionId
          : null;
      isSuccess = body.status === "SUCCESSFUL";
      break;

    case "mpesa":
      railReference =
        typeof body.CheckoutRequestID === "string"
          ? body.CheckoutRequestID
          : null;
      isSuccess = body.status === "SUCCESS" || body.ResponseCode === "0";
      break;

    default:
      console.warn(
        "[offramp/callback] Unrecognised rail in payload — returning 200 to suppress retries.",
        { body },
      );
      return NextResponse.json({ received: true, warning: "unknown_rail" });
  }

  if (!railReference) {
    console.warn(
      "[offramp/callback] Could not extract railReference from payload.",
      { rail, body },
    );
    return NextResponse.json({
      received: true,
      warning: "missing_rail_reference",
    });
  }

  // ── Update transaction ────────────────────────────────────────────────────
  // Only transition from non-terminal states (idempotent guard).
  const newStatus = isSuccess ? "COMPLETED" : "FAILED";

  const { count } = await prisma.transaction.updateMany({
    where: {
      railReference,
      status: { notIn: ["COMPLETED", "FAILED"] },
    },
    data: {
      status: newStatus,
      completedAt: new Date(),
    },
  });

  if (count === 0) {
    console.info(
      `[offramp/callback] No pending transaction found for railReference=${railReference} — already settled or unknown ref.`,
    );
  } else {
    console.info(
      `[offramp/callback] Transaction railReference=${railReference} → ${newStatus}`,
    );
  }

  // Always 200 — mock servers don't retry on success responses
  return NextResponse.json({ received: true });
}
