export type VaultHealth = 'safe' | 'warning' | 'danger'

export interface VaultResponse {
  collateralAmount: string     // tBTC amount (e.g. "0.05")
  borrowedMUSD: string         // MUSD borrowed (e.g. "1250")
  collateralRatio: number      // e.g. 185
  collateralUsdValue: number   // USD value of collateral
  collateralChangePercent: number // 24h % change e.g. 2.4
  collateralChangeUsd: number     // 24h USD change e.g. 124.50
  maxBorrowable: string
  isLoading: boolean
  refetch: () => void
}

export interface VaultHealthResult {
  status: VaultHealth
  label: string
  color: string
}

export type PaymentRail = 'MPESA' | 'GCASH' | 'MTNMOMO'
export type TxStatus = 'PENDING' | 'CONFIRMED_ONCHAIN' | 'OFFRAMP_PROCESSING' | 'COMPLETED' | 'FAILED'

export interface TransactionResponse {
  id: string
  recipient: {
    name: string
    phoneNumber: string
    avatarUrl?: string
    initials: string
  }
  railType: PaymentRail
  musdAmount: string
  fiatAmount: string
  fiatCurrency: string
  status: TxStatus
  createdAt: string // ISO string
  txHash?: string
}

export interface StatsResponse {
  totalSentMUSD: string
  totalRecipients: number
  avgTransferTimeSeconds: number
}
