"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import type { RecipientResponse } from "../../types/send";
import { RAIL_TO_CURRENCY } from "../../types/send";
import { useToast } from "@/hooks/use-toast";

interface StepSuccessProps {
  txId: string;
  txHash: string;
  recipient: RecipientResponse;
  amount: string;
  onResetAction: () => void;
}

type TxStatus =
  | "PENDING"
  | "CONFIRMED_ONCHAIN"
  | "OFFRAMP_PROCESSING"
  | "COMPLETED"
  | "FAILED";

interface StatusStep {
  label: string;
  sublabel?: string;
  isGreen: (status: TxStatus) => boolean;
}

const STATUS_STEPS: StatusStep[] = [
  {
    label: "Transaction signed",
    isGreen: () => true, // always green by the time we're on step 4
  },
  {
    label: "Confirmed on Mezo",
    sublabel: "Waiting for block confirmation…",
    isGreen: (s) => s !== "PENDING",
  },
  {
    label: "Off-ramp triggered",
    sublabel: "Initiating payment rail…",
    isGreen: (s) => s === "OFFRAMP_PROCESSING" || s === "COMPLETED",
  },
  {
    label: "Processing...",
    sublabel: "Provider processing payment...",
    isGreen: (s) => s === "OFFRAMP_PROCESSING" || s === "COMPLETED",
  },
  {
    label: "SMS delivered to recipient",
    sublabel: "Processing payment…",
    isGreen: (s) => s === "COMPLETED",
  },
];

function CheckCircle({ done, pulse }: { done: boolean; pulse?: boolean }) {
  return (
    <div
      style={{
        width: "28px",
        height: "28px",
        borderRadius: "50%",
        flexShrink: 0,
        background: done ? "#22c55e" : "#2a2a2a",
        border: `2px solid ${done ? "#22c55e" : "#3a3a3a"}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "all 0.4s ease",
        boxShadow: done && pulse ? "0 0 0 4px rgba(34,197,94,0.2)" : "none",
      }}
    >
      {done ? (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
          <polyline
            points="20 6 9 17 4 12"
            stroke="#fff"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : (
        <div
          style={{
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            background: "#3a3a3a",
            animation: "pulse-dot 1.5s ease-in-out infinite",
          }}
        />
      )}
    </div>
  );
}

export function StepSuccess({
  txId,
  txHash,
  recipient,
  amount,
  onResetAction,
}: StepSuccessProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [txStatus, setTxStatus] = useState<TxStatus>("PENDING");
  const [checkIn, setCheckIn] = useState(false); // checkmark animation trigger
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const currInfo = RAIL_TO_CURRENCY[recipient.paymentRail] ?? {
    code: "USD",
    rate: 1,
  };
  const fiatAmount = (parseFloat(amount) * currInfo.rate).toLocaleString(
    "en-US",
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    },
  );

  // Trigger checkmark animation on mount
  useEffect(() => {
    const t = setTimeout(() => setCheckIn(true), 100);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    toast({
      title: "Transfer sent!",
      description: `${recipient.name} will receive ${currInfo.code} ${fiatAmount}`,
      variant: "default",
    });
  }, [currInfo.code, fiatAmount, recipient.name, toast]);

  // Poll transaction status every 3 seconds
  useEffect(() => {
    if (!txId) return;

    const poll = async () => {
      try {
        const res = await fetch(`/api/remittance/${txId}`);
        if (!res.ok) return;
        const data = await res.json();
        setTxStatus(data.status);
        if (data.status === "COMPLETED" || data.status === "FAILED") {
          if (pollRef.current) clearInterval(pollRef.current);
        }
      } catch {}
    };

    poll(); // immediate first call
    pollRef.current = setInterval(poll, 3000);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [txId]);

  const explorerUrl = `https://explorer.test.mezo.org/tx/${txHash}`;
  const shortHash = txHash
    ? `${txHash.slice(0, 10)}...${txHash.slice(-8)}`
    : "";

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Animated checkmark */}
      <div
        style={{
          width: "80px",
          height: "80px",
          borderRadius: "50%",
          background: "rgba(34,197,94,0.12)",
          border: "2px solid rgba(34,197,94,0.3)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "20px",
          transform: checkIn ? "scale(1)" : "scale(0)",
          opacity: checkIn ? 1 : 0,
          transition:
            "transform 0.5s cubic-bezier(0.34,1.56,0.64,1), opacity 0.4s ease",
        }}
      >
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
          <polyline
            points="20 6 9 17 4 12"
            stroke="#22c55e"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              strokeDasharray: 30,
              strokeDashoffset: checkIn ? 0 : 30,
              transition: "stroke-dashoffset 0.5s ease 0.2s",
            }}
          />
        </svg>
      </div>

      {/* Heading */}
      <h2
        style={{
          color: "#fff",
          fontSize: "24px",
          fontWeight: 800,
          margin: "0 0 8px",
          textAlign: "center",
        }}
      >
        Transfer Sent!
      </h2>
      <p
        style={{
          color: "#888",
          fontSize: "14px",
          margin: "0 0 28px",
          textAlign: "center",
        }}
      >
        {recipient.name} will receive{" "}
        <strong style={{ color: "#F7931A" }}>
          {fiatAmount} {currInfo.code}
        </strong>
      </p>

      {/* Status tracker */}
      <div
        style={{
          width: "100%",
          background: "#1e1e1e",
          borderRadius: "12px",
          padding: "20px 20px",
          marginBottom: "16px",
        }}
      >
        <p
          style={{
            color: "#666",
            fontSize: "11px",
            fontWeight: 700,
            letterSpacing: "0.07em",
            marginBottom: "16px",
            textTransform: "uppercase",
          }}
        >
          Live Status
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
          {STATUS_STEPS.map((step, idx) => {
            const done = step.isGreen(txStatus);
            const isLast = idx === STATUS_STEPS.length - 1;
            const isActive = !done && STATUS_STEPS[idx - 1]?.isGreen(txStatus);

            return (
              <div key={step.label}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "14px",
                    padding: "8px 0",
                  }}
                >
                  <CheckCircle
                    done={done}
                    pulse={
                      done &&
                      idx ===
                        STATUS_STEPS.filter((s) => s.isGreen(txStatus)).length -
                          1
                    }
                  />
                  <div>
                    <p
                      style={{
                        color: done ? "#fff" : isActive ? "#888" : "#555",
                        fontSize: "14px",
                        fontWeight: done ? 600 : 400,
                        margin: 0,
                        transition: "color 0.3s",
                      }}
                    >
                      {step.label}
                    </p>
                    {isActive && step.sublabel && (
                      <p
                        style={{
                          color: "#555",
                          fontSize: "11px",
                          margin: "2px 0 0",
                        }}
                      >
                        {step.sublabel}
                      </p>
                    )}
                  </div>
                  {done && (
                    <span
                      style={{
                        marginLeft: "auto",
                        color: "#22c55e",
                        fontSize: "12px",
                        fontWeight: 600,
                      }}
                    >
                      ✓
                    </span>
                  )}
                </div>
                {!isLast && (
                  <div
                    style={{
                      width: "2px",
                      height: "16px",
                      marginLeft: "13px",
                      background: done ? "#22c55e33" : "#2a2a2a",
                      transition: "background 0.3s",
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Tx hash */}
      {txHash && (
        <div
          style={{
            width: "100%",
            background: "#1a1a1a",
            border: "1px solid #2a2a2a",
            borderRadius: "9px",
            padding: "12px 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "20px",
          }}
        >
          <div>
            <p
              style={{
                color: "#555",
                fontSize: "10px",
                fontWeight: 700,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                marginBottom: "3px",
              }}
            >
              Transaction Hash
            </p>
            <p
              style={{
                color: "#aaa",
                fontSize: "12px",
                fontFamily: "monospace",
              }}
            >
              {shortHash}
            </p>
          </div>
          <a
            href={explorerUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "#F7931A",
              fontSize: "12px",
              fontWeight: 700,
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: "4px",
              padding: "6px 12px",
              border: "1px solid rgba(247,147,26,0.3)",
              borderRadius: "6px",
              background: "rgba(247,147,26,0.08)",
            }}
          >
            Explorer ↗
          </a>
        </div>
      )}

      {/* Action buttons */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "12px",
          width: "100%",
        }}
      >
        <button
          onClick={onResetAction}
          style={{
            background: "#242424",
            border: "1px solid #333",
            borderRadius: "10px",
            padding: "14px",
            color: "#fff",
            fontSize: "14px",
            fontWeight: 600,
            cursor: "pointer",
            transition: "background 0.15s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#2e2e2e")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#242424")}
        >
          Send Another
        </button>
        <button
          onClick={() => router.push("/dashboard")}
          style={{
            background: "#F7931A",
            border: "none",
            borderRadius: "10px",
            padding: "14px",
            color: "#000",
            fontSize: "14px",
            fontWeight: 700,
            cursor: "pointer",
            transition: "background 0.15s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#e07b0f")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#F7931A")}
        >
          Back to Dashboard
        </button>
      </div>

      <style>{`
        @keyframes pulse-dot {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
