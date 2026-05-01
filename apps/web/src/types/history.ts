export type TxStatus = 'PENDING' | 'CONFIRMED_ONCHAIN' | 'OFFRAMP_PROCESSING' | 'COMPLETED' | 'FAILED'
export type PaymentRail = 'MPESA' | 'GCASH' | 'MTNMOMO'

export interface TxRecipient {
  name: string
  phoneNumber: string
  initials: string
}

export interface TransactionRow {
  id: string
  createdAt: string
  confirmedAt?: string
  completedAt?: string
  recipient: TxRecipient
  railType: PaymentRail
  musdAmount: string
  fiatAmount: string
  fiatCurrency: string
  status: TxStatus
  txHash?: string
  blockNumber?: number
  railReference?: string
  feeAmount: string
}

export interface TransactionsResponse {
  transactions: TransactionRow[]
  total: number
  page: number
  totalPages: number
  summary: {
    totalSentMUSD: string
    totalFeesMUSD: string
    mostUsedRail: PaymentRail | null
  }
}

export interface HistoryFilters {
  page: number
  status: TxStatus | 'ALL'
  railType: PaymentRail | 'ALL'
  startDate: string
  endDate: string
  searchQuery: string
}

export const RAIL_CONFIG: Record<PaymentRail, { label: string; bg: string; color: string }> = {
  MPESA:   { label: 'M-Pesa',   bg: 'rgba(34,197,94,0.15)',  color: '#22c55e' },
  GCASH:   { label: 'GCash',    bg: 'rgba(59,130,246,0.15)', color: '#60a5fa' },
  MTNMOMO: { label: 'MTN MoMo', bg: 'rgba(168,85,247,0.15)', color: '#c084fc' },
}

export const STATUS_CONFIG: Record<TxStatus, { label: string; bg: string; color: string }> = {
  PENDING:            { label: 'Pending',    bg: 'rgba(234,179,8,0.15)',  color: '#eab308' },
  CONFIRMED_ONCHAIN:  { label: 'Confirmed',  bg: 'rgba(59,130,246,0.15)', color: '#60a5fa' },
  OFFRAMP_PROCESSING: { label: 'Processing', bg: 'rgba(59,130,246,0.15)', color: '#60a5fa' },
  COMPLETED:          { label: 'Completed',  bg: 'rgba(34,197,94,0.15)',  color: '#22c55e' },
  FAILED:             { label: 'Failed',     bg: 'rgba(239,68,68,0.15)',  color: '#ef4444' },
}

export const LIMIT = 10
