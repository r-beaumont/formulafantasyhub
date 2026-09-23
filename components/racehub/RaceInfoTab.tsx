'use client'
import { useEffect, useState } from 'react'
import { cardStyle, cardHeaderStyle, monoFont } from '@/components/home/shared'
import { rhCardTitleStyle } from './shared'
import { PillToggle } from './shared'

export interface RaceInfoSession {
  name: string
  short: string
  isoDate: string
  isCompleted: boolean
}

const timeOptions = [
  { id: 'track', label: 'Track' },
  { id: 'your', label: 'Your time' },
  { id: 'utc', label: 'UTC' },
]

function formatSessionDateTime(isoDate: string, timezone: string, mode: string): { dateLabel: string; timeLabel: string } {
  const d = new Date(isoDate)
  if (mode === 'your') {
    return {
      dateLabel: d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }),
      timeLabel: d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
    }
  }
  const tz = mode === 'utc' ? 'UTC' : timezone
  const tzAbbr = new Intl.DateTimeFormat('en-US', { timeZone: tz, timeZoneName: 'short' })
    .formatToParts(d).find(p => p.type === 'timeZoneName')?.value ?? ''
  return {
    dateLabel: d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', timeZone: tz }),
    timeLabel: d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: tz }) + (tzAbbr ? ` ${tzAbbr}` : ''),
  }
}

export default function RaceInfoTab({ timezone, sessions, isCurrentRound }: { timezone: string; sessions: RaceInfoSession[]; isCurrentRound: boolean }) {
  const [mode, setMode] = useState('track')
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  // "Next" only ever applies to the single next session of the CURRENT race
  // weekend — other rounds just show Completed/Upcoming, never a pulsing Next.
  const nextIndex = isCurrentRound ? sessions.findIndex(s => !s.isCompleted) : -1

  return (
    <div style={cardStyle}>
      <div style={{ ...cardHeaderStyle, flexWrap: 'wrap', gap: '10px' }}>
        <span style={rhCardTitleStyle}>Session Schedule</span>
        <PillToggle options={timeOptions} value={mode} onChange={setMode} />
      </div>
      <div style={{ padding: '16px 20px' }}>
        {sessions.length === 0 ? (
          <div style={{ color: 'var(--muted)', fontSize: '13px', padding: '20px 0' }}>Session times to be confirmed.</div>
        ) : sessions.map((s, i) => {
          const { dateLabel, timeLabel } = s.isoDate
            ? formatSessionDateTime(s.isoDate, timezone, mode)
            : { dateLabel: '—', timeLabel: '—' }
          const isNext = i === nextIndex
          const isLive = isNext && mounted && !!s.isoDate && Date.now() >= new Date(s.isoDate).getTime()
          return (
            <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 0', borderBottom: i < sessions.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none', opacity: s.isCompleted ? 0.45 : 1 }}>
              <div style={{ width: '52px', fontFamily: "'Bebas Neue', sans-serif", fontSize: '12px', letterSpacing: '0.5px', color: s.isCompleted ? 'var(--muted2)' : '#8A9AB0', textAlign: 'center', background: 'rgba(255,255,255,0.04)', padding: '4px 6px', borderRadius: '5px', flexShrink: 0 }}>
                {s.short}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '13px', fontWeight: 600, color: s.isCompleted ? 'var(--muted2)' : 'var(--text)' }}>{s.name}</div>
                <div style={{ fontFamily: monoFont, fontSize: '11px', color: 'var(--muted)', marginTop: '2px' }}>{dateLabel} · {timeLabel}</div>
              </div>
              {s.isCompleted ? (
                <span style={{ fontSize: '12px', color: '#00D47E', flexShrink: 0, fontWeight: 600 }}>✓ Completed</span>
              ) : isNext ? (
                isLive ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                    <span className="live-dot" style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#E8002D' }} />
                    <span style={{ fontSize: '9px', fontWeight: 700, color: '#E8002D', textTransform: 'uppercase', letterSpacing: '1px' }}>LIVE</span>
                  </span>
                ) : (
                  <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#E8002D', flexShrink: 0, display: 'inline-block' }} />
                )
              ) : (
                <span style={{ fontSize: '12px', color: 'var(--muted)', flexShrink: 0 }}>Upcoming</span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
