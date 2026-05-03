import { SignJWT } from "jose";
import { SiweMessage } from "siwe";
import { NextResponse } from "next/server";
import { createPublicClient, http, type Chain } from "viem";
import { verifySiweMessage } from "viem/siwe";
import { SignInWithWalletMessage } from "@mezo-org/sign-in-with-wallet";
import { predictOrangeKitAddress } from "@mezo-org/orangekit-smart-account";
import prisma from "@bitremit/database";
import { SESSION_COOKIE_NAME } from "web3";
import { getJwtSecret } from "@/lib/jwt";
import { consumeNonce } from "@/lib/nonceStore";

const NONCE_FALLBACK_COOKIE_NAME = "bitremit_auth_nonce_fallback";

const SECP256K1_N = BigInt(
  "0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141",
);
const SECP256K1_HALF_N = SECP256K1_N / BigInt(2);
const MEZO_TESTNET = {
  id: 31611,
  name: "Mezo Testnet",
  nativeCurrency: { name: "BTC", symbol: "BTC", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://rpc.test.mezo.org"] },
  },
  testnet: true,
} as const satisfies Chain;

const publicClient = createPublicClient({
  chain: MEZO_TESTNET,
  transport: http(process.env.MEZO_RPC_URL ?? "https://rpc.test.mezo.org"),
});

// ─── Bitcoin address → OrangeKit EVM safe address ────────────────────────────

/**
 * Derive the OrangeKit EVM smart-account address for a Bitcoin address.
 * We intentionally delegate to OrangeKit's own implementation to stay aligned
 * with wallet-side address derivation logic.
 */
function bitcoinAddressToEvmSafeAddress(btcAddress: string): `0x${string}` {
  return predictOrangeKitAddress(btcAddress, undefined) as `0x${string}`;
}

// ─── Bitcoin signature verification ──────────────────────────────────────────

async function verifyBitcoinSignature(
  request: Request,
  message: string,
  signature: string,
  nonce: string,
): Promise<{ ok: boolean; evmAddress?: string; reason?: string }> {
  let parsedMessage: SignInWithWalletMessage;
  try {
    parsedMessage = new SignInWithWalletMessage(message);
  } catch {
    return { ok: false, reason: "Invalid Bitcoin sign-in message" };
  }

  const requestHost = new URL(request.url).host;
  const configuredDomains = (process.env.SIWE_DOMAIN ?? "")
    .split(",")
    .map((d) => d.trim())
    .filter(Boolean);
  const allowedDomains = Array.from(
    new Set([requestHost, ...configuredDomains]),
  );

  for (const domain of allowedDomains) {
    try {
      const result = await parsedMessage.verify({ signature, domain, nonce });
      if (result.success) {
        const evmAddress = bitcoinAddressToEvmSafeAddress(
          parsedMessage.address,
        );
        return { ok: true, evmAddress };
      }
    } catch {
      // Try next domain
    }
  }

  return { ok: false, reason: "Bitcoin signature verification failed" };
}

// ─── Session issuance (shared by both paths) ─────────────────────────────────

async function issueSession(address: string): Promise<NextResponse> {
  const user = await prisma.user.upsert({
    where: { address },
    update: {},
    create: { address },
    select: { id: true, address: true },
  });

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
}

function readCookieValue(
  cookieHeader: string | null,
  cookieName: string,
): string | undefined {
  if (!cookieHeader) return undefined;
  const parts = cookieHeader.split(";");
  for (const part of parts) {
    const [rawName, ...rest] = part.trim().split("=");
    if (rawName !== cookieName) continue;
    return decodeURIComponent(rest.join("="));
  }
  return undefined;
}

async function consumeNonceWithFallback(
  request: Request,
  nonce: string,
): Promise<{ ok: boolean; usedCookieFallback: boolean; unavailable: boolean }> {
  const nonceKey = `nonce:${nonce}`;

  try {
    const nonceIsValid = await consumeNonce(nonceKey);
    if (nonceIsValid) {
      return { ok: true, usedCookieFallback: false, unavailable: false };
    }
  } catch {
    const fallbackCookieNonce = readCookieValue(
      request.headers.get("cookie"),
      NONCE_FALLBACK_COOKIE_NAME,
    );
    if (fallbackCookieNonce === nonce) {
      return { ok: true, usedCookieFallback: true, unavailable: false };
    }

    return { ok: false, usedCookieFallback: false, unavailable: true };
  }

  const fallbackCookieNonce = readCookieValue(
    request.headers.get("cookie"),
    NONCE_FALLBACK_COOKIE_NAME,
  );
  if (fallbackCookieNonce === nonce) {
    return { ok: true, usedCookieFallback: true, unavailable: false };
  }

  return { ok: false, usedCookieFallback: false, unavailable: false };
}

function clearFallbackNonceCookie(response: NextResponse): void {
  response.cookies.set({
    name: NONCE_FALLBACK_COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

// ─────────────────────────────────────────────────────────────────────────────

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
  request: Request,
  siweMessage: SiweMessage,
  message: string,
  signature: string,
): Promise<{ ok: boolean; reason?: string }> {
  const normalizedSignature = normalizeLowSSignature(signature);
  const requestHost = new URL(request.url).host;
  const configuredDomains = (process.env.SIWE_DOMAIN ?? "")
    .split(",")
    .map((domain) => domain.trim())
    .filter(Boolean);
  const allowedDomains = Array.from(
    new Set([requestHost, ...configuredDomains]),
  );

  for (const candidateSignature of [signature, normalizedSignature]) {
    for (const domain of allowedDomains) {
      try {
        const verified = await verifySiweMessage(publicClient, {
          domain,
          message,
          nonce: siweMessage.nonce,
          signature: candidateSignature as `0x${string}`,
          time: new Date(),
        });

        if (verified) {
          return { ok: true };
        }
      } catch {
        // Try the next domain/signature combination.
      }
    }
  }

  return { ok: false, reason: "Signature verification failed" };
}

/**
 * POST /api/auth/verify
 *
 * Verifies a SIWE (EVM) or SIWW (Bitcoin) signature, issues a JWT, and
 * upserts the user in the DB.
 *
 * Request body: { message: string; signature: string }
 *
 * Required env vars:
 *   UPSTASH_REDIS_URL   — Upstash Redis REST endpoint
 *   UPSTASH_REDIS_TOKEN — Upstash Redis REST token
 *   JWT_SECRET          — Secret used to sign session JWTs (≥ 32 chars)
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

  // ── Bitcoin SIWW path ──────────────────────────────────────────────────────
  if (message.includes("wants you to sign in with your Bitcoin account:")) {
    let parsedMessage: SignInWithWalletMessage;
    try {
      parsedMessage = new SignInWithWalletMessage(message);
    } catch {
      return NextResponse.json(
        { error: "Invalid Bitcoin sign-in message" },
        { status: 400 },
      );
    }

    // Verify signature before consuming the nonce
    const verifyResult = await verifyBitcoinSignature(
      request,
      message,
      signature,
      parsedMessage.nonce,
    );
    if (!verifyResult.ok || !verifyResult.evmAddress) {
      return NextResponse.json(
        { error: verifyResult.reason ?? "Signature verification failed" },
        { status: 401 },
      );
    }

    const nonceResult = await consumeNonceWithFallback(
      request,
      parsedMessage.nonce,
    );

    if (nonceResult.unavailable) {
      return NextResponse.json(
        { error: "Nonce service unavailable" },
        { status: 503 },
      );
    }

    if (!nonceResult.ok) {
      return NextResponse.json(
        { error: "Nonce expired or already used" },
        { status: 401 },
      );
    }

    try {
      const response = await issueSession(verifyResult.evmAddress);
      if (nonceResult.usedCookieFallback) {
        clearFallbackNonceCookie(response);
      }
      return response;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      console.error(
        "[auth/verify] Failed to issue Bitcoin wallet session:",
        error,
      );
      return NextResponse.json(
        { error: "Failed to issue wallet session", detail: errorMsg },
        { status: 500 },
      );
    }
  }

  // ── EVM SIWE path ──────────────────────────────────────────────────────────
  let siweMessage: SiweMessage;
  try {
    siweMessage = new SiweMessage(message);
  } catch {
    return NextResponse.json(
      { error: "Invalid SIWE message" },
      { status: 400 },
    );
  }

  const signatureResult = await verifySignatureWithFallback(
    request,
    siweMessage,
    message,
    signature,
  );

  if (!signatureResult.ok) {
    return NextResponse.json(
      { error: signatureResult.reason ?? "Signature verification failed" },
      { status: 401 },
    );
  }

  const { nonce, address } = siweMessage;

  const nonceResult = await consumeNonceWithFallback(request, nonce);

  if (nonceResult.unavailable) {
    return NextResponse.json(
      { error: "Nonce service unavailable" },
      { status: 503 },
    );
  }

  if (!nonceResult.ok) {
    return NextResponse.json(
      { error: "Nonce expired or already used" },
      { status: 401 },
    );
  }

  try {
    const response = await issueSession(address);
    if (nonceResult.usedCookieFallback) {
      clearFallbackNonceCookie(response);
    }
    return response;
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error("[auth/verify] Failed to issue session:", error);
    return NextResponse.json(
      { error: "Failed to issue wallet session", detail: errorMsg },
      { status: 500 },
    );
  }
}

export const dynamic = "force-dynamic";
