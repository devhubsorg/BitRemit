'use client'

import { useRouter } from 'next/navigation'
import type { VaultResponse } from '../../types'
import { Skeleton } from '../ui/skeleton'

interface MUSDBalanceCardProps {
  vault: VaultResponse
}

export function MUSDBalanceCard({ vault }: MUSDBalanceCardProps) {
  const router = useRouter()

  const available = vault.isLoading ? '—' : vault.borrowedMUSD
  const maxSendable = vault.isLoading ? '—' : vault.borrowedMUSD

  return (
    <div
      style={{
        background: '#2a2a2a',
        borderRadius: '12px',
        padding: '24px 28px',
      }}
    >
      <p
        style={{
          color: '#888',
          fontSize: '12px',
          fontWeight: 600,
          letterSpacing: '0.07em',
          textTransform: 'uppercase',
          marginBottom: '12px',
        }}
      >
        MUSD BALANCE
      </p>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '4px' }}>
        {vault.isLoading ? (
          <Skeleton style={{ width: 170, height: 44 }} />
        ) : (
          <span
            style={{
              fontSize: '42px',
              fontWeight: 800,
              color: '#fff',
              fontFamily: 'var(--font-syne), sans-serif',
              lineHeight: 1,
            }}
          >
            {available}
          </span>
        )}
        <span style={{ color: '#F7931A', fontSize: '18px', fontWeight: 700 }}>MUSD</span>
      </div>

      <p style={{ color: '#888', fontSize: '13px', marginBottom: '20px' }}>
        Max amount sendable: {maxSendable} MUSD
      </p>

      <button
        onClick={() => router.push('/send')}
        style={{
          width: '100%',
          background: '#F7931A',
          border: 'none',
          borderRadius: '8px',
          padding: '14px',
          color: '#000',
          fontSize: '15px',
          fontWeight: 700,
          cursor: 'pointer',
          transition: 'background 0.2s, transform 0.1s',
          letterSpacing: '0.01em',
        }}
        onMouseEnter={(e) => ((e.target as HTMLButtonElement).style.background = '#e8851a')}
        onMouseLeave={(e) => ((e.target as HTMLButtonElement).style.background = '#F7931A')}
        onMouseDown={(e) => ((e.target as HTMLButtonElement).style.transform = 'scale(0.98)')}
        onMouseUp={(e) => ((e.target as HTMLButtonElement).style.transform = 'scale(1)')}
      >
        Send Now
      </button>
    </div>
  )
}
