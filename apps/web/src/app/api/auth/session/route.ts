import { jwtVerify } from "jose";
import { NextResponse } from "next/server";
import { getJwtSecret } from "@/lib/jwt";

/**
 * GET /api/auth/session
 *
 * Validates the Bearer JWT from the Authorization header.
 * Returns the authenticated wallet address on success.
 *
 * Required env vars:
 *   JWT_SECRET — Secret used to verify session JWTs
 */
export async function GET(request: Request): Promise<NextResponse> {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = authHeader.slice(7); // strip "Bearer "

  try {
    const secret = getJwtSecret();
    const { payload } = await jwtVerify(token, secret);

    const address = payload["address"];
    if (typeof address !== "string" || !address) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({ address });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
