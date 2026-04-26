// layout.tsx is intentionally a SERVER component.
// Web3Providers is loaded via a thin "use client" wrapper with next/dynamic
// (ssr: false) so the wallet SDK — which bundles a pre-React 19 CJS
// jsx-runtime — never runs during server-side rendering / static generation.

import type { Metadata } from "next";
import type { ReactNode } from "react";
import Web3Providers from "./Web3ProvidersDynamic";

// RainbowKit styles must be imported once, at the root. Importing inside a
// server component is fine — Next.js bundles it as global CSS.
import "@rainbow-me/rainbowkit/styles.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "BitRemit — Bitcoin remittances for Africa and Southeast Asia",
  description:
    "Lock BTC, borrow MUSD at 1%, send money home via M-Pesa, GCash, or MTN MoMo.",
  openGraph: {
    type: "website",
    title: "BitRemit",
    description:
      "Lock BTC, borrow MUSD at 1%, send money home via M-Pesa, GCash, or MTN MoMo.",
    url: process.env.NEXT_PUBLIC_APP_URL ?? "https://bitremit.vercel.app",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/*
       * suppressHydrationWarning on <body> prevents false hydration errors
       * from browser extensions (e.g. ColorZilla adds cz-shortcut-listen)
       * that mutate <body> attributes before React hydrates.
       */}
      <body suppressHydrationWarning>
        <Web3Providers>{children}</Web3Providers>
      </body>
    </html>
  );
}
