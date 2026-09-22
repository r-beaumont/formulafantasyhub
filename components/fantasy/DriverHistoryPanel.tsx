'use client'
import { useState } from 'react'
import { useCurrentRace } from '@/lib/useCurrentRace'
import { SEASON_CALENDAR } from '@/lib/races'
import { Flag } from '@/components/home/shared'
import { AGGREGATED_STATS, RAW_RESULTS, NO_APPEARANCES } from '@/src/data/driverHistoryData'
import { DH_DRIVERS, CIRCUIT_LIST, driverFlag, driverTeam, histCol, teamRowStyleTag } from './shared'

function defaultCircuit(currentRound: number): string {
  const upcoming = SEASON_CALENDAR.find(
    r => r.round >= currentRound && !!ROUND_TO_CIRCUIT_LOOKUP[r.round]
  )
  return upcoming ? ROUND_TO_CIRCUIT_LOOKUP[upcoming.round] : CIRCUIT_LIST[0].value
}

// Built from CIRCUIT_LIST order against the known round sequence — round 16
// (Sepang) has no historical entry and is intentionally absent.
const ROUND_TO_CIRCUIT_LOOKUP: Record<number, string> = {
  1: CIRCUIT_LIST[0].value, 2: CIRCUIT_LIST[1].value, 3: CIRCUIT_LIST[2].value, 4: CIRCUIT_LIST[3].value,
  5: CIRCUIT_LIST[4].value, 6: CIRCUIT_LIST[5].value, 7: CIRCUIT_LIST[6].value, 8: CIRCUIT_LIST[7].value,
  9: CIRCUIT_LIST[8].value, 10: CIRCUIT_LIST[9].value, 11: CIRCUIT_LIST[10].value, 12: CIRCUIT_LIST[11].value,
  13: CIRCUIT_LIST[12].value, 14: CIRCUIT_LIST[13].value, 15: CIRCUIT_LIST[14].value, 17: CIRCUIT_LIST[15].value,
  18: CIRCUIT_LIST[16].value, 19: CIRCUIT_LIST[17].value, 20: CIRCUIT_LIST[18].value, 21: CIRCUIT_LIST[19].value,
  22: CIRCUIT_LIST[20].value, 23: CIRCUIT_LIST[21].value,
}

const selectStyle: React.CSSProperties = {
  background: 'var(--surface2)', color: 'var(--text)', border: '1px solid var(--border)', borderRadius: '8px',
  padding: '9px 32px 9px 12px', fontSize: '13px', fontFamily: "'DM Sans', sans-serif", cursor: 'pointer',
  outline: 'none', appearance: 'none', WebkitAppearance: 'none', width: '100%',
}

const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: '10px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase',
  color: 'var(--muted)', marginBottom: '6px',
}

function gridDisplay(val: string): string {
  if (!val) return '—'
  if (val === 'PL') return 'PL'
  const n = Number(val)
  return isNaN(n) ? val : `P${n}`
}
function finishDisplay(val: string): string {
  if (!val) return '—'
  const n = Number(val)
  return isNaN(n) ? val : `P${n}`
}
function finishColor(val: string): string {
  if (!val) return 'var(--muted)'
  const n = parseInt(val, 10)
  if (!isNaN(n)) {
    if (n === 1) return '#00C851'
    if (n <= 3) return '#FFD700'
    if (n <= 10) return 'var(--text)'
    return 'var(--muted)'
  }
  return '#E8002D'
}
function fmtStat(val: string | undefined): string {
  if (!val || val === '' || val === 'N/A') return '—'
  const n = Number(val)
  return isNaN(n) ? '—' : `P${n.toFixed(1)}`
}
function fmtBestFinish(val: string | undefined): string {
  if (!val || val === '' || val === 'N/A') return '—'
  const n = Number(val)
  return isNaN(n) ? '—' : `P${Math.round(n)}`
}
function bestFinishColor(val: string | undefined): string {
  if (!val) return 'var(--text)'
  const n = Number(val)
  if (isNaN(n)) return 'var(--text)'
  if (n === 1) return '#00C851'
  if (n <= 3) return '#FFD700'
  return 'var(--text)'
}

export default function DriverHistoryPanel() {
  const race = useCurrentRace()
  const [driver, setDriver] = useState(DH_DRIVERS[0])
  const [circuit, setCircuit] = useState(() => defaultCircuit(race.round))

  const stats = AGGREGATED_STATS[driver]?.[circuit]
  const noAppNote = NO_APPEARANCES[driver]?.[circuit]
  const yearRows = (RAW_RESULTS[`${driver}||${circuit}`] ?? []).slice().sort((a, b) => Number(a.year) - Number(b.year))

  const starts = stats ? stats.starts : 0
  const wins = stats ? stats.wins : 0
  const podiums = stats ? stats.podiums : 0
  const dnfPct = stats ? stats.dnfPct : 0
  const retirements = Math.round((dnfPct / 100) * starts)
  const winRate = starts > 0 ? Math.round((wins / starts) * 100) : 0
  const podiumRate = starts > 0 ? Math.round((podiums / starts) * 100) : 0
  const dnfColor = dnfPct === 0 ? '#00C851' : dnfPct <= 20 ? '#FF8700' : '#E8002D'

  const showNoData = !stats || !!noAppNote
  const circuitDisplayName = CIRCUIT_LIST.find(c => c.value === circuit)?.display ?? circuit
  const circuitFlag = CIRCUIT_LIST.find(c => c.value === circuit)?.flag
  const dFlag = driverFlag(driver)
  const dTeam = driverTeam(driver)

  return (
    <div>
      <style dangerouslySetInnerHTML={{ __html: teamRowStyleTag }} />

      {/* Dropdowns */}
      <div className="mob-1col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
        <div>
          <label style={labelStyle}>Driver</label>
          <div style={{ position: 'relative' }}>
            <select value={driver} onChange={e => setDriver(e.target.value)} style={selectStyle}>
              {DH_DRIVERS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            <span style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--muted)', fontSize: '10px' }}>▼</span>
          </div>
        </div>
        <div>
          <label style={labelStyle}>Circuit</label>
          <div style={{ position: 'relative' }}>
            <select value={circuit} onChange={e => setCircuit(e.target.value)} style={selectStyle}>
              {CIRCUIT_LIST.map(c => (
                <option key={c.value} value={c.value} style={c.cancelled ? { color: '#5A6A7A' } : {}}>{c.display}</option>
              ))}
            </select>
            <span style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--muted)', fontSize: '10px' }}>▼</span>
          </div>
        </div>
      </div>

      {showNoData ? (
        <div style={{ background: 'var(--surface)', border: '0.5px solid var(--border)', borderRadius: '12px', padding: '52px 24px', textAlign: 'center' }}>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '28px', color: 'var(--muted)', marginBottom: '10px', letterSpacing: '1px' }}>No Historical Data</div>
          <div style={{ fontSize: '13px', color: 'var(--muted)', maxWidth: '380px', margin: '0 auto', lineHeight: 1.65 }}>{noAppNote ?? 'No prior appearances at this circuit'}</div>
        </div>
      ) : (
        <div
          className="ff-team-row"
          style={{ '--tc': dTeam?.teamColor ?? '#E8002D', background: 'var(--surface)', border: '0.5px solid var(--border)', borderRadius: '12px', overflow: 'hidden' } as React.CSSProperties}
        >
          {/* Header */}
          <div style={{ padding: '20px 24px 16px', borderBottom: '0.5px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {dFlag && <Flag code={dFlag} size="1.6em" />}
                  <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '36px', color: 'var(--text)', lineHeight: 1, letterSpacing: '0.5px' }}>{driver}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px' }}>
                  {circuitFlag && <Flag code={circuitFlag} />}
                  <span style={{ fontSize: '12px', color: 'var(--muted)' }}>{circuitDisplayName}</span>
                  {dTeam && (
                    <>
                      <span style={{ color: 'var(--muted)' }}>·</span>
                      <i className="ff-team-tl" style={{ width: '3px', height: '12px', borderRadius: '2px', background: dTeam.teamColor, display: 'inline-block' }} />
                      <span style={{ fontSize: '12px', color: 'var(--muted)' }}>{dTeam.team}</span>
                    </>
                  )}
                </div>
              </div>
              <span style={{
                fontSize: '11px', fontWeight: 600, padding: '5px 14px', borderRadius: '20px',
                background: 'rgba(232,0,45,0.1)', border: '1px solid rgba(232,0,45,0.2)', color: '#E8002D',
                whiteSpace: 'nowrap', fontFamily: "'JetBrains Mono', monospace", flexShrink: 0,
              }}>{stats!.years}</span>
            </div>
          </div>

          <div style={{ padding: '16px 20px 20px' }}>
            {/* Primary stats — 4 columns */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '8px' }}>
              <div style={{ background: 'var(--surface2)', borderRadius: '10px', padding: '14px 8px', textAlign: 'center' }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '26px', fontWeight: 700, color: 'var(--text)', lineHeight: 1 }}>{starts}</div>
                <div style={{ fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)', marginTop: '7px', marginBottom: '3px' }}>Starts</div>
                <div style={{ fontSize: '10px', color: '#8A9AB0' }}>Grand Prix entries</div>
              </div>
              <div style={{ background: 'var(--surface2)', borderRadius: '10px', padding: '14px 8px', textAlign: 'center' }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '26px', fontWeight: 700, color: wins > 0 ? '#00C851' : 'var(--text)', lineHeight: 1 }}>{wins}</div>
                <div style={{ fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)', marginTop: '7px', marginBottom: '3px' }}>Wins</div>
                <div style={{ fontSize: '10px', color: '#8A9AB0' }}>{winRate}% win rate</div>
              </div>
              <div style={{ background: 'var(--surface2)', borderRadius: '10px', padding: '14px 8px', textAlign: 'center' }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '26px', fontWeight: 700, color: podiums > 0 ? '#FFD700' : 'var(--text)', lineHeight: 1 }}>{podiums}</div>
                <div style={{ fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)', marginTop: '7px', marginBottom: '3px' }}>Podiums</div>
                <div style={{ fontSize: '10px', color: '#8A9AB0' }}>{podiumRate}% podium rate</div>
              </div>
              <div style={{ background: 'var(--surface2)', borderRadius: '10px', padding: '14px 8px', textAlign: 'center' }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '26px', fontWeight: 700, color: dnfColor, lineHeight: 1 }}>{dnfPct.toFixed(1)}%</div>
                <div style={{ fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)', marginTop: '7px', marginBottom: '3px' }}>DNF %</div>
                <div style={{ fontSize: '10px', color: '#8A9AB0' }}>{retirements} retirement{retirements !== 1 ? 's' : ''}</div>
              </div>
            </div>

            {/* Secondary stats — 5 columns */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px', marginBottom: '20px' }}>
              {[
                { label: 'Avg Grid', val: fmtStat(stats!.avgGrid), color: undefined as string | undefined },
                { label: 'Avg Finish', val: fmtStat(stats!.avgFinish), color: undefined },
                { label: 'Median Grid', val: fmtStat(stats!.medianGrid), color: undefined },
                { label: 'Median Finish', val: fmtStat(stats!.medianFinish), color: undefined },
                { label: 'Best Finish', val: fmtBestFinish(stats!.bestFinish), color: bestFinishColor(stats!.bestFinish) },
              ].map(({ label, val, color }) => (
                <div key={label} style={{ background: 'var(--surface2)', borderRadius: '8px', padding: '10px 6px', textAlign: 'center' }}>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '16px', fontWeight: 700, color: color ?? 'var(--text)', lineHeight: 1 }}>{val}</div>
                  <div style={{ fontSize: '9px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.8px', color: 'var(--muted)', marginTop: '6px' }}>{label}</div>
                </div>
              ))}
            </div>

            {/* Year-by-year table */}
            {yearRows.length > 0 && (
              <div>
                <div style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--muted)', marginBottom: '10px' }}>Season by Season</div>
                <div style={{ border: '0.5px solid var(--border)', borderRadius: '8px', overflow: 'hidden' }}>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '360px' }}>
                      <thead>
                        <tr style={{ background: '#131A21', borderBottom: '0.5px solid var(--border)' }}>
                          {[
                            { label: 'Season', align: 'left' as const },
                            { label: 'Grid', align: 'center' as const },
                            { label: 'Finish', align: 'center' as const },
                            { label: 'Team', align: 'left' as const },
                          ].map(h => (
                            <th key={h.label} style={{ padding: '8px 14px', fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.2px', color: 'var(--muted)', textAlign: h.align, whiteSpace: 'nowrap' }}>{h.label}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {yearRows.map((row, idx) => {
                          const tc = histCol(row.team)
                          return (
                            <tr key={idx} className="ff-team-row" style={{ '--tc': tc, borderBottom: idx < yearRows.length - 1 ? '0.5px solid var(--border)' : 'none' } as React.CSSProperties}>
                              <td style={{ padding: '9px 14px', fontFamily: "'JetBrains Mono', monospace", fontSize: '13px', color: 'var(--text)', fontWeight: 600 }}>
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                                  <i className="ff-team-tl" style={{ width: '3px', height: '16px', borderRadius: '2px', background: tc, display: 'inline-block' }} />
                                  {row.year}
                                </span>
                              </td>
                              <td style={{ padding: '9px 14px', textAlign: 'center', fontFamily: "'JetBrains Mono', monospace", fontSize: '13px', color: 'var(--muted)' }}>{gridDisplay(row.grid)}</td>
                              <td style={{ padding: '9px 14px', textAlign: 'center', fontFamily: "'JetBrains Mono', monospace", fontSize: '13px', color: finishColor(row.finish), fontWeight: parseInt(row.finish, 10) === 1 ? 700 : 400 }}>{finishDisplay(row.finish)}</td>
                              <td style={{ padding: '9px 14px' }}>
                                <span style={{ display: 'inline-block', fontSize: '11px', fontWeight: 500, padding: '2px 10px', borderRadius: '4px', background: 'var(--surface3)', color: 'var(--muted)', whiteSpace: 'nowrap' }}>{row.team}</span>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
