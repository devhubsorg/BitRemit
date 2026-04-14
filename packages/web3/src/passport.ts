import {
  getConfig,
  mezoTestnet,
  unisatWalletMezoTestnet,
  xverseWalletMezoTestnet,
} from "@mezo-org/passport";
import type { Config } from "wagmi";

// ─── Bitcoin wallet group for Mezo Passport ───────────────────────────────────
// Mezo Passport builds on RainbowKit and lets Bitcoin wallets (Xverse, Unisat)
// "masquerade" as EVM wallets via an underlying Mezo smart account. MetaMask
// is included automatically by RainbowKit as a default EVM connector.
// ─────────────────────────────────────────────────────────────────────────────
const bitcoinWallets = [
  {
    groupName: "Bitcoin Wallets",
    wallets: [xverseWalletMezoTestnet, unisatWalletMezoTestnet],
  },
];

// getConfig wraps RainbowKit's createDefaultConfig, pre-configured for Mezo.
// ssr: true prevents hydration mismatches in Next.js App Router.
export const wagmiConfig: Config = getConfig({
  appName: "BitRemit",
  wallets: bitcoinWallets,
  mezoNetwork: "testnet",
  walletConnectProjectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID ?? "",
});

// Re-export the chain so consumers can import from a single place.
export { mezoTestnet };
