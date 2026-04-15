"use client";

import dynamic from "next/dynamic";

/**
 * Client-side only wrapper for Web3Providers.
 *
 * The @mezo-org/passport SDK (via @mezo-org/mezo-clay) bundles a pre-React 19
 * CJS jsx-runtime that accesses React.__SECRET_INTERNALS (removed in React 19).
 * Loading with ssr: false prevents this code from running during SSR / static
 * page generation.
 */
const Web3Providers = dynamic(
  () => import("./providers").then((m) => m.Web3Providers),
  { ssr: false },
);

export default Web3Providers;
