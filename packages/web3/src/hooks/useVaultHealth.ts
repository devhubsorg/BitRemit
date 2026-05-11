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

/**
 * useVaultHealth()
 *
 * Derives the visual health status and messaging for a user's vault
 * based on their on-chain collateralization ratio.
 */
export function useVaultHealth(customRatio?: number): VaultHealthResult {
  const { collateralRatio: vaultRatio, isLoading } = useVault();
  
  const collateralRatio = customRatio !== undefined ? customRatio : vaultRatio;

  // Thresholds: safe > 150%, warning 130-150%, danger < 130%
  let status: VaultHealthStatus = "safe";
  let color = "#22c55e"; // Green
  let message = "Vault health is good";

  if (collateralRatio > 0 && collateralRatio < 130) {
    status = "danger";
    color = "#ef4444"; // Red
    message = "Liquidation risk — act now!";
  } else if (collateralRatio > 0 && collateralRatio <= 150) {
    status = "warning";
    color = "#f59e0b"; // Amber
    message = "Add collateral soon";
  }
 else if (collateralRatio === 0) {
    // Edge case: No vault/no collateral
    message = "No active vault found";
  }

  return {
    status,
    label: message, // Dashboard UI expects 'label'
    color,
    message,
    collateralRatio,
    isLoading,
  };
}
