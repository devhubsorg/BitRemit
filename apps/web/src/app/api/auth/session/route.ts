import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken, SESSION_COOKIE_NAME, unauthorizedResponse } from "web3/authMiddleware";

export async function GET(request: Request): Promise<Response> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  
  console.log("[DEBUG] Session Token found:", !!token);
  
  if (!token) {
    console.log("[DEBUG] No token in cookies");
    return unauthorizedResponse();
  }

  const auth = await verifyToken(token);
  if (auth instanceof Response) {
    console.log("[DEBUG] verifyToken failed (invalid signature, expired, or secret mismatch)");
    return auth;
  }

  console.log("[DEBUG] Session verified for:", auth.address);
  return NextResponse.json({ address: auth.address, userId: auth.userId });
}
