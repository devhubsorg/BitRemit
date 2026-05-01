export type PaymentRail = "MPESA" | "GCASH" | "MTNMOMO";

export interface RecipientResponse {
  id: string;
  name: string;
  phoneNumber: string;
  paymentRail: PaymentRail;
  initials: string;
  custodialAddress: string;
}

export interface SendFlowState {
  step: 1 | 2 | 3 | 4;
  selectedRecipient: RecipientResponse | null;
  amount: string;
  txId: string | null;
}

export const COUNTRY_CODES = [
  { code: "+234", label: "Nigeria (+234)", flag: "🇳🇬" },
  { code: "+63", label: "Philippines (+63)", flag: "🇵🇭" },
  { code: "+233", label: "Ghana (+233)", flag: "🇬🇭" },
  { code: "+254", label: "Kenya (+254)", flag: "🇰🇪" },
  { code: "+255", label: "Tanzania (+255)", flag: "🇹🇿" },
  { code: "+256", label: "Uganda (+256)", flag: "🇺🇬" },
] as const;

export const RAIL_TO_CURRENCY: Record<PaymentRail, { code: string; rate: number }> = {
  MPESA:   { code: 'KES', rate: 130.35 },
  GCASH:   { code: 'PHP', rate: 56.4 },
  MTNMOMO: { code: 'NGN', rate: 1620 },
}

export const RAIL_CONFIG: Record<
  PaymentRail,
  { label: string; bg: string; color: string }
> = {
  MPESA: { label: "M-PESA", bg: "rgba(34,197,94,0.18)", color: "#22c55e" },
  GCASH: { label: "GCASH", bg: "rgba(59,130,246,0.18)", color: "#60a5fa" },
  MTNMOMO: { label: "MTN MOMO", bg: "rgba(168,85,247,0.18)", color: "#c084fc" },
};
