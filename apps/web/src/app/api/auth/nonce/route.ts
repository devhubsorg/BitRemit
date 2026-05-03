import { randomBytes } from "crypto";
import { NextResponse } from "next/server";
import { saveNonce } from "@/lib/nonceStore";

const NONCE_FALLBACK_COOKIE_NAME = "bitremit_auth_nonce_fallback";

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
    // Fallback mode for environments where Redis is temporarily unavailable.
    // This keeps auth unblocked while still allowing one-time nonce use in
    // /api/auth/verify via an HttpOnly cookie.
    const response = NextResponse.json({ nonce, fallback: true });
    response.cookies.set({
      name: NONCE_FALLBACK_COOKIE_NAME,
      value: nonce,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 300,
    });
    return response;
  }

  return NextResponse.json({ nonce });
}
