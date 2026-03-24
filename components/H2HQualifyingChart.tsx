'use client'

import { teams2026, qualifyingSessions } from '@/lib/raceResults'

const SCALE = 1.5 // seconds — x-axis range: -1.5s to +1.5s

function parseTime(t: string): number {
  const parts = t.split(':')
  if (parts.length === 2) return parseInt(parts[0], 10) * 60 + parseFloat(parts[1])
  return parseFloat(t)
}

function driverAbbr(name: string): string {
  const parts = name.trim().split(' ')
  return parts[parts.length - 1].substring(0, 3).toUpperCase()
}

export default function H2HQualifyingChart() {
  const teamStats = teams2026.map(team => {
    const [d1, d2] = team.drivers

    // Collect gaps (d1_time - d2_time) per session. Negative = d1 faster.
    const gaps: { gap: number; sessionType: 'Q' | 'SQ' }[] = []
    for (const session of qualifyingSessions) {
      const e1 = session.entries.find(e => e.driver === d1)
      const e2 = session.entries.find(e => e.driver === d2)
      if (!e1 || !e2) continue
      const gap = parseTime(e1.time) - parseTime(e2.time)
      gaps.push({ gap, sessionType: session.sessionType })
    }

    const d1Wins = gaps.filter(g => g.gap < 0).length
    const d2Wins = gaps.filter(g => g.gap > 0).length
    const d1Leads = d1Wins >= d2Wins

    const leadingDriver  = d1Leads ? d1 : d2
    const trailingDriver = d1Leads ? d2 : d1
    const leadingWins    = d1Leads ? d1Wins : d2Wins
    const trailingWins   = d1Leads ? d2Wins : d1Wins

    // Normalize so leading driver's faster = negative gap
    const normalizedGaps = gaps.map(g => ({
      gap: d1Leads ? g.gap : -g.gap,
      sessionType: g.sessionType,
    }))

    const avgGap =
      normalizedGaps.length > 0
        ? normalizedGaps.reduce((s, g) => s + g.gap, 0) / normalizedGaps.length
        : 0

    return { team: team.team, colour: team.colour, leadingDriver, trailingDriver, leadingWins, trailingWins, avgGap, normalizedGaps }
  })

  const card   = { background: '#0E1318', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', overflow: 'hidden' as const }
  const header = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px 12px', borderBottom: '1px solid rgba(255,255,255,0.07)', flexWrap: 'wrap' as const, gap: '10px' }

  return (
    <div style={card}>
      <style>{`
        @media (max-width: 560px) {
          .h2h-sidebar { width: 52px !important; }
          .h2h-name    { font-size: 11px !important; }
        }
      `}</style>

      <div style={header}>
        <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '22px', letterSpacing: '1.5px', color: '#F0F4F8' }}>
          Teammate Qualifying Gaps
        </span>
        {/* Legend */}
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#5A6A7A', fontFamily: 'DM Sans, sans-serif' }}>
            <svg width="18" height="18" style={{ flexShrink: 0 }}>
              <circle cx="9" cy="9" r="8" fill="rgba(255,255,255,0.25)" />
            </svg>
            Standard Q
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#5A6A7A', fontFamily: 'DM Sans, sans-serif' }}>
            <svg width="14" height="14" style={{ flexShrink: 0 }}>
              <circle cx="7" cy="7" r="6" fill="rgba(255,255,255,0.18)" />
            </svg>
            Sprint SQ
          </span>
          <span style={{ fontSize: '11px', color: '#5A6A7A', fontFamily: 'DM Sans, sans-serif' }}>
            ← left of zero = faster
          </span>
        </div>
      </div>

      <div>
        {teamStats.map((stat, idx) => {
          const leadAbbr  = driverAbbr(stat.leadingDriver)
          const trailAbbr = driverAbbr(stat.trailingDriver)
          const avgDisplay = Math.abs(stat.avgGap).toFixed(3)
          const isLast = idx === teamStats.length - 1

          return (
            <div
              key={stat.team}
              style={{
                display: 'grid',
                gridTemplateColumns: '68px 1fr 68px',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 16px',
                background: `${stat.colour}0F`,
                borderBottom: isLast ? 'none' : '1px solid rgba(255,255,255,0.04)',
              }}
            >
              {/* Left — leading driver */}
              <div className="h2h-sidebar" style={{ width: '68px', textAlign: 'right' as const }}>
                <div className="h2h-name" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', fontWeight: 700, color: '#F0F4F8', letterSpacing: '0.5px' }}>{leadAbbr}</div>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', fontWeight: 700, color: '#F0F4F8' }}>{stat.leadingWins}W</div>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#00D47E' }}>
                  {stat.avgGap <= 0 ? '-' : '+'}{avgDisplay}s
                </div>
              </div>

              {/* Bar */}
              <div style={{ position: 'relative' as const, height: '44px' }}>
                {/* Track background */}
                <div style={{ position: 'absolute' as const, top: '50%', left: 0, right: 0, height: '2px', background: 'rgba(255,255,255,0.08)', transform: 'translateY(-50%)' }} />
                {/* Zero line */}
                <div style={{ position: 'absolute' as const, top: '20%', bottom: '20%', left: '50%', width: '1px', background: 'rgba(255,255,255,0.3)', transform: 'translateX(-50%)' }} />

                {/* Dots */}
                {stat.normalizedGaps.map((g, i) => {
                  const clampedGap = Math.max(-SCALE, Math.min(SCALE, g.gap))
                  const xPct = (clampedGap + SCALE) / (SCALE * 2) * 100
                  const clamped = Math.abs(g.gap) > SCALE
                  const isQ = g.sessionType === 'Q'
                  const r = isQ ? 8 : 6
                  const opacity = isQ ? 1 : 0.6

                  return (
                    <div key={i} title={`${g.gap >= 0 ? '+' : ''}${g.gap.toFixed(3)}s`}>
                      <div
                        style={{
                          position: 'absolute' as const,
                          top: '50%',
                          left: `${xPct}%`,
                          transform: 'translate(-50%, -50%)',
                          width: `${r * 2}px`,
                          height: `${r * 2}px`,
                          borderRadius: '50%',
                          background: stat.colour,
                          opacity,
                          zIndex: 2,
                          flexShrink: 0,
                        }}
                      />
                      {/* Arrow for clamped dot */}
                      {clamped && (
                        <div style={{
                          position: 'absolute' as const,
                          top: '50%',
                          left: g.gap < -SCALE ? '4px' : undefined,
                          right: g.gap > SCALE ? '4px' : undefined,
                          transform: 'translateY(-50%)',
                          fontSize: '10px',
                          color: stat.colour,
                          opacity: 0.8,
                          lineHeight: 1,
                        }}>
                          {g.gap < -SCALE ? '◀' : '▶'}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>

              {/* Right — trailing driver */}
              <div className="h2h-sidebar" style={{ width: '68px', textAlign: 'left' as const }}>
                <div className="h2h-name" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', fontWeight: 700, color: '#5A6A7A', letterSpacing: '0.5px' }}>{trailAbbr}</div>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', fontWeight: 700, color: '#5A6A7A' }}>{stat.trailingWins}W</div>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#E8002D' }}>
                  +{avgDisplay}s
                </div>
              </div>
            </div>
          )
        })}

        {/* X-axis labels */}
        <div style={{ display: 'grid', gridTemplateColumns: '68px 1fr 68px', gap: '8px', padding: '4px 16px 12px' }}>
          <div />
          <div style={{ display: 'flex', justifyContent: 'space-between', paddingLeft: '2px', paddingRight: '2px' }}>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#5A6A7A' }}>-1.5s</span>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#5A6A7A' }}>0</span>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#5A6A7A' }}>+1.5s</span>
          </div>
          <div />
        </div>
      </div>
    </div>
  )
}
