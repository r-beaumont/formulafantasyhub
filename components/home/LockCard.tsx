'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import type { Race } from '@/lib/races'
import { SEASON_CALENDAR } from '@/lib/races'
import { Flag, monoFont, RiskBadge, btnOutlineStyle } from './shared'

export interface CircuitFacts {
  avgOvertakes: number | null
  dnfAvg: number | null
  gridImportance: 'LOW' | 'MEDIUM' | 'HIGH' | 'TBC'
  lastWinnerName: string | null
  lastWinnerFlag: string | null
  mostWinsDriver: string | null
  mostWinsDriverCount: number | null
}

function dnfRisk(avg: number | null): 'LOW' | 'MEDIUM' | 'HIGH' | 'TBC' {
  if (avg == null) return 'TBC'
  if (avg >= 3) return 'HIGH'
  if (avg >= 1.5) return 'MEDIUM'
  return 'LOW'
}

function pad(n: number) { return String(n).padStart(2, '0') }

function wmoIcon(code: number): string {
  if (code === 0) return '☀️'
  if (code <= 2) return '🌤️'
  if (code === 3) return '☁️'
  if (code <= 48) return '🌫️'
  if (code <= 57) return '🌦️'
  if (code <= 67) return '🌧️'
  if (code <= 82) return '🌦️'
  return '⛈️'
}

export default function LockCard({ race, facts }: { race: Race; facts: CircuitFacts }) {
  const deadlineSession = race.isSprint
    ? race.sessions.find(s => s.name === 'Sprint')
    : race.sessions.find(s => s.name === 'Qualifying')

  const [mounted, setMounted] = useState(false)
  const [timeLeft, setTimeLeft] = useState({ d: 0, h: 0, m: 0, s: 0 })

  useEffect(() => {
    setMounted(true)
    if (!deadlineSession?.dateISO) return
    const target = new Date(deadlineSession.dateISO).getTime()
    function tick() {
      const totalSecs = Math.max(0, Math.floor((target - Date.now()) / 1000))
      setTimeLeft({
        d: Math.floor(totalSecs / 86400),
        h: Math.floor((totalSecs % 86400) / 3600),
        m: Math.floor((totalSecs % 3600) / 60),
        s: totalSecs % 60,
      })
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [deadlineSession?.dateISO])

  const [weather, setWeather] = useState<{ icon: string; temp: number; rain: number } | null>(null)
  useEffect(() => {
    const cal = SEASON_CALENDAR.find(r => r.round === race.round)
    if (!cal?.lat || !cal?.lon) return
    const lastSession = race.sessions[race.sessions.length - 1]
    if (!lastSession?.dateISO) return
    const day = lastSession.dateISO.slice(0, 10)
    fetch(`/api/forecast?lat=${cal.lat}&lon=${cal.lon}&start_date=${day}&end_date=${day}`)
      .then(r => r.json())
      .then(data => {
        const daily = data?.daily
        if (!daily?.temperature_2m_max?.length) return
        setWeather({
          icon: wmoIcon(daily.weather_code[0]),
          temp: Math.round(daily.temperature_2m_max[0]),
          rain: Math.round(daily.precipitation_probability_max[0]),
        })
      })
      .catch(() => {})
  }, [race.round])

  const risk = dnfRisk(facts.dnfAvg)

  const dayLabel = deadlineSession?.dateISO
    ? new Date(deadlineSession.dateISO).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', timeZone: race.timezone })
    : ''
  const trackTimeLabel = deadlineSession?.dateISO
    ? new Date(deadlineSession.dateISO).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: race.timezone })
    : ''
  const utcTimeLabel = deadlineSession?.dateISO
    ? new Date(deadlineSession.dateISO).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'UTC' })
    : ''

  const cdUnits: { key: keyof typeof timeLeft; label: string }[] = [
    { key: 'd', label: 'DAYS' }, { key: 'h', label: 'HOURS' }, { key: 'm', label: 'MINS' }, { key: 's', label: 'SECS' },
  ]

  return (
    <aside style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '14px', padding: '24px', display: 'flex', flexDirection: 'column', height: '100%' }}>
      <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '34px', lineHeight: 1, letterSpacing: '0.5px', margin: 0 }}>F1 Fantasy team lock</h2>
      {deadlineSession?.dateISO && (
        <p style={{ color: 'var(--muted)', fontSize: '14px', marginTop: '6px' }}>
          Line-ups lock when {race.isSprint ? 'the Sprint' : 'Qualifying'} starts: {dayLabel}, {trackTimeLabel} local ({utcTimeLabel} UTC).
        </p>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '8px', margin: '16px 0 0' }}>
        {cdUnits.map(u => (
          <div key={u.key} style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: '10px', padding: '14px 4px', textAlign: 'center' }}>
            <b style={{ display: 'block', fontFamily: monoFont, fontWeight: 700, fontSize: 'clamp(28px,3.4vw,42px)', color: 'var(--text)' }}>
              {mounted ? pad(timeLeft[u.key]) : '--'}
            </b>
            <span style={{ fontSize: '11px', letterSpacing: '0.5px', textTransform: 'uppercase', color: 'var(--muted)' }}>{u.label}</span>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '8px', margin: '12px 0 16px' }}>
        <div style={{ background: 'var(--surface2)', borderRadius: '12px', padding: '12px' }}>
          <span style={{ fontSize: '12px', color: 'var(--muted)' }}>Avg overtakes</span>
          <b style={{ display: 'block', fontFamily: monoFont, fontWeight: 700, fontSize: '20px', margin: '3px 0 6px' }}>{facts.avgOvertakes ?? '—'}</b>
          <RiskBadge level={facts.gridImportance} />
        </div>
        <div style={{ background: 'var(--surface2)', borderRadius: '12px', padding: '12px' }}>
          <span style={{ fontSize: '12px', color: 'var(--muted)' }}>Avg DNFs</span>
          <b style={{ display: 'block', fontFamily: monoFont, fontWeight: 700, fontSize: '20px', margin: '3px 0 6px' }}>{facts.dnfAvg != null ? facts.dnfAvg.toFixed(2) : '—'}</b>
          <RiskBadge level={risk} />
        </div>
        <div style={{ background: 'var(--surface2)', borderRadius: '12px', padding: '12px' }}>
          <span style={{ fontSize: '12px', color: 'var(--muted)' }}>Race day</span>
          {weather ? (
            <>
              <b style={{ display: 'block', fontFamily: monoFont, fontWeight: 700, fontSize: '20px', margin: '3px 0 6px' }}>{weather.icon} {weather.temp}°</b>
              <span style={{ fontFamily: monoFont, fontSize: '12px', color: weather.rain >= 60 ? '#E8002D' : weather.rain >= 30 ? '#FFB800' : 'var(--muted)' }}>💧 {weather.rain}%</span>
            </>
          ) : (
            <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '6px' }}>Loading…</div>
          )}
        </div>
      </div>

      {facts.lastWinnerName && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', background: 'var(--surface2)', borderRadius: '12px', padding: '12px 14px', marginBottom: '10px', fontSize: '13px' }}>
          <span style={{ fontSize: '12px', color: 'var(--muted)' }}>2025 winner</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {facts.lastWinnerFlag && <Flag code={facts.lastWinnerFlag} />}
            <b>{facts.lastWinnerName}</b>
          </span>
        </div>
      )}
      {facts.mostWinsDriver && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', background: 'var(--surface2)', borderRadius: '12px', padding: '12px 14px', marginBottom: '14px', fontSize: '13px' }}>
          <span style={{ fontSize: '12px', color: 'var(--muted)' }}>Most wins here</span>
          <span><b>{facts.mostWinsDriver}</b> <span style={{ fontFamily: monoFont, color: '#E8002D' }}>{facts.mostWinsDriverCount}×</span></span>
        </div>
      )}

      <Link href="/f1-fantasy" style={{ ...btnOutlineStyle, width: '100%', justifyContent: 'center', marginTop: 'auto' }}>See circuit insights</Link>
    </aside>
  )
}
