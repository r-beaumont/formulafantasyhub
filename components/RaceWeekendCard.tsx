'use client'

import { useState } from 'react'
import { CURRENT_RACE } from '@/lib/races'

function getTrackTZ(timeLocal: string): string {
  const parts = timeLocal.trim().split(' ')
  return parts.length >= 2 ? parts[parts.length - 1] : 'Track'
}

function toUserTime(dateISO: string | undefined): string {
  if (!dateISO) return '—'
  return new Date(dateISO).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
}

export default function RaceWeekendCard() {
  const [useLocalTime, setUseLocalTime] = useState(false)
  const nextSession = CURRENT_RACE.sessions.find(s => !s.completed)
  const trackTZ = CURRENT_RACE.sessions.length > 0 ? getTrackTZ(CURRENT_RACE.sessions[0].timeLocal) : 'Track'

  return (
    <div style={{ background: '#0E1318', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', overflow: 'hidden', position: 'relative' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg,#E8002D,rgba(232,0,45,0.2))' }} />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px 12px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '20px', fontFamily: 'Twemoji Country Flags, DM Sans, sans-serif' }}>{CURRENT_RACE.flag}</span>
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
            >{trackTZ}</button>
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
      <div style={{ padding: '20px' }}>
        <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '36px', lineHeight: 1, marginBottom: '4px' }}>
          {CURRENT_RACE.name}
        </div>
        <div style={{ color: '#5A6A7A', fontSize: '13px', marginBottom: '20px' }}>
          Round {CURRENT_RACE.round} · {CURRENT_RACE.isSprint ? '⚡ Sprint Weekend' : 'Standard Weekend'}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${CURRENT_RACE.sessions.length},1fr)`, gap: '8px' }}>
          {CURRENT_RACE.sessions.map((s) => {
            const isNext = s === nextSession
            const displayTime = useLocalTime ? toUserTime(s.dateISO) : s.timeLocal
            return (
              <div key={s.name} style={{ background: isNext ? 'rgba(232,0,45,0.08)' : '#141B22', border: isNext ? '1px solid rgba(232,0,45,0.4)' : '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', padding: '10px 12px' }}>
                <div style={{ fontSize: '9px', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '1px', color: s.completed ? '#3A4A5A' : isNext ? '#E8002D' : '#5A6A7A', marginBottom: '4px' }}>
                  {s.completed ? '✓' : isNext ? '● Next' : '○'}
                </div>
                <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '14px', color: s.completed ? '#3A4A5A' : '#F0F4F8', marginBottom: '2px' }}>{s.name}</div>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: s.completed ? '#3A4A5A' : '#FFB800' }}>{displayTime}</div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
