'use client'

import { useEffect, useState } from 'react'
import { DRIVER_STANDINGS, CONSTRUCTOR_STANDINGS } from '@/lib/standings'
import { DRIVERS } from '@/lib/drivers'

const RACES = 2

type SortMode = 'points' | 'average'

function posColor(pos: number) {
  return pos === 1 ? '#FFD700' : pos === 2 ? '#C0C0C0' : pos === 3 ? '#CD7F32' : '#5A6A7A'
}

export default function StandingsClient() {
  const [liveStandings, setLiveStandings] = useState<any>(null)
  const [liveStats, setLiveStats] = useState<any[]>([])
  const [sortMode, setSortMode] = useState<SortMode>('points')

  useEffect(() => {
    fetch('/api/f1/standings').then(r => r.json()).then(setLiveStandings).catch(() => {})
    fetch('/api/f1/fantasy-stats?year=2026').then(r => r.json()).then(d => setLiveStats(d.drivers || [])).catch(() => {})
  }, [])

  // Merge static fallback with live data
  const drivers = DRIVER_STANDINGS.map((d, i) => {
    const driverInfo  = DRIVERS.find(dr => dr.id === d.id)
    const liveStat    = liveStats.find(s => s.name === d.name || s.acronym === d.shortName)
    const liveDriver  = liveStandings?.drivers?.find((ld: any) => ld.name === d.name || ld.acronym === d.shortName)
    const points      = liveDriver?.points  ?? d.points
    const wins        = liveDriver?.wins    ?? d.wins
    const podiums     = liveStat?.podiums   ?? null
    const price       = driverInfo?.price   ?? 15
    const avg         = points > 0 ? points / RACES : 0
    const ppm         = price > 0 ? points / price : 0
    return { ...d, points, wins, podiums, price, avg, ppm, staticPos: i + 1 }
  })

  const sorted = [...drivers].sort((a, b) => {
    if (sortMode === 'average') return b.avg  - a.avg
    if (sortMode === 'value')   return b.ppm  - a.ppm
    return b.points - a.points
  })

  const constructors = [...CONSTRUCTOR_STANDINGS]
    .map(c => {
      const liveC = liveStandings?.constructors?.find((lc: any) => lc.team === c.name)
      return { ...c, points: liveC?.points ?? c.points }
    })
    .sort((a, b) => b.points - a.points)

  const maxConPts = constructors[0]?.points || 1

  const thStyle = (leftAlign?: boolean): React.CSSProperties => ({
    fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px',
    color: '#5A6A7A', padding: '10px 12px', borderBottom: '1px solid rgba(255,255,255,0.07)',
    textAlign: leftAlign ? 'left' : 'center', whiteSpace: 'nowrap',
  })

  const tdMono = (color?: string): React.CSSProperties => ({
    padding: '9px 12px', borderBottom: '1px solid rgba(255,255,255,0.03)',
    fontFamily: 'JetBrains Mono, monospace', fontSize: '12px',
    textAlign: 'center', color: color || '#5A6A7A',
  })

  return (
    <div style={{ position: 'relative', zIndex: 1, maxWidth: '1400px', margin: '0 auto', padding: '28px 32px 60px' }}>

      {/* ── PAGE HEADER ── */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <div style={{ width: '3px', height: '24px', background: '#E8002D', borderRadius: '2px' }} />
          <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '2px', color: '#E8002D', textTransform: 'uppercase' }}>2026 Season</span>
        </div>
        <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '56px', letterSpacing: '1px', lineHeight: 1 }}>Standings</div>
        <div style={{ color: '#5A6A7A', fontSize: '13px', marginTop: '6px' }}>Auto-updates from OpenF1 after each race · After R2 China</div>
      </div>

      {/* ── SEASON SUMMARY CARDS ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '24px' }}>
        {[
          { label: 'Races Completed', value: '2',  sub: 'of 24',        color: '#E8002D', bar: 'linear-gradient(90deg,#E8002D,rgba(232,0,45,0.2))' },
          { label: 'Different Winners', value: '2', sub: 'Russell · Antonelli', color: '#FFD700', bar: 'linear-gradient(90deg,#FFD700,rgba(255,215,0,0.2))' },
          { label: 'Safety Cars',      value: '—',  sub: 'data pending', color: '#00A8FF', bar: 'linear-gradient(90deg,#00A8FF,rgba(0,168,255,0.2))' },
          { label: 'DNFs',             value: '—',  sub: 'data pending', color: '#FF6B6B', bar: 'linear-gradient(90deg,#FF6B6B,rgba(255,107,107,0.2))' },
        ].map(card => (
          <div key={card.label} style={{ background: '#0E1318', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '20px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: card.bar }} />
            <div style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '1.5px', color: '#5A6A7A', marginBottom: '10px' }}>{card.label}</div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '36px', fontWeight: 600, color: card.color, lineHeight: 1, marginBottom: '4px' }}>{card.value}</div>
            <div style={{ fontSize: '11px', color: '#3A4A5A' }}>{card.sub}</div>
          </div>
        ))}
      </div>

      {/* ── DRIVER STATS TABLE ── */}
      <div style={{ background: '#0E1318', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', overflow: 'hidden', marginBottom: '24px' }}>

        {/* Table header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px 12px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <div>
            <span style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '1.5px', color: '#5A6A7A' }}>Driver Fantasy Stats — 2026</span>
            <span style={{ marginLeft: '10px', fontSize: '10px', fontWeight: 600, padding: '3px 8px', borderRadius: '4px', background: 'rgba(0,212,126,0.12)', color: '#00D47E' }}>
              {RACES} Races
            </span>
          </div>
          {/* Sort toggles */}
          <div style={{ display: 'flex', background: '#141B22', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.07)', overflow: 'hidden' }}>
            {(['points', 'average'] as SortMode[]).map((mode, i) => (
              <button
                key={mode}
                onClick={() => setSortMode(mode)}
                style={{
                  background: sortMode === mode ? '#E8002D' : 'transparent',
                  color: sortMode === mode ? 'white' : '#5A6A7A',
                  border: 'none',
                  borderLeft: i > 0 ? '1px solid rgba(255,255,255,0.07)' : 'none',
                  padding: '6px 14px', cursor: 'pointer', fontSize: '11px', fontWeight: 600,
                  textTransform: 'capitalize' as const, transition: 'all 0.15s',
                }}
              >
                {mode === 'points' ? 'Points' : 'Average'}
              </button>
            ))}
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={thStyle(false)}>#</th>
                <th style={thStyle(true)}>Driver</th>
                <th style={thStyle(true)}>Team</th>
                <th style={{ ...thStyle(false), color: sortMode === 'points'  ? '#F0F4F8' : '#5A6A7A' }}>PTS</th>
                <th style={{ ...thStyle(false), color: sortMode === 'average' ? '#F0F4F8' : '#5A6A7A' }}>AVG</th>
                <th style={thStyle(false)}>BEST</th>
                <th style={thStyle(false)}>WINS</th>
                <th style={thStyle(false)}>PODS</th>
                <th style={thStyle(false)}>DNF</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((d, i) => {
                const rank = i + 1
                return (
                  <tr key={d.id} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)' }}>

                    {/* # */}
                    <td style={{ ...tdMono(posColor(rank)), fontWeight: rank <= 3 ? 600 : 400 }}>{rank}</td>

                    {/* Driver */}
                    <td style={{ padding: '9px 12px', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '3px', height: '22px', borderRadius: '2px', background: d.teamColor, flexShrink: 0 }} />
                        <span style={{ fontSize: '15px', fontFamily: 'Twemoji Country Flags, DM Sans, sans-serif' }}>{d.flag}</span>
                        <span style={{ fontSize: '13px', fontWeight: 500, whiteSpace: 'nowrap' }}>{d.name}</span>
                      </div>
                    </td>

                    {/* Team */}
                    <td style={{ padding: '9px 12px', borderBottom: '1px solid rgba(255,255,255,0.03)', fontSize: '12px', color: '#5A6A7A', whiteSpace: 'nowrap' }}>{d.team}</td>

                    {/* PTS */}
                    <td style={{ ...tdMono(d.points > 0 ? '#F0F4F8' : '#3A4A5A'), fontWeight: 700, fontSize: '14px' }}>{d.points}</td>

                    {/* AVG */}
                    <td style={tdMono(d.avg > 0 ? '#8A9AB0' : '#3A4A5A')}>
                      {d.avg > 0 ? d.avg.toFixed(1) : '—'}
                    </td>

                    {/* BEST */}
                    <td style={tdMono('#3A4A5A')}>—</td>

                    {/* WINS */}
                    <td style={tdMono(d.wins > 0 ? '#FFD700' : '#3A4A5A')}>
                      {d.wins > 0 ? (
                        <span style={{ fontWeight: 700 }}>{d.wins}</span>
                      ) : '0'}
                    </td>

                    {/* PODS */}
                    <td style={tdMono(d.podiums !== null && d.podiums > 0 ? '#C0C0C0' : '#3A4A5A')}>
                      {d.podiums !== null ? d.podiums : '—'}
                    </td>

                    {/* DNF */}
                    <td style={tdMono('#3A4A5A')}>—</td>

                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── CONSTRUCTOR FANTASY POINTS — HORIZONTAL BAR CHART ── */}
      <div style={{ background: '#0E1318', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px 12px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <span style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '1.5px', color: '#5A6A7A' }}>Constructor Fantasy Points — 2026</span>
          <span style={{ fontSize: '10px', fontWeight: 600, padding: '3px 8px', borderRadius: '4px', background: 'rgba(0,212,126,0.12)', color: '#00D47E' }}>{RACES} Races</span>
        </div>

        <div style={{ padding: '16px 24px 20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {constructors.map((c, i) => {
            const barPct = maxConPts > 0 ? (c.points / maxConPts) * 100 : 0
            return (
              <div key={c.name} style={{ display: 'grid', gridTemplateColumns: '28px 26px 160px 1fr 56px', alignItems: 'center', gap: '12px' }}>

                {/* Rank */}
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', color: posColor(i + 1), fontWeight: i < 3 ? 600 : 400, textAlign: 'right' }}>
                  {i + 1}
                </span>

                {/* Flag */}
                <span style={{ fontSize: '18px', fontFamily: 'Twemoji Country Flags, DM Sans, sans-serif' }}>{c.flag}</span>

                {/* Team name + colour dot */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: c.color, flexShrink: 0 }} />
                  <span style={{ fontSize: '13px', fontWeight: 600, color: c.points > 0 ? '#F0F4F8' : '#5A6A7A', whiteSpace: 'nowrap' }}>{c.name}</span>
                </div>

                {/* Bar */}
                <div style={{ height: '6px', background: '#141B22', borderRadius: '3px', overflow: 'hidden' }}>
                  <div
                    style={{
                      width: `${barPct}%`,
                      minWidth: c.points > 0 ? '4px' : '0',
                      height: '100%',
                      background: c.color,
                      borderRadius: '3px',
                      opacity: 0.85,
                      transition: 'width 0.6s ease',
                    }}
                  />
                </div>

                {/* Points */}
                <span style={{
                  fontFamily: 'JetBrains Mono, monospace', fontSize: '14px', fontWeight: 600,
                  color: c.points > 0 ? '#FFB800' : '#3A4A5A', textAlign: 'right',
                }}>
                  {c.points > 0 ? c.points : '—'}
                </span>
              </div>
            )
          })}
        </div>
      </div>

    </div>
  )
}
