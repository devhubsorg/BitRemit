"use client";

import Link from "next/link";
import { ConnectButton } from "@/components/ConnectButton";
import { useAccount } from "wagmi";

export function Navbar() {
  const { isConnected } = useAccount();

  return (
    <nav
      className="sticky top-0 z-90 flex h-16 items-center border-b px-[5%] backdrop-blur-md transition-[top] duration-300"
      style={{
        background: "rgba(13,17,23,0.85)",
        borderColor: "#30363D",
      }}
    >
      <div className="mx-auto grid w-full max-w-300 grid-cols-[auto_1fr_auto] items-center">
        {/* Wordmark */}
        <Link
          href="/"
          className="flex items-center gap-2.5 no-underline"
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 800,
            fontSize: "20px",
            color: "#F0F6FC",
            letterSpacing: "-0.02em",
          }}
        >
          <span
            aria-hidden="true"
            style={{
              width: 28,
              height: 28,
              borderRadius: 8,
              border: "2px solid #F7931A",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#F7931A">
              <path
                d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                stroke="#F7931A"
                strokeWidth="2"
                fill="none"
              />
            </svg>
          </span>
          BitRemit
        </Link>

        {isConnected ? (
          <div className="flex items-center justify-center gap-8">
            <Link
              href="/dashboard"
              className="text-sm font-medium no-underline transition-colors duration-150"
              style={{ color: "#F0F6FC" }}
            >
              Dashboard
            </Link>
            <Link
              href="/send"
              className="text-sm font-medium no-underline transition-colors duration-150"
              style={{ color: "#F0F6FC" }}
            >
              Send
            </Link>
            <Link
              href="/history"
              className="text-sm font-medium no-underline transition-colors duration-150"
              style={{ color: "#F0F6FC" }}
            >
              History
            </Link>
          </div>
        ) : (
          <div />
        )}

        <div className="justify-self-end">
          <ConnectButton />
        </div>
      </div>
    </nav>
  );
}
