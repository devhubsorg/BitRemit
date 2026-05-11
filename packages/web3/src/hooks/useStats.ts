"use client";
import { useState, useEffect } from "react";

export interface ProtocolStats {
  totalSentUSD: string;
  totalTransactions: number;
  averageFeePercent: string;
  activeSenders: number;
  totalSentMUSD: string;
  totalRecipients: number;
  avgTransferTimeSeconds: number;
  isLoading: boolean;
}

export function useStats(): ProtocolStats {
  const [stats, setStats] = useState<ProtocolStats>({
    totalSentUSD: "0",
    totalTransactions: 0,
    averageFeePercent: "1",
    activeSenders: 0,
    totalSentMUSD: "0",
    totalRecipients: 0,
    avgTransferTimeSeconds: 0,
    isLoading: true,
  });

  useEffect(() => {
    let cancelled = false;

    fetch("/api/stats")
      .then((res) => {
        if (!res.ok) {
          console.warn(`[useStats] API returned ${res.status}`);
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (!cancelled && data) {
          setStats((prev) => ({ ...prev, ...data, isLoading: false }));
        } else if (!cancelled) {
          setStats((prev) => ({ ...prev, isLoading: false }));
        }
      })
      .catch((err) => {
        console.error("Failed to fetch protocol stats:", err);
        if (!cancelled) {
          setStats((prev) => ({ ...prev, isLoading: false }));
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return stats;
}
