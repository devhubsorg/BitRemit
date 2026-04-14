import type { Chain } from "viem";

// ─── Mezo Testnet — Chain ID 31611 ────────────────────────────────────────────
// This is the canonical viem Chain object for the Mezo testnet.
// Use this wherever a raw viem Chain type is required (e.g. publicClient,
// walletClient, createPublicClient, etc.).
//
// For wagmi/RainbowKit configuration, prefer importing mezoTestnet directly
// from @mezo-org/passport — it resolves to the same chain but ensures the
// Passport library and your config stay in sync on updates.
// ─────────────────────────────────────────────────────────────────────────────
export const mezoTestnetChain: Chain = {
  id: 31611,
  name: "Mezo Testnet",
  nativeCurrency: {
    name: "BTC",
    symbol: "BTC",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.test.mezo.org"],
    },
    public: {
      http: ["https://rpc.test.mezo.org"],
    },
  },
  blockExplorers: {
    default: {
      name: "Mezo Explorer",
      url: "https://explorer.test.mezo.org",
    },
  },
  testnet: true,
} as const satisfies Chain;

export default mezoTestnetChain;
