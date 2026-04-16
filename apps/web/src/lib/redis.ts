import { Redis } from "@upstash/redis";

/**
 * Singleton Upstash Redis client (lazy-initialised).
 *
 * Required env vars:
 *   UPSTASH_REDIS_REST_URL   — Upstash Redis REST endpoint
 *   UPSTASH_REDIS_REST_TOKEN — Upstash Redis REST token
 */
let _redis: Redis | undefined;

export function getRedis(): Redis {
  if (!_redis) {
    _redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    });
  }
  return _redis;
}

/** @deprecated Use `getRedis()` instead — kept for backwards compat. */
export const redis = new Proxy({} as Redis, {
  get(_target, prop, receiver) {
    return Reflect.get(getRedis(), prop, receiver);
  },
});
