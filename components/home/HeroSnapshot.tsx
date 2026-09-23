'use client'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useCurrentRace } from '@/lib/useCurrentRace'
import type { Session } from '@/lib/races'
import { Flag, monoFont, btnRedStyle, btnOutlineStyle } from './shared'
import LockCard, { type CircuitFacts } from './LockCard'
import CircuitMap from '@/components/racehub/CircuitMap'

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

// A session is "live" once its start time has passed — since `completed`
// (computed upstream from start + duration) is what flips it out of the
// "next" slot, the only way a non-completed session can be at/past its own
// start time is if it's currently in progress. `mounted` keeps the very
// first (SSR) render deterministic so this never causes a hydration mismatch.
function SessionIndicator({ session, isNext, mounted }: { session: Session; isNext: boolean; mounted: boolean }) {
  if (session.completed) return <span style={{ color: '#00D47E', flexShrink: 0 }}>✓</span>
  if (!isNext) return null
  const isLive = mounted && !!session.dateISO && Date.now() >= new Date(session.dateISO).getTime()
  if (isLive) {
    return <span className="live-dot" style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#E8002D', flexShrink: 0 }} />
  }
  return <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#E8002D', flexShrink: 0, display: 'inline-block' }} />
}

const FALLBACK_FACTS: CircuitFacts = {
  avgOvertakes: null, dnfAvg: null, gridImportance: 'TBC',
  lastWinnerName: null, lastWinnerFlag: null, mostWinsDriver: null, mostWinsDriverCount: null,
}

export default function HeroSnapshot({ previewSlug, circuitFactsByRound }: { previewSlug: string; circuitFactsByRound: Record<number, CircuitFacts> }) {
  const race = useCurrentRace()
  const facts = circuitFactsByRound[race.round] ?? FALLBACK_FACTS
  const [mode, setMode] = useState<Mode>('track')
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  const nextIndex = race.sessions.findIndex(s => !s.completed)
  const [namePart, ...restParts] = race.name.split(' Grand Prix')
  void restParts

  return (
    <section className="hero-outer">
      {/* Layout below 900px is driven entirely by CSS media queries (see
          <style> block) rather than a window.innerWidth check in JS. A JS
          check here previously read window.innerWidth during the same
          render pass whose own (pre-fix) desktop-width SSR markup had just
          forced mobile Chrome to widen its layout viewport past the 900px
          breakpoint — a self-referential bug that permanently stuck the
          hero in its desktop layout on real phones. CSS media queries are
          evaluated against the true device viewport and can't be fooled by
          the page's own content this way. */}
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minWidth: 0 }}>
        <div className="hero-top">
          <div className="hero-title-area" style={{ minWidth: 0 }}>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center', color: 'var(--muted)', fontSize: '14px', minWidth: 0 }}>
              <Flag code={race.flag} size={22} />
              <span>Round {race.round} of 23</span>
              <span>{race.circuit}</span>
              <span>{race.dateRange}</span>
              {race.isSprint && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '10px', fontWeight: 700, padding: '3px 9px', borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '0.6px', color: '#00A8FF', background: 'rgba(0,168,255,.12)' }}>Sprint</span>
              )}
            </div>

            <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(38px,5.2vw,84px)', lineHeight: 0.88, letterSpacing: '0.5px', margin: '14px 0 0', textTransform: 'uppercase', overflowWrap: 'break-word' }}>
              {namePart}<br />Grand Prix
            </h1>
          </div>

          <Link href={`/race-hub?round=${race.round}`} className="hero-map-area" style={{ display: 'block', width: '100%', minWidth: 0 }}>
            <CircuitMap key={race.round} round={race.round} mode="loop" showCaption={false} />
          </Link>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', marginBottom: '10px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--muted)' }}>Session times</span>
          <PillToggle value={mode} onChange={setMode} />
        </div>

        <div className="hero-sessions-wrap">
          <div className="hero-sessions-grid">
            {race.sessions.map((s, i) => {
              const isNext = i === nextIndex
              const isLive = isNext && mounted && !!s.dateISO && Date.now() >= new Date(s.dateISO).getTime()
              return (
                <div key={s.name} style={{
                  padding: '14px', borderLeft: i === 0 ? 'none' : '1px solid var(--border)',
                  background: isNext ? 'var(--surface2)' : 'transparent',
                  boxShadow: isNext ? 'inset 0 3px 0 #E8002D' : 'none',
                  opacity: s.completed ? 0.45 : 1,
                  transition: 'background .2s',
                }}>
                  <div style={{ fontSize: '13px', color: 'var(--muted)', fontWeight: 500, display: 'flex', gap: '6px', alignItems: 'center', minHeight: '22px' }}>
                    <SessionIndicator session={s} isNext={isNext} mounted={mounted} />
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.name}</span>
                    {isLive && <span style={{ fontSize: '9px', fontWeight: 700, color: '#E8002D', textTransform: 'uppercase', letterSpacing: '1px', flexShrink: 0 }}>LIVE</span>}
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

        <style dangerouslySetInnerHTML={{ __html: `
          .hero-outer { display: grid; grid-template-columns: 1.35fr 1fr; gap: 24px; align-items: stretch; padding: 34px 0 24px; }
          .hero-top { display: grid; grid-template-columns: 1fr 300px; grid-template-areas: "title map"; gap: 24px; align-items: start; margin-bottom: 22px; }
          .hero-title-area { grid-area: title; }
          .hero-map-area { grid-area: map; }
          .hero-sessions-wrap {
            overflow-x: auto; -webkit-overflow-scrolling: touch;
            border: 1px solid var(--border); border-radius: 14px; background: var(--surface);
            margin-bottom: 20px;
          }
          .hero-sessions-grid { display: grid; grid-template-columns: repeat(5, minmax(120px, 1fr)); }
          .hero-btn-row { display: grid; grid-template-columns: repeat(3,1fr); gap: 10px; width: 100%; margin-top: 20px; }

          @media (max-width: 900px) {
            .hero-outer { grid-template-columns: 1fr; padding: 24px 0 20px; }
            .hero-top { grid-template-columns: 1fr; grid-template-areas: "title" "map"; gap: 16px; }
            .hero-map-area svg { height: 180px !important; max-height: 180px !important; }
            .hero-btn-row { grid-template-columns: 1fr; }
          }
        ` }} />
        <div className="hero-btn-row" style={{ marginTop: 'auto' }}>
          <Link href="/race-hub" style={{ ...btnRedStyle, display: 'flex', width: '100%', justifyContent: 'center', textAlign: 'center', minHeight: '44px' }}>Open Race Hub</Link>
          <Link href="/f1-fantasy" style={{ ...btnOutlineStyle, display: 'flex', width: '100%', justifyContent: 'center', textAlign: 'center', minHeight: '44px' }}>F1 Fantasy strategy</Link>
          <Link href={`/news/${previewSlug}`} style={{ ...btnOutlineStyle, display: 'flex', width: '100%', justifyContent: 'center', textAlign: 'center', minHeight: '44px' }}>Latest news</Link>
        </div>
      </div>

      <LockCard race={race} facts={facts} />
    </section>
  )
}
