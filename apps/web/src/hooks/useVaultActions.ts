"use client";
import { useEffect } from "react";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { erc20Abi, type Address } from "viem";
import { BitRemitVaultABI } from "@/lib/abis/BitRemitVault";
import { useVault } from "./useVault";

const VAULT_ADDRESS = process.env.NEXT_PUBLIC_VAULT_ADDRESS as Address;
const MUSD_ADDRESS = process.env.NEXT_PUBLIC_MUSD_ADDRESS as Address;
const TBTC_ADDRESS = process.env.NEXT_PUBLIC_TBTC_ADDRESS as Address;
const ROUTER_ADDRESS = process.env.NEXT_PUBLIC_ROUTER_ADDRESS as Address;

const mockTbtcAbi = [
  ...erc20Abi,
  {
    "type": "function",
    "name": "mint",
    "inputs": [
      { "name": "to", "type": "address", "internalType": "address" },
      { "name": "amount", "type": "uint256", "internalType": "uint256" }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  }
] as const;

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
    return await writeContractAsync({
      address: VAULT_ADDRESS,
      abi: BitRemitVaultABI,
      functionName: "depositCollateral",
      args: [amount],
      value: 0n, // Using tBTC ERC20 path
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
    return await writeContractAsync({ address: VAULT_ADDRESS, abi: BitRemitVaultABI, functionName: "borrowMUSD", args: [amount] });
  };

  return { borrowMUSD, isPending: isWritePending || isWaiting, isSuccess, isError: isWriteError || isWaitError, txHash };
}

export function useApproveMUSD({ onSuccess }: UseVaultActionProps = {}) {
  const { writeContractAsync, data: txHash, isPending: isWritePending, isError: isWriteError } = useWriteContract();
  const { isLoading: isWaiting, isSuccess, isError: isWaitError } = useWaitForTransactionReceipt({ hash: txHash });

  useEffect(() => {
    if (isSuccess && onSuccess) onSuccess();
  }, [isSuccess, onSuccess]);

  const approveMUSD = async (amount: bigint, spender: Address = VAULT_ADDRESS) => {
    return await writeContractAsync({ address: MUSD_ADDRESS, abi: erc20Abi, functionName: "approve", args: [spender, amount] });
  };

  return { approveMUSD, isPending: isWritePending || isWaiting, isSuccess, isError: isWriteError || isWaitError, txHash };
}

export function useApproveMUSDForRouter({ onSuccess }: UseVaultActionProps = {}) {
  const { writeContractAsync, data: txHash, isPending: isWritePending, isError: isWriteError } = useWriteContract();
  const { isLoading: isWaiting, isSuccess, isError: isWaitError } = useWaitForTransactionReceipt({ hash: txHash });

  useEffect(() => {
    if (isSuccess && onSuccess) onSuccess();
  }, [isSuccess, onSuccess]);

  const approveRouter = async (amount: bigint) => {
    return await writeContractAsync({ address: MUSD_ADDRESS, abi: erc20Abi, functionName: "approve", args: [ROUTER_ADDRESS, amount] });
  };

  return { approveRouter, isPending: isWritePending || isWaiting, isSuccess, isError: isWriteError || isWaitError, txHash };
}

export function useRepayMUSD({ onSuccess }: UseVaultActionProps = {}) {
  const { writeContractAsync, data: txHash, isPending: isWritePending, isError: isWriteError } = useWriteContract();
  const { isLoading: isWaiting, isSuccess, isError: isWaitError } = useWaitForTransactionReceipt({ hash: txHash });

  useEffect(() => {
    if (isSuccess && onSuccess) onSuccess();
  }, [isSuccess, onSuccess]);

  const repayMUSD = async (amount: bigint) => {
    return await writeContractAsync({ address: VAULT_ADDRESS, abi: BitRemitVaultABI, functionName: "repayMUSD", args: [amount] });
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
    return await writeContractAsync({ address: VAULT_ADDRESS, abi: BitRemitVaultABI, functionName: "withdrawCollateral", args: [amount] });
  };

  return { withdrawCollateral, isPending: isWritePending || isWaiting, isSuccess, isError: isWriteError || isWaitError, txHash };
}

/** Real tBTC approval for collateral deposit */
export function useApproveTBTC({ onSuccess }: UseVaultActionProps = {}) {
  const { writeContractAsync, data: txHash, isPending: isWritePending, isError: isWriteError } = useWriteContract();
  const { isLoading: isWaiting, isSuccess, isError: isWaitError } = useWaitForTransactionReceipt({ hash: txHash });

  useEffect(() => {
    if (isSuccess && onSuccess) onSuccess();
  }, [isSuccess, onSuccess]);

  const approveTBTC = async (amount: bigint) => {
    return await writeContractAsync({ address: TBTC_ADDRESS, abi: erc20Abi, functionName: "approve", args: [VAULT_ADDRESS, amount] });
  };

  return { approveTBTC, isPending: isWritePending || isWaiting, isSuccess, isError: isWriteError || isWaitError, txHash };
}

/** Mint Mock tBTC for testing */
export function useMintTBTC({ onSuccess }: UseVaultActionProps = {}) {
  const { writeContractAsync, data: txHash, isPending: isWritePending, isError: isWriteError } = useWriteContract();
  const { isLoading: isWaiting, isSuccess, isError: isWaitError } = useWaitForTransactionReceipt({ hash: txHash });

  useEffect(() => {
    if (isSuccess && onSuccess) onSuccess();
  }, [isSuccess, onSuccess]);

  const mintTBTC = async (to: Address, amount: bigint) => {
    return await writeContractAsync({ address: TBTC_ADDRESS, abi: mockTbtcAbi, functionName: "mint", args: [to, amount] });
  };

  return { mintTBTC, isPending: isWritePending || isWaiting, isSuccess, isError: isWriteError || isWaitError, txHash };
}
