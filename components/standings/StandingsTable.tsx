'use client'
import { useState } from 'react'
import Flag from '@/components/ui/Flag'
import CardHeader from '@/components/ui/CardHeader'
import { cardStyle, monoFont, posColor } from './shared'

export interface NormalizedStandingsRow {
  pos: number
  name: string
  secondary: string
  color: string
  flag: string
  points: number
  wins: number
  podiums: number
  poles: number
}

type SortKey = 'points' | 'wins' | 'podiums' | 'poles'

export default function StandingsTable({
  title, rows, primaryLabel, secondaryLabel,
}: {
  title: string
  rows: NormalizedStandingsRow[]
  primaryLabel: string
  secondaryLabel: string
}) {
  const [sortKey, setSortKey] = useState<SortKey>('points')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')

  const maxPoints = Math.max(...rows.map(r => r.points), 1)

  function handleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir(d => (d === 'desc' ? 'asc' : 'desc'))
    } else {
      setSortKey(key)
      setSortDir('desc')
    }
  }

  const sorted = [...rows].sort((a, b) => {
    const dir = sortDir === 'desc' ? -1 : 1
    return dir * (a[sortKey] - b[sortKey]) || b.points - a.points
  })

  function arrow(key: SortKey) {
    if (key !== sortKey) return <span style={{ color: 'var(--muted2)', marginLeft: '4px' }}>↕</span>
    return <span style={{ color: '#E8002D', marginLeft: '4px' }}>{sortDir === 'desc' ? '↓' : '↑'}</span>
  }

  const cols: { key: SortKey; label: string }[] = [
    { key: 'points', label: 'Pts' }, { key: 'wins', label: 'Wins' },
    { key: 'podiums', label: 'Podiums' }, { key: 'poles', label: 'Poles' },
  ]

  const thStyle: React.CSSProperties = { padding: '10px 12px', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--muted)', textAlign: 'right', cursor: 'pointer', whiteSpace: 'nowrap', userSelect: 'none' }

  return (
    <div style={cardStyle}>
      <CardHeader title={title} right={<span style={{ fontSize: '11px', color: 'var(--muted)' }}>Click a column to sort</span>} />
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '640px' }}>
          <thead>
            <tr style={{ background: '#131A21', borderBottom: '1px solid var(--border)' }}>
              <th style={{ padding: '10px 12px', width: '44px', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--muted)' }}>#</th>
              <th style={{ padding: '10px 12px', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--muted)', textAlign: 'left' }}>{primaryLabel}</th>
              <th style={{ padding: '10px 12px', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--muted)', textAlign: 'left' }}>{secondaryLabel}</th>
              <th style={{ padding: '10px 12px', minWidth: '140px', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--muted)' }}>Points</th>
              {cols.map(c => (
                <th key={c.key} onClick={() => handleSort(c.key)} style={{ ...thStyle, color: sortKey === c.key ? '#E8002D' : 'var(--muted)' }}>{c.label}{arrow(c.key)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((r, i) => (
              <tr key={r.name} className="st-team-row" style={{ '--tc': r.color, borderBottom: i < sorted.length - 1 ? '1px solid var(--border)' : 'none' } as React.CSSProperties}>
                <td style={{ padding: '10px 12px', textAlign: 'center', fontFamily: monoFont, fontWeight: 600, fontSize: '12px', color: posColor(r.pos) }}>{r.pos}</td>
                <td style={{ padding: '10px 12px', whiteSpace: 'nowrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
                    <i className="st-team-tl" style={{ width: '3px', height: '22px', borderRadius: '2px', flexShrink: 0, background: r.color, transition: 'box-shadow .25s' }} />
                    <span className="st-team-flag" style={{ transition: 'transform .2s', display: 'inline-flex' }}><Flag code={r.flag} size={14} /></span>
                    <b style={{ fontWeight: 600, fontSize: '13px' }}>{r.name}</b>
                  </div>
                </td>
                <td style={{ padding: '10px 12px', fontSize: '13px', color: 'var(--muted)', whiteSpace: 'nowrap' }}>{r.secondary}</td>
                <td style={{ padding: '10px 12px' }}>
                  <div style={{ height: '6px', background: 'var(--surface2)', borderRadius: '3px', overflow: 'hidden', minWidth: '60px' }}>
                    <div style={{ height: '100%', borderRadius: '3px', opacity: 0.9, width: `${(r.points / maxPoints) * 100}%`, background: r.color }} />
                  </div>
                </td>
                <td style={{ padding: '10px 12px', textAlign: 'right', fontFamily: monoFont, fontWeight: 700, fontSize: '14px' }}>{r.points}</td>
                <td style={{ padding: '10px 12px', textAlign: 'right', fontFamily: monoFont, fontSize: '13px', fontWeight: r.wins ? 700 : 400, color: r.wins ? '#FFD700' : 'var(--muted2)' }}>{r.wins || 0}</td>
                <td style={{ padding: '10px 12px', textAlign: 'right', fontFamily: monoFont, fontSize: '13px', color: r.podiums ? '#C0C0C0' : 'var(--muted2)' }}>{r.podiums || '—'}</td>
                <td style={{ padding: '10px 12px', textAlign: 'right', fontFamily: monoFont, fontSize: '13px', color: r.poles ? '#E8002D' : 'var(--muted2)' }}>{r.poles || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
