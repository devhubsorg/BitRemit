// layout.tsx is intentionally a SERVER component.
// Web3 providers are loaded through a client-only dynamic wrapper to avoid
// evaluating wallet SDK code during SSR/module evaluation.

import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Syne, DM_Sans } from "next/font/google";

import "./globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import Web3ProvidersDynamic from "./Web3ProvidersDynamic";
import { Toaster } from "@/components/ui/toaster";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  weight: ["400", "600", "700", "800"],
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["300", "400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "BitRemit — Bitcoin remittances for Africa and Southeast Asia",
  description:
    "Lock BTC, borrow MUSD at 1%, send money home via M-Pesa, GCash, or MTN MoMo",
  openGraph: {
    type: "website",
    title: "BitRemit — Bitcoin remittances for Africa and Southeast Asia",
    description:
      "Lock BTC, borrow MUSD at 1%, send money home via M-Pesa, GCash, or MTN MoMo",
    url: process.env.NEXT_PUBLIC_APP_URL ?? "https://bitremit.vercel.app",
  },
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`${syne.variable} ${dmSans.variable}`}
    >
      {/*
       * suppressHydrationWarning on <body> prevents false hydration errors
       * from browser extensions (e.g. ColorZilla adds cz-shortcut-listen)
       * that mutate <body> attributes before React hydrates.
       */}
      <body suppressHydrationWarning>
        <Web3ProvidersDynamic>
          {children}
          <Toaster />
        </Web3ProvidersDynamic>
      </body>
    </html>
  );
}
