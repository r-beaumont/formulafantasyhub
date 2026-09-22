'use client'

import { useEffect, useRef, useState } from 'react'
import { cardStyle } from '@/components/home/shared'
import { PillToggle } from '@/components/racehub/shared'
import SeasonProgressCard from '@/components/calendar/SeasonProgressCard'
import CalendarRow, { calendarRowStyleTag, type CalendarRowData } from '@/components/calendar/CalendarRow'
import type { CalendarTile } from '@/components/home/SeasonCalendarStrip'

const filterOptions = [
  { id: 'all', label: 'All' },
  { id: 'up', label: 'Upcoming' },
  { id: 'done', label: 'Completed' },
  { id: 'sprint', label: 'Sprint weekends' },
]

export default function CalendarClient({ rows, tiles, currentRound, completedCount }: {
  rows: CalendarRowData[]
  tiles: CalendarTile[]
  currentRound: number
  completedCount: number
}) {
  const [filter, setFilter] = useState('all')
  const [openRound, setOpenRound] = useState<number | null>(currentRound)
  const rowRefs = useRef<Record<number, HTMLDivElement | null>>({})

  useEffect(() => {
    const el = rowRefs.current[currentRound]
    if (el) {
      setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'center' }), 120)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const filteredRows = rows.filter(r => {
    if (filter === 'up') return !r.completed && !r.calledOff
    if (filter === 'done') return r.completed
    if (filter === 'sprint') return r.sprint
    return true
  })

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: calendarRowStyleTag }} />

      <div style={{ marginBottom: '20px' }}>
        <SeasonProgressCard tiles={tiles} currentRound={currentRound} completedCount={completedCount} />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap' as const, marginBottom: '14px' }}>
        <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '22px', letterSpacing: '0.6px', color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          2026 Racing Calendar · 23 Rounds
        </span>
        <PillToggle options={filterOptions} value={filter} onChange={setFilter} />
      </div>

      <div style={cardStyle}>
        {filteredRows.map((row, i) => (
          <div key={row.round} ref={el => { rowRefs.current[row.round] = el }}>
            <CalendarRow
              row={row}
              isCurrent={row.round === currentRound}
              isOpen={openRound === row.round}
              isFirst={i === 0}
              onToggle={() => setOpenRound(prev => (prev === row.round ? null : row.round))}
            />
          </div>
        ))}
      </div>
    </>
  )
}
