import { NextResponse } from "next/server";
import { requireAuth } from "web3";

/**
 * GET /api/auth/session
 *
 * Validates the current session from either Bearer JWT or session cookie.
 * Returns the authenticated wallet address on success.
 */
export async function GET(request: Request): Promise<Response> {
  const auth = await requireAuth(request);
  if (auth instanceof Response) return auth;

  return NextResponse.json({ address: auth.address, userId: auth.userId });
}
