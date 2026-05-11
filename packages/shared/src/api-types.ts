/**
 * Shared API Response Types for BitRemit
 */

export type PaymentRail = "MPESA" | "GCASH" | "MTNMOMO";

export interface VaultResponse {
  collateralAmount: string; // BTC amount as string
  borrowedMUSD: string;    // MUSD amount as string
  collateralRatio: number; // e.g., 185.5 for 185.5%
  maxBorrowable: string;   // MUSD amount as string
  status: "healthy" | "warning" | "danger";
}

export interface RecipientResponse {
  id: string;
  name: string;
  phoneNumber: string;
  paymentRail: PaymentRail;
  createdAt: string; // ISO date string
}

export interface RemittanceResponse {
  txHash: string;
  transactionId: string;
}

export interface TransactionResponse {
  id: string;
  txHash: string;
  musdAmount: string;
  feeAmount: string;
  railType: PaymentRail;
  railReference: string;
  fiatAmount: string;
  fiatCurrency: string;
  status: string;
  blockNumber: number;
  createdAt: string;
  completedAt: string;
  recipient: RecipientResponse;
}

export interface TransactionsListResponse {
  transactions: TransactionResponse[];
  total: number;
  page: number;
  totalPages: number;
}

export interface StatsResponse {
  totalSentUSD: string;
  totalTransactions: number;
  averageFeePercent: string;
  activeSenders: number;
}
