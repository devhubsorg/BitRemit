// Server-safe exports only — no wagmi/React hooks here.
// Wagmi-dependent hooks (useVault, useVaultActions, etc.) live in apps/web/src/hooks/
// to share the same WagmiProvider context instance.

export * from "./authMiddleware";
export * from "./hooks/useTransactions";
export * from "./hooks/useStats";
