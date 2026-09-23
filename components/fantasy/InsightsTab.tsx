'use client'
import dynamic from 'next/dynamic'
import React, { useState } from 'react'
import { Flag, RiskBadge, monoFont } from '@/components/home/shared'
import { PillToggle } from '@/components/racehub/shared'
import { cardStyle } from './shared'

// The driver-history dataset (src/data/driverHistoryData.ts) is ~550KB —
// loaded only when this sub-tab is actually opened, kept out of the initial
// page bundle entirely.
const DriverHistoryPanel = dynamic(() => import('./DriverHistoryPanel'), {
  loading: () => <div style={{ padding: '60px 0', textAlign: 'center', color: 'var(--muted)', fontSize: '13px' }}>Loading driver history…</div>,
  ssr: false,
})

type SortDir = 'asc' | 'desc'
type SortCol = 'circuit' | '2023' | '2024' | '2025' | 'avg' | 'badge'

interface CircuitRow {
  circuit: string
  flag: string
  y2023: number | null
  y2024: number | null
  y2025: number | null
}

const overtakesData: CircuitRow[] = [
  { circuit: 'Australia', flag: 'au', y2023: 74, y2024: 35, y2025: 45 },
  { circuit: 'China', flag: 'cn', y2023: null, y2024: 102, y2025: 72 },
  { circuit: 'Japan', flag: 'jp', y2023: 81, y2024: 85, y2025: 28 },
  { circuit: 'Miami', flag: 'us', y2023: 94, y2024: 93, y2025: 80 },
  { circuit: 'Canada', flag: 'ca', y2023: 46, y2024: 83, y2025: 75 },
  { circuit: 'Monaco', flag: 'mc', y2023: 36, y2024: 17, y2025: 4 },
  { circuit: 'Spain', flag: 'es', y2023: 107, y2024: 86, y2025: 78 },
  { circuit: 'Austria', flag: 'at', y2023: 105, y2024: 85, y2025: 81 },
  { circuit: 'Britain', flag: 'gb', y2023: 50, y2024: 55, y2025: 58 },
  { circuit: 'Belgium', flag: 'be', y2023: 95, y2024: 58, y2025: 49 },
  { circuit: 'Hungary', flag: 'hu', y2023: 51, y2024: 65, y2025: 69 },
  { circuit: 'Netherlands', flag: 'nl', y2023: 240, y2024: 73, y2025: 70 },
  { circuit: 'Italy', flag: 'it', y2023: 49, y2024: 71, y2025: 47 },
  { circuit: 'Madrid', flag: 'es', y2023: null, y2024: null, y2025: null },
  { circuit: 'Azerbaijan', flag: 'az', y2023: 50, y2024: 66, y2025: 55 },
  { circuit: 'Singapore', flag: 'sg', y2023: 85, y2024: 62, y2025: 58 },
  { circuit: 'United States', flag: 'us', y2023: 78, y2024: 86, y2025: 71 },
  { circuit: 'Mexico', flag: 'mx', y2023: 121, y2024: 87, y2025: 97 },
  { circuit: 'Brazil', flag: 'br', y2023: 69, y2024: 70, y2025: 96 },
  { circuit: 'Las Vegas', flag: 'us', y2023: 181, y2024: 109, y2025: 34 },
  { circuit: 'Qatar', flag: 'qa', y2023: 108, y2024: 81, y2025: 41 },
  { circuit: 'Abu Dhabi', flag: 'ae', y2023: 113, y2024: 96, y2025: 125 },
]

const dnfData: CircuitRow[] = [
  { circuit: 'Australia', flag: 'au', y2023: 3, y2024: 2, y2025: 6 },
  { circuit: 'China', flag: 'cn', y2023: null, y2024: 3, y2025: 4 },
  { circuit: 'Japan', flag: 'jp', y2023: 5, y2024: 3, y2025: 0 },
  { circuit: 'Miami', flag: 'us', y2023: 0, y2024: 1, y2025: 5 },
  { circuit: 'Canada', flag: 'ca', y2023: 2, y2024: 5, y2025: 2 },
  { circuit: 'Monaco', flag: 'mc', y2023: 2, y2024: 4, y2025: 0 },
  { circuit: 'Spain', flag: 'es', y2023: 0, y2024: 0, y2025: 3 },
  { circuit: 'Austria', flag: 'at', y2023: 1, y2024: 0, y2025: 4 },
  { circuit: 'Britain', flag: 'gb', y2023: 2, y2024: 2, y2025: 5 },
  { circuit: 'Belgium', flag: 'be', y2023: 2, y2024: 2, y2025: 0 },
  { circuit: 'Hungary', flag: 'hu', y2023: 2, y2024: 1, y2025: 1 },
  { circuit: 'Netherlands', flag: 'nl', y2023: 3, y2024: 0, y2025: 2 },
  { circuit: 'Italy', flag: 'it', y2023: 2, y2024: 1, y2025: 2 },
  { circuit: 'Madrid', flag: 'es', y2023: null, y2024: null, y2025: null },
  { circuit: 'Azerbaijan', flag: 'az', y2023: 2, y2024: 1, y2025: 1 },
  { circuit: 'Singapore', flag: 'sg', y2023: 3, y2024: 1, y2025: 0 },
  { circuit: 'United States', flag: 'us', y2023: 5, y2024: 1, y2025: 1 },
  { circuit: 'Mexico', flag: 'mx', y2023: 3, y2024: 3, y2025: 3 },
  { circuit: 'Brazil', flag: 'br', y2023: 6, y2024: 5, y2025: 3 },
  { circuit: 'Las Vegas', flag: 'us', y2023: 1, y2024: 2, y2025: 5 },
  { circuit: 'Qatar', flag: 'qa', y2023: 3, y2024: 5, y2025: 2 },
  { circuit: 'Abu Dhabi', flag: 'ae', y2023: 0, y2024: 3, y2025: 0 },
]

const rainRisk: Record<string, 'HIGH' | 'MEDIUM' | 'LOW'> = {
  Australia: 'MEDIUM', China: 'MEDIUM', Japan: 'MEDIUM', Miami: 'HIGH', Canada: 'HIGH', Monaco: 'MEDIUM',
  Spain: 'LOW', Austria: 'MEDIUM', Britain: 'HIGH', Belgium: 'HIGH', Hungary: 'MEDIUM', Netherlands: 'HIGH',
  Italy: 'MEDIUM', Madrid: 'LOW', Azerbaijan: 'MEDIUM', Singapore: 'HIGH', 'United States': 'LOW',
  Mexico: 'LOW', Brazil: 'HIGH', 'Las Vegas': 'LOW', Qatar: 'LOW', 'Abu Dhabi': 'LOW',
}

const otDifficulty: Record<string, 'HIGH' | 'MEDIUM' | 'LOW'> = {
  Australia: 'MEDIUM', China: 'LOW', Japan: 'HIGH', Miami: 'LOW', Canada: 'MEDIUM', Monaco: 'HIGH',
  Spain: 'LOW', Austria: 'LOW', Britain: 'MEDIUM', Belgium: 'MEDIUM', Hungary: 'HIGH', Netherlands: 'HIGH',
  Italy: 'MEDIUM', Madrid: 'MEDIUM', Azerbaijan: 'MEDIUM', Singapore: 'HIGH', 'United States': 'LOW',
  Mexico: 'LOW', Brazil: 'LOW', 'Las Vegas': 'LOW', Qatar: 'MEDIUM', 'Abu Dhabi': 'LOW',
}

function calcAvg(row: CircuitRow): number | null {
  const vals = [row.y2023, row.y2024, row.y2025].filter((v): v is number => v !== null)
  if (vals.length === 0) return null
  return vals.reduce((a, b) => a + b, 0) / vals.length
}

const chartIcon = (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />
  </svg>
)

export default function InsightsTab() {
  const [view, setView] = useState<'driver-history' | 'overtakes' | 'dnf'>('driver-history')
  const [sortCol, setSortCol] = useState<SortCol>('avg')
  const [sortDir, setSortDir] = useState<SortDir>('desc')

  const data = view === 'dnf' ? dnfData : overtakesData
  const withAvg = data.map(row => ({ ...row, avg: calcAvg(row) }))

  const numericAvgs = withAvg.map(r => r.avg).filter((v): v is number => v !== null).sort((a, b) => a - b)
  const q25 = numericAvgs[Math.floor(numericAvgs.length * 0.75)] ?? 0
  const q65 = numericAvgs[Math.floor(numericAvgs.length * 0.35)] ?? 0

  function avgColor(avg: number | null): string {
    if (avg === null) return 'var(--muted)'
    if (view === 'overtakes') {
      if (avg >= q25) return '#F07070'
      if (avg <= q65) return '#70C090'
      return '#FF8700'
    }
    if (avg >= 3.0) return '#F07070'
    if (avg >= 1.5) return '#FF8700'
    return '#70C090'
  }

  function handleSort(col: SortCol) {
    if (col === sortCol) {
      setSortDir(d => (d === 'desc' ? 'asc' : 'desc'))
    } else {
      setSortCol(col)
      setSortDir(col === 'circuit' ? 'asc' : 'desc')
    }
  }

  const badgeRank: Record<string, number> = { LOW: 1, MEDIUM: 2, HIGH: 3 }

  const sorted = [...withAvg].sort((a, b) => {
    const dir = sortDir === 'desc' ? -1 : 1
    if (sortCol === 'circuit') return dir * a.circuit.localeCompare(b.circuit)
    if (sortCol === 'badge') {
      const map = view === 'overtakes' ? otDifficulty : rainRisk
      return dir * ((badgeRank[map[a.circuit] ?? ''] ?? 0) - (badgeRank[map[b.circuit] ?? ''] ?? 0))
    }
    const va = sortCol === 'avg' ? a.avg : (a[`y${sortCol}` as keyof typeof a] as number | null)
    const vb = sortCol === 'avg' ? b.avg : (b[`y${sortCol}` as keyof typeof b] as number | null)
    if (va === null && vb === null) return 0
    if (va === null) return 1
    if (vb === null) return -1
    return dir * (va - vb)
  })

  const tableTitle = view === 'overtakes' ? 'Overtakes per Race' : 'DNFs per Race'
  const cols: { key: SortCol; label: string }[] = [
    { key: 'circuit', label: 'Circuit' }, { key: '2023', label: '2023' }, { key: '2024', label: '2024' },
    { key: '2025', label: '2025' }, { key: 'avg', label: 'Average' },
  ]

  function arrow(col: SortCol) {
    if (col !== sortCol) return <span style={{ color: 'var(--muted2)', marginLeft: '4px' }}>↕</span>
    return <span style={{ color: '#E8002D', marginLeft: '4px' }}>{sortDir === 'desc' ? '↓' : '↑'}</span>
  }

  return (
    <div>
      {/* Intro banner */}
      <div style={{ ...cardStyle, padding: '20px 24px', marginBottom: '16px', display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
        <span style={{ width: '40px', height: '40px', borderRadius: '10px', display: 'grid', placeItems: 'center', background: 'rgba(232,0,45,0.12)', color: '#E8002D', flexShrink: 0 }}>{chartIcon}</span>
        <div>
          <div style={{ fontSize: '11px', fontWeight: 600, color: '#E8002D', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px' }}>F1 Fantasy Insights</div>
          <p style={{ fontSize: '14px', color: 'var(--muted)', lineHeight: 1.6, margin: 0 }}>
            Circuit data to drive your team forward — driver history at every circuit on the 2026 calendar, plus three years of overtaking and DNF history, fully sortable so you can spot the patterns that matter.
          </p>
        </div>
      </div>

      {/* Sub-toggle */}
      <div style={{ marginBottom: '16px' }}>
        <PillToggle
          options={[
            { id: 'driver-history', label: 'Driver History' },
            { id: 'overtakes', label: 'Overtakes' },
            { id: 'dnf', label: 'DNFs' },
          ]}
          value={view}
          onChange={v => { setView(v as typeof view); setSortCol('avg'); setSortDir('desc') }}
        />
      </div>

      {view === 'driver-history' ? (
        <DriverHistoryPanel />
      ) : (
        <>
          <div style={{ ...cardStyle, overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderBottom: '0.5px solid var(--border)' }}>
              <span style={{ fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--muted)' }}>{tableTitle}</span>
              <span style={{ fontSize: '11px', color: 'var(--muted)' }}>Click any column to sort</span>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', tableLayout: 'fixed', borderCollapse: 'collapse', minWidth: '640px' }}>
                <thead>
                  <tr style={{ background: '#131A21', borderBottom: '0.5px solid var(--border)' }}>
                    {cols.map((col, colIdx) => (
                      <React.Fragment key={col.key}>
                        <th
                          onClick={() => handleSort(col.key)}
                          style={{
                            padding: '10px 12px', width: col.key === 'circuit' ? '24%' : '13%',
                            fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em',
                            color: sortCol === col.key ? '#E8002D' : 'var(--muted)',
                            textAlign: col.key === 'circuit' ? 'left' : 'right', cursor: 'pointer',
                            paddingLeft: col.key === 'circuit' ? '20px' : '12px', whiteSpace: 'nowrap', userSelect: 'none',
                          }}
                        >{col.label}{arrow(col.key)}</th>
                        {colIdx === 0 && (
                          <th
                            onClick={() => handleSort('badge')}
                            style={{ padding: '10px 12px', width: '22%', fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: sortCol === 'badge' ? '#E8002D' : 'var(--muted)', textAlign: 'left', whiteSpace: 'nowrap', cursor: 'pointer', userSelect: 'none' }}
                          >{view === 'overtakes' ? 'Overtaking Difficulty' : 'Rain Risk'}{arrow('badge')}</th>
                        )}
                      </React.Fragment>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sorted.map((row, idx) => (
                    <tr key={row.circuit} style={{ borderBottom: idx < sorted.length - 1 ? '0.5px solid var(--border)' : 'none' }}>
                      <td style={{ padding: '10px 12px', paddingLeft: '20px', whiteSpace: 'nowrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Flag code={row.flag} size={14} />
                          <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text)' }}>{row.circuit}</span>
                        </div>
                      </td>
                      <td style={{ padding: '10px 12px', width: '22%' }}>
                        <RiskBadge level={view === 'overtakes' ? otDifficulty[row.circuit] : rainRisk[row.circuit]} />
                      </td>
                      <td style={{ padding: '10px 12px', textAlign: 'right', fontFamily: monoFont, fontSize: '13px', color: row.y2023 !== null ? 'var(--text)' : 'var(--muted)' }}>{row.y2023 ?? '—'}</td>
                      <td style={{ padding: '10px 12px', textAlign: 'right', fontFamily: monoFont, fontSize: '13px', color: row.y2024 !== null ? 'var(--text)' : 'var(--muted)' }}>{row.y2024 ?? '—'}</td>
                      <td style={{ padding: '10px 12px', textAlign: 'right', fontFamily: monoFont, fontSize: '13px', color: row.y2025 !== null ? 'var(--text)' : 'var(--muted)' }}>{row.y2025 ?? '—'}</td>
                      <td style={{ padding: '10px 12px', textAlign: 'right', fontFamily: monoFont, fontSize: '13px', fontWeight: 600, color: avgColor(row.avg) }}>{row.avg !== null ? row.avg.toFixed(2) : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Legend */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginTop: '12px', padding: '0 4px' }}>
            {view === 'overtakes' ? (
              <>
                <LegendItem level="HIGH" text="Few genuine overtaking opportunities; starting position has a strong bearing on final result." />
                <LegendItem level="MEDIUM" text="Moderate passing frequency; strategy and race pace share influence with qualifying position." />
                <LegendItem level="LOW" text="High overtaking frequency; drivers can recover positions through race pace and strategy." />
              </>
            ) : (
              <>
                <LegendItem level="HIGH" text="Historically elevated rainfall probability; expect variable conditions and higher DNF rates." />
                <LegendItem level="MEDIUM" text="Moderate likelihood of rain; conditions may shift during the session." />
                <LegendItem level="LOW" text="Typically dry conditions; more predictable scoring environment." />
              </>
            )}
          </div>
        </>
      )}
    </div>
  )
}

function LegendItem({ level, text }: { level: 'HIGH' | 'MEDIUM' | 'LOW'; text: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
      <span style={{ marginTop: '2px' }}><RiskBadge level={level} /></span>
      <span style={{ fontSize: '12px', color: 'var(--muted)', lineHeight: 1.5 }}>{text}</span>
    </div>
  )
}
