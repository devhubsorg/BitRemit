"use client";

import { useEffect } from "react";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { erc20Abi, type Address, type Abi } from "viem";
import BitRemitVaultABIJson from "../abis/BitRemitVault.json";

const BitRemitVaultABI = BitRemitVaultABIJson as Abi;

const VAULT_ADDRESS = process.env.NEXT_PUBLIC_VAULT_ADDRESS as Address;
const TBTC_ADDRESS = (process.env.NEXT_PUBLIC_TBTC_ADDRESS || process.env.TBTC_ADDRESS) as Address;
const MUSD_ADDRESS = process.env.NEXT_PUBLIC_MUSD_ADDRESS as Address;

export interface UseVaultActionProps {
  onSuccess?: () => void;
}

// ---------------------------------------------------------------------------
// 1. Approve tBTC
// ---------------------------------------------------------------------------
export function useApproveTBTC({ onSuccess }: UseVaultActionProps = {}) {
  const { writeContract, data: txHash, isPending: isWritePending, isError } = useWriteContract();

  const { isLoading: isWaiting, isSuccess } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  useEffect(() => {
    if (isSuccess && onSuccess) onSuccess();
  }, [isSuccess, onSuccess]);

  const approveTBTC = async (amount: bigint) => {
    writeContract({
      address: TBTC_ADDRESS,
      abi: erc20Abi,
      functionName: "approve",
      args: [VAULT_ADDRESS, amount],
    });
  };

  return {
    approveTBTC,
    isPending: isWritePending || isWaiting,
    isSuccess,
    isError,
    txHash,
  };
}

// ---------------------------------------------------------------------------
// 2. Deposit Collateral
// ---------------------------------------------------------------------------
export function useDepositCollateral({ onSuccess }: UseVaultActionProps = {}) {
  const { writeContract, data: txHash, isPending: isWritePending, isError } = useWriteContract();

  const { isLoading: isWaiting, isSuccess } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  useEffect(() => {
    if (isSuccess && onSuccess) onSuccess();
  }, [isSuccess, onSuccess]);

  const depositCollateral = async (amount: bigint) => {
    writeContract({
      address: VAULT_ADDRESS,
      abi: BitRemitVaultABI,
      functionName: "depositCollateral",
      args: [amount],
    });
  };

  return {
    depositCollateral,
    isPending: isWritePending || isWaiting,
    isSuccess,
    isError,
    txHash,
  };
}

// ---------------------------------------------------------------------------
// 3. Borrow MUSD
// ---------------------------------------------------------------------------
export function useBorrowMUSD({ onSuccess }: UseVaultActionProps = {}) {
  const { writeContract, data: txHash, isPending: isWritePending, isError } = useWriteContract();

  const { isLoading: isWaiting, isSuccess } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  useEffect(() => {
    if (isSuccess && onSuccess) onSuccess();
  }, [isSuccess, onSuccess]);

  const borrowMUSD = async (amount: bigint) => {
    writeContract({
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
    isError,
    txHash,
  };
}

// ---------------------------------------------------------------------------
// 4. Approve MUSD
// ---------------------------------------------------------------------------
export function useApproveMUSD({ onSuccess }: UseVaultActionProps = {}) {
  const { writeContract, data: txHash, isPending: isWritePending, isError } = useWriteContract();

  const { isLoading: isWaiting, isSuccess } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  useEffect(() => {
    if (isSuccess && onSuccess) onSuccess();
  }, [isSuccess, onSuccess]);

  const approveMUSD = async (amount: bigint) => {
    writeContract({
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
    isError,
    txHash,
  };
}

// ---------------------------------------------------------------------------
// 5. Repay MUSD
// ---------------------------------------------------------------------------
export function useRepayMUSD({ onSuccess }: UseVaultActionProps = {}) {
  const { writeContract, data: txHash, isPending: isWritePending, isError } = useWriteContract();

  const { isLoading: isWaiting, isSuccess } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  useEffect(() => {
    if (isSuccess && onSuccess) onSuccess();
  }, [isSuccess, onSuccess]);

  const repayMUSD = async (amount: bigint) => {
    writeContract({
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
    isError,
    txHash,
  };
}

// ---------------------------------------------------------------------------
// 6. Withdraw Collateral
// ---------------------------------------------------------------------------
export function useWithdrawCollateral({ onSuccess }: UseVaultActionProps = {}) {
  const { writeContract, data: txHash, isPending: isWritePending, isError } = useWriteContract();

  const { isLoading: isWaiting, isSuccess } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  useEffect(() => {
    if (isSuccess && onSuccess) onSuccess();
  }, [isSuccess, onSuccess]);

  const withdrawCollateral = async (amount: bigint) => {
    writeContract({
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
    isError,
    txHash,
  };
}
