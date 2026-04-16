import fs from "node:fs";
import path from "node:path";
import type { NextConfig } from "next";

// ---------------------------------------------------------------------------
// Load the monorepo-root .env.local so every package shares one env file.
// Next.js auto-loads apps/web/.env.local; this extends that to the root file.
// Vars already set in the environment (system or apps/web/.env.local) win.
// ---------------------------------------------------------------------------
const rootEnvPath = path.resolve(process.cwd(), "../../.env.local");
if (fs.existsSync(rootEnvPath)) {
  const lines = fs.readFileSync(rootEnvPath, "utf8").split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx < 0) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    let val = trimmed.slice(eqIdx + 1).trim();
    if (/^["']/.test(val)) val = val.slice(1, -1);
    if (!(key in process.env)) process.env[key] = val;
  }
}

const nextConfig: NextConfig = {
  transpilePackages: [
    "@mezo-org/orangekit",
    "@mezo-org/orangekit-smart-account",
    "@mezo-org/orangekit-contracts",
    "@mezo-org/passport",
  ],

  // ---------- Turbopack (next dev & next build --turbopack) ----------
  turbopack: {
    resolveAlias: {
      // orangekit's wallet/index.js imports from the *source* .ts path which
      // Turbopack cannot process inside node_modules.  Redirect to the
      // compiled .js that ships in the same package (it only uses viem, so
      // the problematic orangekit-contracts .ts file is never pulled in).
      "@mezo-org/orangekit-smart-account/src/lib/utils/chains":
        "@mezo-org/orangekit-smart-account/dist/src/lib/utils/chains.js",
    },
  },

  // ---------- Webpack (CI / next build without Turbopack) ----------
  webpack: (config) => {
    config.resolve = config.resolve ?? {};
    config.resolve.alias = {
      ...(config.resolve.alias ?? {}),
      "@mezo-org/orangekit-smart-account/src/lib/utils/chains":
        "@mezo-org/orangekit-smart-account/dist/src/lib/utils/chains.js",
    };
    return config;
  },
};

export default nextConfig;
