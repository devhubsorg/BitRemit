import { useVault } from "./useVault";

export type VaultHealthStatus = "healthy" | "warning" | "danger";

export interface VaultHealthResult {
  status: VaultHealthStatus;
  color: string;
  message: string;
  collateralRatio: number;
  isLoading: boolean;
}

const MAX_UINT256 = 115792089237316195423570985008687907853269984665640564039457584007913129639935n;

export function useVaultHealth(): VaultHealthResult {
  const { collateralRatio: rawRatio, borrowedMUSD, isLoading } = useVault();

  let collateralRatio = 0;
  
  if (borrowedMUSD === 0n || rawRatio === MAX_UINT256) {
    collateralRatio = Infinity;
  } else {
    // Contract returns raw precision 1000 for 100% (e.g. 1500 = 150%)
    collateralRatio = Number(rawRatio) / 10;
  }

  let status: VaultHealthStatus = "healthy";
  let color = "#22c55e"; // green
  let message = "Vault health is good";

  if (collateralRatio < 130) {
    status = "danger";
    color = "#ef4444"; // red
    message = "Liquidation risk — act now!";
  } else if (collateralRatio <= 150) {
    status = "warning";
    color = "#f59e0b"; // amber
    message = "Add collateral soon";
  }

  return {
    status,
    color,
    message,
    collateralRatio,
    isLoading,
  };
}
