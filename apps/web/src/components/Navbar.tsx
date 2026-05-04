"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ConnectButton } from "@/components/ConnectButton";
import { useAccount } from "wagmi";

export function Navbar() {
  const { isConnected } = useAccount();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <nav
      className="sticky top-0 z-90 flex h-16 items-center border-b px-[5%] backdrop-blur-md transition-[top] duration-300"
      style={{
        background: "rgba(13,17,23,0.85)",
        borderColor: "#30363D",
      }}
    >
      <div className="mx-auto grid w-full max-w-300 grid-cols-[auto_1fr_auto] items-center gap-3 md:gap-0">
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
          <div className="hidden items-center justify-center gap-8 md:flex">
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

        <div className="hidden justify-self-end md:block">
          <ConnectButton />
        </div>

        <div className="flex items-center justify-self-end gap-2 md:hidden">
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-label="Toggle navigation menu"
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              border: "1px solid #30363D",
              background: "rgba(13,17,23,0.9)",
              color: "#F0F6FC",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            {menuOpen ? "x" : "☰"}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div
          className="absolute left-0 right-0 top-16 border-b px-[5%] pb-4 pt-3 md:hidden"
          style={{
            background: "rgba(13,17,23,0.98)",
            borderColor: "#30363D",
          }}
        >
          <div className="flex flex-col gap-3">
            {isConnected ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-sm font-semibold no-underline"
                  style={{ color: "#F0F6FC" }}
                >
                  Dashboard
                </Link>
                <Link
                  href="/send"
                  className="text-sm font-semibold no-underline"
                  style={{ color: "#F0F6FC" }}
                >
                  Send
                </Link>
                <Link
                  href="/history"
                  className="text-sm font-semibold no-underline"
                  style={{ color: "#F0F6FC" }}
                >
                  History
                </Link>
              </>
            ) : null}

            <div>
              <ConnectButton />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
