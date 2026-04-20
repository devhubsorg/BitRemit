import { type NextRequest, NextResponse } from "next/server";
import { syncOnce } from "@bitremit/blockchain";

// ---------------------------------------------------------------------------
// GET  /api/indexer/sync  — called by Vercel Cron (every minute)
// POST /api/indexer/sync  — manual trigger (e.g. admin scripts)
//
// Security:
//   GET:  Vercel automatically injects  Authorization: Bearer <CRON_SECRET>
//         on every cron invocation. Requests without it are rejected with 401.
//   POST: Caller must provide  X-Internal-Secret: <WORKER_API_SECRET>
//
// Response:  { blocksProcessed: number; eventsFound: number }
// ---------------------------------------------------------------------------

function verifyCron(req: NextRequest): boolean {
  const auth = req.headers.get("authorization");
  const secret = process.env.CRON_SECRET;
  return !!secret && auth === `Bearer ${secret}`;
}

function verifyInternal(req: NextRequest): boolean {
  const header = req.headers.get("x-internal-secret");
  const secret = process.env.WORKER_API_SECRET;
  return !!secret && header === secret;
}

export async function GET(req: NextRequest) {
  if (!verifyCron(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const result = await syncOnce();
  return NextResponse.json(result);
}

export async function POST(req: NextRequest) {
  if (!verifyInternal(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const result = await syncOnce();
  return NextResponse.json(result);
}
