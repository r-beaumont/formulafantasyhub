'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { SEASON_CALENDAR } from '@/lib/races'
import { RACE_WEEKENDS } from '@/lib/raceResults'

export default function CalendarClient() {
  const router = useRouter()

  // First non-completed, non-calledOff round is Japan R3
  const nextRaceRound = SEASON_CALENDAR.find(r => !r.completed && !r.calledOff)?.round ?? 3

  const [openRound, setOpenRound] = useState<number | null>(nextRaceRound)
  const rowRefs = useRef<Record<number, HTMLDivElement | null>>({})

  // Scroll to the next upcoming race on mount
  useEffect(() => {
    const el = rowRefs.current[nextRaceRound]
    if (el) {
      setTimeout(() => {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }, 120)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function toggleRound(round: number, calledOff: boolean) {
    if (calledOff) return
    setOpenRound(prev => (prev === round ? null : round))
  }

  return (
    <div style={{ background: '#0E1318', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', overflow: 'hidden' }}>
      {/* Card header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px 12px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <span style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '1.5px', color: '#5A6A7A' }}>
          2026 Racing Calendar
        </span>
        <span style={{ fontSize: '10px', fontWeight: 600, padding: '3px 8px', borderRadius: '4px', letterSpacing: '0.5px', textTransform: 'uppercase' as const, background: 'rgba(0,168,255,0.12)', color: '#00A8FF' }}>
          22 Rounds
        </span>
      </div>

      {/* Accordion rows */}
      <div>
        {SEASON_CALENDAR.map((race, idx) => {
          const isCalledOff = race.calledOff
          const isNextRace  = race.round === nextRaceRound
          const isOpen      = openRound === race.round
          const isLast      = idx === SEASON_CALENDAR.length - 1

          // Winner from static race data
          const winner = !isCalledOff && race.completed
            ? RACE_WEEKENDS[race.round]?.race?.[0]?.name ?? null
            : null
          const winnerSurname = winner ? winner.split(' ').slice(-1)[0] : null

          // Status badge
          let badgeText: string
          let badgeBg: string
          let badgeColor: string
          if (isCalledOff) {
            badgeText = 'Cancelled'; badgeBg = 'rgba(255,255,255,0.06)'; badgeColor = '#5A6A7A'
          } else if (race.completed && winnerSurname) {
            badgeText = `${winnerSurname} WIN`; badgeBg = 'rgba(0,212,126,0.12)'; badgeColor = '#00D47E'
          } else if (race.completed) {
            badgeText = 'Completed'; badgeBg = 'rgba(0,212,126,0.12)'; badgeColor = '#00D47E'
          } else {
            badgeText = 'Upcoming'; badgeBg = 'rgba(232,0,45,0.12)'; badgeColor = '#E8002D'
          }

          const borderLeft = (!isCalledOff && (isOpen || isNextRace)) ? '3px solid #E8002D' : '3px solid transparent'

          return (
            <div
              key={race.round}
              ref={(el: HTMLDivElement | null) => { rowRefs.current[race.round] = el }}
              style={{ borderBottom: isLast ? 'none' : '1px solid rgba(255,255,255,0.05)' }}
            >
              {/* ── Collapsed header row ── */}
              <div
                onClick={() => toggleRound(race.round, isCalledOff)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '11px 20px',
                  cursor: isCalledOff ? 'default' : 'pointer',
                  opacity: isCalledOff ? 0.42 : 1,
                  background: isOpen ? 'rgba(232,0,45,0.04)' : 'transparent',
                  borderLeft,
                  transition: 'background 0.2s',
                  userSelect: 'none' as const,
                }}
              >
                {/* Round */}
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', fontWeight: 700, color: '#5A6A7A', width: '26px', flexShrink: 0 }}>
                  R{race.round}
                </span>

                {/* Flag */}
                <span style={{ fontSize: '18px', flexShrink: 0 }}>{race.flag}</span>

                {/* Name + circuit */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '7px', flexWrap: 'wrap' as const }}>
                    <span style={{
                      fontFamily: 'Bebas Neue, sans-serif',
                      fontSize: '16px',
                      letterSpacing: '0.5px',
                      color: isCalledOff ? '#3A4A5A' : '#F0F4F8',
                      lineHeight: 1.1,
                    }}>
                      {race.name}
                    </span>
                    {race.sprint && !isCalledOff && (
                      <span style={{ fontSize: '9px', fontWeight: 700, padding: '1px 5px', borderRadius: '3px', background: 'rgba(232,0,45,0.15)', color: '#E8002D', flexShrink: 0 }}>
                        Sprint
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '11px', color: '#3A4A5A', marginTop: '1px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>
                    {race.circuit}
                  </div>
                </div>

                {/* Date — hidden on very small screens via inline style */}
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: '#5A6A7A', flexShrink: 0 }}>
                  {race.dateRange || race.date}
                </span>

                {/* Status badge */}
                <span style={{
                  fontSize: '9px', fontWeight: 700, padding: '2px 7px', borderRadius: '4px',
                  letterSpacing: '0.4px', textTransform: 'uppercase' as const,
                  background: badgeBg, color: badgeColor, flexShrink: 0, whiteSpace: 'nowrap' as const,
                }}>
                  {badgeText}
                </span>

                {/* Chevron */}
                {!isCalledOff && (
                  <span style={{
                    fontSize: '10px', color: '#5A6A7A', flexShrink: 0,
                    display: 'inline-block',
                    transition: 'transform 0.3s ease',
                    transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  }}>▼</span>
                )}
              </div>

              {/* ── Expanded content ── */}
              <div style={{
                maxHeight: isOpen ? '520px' : '0',
                overflow: 'hidden',
                transition: 'max-height 0.35s ease',
              }}>
                <div style={{
                  background: '#0E1318',
                  borderTop: '1px solid rgba(232,0,45,0.12)',
                  padding: '16px 20px 18px',
                  paddingLeft: '20px',
                }}>
                  {/* Expanded title */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px', flexWrap: 'wrap' as const }}>
                    <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '24px', letterSpacing: '1px', color: '#F0F4F8', lineHeight: 1 }}>
                      {race.flag} {race.name} Grand Prix
                    </span>
                    {race.sprint && !isCalledOff && (
                      <span style={{ fontSize: '9px', fontWeight: 700, padding: '2px 7px', borderRadius: '3px', background: 'rgba(232,0,45,0.15)', color: '#E8002D' }}>
                        ⚡ Sprint Weekend
                      </span>
                    )}
                  </div>

                  {/* Info grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '8px', marginBottom: '14px' }}>
                    {[
                      { label: 'Circuit', value: race.circuit },
                      { label: 'Date',    value: race.dateRange || race.date },
                      { label: 'Round',   value: `${race.round} of 22` },
                    ].map(item => (
                      <div key={item.label} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '8px', padding: '9px 12px' }}>
                        <div style={{ fontSize: '10px', color: '#5A6A7A', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.4px', marginBottom: '3px' }}>
                          {item.label}
                        </div>
                        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', color: '#F0F4F8', fontWeight: 600 }}>
                          {item.value}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Sessions if available */}
                  {race.sessions && race.sessions.length > 0 && (
                    <div style={{ marginBottom: '14px' }}>
                      <div style={{ fontSize: '10px', color: '#5A6A7A', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.4px', marginBottom: '7px' }}>
                        Session Schedule
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '5px' }}>
                        {race.sessions.map((s) => {
                          const shortMap: Record<string, string> = {
                            'Practice 1': 'FP1', 'Practice 2': 'FP2', 'Practice 3': 'FP3',
                            'Sprint Qualifying': 'SQ', 'Sprint': 'SPR', 'Qualifying': 'QUAL', 'Race': 'RACE',
                          }
                          const short = shortMap[s.name] || s.name
                          const now = new Date()
                          const dt  = new Date(s.date)
                          const done = dt < now
                          const dateStr = dt.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', timeZone: race.timezone })
                          const timeStr = dt.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: race.timezone })
                          return (
                            <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: '10px', opacity: done ? 0.45 : 1 }}>
                              <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '11px', letterSpacing: '0.5px', color: done ? '#3A4A5A' : '#8A9AB0', background: 'rgba(255,255,255,0.04)', padding: '2px 6px', borderRadius: '4px', width: '42px', textAlign: 'center' as const, flexShrink: 0 }}>
                                {short}
                              </span>
                              <span style={{ fontSize: '12px', color: done ? '#3A4A5A' : '#F0F4F8', flex: 1 }}>{s.name}</span>
                              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#5A6A7A' }}>{dateStr} · {timeStr}</span>
                              {done && <span style={{ fontSize: '11px', color: '#00D47E' }}>✓</span>}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {/* Winner banner */}
                  {race.completed && winner && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px', padding: '8px 12px', background: 'rgba(0,212,126,0.06)', borderRadius: '8px', border: '1px solid rgba(0,212,126,0.15)' }}>
                      <span style={{ fontSize: '14px' }}>🏆</span>
                      <span style={{ fontSize: '12px', color: '#00D47E', fontWeight: 600 }}>Winner: {winner}</span>
                    </div>
                  )}

                  {/* CTA */}
                  {!isCalledOff && (
                    <button
                      onClick={() => router.push(`/race-hub?round=${race.round}&tab=${race.completed ? 'results' : 'race-info'}`)}
                      style={{
                        background: '#E8002D', color: 'white', border: 'none', borderRadius: '8px',
                        padding: '8px 18px', fontSize: '12px', fontWeight: 700, cursor: 'pointer',
                        letterSpacing: '0.3px',
                      }}
                    >
                      {race.completed ? 'View Results →' : 'View Schedule →'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
