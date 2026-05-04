'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { RecipientResponse, PaymentRail } from '../../types/send'
import { COUNTRY_CODES, RAIL_CONFIG } from '../../types/send'
import { useToast } from '@/hooks/use-toast'

interface StepRecipientProps {
  selectedRecipient: RecipientResponse | null
  setRecipientAction: (r: RecipientResponse) => void
  setStepAction: (s: 1 | 2 | 3 | 4) => void
}

function maskPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  if (digits.length <= 4) return phone
  return '****' + digits.slice(-4)
}

function Initials({ name }: { name: string }) {
  const parts = name.trim().split(' ')
  const initials = parts.length >= 2
    ? parts[0][0] + parts[parts.length - 1][0]
    : parts[0].slice(0, 2)
  return (
    <div style={{
      width: '44px', height: '44px', borderRadius: '50%',
      background: 'linear-gradient(135deg, #F7931A, #e07b0f)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: '15px', fontWeight: 700, color: '#000', flexShrink: 0,
    }}>
      {initials.toUpperCase()}
    </div>
  )
}

function RailBadge({ rail }: { rail: PaymentRail }) {
  const cfg = RAIL_CONFIG[rail]
  return (
    <span style={{
      background: cfg.bg, color: cfg.color,
      fontSize: '10px', fontWeight: 700, padding: '3px 9px',
      borderRadius: '20px', letterSpacing: '0.05em',
      border: `1px solid ${cfg.color}44`,
    }}>
      {cfg.label}
    </span>
  )
}

export function StepRecipient({ selectedRecipient, setRecipientAction, setStepAction }: StepRecipientProps) {
  const { toast } = useToast()
  const [recipients, setRecipients] = useState<RecipientResponse[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)

  // Add form state
  const [newName, setNewName] = useState('')
  const [countryCode, setCountryCode] = useState('+234')
  const [newPhone, setNewPhone] = useState('')
  const [newRail, setNewRail] = useState<PaymentRail>('MPESA')
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState('')

  const formRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let cancelled = false
    let sessionRetries = 0
    let retryTimer: ReturnType<typeof setTimeout> | null = null

    const waitForSessionReady = async (maxAttempts = 5, delayMs = 500): Promise<boolean> => {
      for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
        const sessionRes = await fetch('/api/auth/session', {
          cache: 'no-store',
          credentials: 'same-origin',
        })

        if (sessionRes.ok) {
          return true
        }

        if (sessionRes.status !== 401) {
          return false
        }

        if (attempt < maxAttempts - 1) {
          await new Promise((resolve) => setTimeout(resolve, delayMs))
        }
      }

      return false
    }

    const loadRecipients = async () => {
      try {
        const sessionReady = await waitForSessionReady(6, 500)
        if (!sessionReady) {
          if (sessionRetries < 10) {
            sessionRetries += 1
            setLoadError('Finalizing wallet session...')
            setLoading(false)
            retryTimer = setTimeout(() => {
              if (!cancelled) {
                void loadRecipients()
              }
            }, 1200)
            return
          }

          setRecipients([])
          setLoadError('Unable to establish wallet session. Please disconnect and reconnect.')
          return
        }

        sessionRetries = 0

        const response = await fetch('/api/recipients', {
          credentials: 'same-origin',
        })

        if (!response.ok) {
          setRecipients([])
          setLoadError(
            response.status === 401
              ? 'Session expired. Reconnect wallet and sign again.'
              : 'Failed to load recipients.'
          )
          return
        }

        const data: unknown = await response.json()
        const nextRecipients = Array.isArray(data)
          ? data
          : Array.isArray((data as { recipients?: unknown }).recipients)
            ? (data as { recipients: RecipientResponse[] }).recipients
            : []

        setRecipients(nextRecipients)
        setLoadError('')
      } catch {
        setRecipients([])
        setLoadError('Failed to load recipients.')
        toast({
          title: 'Something went wrong',
          description: 'Failed to load recipients.',
          variant: 'destructive',
        })
      } finally {
        setLoading(false)
      }
    }

    void loadRecipients()

    return () => {
      cancelled = true
      if (retryTimer) {
        clearTimeout(retryTimer)
      }
    }
  }, [])

  const filtered = recipients.filter(r => {
    const q = search.toLowerCase()
    return r.name.toLowerCase().includes(q) || r.phoneNumber.includes(q)
  })

  const handleSelect = (r: RecipientResponse) => {
    setRecipientAction(r)
    // small delay for animation feel
    setTimeout(() => setStepAction(2), 80)
  }

  const handleAddSubmit = async () => {
    if (!newName.trim()) return setFormError('Name is required')
    if (!newPhone.trim()) return setFormError('Phone number is required')
    setFormError('')
    setSubmitting(true)
    try {
      const res = await fetch('/api/recipients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({
          name: newName.trim(),
          phoneNumber: countryCode + newPhone.trim(),
          paymentRail: newRail,
        }),
      })
      if (!res.ok) {
        if (res.status === 401) {
          throw new Error('Session expired. Reconnect wallet and sign again.')
        }
        throw new Error('Failed to add recipient')
      }
      const created: RecipientResponse = await res.json()
      setRecipients(prev => [created, ...prev])
      setShowAddForm(false)
      setNewName(''); setNewPhone(''); setNewRail('MPESA')
      handleSelect(created)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to add recipient. Please try again.'
      setFormError(message)
      toast({
        title: 'Something went wrong',
        description: message,
        variant: 'destructive',
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div style={{ width: '100%' }}>
      {/* Back + heading */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '28px' }}>
        <button
          onClick={() => setStepAction(1)}
          style={{ background: 'none', border: 'none', color: '#888', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
        >
          ← Back
        </button>
        <h2 style={{ color: '#fff', fontSize: '22px', fontWeight: 700, margin: 0 }}>
          Who are you sending to?
        </h2>
      </div>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: '28px' }}>
        <svg style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', opacity: 0.4 }}
          width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
          <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          placeholder="Search by name or phone number"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            width: '100%', background: '#2a2a2a', border: '1px solid #333',
            borderRadius: '10px', padding: '14px 16px 14px 44px',
            color: '#fff', fontSize: '14px', outline: 'none',
            boxSizing: 'border-box',
          }}
        />
      </div>

      {/* Recent recipients label */}
      <p style={{ color: '#666', fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', marginBottom: '12px', textTransform: 'uppercase' }}>
        Recent Recipients
      </p>

      {/* Recipients list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '12px' }}>
        {loading ? (
          <p style={{ color: '#555', fontSize: '14px', padding: '20px 0', textAlign: 'center' }}>Loading…</p>
        ) : loadError ? (
          <p style={{ color: '#ef4444', fontSize: '14px', padding: '20px 0', textAlign: 'center' }}>{loadError}</p>
        ) : filtered.length === 0 ? (
          <p style={{ color: '#555', fontSize: '14px', padding: '20px 0', textAlign: 'center' }}>No recipients found.</p>
        ) : (
          filtered.map(r => {
            const isSelected = selectedRecipient?.id === r.id
            return (
              <motion.div
                key={r.id}
                whileHover={{ scale: 1.005 }}
                whileTap={{ scale: 0.998 }}
                onClick={() => handleSelect(r)}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '14px 16px', borderRadius: '10px', cursor: 'pointer',
                  background: isSelected ? 'rgba(247,147,26,0.08)' : '#2a2a2a',
                  border: isSelected ? '1.5px solid #F7931A' : '1.5px solid transparent',
                  transition: 'border-color 0.2s, background 0.2s',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <Initials name={r.name} />
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                      <span style={{ color: '#fff', fontSize: '15px', fontWeight: 700 }}>{r.name}</span>
                      <RailBadge rail={r.paymentRail} />
                    </div>
                    <span style={{ color: '#666', fontSize: '13px' }}>{maskPhone(r.phoneNumber)}</span>
                  </div>
                </div>
                {isSelected && (
                  <div style={{
                    width: '26px', height: '26px', borderRadius: '50%',
                    border: '2px solid #F7931A', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                      <polyline points="20 6 9 17 4 12" stroke="#F7931A" strokeWidth="2.5" strokeLinecap="round" />
                    </svg>
                  </div>
                )}
              </motion.div>
            )
          })
        )}
      </div>

      {/* Add New Recipient button */}
      <button
        onClick={() => setShowAddForm(v => !v)}
        style={{
          width: '100%', background: '#2a2a2a', border: '1.5px dashed #3a3a3a',
          borderRadius: '10px', padding: '14px', color: '#888',
          fontSize: '14px', fontWeight: 600, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
          marginBottom: '16px', transition: 'border-color 0.2s, color 0.2s',
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#F7931A'; (e.currentTarget as HTMLButtonElement).style.color = '#F7931A' }}
        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#3a3a3a'; (e.currentTarget as HTMLButtonElement).style.color = '#888' }}
      >
        <span style={{ fontSize: '18px', lineHeight: 1 }}>+</span>
        Add a New Recipient
      </button>

      {/* Expandable add form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            ref={formRef}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            style={{ overflow: 'hidden', marginBottom: '16px' }}
          >
            <div style={{
              background: '#222', border: '1px solid #333', borderRadius: '10px',
              padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px',
            }}>
              <p style={{ color: '#F7931A', fontSize: '13px', fontWeight: 700, margin: 0 }}>New Recipient</p>

              {/* Name */}
              <div>
                <label style={{ color: '#777', fontSize: '12px', display: 'block', marginBottom: '6px' }}>Full Name</label>
                <input
                  type="text" placeholder="e.g. Mama Ngozi" value={newName}
                  onChange={e => setNewName(e.target.value)}
                  style={{ width: '100%', background: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', padding: '11px 14px', color: '#fff', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              {/* Phone */}
              <div>
                <label style={{ color: '#777', fontSize: '12px', display: 'block', marginBottom: '6px' }}>Phone Number</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <select
                    value={countryCode}
                    onChange={e => setCountryCode(e.target.value)}
                    style={{ background: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', padding: '11px 10px', color: '#fff', fontSize: '13px', outline: 'none', flexShrink: 0 }}
                  >
                    {COUNTRY_CODES.map(c => (
                      <option key={c.code} value={c.code}>{c.flag} {c.code}</option>
                    ))}
                  </select>
                  <input
                    type="tel" placeholder="8031234567" value={newPhone}
                    onChange={e => setNewPhone(e.target.value)}
                    style={{ flex: 1, background: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', padding: '11px 14px', color: '#fff', fontSize: '14px', outline: 'none', minWidth: 0 }}
                  />
                </div>
              </div>

              {/* Rail */}
              <div>
                <label style={{ color: '#777', fontSize: '12px', display: 'block', marginBottom: '8px' }}>Payment Rail</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {(['MPESA', 'GCASH', 'MTNMOMO'] as PaymentRail[]).map(rail => {
                    const cfg = RAIL_CONFIG[rail]
                    const active = newRail === rail
                    return (
                      <button
                        key={rail}
                        onClick={() => setNewRail(rail)}
                        style={{
                          flex: 1, padding: '10px 8px', borderRadius: '8px', cursor: 'pointer',
                          background: active ? cfg.bg : '#1a1a1a',
                          border: active ? `1.5px solid ${cfg.color}` : '1.5px solid #333',
                          color: active ? cfg.color : '#666',
                          fontSize: '12px', fontWeight: 700, transition: 'all 0.15s',
                        }}
                      >
                        {cfg.label}
                      </button>
                    )
                  })}
                </div>
              </div>

              {formError && (
                <p style={{ color: '#ef4444', fontSize: '12px', margin: 0 }}>{formError}</p>
              )}

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => { setShowAddForm(false); setFormError('') }}
                  style={{ flex: 1, background: 'transparent', border: '1px solid #3a3a3a', borderRadius: '8px', padding: '11px', color: '#777', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddSubmit}
                  disabled={submitting}
                  style={{ flex: 2, background: '#F7931A', border: 'none', borderRadius: '8px', padding: '11px', color: '#000', fontSize: '13px', fontWeight: 700, cursor: submitting ? 'not-allowed' : 'pointer', opacity: submitting ? 0.7 : 1 }}
                >
                  {submitting ? 'Adding…' : 'Add Recipient'}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Next button */}
      <motion.button
        whileHover={selectedRecipient ? { scale: 1.01 } : {}}
        whileTap={selectedRecipient ? { scale: 0.99 } : {}}
        onClick={() => selectedRecipient && setStepAction(2)}
        disabled={!selectedRecipient}
        style={{
          width: '100%', background: selectedRecipient ? '#F7931A' : '#2a2a2a',
          border: 'none', borderRadius: '10px', padding: '16px',
          color: selectedRecipient ? '#000' : '#444',
          fontSize: '15px', fontWeight: 700, cursor: selectedRecipient ? 'pointer' : 'not-allowed',
          transition: 'background 0.2s, color 0.2s',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
        }}
      >
        Next: Amount →
      </motion.button>
    </div>
  )
}
