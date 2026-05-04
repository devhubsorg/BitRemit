"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ConnectButton } from "@/components/ConnectButton";
import { StepIndicator } from "@/components/send/StepIndicator";
import { StepRecipient } from "@/components/send/StepRecipient";
import { StepAmount } from "@/components/send/StepAmount";
import { StepReview } from "@/components/send/StepReview";
import { StepSuccess } from "@/components/send/StepSuccess";
import type { RecipientResponse } from "@/types/send";

interface SendFlowState {
  step: 1 | 2 | 3 | 4;
  selectedRecipient: RecipientResponse | null;
  amount: string;
  txId: string | null;
  txHash: string | null;
}

const INITIAL_STATE: SendFlowState = {
  step: 1,
  selectedRecipient: null,
  amount: "",
  txId: null,
  txHash: null,
};

const slideVariants = {
  enterFromRight: { x: 56, opacity: 0 },
  enterFromLeft: { x: -56, opacity: 0 },
  center: { x: 0, opacity: 1 },
  exitToLeft: { x: -56, opacity: 0 },
  exitToRight: { x: 56, opacity: 0 },
};

export default function SendPage() {
  const router = useRouter();
  const { isConnected, status } = useAccount();
  const mounted = useRef(false);
  const prevStep = useRef<number>(1);
  const [state, setState] = useState<SendFlowState>(INITIAL_STATE);

  useEffect(() => {
    mounted.current = true;
  }, []);
  useEffect(() => {
    if (mounted.current && status === "disconnected") router.push("/");
  }, [status, router]);

  const goingForward = state.step >= prevStep.current;

  const setStep = (step: 1 | 2 | 3 | 4) => {
    prevStep.current = state.step;
    setState((s) => ({ ...s, step }));
  };

  const handleAmountNext = (amount: string) => {
    prevStep.current = state.step;
    setState((s) => ({ ...s, amount, step: 3 }));
  };

  const handleSuccess = (txId: string, txHash: string) => {
    prevStep.current = state.step;
    setState((s) => ({ ...s, txId, txHash, step: 4 }));
  };

  const enterVariant = goingForward ? "enterFromRight" : "enterFromLeft";
  const exitVariant = goingForward ? "exitToLeft" : "exitToRight";

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#111",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          background: "linear-gradient(90deg,#F7931A,#e07b0f)",
          padding: "10px",
          textAlign: "center",
          fontSize: "13px",
          fontWeight: 600,
          color: "#000",
        }}
      >
        Mezo Testnet · No real funds at risk
      </div>
      <nav
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px clamp(16px,4vw,40px)",
          borderBottom: "1px solid #1e1e1e",
        }}
      >
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            textDecoration: "none",
          }}
        >
          <div
            style={{
              width: "30px",
              height: "30px",
              borderRadius: "7px",
              border: "2px solid #F7931A",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <polygon
                points="12,2 22,7 22,17 12,22 2,17 2,7"
                stroke="#F7931A"
                strokeWidth="2"
                fill="none"
              />
            </svg>
          </div>
          <span style={{ color: "#fff", fontSize: "17px", fontWeight: 800 }}>
            BitRemit
          </span>
        </Link>
        <div style={{ display: "flex", gap: "clamp(16px,3vw,32px)" }}>
          {[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Send", href: "/send", active: true },
            { label: "History", href: "/history" },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              style={{
                color: item.active ? "#fff" : "#666",
                fontWeight: item.active ? 700 : 400,
                fontSize: "14px",
                textDecoration: "none",
              }}
            >
              {item.label}
            </Link>
          ))}
        </div>
        <ConnectButton />
      </nav>

      <div
        style={{
          textAlign: "center",
          padding: "clamp(28px,4vw,44px) 20px 28px",
        }}
      >
        <h1
          style={{
            color: "#fff",
            fontSize: "clamp(18px,3.5vw,30px)",
            fontWeight: 700,
            margin: "0 0 28px",
            lineHeight: 1.3,
          }}
        >
          Send Money via the rails your family directly uses
        </h1>
        <StepIndicator currentStep={state.step} />
      </div>

      <div
        className="send-flow-shell"
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          padding: "0 clamp(12px,3vw,20px) 60px",
        }}
      >
        <div
          className="send-flow-card"
          style={{
            width: "100%",
            maxWidth: "620px",
            background: "#1a1a1a",
            border: "1px solid #252525",
            borderRadius: "14px",
            padding: "clamp(20px,5vw,36px)",
            overflow: "hidden",
          }}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={state.step}
              variants={slideVariants}
              initial={enterVariant}
              animate="center"
              exit={exitVariant}
              transition={{ duration: 0.26, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              {state.step === 1 && (
                <StepRecipient
                  selectedRecipient={state.selectedRecipient}
                  setRecipientAction={(r) =>
                    setState((s) => ({ ...s, selectedRecipient: r }))
                  }
                  setStepAction={setStep}
                />
              )}
              {state.step === 2 && state.selectedRecipient && (
                <StepAmount
                  recipient={state.selectedRecipient}
                  onNextAction={handleAmountNext}
                  onBackAction={() => setStep(1)}
                />
              )}
              {state.step === 3 && state.selectedRecipient && (
                <StepReview
                  recipient={state.selectedRecipient}
                  amount={state.amount}
                  onSuccessAction={handleSuccess}
                  onBackAction={() => setStep(2)}
                />
              )}
              {state.step === 4 &&
                state.selectedRecipient &&
                state.txId &&
                state.txHash && (
                  <StepSuccess
                    txId={state.txId}
                    txHash={state.txHash}
                    recipient={state.selectedRecipient}
                    amount={state.amount}
                    onResetAction={() => {
                      prevStep.current = 1;
                      setState(INITIAL_STATE);
                    }}
                  />
                )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .send-flow-shell {
            padding: 0 0 24px !important;
          }

          .send-flow-card {
            max-width: 100% !important;
            border-radius: 0 !important;
            border-left: none !important;
            border-right: none !important;
            padding: 18px 14px !important;
          }
        }
      `}</style>
    </div>
  );
}
