import { Redis } from "@upstash/redis";

/**
 * Singleton Upstash Redis client.
 *
 * Required env vars:
 *   UPSTASH_REDIS_REST_URL   — Upstash Redis REST endpoint
 *   UPSTASH_REDIS_REST_TOKEN — Upstash Redis REST token
 */
export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});
