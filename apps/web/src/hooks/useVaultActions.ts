"use client";
import { useEffect } from "react";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { erc20Abi, type Address } from "viem";
import { BitRemitVaultABI } from "@/lib/abis/BitRemitVault";
import { useVault } from "./useVault";

const VAULT_ADDRESS = process.env.NEXT_PUBLIC_VAULT_ADDRESS as Address;
const MUSD_ADDRESS = process.env.NEXT_PUBLIC_MUSD_ADDRESS as Address;

export interface UseVaultActionProps {
  onSuccess?: () => void;
}

export function useDepositCollateral({ onSuccess }: UseVaultActionProps = {}) {
  const { writeContractAsync, data: txHash, isPending: isWritePending, isError: isWriteError } = useWriteContract();
  const { isLoading: isWaiting, isSuccess, isError: isWaitError } = useWaitForTransactionReceipt({ hash: txHash });

  useEffect(() => {
    if (isSuccess && onSuccess) onSuccess();
  }, [isSuccess, onSuccess]);

  const depositCollateral = async (amount: bigint) => {
    await writeContractAsync({
      address: VAULT_ADDRESS,
      abi: BitRemitVaultABI,
      functionName: "depositCollateral",
      args: [0n],
      value: amount,
    });
  };

  return { depositCollateral, isPending: isWritePending || isWaiting, isSuccess, isError: isWriteError || isWaitError, txHash };
}

export function useBorrowMUSD({ onSuccess }: UseVaultActionProps = {}) {
  const { writeContractAsync, data: txHash, isPending: isWritePending, isError: isWriteError } = useWriteContract();
  const { maxBorrowable } = useVault();
  const { isLoading: isWaiting, isSuccess, isError: isWaitError } = useWaitForTransactionReceipt({ hash: txHash });

  useEffect(() => {
    if (isSuccess && onSuccess) onSuccess();
  }, [isSuccess, onSuccess]);

  const borrowMUSD = async (amount: bigint) => {
    const maxBig = BigInt(Math.floor(Number(maxBorrowable) * 1e18));
    if (amount > maxBig) throw new Error(`Borrow amount exceeds maximum borrowable`);
    await writeContractAsync({ address: VAULT_ADDRESS, abi: BitRemitVaultABI, functionName: "borrowMUSD", args: [amount] });
  };

  return { borrowMUSD, isPending: isWritePending || isWaiting, isSuccess, isError: isWriteError || isWaitError, txHash };
}

export function useApproveMUSD({ onSuccess }: UseVaultActionProps = {}) {
  const { writeContractAsync, data: txHash, isPending: isWritePending, isError: isWriteError } = useWriteContract();
  const { isLoading: isWaiting, isSuccess, isError: isWaitError } = useWaitForTransactionReceipt({ hash: txHash });

  useEffect(() => {
    if (isSuccess && onSuccess) onSuccess();
  }, [isSuccess, onSuccess]);

  const approveMUSD = async (amount: bigint) => {
    await writeContractAsync({ address: MUSD_ADDRESS, abi: erc20Abi, functionName: "approve", args: [VAULT_ADDRESS, amount] });
  };

  return { approveMUSD, isPending: isWritePending || isWaiting, isSuccess, isError: isWriteError || isWaitError, txHash };
}

export function useRepayMUSD({ onSuccess }: UseVaultActionProps = {}) {
  const { writeContractAsync, data: txHash, isPending: isWritePending, isError: isWriteError } = useWriteContract();
  const { isLoading: isWaiting, isSuccess, isError: isWaitError } = useWaitForTransactionReceipt({ hash: txHash });

  useEffect(() => {
    if (isSuccess && onSuccess) onSuccess();
  }, [isSuccess, onSuccess]);

  const repayMUSD = async (amount: bigint) => {
    await writeContractAsync({ address: VAULT_ADDRESS, abi: BitRemitVaultABI, functionName: "repayMUSD", args: [amount] });
  };

  return { repayMUSD, isPending: isWritePending || isWaiting, isSuccess, isError: isWriteError || isWaitError, txHash };
}

export function useWithdrawCollateral({ onSuccess }: UseVaultActionProps = {}) {
  const { writeContractAsync, data: txHash, isPending: isWritePending, isError: isWriteError } = useWriteContract();
  const { isLoading: isWaiting, isSuccess, isError: isWaitError } = useWaitForTransactionReceipt({ hash: txHash });

  useEffect(() => {
    if (isSuccess && onSuccess) onSuccess();
  }, [isSuccess, onSuccess]);

  const withdrawCollateral = async (amount: bigint) => {
    await writeContractAsync({ address: VAULT_ADDRESS, abi: BitRemitVaultABI, functionName: "withdrawCollateral", args: [amount] });
  };

  return { withdrawCollateral, isPending: isWritePending || isWaiting, isSuccess, isError: isWriteError || isWaitError, txHash };
}

/** tBTC approval no-op — kept for interface compatibility */
export function useApproveTBTC({ onSuccess }: UseVaultActionProps = {}) {
  return {
    approveTBTC: async (_amount: bigint) => { if (onSuccess) onSuccess(); },
    isPending: false,
    isSuccess: true,
    isError: false,
    txHash: "0x" as `0x${string}`,
  };
}
