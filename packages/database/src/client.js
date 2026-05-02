import path from "node:path";
import { fileURLToPath } from "node:url";
import { PrismaClient } from "../generated/client";
// Help Prisma find its engine on Windows + Turbopack
if (process.platform === "win32" && !process.env.PRISMA_QUERY_ENGINE_LIBRARY) {
    const dirname = path.dirname(fileURLToPath(import.meta.url));
    const enginePath = path.resolve(dirname, "../generated/client/query_engine-windows.dll.node");
    process.env.PRISMA_QUERY_ENGINE_LIBRARY = enginePath;
}
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
