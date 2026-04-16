import { useState, useEffect } from "react";

export interface Transaction {
  id: string;
  txHash: string;
  recipientPhoneHash: string;
  amount: string;
  railType: string;
  status: string;
  createdAt: string;
}

interface TransactionsState {
  transactions: Transaction[];
  total: number;
  isLoading: boolean;
}

export function useTransactions(page = 1, limit = 20): TransactionsState {
  const [state, setState] = useState<TransactionsState>({
    transactions: [],
    total: 0,
    isLoading: true,
  });

  useEffect(() => {
    setState((prev: TransactionsState) => ({ ...prev, isLoading: true }));

    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });

    fetch(`/api/transactions?${params.toString()}`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<{
          transactions: Transaction[];
          total: number;
        }>;
      })
      .then(({ transactions, total }) =>
        setState({ transactions, total, isLoading: false })
      )
      .catch(() =>
        setState((prev: TransactionsState) => ({ ...prev, isLoading: false }))
      );
  }, [page, limit]);

  return state;
}
