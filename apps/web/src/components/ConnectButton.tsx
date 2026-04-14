"use client";

import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useAccount, useDisconnect } from "wagmi";
import { useState } from "react";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function truncateAddress(address: string): string {
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}

// ─── ConnectButton ────────────────────────────────────────────────────────────
// • Disconnected  → single "Connect Wallet" button; click opens the Mezo
//                   Passport / RainbowKit modal automatically.
// • Connected     → shows truncated address pill + a "Disconnect" option that
//                   appears on hover/focus (accessible via keyboard too).
// Styling uses inline Tailwind utilities and a CSS variable for BTC orange so
// the design system color is applied consistently.
// ─────────────────────────────────────────────────────────────────────────────

export function ConnectButton() {
  const { address, isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();
  const { disconnect } = useDisconnect();
  const [showDisconnect, setShowDisconnect] = useState(false);

  // ── Disconnected state ────────────────────────────────────────────────────
  if (!isConnected || !address) {
    return (
      <button
        type="button"
        onClick={openConnectModal}
        className="connect-btn"
        style={btnStyle}
      >
        <WalletIcon />
        Connect Wallet
      </button>
    );
  }

  // ── Connected state ───────────────────────────────────────────────────────
  return (
    <div
      className="relative inline-flex"
      onMouseEnter={() => setShowDisconnect(true)}
      onMouseLeave={() => setShowDisconnect(false)}
    >
      {/* Address pill */}
      <button
        type="button"
        onClick={() => setShowDisconnect((v) => !v)}
        aria-expanded={showDisconnect}
        aria-haspopup="true"
        style={addressPillStyle}
      >
        {/* Green "online" dot */}
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            backgroundColor: "#22c55e",
            flexShrink: 0,
          }}
        />
        <span style={{ fontFamily: "monospace", fontSize: 14 }}>
          {truncateAddress(address)}
        </span>
        <ChevronIcon open={showDisconnect} />
      </button>

      {/* Disconnect dropdown */}
      {showDisconnect && (
        <div style={dropdownStyle} role="menu">
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              disconnect();
              setShowDisconnect(false);
            }}
            style={disconnectBtnStyle}
            onFocus={() => setShowDisconnect(true)}
            onBlur={() => setShowDisconnect(false)}
          >
            <DisconnectIcon />
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Inline styles ────────────────────────────────────────────────────────────
// Using React style objects avoids any Tailwind purge issues when this
// component is consumed from packages/web3 before Tailwind scans it.

const BTC_ORANGE = "#F7931A";

const btnStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  padding: "10px 20px",
  borderRadius: 10,
  border: `1.5px solid ${BTC_ORANGE}`,
  backgroundColor: BTC_ORANGE,
  color: "#fff",
  fontWeight: 600,
  fontSize: 14,
  cursor: "pointer",
  letterSpacing: "0.01em",
  transition: "opacity 0.15s ease, transform 0.1s ease",
};

const addressPillStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  padding: "9px 16px",
  borderRadius: 10,
  border: `1.5px solid ${BTC_ORANGE}`,
  backgroundColor: "transparent",
  color: BTC_ORANGE,
  fontWeight: 600,
  fontSize: 14,
  cursor: "pointer",
  letterSpacing: "0.01em",
  transition: "background-color 0.15s ease",
};

const dropdownStyle: React.CSSProperties = {
  position: "absolute",
  top: "calc(100% + 6px)",
  right: 0,
  minWidth: 160,
  backgroundColor: "#1a1a1a",
  border: "1px solid #2a2a2a",
  borderRadius: 10,
  padding: "4px 0",
  boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
  zIndex: 50,
};

const disconnectBtnStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  width: "100%",
  padding: "10px 16px",
  backgroundColor: "transparent",
  border: "none",
  color: "#ef4444",
  fontWeight: 600,
  fontSize: 13,
  cursor: "pointer",
  textAlign: "left",
};

// ─── Micro SVG icons ──────────────────────────────────────────────────────────

function WalletIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" />
      <path d="M16 3H8L6 7h12l-2-4z" />
      <circle cx="17" cy="14" r="1" fill="currentColor" />
    </svg>
  );
}

function DisconnectIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={{
        transform: open ? "rotate(180deg)" : "rotate(0deg)",
        transition: "transform 0.2s ease",
      }}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}
