"use client";

import Link from "next/link";
import { ConnectButton } from "./ConnectButton";

export function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/6 bg-[#0a0a0a]/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[#0a0a0a] font-black text-sm"
            style={{ backgroundColor: "#F7931A" }}
          >
            ₿
          </span>
          <span className="text-lg font-bold tracking-tight text-white">
            BitRemit
          </span>
        </Link>

        {/* Nav links */}
        <nav className="hidden items-center gap-8 md:flex">
          <a
            href="#how-it-works"
            className="text-sm font-medium text-zinc-400 transition-colors hover:text-white"
          >
            How It Works
          </a>
          <a
            href="#rails"
            className="text-sm font-medium text-zinc-400 transition-colors hover:text-white"
          >
            Payment Rails
          </a>
          <Link
            href="/send"
            className="text-sm font-medium text-zinc-400 transition-colors hover:text-white"
          >
            Send Money
          </Link>
        </nav>

        {/* Wallet connect */}
        <div className="flex items-center gap-3">
          <ConnectButton />
        </div>
      </div>
    </header>
  );
}
