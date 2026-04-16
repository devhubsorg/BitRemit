import { useCallback } from "react";
import { useWriteContract } from "wagmi";
import type { Abi, Address, Hex } from "viem";
import RemittanceRouterABIJson from "../abis/RemittanceRouter.json";

const RemittanceRouterABI = RemittanceRouterABIJson as Abi;

const ROUTER_ADDRESS = process.env
  .NEXT_PUBLIC_ROUTER_ADDRESS as Address;

interface UseSendRemittanceOptions {
  onSuccess?: (txHash: Hex) => void;
}

export function useSendRemittance({
  onSuccess,
}: UseSendRemittanceOptions = {}) {
  const {
    writeContractAsync,
    isPending,
    isSuccess,
    isError,
    data: txHash,
  } = useWriteContract();

  const sendRemittance = useCallback(
    async (
      recipientPhoneHash: Hex,
      amount: bigint,
      railType: string
    ): Promise<Hex> => {
      const hash = await writeContractAsync({
        address: ROUTER_ADDRESS,
        abi: RemittanceRouterABI,
        functionName: "sendRemittance",
        args: [recipientPhoneHash, amount, railType],
      });
      onSuccess?.(hash);
      return hash;
    },
    [writeContractAsync, onSuccess]
  );

  return {
    sendRemittance,
    isPending,
    isSuccess,
    isError,
    txHash,
  };
}
