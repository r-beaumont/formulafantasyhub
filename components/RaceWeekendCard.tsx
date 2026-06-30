'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useCurrentRace } from '@/lib/useCurrentRace'

/** Returns the formatted time string AND the day of week for the given dateISO. */
function formatTrackTime(
  dateISO: string | undefined,
  timezone: string,
  useLocal: boolean,
): { time: string; day: string } {
  if (!dateISO) return { time: '—', day: '—' }
  const d = new Date(dateISO)
  if (useLocal) {
    return {
      time: d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
      day:  d.toLocaleDateString('en-GB', { weekday: 'long' }).toUpperCase(),
    }
  }
  const tzAbbr =
    new Intl.DateTimeFormat('en-US', { timeZone: timezone, timeZoneName: 'short' })
      .formatToParts(d)
      .find(p => p.type === 'timeZoneName')?.value ?? ''
  return {
    time: d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: timezone }) +
          (tzAbbr ? ` ${tzAbbr}` : ''),
    day:  d.toLocaleDateString('en-GB', { weekday: 'long', timeZone: timezone }).toUpperCase(),
  }
}

function isCompleted(s: { completed: boolean; dateISO?: string; duration?: number }): boolean {
  if (s.completed) return true
  if (!s.dateISO) return false
  const durationMs = (s.duration ?? 120) * 60 * 1000
  return Date.now() > new Date(s.dateISO).getTime() + durationMs
}

export default function RaceWeekendCard() {
  const race = useCurrentRace()
  const [useLocalTime, setUseLocalTime] = useState(false)
  const nextSession = race.sessions.find(s => !isCompleted(s))

  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '14px', overflow: 'hidden', position: 'relative', display: 'flex', flexDirection: 'column' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg,#E8002D,rgba(232,0,45,0.2))' }} />

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px 12px', minHeight: '52px', boxSizing: 'border-box' as const, borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className={`fi fi-${race.flag}`} style={{ width: '1.2em', borderRadius: '2px', display: 'inline-block' }} />
          <span style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '1.5px', color: 'var(--muted)' }}>Current Race Weekend</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Timezone toggle */}
          <div style={{ display: 'flex', background: 'var(--surface2)', borderRadius: '6px', border: '1px solid var(--border)', overflow: 'hidden' }}>
            <button
              onClick={() => setUseLocalTime(false)}
              style={{
                background: !useLocalTime ? 'rgba(232,0,45,0.15)' : 'transparent',
                color: !useLocalTime ? '#E8002D' : 'var(--muted)',
                border: 'none', padding: '4px 10px', cursor: 'pointer',
                fontSize: '10px', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.5px',
              }}
            >Track</button>
            <button
              onClick={() => setUseLocalTime(true)}
              style={{
                background: useLocalTime ? 'rgba(232,0,45,0.15)' : 'transparent',
                color: useLocalTime ? '#E8002D' : 'var(--muted)',
                border: 'none', borderLeft: '1px solid var(--border)',
                padding: '4px 10px', cursor: 'pointer',
                fontSize: '10px', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.5px',
              }}
            >Local</button>
          </div>
          {/* Live indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '7px', height: '7px', background: '#E8002D', borderRadius: '50%', animation: 'pulse 2s infinite' }} />
            <span style={{ fontSize: '10px', fontWeight: 600, color: '#E8002D', textTransform: 'uppercase' as const, letterSpacing: '1px' }}>Live</span>
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: '20px 20px 0', flex: 1 }}>
        <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '36px', lineHeight: 1, marginBottom: '14px' }}>
          {race.name}
        </div>
        <div className="sessions-grid" style={{ display: 'grid', gridTemplateColumns: `repeat(${race.sessions.length},1fr)`, gap: '8px' }}>
          {race.sessions.map(s => {
            const done   = isCompleted(s)
            const isNext = s === nextSession
            const { time: displayTime, day: displayDay } = formatTrackTime(s.dateISO, race.timezone, useLocalTime)
            return (
              <div
                key={s.name}
                style={{
                  background: isNext ? 'rgba(232,0,45,0.08)' : 'var(--surface2)',
                  border: isNext ? '1px solid rgba(232,0,45,0.4)' : '1px solid rgba(255,255,255,0.05)',
                  borderRadius: '8px',
                  padding: '10px 12px',
                }}
              >
                <div style={{ fontSize: '9px', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '1px', color: done ? 'var(--muted2)' : isNext ? '#E8002D' : 'var(--muted)', marginBottom: '4px' }}>
                  {done ? '✓' : isNext ? '● Next' : '○'}
                </div>
                <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '14px', color: done ? 'var(--muted2)' : 'var(--text)', marginBottom: '2px' }}>
                  {s.name}
                </div>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: done ? 'var(--muted2)' : '#FFB800' }}>
                  {displayTime}
                </div>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: done ? 'var(--muted2)' : 'var(--muted)', marginTop: '2px', letterSpacing: '0.5px' }}>
                  {displayDay}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Footer */}
      <div style={{ padding: '12px 20px', borderTop: '1px solid rgba(255,255,255,0.05)', marginTop: '16px' }}>
        <Link href="/race-hub" style={{ fontSize: '12px', color: '#E8002D', textDecoration: 'none', fontWeight: 600 }}>
          Race Hub →
        </Link>
      </div>
    </div>
  )
}
