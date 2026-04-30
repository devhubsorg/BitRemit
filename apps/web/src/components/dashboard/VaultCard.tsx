'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../ui/dialog'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import type { VaultResponse, VaultHealthResult } from '../../types'
import { useDepositCollateral, useRepayMUSD } from '../../hooks'

interface VaultCardProps {
  vault: VaultResponse
  vaultHealth: VaultHealthResult
}

export function VaultCard({ vault, vaultHealth }: VaultCardProps) {
  const [addCollateralOpen, setAddCollateralOpen] = useState(false)
  const [repayOpen, setRepayOpen] = useState(false)
  const [depositAmount, setDepositAmount] = useState('')
  const [repayAmount, setRepayAmount] = useState('')

  const { deposit, isPending: isDepositing } = useDepositCollateral()
  const { repay, isPending: isRepaying } = useRepayMUSD()

  const ratioPercent = Math.min((vault.collateralRatio / 300) * 100, 100)

  const handleDeposit = async () => {
    await deposit(depositAmount)
    setDepositAmount('')
    setAddCollateralOpen(false)
    vault.refetch()
  }

  const handleRepay = async () => {
    await repay(repayAmount)
    setRepayAmount('')
    setRepayOpen(false)
    vault.refetch()
  }

  return (
    <>
      <div
        style={{
          background: '#2a2a2a',
          borderRadius: '12px',
          padding: '28px 32px',
          flex: 1,
          minWidth: 0,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Danger warning banner */}
        {vaultHealth.status === 'danger' && (
          <div
            style={{
              background: 'rgba(239,68,68,0.15)',
              border: '1px solid rgba(239,68,68,0.4)',
              borderRadius: '8px',
              padding: '10px 16px',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              animation: 'pulse 2s infinite',
            }}
          >
            <span style={{ color: '#ef4444', fontSize: '16px' }}>⚠</span>
            <span style={{ color: '#ef4444', fontSize: '13px', fontWeight: 500 }}>
              Add collateral to avoid liquidation
            </span>
          </div>
        )}

        {/* BTC Locked */}
        <p
          style={{
            color: '#888',
            fontSize: '13px',
            fontWeight: 500,
            letterSpacing: '0.05em',
            marginBottom: '6px',
            textTransform: 'uppercase',
          }}
        >
          YOUR VAULT
        </p>

        <p style={{ color: '#aaa', fontSize: '13px', marginBottom: '2px' }}>BTC Locked</p>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '4px' }}>
          <span style={{ color: '#fff', fontSize: '36px', fontWeight: 700, fontFamily: 'var(--font-syne), sans-serif' }}>
            {vault.isLoading ? '—' : vault.collateralAmount}
          </span>
          <span style={{ color: '#F7931A', fontSize: '18px', fontWeight: 600 }}>BTC</span>
        </div>

        {vault.collateralChangeUsd !== 0 && (
          <p style={{ color: '#22c55e', fontSize: '13px', marginBottom: '24px' }}>
            +${vault.collateralChangeUsd.toFixed(2)} ({vault.collateralChangePercent.toFixed(1)}%) today
          </p>
        )}

        {/* Divider row */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1px 1fr',
            gap: '0',
            alignItems: 'start',
            marginBottom: '28px',
          }}
        >
          {/* Collateral Ratio */}
          <div style={{ paddingRight: '24px' }}>
            <p style={{ color: '#888', fontSize: '12px', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Collateral Ratio
            </p>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '8px' }}>
              <span
                style={{
                  fontSize: '32px',
                  fontWeight: 700,
                  color: vaultHealth.color,
                  fontFamily: 'var(--font-syne), sans-serif',
                }}
              >
                {vault.isLoading ? '—' : `${vault.collateralRatio}%`}
              </span>
            </div>
            {/* Progress bar */}
            <div
              style={{
                height: '6px',
                background: '#444',
                borderRadius: '3px',
                marginBottom: '6px',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${ratioPercent}%`,
                  background: `linear-gradient(90deg, ${vaultHealth.color}aa, ${vaultHealth.color})`,
                  borderRadius: '3px',
                  transition: 'width 0.5s ease',
                }}
              />
            </div>
            <p style={{ color: '#888', fontSize: '11px' }}>{vaultHealth.label}</p>
          </div>

          {/* Vertical divider */}
          <div style={{ background: '#3a3a3a', width: '1px', height: '80px', margin: '0 auto' }} />

          {/* Borrowed */}
          <div style={{ paddingLeft: '24px' }}>
            <p style={{ color: '#888', fontSize: '12px', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Borrowed
            </p>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '8px' }}>
              <span style={{ fontSize: '32px', fontWeight: 700, color: '#fff', fontFamily: 'var(--font-syne), sans-serif' }}>
                {vault.isLoading ? '—' : vault.borrowedMUSD}
              </span>
              <span style={{ color: '#F7931A', fontSize: '14px', fontWeight: 600 }}>MUSD</span>
            </div>
            <p style={{ color: '#ef4444', fontSize: '11px' }}>Danger Zone ({'>'}&gt;130%)</p>
          </div>
        </div>

        {/* Action buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <button
            onClick={() => setAddCollateralOpen(true)}
            style={{
              background: '#3a3a3a',
              border: 'none',
              borderRadius: '8px',
              padding: '14px',
              color: '#fff',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}
            onMouseEnter={(e) => ((e.target as HTMLButtonElement).style.background = '#4a4a4a')}
            onMouseLeave={(e) => ((e.target as HTMLButtonElement).style.background = '#3a3a3a')}
          >
            Add Collateral
          </button>
          <button
            onClick={() => setRepayOpen(true)}
            style={{
              background: '#3a3a3a',
              border: 'none',
              borderRadius: '8px',
              padding: '14px',
              color: '#fff',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}
            onMouseEnter={(e) => ((e.target as HTMLButtonElement).style.background = '#4a4a4a')}
            onMouseLeave={(e) => ((e.target as HTMLButtonElement).style.background = '#3a3a3a')}
          >
            Repay Loan
          </button>
        </div>
      </div>

      {/* Add Collateral Dialog */}
      <Dialog open={addCollateralOpen} onOpenChangeAction={setAddCollateralOpen}>
        <DialogContent style={{ background: '#2a2a2a', border: '1px solid #3a3a3a', color: '#fff' }}>
          <DialogHeader>
            <DialogTitle style={{ color: '#fff' }}>Add Collateral</DialogTitle>
          </DialogHeader>
          <div style={{ padding: '8px 0' }}>
            <Label htmlFor="deposit-amount" style={{ color: '#aaa', fontSize: '13px' }}>
              Amount (tBTC)
            </Label>
            <Input
              id="deposit-amount"
              type="number"
              placeholder="0.01"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              style={{
                background: '#1a1a1a',
                border: '1px solid #3a3a3a',
                color: '#fff',
                marginTop: '8px',
              }}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setAddCollateralOpen(false)}
              style={{ borderColor: '#3a3a3a', color: '#aaa', background: 'transparent' }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeposit}
              disabled={isDepositing || !depositAmount}
              style={{ background: '#F7931A', color: '#000', fontWeight: 700, border: 'none' }}
            >
              {isDepositing ? 'Signing…' : 'Add Collateral'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Repay Loan Dialog */}
      <Dialog open={repayOpen} onOpenChangeAction={setRepayOpen}>
        <DialogContent style={{ background: '#2a2a2a', border: '1px solid #3a3a3a', color: '#fff' }}>
          <DialogHeader>
            <DialogTitle style={{ color: '#fff' }}>Repay Loan</DialogTitle>
          </DialogHeader>
          <div style={{ padding: '8px 0' }}>
            <Label htmlFor="repay-amount" style={{ color: '#aaa', fontSize: '13px' }}>
              Amount (MUSD)
            </Label>
            <p style={{ color: '#888', fontSize: '12px', marginTop: '4px' }}>
              Outstanding: {vault.borrowedMUSD} MUSD
            </p>
            <Input
              id="repay-amount"
              type="number"
              placeholder="100"
              value={repayAmount}
              onChange={(e) => setRepayAmount(e.target.value)}
              style={{
                background: '#1a1a1a',
                border: '1px solid #3a3a3a',
                color: '#fff',
                marginTop: '8px',
              }}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRepayOpen(false)}
              style={{ borderColor: '#3a3a3a', color: '#aaa', background: 'transparent' }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleRepay}
              disabled={isRepaying || !repayAmount}
              style={{ background: '#F7931A', color: '#000', fontWeight: 700, border: 'none' }}
            >
              {isRepaying ? 'Signing…' : 'Repay Loan'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
