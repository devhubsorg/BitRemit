'use client'

interface StepIndicatorProps {
  currentStep: 1 | 2 | 3 | 4
}

const STEPS = [
  { num: 1, label: 'Recipient' },
  { num: 2, label: 'Amount' },
  { num: 3, label: 'Review' },
  { num: 4, label: 'Sent' },
]

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', gap: 0, width: '100%', maxWidth: '520px', margin: '0 auto' }}>
      {STEPS.map((step, idx) => {
        const isCompleted = step.num < currentStep
        const isActive    = step.num === currentStep
        const isFuture    = step.num > currentStep
        const isLast      = idx === STEPS.length - 1
        const lineOrange  = step.num < currentStep && step.num + 1 <= currentStep

        return (
          <div key={step.num} style={{ display: 'flex', alignItems: 'flex-start', flex: isLast ? 'none' : 1 }}>
            {/* Circle + label */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  background: isCompleted ? '#F7931A' : isActive ? 'transparent' : '#2a2a2a',
                  border: isActive ? '2px solid #F7931A' : isCompleted ? 'none' : '2px solid #3a3a3a',
                  transition: 'all 0.3s ease',
                }}
              >
                {isCompleted ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <polyline points="20 6 9 17 4 12" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  <span style={{
                    fontSize: '14px',
                    fontWeight: 700,
                    color: isActive ? '#F7931A' : '#555',
                  }}>
                    {step.num}
                  </span>
                )}
              </div>
              <span style={{
                fontSize: '12px',
                fontWeight: isActive ? 700 : 400,
                color: isActive ? '#F7931A' : isCompleted ? '#F7931A' : '#555',
                whiteSpace: 'nowrap',
              }}>
                {step.label}
              </span>
            </div>

            {/* Connecting line */}
            {!isLast && (
              <div style={{
                flex: 1,
                height: '2px',
                marginTop: '17px',
                background: lineOrange ? '#F7931A' : '#2a2a2a',
                borderTop: `2px dashed ${lineOrange ? '#F7931A' : '#3a3a3a'}`,
                transition: 'border-color 0.3s ease',
              }} />
            )}
          </div>
        )
      })}
    </div>
  )
}
