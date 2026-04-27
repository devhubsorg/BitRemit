// layout.tsx is intentionally a SERVER component.
// Web3Providers is a client boundary. Keeping it as a normal client component
// (instead of dynamic ssr: false) allows the server to still render route
// content and avoids blank shells when client hydration is delayed.

import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Syne, DM_Sans } from "next/font/google";

import "./globals.css";

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
    <html
      lang="en"
      suppressHydrationWarning
      className={`${syne.variable} ${dmSans.variable}`}
    >
      {/*
       * suppressHydrationWarning on <body> prevents false hydration errors
       * from browser extensions (e.g. ColorZilla adds cz-shortcut-listen)
       * that mutate <body> attributes before React hydrates.
       */}
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
