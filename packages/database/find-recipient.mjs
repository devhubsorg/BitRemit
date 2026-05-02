import { readFileSync } from "fs";
import { resolve } from "path";
// Load DATABASE_URL from root .env.local
const envPath = resolve("../../.env.local");
for (const line of readFileSync(envPath, "utf8").split("\n")) {
  const m = line.match(/^([A-Z_]+)\s*=\s*"?([^"\n]+)"?/);
  if (m) process.env[m[1]] = m[2];
}
import { PrismaClient } from "@prisma/client";
const p = new PrismaClient();

const users = await p.user.findMany({
  orderBy: { createdAt: "desc" },
  take: 5,
  include: { vaultPosition: true },
});
console.log("=== USERS + VAULT POSITIONS (latest 5) ===");
console.log(JSON.stringify(users, null, 2));

await p.$disconnect();
