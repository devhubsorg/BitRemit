import { defineConfig, env } from "prisma/config";
import * as dotenv from "dotenv";
import path from "path";

// Prisma won't auto-load .env when a config file is present — load it manually.
// Walk up to the monorepo root to find the .env file.
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

export default defineConfig({
  schema: "./prisma/schema.prisma",
  datasource: {
    url: env("DATABASE_URL"),
    ...(process.env.DATABASE_URL_DIRECT
      ? { directUrl: env("DATABASE_URL_DIRECT") }
      : {}),
  },
});
