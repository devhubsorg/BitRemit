import { SignJWT } from "jose";
import { SiweMessage } from "siwe";
import { NextResponse } from "next/server";
import { createPublicClient, http, isAddress, type Address } from "viem";
import prisma from "@bitremit/database";
import { SESSION_COOKIE_NAME } from "web3";
import { getJwtSecret } from "@/lib/jwt";
import { consumeNonce } from "@/lib/nonceStore";

const SECP256K1_N = BigInt(
  "0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141",
);
const SECP256K1_HALF_N = SECP256K1_N / BigInt(2);
const publicClient = createPublicClient({
  transport: http(process.env.MEZO_RPC_URL ?? "https://rpc.test.mezo.org"),
});

function normalizeLowSSignature(signature: string): string {
  if (!/^0x[0-9a-fA-F]{130}$/.test(signature)) {
    return signature;
  }

  const hex = signature.slice(2);
  const rHex = hex.slice(0, 64);
  const sHex = hex.slice(64, 128);
  const vHex = hex.slice(128, 130);

  const s = BigInt(`0x${sHex}`);
  if (s <= SECP256K1_HALF_N) {
    return signature;
  }

  const normalizedS = SECP256K1_N - s;

  let v = Number.parseInt(vHex, 16);
  if (v === 27 || v === 28) {
    v = v === 27 ? 28 : 27;
  } else {
    v = v === 0 ? 1 : 0;
  }

  const normalizedSHex = normalizedS.toString(16).padStart(64, "0");
  const normalizedVHex = v.toString(16).padStart(2, "0");

  return `0x${rHex}${normalizedSHex}${normalizedVHex}`;
}

async function verifySignatureWithFallback(
  siweMessage: SiweMessage,
  message: string,
  signature: string,
): Promise<boolean> {
  const normalizedSignature = normalizeLowSSignature(signature);

  try {
    const verifyResult = await siweMessage.verify({ signature });
    if (verifyResult.success) {
      return true;
    }
  } catch {
    // Fall through to normalized/plain client-backed verification.
  }

  if (normalizedSignature !== signature) {
    try {
      const verifyResult = await siweMessage.verify({
        signature: normalizedSignature,
      });
      if (verifyResult.success) {
        return true;
      }
    } catch {
      // Fall through to client-backed verification.
    }
  }

  if (!isAddress(siweMessage.address)) {
    return false;
  }

  try {
    return await publicClient.verifyMessage({
      address: siweMessage.address as Address,
      message,
      signature: normalizedSignature as `0x${string}`,
    });
  } catch {
    return false;
  }
}

/**
 * POST /api/auth/verify
 *
 * Verifies a SIWE signature, issues a JWT, and upserts the user in the DB.
 *
 * Request body: { message: string; signature: string }
 *
 * Required env vars:
 *   UPSTASH_REDIS_URL   — Upstash Redis REST endpoint
 *   UPSTASH_REDIS_TOKEN — Upstash Redis REST token
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

  const signatureValid = await verifySignatureWithFallback(
    siweMessage,
    message,
    signature,
  );

  if (!signatureValid) {
    return NextResponse.json(
      { error: "Signature verification failed" },
      { status: 401 },
    );
  }

  const { nonce, address } = siweMessage;

  // Confirm nonce exists in nonce store (guards against replay attacks)
  const nonceKey = `nonce:${nonce}`;
  let nonceIsValid = false;
  try {
    nonceIsValid = await consumeNonce(nonceKey);
  } catch {
    return NextResponse.json(
      { error: "Nonce service unavailable" },
      { status: 503 },
    );
  }

  if (!nonceIsValid) {
    return NextResponse.json(
      { error: "Nonce expired or already used" },
      { status: 401 },
    );
  }

  try {
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

    const response = NextResponse.json({ token, address: user.address });
    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error("[auth/verify] Failed to issue session", error);
    return NextResponse.json(
      { error: "Failed to issue wallet session" },
      { status: 500 },
    );
  }
}

export const dynamic = "force-dynamic";
