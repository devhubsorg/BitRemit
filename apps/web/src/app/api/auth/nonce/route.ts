import { randomBytes } from "crypto";
import { NextResponse } from "next/server";
import { saveNonce } from "@/lib/nonceStore";

/**
 * GET /api/auth/nonce
 *
 * Generates a one-time 16-byte hex nonce for SIWE authentication.
 * Stored in Redis with a 5-minute TTL to prevent reuse.
 *
 * Required env vars:
 *   UPSTASH_REDIS_URL  — Upstash Redis REST endpoint
 *   UPSTASH_REDIS_TOKEN — Upstash Redis REST token
 */
export async function GET(): Promise<NextResponse> {
  const nonce = randomBytes(16).toString("hex");

  try {
    // Store nonce with a 5-minute expiry; value "1" is a sentinel
    await saveNonce(`nonce:${nonce}`, 300);
  } catch {
    return NextResponse.json(
      { error: "Nonce service unavailable" },
      { status: 503 },
    );
  }

  return NextResponse.json({ nonce });
}
