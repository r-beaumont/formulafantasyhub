import { circuitOverviewData, TRACK_SPEEDS, CIRCUIT_DESCRIPTIONS } from '@/lib/circuitOverview'
import { cardStyle, cardHeaderStyle, Flag, monoFont, riskColors } from '@/components/home/shared'
import { rhCardTitleStyle } from './shared'
import CircuitMap from './CircuitMap'
import { teamRowStyleTag, WINNER_DISPLAY_MAP, winnerFlag } from './shared'

type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'TBC'

function dnfRiskLevel(avg: number | null): RiskLevel | null {
  if (avg === null) return null
  if (avg >= 3.0) return 'HIGH'
  if (avg >= 1.5) return 'MEDIUM'
  return 'LOW'
}

const dnfRiskDesc: Record<RiskLevel, string> = {
  HIGH: 'High DNF risk historically',
  MEDIUM: 'Moderate DNF risk historically',
  LOW: 'Low DNF risk historically',
  TBC: 'No data yet — debut race',
}

const gridImportanceDesc: Record<RiskLevel, string> = {
  HIGH: 'Qualifying position critical',
  MEDIUM: 'Passing possible but grid position remains important',
  LOW: 'Overtaking-friendly circuit',
  TBC: 'No data yet — debut race',
}

function IndicatorRow({ level, kicker, desc }: { level: RiskLevel; kicker: string; desc: string }) {
  const c = riskColors(level)
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 14px', borderRadius: '10px', background: c.bg, width: '100%' }}>
      <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--muted)', flexShrink: 0 }}>{kicker}</span>
      <span style={{ fontFamily: monoFont, fontSize: '13px', fontWeight: 700, letterSpacing: '1px', color: c.color, flexShrink: 0 }}>{level}</span>
      <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', color: '#8A9AB0' }}>{desc}</span>
    </div>
  )
}

function YearBars({ values, accent }: { values: (number | null)[]; accent: string }) {
  const max = Math.max(...values.filter((v): v is number => v !== null), 1)
  const years = ['2023', '2024', '2025']
  return (
    <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-end', height: '150px', width: '100%', maxWidth: '520px', margin: '0 auto' }}>
      {years.map((year, i) => {
        const v = values[i]
        return (
          <div key={year} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px', height: '100%' }}>
            <div style={{ flex: 1, width: '100%', maxWidth: '62px', background: 'var(--surface2)', borderRadius: '8px', display: 'flex', alignItems: 'flex-end', overflow: 'hidden' }}>
              <div style={{
                width: '100%', borderRadius: '8px',
                background: `linear-gradient(180deg, ${accent}, color-mix(in srgb, ${accent} 55%, transparent))`,
                transformOrigin: 'bottom', animation: `rh-grow .8s cubic-bezier(.3,.8,.2,1) both`, animationDelay: `${i * 90}ms`,
                height: v === null ? '0%' : `${Math.max(6, (v / max) * 100)}%`,
              }} />
            </div>
            <b style={{ fontFamily: monoFont, fontWeight: 700, fontSize: '14px' }}>{v ?? '—'}</b>
            <span style={{ fontSize: '11px', color: 'var(--muted)' }}>{year}</span>
          </div>
        )
      })}
    </div>
  )
}

export default function OverviewTab({ round }: { round: number }) {
  const overview = circuitOverviewData[round]

  if (!overview) {
    return (
      <div style={{ ...cardStyle, padding: '40px', textAlign: 'center' }}>
        <div style={{ fontSize: '14px', color: 'var(--muted)' }}>Overview data coming soon for this circuit.</div>
      </div>
    )
  }

  const winnerAbbrev: string | null = overview.lastWinner ?? null
  const winnerDisplay = winnerAbbrev ? (WINNER_DISPLAY_MAP[winnerAbbrev] ?? winnerAbbrev) : null
  const flag = winnerFlag(winnerAbbrev)
  const trackSpeed = TRACK_SPEEDS[round] ?? '—'
  const circuitDescription = CIRCUIT_DESCRIPTIONS[round] ?? ''

  const gridImportance: RiskLevel = overview.gridImportance ?? 'TBC'
  const giColor = riskColors(gridImportance).color

  const dnfAvg: number | null = typeof overview.dnfHistory.avg === 'number' ? overview.dnfHistory.avg : null
  const dnfRisk = dnfRiskLevel(dnfAvg)
  const dnfColor = riskColors(dnfRisk ?? 'TBC').color

  const overtakes = [overview.overtakes2023, overview.overtakes2024, overview.overtakes2025] as (number | null)[]
  const dnfs = [overview.dnfHistory.y2023, overview.dnfHistory.y2024, overview.dnfHistory.y2025] as (number | null)[]
  const hasOvertakeData = overtakes.some(v => v !== null)
  const hasDnfData = dnfs.some(v => v !== null)

  return (
    <div className="mob-1col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes rh-grow { from { transform: scaleY(0); } to { transform: scaleY(1); } }
        ${teamRowStyleTag}
      ` }} />

      {/* CIRCUIT SNAPSHOT */}
      <div style={cardStyle}>
        <div style={cardHeaderStyle}><span style={rhCardTitleStyle}>Circuit Snapshot</span></div>
        <CircuitMap key={round} round={round} />
        <div style={{ padding: '0 20px 20px' }}>
          {winnerDisplay && (
            <div className="rh-team-row" style={{ '--tc': '#E8002D', background: 'var(--surface2)', borderRadius: '10px', padding: '12px 16px', marginBottom: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' } as React.CSSProperties}>
              <span style={{ fontSize: '11px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--muted)' }}>2025 Winner</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 600, color: 'var(--text)' }}>
                {flag && <Flag code={flag} size={14} />}
                {winnerDisplay}
              </span>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '20px' }}>
            {[
              { label: 'Total GPs', value: overview.totalGPs === 0 ? '—' : String(overview.totalGPs) },
              { label: 'First GP', value: String(overview.firstGP) },
              { label: 'Circuit Length', value: overview.circuitLength },
              { label: 'Track Speed', value: trackSpeed },
            ].map(stat => (
              <div key={stat.label} style={{ background: 'var(--surface2)', borderRadius: '10px', padding: '16px 12px', textAlign: 'center' }}>
                <div style={{ fontWeight: 700, fontSize: '22px', color: 'var(--text)', lineHeight: 1 }}>{stat.value}</div>
                <div style={{ fontSize: '11px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--muted)', marginTop: '6px' }}>{stat.label}</div>
              </div>
            ))}
          </div>

          <div style={{ fontSize: '11px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--muted)', marginBottom: '10px' }}>Circuit Background</div>
          {circuitDescription && <p style={{ fontSize: '13px', color: '#8A9BB0', lineHeight: 1.6, margin: '0 0 24px' }}>{circuitDescription}</p>}

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '24px' }}>
            <div style={{ fontSize: '11px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--muted)', marginBottom: '12px' }}>Circuit Records</div>
            {overview.isDebut ? (
              <div style={{ border: '1px solid rgba(232,0,45,0.3)', borderRadius: '10px', background: 'rgba(232,0,45,0.07)', padding: '20px' }}>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '16px', letterSpacing: '1px', color: '#E8002D', marginBottom: '10px' }}>Debut Race 2026</div>
                <p style={{ fontSize: '13px', color: '#8A9AB0', lineHeight: 1.7, margin: 0 }}>{overview.debutMessage}</p>
              </div>
            ) : (
              <div>
                {[
                  { label: 'Most Race Wins (Driver)', value: overview.mostWinsDriver, count: overview.mostWinsDriverCount },
                  { label: 'Most Race Wins (Constructor)', value: overview.mostWinsConstructor, count: overview.mostWinsConstructorCount },
                  { label: 'Most Pole Positions (Driver)', value: overview.mostPolesDriver, count: overview.mostPolesDriverCount },
                  { label: 'Most Pole Positions (Constructor)', value: overview.mostPolesConstructor, count: overview.mostPolesConstructorCount },
                ].map((row, i, arr) => (
                  <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '11px 0', borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none', gap: '10px' }}>
                    <div style={{ fontSize: '13px', color: '#8A9BB0', lineHeight: 1.4 }}>{row.label}</div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)' }}>{row.value ?? '—'}</div>
                      {row.count != null && <div style={{ fontFamily: monoFont, fontSize: '12px', color: '#E8002D', marginTop: '2px' }}>{row.count}×</div>}
                    </div>
                  </div>
                ))}
                {overview.circuitNote && <div style={{ marginTop: '12px', fontSize: '11px', color: 'var(--muted)', fontStyle: 'italic' }}>{overview.circuitNote}</div>}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* RACING PROFILE */}
      <div style={cardStyle}>
        <div style={cardHeaderStyle}><span style={rhCardTitleStyle}>Racing Profile</span></div>
        <div style={{ padding: '20px' }}>
          <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '14px' }}>Overtaking</div>
          {!hasOvertakeData ? (
            <div style={{ textAlign: 'center', color: 'var(--muted)', fontSize: '13px', padding: '8px 0 16px' }}>No historical data — debut circuit</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '14px', marginBottom: '20px' }}>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '76px', lineHeight: 0.85, color: giColor }}>{overview.avgOvertakes ?? '—'}</div>
              <YearBars values={overtakes} accent={giColor} />
              <span style={{ fontSize: '13px', color: '#8A9AB0' }}>Average overtakes per race ({overview.overtakeSeasonsLabel ?? '2023–2025'})</span>
              <IndicatorRow level={gridImportance} kicker="Grid Importance" desc={gridImportanceDesc[gridImportance]} />
            </div>
          )}

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '24px' }}>
            <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '14px' }}>DNF History (Incl. DSQs)</div>
            {!hasDnfData ? (
              <div style={{ textAlign: 'center', color: 'var(--muted)', fontSize: '13px', padding: '8px 0' }}>No historical data — debut circuit</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '14px' }}>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '76px', lineHeight: 0.85, color: dnfColor }}>{dnfAvg !== null ? dnfAvg.toFixed(2) : '—'}</div>
                <YearBars values={dnfs} accent={dnfColor} />
                <span style={{ fontSize: '13px', color: '#8A9BB0' }}>Average DNFs per race (2023–2025)</span>
                {dnfRisk ? (
                  <IndicatorRow level={dnfRisk} kicker="DNF Risk" desc={dnfRiskDesc[dnfRisk]} />
                ) : (
                  <IndicatorRow level="TBC" kicker="DNF Risk" desc={dnfRiskDesc.TBC} />
                )}
                <p style={{ fontSize: '11px', color: 'var(--muted2)', lineHeight: 1.6, margin: 0 }}>
                  <span style={{ color: '#00C851' }}>Low</span> &lt; 1.5 DNFs &nbsp;·&nbsp; <span style={{ color: '#FF8700' }}>Medium</span> 1.5–3.0 DNFs &nbsp;·&nbsp; <span style={{ color: '#E8002D' }}>High</span> &gt;3.0 DNFs
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
