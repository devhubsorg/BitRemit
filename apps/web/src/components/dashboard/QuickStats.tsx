'use client'

import type { StatsResponse } from '../../types'

interface QuickStatsProps {
  stats: StatsResponse & { isLoading: boolean }
}

function formatTime(seconds: number): string {
  if (seconds < 60) return `${seconds} seconds`
  return `${Math.floor(seconds / 60)}m ${seconds % 60}s`
}

export function QuickStats({ stats }: QuickStatsProps) {
  const items = [
    {
      label: 'Total Sent',
      value: stats.isLoading ? '—' : `${stats.totalSentMUSD} MUSD`,
    },
    {
      label: 'Recipients',
      value: stats.isLoading ? '—' : String(stats.totalRecipients),
    },
    {
      label: 'Avg Transfer Time',
      value: stats.isLoading ? '—' : formatTime(stats.avgTransferTimeSeconds),
    },
  ]

  return (
    <div
      className="quick-stats-card"
      style={{
        background: '#2a2a2a',
        borderRadius: '12px',
        padding: '20px 28px',
      }}
    >
      <p
        style={{
          color: '#F7931A',
          fontSize: '13px',
          fontWeight: 700,
          letterSpacing: '0.03em',
          marginBottom: '16px',
        }}
      >
        Quick Stats
      </p>

      <div
        className="quick-stats-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '0',
        }}
      >
        {items.map((item, idx) => (
          <div
            key={item.label}
            style={{
              borderLeft: idx > 0 ? '1px solid #3a3a3a' : 'none',
              paddingLeft: idx > 0 ? '20px' : '0',
              paddingRight: idx < items.length - 1 ? '20px' : '0',
            }}
          >
            <p style={{ color: '#888', fontSize: '11px', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {item.label}
            </p>
            <p style={{ color: '#fff', fontSize: '15px', fontWeight: 700, fontFamily: 'var(--font-syne), sans-serif' }}>
              {item.value}
            </p>
          </div>
        ))}
      </div>

      <style>{`
        @media (max-width: 640px) {
          .quick-stats-grid {
            grid-template-columns: 1fr !important;
            gap: 12px !important;
          }
        }
      `}</style>
    </div>
  )
}
