"use client";
import { useAccount, useReadContracts, useBalance } from "wagmi";
import { formatUnits, type Address } from "viem";
import { BitRemitVaultABI } from "@/lib/abis/BitRemitVault";

const VAULT_ADDRESS = process.env.NEXT_PUBLIC_VAULT_ADDRESS as Address;
const TBTC_ADDRESS = process.env.NEXT_PUBLIC_TBTC_ADDRESS as Address;

export interface VaultResult {
  collateralAmount: string;
  displayCollateralAmount: string;
  borrowedMUSD: string;
  collateralRatio: number;
  collateralUsdValue: number;
  collateralChangePercent: number;
  collateralChangeUsd: number;
  maxBorrowable: string;
  tbtcBalance: string;
  isLoading: boolean;
  refetch: () => void;
}

export function useVault(): VaultResult {
  const { address, isConnected } = useAccount();
  const { data: balanceData } = useBalance({ address });
  const { data: tbtcBalanceData } = useBalance({ address, token: TBTC_ADDRESS });

  const { data, isLoading, refetch } = useReadContracts({
    contracts: [
      {
        address: VAULT_ADDRESS,
        abi: BitRemitVaultABI,
        functionName: "vaults",
        args: [address as Address],
      },
      {
        address: VAULT_ADDRESS,
        abi: BitRemitVaultABI,
        functionName: "getCollateralRatio",
        args: [address as Address],
      },
      {
        address: VAULT_ADDRESS,
        abi: BitRemitVaultABI,
        functionName: "getMaxBorrowable",
        args: [address as Address],
      },
    ],
    query: { enabled: isConnected && !!address },
  });

  const vaultsResult = data?.[0].result as readonly [bigint, bigint, bigint] | undefined;
  const collateralRatioRaw = data?.[1].result as bigint | undefined;
  const maxBorrowableRaw = data?.[2].result as bigint | undefined;

  const depositedCollateral = vaultsResult?.[0] ?? 0n;
  const walletBalance = balanceData?.value ?? 0n;
  const totalEffectiveCollateral = depositedCollateral + walletBalance;

  // Mock BTC price — replace with real price feed in production
  const mockBtcPrice = 65000;
  const collateralUsdValue =
    Number(formatUnits(totalEffectiveCollateral, 18)) * mockBtcPrice;

  return {
    collateralAmount: formatUnits(depositedCollateral, 18),
    displayCollateralAmount: formatUnits(totalEffectiveCollateral, 18),
    borrowedMUSD: formatUnits(vaultsResult?.[1] ?? 0n, 18),
    collateralRatio: collateralRatioRaw ? Number(collateralRatioRaw) / 10 : 0,
    collateralUsdValue,
    collateralChangePercent: 0,
    collateralChangeUsd: 0,
    maxBorrowable: formatUnits(maxBorrowableRaw ?? 0n, 18),
    tbtcBalance: formatUnits(tbtcBalanceData?.value ?? 0n, 18),
    isLoading,
    refetch,
  };
}
