'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { DRIVER_STANDINGS, CONSTRUCTOR_STANDINGS } from '@/lib/standings'
import { DRIVERS } from '@/lib/drivers'
import { RACE_WEEKENDS } from '@/lib/raceResults'
import { SEASON_CALENDAR } from '@/lib/races'

const RACES = 2

type SortMode = 'points' | 'wins' | 'podiums' | 'dnf'
type ConSortMode = 'points' | 'wins' | 'podiums' | 'dnf'

function posColor(pos: number) {
  return pos === 1 ? '#FFD700' : pos === 2 ? '#C0C0C0' : pos === 3 ? '#CD7F32' : '#5A6A7A'
}

// ── Static race data computations ─────────────────────────────────────────────

const F1_PTS: Record<number, number> = { 1:25,2:18,3:15,4:12,5:10,6:8,7:6,8:4,9:2,10:1 }
function racePoints(pos: number): number { return F1_PTS[pos] || 0 }

const RACE_CODE: Record<string, string> = {
  'Australia': 'AUS', 'China': 'CHN', 'Japan': 'JPN', 'Miami': 'MIA',
  'Canada': 'CAN', 'Monaco': 'MON', 'Barcelona-Catalunya': 'ESP', 'Austria': 'AUT',
  'Britain': 'GBR', 'Belgium': 'BEL', 'Hungary': 'HUN', 'Netherlands': 'NED',
  'Italy': 'ITA', 'Madrid': 'MAD', 'Azerbaijan': 'AZE', 'Singapore': 'SGP',
  'United States': 'USA', 'Mexico': 'MEX', 'Brazil': 'BRA', 'Las Vegas': 'LAS',
  'Qatar': 'QAT', 'Abu Dhabi': 'ABU',
}

const completedCalRounds = SEASON_CALENDAR.filter(r => r.completed && !r.calledOff)

// Wins / Poles / Podiums from static race data
const _winsMap: Record<string, { count: number; teamColor: string }> = {}
const _polesMap: Record<string, { count: number; teamColor: string }> = {}
const _podiumsMap: Record<string, { count: number; teamColor: string }> = {}

for (const calR of completedCalRounds) {
  const w = RACE_WEEKENDS[calR.round]
  if (!w) continue
  const p1r = w.race?.[0]
  if (p1r) {
    _winsMap[p1r.name] = { count: (_winsMap[p1r.name]?.count ?? 0) + 1, teamColor: p1r.team_colour }
  }
  const p1q = w.qualifying?.[0]
  if (p1q) {
    _polesMap[p1q.name] = { count: (_polesMap[p1q.name]?.count ?? 0) + 1, teamColor: p1q.team_colour }
  }
  for (const r of (w.race || []).slice(0, 3)) {
    _podiumsMap[r.name] = { count: (_podiumsMap[r.name]?.count ?? 0) + 1, teamColor: r.team_colour }
  }
}
const maxWins    = Math.max(...Object.values(_winsMap).map(v => v.count),    0)
const maxPoles   = Math.max(...Object.values(_polesMap).map(v => v.count),   0)
const maxPodiums = Math.max(...Object.values(_podiumsMap).map(v => v.count), 0)
const mostWins    = Object.entries(_winsMap).filter(([,v]) => v.count === maxWins).map(([n,v]) => ({ name: n, ...v }))
const mostPoles   = Object.entries(_polesMap).filter(([,v]) => v.count === maxPoles).map(([n,v]) => ({ name: n, ...v }))
const mostPodiums = Object.entries(_podiumsMap).filter(([,v]) => v.count === maxPodiums).map(([n,v]) => ({ name: n, ...v }))

// Per-driver per-round points (race only, not sprint)
const _driverRoundPts: Record<string, Record<number, number>> = {}
const _driverMeta: Record<string, { team: string; teamColor: string }> = {}
for (const calR of completedCalRounds) {
  const w = RACE_WEEKENDS[calR.round]
  if (!w?.race) continue
  for (const r of w.race) {
    if (!_driverRoundPts[r.name]) _driverRoundPts[r.name] = {}
    _driverRoundPts[r.name][calR.round] = racePoints(r.position)
    _driverMeta[r.name] = { team: r.team, teamColor: r.team_colour }
  }
}
const driverPprData = Object.entries(_driverRoundPts)
  .map(([name, rpts]) => ({
    name,
    ..._driverMeta[name],
    rpts,
    total: Object.values(rpts).reduce((s, p) => s + p, 0),
  }))
  .sort((a, b) => b.total - a.total)

// Per-constructor per-round points
const _conRoundPts: Record<string, Record<number, number>> = {}
const _conColor: Record<string, string> = {}
for (const { name, team, teamColor, rpts } of driverPprData) {
  if (!team) continue
  if (!_conRoundPts[team]) _conRoundPts[team] = {}
  _conColor[team] = teamColor
  for (const [rStr, pts] of Object.entries(rpts)) {
    const r = Number(rStr)
    _conRoundPts[team][r] = (_conRoundPts[team][r] || 0) + pts
  }
}
const conPprData = Object.entries(_conRoundPts)
  .map(([team, rpts]) => ({
    team, color: _conColor[team] || '#5A6A7A', rpts,
    total: Object.values(rpts).reduce((s, p) => s + p, 0),
  }))
  .sort((a, b) => b.total - a.total)

// Per-round gold/orange thresholds for driver
const _driverRoundThresholds: Record<number, [number, number]> = {}
for (const calR of completedCalRounds) {
  const vals = driverPprData.map(d => d.rpts[calR.round] ?? 0).filter(p => p > 0).sort((a,b) => b-a)
  _driverRoundThresholds[calR.round] = [vals[0] ?? 0, vals[1] ?? 0]
}
const _conRoundThresholds: Record<number, [number, number]> = {}
for (const calR of completedCalRounds) {
  const vals = conPprData.map(c => c.rpts[calR.round] ?? 0).filter(p => p > 0).sort((a,b) => b-a)
  _conRoundThresholds[calR.round] = [vals[0] ?? 0, vals[1] ?? 0]
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function StandingsClient() {
  const router = useRouter()
  const [liveStandings, setLiveStandings] = useState<any>(null)
  const [liveStats, setLiveStats] = useState<any[]>([])
  const [sortMode, setSortMode] = useState<SortMode>('points')
  const [conSortMode, setConSortMode] = useState<ConSortMode>('points')
  const [conSortDir, setConSortDir] = useState<'desc' | 'asc'>('desc')
  const [pprTab, setPprTab] = useState<'drivers' | 'constructors'>('drivers')

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
    if (sortMode === 'wins')    return b.wins - a.wins
    if (sortMode === 'podiums') return (b.podiums ?? 0) - (a.podiums ?? 0)
    if (sortMode === 'dnf')    return 0
    return b.points - a.points
  })

  // Compute constructor wins/podiums from driver data
  const constructorStats = drivers.reduce((acc, d) => {
    const key = d.team
    if (!acc[key]) acc[key] = { wins: 0, podiums: 0 }
    acc[key].wins += d.wins
    acc[key].podiums += d.podiums ?? 0
    return acc
  }, {} as Record<string, { wins: number, podiums: number }>)

  function toggleConSort(mode: ConSortMode) {
    if (conSortMode === mode) {
      setConSortDir(d => d === 'desc' ? 'asc' : 'desc')
    } else {
      setConSortMode(mode)
      setConSortDir('desc')
    }
  }

  const constructors = [...CONSTRUCTOR_STANDINGS]
    .map(c => {
      const liveC = liveStandings?.constructors?.find((lc: any) => lc.team === c.name)
      return { ...c, points: liveC?.points ?? c.points }
    })
    .sort((a, b) => {
      const dir = conSortDir === 'desc' ? 1 : -1
      if (conSortMode === 'wins')    return dir * ((constructorStats[b.name]?.wins ?? 0) - (constructorStats[a.name]?.wins ?? 0))
      if (conSortMode === 'podiums') return dir * ((constructorStats[b.name]?.podiums ?? 0) - (constructorStats[a.name]?.podiums ?? 0))
      if (conSortMode === 'dnf')     return 0
      return dir * (b.points - a.points)
    })

  const maxConPts = [...constructors].sort((a, b) => b.points - a.points)[0]?.points || 1

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

  // Season overview leaders
  const driversLeader = sorted[0]
  const constructorsLeader = constructors[0]

  return (
    <div className="mob-pad-page" style={{ position: 'relative', zIndex: 1, maxWidth: '1400px', margin: '0 auto', padding: '28px 32px 60px' }}>

      {/* ── PAGE HEADER ── */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <div style={{ width: '3px', height: '24px', background: '#E8002D', borderRadius: '2px' }} />
          <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '2px', color: '#E8002D', textTransform: 'uppercase' }}>2026 Season</span>
        </div>
        <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '56px', letterSpacing: '1px', lineHeight: 1, fontWeight: 400, margin: 0 }}>F1 Championship Standings 2026</h1>
        <div style={{ color: '#5A6A7A', fontSize: '13px', marginTop: '6px' }}>Live data — updates after each race · After R2 China</div>
      </div>

      {/* ── SEASON OVERVIEW ── */}
      <div style={{ background: '#0E1318', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', overflow: 'hidden', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px 12px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <span style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '1.5px', color: '#5A6A7A' }}>Season Overview</span>
          <span style={{ fontSize: '10px', fontWeight: 600, padding: '3px 8px', borderRadius: '4px', background: 'rgba(0,212,126,0.12)', color: '#00D47E' }}>{RACES} Races</span>
        </div>
        <div style={{ padding: '8px 0' }}>
          {/* Drivers Leader */}
          {driversLeader && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '11px 20px', background: 'rgba(255,215,0,0.05)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '16px' }}>🏆</span>
                <span style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '1px', color: '#5A6A7A' }}>Drivers Leader</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '3px', height: '18px', borderRadius: '2px', background: driversLeader.teamColor }} />
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#FFD700' }}>{driversLeader.name}</span>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', fontWeight: 700, color: '#FFD700', background: 'rgba(255,215,0,0.12)', padding: '2px 8px', borderRadius: '4px' }}>{driversLeader.points} pts</span>
              </div>
            </div>
          )}
          {/* Constructors Leader */}
          {constructorsLeader && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '11px 20px', background: 'rgba(0,168,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '16px' }}>🏗️</span>
                <span style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '1px', color: '#5A6A7A' }}>Constructors Leader</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: constructorsLeader.color }} />
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#00A8FF' }}>{constructorsLeader.name}</span>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', fontWeight: 700, color: '#00A8FF', background: 'rgba(0,168,255,0.12)', padding: '2px 8px', borderRadius: '4px' }}>{constructorsLeader.points} pts</span>
              </div>
            </div>
          )}
          {/* Most Wins */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '11px 20px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '16px' }}>🥇</span>
              <span style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '1px', color: '#5A6A7A' }}>Most Wins</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' as const, justifyContent: 'flex-end' }}>
              {mostWins.map(d => (
                <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '3px', height: '16px', borderRadius: '2px', background: d.teamColor }} />
                  <span style={{ fontSize: '13px', fontWeight: 500, color: '#F0F4F8' }}>{d.name}</span>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: '#FFB800', background: 'rgba(255,184,0,0.1)', padding: '2px 6px', borderRadius: '3px' }}>{d.count}W</span>
                </div>
              ))}
              {mostWins.length === 0 && <span style={{ fontSize: '12px', color: '#3A4A5A' }}>—</span>}
            </div>
          </div>
          {/* Most Poles */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '11px 20px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '16px' }}>⚡</span>
              <span style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '1px', color: '#5A6A7A' }}>Most Poles</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' as const, justifyContent: 'flex-end' }}>
              {mostPoles.map(d => (
                <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '3px', height: '16px', borderRadius: '2px', background: d.teamColor }} />
                  <span style={{ fontSize: '13px', fontWeight: 500, color: '#F0F4F8' }}>{d.name}</span>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: '#C0C0C0', background: 'rgba(192,192,192,0.1)', padding: '2px 6px', borderRadius: '3px' }}>{d.count}P</span>
                </div>
              ))}
              {mostPoles.length === 0 && <span style={{ fontSize: '12px', color: '#3A4A5A' }}>—</span>}
            </div>
          </div>
          {/* Most Podiums */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '11px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '16px' }}>🏅</span>
              <span style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '1px', color: '#5A6A7A' }}>Most Podiums</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' as const, justifyContent: 'flex-end' }}>
              {mostPodiums.map(d => (
                <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '3px', height: '16px', borderRadius: '2px', background: d.teamColor }} />
                  <span style={{ fontSize: '13px', fontWeight: 500, color: '#F0F4F8' }}>{d.name}</span>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: '#CD7F32', background: 'rgba(205,127,50,0.1)', padding: '2px 6px', borderRadius: '3px' }}>{d.count}</span>
                </div>
              ))}
              {mostPodiums.length === 0 && <span style={{ fontSize: '12px', color: '#3A4A5A' }}>—</span>}
            </div>
          </div>
        </div>
      </div>

      {/* ── SEASON SUMMARY CARDS ── */}
      <div className="mob-2col" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '24px' }}>
        {[
          { label: 'Races Completed', value: '2',  sub: 'of 22',        color: '#E8002D', bar: 'linear-gradient(90deg,#E8002D,rgba(232,0,45,0.2))' },
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '16px 20px 12px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <span style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '1.5px', color: '#5A6A7A' }}>Driver Championship Standings — 2026</span>
          <span style={{ fontSize: '10px', fontWeight: 600, padding: '3px 8px', borderRadius: '4px', background: 'rgba(0,212,126,0.12)', color: '#00D47E' }}>
            {RACES} Races
          </span>
          <span style={{ fontSize: '10px', color: '#3A4A5A', marginLeft: '4px' }}>Click a column to sort ↓</span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={thStyle(false)}>#</th>
                <th style={thStyle(true)}>Driver</th>
                <th style={thStyle(true)}>Team</th>
                <th onClick={() => setSortMode('points')}  style={{ ...thStyle(false), cursor: 'pointer', color: sortMode === 'points'  ? '#F0F4F8' : '#5A6A7A', userSelect: 'none' }}>PTS {sortMode === 'points'  ? '↓' : ''}</th>
                <th onClick={() => setSortMode('wins')}    style={{ ...thStyle(false), cursor: 'pointer', color: sortMode === 'wins'    ? '#F0F4F8' : '#5A6A7A', userSelect: 'none' }}>WINS {sortMode === 'wins'    ? '↓' : ''}</th>
                <th onClick={() => setSortMode('podiums')} style={{ ...thStyle(false), cursor: 'pointer', color: sortMode === 'podiums' ? '#F0F4F8' : '#5A6A7A', userSelect: 'none' }}>PODS {sortMode === 'podiums' ? '↓' : ''}</th>
                <th onClick={() => setSortMode('dnf')}     style={{ ...thStyle(false), cursor: 'pointer', color: sortMode === 'dnf'     ? '#F0F4F8' : '#5A6A7A', userSelect: 'none' }}>DNF/DSQ {sortMode === 'dnf'     ? '↓' : ''}</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((d, i) => {
                const rank = i + 1
                return (
                  <tr key={d.id} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)' }}>
                    <td style={{ ...tdMono(posColor(rank)), fontWeight: rank <= 3 ? 600 : 400 }}>{rank}</td>
                    <td style={{ padding: '9px 12px', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '3px', height: '22px', borderRadius: '2px', background: d.teamColor, flexShrink: 0 }} />
                        <span style={{ fontSize: '15px', fontFamily: 'Twemoji Country Flags, DM Sans, sans-serif' }}>{d.flag}</span>
                        <span style={{ fontSize: '13px', fontWeight: 500, whiteSpace: 'nowrap' }}>{d.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: '9px 12px', borderBottom: '1px solid rgba(255,255,255,0.03)', fontSize: '12px', color: '#5A6A7A', whiteSpace: 'nowrap' }}>{d.team}</td>
                    <td style={{ ...tdMono(d.points > 0 ? '#F0F4F8' : '#3A4A5A'), fontWeight: 700, fontSize: '14px' }}>{d.points}</td>
                    <td style={tdMono(d.wins > 0 ? '#FFD700' : '#3A4A5A')}>
                      {d.wins > 0 ? <span style={{ fontWeight: 700 }}>{d.wins}</span> : '0'}
                    </td>
                    <td style={tdMono(d.podiums !== null && d.podiums > 0 ? '#C0C0C0' : '#3A4A5A')}>
                      {d.podiums !== null ? d.podiums : '—'}
                    </td>
                    <td style={tdMono('#3A4A5A')}>—</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── CONSTRUCTOR FANTASY POINTS — HORIZONTAL BAR CHART ── */}
      <div style={{ background: '#0E1318', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', overflow: 'hidden', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '16px 20px 12px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <span style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '1.5px', color: '#5A6A7A' }}>Constructor Championship Standings — 2026</span>
          <span style={{ fontSize: '10px', fontWeight: 600, padding: '3px 8px', borderRadius: '4px', background: 'rgba(0,212,126,0.12)', color: '#00D47E' }}>{RACES} Races</span>
          <span style={{ fontSize: '10px', color: '#3A4A5A', marginLeft: '4px' }}>Click a column to sort ↓</span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '28px 26px 160px 1fr 56px 52px 52px 64px', alignItems: 'center', gap: '12px', padding: '8px 24px 6px', borderBottom: '1px solid rgba(255,255,255,0.07)', minWidth: '560px' }}>
            <span style={{ fontSize: '10px', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '1px', color: '#5A6A7A', textAlign: 'right' as const }}>#</span>
            <span />
            <span style={{ fontSize: '10px', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '1px', color: '#5A6A7A' }}>Constructor</span>
            <span style={{ fontSize: '10px', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '1px', color: '#5A6A7A' }}>Points</span>
            <span onClick={() => toggleConSort('points')}  style={{ fontSize: '10px', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '1px', color: conSortMode === 'points'  ? '#F0F4F8' : '#5A6A7A', textAlign: 'right' as const, cursor: 'pointer', userSelect: 'none' as const }}>PTS {conSortMode === 'points'  ? (conSortDir === 'desc' ? '↓' : '↑') : ''}</span>
            <span onClick={() => toggleConSort('wins')}    style={{ fontSize: '10px', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '1px', color: conSortMode === 'wins'    ? '#F0F4F8' : '#5A6A7A', textAlign: 'center' as const, cursor: 'pointer', userSelect: 'none' as const }}>WINS {conSortMode === 'wins'    ? (conSortDir === 'desc' ? '↓' : '↑') : ''}</span>
            <span onClick={() => toggleConSort('podiums')} style={{ fontSize: '10px', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '1px', color: conSortMode === 'podiums' ? '#F0F4F8' : '#5A6A7A', textAlign: 'center' as const, cursor: 'pointer', userSelect: 'none' as const }}>PODS {conSortMode === 'podiums' ? (conSortDir === 'desc' ? '↓' : '↑') : ''}</span>
            <span onClick={() => toggleConSort('dnf')}     style={{ fontSize: '10px', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '1px', color: conSortMode === 'dnf'     ? '#F0F4F8' : '#5A6A7A', textAlign: 'center' as const, cursor: 'pointer', userSelect: 'none' as const }}>DNF/DSQ {conSortMode === 'dnf'     ? (conSortDir === 'desc' ? '↓' : '↑') : ''}</span>
          </div>
          <div style={{ padding: '8px 24px 20px', display: 'flex', flexDirection: 'column', gap: '12px', minWidth: '560px' }}>
            {constructors.map((c, i) => {
              const barPct = maxConPts > 0 ? (c.points / maxConPts) * 100 : 0
              const cStats = constructorStats[c.name] || { wins: 0, podiums: 0 }
              return (
                <div key={c.name} style={{ display: 'grid', gridTemplateColumns: '28px 26px 160px 1fr 56px 52px 52px 64px', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', color: posColor(i + 1), fontWeight: i < 3 ? 600 : 400, textAlign: 'right' as const }}>{i + 1}</span>
                  <span style={{ fontSize: '18px', fontFamily: 'Twemoji Country Flags, DM Sans, sans-serif' }}>{c.flag}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: c.color, flexShrink: 0 }} />
                    <span style={{ fontSize: '13px', fontWeight: 600, color: c.points > 0 ? '#F0F4F8' : '#5A6A7A', whiteSpace: 'nowrap' }}>{c.name}</span>
                  </div>
                  <div style={{ height: '6px', background: '#141B22', borderRadius: '3px', overflow: 'hidden', minWidth: '40px' }}>
                    <div style={{ width: `${barPct}%`, minWidth: c.points > 0 ? '4px' : '0', height: '100%', background: c.color, borderRadius: '3px', opacity: 0.85, transition: 'width 0.6s ease', flexShrink: 0 }} />
                  </div>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '14px', fontWeight: 600, color: c.points > 0 ? '#FFB800' : '#3A4A5A', textAlign: 'right' as const }}>{c.points > 0 ? c.points : '—'}</span>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', color: cStats.wins > 0 ? '#FFD700' : '#3A4A5A', textAlign: 'center' as const, fontWeight: cStats.wins > 0 ? 700 : 400 }}>{cStats.wins}</span>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', color: cStats.podiums > 0 ? '#C0C0C0' : '#3A4A5A', textAlign: 'center' as const }}>{cStats.podiums > 0 ? cStats.podiums : '—'}</span>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', color: '#3A4A5A', textAlign: 'center' as const }}>—</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── RACE CALENDAR FLAG GRID ── */}
      <div style={{ background: '#0E1318', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', overflow: 'hidden', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px 12px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <span style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '1.5px', color: '#5A6A7A' }}>2026 Race Calendar</span>
          <span style={{ fontSize: '10px', fontWeight: 600, padding: '3px 8px', borderRadius: '4px', background: 'rgba(0,168,255,0.12)', color: '#00A8FF' }}>22 Rounds</span>
        </div>
        <div style={{ padding: '16px 20px' }}>
          <div className="mob-3col" style={{ display: 'grid', gridTemplateColumns: 'repeat(11, 1fr)', gap: '8px' }}>
            {SEASON_CALENDAR.map(race => {
              const isCalledOff = race.calledOff
              const isCompleted = race.completed && !isCalledOff
              const code = RACE_CODE[race.name] || race.name.slice(0, 3).toUpperCase()
              const labelColor = race.sprint ? '#00A8FF' : '#00D47E'
              const labelBg = race.sprint ? 'rgba(0,168,255,0.15)' : 'rgba(0,212,126,0.12)'
              return (
                <div
                  key={race.round}
                  onClick={() => { if (!isCalledOff) router.push(`/race-hub?round=${race.round}&tab=results`) }}
                  title={`R${race.round} ${race.name} — ${race.dateRange}`}
                  style={{
                    position: 'relative' as const,
                    background: isCalledOff ? 'rgba(255,255,255,0.02)' : isCompleted ? '#141B22' : '#1A2230',
                    border: isCompleted ? '1px solid rgba(0,212,126,0.15)' : isCalledOff ? '1px solid rgba(255,255,255,0.04)' : '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '8px',
                    padding: '8px 6px 6px',
                    cursor: isCalledOff ? 'default' : 'pointer',
                    opacity: isCalledOff ? 0.4 : 1,
                    textAlign: 'center' as const,
                    transition: 'border-color 0.15s',
                  }}
                >
                  {/* Round badge */}
                  <div style={{ position: 'absolute', top: '4px', left: '4px', background: '#E8002D', borderRadius: '50%', width: '14px', height: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '7px', fontWeight: 700, color: 'white', lineHeight: 1 }}>{race.round}</span>
                  </div>
                  {/* Cancelled badge */}
                  {isCalledOff && (
                    <div style={{ position: 'absolute', top: '4px', right: '4px', background: 'rgba(232,0,45,0.15)', borderRadius: '3px', padding: '1px 4px' }}>
                      <span style={{ fontSize: '7px', fontWeight: 700, color: '#E8002D', textTransform: 'uppercase' as const }}>CXL</span>
                    </div>
                  )}
                  {isCompleted && !isCalledOff && (
                    <div style={{ position: 'absolute', top: '4px', right: '4px' }}>
                      <span style={{ fontSize: '9px', color: '#00D47E' }}>✓</span>
                    </div>
                  )}
                  {/* Flag */}
                  <div style={{ fontSize: '22px', marginTop: '4px', marginBottom: '4px', fontFamily: 'Twemoji Country Flags, DM Sans, sans-serif' }}>{race.flag}</div>
                  {/* Country code label */}
                  <div style={{ background: labelBg, borderRadius: '3px', padding: '1px 4px', display: 'inline-block', marginBottom: '4px' }}>
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '8px', fontWeight: 700, color: labelColor, letterSpacing: '0.5px' }}>{code}</span>
                  </div>
                  {/* Date */}
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '8px', color: '#3A4A5A' }}>{race.date}</div>
                </div>
              )
            })}
          </div>
          <div style={{ marginTop: '12px', display: 'flex', gap: '16px', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '10px', height: '10px', background: 'rgba(0,212,126,0.15)', borderRadius: '2px', border: '1px solid rgba(0,212,126,0.3)' }} />
              <span style={{ fontSize: '10px', color: '#5A6A7A' }}>Standard GP</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '10px', height: '10px', background: 'rgba(0,168,255,0.15)', borderRadius: '2px', border: '1px solid rgba(0,168,255,0.3)' }} />
              <span style={{ fontSize: '10px', color: '#5A6A7A' }}>Sprint Weekend</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '10px', color: '#00D47E' }}>✓</span>
              <span style={{ fontSize: '10px', color: '#5A6A7A' }}>Completed</span>
            </div>
            <span style={{ fontSize: '10px', color: '#3A4A5A' }}>· Click to view results in Race Hub</span>
          </div>
        </div>
      </div>

      {/* ── POINTS PER RACE ── */}
      <div style={{ background: '#0E1318', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px 12px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <span style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '1.5px', color: '#5A6A7A' }}>Points Per Race</span>
          <div style={{ display: 'flex', gap: '6px' }}>
            {(['drivers', 'constructors'] as const).map(t => (
              <button key={t} onClick={() => setPprTab(t)} style={{ background: pprTab === t ? '#E8002D' : '#141B22', color: pprTab === t ? 'white' : '#5A6A7A', border: '1px solid', borderColor: pprTab === t ? '#E8002D' : 'rgba(255,255,255,0.07)', padding: '4px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '11px', fontWeight: 600, textTransform: 'capitalize' as const }}>
                {t}
              </button>
            ))}
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          {pprTab === 'drivers' ? (
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '420px' }}>
              <thead>
                <tr>
                  <th style={{ ...thStyle(false), width: '36px' }}>#</th>
                  <th style={{ ...thStyle(true), minWidth: '160px' }}>Driver</th>
                  {completedCalRounds.map(calR => (
                    <th key={calR.round} style={{ ...thStyle(false), minWidth: '52px' }}>
                      <span style={{ fontFamily: 'Twemoji Country Flags, DM Sans, sans-serif', marginRight: '3px' }}>{calR.flag}</span>
                      {RACE_CODE[calR.name] || calR.name.slice(0,3).toUpperCase()}
                    </th>
                  ))}
                  <th style={{ ...thStyle(false), minWidth: '52px', color: '#FFB800' }}>TOTAL</th>
                </tr>
              </thead>
              <tbody>
                {driverPprData.map((d, i) => (
                  <tr key={d.name} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)' }}>
                    <td style={{ ...tdMono(posColor(i + 1)), fontWeight: i < 3 ? 600 : 400 }}>{i + 1}</td>
                    <td style={{ padding: '8px 12px', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                        <div style={{ width: '3px', height: '20px', borderRadius: '2px', background: d.teamColor, flexShrink: 0 }} />
                        <span style={{ fontSize: '12px', fontWeight: 500, whiteSpace: 'nowrap' }}>{d.name}</span>
                      </div>
                    </td>
                    {completedCalRounds.map(calR => {
                      const pts = d.rpts[calR.round] ?? 0
                      const [gold, orange] = _driverRoundThresholds[calR.round] ?? [0, 0]
                      const bg = pts > 0 && pts === gold ? 'rgba(255,215,0,0.12)' : pts > 0 && pts === orange ? 'rgba(255,120,0,0.1)' : 'transparent'
                      const col = pts > 0 && pts === gold ? '#FFD700' : pts > 0 && pts === orange ? '#FF8800' : pts > 0 ? '#F0F4F8' : '#3A4A5A'
                      return (
                        <td key={calR.round} style={{ ...tdMono(col), background: bg, fontWeight: pts === gold ? 700 : 400 }}>
                          {pts > 0 ? pts : '—'}
                        </td>
                      )
                    })}
                    <td style={{ ...tdMono(d.total > 0 ? '#FFB800' : '#3A4A5A'), fontWeight: 700, fontSize: '13px' }}>
                      {d.total > 0 ? d.total : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '380px' }}>
              <thead>
                <tr>
                  <th style={{ ...thStyle(false), width: '36px' }}>#</th>
                  <th style={{ ...thStyle(true), minWidth: '160px' }}>Constructor</th>
                  {completedCalRounds.map(calR => (
                    <th key={calR.round} style={{ ...thStyle(false), minWidth: '52px' }}>
                      <span style={{ fontFamily: 'Twemoji Country Flags, DM Sans, sans-serif', marginRight: '3px' }}>{calR.flag}</span>
                      {RACE_CODE[calR.name] || calR.name.slice(0,3).toUpperCase()}
                    </th>
                  ))}
                  <th style={{ ...thStyle(false), minWidth: '52px', color: '#FFB800' }}>TOTAL</th>
                </tr>
              </thead>
              <tbody>
                {conPprData.map((c, i) => (
                  <tr key={c.team} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)' }}>
                    <td style={{ ...tdMono(posColor(i + 1)), fontWeight: i < 3 ? 600 : 400 }}>{i + 1}</td>
                    <td style={{ padding: '8px 12px', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: c.color, flexShrink: 0 }} />
                        <span style={{ fontSize: '12px', fontWeight: 600, whiteSpace: 'nowrap' }}>{c.team}</span>
                      </div>
                    </td>
                    {completedCalRounds.map(calR => {
                      const pts = c.rpts[calR.round] ?? 0
                      const [gold, orange] = _conRoundThresholds[calR.round] ?? [0, 0]
                      const bg = pts > 0 && pts === gold ? 'rgba(255,215,0,0.12)' : pts > 0 && pts === orange ? 'rgba(255,120,0,0.1)' : 'transparent'
                      const col = pts > 0 && pts === gold ? '#FFD700' : pts > 0 && pts === orange ? '#FF8800' : pts > 0 ? '#F0F4F8' : '#3A4A5A'
                      return (
                        <td key={calR.round} style={{ ...tdMono(col), background: bg, fontWeight: pts === gold ? 700 : 400 }}>
                          {pts > 0 ? pts : '—'}
                        </td>
                      )
                    })}
                    <td style={{ ...tdMono(c.total > 0 ? '#FFB800' : '#3A4A5A'), fontWeight: 700, fontSize: '13px' }}>
                      {c.total > 0 ? c.total : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <div style={{ padding: '8px 20px 12px', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
          <span style={{ fontSize: '10px', color: '#3A4A5A' }}>Race points only (25–18–15–12–10–8–6–4–2–1). Sprint points not included.</span>
        </div>
      </div>

    </div>
  )
}
