"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";

const RAILS = ["M-Pesa", "GCash", "MTN MoMo"];

export function HeroSection() {
  const [railIndex, setRailIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const { isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();

  useEffect(() => {
    const interval = setInterval(() => {
      // Fade out → swap → fade in
      setVisible(false);
      setTimeout(() => {
        setRailIndex((i) => (i + 1) % RAILS.length);
        setVisible(true);
      }, 300);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const railLabel = RAILS[railIndex];
  const subheadline =
    railLabel === "M-Pesa"
      ? "Your family gets cash via M-Pesa"
      : railLabel === "GCash"
        ? "Your family gets cash via GCash"
        : "Your family gets cash via MTN MoMo";

  function handleStartSending() {
    if (!isConnected && openConnectModal) {
      openConnectModal();
    }
    // If connected, navigation is handled by the Link below
  }

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 pt-16 text-center">
      {/* Background glow */}
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        aria-hidden="true"
      >
        <div
          className="absolute left-1/2 top-1/3 h-150 w-150 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-10 blur-[120px]"
          style={{ backgroundColor: "#F7931A" }}
        />
      </div>

      {/* Mezo badge */}
      <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-zinc-400">
        <span
          className="inline-block h-1.5 w-1.5 rounded-full"
          style={{ backgroundColor: "#F7931A" }}
        />
        Live on Mezo Testnet
      </div>

      {/* Headline */}
      <h1 className="max-w-3xl text-5xl font-extrabold leading-tight tracking-tight text-white sm:text-6xl lg:text-7xl">
        Send <span style={{ color: "#F7931A" }}>Bitcoin&apos;s</span> value.
      </h1>

      {/* Cycling subheadline */}
      <p
        className="mt-5 text-xl font-medium text-zinc-300 transition-opacity duration-300 sm:text-2xl"
        style={{ opacity: visible ? 1 : 0 }}
      >
        {subheadline}
      </p>
      <p className="mt-2 max-w-xl text-base text-zinc-500">
        No crypto knowledge required. Your recipient only needs their phone.
      </p>

      {/* CTA buttons */}
      <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
        {isConnected ? (
          <Link
            href="/send"
            className="inline-flex h-12 items-center justify-center rounded-full px-8 text-sm font-semibold text-black shadow-lg transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            style={{ backgroundColor: "#F7931A" }}
          >
            Start Sending
          </Link>
        ) : (
          <button
            type="button"
            onClick={handleStartSending}
            className="inline-flex h-12 items-center justify-center rounded-full px-8 text-sm font-semibold text-black shadow-lg transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            style={{ backgroundColor: "#F7931A" }}
          >
            Start Sending
          </button>
        )}

        <a
          href="#how-it-works"
          className="inline-flex h-12 items-center justify-center rounded-full border border-white/20 bg-transparent px-8 text-sm font-semibold text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:ring-offset-2"
        >
          How It Works
        </a>
      </div>

      {/* Trusted logos hint */}
      <p className="mt-14 text-xs font-medium uppercase tracking-widest text-zinc-600">
        Supported payment rails
      </p>
      <div className="mt-3 flex items-center gap-6 text-zinc-500 text-sm font-semibold">
        <span>M-Pesa</span>
        <span className="text-zinc-700">·</span>
        <span>GCash</span>
        <span className="text-zinc-700">·</span>
        <span>MTN MoMo</span>
      </div>
    </section>
  );
}
