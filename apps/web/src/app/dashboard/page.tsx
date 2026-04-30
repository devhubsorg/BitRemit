'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useAccount } from 'wagmi'
import { ConnectButton } from '@/components/ConnectButton'
import { VaultCard } from '@/components/dashboard/VaultCard'
import { MUSDBalanceCard } from '@/components/dashboard/MUSDBalanceCard'
import { QuickStats } from '@/components/dashboard/QuickStats'
import { RecentTransactionsTable } from '@/components/dashboard/RecentTransactionsTable'
import { useVault, useVaultHealth, useTransactions, useStats } from '@/hooks'

export default function DashboardPage() {
  const router = useRouter()
  const { address } = useAccount()
  const mounted = useRef(false)

  // Route guard — redirect to landing if wallet disconnected after mount
  useEffect(() => {
    mounted.current = true
  }, [])

  useEffect(() => {
    if (mounted.current && !address) {
      router.push('/')
    }
  }, [address, router])

  // Data hooks
  const vault = useVault()
  const vaultHealth = useVaultHealth(vault.collateralRatio)
  const { transactions, isLoading: txLoading, refetchTransactions } = useTransactions(1, 5)
  const stats = useStats()

  // 10-second polling
  useEffect(() => {
    const interval = setInterval(() => {
      vault.refetch()
      refetchTransactions()
    }, 10_000)
    return () => clearInterval(interval)
  }, [vault, refetchTransactions])

  return (
    <div
      className="dashboard-shell"
      style={{
        display: 'flex',
        minHeight: '100vh',
        background: '#1a1a1a',
        fontFamily: 'var(--font-dm-sans), sans-serif',
      }}
    >
      {/* ─── Sidebar ─────────────────────────────────────────────────── */}
      <aside
        className="dashboard-sidebar"
        style={{
          width: '220px',
          minWidth: '220px',
          background: '#1a1a1a',
          borderRight: '1px solid #2a2a2a',
          display: 'flex',
          flexDirection: 'column',
          padding: '28px 0',
        }}
      >
        {/* Logo */}
        <div style={{ padding: '0 20px 32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                border: '2px solid #F7931A',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#F7931A">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#F7931A" strokeWidth="2" fill="none" />
              </svg>
            </div>
            <span style={{ color: '#fff', fontSize: '18px', fontWeight: 800, letterSpacing: '-0.02em' }}>
              BitRemit
            </span>
          </div>
        </div>

        {/* Nav links */}
        <nav style={{ flex: 1, padding: '0 12px' }}>
          {[
            {
              href: '/dashboard',
              label: 'Dashboard',
              active: true,
              icon: (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="3" width="8" height="8" rx="1" fill="currentColor" />
                  <rect x="13" y="3" width="8" height="8" rx="1" fill="currentColor" />
                  <rect x="3" y="13" width="8" height="8" rx="1" fill="currentColor" />
                  <rect x="13" y="13" width="8" height="8" rx="1" fill="currentColor" />
                </svg>
              ),
            },
            {
              href: '/history',
              label: 'History',
              active: false,
              icon: (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="9" />
                  <polyline points="12 7 12 12 15 15" />
                </svg>
              ),
            },
            {
              href: '/send',
              label: 'Send',
              active: false,
              icon: (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              ),
            },
          ].map((item) => (
            <a
              key={item.href}
              href={item.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 14px',
                borderRadius: '10px',
                marginBottom: '4px',
                background: item.active ? '#F7931A' : 'transparent',
                color: item.active ? '#000' : '#888',
                fontWeight: item.active ? 700 : 400,
                fontSize: '14px',
                textDecoration: 'none',
                transition: 'background 0.15s, color 0.15s',
              }}
            >
              <span style={{ color: item.active ? '#000' : '#888' }}>{item.icon}</span>
              {item.label}
            </a>
          ))}
        </nav>
      </aside>

      {/* ─── Main content ────────────────────────────────────────────── */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>

        {/* Top bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '20px 32px',
            borderBottom: '1px solid #2a2a2a',
          }}
        >
          <span
            style={{
              color: '#F7931A',
              fontSize: '13px',
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}
          >
            DASHBOARD
          </span>

          {address && <ConnectButton />}
        </div>

        {/* Content */}
        <div className="dashboard-content" style={{ padding: '28px 32px', flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Top row: Vault | Balance + Stats */}
          <div className="dashboard-top-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '20px', alignItems: 'start' }}>
            <VaultCard vault={vault} vaultHealth={vaultHealth} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <MUSDBalanceCard vault={vault} />
              <QuickStats stats={stats} />
            </div>
          </div>

          {/* Transactions table — full width */}
          <RecentTransactionsTable
            transactions={transactions}
            isLoading={txLoading}
          />
        </div>
      </main>

      <style>{`
        @media (max-width: 1024px) {
          .dashboard-shell {
            flex-direction: column;
          }

          .dashboard-sidebar {
            width: 100% !important;
            min-width: 0 !important;
            border-right: none !important;
            border-bottom: 1px solid #2a2a2a;
          }

          .dashboard-top-grid {
            grid-template-columns: 1fr !important;
          }
        }

        @media (max-width: 640px) {
          .dashboard-content {
            padding: 20px 16px !important;
          }
        }
      `}</style>
    </div>
  )
}
