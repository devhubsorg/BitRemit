"use client";

import dynamic from "next/dynamic";

/**
 * Client-side only wrapper for Web3Providers.
 *
 * Keep wallet/provider initialization out of SSR and module-evaluation paths.
 * Loading with ssr: false prevents provider modules from executing during
 * server rendering and static generation.
 */
const Web3Providers = dynamic(
  () => import("./providers").then((m) => m.Web3Providers),
  { ssr: false },
);

export default Web3Providers;
