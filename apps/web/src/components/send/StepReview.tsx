"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { parseUnits } from "viem";
import type { RecipientResponse } from "../../types/send";
import { RAIL_CONFIG } from "../../types/send";
import { useSendRemittance } from "../../hooks/useSendRemittance";
import { useToast } from "@/hooks/use-toast";
import { useVault, useBorrowMUSD } from "@/hooks";
import { useBalance } from "wagmi";

interface StepReviewProps {
  recipient: RecipientResponse;
  amount: string;
  onSuccessAction: (txId: string, txHash: string) => void;
  onBackAction: () => void;
}

const RAIL_TO_CURRENCY: Record<string, { code: string; rate: number }> = {
  MPESA: { code: "KES", rate: 130.35 },
  GCASH: { code: "PHP", rate: 56.4 },
  MTNMOMO: { code: "NGN", rate: 1620 },
};

function maskPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length <= 4) return phone;
  return phone.slice(0, 4) + "****" + digits.slice(-3);
}

function Row({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "13px 0",
        borderBottom: "1px solid #2a2a2a",
      }}
    >
      <span style={{ color: "#888", fontSize: "13px" }}>{label}</span>
      <span
        style={{
          color: highlight ? "#F7931A" : "#fff",
          fontSize: "14px",
          fontWeight: 600,
        }}
      >
        {value}
      </span>
    </div>
  );
}

export function StepReview({
  recipient,
  amount,
  onSuccessAction,
  onBackAction,
}: StepReviewProps) {
  const { address } = useAccount();
  const { sendRemittance, isPending, error, reset } = useSendRemittance();
  const { toast } = useToast();
  const [posting, setPosting] = useState(false);

  // 1. Check MUSD Balance and Vault State
  const MUSD_ADDRESS = process.env.NEXT_PUBLIC_MUSD_ADDRESS as `0x${string}`;
  const { data: musdBalanceData } = useBalance({
    address: address,
    token: MUSD_ADDRESS,
  });
  const { maxBorrowable } = useVault();
  const { borrowMUSD, isPending: isBorrowing } = useBorrowMUSD();

  const parsed = parseFloat(amount) || 0;
  const mezoFee = parsed * 0.01;
  const offrampFee = parsed * 0.01;
  const totalNeeded = parsed * 1.02;
  const totalNeededWei = parseUnits(totalNeeded.toFixed(18), 18);

  const musdBalance = musdBalanceData?.value ?? 0n;
  const shortfall = totalNeededWei > musdBalance ? totalNeededWei - musdBalance : 0n;
  const canBorrowShortfall = shortfall > 0 && shortfall <= parseUnits(maxBorrowable, 18);

  const currInfo = RAIL_TO_CURRENCY[recipient.paymentRail] ?? {
    code: "USD",
    rate: 1,
  };
  const recipientGets = (parsed * currInfo.rate).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const rail = RAIL_CONFIG[recipient.paymentRail];

  const shortAddress = address
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : "—";

  const handleConfirm = async () => {
    reset();

    const amountWei = parseUnits(amount, 18);
    const railType = recipient.paymentRail;

    try {
      // Step A: Auto-Borrow if shortfall exists
      if (shortfall > 0) {
        if (!canBorrowShortfall) {
          toast({
            title: "Insufficient Liquidity",
            description: "You don't have enough BTC collateral to borrow this amount.",
            variant: "destructive",
          });
          return;
        }

        toast({
          title: "Step 1/2: Borrowing MUSD",
          description: "Generating MUSD against your BTC collateral...",
        });
        
        await borrowMUSD(shortfall);
        // Wait for confirmation is handled by the hook's receipt tracking
        toast({
          title: "Step 1/2 Complete",
          description: "MUSD minted. Now signing the transfer...",
        });
      }

      // Step B: Send Remittance
      const hash = await sendRemittance({
        recipientPhone: recipient.phoneNumber,
        amount: amount,
        railType,
        recipientId: recipient.id,
      });

      if (!hash) return; // User cancelled or error

      // POST to backend to record and initiate off-ramp job
      setPosting(true);
      const res = await fetch("/api/remittance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          txHash: hash,
          recipientId: recipient.id,
          amount,
          railType,
        }),
      });
      if (!res.ok) throw new Error("Backend failed to record transaction");
      const { transactionId } = await res.json();
      onSuccessAction(transactionId, hash);
    } catch (e) {
      const message = e instanceof Error ? e.message : "Transaction failed";
      toast({
        title: "Something went wrong",
        description: message,
        variant: "destructive",
      });
    } finally {
      setPosting(false);
    }
  };

  const isLoading = isPending || posting || isBorrowing;

  return (
    <div style={{ width: "100%" }}>
      {/* Back + heading */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          marginBottom: "28px",
        }}
      >
        <button
          onClick={onBackAction}
          disabled={isLoading}
          style={{
            background: "none",
            border: "none",
            color: "#666",
            fontSize: "13px",
            cursor: isLoading ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            gap: "4px",
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
          Review your transfer
        </h2>
      </div>

      {/* Summary card */}
      <div
        style={{
          background: "#1e1e1e",
          borderRadius: "12px",
          padding: "4px 20px",
          marginBottom: "16px",
        }}
      >
        <Row label="From" value={shortAddress} />
        <Row
          label="To"
          value={`${recipient.name} · ${maskPhone(recipient.phoneNumber)} · ${rail.label}`}
        />
        <Row label="Amount" value={`${parsed.toLocaleString()} MUSD`} />
        <Row label="Mezo Fee (1%)" value={`${mezoFee.toFixed(2)} MUSD`} />
        <Row
          label="Off-ramp Fee (1%)"
          value={`${offrampFee.toFixed(2)} MUSD`}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "13px 0",
            borderBottom: "1px solid #2a2a2a",
          }}
        >
          <span style={{ color: "#fff", fontSize: "14px", fontWeight: 700 }}>
            Total MUSD
          </span>
          <span
            style={{
              color: "#fff",
              fontSize: "16px",
              fontWeight: 800,
              fontFamily: "monospace",
            }}
          >
            {totalNeeded.toFixed(2)}
          </span>
        </div>
        <Row
          label="Recipient gets"
          value={`${recipientGets} ${currInfo.code}`}
          highlight
        />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "13px 0",
          }}
        >
          <span style={{ color: "#888", fontSize: "13px" }}>
            Estimated time
          </span>
          <span style={{ color: "#22c55e", fontSize: "13px", fontWeight: 600 }}>
            ~30–60 seconds
          </span>
        </div>
      </div>

      {/* Auto-borrow info */}
      {shortfall > 0 && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            background: "rgba(34,197,94,0.1)",
            border: "1px solid rgba(34,197,94,0.3)",
            borderRadius: "9px",
            padding: "12px 16px",
            marginBottom: "20px",
          }}
        >
          <span style={{ color: "#22c55e", fontSize: "16px", flexShrink: 0 }}>
            ✨
          </span>
          <p
            style={{
              color: "#fff",
              fontSize: "12px",
              lineHeight: 1.6,
              margin: 0,
            }}
          >
            <strong>Auto-Borrow active:</strong> You are short{" "}
            {(Number(shortfall) / 1e18).toFixed(2)} MUSD. We will borrow this
            from your BTC vault automatically.
          </p>
        </div>
      )}

      {/* Warning note */}
      {!shortfall && (
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "10px",
            background: "rgba(247,147,26,0.08)",
            border: "1px solid rgba(247,147,26,0.2)",
            borderRadius: "9px",
            padding: "12px 16px",
            marginBottom: "20px",
          }}
        >
          <span style={{ color: "#F7931A", fontSize: "16px", flexShrink: 0 }}>
            ⚠
          </span>
          <p
            style={{
              color: "#aaa",
              fontSize: "12px",
              lineHeight: 1.6,
              margin: 0,
            }}
          >
            This will sign a transaction with your wallet. Your BTC collateral
            remains locked in your vault. This action cannot be undone.
          </p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div
          style={{
            background: "rgba(239,68,68,0.1)",
            border: "1px solid rgba(239,68,68,0.3)",
            borderRadius: "9px",
            padding: "12px 16px",
            marginBottom: "16px",
          }}
        >
          <p style={{ color: "#ef4444", fontSize: "13px", margin: 0 }}>
            {error.message}
          </p>
        </div>
      )}

      {/* Confirm button */}
      <button
        onClick={handleConfirm}
        disabled={isLoading}
        style={{
          width: "100%",
          background: isLoading ? "#2a2a2a" : "#F7931A",
          border: "none",
          borderRadius: "10px",
          padding: "16px",
          color: isLoading ? "#666" : "#000",
          fontSize: "15px",
          fontWeight: 700,
          cursor: isLoading ? "not-allowed" : "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "10px",
          transition: "background 0.2s",
        }}
      >
        {isLoading ? (
          <>
            <svg
              style={{ animation: "spin 1s linear infinite" }}
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke={isBorrowing ? "#22c55e" : "#666"}
                strokeWidth="3"
                strokeDasharray="31.4"
                strokeDashoffset="10"
              />
            </svg>
            {isBorrowing
              ? "Borrowing MUSD..."
              : isPending
                ? "Signing Transfer..."
                : "Recording..."}
          </>
        ) : (
          <span>
            {shortfall > 0 ? "⚡ Borrow & Send" : "✍ Confirm & Sign Wallet"}
          </span>
        )}
      </button>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
