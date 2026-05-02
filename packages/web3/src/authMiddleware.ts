import { jwtVerify } from "jose";

export const SESSION_COOKIE_NAME = "bitremit_session";

type RequestLike = {
  headers: {
    get(name: string): string | null;
  };
};

function getCookieValue(cookieHeader: string | null, name: string): string | null {
  if (!cookieHeader) return null;

  const cookies = cookieHeader.split(";");
  for (const cookie of cookies) {
    const [rawName, ...rawValue] = cookie.trim().split("=");
    if (rawName === name) {
      return decodeURIComponent(rawValue.join("="));
    }
  }

  return null;
}

function getRequestToken(request: RequestLike): string | null {
  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.slice(7);
  }

  return getCookieValue(request.headers.get("cookie"), SESSION_COOKIE_NAME);
}

export function unauthorizedResponse(): Response {
  return new Response(JSON.stringify({ error: "Unauthorized" }), {
    status: 401,
    headers: {
      "content-type": "application/json",
    },
  });
}

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
 * or a 401 {@link Response} when it is missing / expired / invalid.
 *
 * Usage in a Route Handler or middleware:
 * ```ts
 * const result = await requireAuth(request);
 * if (result instanceof Response) return result; // 401
 * const { address, userId } = result;
 * ```
 *
 * Required env vars:
 *   JWT_SECRET — The same secret used when signing the token
 */
export async function verifyToken(token: string): Promise<AuthPayload | Response> {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    console.error("[ERROR] JWT_SECRET is missing in environment");
    return unauthorizedResponse();
  }

  try {
    const secret = new TextEncoder().encode(jwtSecret);
    const { payload } = await jwtVerify(token, secret);

    const address = payload["address"];
    const sub = payload["sub"];

    if (typeof address !== "string" || !address || typeof sub !== "string" || !sub) {
      console.error("[ERROR] JWT payload missing required fields", { address, sub });
      return unauthorizedResponse();
    }

    return { address, userId: sub };
  } catch (err) {
    console.error("[ERROR] JWT verification failed:", err instanceof Error ? err.message : err);
    return unauthorizedResponse();
  }
}

export async function requireAuth(
  request: RequestLike,
): Promise<AuthPayload | Response> {
  const token = getRequestToken(request);
  if (!token) {
    return unauthorizedResponse();
  }
  return verifyToken(token);
}
