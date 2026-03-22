'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { DRIVERS, TEAMS } from '@/lib/drivers'
import { DRIVER_STANDINGS, CONSTRUCTOR_STANDINGS } from '@/lib/standings'
import { CURRENT_RACE } from '@/lib/races'
import { DRIVER_STATS_MAP } from '@/lib/seasonStats'

const TEAM_FLAGS: Record<string, string> = Object.fromEntries(
  CONSTRUCTOR_STANDINGS.map(c => [c.name, c.flag])
)

const card = { background: '#0E1318', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', overflow: 'hidden' as const }
const cardHeader = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px 12px', borderBottom: '1px solid rgba(255,255,255,0.07)' }
const cardTitle = { fontSize: '12px', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '1.5px', color: '#5A6A7A' }

function Badge({ type, label }: { type: string; label: string }) {
  const map: Record<string, { bg: string; color: string }> = {
    live: { bg: 'rgba(232,0,45,0.15)', color: '#E8002D' },
    new: { bg: 'rgba(0,212,126,0.12)', color: '#00D47E' },
    race: { bg: 'rgba(255,184,0,0.12)', color: '#FFB800' },
    blue: { bg: 'rgba(0,168,255,0.12)', color: '#00A8FF' },
  }
  const st = map[type] || map.live
  return <span style={{ fontSize: '10px', fontWeight: 600, padding: '3px 8px', borderRadius: '4px', letterSpacing: '0.5px', textTransform: 'uppercase' as const, background: st.bg, color: st.color }}>{label}</span>
}

function Loader() {
  return <div style={{ padding: '32px', textAlign: 'center' as const, color: '#3A4A5A', fontFamily: 'JetBrains Mono, monospace', fontSize: '12px' }}>Loading...</div>
}

function StatCard({ label, value, icon, color, sub }: { label: string; value: string; icon: string; color: string; sub?: string }) {
  return (
    <div style={{ background: '#141B22', borderRadius: '10px', padding: '16px' }}>
      <div style={{ fontSize: '20px', marginBottom: '8px' }}>{icon}</div>
      <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '24px', fontWeight: 600, color, marginBottom: '2px' }}>{value}</div>
      <div style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '1px', color: '#5A6A7A' }}>{label}</div>
      {sub && <div style={{ fontSize: '11px', color: '#3A4A5A', marginTop: '2px' }}>{sub}</div>}
    </div>
  )
}

type LeaderCategory = 'wins' | 'podiums' | 'poles' | 'overtakes' | 'positions_gained'


export default function F1FantasyClient() {
  const [stats, setStats] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'drivers' | 'constructors' | 'how-to-play' | 'guide' | 'ai-predictor'>('overview')
  const [leaderCategory, setLeaderCategory] = useState<LeaderCategory>('wins')

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/f1/fantasy-stats?year=2026')
        const data = await res.json()
        setStats(data.drivers || [])
      } catch (e) { console.error(e) }
      finally { setLoading(false) }
    }
    load()
  }, [])

  // Use standings as fallback if API hasn't returned yet
  const displayDrivers = stats.length > 0 ? stats : DRIVER_STANDINGS.map(d => ({
    driver_number: d.id,
    name: d.name,
    acronym: d.shortName,
    team: d.team,
    team_colour: d.teamColor,
    wins: d.wins,
    podiums: DRIVER_STATS_MAP[d.name]?.podiums ?? 0,
    poles:   DRIVER_STATS_MAP[d.name]?.poles   ?? 0,
    total_overtakes: 0,
    total_positions_gained: 0,
    race_count: 2,
  }))

  const leaders = {
    wins: [...displayDrivers].sort((a, b) => b.wins - a.wins)[0],
    podiums: [...displayDrivers].sort((a, b) => b.podiums - a.podiums)[0],
    poles: [...displayDrivers].sort((a, b) => b.poles - a.poles)[0],
    overtakes: [...displayDrivers].sort((a, b) => b.total_overtakes - a.total_overtakes)[0],
    positions_gained: [...displayDrivers].sort((a, b) => b.total_positions_gained - a.total_positions_gained)[0],
  }

  const leaderTabs: { id: LeaderCategory; label: string; icon: string }[] = [
    { id: 'wins', label: 'Wins', icon: '🏆' },
    { id: 'podiums', label: 'Podiums', icon: '🥇' },
    { id: 'poles', label: 'Poles', icon: '⚡' },
    { id: 'overtakes', label: 'Overtakes', icon: '🔀' },
    { id: 'positions_gained', label: 'Pos. Gained', icon: '📈' },
  ]

  const sortedByCategory = [...displayDrivers].sort((a, b) => {
    const map: Record<LeaderCategory, string> = {
      wins: 'wins', podiums: 'podiums', poles: 'poles',
      overtakes: 'total_overtakes', positions_gained: 'total_positions_gained'
    }
    return b[map[leaderCategory]] - a[map[leaderCategory]]
  })

  const tabs = [
    { id: 'overview',      label: 'Overview'                             },
    { id: 'drivers',       label: 'Driver Rankings'                      },
    { id: 'constructors',  label: 'Constructor Rankings'                  },
    { id: 'how-to-play',   label: 'How to Play'                          },
    { id: 'guide',         label: 'Chip Overview'                        },
    { id: 'ai-predictor',  label: 'AI Predictor',         premium: true  },
  ]


  const ppm = (d: any) => {
    const standing = DRIVER_STANDINGS.find(s => s.name === d.name || s.shortName === d.acronym)
    const price = DRIVERS.find(dr => dr.name === d.name)?.price || 15
    const points = standing?.points || 0
    return points > 0 ? (points / price).toFixed(2) : '0.00'
  }

  return (
    <div className="mob-pad-page" style={{ position: 'relative', zIndex: 1, maxWidth: '1400px', margin: '0 auto', padding: '28px 32px 60px' }}>

      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <div style={{ width: '3px', height: '24px', background: '#E8002D', borderRadius: '2px' }} />
          <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '2px', color: '#E8002D', textTransform: 'uppercase' as const }}>F1 Fantasy 2026</span>
        </div>
        <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '56px', letterSpacing: '1px', lineHeight: 1, marginBottom: '8px', fontWeight: 400, margin: '0 0 8px' }}>F1 Fantasy 2026</h1>
        <p style={{ color: '#5A6A7A', fontSize: '13px', maxWidth: '500px', lineHeight: 1.7 }}>
          Live race performance metrics and strategy tools. Use these stats to make smarter F1 Fantasy picks every race week.
        </p>
      </div>

      {/* Tab nav */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.07)', overflowX: 'auto', WebkitOverflowScrolling: 'touch', whiteSpace: 'nowrap' }}>
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} style={{
            background: activeTab === tab.id ? 'rgba(232,0,45,0.1)' : 'transparent',
            color: activeTab === tab.id ? '#E8002D' : '#5A6A7A',
            border: 'none', borderBottom: activeTab === tab.id ? '2px solid #E8002D' : '2px solid transparent',
            padding: '10px 20px', cursor: 'pointer', fontSize: '13px', fontWeight: 600,
            letterSpacing: '0.3px', transition: 'all 0.2s', borderRadius: '6px 6px 0 0',
            display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0,
          }}>
            {tab.label}
            {tab.premium && (
              <span style={{
                fontSize: '9px', fontWeight: 700, padding: '2px 6px', borderRadius: '3px',
                background: 'rgba(255,184,0,0.15)',
                color: '#FFB800',
                letterSpacing: '0.5px', textTransform: 'uppercase' as const,
              }}>🔒 Members</span>
            )}
          </button>
        ))}
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <>
          {/* Season stat summary cards */}
          <div className="mob-2col" style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: '12px', marginBottom: '20px' }}>
            <StatCard label="Season Leader" value={leaders.wins?.acronym || '—'} icon="🏆" color="#FFD700" sub={`${leaders.wins?.wins || 0} wins`} />
            <StatCard label="Pole Sitter" value={leaders.poles?.acronym || '—'} icon="⚡" color="#E8002D" sub={`${leaders.poles?.poles || 0} poles`} />
            <StatCard label="Top Overtaker" value={leaders.overtakes?.acronym || '—'} icon="🔀" color="#00A8FF" sub={`${leaders.overtakes?.total_overtakes || 0} moves`} />
            <StatCard label="Pos. Gained" value={leaders.positions_gained?.acronym || '—'} icon="📈" color="#00D47E" sub={`+${leaders.positions_gained?.total_positions_gained || 0} total`} />
            <StatCard label="Rounds" value="2" icon="🏁" color="#FFB800" sub="of 22 complete" />
          </div>

          {/* Leader boards */}
          <div className="mob-1col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>

            {/* Fantasy points leaders */}
            <div style={card}>
              <div style={cardHeader}>
                <span style={cardTitle}>Fantasy Points Leaders</span>
                <Badge type="race" label="2026 Season" />
              </div>
              <div style={{ padding: '8px 20px' }}>
                {DRIVER_STANDINGS.filter(d => d.points > 0).slice(0, 10).map((d, i) => {
                  const driver = DRIVERS.find(dr => dr.id === d.id)
                  const maxPts = DRIVER_STANDINGS[0].points
                  return (
                    <div key={d.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', color: i < 3 ? ['#FFD700','#C0C0C0','#CD7F32'][i] : '#3A4A5A', width: '20px' }}>{i + 1}</span>
                      <div style={{ width: '3px', height: '24px', borderRadius: '2px', background: d.teamColor, flexShrink: 0 }} />
                      <span style={{ fontSize: '14px' }}>{d.flag}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '13px', fontWeight: 500 }}>{d.name}</div>
                        <div style={{ fontSize: '11px', color: '#5A6A7A' }}>{d.team}</div>
                      </div>
                      <div style={{ width: '80px', height: '3px', background: '#1C2630', borderRadius: '2px', overflow: 'hidden' }}>
                        <div style={{ width: `${(d.points / maxPts) * 100}%`, height: '100%', background: '#FFB800', opacity: 0.8 }} />
                      </div>
                      <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '14px', fontWeight: 600, color: '#FFB800', width: '36px', textAlign: 'right' as const }}>{d.points}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* PPM leaders */}
            <div style={card}>
              <div style={cardHeader}>
                <span style={cardTitle}>Points Per Million (PPM)</span>
                <Badge type="blue" label="Value Metric" />
              </div>
              <div style={{ padding: '8px 20px' }}>
                <div style={{ fontSize: '11px', color: '#5A6A7A', padding: '8px 0 12px', borderBottom: '1px solid rgba(255,255,255,0.07)', marginBottom: '4px' }}>
                  PPM = Total fantasy points ÷ current price. Higher = better value pick.
                </div>
                {DRIVER_STANDINGS
                  .filter(d => d.points > 0)
                  .map(d => {
                    const driver = DRIVERS.find(dr => dr.id === d.id)
                    const price = driver?.price || 15
                    const ppmVal = (d.points / price).toFixed(2)
                    return { ...d, ppm: parseFloat(ppmVal), price, driver }
                  })
                  .sort((a, b) => b.ppm - a.ppm)
                  .slice(0, 10)
                  .map((d, i) => (
                    <div key={d.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', color: i < 3 ? ['#FFD700','#C0C0C0','#CD7F32'][i] : '#3A4A5A', width: '20px' }}>{i + 1}</span>
                      <div style={{ width: '3px', height: '24px', borderRadius: '2px', background: d.teamColor, flexShrink: 0 }} />
                      <span style={{ fontSize: '14px' }}>{d.flag}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '13px', fontWeight: 500 }}>{d.name}</div>
                        <div style={{ fontSize: '11px', color: '#5A6A7A' }}>${d.price}M · {d.points} pts</div>
                      </div>
                      <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '15px', fontWeight: 600, color: '#00D47E' }}>{d.ppm}</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* Performance leaderboard */}
          <div style={card}>
            <div style={cardHeader}>
              <span style={cardTitle}>Performance Leaderboard</span>
              <Badge type="new" label="Live Data" />
            </div>
            <div style={{ display: 'flex', gap: '6px', padding: '12px 20px', borderBottom: '1px solid rgba(255,255,255,0.07)', flexWrap: 'wrap' as const }}>
              {leaderTabs.map(t => (
                <button key={t.id} onClick={() => setLeaderCategory(t.id)} style={{
                  background: leaderCategory === t.id ? '#E8002D' : '#141B22',
                  color: leaderCategory === t.id ? 'white' : '#5A6A7A',
                  border: '1px solid', borderColor: leaderCategory === t.id ? '#E8002D' : 'rgba(255,255,255,0.07)',
                  padding: '5px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 600,
                }}>{t.icon} {t.label}</button>
              ))}
            </div>
            {loading ? <Loader /> : (
              <div style={{ padding: '8px 20px' }}>
                {sortedByCategory.slice(0, 10).map((d: any, i: number) => {
                  const valMap: Record<LeaderCategory, any> = {
                    wins: d.wins, podiums: d.podiums, poles: d.poles,
                    overtakes: d.total_overtakes, positions_gained: d.total_positions_gained,
                  }
                  const val = valMap[leaderCategory]
                  const maxVal = valMap[leaderCategory] || 1
                  const maxAll = sortedByCategory[0]?.[leaderCategory === 'overtakes' ? 'total_overtakes' : leaderCategory === 'positions_gained' ? 'total_positions_gained' : leaderCategory] || 1
                  return (
                    <div key={d.driver_number} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '9px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', color: i < 3 ? ['#FFD700','#C0C0C0','#CD7F32'][i] : '#3A4A5A', width: '20px' }}>{i + 1}</span>
                      <div style={{ width: '3px', height: '24px', borderRadius: '2px', background: d.team_colour, flexShrink: 0 }} />
                      {(() => { const standing = DRIVER_STANDINGS.find(s => s.name === d.name || s.shortName === d.acronym); return standing ? <span style={{ fontSize: '14px', fontFamily: 'Twemoji Country Flags, DM Sans, sans-serif' }}>{standing.flag}</span> : null })()}
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '13px', fontWeight: 500 }}>{d.name}</div>
                        <div style={{ fontSize: '11px', color: '#5A6A7A' }}>{d.team}</div>
                      </div>
                      <div style={{ width: '120px', height: '4px', background: '#1C2630', borderRadius: '2px', overflow: 'hidden' }}>
                        <div style={{ width: `${(val / maxAll) * 100}%`, height: '100%', background: '#E8002D', opacity: 0.8 }} />
                      </div>
                      <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '15px', fontWeight: 600, color: '#F0F4F8', width: '28px', textAlign: 'right' as const }}>{val}</span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </>
      )}

      {/* DRIVERS TAB */}
      {activeTab === 'drivers' && (
        <>
        <div style={card}>
          <div style={cardHeader}>
            <span style={cardTitle}>Full Driver Rankings — 2026</span>
            <Badge type="race" label="All Metrics" />
          </div>
          <div style={{ overflowX: 'auto' as const }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' as const, minWidth: '800px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                  {['#','Driver','Team','Pts','PPM','Wins','Podiums','Poles','Overtakes','Pos+'].map(h => (
                    <th key={h} style={{ padding: '10px 12px', fontSize: '10px', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '1px', color: '#5A6A7A', textAlign: h === 'Driver' || h === 'Team' ? 'left' as const : 'center' as const, whiteSpace: 'nowrap' as const }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {DRIVER_STANDINGS.map((d, i) => {
                  const driver = DRIVERS.find(dr => dr.id === d.id)
                  const price = driver?.price || 15
                  const ppmVal = d.points > 0 ? (d.points / price).toFixed(2) : '—'
                  const liveStats = stats.find(s => s.name === d.name || s.acronym === d.shortName)
                  return (
                    <tr key={d.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                      <td style={{ padding: '9px 12px', fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', color: '#3A4A5A' }}>{i + 1}</td>
                      <td style={{ padding: '9px 12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ width: '3px', height: '20px', borderRadius: '2px', background: d.teamColor }} />
                          <span style={{ fontSize: '14px' }}>{d.flag}</span>
                          <span style={{ fontSize: '13px', fontWeight: 500, whiteSpace: 'nowrap' as const }}>{d.name}</span>
                        </div>
                      </td>
                      <td style={{ padding: '9px 12px', fontSize: '12px', color: '#5A6A7A', whiteSpace: 'nowrap' as const }}>{d.team}</td>
                      <td style={{ padding: '9px 12px', fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', fontWeight: 600, color: d.points > 0 ? '#FFB800' : '#3A4A5A', textAlign: 'center' as const }}>{d.points}</td>
                      <td style={{ padding: '9px 12px', fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', color: '#00D47E', textAlign: 'center' as const }}>{ppmVal}</td>
                      <td style={{ padding: '9px 12px', fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', color: d.wins > 0 ? '#FFD700' : '#3A4A5A', textAlign: 'center' as const }}>{d.wins}</td>
                      <td style={{ padding: '9px 12px', fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', color: '#5A6A7A', textAlign: 'center' as const }}>{liveStats?.podiums ?? DRIVER_STATS_MAP[d.name]?.podiums ?? '—'}</td>
                      <td style={{ padding: '9px 12px', fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', color: '#5A6A7A', textAlign: 'center' as const }}>{liveStats?.poles ?? DRIVER_STATS_MAP[d.name]?.poles ?? '—'}</td>
                      <td style={{ padding: '9px 12px', fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', color: '#00A8FF', textAlign: 'center' as const }}>{liveStats?.total_overtakes ?? '—'}</td>
                      <td style={{ padding: '9px 12px', fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', color: '#00D47E', textAlign: 'center' as const }}>{liveStats?.total_positions_gained ? `+${liveStats.total_positions_gained}` : '—'}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* OFFICIAL F1 FANTASY STATS */}
        <div style={{ ...card, marginTop: '20px' }}>
          <div style={cardHeader}>
            <span style={cardTitle}>Official F1 Fantasy Stats</span>
            <Badge type="blue" label="After R2" />
          </div>
          <div className="mob-1col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0' }}>

            {/* Total Fantasy Points */}
            <div style={{ padding: '16px 20px', borderRight: '1px solid rgba(255,255,255,0.07)' }}>
              <div style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '1.5px', color: '#FFB800', marginBottom: '12px' }}>Top Fantasy Points</div>
              {[
                { driver: 'K. Antonelli', pts: 100, flag: '🇮🇹', color: '#27F4D2' },
                { driver: 'G. Russell',   pts: 84,  flag: '🇬🇧', color: '#27F4D2' },
                { driver: 'C. Leclerc',   pts: 80,  flag: '🇲🇨', color: '#E8002D' },
                { driver: 'L. Hamilton',  pts: 73,  flag: '🇬🇧', color: '#E8002D' },
                { driver: 'M. Verstappen',pts: 64,  flag: '🇳🇱', color: '#3671C6' },
              ].map((r, i) => (
                <div key={r.driver} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '7px 0', borderBottom: i < 4 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: '#3A4A5A', width: '14px' }}>{i + 1}</span>
                  <div style={{ width: '3px', height: '18px', borderRadius: '2px', background: r.color, flexShrink: 0 }} />
                  <span style={{ fontSize: '13px' }}>{r.flag}</span>
                  <span style={{ flex: 1, fontSize: '12px', fontWeight: 500 }}>{r.driver}</span>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', fontWeight: 600, color: '#FFB800' }}>{r.pts}</span>
                </div>
              ))}
            </div>

            {/* Selection % */}
            <div style={{ padding: '16px 20px', borderRight: '1px solid rgba(255,255,255,0.07)' }}>
              <div style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '1.5px', color: '#00A8FF', marginBottom: '12px' }}>Most Selected</div>
              {[
                { driver: 'O. Bearman',   pct: '60%', flag: '🇬🇧', color: '#B6BABD' },
                { driver: 'A. Lindblad',  pct: '45%', flag: '🇬🇧', color: '#6692FF' },
                { driver: 'I. Hadjar',    pct: '33%', flag: '🇫🇷', color: '#3671C6' },
                { driver: 'G. Bortoleto', pct: '33%', flag: '🇧🇷', color: '#C0C0C0' },
                { driver: 'N. Hülkenberg',pct: '32%', flag: '🇩🇪', color: '#C0C0C0' },
              ].map((r, i) => (
                <div key={r.driver} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '7px 0', borderBottom: i < 4 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: '#3A4A5A', width: '14px' }}>{i + 1}</span>
                  <div style={{ width: '3px', height: '18px', borderRadius: '2px', background: r.color, flexShrink: 0 }} />
                  <span style={{ fontSize: '13px' }}>{r.flag}</span>
                  <span style={{ flex: 1, fontSize: '12px', fontWeight: 500 }}>{r.driver}</span>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', fontWeight: 600, color: '#00A8FF' }}>{r.pct}</span>
                </div>
              ))}
            </div>

            {/* Price Rises */}
            <div style={{ padding: '16px 20px' }}>
              <div style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '1.5px', color: '#00D47E', marginBottom: '12px' }}>Biggest Price Rises</div>
              {[
                { driver: 'A. Lindblad', rise: '+$1.2M', flag: '🇬🇧', color: '#6692FF' },
                { driver: 'E. Ocon',     rise: '+$1.2M', flag: '🇫🇷', color: '#B6BABD' },
                { driver: 'O. Bearman',  rise: '+$1.2M', flag: '🇬🇧', color: '#B6BABD' },
                { driver: 'F. Colapinto',rise: '+$0.8M', flag: '🇦🇷', color: '#FF69B4' },
                { driver: 'P. Gasly',    rise: '+$0.8M', flag: '🇫🇷', color: '#FF69B4' },
              ].map((r, i) => (
                <div key={r.driver} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '7px 0', borderBottom: i < 4 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: '#3A4A5A', width: '14px' }}>{i + 1}</span>
                  <div style={{ width: '3px', height: '18px', borderRadius: '2px', background: r.color, flexShrink: 0 }} />
                  <span style={{ fontSize: '13px' }}>{r.flag}</span>
                  <span style={{ flex: 1, fontSize: '12px', fontWeight: 500 }}>{r.driver}</span>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', fontWeight: 600, color: '#00D47E' }}>{r.rise}</span>
                </div>
              ))}
            </div>

          </div>
        </div>
        </>
      )}

      {/* CONSTRUCTORS TAB */}
      {activeTab === 'constructors' && (
        <div className="mob-1col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div style={card}>
            <div style={cardHeader}>
              <span style={cardTitle}>Constructor Rankings</span>
              <Badge type="race" label="2026 Season" />
            </div>
            <div style={{ padding: '8px 20px' }}>
              {CONSTRUCTOR_STANDINGS.map((c, i) => {
                const maxPts = CONSTRUCTOR_STANDINGS[0].points
                return (
                  <div key={c.name} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', color: i < 3 ? ['#FFD700','#C0C0C0','#CD7F32'][i] : '#3A4A5A', width: '20px' }}>{c.pos}</span>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: c.color, flexShrink: 0 }} />
                    <span style={{ fontSize: '14px' }}>{c.flag}</span>
                    <span style={{ flex: 1, fontSize: '13px', fontWeight: 500 }}>{c.name}</span>
                    <div style={{ width: '100px', height: '3px', background: '#1C2630', borderRadius: '2px', overflow: 'hidden' }}>
                      <div style={{ width: maxPts > 0 ? `${(c.points / maxPts) * 100}%` : '2px', height: '100%', background: c.color, opacity: 0.8 }} />
                    </div>
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '15px', fontWeight: 600, color: c.points > 0 ? '#FFB800' : '#3A4A5A', width: '36px', textAlign: 'right' as const }}>{c.points}</span>
                  </div>
                )
              })}
            </div>
          </div>

          <div style={card}>
            <div style={cardHeader}>
              <span style={cardTitle}>Constructor Driver Pairs</span>
              <Badge type="blue" label="2026 Grid" />
            </div>
            <div style={{ padding: '8px 20px' }}>
              {[...TEAMS]
                .map(team => ({ team, teamDrivers: DRIVER_STANDINGS.filter(d => d.team === team.name) }))
                .map(({ team, teamDrivers }) => ({ team, teamDrivers, totalPts: teamDrivers.reduce((sum, d) => sum + d.points, 0) }))
                .sort((a, b) => b.totalPts - a.totalPts)
                .map(({ team, teamDrivers, totalPts }) => {
                return (
                  <div key={team.id} style={{ padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                      <div style={{ width: '4px', height: '20px', borderRadius: '2px', background: team.color }} />
                      <span style={{ fontSize: '14px' }}>{TEAM_FLAGS[team.name] ?? '🏁'}</span>
                      <span style={{ fontSize: '13px', fontWeight: 600 }}>{team.name}</span>
                      <span style={{ marginLeft: 'auto', fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', fontWeight: 600, color: totalPts > 0 ? '#FFB800' : '#3A4A5A' }}>{totalPts} pts</span>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', paddingLeft: '12px' }}>
                      {teamDrivers.map(d => (
                        <span key={d.id} style={{ fontSize: '11px', color: '#5A6A7A' }}>{d.flag} {d.name} <span style={{ color: '#FFB800', fontFamily: 'JetBrains Mono, monospace' }}>{d.points}</span></span>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* HOW TO PLAY TAB */}
      {activeTab === 'how-to-play' && (
        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '20px' }}>

          {/* Intro */}
          <div style={{ background: 'rgba(232,0,45,0.06)', border: '1px solid rgba(232,0,45,0.2)', borderRadius: '14px', padding: '28px' }}>
            <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '32px', marginBottom: '10px' }}>What is F1 Fantasy?</div>
            <p style={{ color: '#8A9AB0', fontSize: '14px', lineHeight: 1.8 }}>
              F1 Fantasy is the official free-to-play Formula 1 fantasy game. Pick five drivers and two constructors, stay within your $100M budget, and score points based on how your picks perform every race weekend. The player with the most points at the end of the season wins.
            </p>
          </div>

          <div className="mob-1col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>

            {/* Building your team */}
            <div style={{ background: '#0E1318', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', overflow: 'hidden' }}>
              <div style={{ padding: '16px 20px 12px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '20px' }}>🏗️</span>
                <span style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '1.5px', color: '#00A8FF' }}>Building Your Team</span>
              </div>
              <div style={{ padding: '20px', display: 'flex', flexDirection: 'column' as const, gap: '10px' }}>
                {[
                  { icon: '💰', text: 'You have a $100M budget to select 5 drivers and 2 constructors from the full 2026 grid' },
                  { icon: '📊', text: 'Better drivers cost more — balance star picks with value options to maximise scoring' },
                  { icon: '📈', text: 'Driver and constructor prices change after each race based on performance — buy before the rises' },
                  { icon: '💡', text: 'Your cost cap grows when your assets rise in value, so early value picks compound over the season' },
                  { icon: '⚠️', text: 'If a driver you own doesn\'t start a race, you incur a points penalty — stay on top of the news' },
                  { icon: '🏁', text: 'You can build up to 3 teams per account — all three are eligible for the Global League in 2026' },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <span style={{ fontSize: '16px', flexShrink: 0 }}>{item.icon}</span>
                    <span style={{ fontSize: '13px', color: '#8A9AB0', lineHeight: 1.6 }}>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Transfers */}
            <div style={{ background: '#0E1318', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', overflow: 'hidden' }}>
              <div style={{ padding: '16px 20px 12px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '20px' }}>🔄</span>
                <span style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '1.5px', color: '#FFB800' }}>Transfers</span>
              </div>
              <div style={{ padding: '20px', display: 'flex', flexDirection: 'column' as const, gap: '10px' }}>
                {[
                  { icon: '✅', text: 'You get 3 free transfers per Grand Prix weekend — use them wisely to react to form and injuries' },
                  { icon: '💾', text: 'One unused transfer carries over to the next round — bank it for emergencies' },
                  { icon: '❌', text: 'Each transfer above your allowance costs -10 points — a massive penalty, use sparingly' },
                  { icon: '🔁', text: 'Transfers are calculated on a net basis — you can test lineup changes and revert without penalty' },
                  { icon: '⏰', text: 'Lineups lock at the start of Qualifying — on sprint weekends, lock is before the Sprint Qualifying' },
                  { icon: '♾️', text: 'Before the first race you can make unlimited free changes — use this to build your ideal starting team' },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <span style={{ fontSize: '16px', flexShrink: 0 }}>{item.icon}</span>
                    <span style={{ fontSize: '13px', color: '#8A9AB0', lineHeight: 1.6 }}>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 2x Boost */}
            <div style={{ background: '#0E1318', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', overflow: 'hidden' }}>
              <div style={{ padding: '16px 20px 12px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '20px' }}>2️⃣</span>
                <span style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '1.5px', color: '#E8002D' }}>2x Boost</span>
              </div>
              <div style={{ padding: '20px', display: 'flex', flexDirection: 'column' as const, gap: '10px' }}>
                {[
                  { icon: '⚡', text: 'Each race weekend, select one driver to score double points with the 2x Boost' },
                  { icon: '🎯', text: 'It\'s your single most important weekly decision — pick a driver likely to score heavily' },
                  { icon: '⚠️', text: 'It cuts both ways — if your boost driver DNFs, you score double the penalty (-40 pts)' },
                  { icon: '🏎️', text: 'Sprint weekends: the 2x Boost applies across both the Sprint and the Grand Prix' },
                  { icon: '🔧', text: 'You cannot change the 2x Boost alone — you must also swap the boosted driver if you want to move it' },
                  { icon: '👥', text: 'Topping managers often pick the same boost driver — differentiating is how you win mini-leagues' },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <span style={{ fontSize: '16px', flexShrink: 0 }}>{item.icon}</span>
                    <span style={{ fontSize: '13px', color: '#8A9AB0', lineHeight: 1.6 }}>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Scoring */}
            <div style={{ background: '#0E1318', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', overflow: 'hidden' }}>
              <div style={{ padding: '16px 20px 12px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '20px' }}>📊</span>
                <span style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '1.5px', color: '#00D47E' }}>Scoring System</span>
              </div>
              <div style={{ padding: '20px', display: 'flex', flexDirection: 'column' as const, gap: '16px' }}>

                {/* Race Finish */}
                <div>
                  <div style={{ fontSize: '10px', fontWeight: 700, color: '#FFB800', textTransform: 'uppercase' as const, letterSpacing: '1.5px', marginBottom: '8px' }}>Race Finish</div>
                  <div className="mob-2col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}>
                    {[['P1','+25'],['P2','+18'],['P3','+15'],['P4','+12'],['P5','+10'],['P6','+8'],['P7','+6'],['P8','+4'],['P9','+2'],['P10','+1']].map(([l,p]) => (
                      <div key={l} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 10px', background: '#141B22', borderRadius: '5px' }}>
                        <span style={{ fontSize: '11px', color: '#5A6A7A' }}>{l}</span>
                        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', fontWeight: 600, color: '#FFB800' }}>{p}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Qualifying */}
                <div>
                  <div style={{ fontSize: '10px', fontWeight: 700, color: '#00A8FF', textTransform: 'uppercase' as const, letterSpacing: '1.5px', marginBottom: '8px' }}>Qualifying</div>
                  <div className="mob-2col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}>
                    {[['P1','+10'],['P2','+9'],['P3','+8'],['P4','+7'],['P5','+6'],['P6','+5'],['P7','+4'],['P8','+3'],['P9','+2'],['P10','+1']].map(([l,p]) => (
                      <div key={l} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 10px', background: '#141B22', borderRadius: '5px' }}>
                        <span style={{ fontSize: '11px', color: '#5A6A7A' }}>Q {l}</span>
                        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', fontWeight: 600, color: '#00A8FF' }}>{p}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sprint Weekend */}
                <div>
                  <div style={{ fontSize: '10px', fontWeight: 700, color: '#E8002D', textTransform: 'uppercase' as const, letterSpacing: '1.5px', marginBottom: '8px' }}>Sprint Weekend</div>
                  <div className="mob-2col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}>
                    {[['Sprint P1','+8'],['Sprint P2','+7'],['Sprint P3','+6'],['Sprint P4','+5'],['Sprint P5','+4'],['Sprint P6','+3'],['Sprint P7','+2'],['Sprint P8','+1'],['SQ P1','+5'],['SQ P2','+4'],['SQ P3','+3'],['SQ P4–5','+2–1']].map(([l,p]) => (
                      <div key={l} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 10px', background: '#141B22', borderRadius: '5px' }}>
                        <span style={{ fontSize: '11px', color: '#5A6A7A' }}>{l}</span>
                        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', fontWeight: 600, color: '#E8002D' }}>{p}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bonuses & Penalties */}
                <div>
                  <div style={{ fontSize: '10px', fontWeight: 700, color: '#00D47E', textTransform: 'uppercase' as const, letterSpacing: '1.5px', marginBottom: '8px' }}>Bonuses & Penalties</div>
                  <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '4px' }}>
                    {[
                      { label: 'Fastest Lap',          pts: '+5',  color: '#FF69B4' },
                      { label: 'Per Overtake (max 5)',  pts: '+3',  color: '#00A8FF' },
                      { label: 'DNF / Not Classified',  pts: '−20', color: '#E8002D' },
                      { label: 'Sprint DNF',            pts: '−10', color: '#E8002D' },
                      { label: 'Did Not Start',         pts: '−15', color: '#FF6B6B' },
                    ].map(s => (
                      <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 10px', background: '#141B22', borderRadius: '6px' }}>
                        <span style={{ fontSize: '12px', color: '#5A6A7A' }}>{s.label}</span>
                        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', fontWeight: 600, color: s.color }}>{s.pts}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>

          </div>

          {/* Play free CTA */}
          <div style={{ background: 'rgba(232,0,45,0.06)', border: '1px solid rgba(232,0,45,0.2)', borderRadius: '14px', padding: '28px', display: 'flex', alignItems: 'center', gap: '24px' }}>
            <span style={{ fontSize: '48px' }}>🏆</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '28px', marginBottom: '6px' }}>Play F1 Fantasy free at formula1.com</div>
              <p style={{ color: '#5A6A7A', fontSize: '13px', lineHeight: 1.7 }}>
                The official game is completely free to play. Top prizes include 2027 F1 tickets, grandstand seats and F1 Store vouchers for the Global League leaders.
              </p>
            </div>
            <a href="https://fantasy.formula1.com" target="_blank" rel="noopener noreferrer" style={{ background: '#E8002D', color: 'white', padding: '12px 24px', borderRadius: '8px', textDecoration: 'none', fontWeight: 600, fontSize: '13px', flexShrink: 0, boxShadow: '0 0 20px rgba(232,0,45,0.3)' }}>
              Play now →
            </a>
          </div>

        </div>
      )}

      {/* CHIP OVERVIEW TAB (formerly guide) */}
      {activeTab === 'guide' && (
        <div className="mob-1col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          {[
            { icon: '♾️', title: 'Limitless', color: '#00D47E', items: [
              'Remove your $100M budget cap for one race weekend',
              'Build the best possible team regardless of price',
              'Best used on a sprint weekend for an extra scoring session',
              'Or deploy at a circuit that historically produces high scores',
              'You only get one per season — timing is everything',
            ]},
            { icon: '🔄', title: 'Wildcard', color: '#00A8FF', items: [
              'Make unlimited free transfers for one race weekend',
              'Completely rebuild your team without points penalties',
              'Best used after a big price shift or mid-season reset',
              'Pairs well with No Negative or 3x Boost',
              'Plan ahead — know what team you want before activating',
            ]},
            { icon: '🤖', title: 'Autopilot', color: '#FF69B4', items: [
              'F1 automatically picks your optimal team for one race',
              'Based on the highest-scoring available players by price',
              'Useful if you miss a deadline — prevents a zero score',
              'Cannot be combined with other chips in the same round',
              'Use as a safety net, not a primary strategy',
            ]},
            { icon: '3️⃣', title: '3x Boost', color: '#E8002D', items: [
              'Pick one driver to score triple points for that race weekend',
              'The most powerful single-race scoring tool available',
              'Best used on a driver certain to win and set fastest lap',
              'Sprint weekends give you two sessions to benefit',
              'You only get one — save it for the highest-ceiling race',
            ]},
            { icon: '🔧', title: 'Final Fix', color: '#C0C0C0', items: [
              'Make one free transfer after the race deadline has passed',
              'Useful to fix an injury or late grid penalty',
              'Can only be used once per season',
              'Does not cost -10 points unlike a normal late transfer',
              'Save it for a genuine emergency — not a tactical change',
            ]},
            { icon: '🚫', title: 'No Negative', color: '#FFB800', items: [
              'Removes all negative points scored that race weekend',
              'Ideal if you must start a high-risk driver or constructor',
              'Useful in wet races or street circuits with high DNF risk',
              'Protects your score when you\'re forced into risky picks',
              'One per season — use defensively, not offensively',
            ]},
          ].map((section) => (
            <div key={section.title} style={card}>
              <div style={cardHeader}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '20px' }}>{section.icon}</span>
                  <span style={{ ...cardTitle, color: section.color }}>{section.title}</span>
                </div>
              </div>
              <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column' as const, gap: '10px' }}>
                {section.items.map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                    <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: section.color, flexShrink: 0, marginTop: '7px' }} />
                    <span style={{ fontSize: '13px', color: '#5A6A7A', lineHeight: 1.6 }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Rob's column CTA */}
          <div style={{ ...card, background: 'rgba(232,0,45,0.08)', border: '1px solid rgba(232,0,45,0.2)', gridColumn: '1 / -1' }}>
            <div style={{ padding: '28px', display: 'flex', alignItems: 'center', gap: '24px' }}>
              <div style={{ fontSize: '48px' }}>📝</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '28px', marginBottom: '6px' }}>Read Rob's official F1 Fantasy column</div>
                <p style={{ color: '#5A6A7A', fontSize: '13px', lineHeight: 1.7 }}>
                  Every race week, Rob publishes expert F1 Fantasy strategy directly on formula1.com — covering the best picks, value drivers, and chip timing advice for that weekend.
                </p>
              </div>
              <a href="https://www.formula1.com" target="_blank" rel="noopener noreferrer" style={{ background: '#E8002D', color: 'white', padding: '12px 24px', borderRadius: '8px', textDecoration: 'none', fontWeight: 600, fontSize: '13px', flexShrink: 0 }}>
                Read on F1.com →
              </a>
            </div>
          </div>
        </div>
      )}

      {/* AI PREDICTOR TAB */}
      {activeTab === 'ai-predictor' && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '520px' }}>
          <div style={{ background: '#0E1318', border: '1px solid rgba(255,184,0,0.2)', borderRadius: '20px', padding: '48px 40px', maxWidth: '480px', width: '100%', textAlign: 'center' as const, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg,#FFB800,rgba(255,184,0,0.2))' }} />
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🤖</div>
            <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '32px', letterSpacing: '1px', marginBottom: '8px' }}>AI Predictor</div>
            <div style={{ fontSize: '14px', fontWeight: 600, color: '#FFB800', marginBottom: '16px' }}>Three models. One race. Who calls it right?</div>
            <p style={{ color: '#5A6A7A', fontSize: '13px', lineHeight: 1.7, marginBottom: '28px' }}>
              Every race weekend, GPT, Gemini and Claude each independently predict the top 5 qualifying and race results — no collaboration, no shared data. After the session, predictions are scored against the real results. Points accumulate across the 2026 season to crown the most accurate AI predictor in Formula 1.
            </p>

            {/* Season leaderboard placeholder */}
            <div style={{ background: '#141B22', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', padding: '16px 20px', marginBottom: '8px' }}>
              <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase' as const, color: '#5A6A7A', marginBottom: '14px' }}>2026 Season Leaderboard</div>
              {[
                { medal: '🥇', name: 'Claude',   pts: 0 },
                { medal: '🥈', name: 'GPT-4o',   pts: 0 },
                { medal: '🥉', name: 'Gemini',    pts: 0 },
              ].map((row) => (
                <div key={row.name} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 0', borderBottom: row.name !== 'Gemini' ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                  <span style={{ fontSize: '18px', width: '24px', textAlign: 'center' as const }}>{row.medal}</span>
                  <span style={{ flex: 1, fontSize: '13px', fontWeight: 600, textAlign: 'left' as const }}>{row.name}</span>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', color: '#3A4A5A' }}>{row.pts} pts</span>
                </div>
              ))}
            </div>
            <div style={{ fontSize: '11px', color: '#5A6A7A', marginBottom: '28px' }}>Season predictions begin at Round 4 — Miami</div>

            <a href="/subscribe" style={{ display: 'block', background: '#E8002D', color: 'white', borderRadius: '8px', padding: '14px', fontSize: '14px', fontWeight: 700, textDecoration: 'none', letterSpacing: '0.3px' }}>
              Unlock with Premium
            </a>
          </div>
        </div>
      )}

    </div>
  )
}
