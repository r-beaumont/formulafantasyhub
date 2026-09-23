'use client'
import { useEffect, useRef } from 'react'
import { Flag } from '@/components/home/shared'

export interface RoundChipData {
  round: number
  name: string
  flag: string
  completed: boolean
  calledOff: boolean
}

export default function RoundSelector({
  rounds, selectedRound, currentRound, onSelect,
}: {
  rounds: RoundChipData[]
  selectedRound: number
  currentRound: number
  onSelect: (round: number) => void
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const selectedRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const container = containerRef.current
    const selected = selectedRef.current
    if (!container || !selected) return
    container.scrollLeft = selected.offsetLeft - container.clientWidth / 2 + selected.clientWidth / 2
  }, [selectedRound])

  return (
    <div
      ref={containerRef}
      style={{ display: 'flex', gap: '6px', overflowX: 'auto', padding: '2px 0 16px', scrollbarWidth: 'thin' as const }}
    >
      {rounds.map(r => {
        const isSelected = r.round === selectedRound
        const isCurrent = r.round === currentRound
        return (
          <button
            key={r.round}
            ref={isSelected ? selectedRef : undefined}
            onClick={() => { if (!r.calledOff) onSelect(r.round) }}
            disabled={r.calledOff}
            style={{
              flexShrink: 0, display: 'flex', alignItems: 'center', gap: '8px',
              padding: '7px 12px', borderRadius: '10px', fontSize: '12px', fontWeight: 600,
              cursor: r.calledOff ? 'default' : 'pointer', transition: 'all .15s',
              background: isSelected ? 'rgba(232,0,45,.12)' : 'var(--surface)',
              border: isSelected ? '1px solid rgba(232,0,45,.4)' : isCurrent ? '1px solid rgba(232,0,45,.3)' : '1px solid var(--border)',
              color: isSelected ? 'var(--text)' : 'var(--muted)',
              opacity: r.calledOff ? 0.5 : 1,
            }}
          >
            <Flag code={r.flag} size={14} />
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', fontWeight: 700, color: isSelected ? '#E8002D' : r.completed ? '#00D47E' : 'var(--muted)' }}>R{r.round}</span>
            <span>{r.name}</span>
          </button>
        )
      })}
    </div>
  )
}
