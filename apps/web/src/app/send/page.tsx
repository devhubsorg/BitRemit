"use client";

import Link from "next/link";
import { useAccount } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useState } from "react";

export default function SendPage() {
  const { address, isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [rail, setRail] = useState("MPESA");

  if (!isConnected) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#0a0a0a] px-4 text-center text-white">
        <div className="max-w-md">
          <h1 className="mb-4 text-4xl font-extrabold">Connect Your Wallet</h1>
          <p className="mb-8 text-zinc-400">
            To send money, you need to connect your Bitcoin wallet first.
          </p>
          <button
            onClick={openConnectModal}
            className="inline-flex items-center gap-2 rounded-lg px-6 py-3 font-semibold text-black transition-all hover:scale-105"
            style={{ backgroundColor: "#F7931A" }}
          >
            Connect Wallet
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#0a0a0a] pt-24 text-white">
      <div className="mx-auto w-full max-w-2xl flex-1 px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold">Send Money Home</h1>
          <p className="mt-2 text-zinc-400">
            Connected as {address?.slice(0, 6)}…{address?.slice(-4)}
          </p>
        </div>

        <div
          className="rounded-lg border border-white/10 bg-white/5 p-6 backdrop-blur"
          aria-label="Send money form"
        >
          {/* Payment Rail Selection */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-zinc-300">
              Payment Method
            </label>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {["MPESA", "GCASH", "MTNMOMO"].map((r) => (
                <button
                  key={r}
                  onClick={() => setRail(r)}
                  className={`rounded-md px-3 py-2 text-sm font-medium transition-all ${
                    rail === r
                      ? "text-black"
                      : "border border-white/10 text-zinc-400 hover:border-white/20"
                  }`}
                  style={
                    rail === r
                      ? { backgroundColor: "#F7931A" }
                      : undefined
                  }
                >
                  {r === "MPESA"
                    ? "M-Pesa"
                    : r === "GCASH"
                      ? "GCash"
                      : "MTN MoMo"}
                </button>
              ))}
            </div>
          </div>

          {/* Recipient */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-zinc-300">
              Recipient Phone Number
            </label>
            <input
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="+1234567890"
              className="mt-2 w-full rounded-md border border-white/10 bg-black/50 px-4 py-2 text-white placeholder-zinc-600 focus:border-orange-500 focus:outline-none"
            />
          </div>

          {/* Amount */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-zinc-300">
              Amount (MUSD)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="mt-2 w-full rounded-md border border-white/10 bg-black/50 px-4 py-2 text-white placeholder-zinc-600 focus:border-orange-500 focus:outline-none"
              step="0.01"
              min="0"
            />
          </div>

          {/* CTA */}
          <button
            onClick={() => {
              if (!recipient || !amount) {
                alert("Please fill in all fields");
                return;
              }
              alert(`Sending ${amount} MUSD via ${rail} to ${recipient}`);
            }}
            disabled={!recipient || !amount}
            className="w-full rounded-lg px-4 py-3 font-semibold text-black transition-all hover:scale-105 disabled:scale-100 disabled:opacity-50"
            style={{ backgroundColor: "#F7931A" }}
          >
            Send Money
          </button>
        </div>

        {/* Back link */}
        <div className="mt-8 text-center">
          <Link href="/" className="text-sm text-zinc-500 hover:text-zinc-300">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
