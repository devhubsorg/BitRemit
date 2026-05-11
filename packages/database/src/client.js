import { PrismaClient } from "../prisma/client";
function createPrismaClient() {
    return new PrismaClient({
        log: process.env.NODE_ENV === "development"
            ? ["query", "warn", "error"]
            : ["warn", "error"],
    });
}
export const prisma = process.env.NODE_ENV === "production"
    ? createPrismaClient()
    : (globalThis.__prisma ??= createPrismaClient());
export default prisma;
