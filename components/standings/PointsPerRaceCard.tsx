'use client'
import { useState } from 'react'
import Flag from '@/components/ui/Flag'
import CardHeader from '@/components/ui/CardHeader'
import { PillToggle } from '@/components/racehub/shared'
import { cardStyle, monoFont } from './shared'
import type { PprRow, PprRoundHeader } from './data'

const PODIUM_COLOR = ['rgba(255,215,0,.18)', 'rgba(192,192,192,.14)', 'rgba(205,127,50,.16)']
const PODIUM_TEXT = ['#FFD700', '#C0C0C0', '#CD7F32']

export default function PointsPerRaceCard({
  driverPpr, constructorPpr, rounds, driverPodiumsByRound, constructorPodiumsByRound,
}: {
  driverPpr: PprRow[]
  constructorPpr: PprRow[]
  rounds: PprRoundHeader[]
  driverPodiumsByRound: Record<number, string[]>
  constructorPodiumsByRound: Record<number, string[]>
}) {
  const [view, setView] = useState<'drivers' | 'constructors'>('drivers')
  const rows = view === 'drivers' ? driverPpr : constructorPpr
  const podiumMap = view === 'drivers' ? driverPodiumsByRound : constructorPodiumsByRound

  function cellStyle(round: number, name: string): React.CSSProperties {
    const podium = podiumMap[round] ?? []
    const idx = podium.indexOf(name)
    if (idx < 0 || idx > 2) return {}
    return { background: PODIUM_COLOR[idx], color: PODIUM_TEXT[idx], fontWeight: 700 }
  }

  return (
    <div style={cardStyle}>
      <style dangerouslySetInnerHTML={{ __html: `
        .ppr-nm { position: sticky; left: 0; z-index: 1; }
      ` }} />
      <CardHeader
        title="Points Per Race"
        right={<PillToggle options={[{ id: 'drivers', label: 'Drivers' }, { id: 'constructors', label: 'Constructors' }]} value={view} onChange={v => setView(v as typeof view)} />}
      />
      <div style={{ overflowX: 'auto' }}>
        <table style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr style={{ background: '#131A21', borderBottom: '1px solid var(--border)' }}>
              <th style={{ padding: '8px', fontSize: '10px', color: 'var(--muted)', textAlign: 'center' }}>#</th>
              <th className="ppr-nm" style={{ padding: '8px', fontSize: '10px', color: 'var(--muted)', textAlign: 'left', background: 'var(--surface)' }}>{view === 'drivers' ? 'Driver' : 'Constructor'}</th>
              {rounds.map(r => (
                <th key={r.round} title={r.name} style={{ padding: '8px', textAlign: 'center' }}><Flag code={r.flag} size={14} /></th>
              ))}
              <th style={{ padding: '8px', textAlign: 'center', color: '#FFB800', fontSize: '10px' }}>Total</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={row.name} className="st-team-row" style={{ '--tc': row.teamColor } as React.CSSProperties}>
                <td style={{ padding: '7px 8px', textAlign: 'center', fontFamily: monoFont, fontSize: '12px', color: 'var(--muted)' }}>{i + 1}</td>
                <td className="ppr-nm st-team-row" style={{ '--tc': row.teamColor, padding: '7px 8px', background: `linear-gradient(90deg, color-mix(in srgb, ${row.teamColor} 14%, var(--surface)), var(--surface))` } as React.CSSProperties}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <i style={{ width: '3px', height: '16px', borderRadius: '2px', flexShrink: 0, background: row.teamColor }} />
                    {row.flag && <Flag code={row.flag} size={14} />}
                    <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: '12px', whiteSpace: 'nowrap' }}>{row.displayName}</span>
                  </div>
                </td>
                {rounds.map(r => {
                  const pts = row.pointsByRound[r.round]
                  return (
                    <td key={r.round} style={{ padding: '7px 8px', textAlign: 'center', fontFamily: monoFont, fontSize: '12px', fontWeight: 500, color: pts ? 'var(--text)' : 'var(--muted2)', ...cellStyle(r.round, row.name) }}>
                      {pts ?? '—'}
                    </td>
                  )
                })}
                <td style={{ padding: '7px 8px', textAlign: 'center', fontFamily: monoFont, fontSize: '12px', fontWeight: 700, color: '#FFB800' }}>{row.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p style={{ fontSize: '11px', color: 'var(--muted)', padding: '12px 20px' }}>
        Race points (25–18–15–12–10–8–6–4–2–1) + sprint points (8–7–6–5–4–3–2–1) where applicable. Gold/silver/bronze highlight = Grand Prix podium finisher.
      </p>
    </div>
  )
}
