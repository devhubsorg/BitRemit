'use client'

import { useRouter } from 'next/navigation'
import type { TransactionResponse, TxStatus, PaymentRail } from '../../types'

interface RecentTransactionsTableProps {
  transactions: TransactionResponse[]
  isLoading?: boolean
}

const STATUS_CONFIG: Record<TxStatus, { label: string; bg: string; color: string }> = {
  PENDING: { label: 'Pending', bg: 'rgba(234,179,8,0.2)', color: '#eab308' },
  CONFIRMED_ONCHAIN: { label: 'Confirmed', bg: 'rgba(59,130,246,0.2)', color: '#60a5fa' },
  OFFRAMP_PROCESSING: { label: 'Processing', bg: 'rgba(59,130,246,0.2)', color: '#60a5fa' },
  COMPLETED: { label: 'Completed', bg: 'rgba(34,197,94,0.2)', color: '#22c55e' },
  FAILED: { label: 'Failed', bg: 'rgba(239,68,68,0.2)', color: '#ef4444' },
}

const RAIL_CONFIG: Record<PaymentRail, { label: string; icon: string }> = {
  MPESA: { label: 'M-Pesa', icon: 'M' },
  GCASH: { label: 'GCash', icon: 'G' },
  MTNMOMO: { label: 'MTN Momo', icon: 'MT' },
}

function timeAgo(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime()
  const hours = Math.floor(diff / 3_600_000)
  const days = Math.floor(diff / 86_400_000)
  if (days > 0) return `${days}d ago`
  if (hours > 0) return `${hours}hrs ago`
  const mins = Math.floor(diff / 60_000)
  return `${mins}m ago`
}

function Avatar({ initials }: { initials: string }) {
  return (
    <div
      style={{
        width: '36px',
        height: '36px',
        borderRadius: '50%',
        background: '#3a3a3a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '12px',
        fontWeight: 700,
        color: '#aaa',
        flexShrink: 0,
      }}
    >
      {initials}
    </div>
  )
}

export function RecentTransactionsTable({
  transactions,
  isLoading,
}: RecentTransactionsTableProps) {
  const router = useRouter()

  const cols = [
    { key: 'recipient', label: 'RECIPIENT', width: '28%' },
    { key: 'rail', label: 'RAIL/PROVIDER', width: '20%' },
    { key: 'amount', label: 'AMOUNT (MUSD)', width: '16%' },
    { key: 'fiat', label: 'RECEIVED (FIAT)', width: '16%' },
    { key: 'status', label: 'STATUS', width: '12%' },
    { key: 'time', label: 'TIME', width: '8%' },
  ]

  return (
    <div style={{ background: '#2a2a2a', borderRadius: '12px', overflowX: 'auto', overflowY: 'hidden' }}>
      {/* Table header bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '20px 28px 16px',
          borderBottom: '1px solid #333',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: '#3a3a3a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="3" width="18" height="4" rx="1" fill="#888" />
              <rect x="3" y="10" width="18" height="4" rx="1" fill="#888" />
              <rect x="3" y="17" width="18" height="4" rx="1" fill="#888" />
            </svg>
          </div>
          <span style={{ color: '#fff', fontSize: '14px', fontWeight: 600, letterSpacing: '0.04em' }}>
            TRANSACTION HISTORY
          </span>
        </div>
        <button
          onClick={() => router.push('/history')}
          style={{
            background: 'none',
            border: 'none',
            color: '#F7931A',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
            padding: '4px 0',
          }}
        >
          View All
        </button>
      </div>

      {/* Column headers */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: cols.map((c) => c.width).join(' '),
          padding: '10px 28px',
          borderBottom: '1px solid #333',
        }}
      >
        {cols.map((col) => (
          <span
            key={col.key}
            style={{
              color: '#666',
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
            }}
          >
            {col.label}
          </span>
        ))}
      </div>

      {/* Rows */}
      {isLoading ? (
        <div style={{ padding: '40px 28px', textAlign: 'center', color: '#555' }}>
          Loading transactions…
        </div>
      ) : transactions.length === 0 ? (
        <div style={{ padding: '60px 28px', textAlign: 'center' }}>
          <p style={{ color: '#555', fontSize: '15px' }}>No transfers yet.</p>
          <p style={{ color: '#444', fontSize: '13px', marginTop: '6px' }}>
            Send your first remittance.
          </p>
        </div>
      ) : (
        transactions.map((tx, idx) => {
          const status = STATUS_CONFIG[tx.status]
          const rail = RAIL_CONFIG[tx.railType]
          const isLast = idx === transactions.length - 1

          return (
            <div
              key={tx.id}
              style={{
                display: 'grid',
                gridTemplateColumns: cols.map((c) => c.width).join(' '),
                padding: '16px 28px',
                borderBottom: isLast ? 'none' : '1px solid #333',
                alignItems: 'center',
                transition: 'background 0.15s',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.03)')
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLDivElement).style.background = 'transparent')
              }
              onClick={() => router.push(`/history?tx=${tx.id}`)}
            >
              {/* Recipient */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Avatar initials={tx.recipient.initials} />
                <span style={{ color: '#fff', fontSize: '14px', fontWeight: 500 }}>
                  {tx.recipient.name}
                </span>
              </div>

              {/* Rail */}
              <div>
                <p style={{ color: '#fff', fontSize: '13px', fontWeight: 500 }}>{rail.label}</p>
                <p style={{ color: '#666', fontSize: '12px' }}>{tx.recipient.phoneNumber}</p>
              </div>

              {/* MUSD Amount */}
              <span style={{ color: '#fff', fontSize: '14px', fontWeight: 600, fontFamily: 'var(--font-syne), sans-serif' }}>
                ${tx.musdAmount}
              </span>

              {/* Fiat */}
              <span style={{ color: '#aaa', fontSize: '13px', fontFamily: 'var(--font-syne), sans-serif' }}>
                {tx.fiatAmount} {tx.fiatCurrency}
              </span>

              {/* Status Badge */}
              <div>
                <span
                  style={{
                    display: 'inline-block',
                    background: status.bg,
                    color: status.color,
                    fontSize: '12px',
                    fontWeight: 600,
                    padding: '4px 12px',
                    borderRadius: '20px',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {status.label}
                </span>
              </div>

              {/* Time */}
              <span style={{ color: '#666', fontSize: '12px', fontFamily: 'var(--font-syne), sans-serif' }}>
                {timeAgo(tx.createdAt)}
              </span>
            </div>
          )
        })
      )}
    </div>
  )
}
