import { TextEncoder } from "util";

/**
 * Returns the JWT signing secret as a CryptoKey-compatible Uint8Array.
 * Throws at runtime if JWT_SECRET is not defined, so misconfiguration
 * surfaces immediately rather than silently producing insecure tokens.
 *
 * Required env vars:
 *   JWT_SECRET — A random string of at least 32 characters
 */
export function getJwtSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET environment variable is not set");
  }
  return new TextEncoder().encode(secret);
}
