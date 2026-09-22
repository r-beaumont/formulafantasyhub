'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Flag, monoFont, btnOutlineStyle } from '@/components/home/shared'

export interface CalendarWinner {
  name: string
  team: string
  teamColor: string
  flag: string
}

export interface CalendarSession {
  name: string
  short: string
  isoDate: string
}

export interface CalendarRowData {
  round: number
  name: string
  flag: string
  circuit: string
  dateRange: string
  sprint: boolean
  completed: boolean
  calledOff: boolean
  timezone: string
  sessions: CalendarSession[]
  winner: CalendarWinner | null
}

// Row background wash — 12%→45% resting, 24%→70% on hover, per the
// wireframe's `.citem.won` rule (distinct from the 10%/26% used on Home's
// championship rows). Injected once by CalendarClient, not per-row.
export const calendarRowStyleTag = `
  .cal-row-won { background: linear-gradient(90deg, color-mix(in srgb, var(--tc) 12%, transparent), transparent 45%); transition: background .25s; }
  .cal-row-won:hover { background: linear-gradient(90deg, color-mix(in srgb, var(--tc) 24%, transparent), transparent 70%); }
  .cal-row-won:hover .cal-tl { box-shadow: 0 0 10px var(--tc); }
  .cal-row-won:hover .cal-flag { transform: scale(1.14); }
  .cal-row-cur { background: linear-gradient(90deg, rgba(232,0,45,.10), transparent 50%); }
`

function fmtDay(iso: string, tz?: string) {
  return new Date(iso).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', timeZone: tz })
}
function fmtTime(iso: string, tz?: string) {
  return new Date(iso).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: tz })
}

export default function CalendarRow({ row, isCurrent, isOpen, onToggle, isFirst }: {
  row: CalendarRowData
  isCurrent: boolean
  isOpen: boolean
  onToggle: () => void
  isFirst: boolean
}) {
  // "Your local time" depends on the viewer's timezone, unknown at SSR time —
  // render a placeholder server-side and swap in the real value after mount,
  // same hydration-safe pattern used for the Home page's lock countdown.
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 760px)')
    const update = () => setIsMobile(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  const { winner, calledOff, completed } = row

  let statusNode: React.ReactNode
  if (calledOff) {
    statusNode = <span style={statusPillStyle('#E8002D', 'rgba(232,0,45,.12)')}>Cancelled</span>
  } else if (winner) {
    statusNode = (
      <span style={statusPillStyle('var(--text)', `color-mix(in srgb, ${winner.teamColor} 16%, transparent)`)}>
        <i className="cal-tl" style={{ width: '3px', height: '14px', borderRadius: '2px', background: winner.teamColor, flexShrink: 0 }} />
        <Flag code={winner.flag} /> {winner.name.split(' ').slice(-1)[0]} <span style={{ color: '#00D47E' }}>WIN</span>
      </span>
    )
  } else if (isCurrent) {
    statusNode = (
      <span style={statusPillStyle('#E8002D', 'rgba(232,0,45,.12)')}>
        <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#E8002D', animation: 'pulse 2s infinite', flexShrink: 0 }} />
        Next
      </span>
    )
  } else {
    statusNode = <span style={statusPillStyle('var(--muted)', 'var(--surface2)')}>Upcoming</span>
  }

  const rowClass = winner ? 'cal-row-won' : isCurrent ? 'cal-row-cur' : ''

  return (
    <div
      className={rowClass}
      style={winner ? ({ '--tc': winner.teamColor } as React.CSSProperties) : undefined}
    >
      <div
        onClick={row.calledOff ? undefined : onToggle}
        style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '34px 28px 1fr auto' : '54px 34px 1fr auto auto 20px',
          gap: isMobile ? '10px' : '14px',
          alignItems: 'center',
          padding: isMobile ? '12px' : '14px 18px',
          cursor: row.calledOff ? 'default' : 'pointer',
          borderTop: isFirst ? 'none' : '1px solid var(--border)',
        }}
      >
          <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: isMobile ? '22px' : '30px', lineHeight: 1, color: isCurrent && !winner ? '#E8002D' : completed ? 'var(--muted)' : 'var(--muted2)' }}>
            R{row.round}
          </span>
          <span className="cal-flag" style={{ transition: 'transform .2s' }}>
            <Flag code={row.flag} size={isMobile ? '1.5em' : '1.7em'} />
          </span>
          <div style={{ minWidth: 0 }}>
            <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontWeight: 400, fontSize: isMobile ? '17px' : '22px', lineHeight: 1, display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' as const, color: 'var(--text)' }}>
              {row.name}
              {row.sprint && (
                <span style={{ fontSize: '10px', fontWeight: 700, padding: '2px 7px', borderRadius: '4px', color: 'var(--blue)', background: 'rgba(0,168,255,.12)' }}>Sprint</span>
              )}
            </h3>
            <p style={{ fontSize: '12px', color: '#8A9AB0', marginTop: '3px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>{row.circuit}</p>
          </div>
          {!isMobile && (
            <span style={{ fontFamily: monoFont, fontSize: '12px', fontWeight: 500, color: '#8A9AB0', textAlign: 'right' as const, whiteSpace: 'nowrap' as const }}>
              {row.dateRange}
            </span>
          )}
          {statusNode}
          {!isMobile && !row.calledOff && (
            <span style={{ color: 'var(--muted)', display: 'inline-block', transition: 'transform .2s', transform: isOpen ? 'rotate(180deg)' : 'none' }}>▼</span>
          )}
        </div>

        {isOpen && (
          <div style={{ padding: isMobile ? '4px 12px 16px' : `4px 18px 20px ${isMobile ? '18px' : '90px'}` }}>
            {completed && winner ? (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3,1fr)', gap: '10px', marginBottom: '12px' }}>
                  {[
                    { label: 'Circuit', value: row.circuit },
                    { label: 'Date', value: row.dateRange },
                    { label: 'Round', value: `${row.round} of 23` },
                  ].map(item => (
                    <div key={item.label} style={{ background: 'var(--surface2)', borderRadius: '10px', padding: '12px 14px', textAlign: 'left' as const }}>
                      <span style={{ display: 'block', fontSize: '10px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase' as const, color: 'var(--muted)', marginBottom: '4px' }}>{item.label}</span>
                      <b style={{ fontSize: '14px', color: 'var(--text)' }}>{item.value}</b>
                    </div>
                  ))}
                </div>
                <div style={{
                  background: `linear-gradient(90deg, color-mix(in srgb, ${winner.teamColor} 20%, var(--surface2)), var(--surface2))`,
                  borderRadius: '10px', padding: '12px 16px', marginBottom: '12px',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', flexWrap: 'wrap' as const,
                }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
                    <span style={{ fontSize: '18px' }}>🏆</span>
                    <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase' as const, color: 'var(--muted)' }}>Winner</span>
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
                    <Flag code={winner.flag} />
                    <b style={{ color: 'var(--text)' }}>{winner.name}</b>
                    <span style={{ color: '#8A9AB0', fontSize: '13px' }}>{winner.team}</span>
                  </span>
                </div>
                <Link href={`/race-hub?round=${row.round}&tab=race-info`} style={btnOutlineStyle}>View Race Info →</Link>
              </>
            ) : (
              <>
                {row.sessions.length > 0 ? (
                  <div style={{ border: '1px solid var(--border)', borderRadius: '10px', overflow: 'hidden', marginBottom: '12px', overflowX: 'auto' as const }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' as const }}>
                      <thead>
                        <tr>
                          {['Session', 'Day', 'Track time', 'Your time'].map((h, i) => (
                            <th key={h} style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '1.2px', color: 'var(--muted)', textAlign: i >= 2 ? 'center' as const : 'left' as const, padding: '10px 14px', whiteSpace: 'nowrap' as const, background: 'var(--surface2)' }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {row.sessions.map(s => (
                          <tr key={s.name}>
                            <td style={{ padding: '9px 14px', borderTop: '1px solid var(--border)', fontSize: '13px', whiteSpace: 'nowrap' as const }}>
                              <span style={{ fontFamily: monoFont, color: 'var(--muted)', fontSize: '10px', fontWeight: 700, marginRight: '10px' }}>{s.short}</span>
                              {s.name}
                            </td>
                            <td style={{ padding: '9px 14px', borderTop: '1px solid var(--border)', fontSize: '13px', color: '#8A9AB0', whiteSpace: 'nowrap' as const }}>{fmtDay(s.isoDate, row.timezone)}</td>
                            <td style={{ padding: '9px 14px', borderTop: '1px solid var(--border)', fontSize: '13px', textAlign: 'center' as const, fontFamily: monoFont, whiteSpace: 'nowrap' as const }}>{fmtTime(s.isoDate, row.timezone)}</td>
                            <td style={{ padding: '9px 14px', borderTop: '1px solid var(--border)', fontSize: '13px', textAlign: 'center' as const, fontFamily: monoFont, color: '#8A9AB0', whiteSpace: 'nowrap' as const }}>{mounted ? fmtTime(s.isoDate) : '—'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p style={{ fontSize: '13px', color: '#8A9AB0', marginBottom: '12px' }}>Session times to be confirmed.</p>
                )}
                <Link href={`/race-hub?round=${row.round}&tab=race-info`} style={btnOutlineStyle}>View Schedule →</Link>
              </>
            )}
          </div>
        )}
    </div>
  )
}

function statusPillStyle(color: string, background: string): React.CSSProperties {
  return {
    fontSize: '11px', fontWeight: 700, padding: '4px 10px', borderRadius: '6px',
    whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '6px',
    color, background,
  }
}
