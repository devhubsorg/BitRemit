'use client'

import { useCallback, useEffect, useState } from 'react'
import BitRemitVaultABIJson from 'web3/src/abis/BitRemitVault.json'
import type { Abi, Address } from 'viem'
import { parseUnits } from 'viem'
import { useAccount, useWriteContract } from 'wagmi'
import type {
  VaultResponse,
  VaultHealthResult,
  TransactionResponse,
  StatsResponse,
} from '../types'

const BitRemitVaultABI = BitRemitVaultABIJson as Abi
const VAULT_ADDRESS = process.env.NEXT_PUBLIC_VAULT_ADDRESS as Address

// ─── useVault ────────────────────────────────────────────────────────────────

export function useVault(): VaultResponse {
  const { address } = useAccount()
  const [data, setData] = useState<Omit<VaultResponse, 'isLoading' | 'refetch'>>({
    collateralAmount: '0',
    borrowedMUSD: '0',
    collateralRatio: 0,
    collateralUsdValue: 0,
    collateralChangePercent: 0,
    collateralChangeUsd: 0,
    maxBorrowable: '0',
  })
  const [isLoading, setIsLoading] = useState(true)

  const fetchVault = useCallback(async () => {
    if (!address) return
    try {
      const res = await fetch('/api/vault', {
        headers: { 'Content-Type': 'application/json' },
      })
      if (!res.ok) throw new Error('Failed to fetch vault')
      const json = await res.json()
      setData(json)
    } catch {
      // keep previous data on error
    } finally {
      setIsLoading(false)
    }
  }, [address])

  useEffect(() => {
    fetchVault()
  }, [fetchVault])

  return { ...data, isLoading, refetch: fetchVault }
}

// ─── useVaultHealth ───────────────────────────────────────────────────────────

export function useVaultHealth(collateralRatio: number): VaultHealthResult {
  if (collateralRatio >= 150) {
    return { status: 'safe', label: 'Safe Zone (>150%)', color: '#22c55e' }
  }
  if (collateralRatio >= 130) {
    return { status: 'warning', label: 'Warning Zone (130–150%)', color: '#f59e0b' }
  }
  return { status: 'danger', label: 'Danger Zone (<130%)', color: '#ef4444' }
}

// ─── useTransactions ─────────────────────────────────────────────────────────

export function useTransactions(page = 1, limit = 5) {
  const { address } = useAccount()
  const [transactions, setTransactions] = useState<TransactionResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [total, setTotal] = useState(0)

  const fetchTransactions = useCallback(async () => {
    if (!address) return
    try {
      const res = await fetch(`/api/transactions?page=${page}&limit=${limit}`, {
        headers: { 'Content-Type': 'application/json' },
      })
      if (!res.ok) throw new Error('Failed to fetch transactions')
      const json = await res.json()
      setTransactions(json.transactions)
      setTotal(json.total)
    } catch {
      // keep previous data
    } finally {
      setIsLoading(false)
    }
  }, [address, page, limit])

  useEffect(() => {
    fetchTransactions()
  }, [fetchTransactions])

  return { transactions, total, isLoading, refetchTransactions: fetchTransactions }
}

// ─── useStats ────────────────────────────────────────────────────────────────

export function useStats(): StatsResponse & { isLoading: boolean } {
  const { address } = useAccount()
  const [stats, setStats] = useState<StatsResponse>({
    totalSentMUSD: '0',
    totalRecipients: 0,
    avgTransferTimeSeconds: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!address) return
    fetch('/api/stats')
      .then((r) => r.json())
      .then((data) => setStats(data))
      .catch(() => {})
      .finally(() => setIsLoading(false))
  }, [address])

  return { ...stats, isLoading }
}

// ─── useDepositCollateral ─────────────────────────────────────────────────────

export function useDepositCollateral() {
  const { writeContractAsync } = useWriteContract()
  const [isPending, setIsPending] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const deposit = useCallback(async (amount: string) => {
    setIsPending(true)
    setError(null)
    setIsSuccess(false)
    try {
      await writeContractAsync({
        address: VAULT_ADDRESS,
        abi: BitRemitVaultABI,
        functionName: 'depositCollateral',
        args: [parseUnits(amount, 18)],
      })
      setIsSuccess(true)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error')
    } finally {
      setIsPending(false)
    }
  }, [writeContractAsync])

  return { deposit, isPending, isSuccess, error }
}

// ─── useRepayMUSD ─────────────────────────────────────────────────────────────

export function useRepayMUSD() {
  const { writeContractAsync } = useWriteContract()
  const [isPending, setIsPending] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const repay = useCallback(async (amount: string) => {
    setIsPending(true)
    setError(null)
    setIsSuccess(false)
    try {
      await writeContractAsync({
        address: VAULT_ADDRESS,
        abi: BitRemitVaultABI,
        functionName: 'repayMUSD',
        args: [parseUnits(amount, 18)],
      })
      setIsSuccess(true)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error')
    } finally {
      setIsPending(false)
    }
  }, [writeContractAsync])

  return { repay, isPending, isSuccess, error }
}
