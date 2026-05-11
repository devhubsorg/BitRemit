"use client";

// Wagmi-dependent hooks — must live in apps/web to share the WagmiProvider context
export * from "./useVault";
export * from "./useVaultHealth";
export * from "./useVaultActions";
export * from "./useSendRemittance";

// Non-wagmi hooks from web3 package (safe — no React context dependency)
export * from "web3/hooks/useTransactions";
export * from "web3/hooks/useStats";
