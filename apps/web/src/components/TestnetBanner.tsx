"use client";

import { useState } from "react";

export function TestnetBanner() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div
      style={{ backgroundColor: "#F7931A" }}
      className="relative z-100 flex h-9 items-center justify-center"
    >
      <span
        className="text-xs font-medium tracking-wide"
        style={{ color: "#0D1117", letterSpacing: "0.04em" }}
      >
        ⚡ &nbsp;Mezo Testnet &nbsp;·&nbsp; No real funds at risk
      </span>
      <button
        onClick={() => setDismissed(true)}
        aria-label="Dismiss"
        className="absolute right-4 flex h-6 w-6 items-center justify-center rounded-full text-base leading-none transition-colors hover:bg-black/15"
        style={{ color: "rgba(13,17,23,0.7)" }}
      >
        ✕
      </button>
    </div>
  );
}
