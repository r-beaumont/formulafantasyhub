'use client'

import { useRouter } from 'next/navigation'
import { SEASON_CALENDAR } from '@/lib/races'

function Badge({ type, label }: { type: string; label: string }) {
  const map: Record<string, { bg: string; color: string }> = {
    live: { bg: 'rgba(232,0,45,0.15)', color: '#E8002D' },
    new: { bg: 'rgba(0,212,126,0.12)', color: '#00D47E' },
    race: { bg: 'rgba(255,184,0,0.12)', color: '#FFB800' },
    blue: { bg: 'rgba(0,168,255,0.12)', color: '#00A8FF' },
    done: { bg: 'rgba(255,255,255,0.06)', color: '#5A6A7A' },
  }
  const st = map[type] || map.live
  return <span style={{ fontSize: '10px', fontWeight: 600, padding: '3px 8px', borderRadius: '4px', letterSpacing: '0.5px', textTransform: 'uppercase' as const, background: st.bg, color: st.color }}>{label}</span>
}

export default function CalendarClient() {
  const router = useRouter()
  const nextRaceRound = SEASON_CALENDAR.find(r => !r.completed && !(r as any).calledOff)?.round

  const card = { background: '#0E1318', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', overflow: 'hidden' as const }
  const cardHeader = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px 12px', borderBottom: '1px solid rgba(255,255,255,0.07)' }
  const cardTitle = { fontSize: '12px', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '1.5px', color: '#5A6A7A' }

  return (
    <div style={card}>
      <div style={cardHeader}>
        <span style={cardTitle}>2026 Racing Calendar</span>
        <Badge type="blue" label="22 Rounds" />
      </div>
      <div className="mob-2col" style={{ padding: '16px 20px', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '10px' }}>
        {SEASON_CALENDAR.map((race) => {
          const isCalledOff = (race as any).calledOff
          const isNextRace = race.round === nextRaceRound
          const isNew = race.name === 'Madrid'
          const bgColor = isCalledOff ? 'rgba(255,255,255,0.02)' : race.completed ? '#0E1318' : '#141B22'
          const nameColor = isCalledOff ? '#3A4A5A' : '#F0F4F8'
          return (
            <div
              key={race.round}
              onClick={() => {
                if (isCalledOff) return
                router.push('/race-hub')
              }}
              style={{
                position: 'relative' as const,
                background: bgColor,
                border: isCalledOff ? '1px solid rgba(255,255,255,0.04)'
                  : race.completed ? '1px solid rgba(255,255,255,0.04)'
                  : '1px solid rgba(232,0,45,0.2)',
                borderLeft: (!isCalledOff && !race.completed) ? '3px solid #E8002D' : undefined,
                borderRadius: '10px', padding: '14px',
                cursor: isCalledOff ? 'default' : 'pointer',
                opacity: isCalledOff ? 0.4 : race.completed ? 0.5 : 1,
                transition: 'border-color 0.2s',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '14px', fontWeight: 700, color: '#5A6A7A' }}>R{race.round}</span>
                <div style={{ display: 'flex', gap: '4px' }}>
                  {isNew && <span style={{ fontSize: '8px', fontWeight: 700, padding: '1px 5px', borderRadius: '3px', background: 'rgba(0,168,255,0.15)', color: '#00A8FF' }}>NEW</span>}
                  {isNextRace && <span style={{ fontSize: '8px', fontWeight: 700, padding: '1px 5px', borderRadius: '3px', background: 'rgba(232,0,45,0.15)', color: '#E8002D' }}>NEXT RACE</span>}
                  {race.sprint && !isCalledOff && !isNextRace && <span style={{ fontSize: '8px', fontWeight: 700, padding: '1px 5px', borderRadius: '3px', background: 'rgba(232,0,45,0.15)', color: '#E8002D' }}>SPRINT</span>}
                  {isCalledOff && <span style={{ fontSize: '8px', fontWeight: 700, padding: '1px 5px', borderRadius: '3px', background: 'rgba(255,255,255,0.08)', color: '#5A6A7A' }}>CANCELLED</span>}
                  {race.completed && !isCalledOff && <span style={{ fontSize: '8px', fontWeight: 700, padding: '1px 5px', borderRadius: '3px', background: 'rgba(0,212,126,0.12)', color: '#00D47E' }}>COMPLETED</span>}
                </div>
              </div>
              <div style={{ fontSize: '20px', marginBottom: '6px' }}>{race.flag}</div>
              <div style={{ fontSize: '16px', fontWeight: 700, color: nameColor, marginBottom: '2px' }}>{race.name}</div>
              <div style={{ fontSize: '11px', color: '#3A4A5A', marginBottom: '2px' }}>{race.circuit}</div>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '14px', fontWeight: 600, color: '#5A6A7A' }}>{(race as any).dateRange || race.date}</div>
              {!isCalledOff && <div style={{ marginTop: '8px', fontSize: '10px', color: race.completed ? '#5A6A7A' : '#E8002D', fontWeight: 600 }}>
                {race.completed ? 'View results →' : 'View schedule →'}
              </div>}
            </div>
          )
        })}
      </div>
    </div>
  )
}
