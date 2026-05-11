"use client";
import { useState, useEffect, useRef } from "react";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { keccak256, toBytes, parseUnits, type Address } from "viem";
import { RemittanceRouterABI } from "@/lib/abis/RemittanceRouter";

const ROUTER_ADDRESS = process.env.NEXT_PUBLIC_ROUTER_ADDRESS as Address;

interface SendRemittanceParams {
  recipientPhone: string;
  amount: string;
  railType: string;
  recipientId: string;
}

export function useSendRemittance() {
  const { writeContractAsync, data: txHash, isPending: isWritePending, error, reset } = useWriteContract();
  const [isRecording, setIsRecording] = useState(false);
  const pendingData = useRef<SendRemittanceParams | null>(null);

  const { isLoading: isConfirming, isSuccess, isError: isWaitError } = useWaitForTransactionReceipt({ hash: txHash });

  useEffect(() => {
    if (isSuccess && txHash && pendingData.current) {
      const recordTransaction = async () => {
        setIsRecording(true);
        try {
          await fetch("/api/remittance", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              txHash,
              recipientId: pendingData.current!.recipientId,
              amount: pendingData.current!.amount,
              railType: pendingData.current!.railType,
            }),
          });
        } catch (err) {
          console.error("Failed to record remittance in DB:", err);
        } finally {
          setIsRecording(false);
          pendingData.current = null;
        }
      };
      recordTransaction();
    }
  }, [isSuccess, txHash]);

  const sendRemittance = async (params: SendRemittanceParams): Promise<string | undefined> => {
    try {
      pendingData.current = params;
      const recipientPhoneHash = keccak256(toBytes(params.recipientPhone)) as `0x${string}`;
      const amountWei = parseUnits(params.amount, 18);

      const hash = await writeContractAsync({
        address: ROUTER_ADDRESS,
        abi: RemittanceRouterABI,
        functionName: "sendRemittance",
        args: [recipientPhoneHash, amountWei, params.railType],
      });

      return hash;
    } catch (err) {
      console.error("Send remittance failed:", err);
      pendingData.current = null;
      return undefined;
    }
  };

  return { sendRemittance, isPending: isWritePending, isConfirming, isRecording, isSuccess, isError: !!error || isWaitError, error, txHash, reset };
}
