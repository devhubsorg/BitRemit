"use client";
import { useVault } from "./useVault";

export type VaultHealthStatus = "safe" | "warning" | "danger";

export interface VaultHealthResult {
  status: VaultHealthStatus;
  label: string;
  color: string;
  message: string;
  collateralRatio: number;
  isLoading: boolean;
}

export function useVaultHealth(customRatio?: number): VaultHealthResult {
  const { collateralRatio: vaultRatio, isLoading } = useVault();
  const collateralRatio = customRatio !== undefined ? customRatio : vaultRatio;

  let status: VaultHealthStatus = "safe";
  let color = "#22c55e";
  let message = "Vault health is good";

  if (collateralRatio > 0 && collateralRatio < 130) {
    status = "danger";
    color = "#ef4444";
    message = "Liquidation risk — act now!";
  } else if (collateralRatio > 0 && collateralRatio <= 150) {
    status = "warning";
    color = "#f59e0b";
    message = "Add collateral soon";
  } else if (collateralRatio === 0) {
    message = "No active vault found";
  }

  return { status, label: message, color, message, collateralRatio, isLoading };
}
