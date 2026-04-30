import { redis } from "@/lib/redis";

const memoryNonces = new Map<string, number>();

function cleanupExpiredMemoryNonces() {
  const now = Date.now();
  for (const [nonceKey, expiresAt] of memoryNonces.entries()) {
    if (expiresAt <= now) {
      memoryNonces.delete(nonceKey);
    }
  }
}

function allowMemoryFallback(): boolean {
  return process.env.NODE_ENV !== "production";
}

export async function saveNonce(nonceKey: string, ttlSeconds = 300): Promise<boolean> {
  try {
    await redis.set(nonceKey, "1", { ex: ttlSeconds });
    return true;
  } catch {
    if (!allowMemoryFallback()) {
      throw new Error("Failed to persist nonce in Redis");
    }

    cleanupExpiredMemoryNonces();
    memoryNonces.set(nonceKey, Date.now() + ttlSeconds * 1000);
    return false;
  }
}

export async function consumeNonce(nonceKey: string): Promise<boolean> {
  try {
    const stored = await redis.get(nonceKey);
    if (!stored) return false;
    await redis.del(nonceKey);
    return true;
  } catch {
    if (!allowMemoryFallback()) {
      throw new Error("Failed to read nonce from Redis");
    }

    cleanupExpiredMemoryNonces();
    const exists = memoryNonces.has(nonceKey);
    if (exists) {
      memoryNonces.delete(nonceKey);
    }
    return exists;
  }
}
