'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAccount } from 'wagmi'
import { ConnectButton } from '@/components/ConnectButton'
import { FilterBar } from '@/components/history/FilterBar'
import { ExpandableRow, COL_WIDTHS } from '@/components/history/ExpandableRow'
import { SummaryBar, Pagination } from '@/components/history/SummaryAndPagination'
import { Skeleton } from '@/components/ui/skeleton'
import type {
  HistoryFilters,
  TransactionsResponse,
} from '@/types/history'
import { exportToCSV, buildQueryString } from '@/lib/history/utils'
import { useToast } from '@/hooks/use-toast'

const INITIAL_FILTERS: HistoryFilters = {
  page: 1,
  status: 'ALL',
  railType: 'ALL',
  startDate: '',
  endDate: '',
  searchQuery: '',
}

const COLUMNS = [
  { label: 'Date', key: 'date' },
  { label: 'Recipient', key: 'recipient' },
  { label: 'Sent', key: 'sent' },
  { label: 'Received', key: 'received' },
  { label: 'Status', key: 'status' },
  { label: '', key: 'expand' },
]

type SessionReadyResult = 'ready' | 'unauthorized' | 'forbidden' | 'error'

async function waitForSessionReady(maxAttempts = 5, delayMs = 500): Promise<SessionReadyResult> {
  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const res = await fetch('/api/auth/session', {
      cache: 'no-store',
      credentials: 'same-origin',
    })

    if (res.ok) {
      return 'ready'
    }

    if (res.status === 403) {
      return 'forbidden'
    }

    if (res.status !== 401) {
      return 'error'
    }

    if (attempt < maxAttempts - 1) {
      await new Promise((resolve) => setTimeout(resolve, delayMs))
    }
  }

  return 'unauthorized'
}

const SESSION_RETRY_LIMIT = 10

export default function HistoryPage() {
  const router = useRouter()
  const { status } = useAccount()
  const mounted = useRef(false)
  const sessionRetryRef = useRef(0)
  const retryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [filters, setFilters] = useState<HistoryFilters>(INITIAL_FILTERS)
  const [data, setData] = useState<TransactionsResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [isExporting, setIsExporting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    mounted.current = true
  }, [])

  useEffect(() => {
    if (mounted.current && status === 'disconnected') router.push('/')
  }, [status, router])

  useEffect(() => {
    return () => {
      if (retryTimerRef.current) {
        clearTimeout(retryTimerRef.current)
      }
    }
  }, [])

  const fetchTransactions = useCallback(async (f: HistoryFilters) => {
    setLoading(true)
    setError(null)
    try {
      const sessionState = await waitForSessionReady(6, 500)
      if (sessionState !== 'ready') {
        if (sessionState === 'forbidden') {
          throw new Error('Access blocked by Vercel Security Checkpoint. Complete the checkpoint and reload.')
        }

        if (sessionState === 'unauthorized') {
          if (status === 'connected' && sessionRetryRef.current < SESSION_RETRY_LIMIT) {
            sessionRetryRef.current += 1
            setError('Finalizing wallet session...')
            setLoading(false)

            if (retryTimerRef.current) {
              clearTimeout(retryTimerRef.current)
            }

            retryTimerRef.current = setTimeout(() => {
              void fetchTransactions(f)
            }, 1200)
            return
          }

          throw new Error('Wallet is connected but sign-in was not completed. Click Connect Wallet and approve the signature, then Retry.')
        }

        throw new Error('Unable to verify wallet session right now. Please retry in a moment.')
      }

      sessionRetryRef.current = 0

      const qs = buildQueryString({
        page: f.page,
        status: f.status,
        railType: f.railType,
        startDate: f.startDate,
        endDate: f.endDate,
        searchQuery: f.searchQuery,
        limit: 10,
      })
      const res = await fetch(`/api/transactions${qs}`, {
        credentials: 'same-origin',
      })
      if (res.status === 401) {
        throw new Error('Wallet session missing. Click Connect Wallet and approve signature, then Retry.')
      }
      if (!res.ok) throw new Error(`Request failed: ${res.status}`)
      const json: TransactionsResponse = await res.json()
      setData(json)
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Failed to load transactions'
      setError(message)
      toast({
        title: 'Something went wrong',
        description: message,
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }, [status])

  useEffect(() => {
    if (status === 'connected') fetchTransactions(filters)
  }, [filters, status, fetchTransactions])

  const updateFilters = (partial: Partial<HistoryFilters>) => {
    setFilters((prev) => ({ ...prev, ...partial }))
  }

  const handleExport = async () => {
    setIsExporting(true)
    try {
      const qs = buildQueryString({
        status: filters.status,
        railType: filters.railType,
        startDate: filters.startDate,
        endDate: filters.endDate,
        searchQuery: filters.searchQuery,
        limit: 9999,
      })
      const res = await fetch(`/api/transactions${qs}`, {
        credentials: 'same-origin',
      })
      if (!res.ok) throw new Error('Export failed')
      const json: TransactionsResponse = await res.json()
      exportToCSV(json.transactions)
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Export failed'
      toast({
        title: 'Something went wrong',
        description: message,
        variant: 'destructive',
      })
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#111',
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <nav
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px clamp(16px,4vw,32px)',
          borderBottom: '1px solid #1e1e1e',
          background: '#111',
        }}
      >
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <div style={{ width: '30px', height: '30px', borderRadius: '7px', border: '2px solid #F7931A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <polygon points="12,2 22,7 22,17 12,22 2,17 2,7" stroke="#F7931A" strokeWidth="2" fill="none" />
            </svg>
          </div>
          <span style={{ color: '#fff', fontSize: '17px', fontWeight: 800, letterSpacing: '-0.02em' }}>BitRemit</span>
        </Link>

        <div style={{ display: 'flex', gap: 'clamp(16px,3vw,32px)' }}>
          {[
            { label: 'Dashboard', href: '/dashboard' },
            { label: 'Send', href: '/send' },
            { label: 'History', href: '/history', active: true },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              style={{
                color: item.active ? '#fff' : '#666',
                fontWeight: item.active ? 700 : 400,
                fontSize: '14px',
                textDecoration: 'none',
              }}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <ConnectButton />
      </nav>

      <div style={{ padding: '28px clamp(16px,4vw,32px) 20px' }}>
        <h1 style={{ color: '#fff', fontSize: 'clamp(20px,3vw,28px)', fontWeight: 800, margin: '0 0 4px' }}>
          Transaction History
        </h1>
        <p style={{ color: '#555', fontSize: '14px', margin: 0 }}>
          All your BitRemit transfers in one place
        </p>
      </div>

      <FilterBar
        filters={filters}
        onChange={updateFilters}
        onExport={handleExport}
        isExporting={isExporting}
      />

      <div style={{ flex: 1, padding: '20px clamp(16px,4vw,32px) 0', overflowX: 'auto' }}>
        <div style={{
          background: '#1a1a1a',
          border: '1px solid #252525',
          borderRadius: '12px',
          overflow: 'hidden',
          minWidth: '700px',
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: COL_WIDTHS,
            padding: '12px 20px',
            gap: '12px',
            borderBottom: '1px solid #252525',
            background: '#1e1e1e',
          }}>
            {COLUMNS.map((col) => (
              <span key={col.key} style={{
                color: '#555',
                fontSize: '10px',
                fontWeight: 700,
                letterSpacing: '0.07em',
                textTransform: 'uppercase',
              }}>
                {col.label}
              </span>
            ))}
          </div>

          {loading ? (
            <div style={{ padding: '10px 20px 16px' }}>
              {Array.from({ length: 5 }).map((_, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: COL_WIDTHS,
                    gap: '12px',
                    alignItems: 'center',
                    padding: '14px 0',
                    borderBottom: idx === 4 ? 'none' : '1px solid #252525',
                  }}
                >
                  <Skeleton style={{ height: 14, width: idx % 2 === 0 ? '66%' : '52%' }} />
                  <Skeleton style={{ height: 16, width: idx % 2 === 0 ? '74%' : '62%' }} />
                  <Skeleton style={{ height: 14, width: idx % 2 === 0 ? '56%' : '70%' }} />
                  <Skeleton style={{ height: 14, width: idx % 2 === 0 ? '58%' : '44%' }} />
                  <Skeleton style={{ height: 24, width: idx % 2 === 0 ? '82%' : '64%', borderRadius: 999 }} />
                  <Skeleton style={{ height: 18, width: 22, borderRadius: 6 }} />
                </div>
              ))}
            </div>
          ) : error ? (
            <div style={{ padding: '60px 20px', textAlign: 'center' }}>
              <p style={{ color: '#ef4444', fontSize: '14px', marginBottom: '12px' }}>{error}</p>
              <button
                onClick={() => fetchTransactions(filters)}
                style={{ background: '#2a2a2a', border: '1px solid #333', borderRadius: '8px', padding: '9px 18px', color: '#fff', fontSize: '13px', cursor: 'pointer' }}
              >
                Retry
              </button>
            </div>
          ) : !data || data.transactions.length === 0 ? (
            <div style={{ padding: '80px 20px', textAlign: 'center' }}>
              <div style={{ fontSize: '40px', marginBottom: '14px', opacity: 0.3 }}>📋</div>
              <p style={{ color: '#555', fontSize: '15px', marginBottom: '8px' }}>No transfers found</p>
              <p style={{ color: '#444', fontSize: '13px', marginBottom: '20px' }}>
                {filters.status !== 'ALL' || filters.railType !== 'ALL' || filters.searchQuery
                  ? 'Try adjusting your filters'
                  : 'Send your first remittance to see it here'}
              </p>
              {(filters.status !== 'ALL' || filters.railType !== 'ALL' || filters.searchQuery) && (
                <button
                  onClick={() => updateFilters(INITIAL_FILTERS)}
                  style={{ background: '#F7931A', border: 'none', borderRadius: '8px', padding: '10px 20px', color: '#000', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            data.transactions.map((tx, idx) => (
              <ExpandableRow key={tx.id} tx={tx} isEven={idx % 2 === 0} />
            ))
          )}

          {data && data.total > 0 && (
            <Pagination
              page={filters.page}
              total={data.total}
              totalPages={data.totalPages}
              onPrev={() => updateFilters({ page: filters.page - 1 })}
              onNext={() => updateFilters({ page: filters.page + 1 })}
            />
          )}
        </div>
      </div>

      {data && (
        <div style={{ padding: '20px 0' }}>
          <SummaryBar summary={data.summary} />
        </div>
      )}
    </div>
  )
}