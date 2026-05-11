"use client";

import { useEffect } from "react";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { erc20Abi, type Address, type Abi } from "viem";
import { BitRemitVaultABI } from "../abis/BitRemitVault";
import { useVault } from "./useVault";

const VAULT_ADDRESS = process.env.NEXT_PUBLIC_VAULT_ADDRESS as Address;
const MUSD_ADDRESS = process.env.NEXT_PUBLIC_MUSD_ADDRESS as Address;

export interface UseVaultActionProps {
  onSuccess?: () => void;
}

/**
 * Hook for depositing Native Mezo BTC as collateral into the BitRemitVault
 */
export function useDepositCollateral({ onSuccess }: UseVaultActionProps = {}) {
  const { writeContractAsync, data: txHash, isPending: isWritePending, isError: isWriteError } = useWriteContract();

  const { isLoading: isWaiting, isSuccess, isError: isWaitError } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  useEffect(() => {
    if (isSuccess && onSuccess) onSuccess();
  }, [isSuccess, onSuccess]);

  const depositCollateral = async (amount: bigint) => {
    // Mocked to use Native Mezo BTC (msg.value)
    await writeContractAsync({
      address: VAULT_ADDRESS,
      abi: BitRemitVaultABI,
      functionName: "depositCollateral",
      args: [0n], // amount arg is ignored if msg.value > 0
      value: amount,
    });
  };

  return {
    depositCollateral,
    isPending: isWritePending || isWaiting,
    isSuccess,
    isError: isWriteError || isWaitError,
    txHash,
  };
}

/**
 * Hook for borrowing MUSD from the BitRemitVault
 */
export function useBorrowMUSD({ onSuccess }: UseVaultActionProps = {}) {
  const { writeContractAsync, data: txHash, isPending: isWritePending, isError: isWriteError } = useWriteContract();
  const { maxBorrowable } = useVault();

  const { isLoading: isWaiting, isSuccess, isError: isWaitError } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  useEffect(() => {
    if (isSuccess && onSuccess) onSuccess();
  }, [isSuccess, onSuccess]);

  const borrowMUSD = async (amount: bigint) => {
    if (amount > maxBorrowable) {
      throw new Error(`Borrow amount exceeds maximum borrowable limit: ${maxBorrowable.toString()}`);
    }

    await writeContractAsync({
      address: VAULT_ADDRESS,
      abi: BitRemitVaultABI,
      functionName: "borrowMUSD",
      args: [amount],
    });
  };

  return {
    borrowMUSD,
    isPending: isWritePending || isWaiting,
    isSuccess,
    isError: isWriteError || isWaitError,
    txHash,
  };
}

/**
 * Hook for approving MUSD spending by the BitRemitVault
 */
export function useApproveMUSD({ onSuccess }: UseVaultActionProps = {}) {
  const { writeContractAsync, data: txHash, isPending: isWritePending, isError: isWriteError } = useWriteContract();

  const { isLoading: isWaiting, isSuccess, isError: isWaitError } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  useEffect(() => {
    if (isSuccess && onSuccess) onSuccess();
  }, [isSuccess, onSuccess]);

  const approveMUSD = async (amount: bigint) => {
    await writeContractAsync({
      address: MUSD_ADDRESS,
      abi: erc20Abi,
      functionName: "approve",
      args: [VAULT_ADDRESS, amount],
    });
  };

  return {
    approveMUSD,
    isPending: isWritePending || isWaiting,
    isSuccess,
    isError: isWriteError || isWaitError,
    txHash,
  };
}

/**
 * Hook for repaying MUSD to the BitRemitVault
 */
export function useRepayMUSD({ onSuccess }: UseVaultActionProps = {}) {
  const { writeContractAsync, data: txHash, isPending: isWritePending, isError: isWriteError } = useWriteContract();

  const { isLoading: isWaiting, isSuccess, isError: isWaitError } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  useEffect(() => {
    if (isSuccess && onSuccess) onSuccess();
  }, [isSuccess, onSuccess]);

  const repayMUSD = async (amount: bigint) => {
    await writeContractAsync({
      address: VAULT_ADDRESS,
      abi: BitRemitVaultABI,
      functionName: "repayMUSD",
      args: [amount],
    });
  };

  return {
    repayMUSD,
    isPending: isWritePending || isWaiting,
    isSuccess,
    isError: isWriteError || isWaitError,
    txHash,
  };
}

/**
 * Hook for withdrawing collateral from the BitRemitVault
 */
export function useWithdrawCollateral({ onSuccess }: UseVaultActionProps = {}) {
  const { writeContractAsync, data: txHash, isPending: isWritePending, isError: isWriteError } = useWriteContract();

  const { isLoading: isWaiting, isSuccess, isError: isWaitError } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  useEffect(() => {
    if (isSuccess && onSuccess) onSuccess();
  }, [isSuccess, onSuccess]);

  const withdrawCollateral = async (amount: bigint) => {
    await writeContractAsync({
      address: VAULT_ADDRESS,
      abi: BitRemitVaultABI,
      functionName: "withdrawCollateral",
      args: [amount],
    });
  };

  return {
    withdrawCollateral,
    isPending: isWritePending || isWaiting,
    isSuccess,
    isError: isWriteError || isWaitError,
    txHash,
  };
}

/**
 * tBTC approval is no longer strictly required for the mock but kept for compatibility
 */
export function useApproveTBTC({ onSuccess }: UseVaultActionProps = {}) {
  return {
    approveTBTC: async () => { if (onSuccess) onSuccess(); },
    isPending: false,
    isSuccess: true,
    isError: false,
    txHash: "0x",
  };
}
