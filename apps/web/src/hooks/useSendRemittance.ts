"use client";

import { useWriteContract } from "wagmi";
import type { Address } from "viem";
import RemittanceRouterABIJson from "web3/src/abis/RemittanceRouter.json";
import type { Abi } from "viem";
import { keccak256, toBytes } from "viem";

const RemittanceRouterABI = RemittanceRouterABIJson as Abi;
const ROUTER_ADDRESS = process.env.NEXT_PUBLIC_ROUTER_ADDRESS as Address;

interface SendRemittanceParams {
  recipientPhone: string;
  amount: bigint;
  railType: string;
}

export function useSendRemittance() {
  const { writeContractAsync, isPending, error, reset } = useWriteContract();

  const sendRemittance = async ({
    recipientPhone,
    amount,
    railType,
  }: SendRemittanceParams): Promise<`0x${string}` | undefined> => {
    try {
      const recipientPhoneHash = keccak256(toBytes(recipientPhone)) as `0x${string}`;
      const hash = await writeContractAsync({
        address: ROUTER_ADDRESS,
        abi: RemittanceRouterABI,
        functionName: "sendRemittance",
        args: [recipientPhoneHash, amount, railType],
      });
      return hash;
    } catch {
      return undefined;
    }
  };

  return { sendRemittance, isPending, error, reset };
}
