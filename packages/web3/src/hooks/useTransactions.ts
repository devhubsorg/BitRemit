"use client";
import { useState, useEffect, useCallback } from "react";

export type PaymentRail = "MPESA" | "GCASH" | "MTNMOMO";
export type TxStatus = "PENDING" | "CONFIRMED_ONCHAIN" | "OFFRAMP_PROCESSING" | "COMPLETED" | "FAILED";

export interface Transaction {
  id: string;
  txHash?: string;
  recipient: {
    name: string;
    phoneNumber: string;
    avatarUrl?: string;
    initials: string;
  };
  railType: PaymentRail;
  musdAmount: string;
  fiatAmount: string;
  fiatCurrency: string;
  status: TxStatus;
  createdAt: string;
}

interface TransactionsState {
  transactions: Transaction[];
  total: number;
  isLoading: boolean;
  refetchTransactions: () => void;
}

export function useTransactions(page = 1, limit = 20): TransactionsState {
  const [state, setState] = useState<Omit<TransactionsState, "refetchTransactions">>({
    transactions: [],
    total: 0,
    isLoading: true,
  });

  const fetchTransactions = useCallback(() => {
    setState((prev) => ({ ...prev, isLoading: true }));

    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });

    fetch(`/api/transactions?${params.toString()}`)
      .then((res) => {
        // 401 = not authenticated — show empty state silently
        if (res.status === 401) return null;
        // Any other non-ok status — log and show empty
        if (!res.ok) {
          console.warn(`[useTransactions] API returned ${res.status}`);
          return null;
        }
        return res.json() as Promise<{
          transactions: Transaction[];
          total: number;
        }>;
      })
      .then((data) => {
        if (data) {
          setState({ transactions: data.transactions, total: data.total, isLoading: false });
        } else {
          setState((prev) => ({ ...prev, transactions: [], total: 0, isLoading: false }));
        }
      })
      .catch((err) => {
        console.error("useTransactions error:", err);
        setState((prev) => ({ ...prev, isLoading: false }));
      });
  }, [page, limit]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  return {
    ...state,
    refetchTransactions: fetchTransactions,
  };
}
