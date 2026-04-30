"use client";

import {
  getConfig,
  unisatWalletMezoTestnet,
  xverseWalletMezoTestnet,
} from "@mezo-org/passport/dist/src/config";
import { mezoTestnet } from "@mezo-org/passport/dist/src/constants";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { injectedWallet, metaMaskWallet } from "@rainbow-me/rainbowkit/wallets";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import { WagmiProvider } from "wagmi";

const wagmiConfig = getConfig({
  appName: "BitRemit",
  wallets: [
    {
      groupName: "Bitcoin Wallets",
      wallets: [xverseWalletMezoTestnet, unisatWalletMezoTestnet],
    },
    {
      groupName: "EVM Wallets",
      wallets: [injectedWallet, metaMaskWallet],
    },
  ],
  mezoNetwork: "testnet",
  walletConnectProjectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID ?? "",
});

// Instantiate QueryClient inside a useState so it is created once per
// component mount and not shared between server requests.
export function Web3Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Stale time of 10 s prevents hammering RPCs on every re-render.
            staleTime: 10_000,
          },
        },
      }),
  );

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider initialChain={mezoTestnet}>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
