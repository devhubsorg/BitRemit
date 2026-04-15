import { SignJWT } from "jose";
import { SiweMessage } from "siwe";
import { NextResponse } from "next/server";
import prisma from "@bitremit/database";
import { redis } from "@/lib/redis";
import { getJwtSecret } from "@/lib/jwt";

/**
 * POST /api/auth/verify
 *
 * Verifies a SIWE signature, issues a JWT, and upserts the user in the DB.
 *
 * Request body: { message: string; signature: string }
 *
 * Required env vars:
 *   UPSTASH_REDIS_REST_URL   — Upstash Redis REST endpoint
 *   UPSTASH_REDIS_REST_TOKEN — Upstash Redis REST token
 *   JWT_SECRET               — Secret used to sign session JWTs (≥ 32 chars)
 */
export async function POST(request: Request): Promise<NextResponse> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (
    typeof body !== "object" ||
    body === null ||
    typeof (body as Record<string, unknown>).message !== "string" ||
    typeof (body as Record<string, unknown>).signature !== "string"
  ) {
    return NextResponse.json(
      { error: "Body must contain { message: string, signature: string }" },
      { status: 400 },
    );
  }

  const { message, signature } = body as { message: string; signature: string };

  // Parse and verify the SIWE message + signature
  const siweMessage = new SiweMessage(message);

  let verifyResult: Awaited<ReturnType<SiweMessage["verify"]>>;
  try {
    verifyResult = await siweMessage.verify({ signature });
  } catch {
    return NextResponse.json(
      { error: "Signature verification failed" },
      { status: 401 },
    );
  }

  if (!verifyResult.success) {
    return NextResponse.json(
      { error: "Invalid SIWE signature" },
      { status: 401 },
    );
  }

  const { nonce, address } = siweMessage;

  // Confirm nonce exists in Redis (guards against replay attacks)
  const nonceKey = `nonce:${nonce}`;
  const storedNonce = await redis.get(nonceKey);
  if (!storedNonce) {
    return NextResponse.json(
      { error: "Nonce expired or already used" },
      { status: 401 },
    );
  }

  // Invalidate the nonce immediately (one-time use)
  await redis.del(nonceKey);

  // Find or create the user record
  const user = await prisma.user.upsert({
    where: { address },
    update: {},
    create: { address },
    select: { id: true, address: true },
  });

  // Issue a signed JWT (7-day expiry)
  const secret = getJwtSecret();
  const token = await new SignJWT({ address: user.address, sub: user.id })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);

  return NextResponse.json({ token, address: user.address });
}

export const dynamic = "force-dynamic";
