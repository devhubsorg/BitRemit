import { jwtVerify } from "jose";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

/**
 * JWT payload shape issued by POST /api/auth/verify.
 */
export interface AuthPayload {
  address: string;
  userId: string;
}

/**
 * Validates the Bearer JWT on an incoming Next.js request.
 *
 * Returns the decoded {@link AuthPayload} when the token is valid,
 * or a 401 {@link NextResponse} when it is missing / expired / invalid.
 *
 * Usage in a Route Handler or middleware:
 * ```ts
 * const result = await requireAuth(request);
 * if (result instanceof NextResponse) return result; // 401
 * const { address, userId } = result;
 * ```
 *
 * Required env vars:
 *   JWT_SECRET — The same secret used when signing the token
 */
export async function requireAuth(
  request: NextRequest,
): Promise<AuthPayload | NextResponse> {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = authHeader.slice(7); // strip "Bearer "

  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    // Misconfiguration — treat as internal error rather than leaking details
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const secret = new TextEncoder().encode(jwtSecret);
    const { payload } = await jwtVerify(token, secret);

    const address = payload["address"];
    const sub = payload["sub"];

    if (typeof address !== "string" || !address || typeof sub !== "string" || !sub) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return { address, userId: sub };
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
