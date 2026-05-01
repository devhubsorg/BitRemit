'use client'

import { useState } from 'react'
import type { TransactionRow } from '@/types/history'
import { RAIL_CONFIG, STATUS_CONFIG } from '@/types/history'
import { formatDate, formatTime } from '@/lib/history/utils'

interface ExpandableRowProps {
  tx: TransactionRow
  isEven: boolean
}

function RailBadge({ rail }: { rail: TransactionRow['railType'] }) {
  const cfg = RAIL_CONFIG[rail]
  return (
    <span style={{
      background: cfg.bg, color: cfg.color,
      fontSize: '10px', fontWeight: 700, padding: '3px 9px',
      borderRadius: '20px', letterSpacing: '0.04em',
      border: `1px solid ${cfg.color}33`, whiteSpace: 'nowrap',
    }}>
      {cfg.label}
    </span>
  )
}

function StatusBadge({ status }: { status: TransactionRow['status'] }) {
  const cfg = STATUS_CONFIG[status]
  return (
    <span style={{
      background: cfg.bg, color: cfg.color,
      fontSize: '11px', fontWeight: 700, padding: '4px 12px',
      borderRadius: '20px', whiteSpace: 'nowrap',
      border: `1px solid ${cfg.color}33`,
    }}>
      {cfg.label}
    </span>
  )
}

function Avatar({ initials }: { initials: string }) {
  return (
    <div style={{
      width: '32px', height: '32px', borderRadius: '50%',
      background: 'linear-gradient(135deg,#F7931A,#e07b0f)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: '11px', fontWeight: 700, color: '#000', flexShrink: 0,
    }}>
      {initials.slice(0, 2).toUpperCase()}
    </div>
  )
}

const COL_WIDTHS = '130px 1fr 110px 150px 120px 40px'

export function ExpandableRow({ tx, isEven }: ExpandableRowProps) {
  const [open, setOpen] = useState(false)

  const explorerUrl = `https://explorer.test.mezo.org/tx/${tx.txHash}`

  return (
    <>
      {/* Main row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: COL_WIDTHS,
          alignItems: 'center',
          padding: '14px 20px',
          background: open ? 'rgba(247,147,26,0.04)' : isEven ? '#1e1e1e' : '#1a1a1a',
          borderBottom: open ? 'none' : '1px solid #252525',
          borderLeft: open ? '2px solid #F7931A' : '2px solid transparent',
          cursor: 'pointer',
          transition: 'background 0.15s, border-color 0.15s',
          gap: '12px',
        }}
        onClick={() => setOpen((v) => !v)}
        onMouseEnter={(e) => {
          if (!open) (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.02)'
        }}
        onMouseLeave={(e) => {
          if (!open) (e.currentTarget as HTMLDivElement).style.background = isEven ? '#1e1e1e' : '#1a1a1a'
        }}
      >
        {/* Date */}
        <span style={{ color: '#888', fontSize: '13px' }}>{formatDate(tx.createdAt)}</span>

        {/* Recipient */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
          <Avatar initials={tx.recipient.initials} />
          <div style={{ minWidth: 0 }}>
            <p style={{ color: '#fff', fontSize: '13px', fontWeight: 600, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {tx.recipient.name}
            </p>
            <div style={{ marginTop: '3px' }}>
              <RailBadge rail={tx.railType} />
            </div>
          </div>
        </div>

        {/* Sent */}
        <span style={{ color: '#fff', fontSize: '13px', fontWeight: 700, fontFamily: 'monospace' }}>
          ${tx.musdAmount}
        </span>

        {/* Received */}
        <span style={{ color: '#aaa', fontSize: '13px' }}>
          {Number(tx.fiatAmount).toLocaleString()} {tx.fiatCurrency}
        </span>

        {/* Status */}
        <StatusBadge status={tx.status} />

        {/* Expand toggle */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{
            width: '24px', height: '24px', borderRadius: '6px',
            background: open ? '#F7931A' : '#2a2a2a',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'background 0.2s, transform 0.2s',
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
          }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
              <polyline points="6 9 12 15 18 9" stroke={open ? '#000' : '#888'} strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      </div>

      {/* Expanded detail panel */}
      {open && (
        <div style={{
          background: 'rgba(247,147,26,0.03)',
          borderLeft: '2px solid #F7931A',
          borderBottom: '1px solid #2a2a2a',
          padding: '16px 24px 20px',
          animation: 'slideDown 0.2s ease',
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            {/* Left column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {tx.txHash && (
                <div>
                  <p style={{ color: '#555', fontSize: '10px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '4px' }}>
                    Tx Hash
                  </p>
                  <a
                    href={explorerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      color: '#F7931A', fontSize: '12px', fontFamily: 'monospace',
                      textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '5px',
                    }}
                  >
                    {tx.txHash.slice(0, 14)}...{tx.txHash.slice(-8)}
                    <span style={{ fontSize: '10px' }}>↗</span>
                  </a>
                </div>
              )}

              {tx.blockNumber && (
                <div>
                  <p style={{ color: '#555', fontSize: '10px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '4px' }}>
                    Block
                  </p>
                  <span style={{ color: '#aaa', fontSize: '12px', fontFamily: 'monospace' }}>
                    #{tx.blockNumber.toLocaleString()}
                  </span>
                </div>
              )}

              {tx.railReference && (
                <div>
                  <p style={{ color: '#555', fontSize: '10px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '4px' }}>
                    Off-ramp Reference
                  </p>
                  <span style={{ color: '#aaa', fontSize: '12px', fontFamily: 'monospace' }}>
                    {tx.railReference}
                  </span>
                </div>
              )}
            </div>

            {/* Right column — timeline */}
            <div>
              <p style={{ color: '#555', fontSize: '10px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '12px' }}>
                Timeline
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                {[
                  { label: 'Signed', time: tx.createdAt, done: true },
                  { label: 'Confirmed', time: tx.confirmedAt, done: !!tx.confirmedAt },
                  { label: 'Delivered', time: tx.completedAt, done: !!tx.completedAt },
                ].map((step, idx, arr) => (
                  <div key={step.label}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '20px', height: '20px', borderRadius: '50%', flexShrink: 0,
                        background: step.done ? '#22c55e' : '#2a2a2a',
                        border: `2px solid ${step.done ? '#22c55e' : '#333'}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        {step.done && (
                          <svg width="9" height="9" viewBox="0 0 24 24" fill="none">
                            <polyline points="20 6 9 17 4 12" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
                          </svg>
                        )}
                      </div>
                      <div>
                        <span style={{ color: step.done ? '#fff' : '#555', fontSize: '12px', fontWeight: step.done ? 600 : 400 }}>
                          {step.label}
                        </span>
                        {step.time && (
                          <span style={{ color: '#555', fontSize: '11px', marginLeft: '8px' }}>
                            {formatTime(step.time)}
                          </span>
                        )}
                      </div>
                    </div>
                    {idx < arr.length - 1 && (
                      <div style={{ width: '2px', height: '12px', background: step.done ? '#22c55e44' : '#252525', marginLeft: '9px' }} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      <style>{`@keyframes slideDown { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </>
  )
}

export { COL_WIDTHS }
