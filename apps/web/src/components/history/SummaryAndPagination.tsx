'use client'

import type { TransactionsResponse } from '@/types/history'
import { RAIL_CONFIG, LIMIT } from '@/types/history'

// ─── SummaryBar ──────────────────────────────────────────────────────────────

interface SummaryBarProps {
  summary: TransactionsResponse['summary']
}

export function SummaryBar({ summary }: SummaryBarProps) {
  const mostUsedLabel = summary.mostUsedRail
    ? RAIL_CONFIG[summary.mostUsedRail].label
    : '—'

  const items = [
    { label: 'Total sent this month', value: `$${Number(summary.totalSentMUSD).toLocaleString()} MUSD` },
    { label: 'Total fees',            value: `$${Number(summary.totalFeesMUSD).toFixed(2)} MUSD` },
    { label: 'Most used rail',        value: mostUsedLabel },
  ]

  return (
    <div style={{
      display: 'flex', flexWrap: 'wrap', gap: '0',
      background: '#1a1a1a', border: '1px solid #252525',
      borderRadius: '10px', overflow: 'hidden',
      margin: '0 clamp(16px,4vw,32px) 32px',
    }}>
      {items.map((item, idx) => (
        <div
          key={item.label}
          style={{
            flex: '1 1 160px', padding: '16px 24px',
            borderRight: idx < items.length - 1 ? '1px solid #252525' : 'none',
          }}
        >
          <p style={{ color: '#555', fontSize: '11px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '6px' }}>
            {item.label}
          </p>
          <p style={{ color: '#fff', fontSize: '16px', fontWeight: 700 }}>
            {item.value}
          </p>
        </div>
      ))}
    </div>
  )
}

// ─── Pagination ──────────────────────────────────────────────────────────────

interface PaginationProps {
  page: number
  total: number
  totalPages: number
  onPrev: () => void
  onNext: () => void
}

export function Pagination({ page, total, totalPages, onPrev, onNext }: PaginationProps) {
  const from = Math.min((page - 1) * LIMIT + 1, total)
  const to   = Math.min(page * LIMIT, total)

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '16px 20px', borderTop: '1px solid #252525', flexWrap: 'wrap', gap: '12px',
    }}>
      <span style={{ color: '#666', fontSize: '13px' }}>
        {total === 0 ? 'No transfers' : `Showing ${from}–${to} of ${total} transfer${total !== 1 ? 's' : ''}`}
      </span>
      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          onClick={onPrev}
          disabled={page <= 1}
          style={{
            background: page <= 1 ? '#1e1e1e' : '#2a2a2a',
            border: '1px solid #333', borderRadius: '7px',
            padding: '8px 16px', color: page <= 1 ? '#444' : '#fff',
            fontSize: '13px', fontWeight: 600,
            cursor: page <= 1 ? 'not-allowed' : 'pointer',
            transition: 'background 0.15s',
          }}
        >
          ← Previous
        </button>
        <button
          onClick={onNext}
          disabled={page >= totalPages}
          style={{
            background: page >= totalPages ? '#1e1e1e' : '#2a2a2a',
            border: '1px solid #333', borderRadius: '7px',
            padding: '8px 16px', color: page >= totalPages ? '#444' : '#fff',
            fontSize: '13px', fontWeight: 600,
            cursor: page >= totalPages ? 'not-allowed' : 'pointer',
            transition: 'background 0.15s',
          }}
        >
          Next →
        </button>
      </div>
    </div>
  )
}
