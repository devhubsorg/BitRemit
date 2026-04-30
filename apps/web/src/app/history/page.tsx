'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useAccount } from 'wagmi'
import { RecentTransactionsTable } from '@/components/dashboard/RecentTransactionsTable'
import { useTransactions } from '@/hooks'

export default function HistoryPage() {
  const router = useRouter()
  const { address } = useAccount()
  const mounted = useRef(false)
  const { transactions, isLoading } = useTransactions(1, 20)

  useEffect(() => {
    mounted.current = true
  }, [])

  useEffect(() => {
    if (mounted.current && !address) {
      router.push('/')
    }
  }, [address, router])

  return (
    <main
      style={{
        minHeight: '100vh',
        background: '#1a1a1a',
        padding: '32px 20px',
      }}
    >
      <div style={{ margin: '0 auto', maxWidth: '1200px' }}>
        <div style={{ marginBottom: '24px' }}>
          <p
            style={{
              color: '#F7931A',
              fontSize: '13px',
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              marginBottom: '8px',
            }}
          >
            HISTORY
          </p>
          <h1 style={{ color: '#fff', fontSize: '32px', fontWeight: 800, margin: 0 }}>
            Transfer History
          </h1>
        </div>

        <RecentTransactionsTable transactions={transactions} isLoading={isLoading} />
      </div>
    </main>
  )
}