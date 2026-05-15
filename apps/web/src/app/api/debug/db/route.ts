import { NextResponse } from "next/server";
import prisma from "@bitremit/database";

// Temporary diagnostic endpoint — remove before shipping to production
export async function GET() {
  const checks: Record<string, unknown> = {
    DATABASE_URL: process.env.DATABASE_URL
      ? `set (starts with: ${process.env.DATABASE_URL.slice(0, 30)}...)`
      : "MISSING",
    DATABASE_URL_DIRECT: process.env.DATABASE_URL_DIRECT
      ? `set (starts with: ${process.env.DATABASE_URL_DIRECT.slice(0, 30)}...)`
      : "MISSING",
    JWT_SECRET: process.env.JWT_SECRET ? "set" : "MISSING",
    UPSTASH_REDIS_URL: process.env.UPSTASH_REDIS_URL ? "set" : "MISSING",
    UPSTASH_REDIS_TOKEN: process.env.UPSTASH_REDIS_TOKEN ? "set" : "MISSING",
    SIWE_DOMAIN: process.env.SIWE_DOMAIN ?? "MISSING",
    NODE_ENV: process.env.NODE_ENV,
  };

  let dbStatus: string;
  let dbError: string | null = null;

  try {
    await prisma.$queryRaw`SELECT 1`;
    dbStatus = "connected";
  } catch (err) {
    dbStatus = "error";
    dbError = err instanceof Error ? err.message : String(err);
  }

  return NextResponse.json({
    checks,
    db: { status: dbStatus, error: dbError },
  });
}
