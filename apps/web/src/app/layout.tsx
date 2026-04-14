// layout.tsx is intentionally a SERVER component.
// It imports Web3Providers (a client component) which creates the
// "use client" boundary — this is the correct Next.js 15 App Router pattern.

import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Web3Providers } from "./providers";

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
      <body>
        <Web3Providers>{children}</Web3Providers>
      </body>
    </html>
  );
}
