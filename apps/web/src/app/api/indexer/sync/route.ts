import { type NextRequest, NextResponse } from "next/server";
import { syncOnce } from "@bitremit/blockchain";

// ---------------------------------------------------------------------------
// POST /api/indexer/sync
//
// Internal — requires the X-Internal-Secret header matching WORKER_API_SECRET.
// Triggers a single indexer polling cycle synchronously and returns metrics.
// Called by the Railway blockchain-worker service on demand.
//
// Request headers:
//   X-Internal-Secret: <value of WORKER_API_SECRET>
//
// Response:
//   { blocksProcessed: number; eventsFound: number }
// ---------------------------------------------------------------------------

export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-internal-secret");
  const expected = process.env.WORKER_API_SECRET;

  if (!expected || !secret || secret !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await syncOnce();
  return NextResponse.json(result);
}
