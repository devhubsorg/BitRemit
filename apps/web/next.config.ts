import fs from "node:fs";
import { createRequire } from "node:module";
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

// Force a single React runtime across app code and transpiled third-party SDKs.
// Use require.resolve so paths remain valid with pnpm's node_modules layout.
const require = createRequire(import.meta.url);
const reactEntry = require.resolve("react");
const reactDomEntry = require.resolve("react-dom");
const reactJsxRuntime = require.resolve("react/jsx-runtime");
const reactJsxDevRuntime = require.resolve("react/jsx-dev-runtime");
const reactRoot = path.dirname(reactEntry);
const reactDomRoot = path.dirname(reactDomEntry);

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

      // WalletConnect's logger imports `pino` even for browser bundles.
      // Alias to a local stub to avoid bundling Node logger internals in web.
      pino: "./src/lib/pino-browser-stub.ts",
      // MetaMask SDK imports this React Native package in its browser bundle.
      "@react-native-async-storage/async-storage": "./src/lib/empty-stub.ts",

      // Ensure all bundles (including transpiled SDK internals) use one React.
      react: reactRoot,
      "react-dom": reactDomRoot,
      "react/jsx-runtime": reactJsxRuntime,
      "react/jsx-dev-runtime": reactJsxDevRuntime,
    },
  },

  // ---------- Webpack (CI / next build without Turbopack) ----------
  webpack: (config, { isServer }) => {
    config.resolve = config.resolve ?? {};
    config.resolve.alias = {
      ...(config.resolve.alias ?? {}),
      "@mezo-org/orangekit-smart-account/src/lib/utils/chains":
        "@mezo-org/orangekit-smart-account/dist/src/lib/utils/chains.js",
      // Match the exact bare import used by @walletconnect/logger.
      "pino$": path.resolve(process.cwd(), "src/lib/pino-browser-stub.ts"),
      pino: path.resolve(process.cwd(), "src/lib/pino-browser-stub.ts"),
      // MetaMask SDK imports this React Native package in its browser bundle.
      "@react-native-async-storage/async-storage": path.resolve(process.cwd(), "src/lib/empty-stub.ts"),
    };

    // Only force React singleton in browser bundles; server aliases can break
    // Next internal React cache wiring during data collection.
    if (!isServer) {
      config.resolve.alias = {
        ...(config.resolve.alias ?? {}),
        react: reactRoot,
        "react-dom": reactDomRoot,
        "react/jsx-runtime": reactJsxRuntime,
        "react/jsx-dev-runtime": reactJsxDevRuntime,
      };
    }

    return config;
  },
};

export default nextConfig;
