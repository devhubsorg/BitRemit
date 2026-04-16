import { useAccount, useReadContracts } from "wagmi";
import type { Abi, Address } from "viem";
import BitRemitVaultABIJson from "../abis/BitRemitVault.json";

const BitRemitVaultABI = BitRemitVaultABIJson as Abi;

const VAULT_ADDRESS = process.env
  .NEXT_PUBLIC_VAULT_ADDRESS as Address;

export function useVault() {
  const { address, isConnected } = useAccount();

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
    query: {
      enabled: isConnected && !!address,
    },
  });

  const vaultsResult = data?.[0].result as
    | readonly [bigint, bigint, bigint]
    | undefined;
  const collateralRatio = data?.[1].result as bigint | undefined;
  const maxBorrowable = data?.[2].result as bigint | undefined;

  return {
    collateralAmount: vaultsResult?.[0] ?? 0n,
    borrowedMUSD: vaultsResult?.[1] ?? 0n,
    collateralRatio: collateralRatio ?? 0n,
    maxBorrowable: maxBorrowable ?? 0n,
    isLoading,
    refetch,
  };
}
