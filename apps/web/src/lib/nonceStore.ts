import { redis } from "@/lib/redis";

export async function saveNonce(
  nonceKey: string,
  ttlSeconds = 300,
): Promise<boolean> {
  try {
    await redis.set(nonceKey, "1", { ex: ttlSeconds });
    return true;
  } catch {
    // Nonces are auth-critical and must be shared across route handlers.
    // In-memory fallback can create false negatives when /nonce and /verify
    // run in different module contexts or workers.
    throw new Error("Failed to persist nonce in Redis");
  }
}

export async function consumeNonce(nonceKey: string): Promise<boolean> {
  try {
    const stored = await redis.get(nonceKey);
    if (!stored) return false;
    await redis.del(nonceKey);
    return true;
  } catch {
    throw new Error("Failed to read nonce from Redis");
  }
}
