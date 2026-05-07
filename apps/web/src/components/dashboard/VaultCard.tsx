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
import { Skeleton } from '../ui/skeleton'
import type { VaultResponse, VaultHealthResult } from '@/types'
import {
  useDepositCollateral,
  useRepayMUSD,
  useBorrowMUSD,
  useApproveTBTC,
  useApproveMUSD,
} from '@/hooks'
import { parseUnits } from 'viem'

interface VaultCardProps {
  vault: VaultResponse & { refetch: () => void; isLoading: boolean }
  vaultHealth: VaultHealthResult
}

export function VaultCard({ vault, vaultHealth }: VaultCardProps) {
  const [addCollateralOpen, setAddCollateralOpen] = useState(false)
  const [repayOpen, setRepayOpen] = useState(false)
  const [borrowOpen, setBorrowOpen] = useState(false)
  const [depositAmount, setDepositAmount] = useState('')
  const [repayAmount, setRepayAmount] = useState('')
  const [borrowAmount, setBorrowAmount] = useState('')

  const { depositCollateral, isPending: isDepositing } = useDepositCollateral({ onSuccess: () => vault.refetch() })
  const { approveTBTC, isPending: isApprovingTBTC } = useApproveTBTC()
  
  const { repayMUSD, isPending: isRepaying } = useRepayMUSD({ onSuccess: () => vault.refetch() })
  const { approveMUSD, isPending: isApprovingMUSD } = useApproveMUSD()

  const { borrowMUSD, isPending: isBorrowing } = useBorrowMUSD({ onSuccess: () => vault.refetch() })

  const ratioPercent = Math.min((vault.collateralRatio / 300) * 100, 100)

  const handleDeposit = async () => {
    if (!depositAmount) return;
    try {
      const amount = parseUnits(depositAmount, 18);
      await approveTBTC(amount);
      await depositCollateral(amount);
      setDepositAmount('')
      setAddCollateralOpen(false)
    } catch (e) {
      console.error(e)
    }
  }

  const handleRepay = async () => {
    if (!repayAmount) return;
    try {
      const amount = parseUnits(repayAmount, 18);
      await approveMUSD(amount);
      await repayMUSD(amount);
      setRepayAmount('')
      setRepayOpen(false)
    } catch (e) {
      console.error(e)
    }
  }

  const handleBorrow = async () => {
    if (!borrowAmount) return;
    try {
      const amount = parseUnits(borrowAmount, 18);
      await borrowMUSD(amount);
      setBorrowAmount('')
      setBorrowOpen(false)
    } catch (e) {
      console.error(e)
    }
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

        <p style={{ color: '#aaa', fontSize: '13px', marginBottom: '2px' }}>BTC Locked (Mocked)</p>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '4px' }}>
          {vault.isLoading ? (
            <Skeleton style={{ width: 140, height: 40 }} />
          ) : (
            <span style={{ color: '#fff', fontSize: '36px', fontWeight: 700, fontFamily: 'var(--font-syne), sans-serif' }}>
              {(vault as any).displayCollateralAmount ? (Number((vault as any).displayCollateralAmount) / 1e18).toFixed(4) : vault.collateralAmount}
            </span>
          )}
          <span style={{ color: '#F7931A', fontSize: '18px', fontWeight: 600 }}>Mezo BTC</span>
        </div>


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
              {vault.isLoading ? (
                <Skeleton style={{ width: 110, height: 36 }} />
              ) : (
                <span
                  style={{
                    fontSize: '32px',
                    fontWeight: 700,
                    color: vaultHealth.color,
                    fontFamily: 'var(--font-syne), sans-serif',
                  }}
                >
                  {`${vault.collateralRatio}%`}
                </span>
              )}
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
              {vault.isLoading ? (
                <Skeleton style={{ width: 110, height: 36 }} />
              ) : (
                <span style={{ fontSize: '32px', fontWeight: 700, color: '#fff', fontFamily: 'var(--font-syne), sans-serif' }}>
                  {vault.borrowedMUSD}
                </span>
              )}
              <span style={{ color: '#F7931A', fontSize: '14px', fontWeight: 600 }}>MUSD</span>
            </div>
            <p style={{ color: '#ef4444', fontSize: '11px' }}>Danger Zone ({'>'}&gt;130%)</p>
          </div>
        </div>

        {/* Action buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
          <button
            onClick={() => setAddCollateralOpen(true)}
            style={{
              background: '#3a3a3a',
              border: 'none',
              borderRadius: '8px',
              padding: '14px 10px',
              color: '#fff',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}
          >
            Add BTC
          </button>
          <button
            onClick={() => setBorrowOpen(true)}
            style={{
              background: '#F7931A',
              border: 'none',
              borderRadius: '8px',
              padding: '14px 10px',
              color: '#000',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'opacity 0.2s',
            }}
          >
            Borrow MUSD
          </button>
          <button
            onClick={() => setRepayOpen(true)}
            style={{
              background: '#3a3a3a',
              border: 'none',
              borderRadius: '8px',
              padding: '14px 10px',
              color: '#fff',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}
          >
            Repay
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
              Amount (Mezo BTC)
            </Label>
            <Input
              id="deposit-amount"
              type="number"
              placeholder="0.001"
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
              disabled={isDepositing || isApprovingTBTC || !depositAmount}
              style={{ background: '#F7931A', color: '#000', fontWeight: 700, border: 'none' }}
            >
              {isApprovingTBTC ? 'Approving tBTC…' : isDepositing ? 'Depositing…' : 'Add Collateral'}
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
              disabled={isRepaying || isApprovingMUSD || !repayAmount}
              style={{ background: '#F7931A', color: '#000', fontWeight: 700, border: 'none' }}
            >
              {isApprovingMUSD ? 'Approving MUSD…' : isRepaying ? 'Repaying…' : 'Repay Loan'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Borrow MUSD Dialog */}
      <Dialog open={borrowOpen} onOpenChangeAction={setBorrowOpen}>
        <DialogContent style={{ background: '#2a2a2a', border: '1px solid #3a3a3a', color: '#fff' }}>
          <DialogHeader>
            <DialogTitle style={{ color: '#fff' }}>Borrow MUSD</DialogTitle>
          </DialogHeader>
          <div style={{ padding: '8px 0' }}>
            <Label htmlFor="borrow-amount" style={{ color: '#aaa', fontSize: '13px' }}>
              Amount (MUSD)
            </Label>
            <p style={{ color: '#888', fontSize: '12px', marginTop: '4px' }}>
              Max borrowable: {vault.maxBorrowable} MUSD
            </p>
            <Input
              id="borrow-amount"
              type="number"
              placeholder="100"
              value={borrowAmount}
              onChange={(e) => setBorrowAmount(e.target.value)}
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
              onClick={() => setBorrowOpen(false)}
              style={{ borderColor: '#3a3a3a', color: '#aaa', background: 'transparent' }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleBorrow}
              disabled={isBorrowing || !borrowAmount}
              style={{ background: '#F7931A', color: '#000', fontWeight: 700, border: 'none' }}
            >
              {isBorrowing ? 'Borrowing…' : 'Borrow MUSD'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>

  )
}
