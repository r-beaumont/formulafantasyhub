'use client'

import Link from 'next/link'
import { useState } from 'react'
import { CURRENT_RACE } from '@/lib/races'

function formatTrackTime(dateISO: string | undefined, timezone: string, useLocal: boolean): string {
  if (!dateISO) return '—'
  const d = new Date(dateISO)
  if (useLocal) return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
  const tzAbbr = new Intl.DateTimeFormat('en-US', { timeZone: timezone, timeZoneName: 'short' })
    .formatToParts(d).find(p => p.type === 'timeZoneName')?.value ?? ''
  return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: timezone }) + (tzAbbr ? ` ${tzAbbr}` : '')
}

// A session is completed if its completed flag is set OR if 2 hours have passed since scheduled start
function isCompleted(s: { completed: boolean; dateISO?: string }): boolean {
  if (s.completed) return true
  if (!s.dateISO) return false
  return Date.now() > new Date(s.dateISO).getTime() + 2 * 60 * 60 * 1000
}

export default function RaceWeekendCard() {
  const [useLocalTime, setUseLocalTime] = useState(false)
  const nextSession = CURRENT_RACE.sessions.find(s => !isCompleted(s))

  return (
    <div style={{ background: '#0E1318', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', overflow: 'hidden', position: 'relative', display: 'flex', flexDirection: 'column' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg,#E8002D,rgba(232,0,45,0.2))' }} />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px 12px', minHeight: '52px', boxSizing: 'border-box' as const, borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className={`fi fi-${CURRENT_RACE.flag}`} style={{ width: '1.2em', borderRadius: '2px', display: 'inline-block' }}></span>
          <span style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '1.5px', color: '#5A6A7A' }}>Current Race Weekend</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Timezone toggle */}
          <div style={{ display: 'flex', background: '#141B22', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.07)', overflow: 'hidden' }}>
            <button
              onClick={() => setUseLocalTime(false)}
              style={{
                background: !useLocalTime ? 'rgba(232,0,45,0.15)' : 'transparent',
                color: !useLocalTime ? '#E8002D' : '#5A6A7A',
                border: 'none', padding: '4px 10px', cursor: 'pointer',
                fontSize: '10px', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.5px',
              }}
            >Track</button>
            <button
              onClick={() => setUseLocalTime(true)}
              style={{
                background: useLocalTime ? 'rgba(232,0,45,0.15)' : 'transparent',
                color: useLocalTime ? '#E8002D' : '#5A6A7A',
                border: 'none', borderLeft: '1px solid rgba(255,255,255,0.07)',
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
      <div style={{ padding: '20px 20px 0', flex: 1 }}>
        <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '36px', lineHeight: 1, marginBottom: '14px' }}>
          {CURRENT_RACE.name}
        </div>
        <div className="sessions-grid" style={{ display: 'grid', gridTemplateColumns: `repeat(${CURRENT_RACE.sessions.length},1fr)`, gap: '8px' }}>
          {CURRENT_RACE.sessions.map((s) => {
            const isNext = s === nextSession
            const displayTime = formatTrackTime(s.dateISO, CURRENT_RACE.timezone, useLocalTime)
            return (
              <div key={s.name} style={{ background: isNext ? 'rgba(232,0,45,0.08)' : '#141B22', border: isNext ? '1px solid rgba(232,0,45,0.4)' : '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', padding: '10px 12px' }}>
                <div style={{ fontSize: '9px', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '1px', color: isCompleted(s) ? '#3A4A5A' : isNext ? '#E8002D' : '#5A6A7A', marginBottom: '4px' }}>
                  {isCompleted(s) ? '✓' : isNext ? '● Next' : '○'}
                </div>
                <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '14px', color: isCompleted(s) ? '#3A4A5A' : '#F0F4F8', marginBottom: '2px' }}>{s.name}</div>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: isCompleted(s) ? '#3A4A5A' : '#FFB800' }}>{displayTime}</div>
              </div>
            )
          })}
        </div>
      </div>
      {/* Footer link */}
      <div style={{ padding: '12px 20px', borderTop: '1px solid rgba(255,255,255,0.05)', marginTop: '16px' }}>
        <Link href="/race-hub" style={{ fontSize: '12px', color: '#E8002D', textDecoration: 'none', fontWeight: 600 }}>
          Race Hub →
        </Link>
      </div>
    </div>
  )
}
