import type { NextConfig } from "next";

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
