'use client'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useCurrentRace } from '@/lib/useCurrentRace'
import { Flag, monoFont, btnRedStyle, btnOutlineStyle } from './shared'
import LockCard, { type CircuitFacts } from './LockCard'

type Mode = 'track' | 'your' | 'utc'
const modeOptions: { id: Mode; label: string }[] = [
  { id: 'track', label: 'Track' },
  { id: 'your', label: 'Your time' },
  { id: 'utc', label: 'UTC' },
]

function formatSessionTime(iso: string, mode: Mode, timezone: string) {
  const d = new Date(iso)
  if (mode === 'your') return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
  return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: mode === 'utc' ? 'UTC' : timezone })
}
function formatSessionDay(iso: string, mode: Mode, timezone: string) {
  const d = new Date(iso)
  const tz = mode === 'your' ? undefined : (mode === 'utc' ? 'UTC' : timezone)
  return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', timeZone: tz })
}

function PillToggle({ value, onChange }: { value: Mode; onChange: (m: Mode) => void }) {
  const btnRefs = useRef<Record<string, HTMLButtonElement | null>>({})
  const [thumb, setThumb] = useState({ left: 0, width: 0 })

  useLayoutEffect(() => {
    const btn = btnRefs.current[value]
    if (btn) setThumb({ left: btn.offsetLeft, width: btn.offsetWidth })
  }, [value])

  return (
    <div style={{ position: 'relative', display: 'inline-flex', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '999px', padding: '4px', maxWidth: '100%', overflowX: 'auto' }}>
      <span style={{ position: 'absolute', top: '4px', bottom: '4px', left: thumb.left, width: thumb.width, borderRadius: '999px', background: 'var(--surface3)', boxShadow: '0 2px 10px rgba(0,0,0,0.25)', transition: 'left .32s cubic-bezier(.3,.8,.2,1), width .32s cubic-bezier(.3,.8,.2,1)' }} />
      {modeOptions.map(o => (
        <button
          key={o.id}
          ref={el => { btnRefs.current[o.id] = el }}
          onClick={() => onChange(o.id)}
          style={{ position: 'relative', zIndex: 1, background: 'transparent', border: 'none', color: value === o.id ? 'var(--text)' : 'var(--muted)', padding: '7px 16px', borderRadius: '999px', fontSize: '13px', fontWeight: 600, whiteSpace: 'nowrap', cursor: 'pointer', transition: 'color .25s' }}
        >{o.label}</button>
      ))}
    </div>
  )
}

export default function HeroSnapshot({ previewSlug, circuitFacts }: { previewSlug: string; circuitFacts: CircuitFacts }) {
  const race = useCurrentRace()
  const [mode, setMode] = useState<Mode>('track')
  const [stacked, setStacked] = useState(false)

  useEffect(() => {
    const check = () => setStacked(window.innerWidth <= 1000)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const nextIndex = race.sessions.findIndex(s => !s.completed)
  const [namePart, ...restParts] = race.name.split(' Grand Prix')
  void restParts

  return (
    <section style={{ display: 'grid', gridTemplateColumns: stacked ? '1fr' : '1.35fr 1fr', gap: '24px', alignItems: 'stretch', padding: '34px 0 24px' }}>
      <div>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center', color: 'var(--muted)', fontSize: '14px' }}>
          <Flag code={race.flag} size="1.4em" />
          <span>Round {race.round} of 23</span>
          <span>{race.circuit}</span>
          <span>{race.dateRange}</span>
          {race.isSprint && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '10px', fontWeight: 700, padding: '3px 9px', borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '0.6px', color: '#00A8FF', background: 'rgba(0,168,255,.12)' }}>Sprint</span>
          )}
        </div>

        <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(64px,9.5vw,140px)', lineHeight: 0.86, letterSpacing: '0.5px', margin: '14px 0 22px', textTransform: 'uppercase' }}>
          {namePart}<br />Grand Prix
        </h1>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', marginBottom: '10px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--muted)' }}>Session times</span>
          <PillToggle value={mode} onChange={setMode} />
        </div>

        <div style={{ overflowX: 'auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', border: '1px solid var(--border)', borderRadius: '14px', overflow: 'hidden', background: 'var(--surface)', minWidth: '560px' }}>
            {race.sessions.map((s, i) => {
              const isNext = i === nextIndex
              return (
                <div key={s.name} style={{
                  padding: '14px', borderLeft: i === 0 ? 'none' : '1px solid var(--border)',
                  background: isNext ? 'var(--surface2)' : 'transparent',
                  boxShadow: isNext ? 'inset 0 3px 0 #E8002D' : 'none',
                  opacity: s.completed ? 0.45 : 1,
                  transition: 'background .2s',
                }}>
                  <div style={{ fontSize: '13px', color: 'var(--muted)', fontWeight: 500, display: 'flex', gap: '6px', alignItems: 'center', minHeight: '22px' }}>
                    {s.name}
                    {isNext && <span style={{ fontSize: '10px', fontWeight: 700, padding: '3px 9px', borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '0.6px', color: '#E8002D', background: 'rgba(232,0,45,0.14)' }}>Next</span>}
                    {s.completed && <span style={{ color: '#00D47E' }}>✓</span>}
                  </div>
                  <div style={{ fontFamily: monoFont, fontWeight: 700, fontSize: '24px', marginTop: '4px', color: 'var(--text)' }}>
                    {s.dateISO ? formatSessionTime(s.dateISO, mode, race.timezone) : '—'}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--muted)' }}>
                    {s.dateISO ? formatSessionDay(s.dateISO, mode, race.timezone) : ''}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '20px' }}>
          <Link href="/race-hub" style={btnRedStyle}>Open Race Hub</Link>
          <Link href="/f1-fantasy" style={btnOutlineStyle}>F1 Fantasy strategy</Link>
          <Link href={`/news/${previewSlug}`} style={btnOutlineStyle}>Read the {race.shortName} preview</Link>
        </div>
      </div>

      <LockCard race={race} facts={circuitFacts} />
    </section>
  )
}
