import { randomBytes } from "crypto";
import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";

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

  // Store nonce with a 5-minute expiry; value "1" is a sentinel
  await redis.set(`nonce:${nonce}`, "1", { ex: 300 });

  return NextResponse.json({ nonce });
}
