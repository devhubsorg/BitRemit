"use client";

import { useState, useEffect, useRef } from "react";
import type { RecipientResponse } from "../../types/send";
import { RAIL_CONFIG } from "../../types/send";
import { useVault } from "@/hooks";
import { useToast } from "@/hooks/use-toast";

interface StepAmountProps {
  recipient: RecipientResponse;
  onNextAction: (amount: string) => void;
  onBackAction: () => void;
}

interface RateMap {
  [currency: string]: number;
}

const RAIL_TO_CURRENCY: Record<string, { code: string; symbol: string }> = {
  MPESA: { code: "KES", symbol: "KES" },
  GCASH: { code: "PHP", symbol: "₱" },
  MTNMOMO: { code: "NGN", symbol: "₦" },
};

const FALLBACK_RATES: RateMap = {
  KES: 130.35,
  PHP: 56.4,
  NGN: 1620,
};

function Initials({ name }: { name: string }) {
  const parts = name.trim().split(" ");
  const initials =
    parts.length >= 2
      ? parts[0][0] + parts[parts.length - 1][0]
      : parts[0].slice(0, 2);
  return (
    <div
      style={{
        width: "40px",
        height: "40px",
        borderRadius: "50%",
        background: "linear-gradient(135deg,#F7931A,#e07b0f)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "14px",
        fontWeight: 700,
        color: "#000",
        flexShrink: 0,
      }}
    >
      {initials.toUpperCase()}
    </div>
  );
}

function BreakdownRow({
  label,
  value,
  labelColor = "#aaa",
  bold = false,
}: {
  label: string;
  value: string;
  labelColor?: string;
  bold?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 0",
        borderBottom: bold ? "none" : "1px solid #2a2a2a",
      }}
    >
      <span
        style={{
          color: labelColor,
          fontSize: "14px",
          fontWeight: bold ? 700 : 400,
        }}
      >
        {label}
      </span>
      <span
        style={{
          color: bold ? "#fff" : "#ccc",
          fontSize: bold ? "16px" : "14px",
          fontWeight: bold ? 800 : 500,
          fontFamily: bold ? "monospace" : "inherit",
        }}
      >
        {value}
      </span>
    </div>
  );
}

export function StepAmount({
  recipient,
  onNextAction,
  onBackAction,
}: StepAmountProps) {
  const { toast } = useToast();
  const [rawAmount, setRawAmount] = useState("");
  const [rates, setRates] = useState<RateMap>(FALLBACK_RATES);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [debouncedAmount, setDebouncedAmount] = useState("");
  const vault = useVault();

  const currInfo = RAIL_TO_CURRENCY[recipient.paymentRail] ?? {
    code: "USD",
    symbol: "$",
  };
  const rate = rates[currInfo.code] ?? 1;

  // Fetch FX rates on mount
  useEffect(() => {
    fetch("/api/rates")
      .then((r) => r.json())
      .then((data) => setRates(data))
      .catch(() => {
        toast({
          title: "Something went wrong",
          description: "Unable to fetch current FX rates. Using fallback rates.",
          variant: "destructive",
        });
      });
  }, [toast]);

  // Debounce amount updates
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setDebouncedAmount(rawAmount), 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [rawAmount]);

  const amount = parseFloat(debouncedAmount) || 0;
  const mezoFee = amount * 0.01;
  const offrampFee = amount * 0.01;
  const totalNeeded = amount * 1.02;
  const recipientGets = amount * rate;
  const availableMUSD = parseFloat(vault.borrowedMUSD) || 0;
  const isInsufficient = amount > 0 && totalNeeded > availableMUSD;
  const shortage = (totalNeeded - availableMUSD).toFixed(2);
  const canProceed = amount >= 1 && !isInsufficient;

  const rail = RAIL_CONFIG[recipient.paymentRail];

  return (
    <div style={{ width: "100%" }}>
      {/* Back + heading */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          marginBottom: "24px",
        }}
      >
        <button
          onClick={onBackAction}
          style={{
            background: "none",
            border: "none",
            color: "#666",
            fontSize: "13px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "4px",
            flexShrink: 0,
          }}
        >
          ← Back
        </button>
        <h2
          style={{
            color: "#fff",
            fontSize: "22px",
            fontWeight: 700,
            margin: 0,
          }}
        >
          How much are you sending?
        </h2>
      </div>

      {/* Recipient summary bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "#242424",
          borderRadius: "10px",
          padding: "14px 16px",
          marginBottom: "24px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Initials name={recipient.name} />
          <div>
            <p
              style={{
                color: "#777",
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.06em",
                marginBottom: "3px",
                textTransform: "uppercase",
              }}
            >
              SENDING TO
            </p>
            <p style={{ color: "#fff", fontSize: "14px", fontWeight: 600 }}>
              {recipient.name} · via: {rail.label}
            </p>
          </div>
        </div>
        <button
          onClick={onBackAction}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#666",
            padding: "4px",
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
        </button>
      </div>

      {/* Amount input */}
      <div style={{ marginBottom: "10px" }}>
        <p style={{ color: "#888", fontSize: "13px", marginBottom: "8px" }}>
          Amount to send
        </p>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "#242424",
            border: `1.5px solid ${isInsufficient ? "#ef4444" : amount > 0 ? "#F7931A" : "#333"}`,
            borderRadius: "10px",
            padding: "14px 18px",
            transition: "border-color 0.2s",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "2px",
              flex: 1,
            }}
          >
            <span style={{ color: "#fff", fontSize: "18px", fontWeight: 700 }}>
              $
            </span>
            <input
              type="number"
              min="1"
              placeholder="0"
              value={rawAmount}
              onChange={(e) => setRawAmount(e.target.value)}
              style={{
                background: "none",
                border: "none",
                outline: "none",
                color: "#fff",
                fontSize: "18px",
                fontWeight: 700,
                width: "100%",
                minWidth: 0,
              }}
            />
          </div>
          <span
            style={{
              color: "#F7931A",
              fontSize: "14px",
              fontWeight: 700,
              flexShrink: 0,
            }}
          >
            MUSD
          </span>
        </div>
      </div>

      {/* Balance indicator */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          marginBottom: "20px",
          minHeight: "22px",
        }}
      >
        {!vault.isLoading && (
          <>
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: isInsufficient ? "#ef4444" : "#22c55e",
                flexShrink: 0,
              }}
            />
            <span style={{ color: "#888", fontSize: "13px" }}>
              Your Balance:{" "}
              <strong style={{ color: "#fff" }}>
                {availableMUSD.toLocaleString()} MUSD
              </strong>
            </span>
            {amount > 0 &&
              (isInsufficient ? (
                <span
                  style={{
                    color: "#ef4444",
                    fontSize: "13px",
                    fontWeight: 600,
                  }}
                >
                  Insufficient MUSD - you need {shortage} more
                </span>
              ) : (
                <span
                  style={{
                    color: "#22c55e",
                    fontSize: "13px",
                    fontWeight: 600,
                  }}
                >
                  ✓ Sufficient
                </span>
              ))}
          </>
        )}
      </div>

      {/* Cost breakdown */}
      <div
        style={{
          background: "#1e1e1e",
          borderRadius: "10px",
          padding: "4px 18px",
          marginBottom: "14px",
        }}
      >
        <BreakdownRow
          label="Amount (MUSD)"
          value={amount > 0 ? amount.toLocaleString() : "—"}
          labelColor="#F7931A"
        />
        <BreakdownRow
          label="Mezo Fee (1%)"
          value={amount > 0 ? mezoFee.toFixed(2) : "—"}
          labelColor="#F7931A"
        />
        <BreakdownRow
          label="Off-ramp Fee (1%)"
          value={amount > 0 ? offrampFee.toFixed(2) : "—"}
          labelColor="#F7931A"
        />
        <div style={{ padding: "12px 0 4px" }}>
          <BreakdownRow
            label="Total MUSD Needed"
            value={amount > 0 ? totalNeeded.toFixed(2) : "—"}
            bold
          />
        </div>
      </div>

      {/* Recipient gets box */}
      {amount > 0 && (
        <div
          style={{
            background: "#1e1e1e",
            border: "1px solid #2a2a2a",
            borderRadius: "10px",
            padding: "16px 18px",
            marginBottom: "20px",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "0",
          }}
        >
          <div>
            <p
              style={{
                color: "#888",
                fontSize: "10px",
                fontWeight: 700,
                letterSpacing: "0.07em",
                textTransform: "uppercase",
                marginBottom: "8px",
              }}
            >
              RECIPIENT GETS
            </p>
            <p
              style={{
                color: "#F7931A",
                fontSize: "24px",
                fontWeight: 800,
                fontFamily: "monospace",
              }}
            >
              {recipientGets.toLocaleString("en-US", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })}{" "}
              {currInfo.code}
            </p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p
              style={{
                color: "#888",
                fontSize: "10px",
                fontWeight: 700,
                letterSpacing: "0.07em",
                textTransform: "uppercase",
                marginBottom: "8px",
              }}
            >
              EXCHANGE RATE
            </p>
            <p style={{ color: "#fff", fontSize: "14px", fontWeight: 600 }}>
              1 MUSD = {rate.toFixed(2)} {currInfo.code}
            </p>
            <p style={{ color: "#666", fontSize: "11px", marginTop: "4px" }}>
              ~30–60 seconds
            </p>
          </div>
        </div>
      )}

      {/* Next button */}
      <button
        disabled={!canProceed}
        onClick={() => canProceed && onNextAction(rawAmount)}
        style={{
          width: "100%",
          background: canProceed ? "#F7931A" : "#2a2a2a",
          border: "none",
          borderRadius: "10px",
          padding: "16px",
          color: canProceed ? "#000" : "#444",
          fontSize: "15px",
          fontWeight: 700,
          cursor: canProceed ? "pointer" : "not-allowed",
          transition: "background 0.2s, color 0.2s",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
        }}
      >
        Next: Review →
      </button>
    </div>
  );
}
