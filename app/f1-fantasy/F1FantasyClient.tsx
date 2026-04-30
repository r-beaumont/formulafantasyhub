'use client'

import { useState } from 'react'
import Link from 'next/link'

const card = { background: '#0E1318', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', overflow: 'hidden' as const }
const cardHeader = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px 12px', borderBottom: '1px solid rgba(255,255,255,0.07)' }
const cardTitle = { fontSize: '12px', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '1.5px', color: '#5A6A7A' }

// ── How to Play tab ────────────────────────────────────────────────────────────

function ScoringTable({ title, note, rows, cols }: { title: string; note?: string; rows: (string | number)[][]; cols: string[] }) {
  return (
    <div style={{ ...card, marginBottom: '16px' }}>
      <div style={cardHeader}>
        <div>
          <span style={cardTitle}>{title}</span>
          {note && <div style={{ fontSize: '11px', color: '#5A6A7A', marginTop: '4px', fontWeight: 400, letterSpacing: 0, textTransform: 'none' as const }}>{note}</div>}
        </div>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' as const, minWidth: '400px' }}>
          <colgroup>
            <col />
            {cols.slice(1).map((_, i) => <col key={i} style={{ width: '80px' }} />)}
          </colgroup>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
              {cols.map((c, i) => (
                <th key={c} style={{ padding: '10px 24px', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '1px', color: '#5A6A7A', textAlign: i === 0 ? 'left' as const : 'right' as const }}>{c}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                {row.map((cell, j) => (
                  <td key={j} style={{ padding: '10px 24px', fontSize: '13px', color: typeof cell === 'number' && cell > 0 ? '#00D47E' : typeof cell === 'number' && cell < 0 ? '#E8002D' : '#F0F4F8', fontFamily: typeof cell === 'number' ? 'JetBrains Mono, monospace' : 'inherit', fontWeight: j === 0 ? 500 : 400, textAlign: j === 0 ? 'left' as const : 'right' as const, whiteSpace: j > 0 ? 'nowrap' as const : undefined }}>
                    {typeof cell === 'number' && cell > 0 ? `+${cell}` : cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function SessionHeader({ label, color }: { label: string; color: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '32px 0 16px' }}>
      <div style={{ width: '4px', height: '28px', background: color, borderRadius: '2px' }} />
      <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '28px', color: '#F0F4F8', letterSpacing: '1px' }}>{label}</span>
    </div>
  )
}

function HowToPlayTab() {
  return (
    <div>
      {/* Intro */}
      <div style={{ ...card, padding: '28px', marginBottom: '8px' }}>
        <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '32px', marginBottom: '12px' }}>How F1 Fantasy Works</div>
        <p style={{ color: '#5A6A7A', fontSize: '14px', lineHeight: 1.7, marginBottom: '16px' }}>
          Each week you select 5 drivers and 2 constructors within a budget. Points are scored based on race performance across Qualifying, the Sprint (at sprint weekends) and the main Grand Prix.
        </p>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' as const }}>
          {[
            { label: '5 Drivers', icon: '👤', color: '#00A8FF' },
            { label: '2 Constructors', icon: '🏎️', color: '#FFB800' },
            { label: '1 2x Boost Driver', icon: '🚀', color: '#E8002D' },
            { label: '$100M Budget', icon: '💰', color: '#00D47E' },
          ].map(item => (
            <div key={item.label} style={{ background: '#141B22', borderRadius: '8px', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '18px' }}>{item.icon}</span>
              <span style={{ fontSize: '13px', fontWeight: 600, color: item.color }}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── QUALIFYING ── */}
      <SessionHeader label="Qualifying" color="#E8002D" />

      <ScoringTable
        title="Driver Scoring — Qualifying"
        cols={['Category', 'Points']}
        rows={[
          ['Pole Position', 10],
          ['2nd Place', 9],
          ['3rd Place', 8],
          ['4th Place', 7],
          ['5th Place', 6],
          ['6th Place', 5],
          ['7th Place', 4],
          ['8th Place', 3],
          ['9th Place', 2],
          ['10th Place', 1],
          ['11th–20th Place', 0],
          ['NC / DSQ / No Time Set', -5],
        ]}
      />

      <ScoringTable
        title="Constructor Scoring — Qualifying"
        note="Constructors score the combined total of both drivers, plus the bonuses below."
        cols={['Category', 'Points']}
        rows={[
          ['Neither driver reaches Q2', -1],
          ['One driver reaches Q2', 1],
          ['Both drivers reach Q2', 3],
          ['One driver reaches Q3', 5],
          ['Both drivers reach Q3', 10],
          ['Disqualified driver (per driver)', -5],
        ]}
      />

      {/* ── SPRINT ── */}
      <SessionHeader label="Sprint" color="#FFB800" />

      <ScoringTable
        title="Driver Scoring — Sprint"
        cols={['Category', 'Points']}
        rows={[
          ['Positions Gained (per position)', 1],
          ['Positions Lost (per position)', -1],
          ['Overtakes Made (per overtake)', 1],
          ['Fastest Lap', 5],
          ['1st Place', 8],
          ['2nd Place', 7],
          ['3rd Place', 6],
          ['4th Place', 5],
          ['5th Place', 4],
          ['6th Place', 3],
          ['7th Place', 2],
          ['8th Place', 1],
          ['9th–20th Place', 0],
          ['DNF / DSQ / Not Classified', -10],
        ]}
      />

      <ScoringTable
        title="Constructor Scoring — Sprint"
        note="Constructors score the combined total of both drivers, plus the penalty below."
        cols={['Category', 'Points']}
        rows={[
          ['Disqualified driver (per driver)', -10],
        ]}
      />

      {/* ── RACE ── */}
      <SessionHeader label="Race" color="#00D47E" />

      <ScoringTable
        title="Driver Scoring — Race"
        cols={['Category', 'Points']}
        rows={[
          ['Positions Gained (per position)', 1],
          ['Positions Lost (per position)', -1],
          ['Overtakes Made (per overtake)', 1],
          ['Fastest Lap', 10],
          ['Driver of the Day (driver only)', 10],
          ['1st Place', 25],
          ['2nd Place', 18],
          ['3rd Place', 15],
          ['4th Place', 12],
          ['5th Place', 10],
          ['6th Place', 8],
          ['7th Place', 6],
          ['8th Place', 4],
          ['9th Place', 2],
          ['10th Place', 1],
          ['11th–20th Place', 0],
          ['DNF / DSQ / Not Classified', -20],
        ]}
      />

      <ScoringTable
        title="Constructor Scoring — Race"
        note="Constructors score the combined total of both drivers (excluding Driver of the Day), plus pit stop bonuses below."
        cols={['Category', 'Points']}
        rows={[
          ['Pit Stop: Over 3.0 seconds', 0],
          ['Pit Stop: 2.50–2.99 seconds', 2],
          ['Pit Stop: 2.20–2.49 seconds', 5],
          ['Pit Stop: 2.00–2.19 seconds', 10],
          ['Pit Stop: Under 2.0 seconds', 20],
          ['Fastest Pit Stop Bonus', 5],
          ['New World Record Pit Stop Bonus', 15],
          ['Disqualified driver (per driver)', -20],
        ]}
      />

      {/* ── TEAM MANAGEMENT ── */}
      <SessionHeader label="Team Management" color="#00A8FF" />

      <ScoringTable
        title="Transfers"
        cols={['Category', 'Points']}
        rows={[
          ['Exceeding free transfer allowance (per additional transfer)', -10],
        ]}
      />

      {/* ── FOOTNOTES ── */}
      <div style={{ ...card, padding: '24px', marginTop: '8px' }}>
        <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '1.5px', color: '#5A6A7A', marginBottom: '14px' }}>Notes</div>
        <ul style={{ margin: 0, padding: '0 0 0 18px', display: 'flex', flexDirection: 'column' as const, gap: '10px' }}>
          {[
            'Positions gained and lost are calculated based on the starting and finishing position of the driver in the race, not their qualifying result.',
            'Unclassified drivers will not have positions lost calculated and will instead receive the DNF penalty.',
            'Cars starting from the pit lane are considered to have started from a position relative to the last car on the grid.',
            'Overtakes are only valid when one driver legally passes another on track and the driver being passed was not entering the pit lane or suffering a car failure or going unreasonably slow.',
            'Driver of the Day is the result of the official F1 Driver of the Day award.',
            'DNF and Not Classified penalties apply to all drivers including those classed as inactive or not included in the final starting grid.',
            'The current world record pit stop time is 1.8 seconds, set by McLaren at the Qatar Grand Prix 2023.',
          ].map((note, i) => (
            <li key={i} style={{ fontSize: '13px', color: '#5A6A7A', lineHeight: 1.65 }}>{note}</li>
          ))}
        </ul>
      </div>

    </div>
  )
}

// ── Chip Overview tab ──────────────────────────────────────────────────────────

function ChipOverviewTab() {
  const chips = [
    {
      accent: '#00C851',
      name: '3X BOOST',
      priority: true,
      what: 'Assign to two drivers in your team. One scores 3x points, one scores 2x points for that race weekend.',
      who: 'Two premium drivers you expect to perform — e.g. George Russell and Kimi Antonelli, or whoever is in form that week.',
      when: 'Typically used on sprint weekends for a third scoring session.',
    },
    {
      accent: '#00A8FF',
      name: 'LIMITLESS',
      priority: false,
      what: 'Unlimited transfers and unlimited budget for one week only. Price changes apply to your pre-Limitless team after activation, but pre-Limitless transfers do not count.',
      who: 'Build the best possible team at that point of the season with no budget restrictions.',
      when: 'On a weekend early in the season where at least six assets are expected to increase in value and where there is expected to be a significant points delta between Limitless and non-Limitless teams.',
    },
    {
      accent: '#9B59B6',
      name: 'NO NEGATIVE',
      priority: true,
      what: 'All negative scoring categories are reset to zero for one race weekend. Any driver with a score below zero — DNF, DSQ, positions lost — scores zero instead.',
      who: 'All drivers and constructors in your team benefit.',
      when: 'Sprint weekends, wet races, high DNF risk tracks.',
    },
    {
      accent: '#E8002D',
      name: 'WILDCARD',
      priority: false,
      what: 'Unlimited transfers up to your current team value. All drivers and constructors in your team can be changed.',
      who: 'Your full squad — use it to overhaul your lineup completely.',
      when: "When you've fallen behind the template, need to make multiple changes, or when a major shift in the competitive order demands a full reset.",
    },
    {
      accent: '#00E5CC',
      name: 'AUTOPILOT',
      priority: false,
      what: 'Your 2x Boost is automatically reassigned to the highest-scoring driver in your team for that race weekend.',
      who: 'The drivers in your team — whoever performs best gets the multiplier automatically.',
      when: 'Wet races, high DNF risk tracks, sprint weekends, situations where predicting your 2x Boost driver is difficult.',
    },
    {
      accent: '#FFD700',
      name: 'FINAL FIX',
      priority: false,
      what: 'One free driver change between the deadline and the race start. Any driver within budget. Can be applied to a driver carrying the 2x Boost. Constructors cannot be changed with this chip.',
      who: 'Any driver in your squad.',
      when: 'Pre-race withdrawals, back-of-the-grid penalties, a driver qualifying unexpectedly out of position. Very hard to plan for — this chip is reactive by nature.',
    },
  ]

  return (
    <div>
      <div style={{ ...card, padding: '20px 24px', marginBottom: '16px' }}>
        <p style={{ color: '#5A6A7A', fontSize: '14px', lineHeight: 1.7, margin: 0 }}>
          Each manager receives one of each chip per season. Chips cannot be used simultaneously. Once activated, a chip cannot be reversed — think strategically before you use it.
        </p>
      </div>
      <div className="mob-1col" style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '16px' }}>
        {chips.map(chip => (
          <div key={chip.name} style={{
            background: '#0E1318',
            border: chip.priority ? `1px solid ${chip.accent}40` : '1px solid rgba(255,255,255,0.07)',
            borderLeft: `4px solid ${chip.accent}`,
            borderRadius: '14px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column' as const,
            gap: '16px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '26px', color: chip.accent, letterSpacing: '1px' }}>{chip.name}</div>
              {chip.priority && <span style={{ fontSize: '9px', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', background: `${chip.accent}20`, color: chip.accent, textTransform: 'uppercase' as const, letterSpacing: '0.5px' }}>Sprint Pick</span>}
            </div>
            {[
              { label: 'WHAT', text: chip.what },
              { label: 'WHO',  text: chip.who  },
              { label: 'WHEN', text: chip.when },
            ].map(row => (
              <div key={row.label} style={{ display: 'flex', gap: '14px' }}>
                <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '1.5px', color: chip.accent, width: '40px', flexShrink: 0, paddingTop: '2px' }}>{row.label}</span>
                <p style={{ fontSize: '13px', color: '#8A9AB0', lineHeight: 1.65, margin: 0, fontFamily: 'DM Sans, sans-serif' }}>{row.text}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Insights tab ───────────────────────────────────────────────────────────────

type SortDir = 'asc' | 'desc'
type SortCol = 'circuit' | '2023' | '2024' | '2025' | 'avg'

interface CircuitRow {
  circuit: string
  flag: string
  y2023: number | null
  y2024: number | null
  y2025: number | null
}

const overtakesData: CircuitRow[] = [
  { circuit: 'Australia',    flag: 'au', y2023: 74,   y2024: 35,  y2025: 45  },
  { circuit: 'China',        flag: 'cn', y2023: null, y2024: 102, y2025: 72  },
  { circuit: 'Japan',        flag: 'jp', y2023: 81,   y2024: 85,  y2025: 28  },
  { circuit: 'Miami',        flag: 'us', y2023: 94,   y2024: 93,  y2025: 80  },
  { circuit: 'Canada',       flag: 'ca', y2023: 46,   y2024: 83,  y2025: 75  },
  { circuit: 'Monaco',       flag: 'mc', y2023: 36,   y2024: 17,  y2025: 4   },
  { circuit: 'Spain',        flag: 'es', y2023: 107,  y2024: 86,  y2025: 78  },
  { circuit: 'Austria',      flag: 'at', y2023: 105,  y2024: 85,  y2025: 81  },
  { circuit: 'Britain',      flag: 'gb', y2023: 50,   y2024: 55,  y2025: 58  },
  { circuit: 'Belgium',      flag: 'be', y2023: 95,   y2024: 58,  y2025: 49  },
  { circuit: 'Hungary',      flag: 'hu', y2023: 51,   y2024: 65,  y2025: 69  },
  { circuit: 'Netherlands',  flag: 'nl', y2023: 240,  y2024: 73,  y2025: 70  },
  { circuit: 'Italy',        flag: 'it', y2023: 49,   y2024: 71,  y2025: 47  },
  { circuit: 'Madrid',       flag: 'es', y2023: null, y2024: null,y2025: null },
  { circuit: 'Azerbaijan',   flag: 'az', y2023: 50,   y2024: 66,  y2025: 55  },
  { circuit: 'Singapore',    flag: 'sg', y2023: 85,   y2024: 62,  y2025: 58  },
  { circuit: 'United States',flag: 'us', y2023: 78,   y2024: 86,  y2025: 71  },
  { circuit: 'Mexico',       flag: 'mx', y2023: 121,  y2024: 87,  y2025: 97  },
  { circuit: 'Brazil',       flag: 'br', y2023: 69,   y2024: 70,  y2025: 96  },
  { circuit: 'Las Vegas',    flag: 'us', y2023: 181,  y2024: 109, y2025: 34  },
  { circuit: 'Qatar',        flag: 'qa', y2023: 108,  y2024: 81,  y2025: 41  },
  { circuit: 'Abu Dhabi',    flag: 'ae', y2023: 113,  y2024: 96,  y2025: 125 },
]

const dnfData: CircuitRow[] = [
  { circuit: 'Australia',    flag: 'au', y2023: 3,    y2024: 2,   y2025: 6   },
  { circuit: 'China',        flag: 'cn', y2023: null, y2024: 3,   y2025: 4   },
  { circuit: 'Japan',        flag: 'jp', y2023: 5,    y2024: 3,   y2025: 0   },
  { circuit: 'Miami',        flag: 'us', y2023: 0,    y2024: 1,   y2025: 5   },
  { circuit: 'Canada',       flag: 'ca', y2023: 2,    y2024: 5,   y2025: 2   },
  { circuit: 'Monaco',       flag: 'mc', y2023: 2,    y2024: 2,   y2025: 0   },
  { circuit: 'Spain',        flag: 'es', y2023: 0,    y2024: 0,   y2025: 3   },
  { circuit: 'Austria',      flag: 'at', y2023: 1,    y2024: 0,   y2025: 4   },
  { circuit: 'Britain',      flag: 'gb', y2023: 2,    y2024: 2,   y2025: 5   },
  { circuit: 'Belgium',      flag: 'be', y2023: 2,    y2024: 2,   y2025: 0   },
  { circuit: 'Hungary',      flag: 'hu', y2023: 2,    y2024: 1,   y2025: 1   },
  { circuit: 'Netherlands',  flag: 'nl', y2023: 3,    y2024: 0,   y2025: 2   },
  { circuit: 'Italy',        flag: 'it', y2023: 2,    y2024: 1,   y2025: 2   },
  { circuit: 'Madrid',       flag: 'es', y2023: null, y2024: null,y2025: null },
  { circuit: 'Azerbaijan',   flag: 'az', y2023: 2,    y2024: 1,   y2025: 1   },
  { circuit: 'Singapore',    flag: 'sg', y2023: 3,    y2024: 1,   y2025: 0   },
  { circuit: 'United States',flag: 'us', y2023: 5,    y2024: 1,   y2025: 1   },
  { circuit: 'Mexico',       flag: 'mx', y2023: 3,    y2024: 3,   y2025: 3   },
  { circuit: 'Brazil',       flag: 'br', y2023: 6,    y2024: 5,   y2025: 3   },
  { circuit: 'Las Vegas',    flag: 'us', y2023: 1,    y2024: 2,   y2025: 5   },
  { circuit: 'Qatar',        flag: 'qa', y2023: 3,    y2024: 5,   y2025: 2   },
  { circuit: 'Abu Dhabi',    flag: 'ae', y2023: 0,    y2024: 3,   y2025: 0   },
]

function calcAvg(row: CircuitRow): number | null {
  const vals = [row.y2023, row.y2024, row.y2025].filter((v): v is number => v !== null)
  if (vals.length === 0) return null
  return vals.reduce((a, b) => a + b, 0) / vals.length
}

function InsightsTab() {
  const [view, setView]         = useState<'overtakes' | 'dnf'>('overtakes')
  const [sortCol, setSortCol]   = useState<SortCol>('avg')
  const [sortDir, setSortDir]   = useState<SortDir>('desc')

  const data = view === 'overtakes' ? overtakesData : dnfData

  const withAvg = data.map(row => ({ ...row, avg: calcAvg(row) }))

  // All averages for colour-coding overtakes mode
  const numericAvgs = withAvg.map(r => r.avg).filter((v): v is number => v !== null)
  numericAvgs.sort((a, b) => a - b)
  const q25 = numericAvgs[Math.floor(numericAvgs.length * 0.75)] ?? 0
  const q65 = numericAvgs[Math.floor(numericAvgs.length * 0.35)] ?? 0

  function avgColor(avg: number | null): string {
    if (avg === null) return '#5A6A7A'
    if (view === 'overtakes') {
      if (avg >= q25) return '#F07070'
      if (avg <= q65) return '#70C090'
      return '#FF8700'
    } else {
      if (avg >= 3.0) return '#F07070'
      if (avg >= 1.5) return '#FF8700'
      return '#70C090'
    }
  }

  function handleSort(col: SortCol) {
    if (col === sortCol) {
      setSortDir(d => d === 'desc' ? 'asc' : 'desc')
    } else {
      setSortCol(col)
      setSortDir(col === 'circuit' ? 'asc' : 'desc')
    }
  }

  const sorted = [...withAvg].sort((a, b) => {
    const dir = sortDir === 'desc' ? -1 : 1
    if (sortCol === 'circuit') {
      return dir * a.circuit.localeCompare(b.circuit)
    }
    const va = sortCol === 'avg' ? a.avg : a[`y${sortCol}` as keyof typeof a] as number | null
    const vb = sortCol === 'avg' ? b.avg : b[`y${sortCol}` as keyof typeof b] as number | null
    if (va === null && vb === null) return 0
    if (va === null) return 1
    if (vb === null) return -1
    return dir * (va - vb)
  })

  const tableTitle  = view === 'overtakes' ? 'Overtakes per Race' : 'DNFs per Race'
  const cols: { key: SortCol; label: string }[] = [
    { key: 'circuit', label: 'Circuit'  },
    { key: '2023',    label: '2023'     },
    { key: '2024',    label: '2024'     },
    { key: '2025',    label: '2025'     },
    { key: 'avg',     label: 'Average'  },
  ]

  function arrow(col: SortCol) {
    if (col !== sortCol) return <span style={{ color: '#3A4A5A', marginLeft: '4px' }}>↕</span>
    return <span style={{ color: '#E8002D', marginLeft: '4px' }}>{sortDir === 'desc' ? '↓' : '↑'}</span>
  }

  return (
    <div>

      {/* Section 1 — Intro banner */}
      <div style={{ background: '#0E1318', border: '0.5px solid rgba(255,255,255,0.07)', borderRadius: '12px', padding: '20px 24px', marginBottom: '12px', display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
        <div style={{ fontSize: '22px', flexShrink: 0, marginTop: '2px' }}>📊</div>
        <div>
          <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', fontWeight: 600, color: '#E8002D', textTransform: 'uppercase' as const, letterSpacing: '0.1em', marginBottom: '8px' }}>F1 Fantasy Insights</div>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: '#8A9BB0', lineHeight: 1.6, margin: 0 }}>
            Circuit data to drive your team forward — three years of overtaking and DNF history across every track on the 2026 calendar, fully sortable so you can spot the patterns that matter.
          </p>
        </div>
      </div>

      {/* Section 2 — Feedback banner */}
      <div style={{ background: 'rgba(0,200,81,0.05)', border: '0.5px solid rgba(0,200,81,0.2)', borderRadius: '12px', padding: '14px 20px', marginBottom: '20px' }}>
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: '#8AC8A0', lineHeight: 1.6, margin: 0 }}>
          <span style={{ color: '#B0DDB8', fontWeight: 500 }}>This section is constantly evolving.</span>{' '}
          We&apos;re adding new data and features regularly — your feedback helps shape what comes next. Reach out to us on{' '}
          <a href="https://x.com/F_FantasyHub" target="_blank" rel="noopener noreferrer" style={{ color: '#B0DDB8', fontWeight: 600, textDecoration: 'underline', textDecorationColor: 'rgba(176,221,184,0.4)' }}>X (Twitter)</a>
          {' '}with your thoughts.
        </p>
      </div>

      {/* Section 3 — View toggle */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '12px' }}>
        {(['overtakes', 'dnf'] as const).map(v => {
          const active = view === v
          return (
            <button
              key={v}
              onClick={() => { setView(v); setSortCol('avg'); setSortDir('desc') }}
              style={{
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '12px',
                fontWeight: 600,
                padding: '5px 12px',
                borderRadius: '6px',
                cursor: 'pointer',
                background: active ? 'rgba(232,0,45,0.12)' : 'transparent',
                color: active ? '#E8002D' : '#5A6A7A',
                border: active ? '0.5px solid rgba(232,0,45,0.3)' : '0.5px solid rgba(255,255,255,0.07)',
                transition: 'all 0.15s',
              }}
            >
              {v === 'overtakes' ? 'Overtakes' : 'DNFs'}
            </button>
          )
        })}
      </div>

      {/* Section 4 — Sortable table */}
      <div style={{ background: '#0E1318', border: '0.5px solid rgba(255,255,255,0.07)', borderRadius: '12px', overflow: 'hidden' as const }}>
        {/* Card header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderBottom: '0.5px solid rgba(255,255,255,0.07)' }}>
          <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '10px', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.08em', color: '#5A6A7A' }}>{tableTitle}</span>
          <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', color: '#5A6A7A' }}>Click any column to sort</span>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' as const }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' as const, minWidth: '480px' }}>
            <thead>
              <tr style={{ background: '#131A21', borderBottom: '0.5px solid rgba(255,255,255,0.07)' }}>
                {cols.map(col => (
                  <th
                    key={col.key}
                    onClick={() => handleSort(col.key)}
                    style={{
                      padding: '10px 12px',
                      fontFamily: 'DM Sans, sans-serif',
                      fontSize: '10px',
                      fontWeight: 600,
                      textTransform: 'uppercase' as const,
                      letterSpacing: '0.08em',
                      color: sortCol === col.key ? '#E8002D' : '#5A6A7A',
                      textAlign: col.key === 'circuit' ? 'left' as const : 'right' as const,
                      cursor: 'pointer',
                      paddingLeft: col.key === 'circuit' ? '20px' : '12px',
                      whiteSpace: 'nowrap' as const,
                      userSelect: 'none' as const,
                    }}
                  >
                    {col.label}{arrow(col.key)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.map((row, idx) => (
                <tr
                  key={row.circuit}
                  style={{
                    borderBottom: idx < sorted.length - 1 ? '0.5px solid rgba(255,255,255,0.07)' : 'none',
                    transition: 'background 0.1s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  {/* Circuit */}
                  <td style={{ padding: '10px 12px', paddingLeft: '20px', whiteSpace: 'nowrap' as const }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className={`fi fi-${row.flag}`} style={{ width: '1.2em', borderRadius: '2px', flexShrink: 0 }} />
                      <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', fontWeight: 500, color: '#F0F4F8' }}>{row.circuit}</span>
                    </div>
                  </td>
                  {/* 2023 */}
                  <td style={{ padding: '10px 12px', textAlign: 'right' as const, fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', color: row.y2023 !== null ? '#F0F4F8' : '#5A6A7A' }}>
                    {row.y2023 !== null ? row.y2023 : '—'}
                  </td>
                  {/* 2024 */}
                  <td style={{ padding: '10px 12px', textAlign: 'right' as const, fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', color: row.y2024 !== null ? '#F0F4F8' : '#5A6A7A' }}>
                    {row.y2024 !== null ? row.y2024 : '—'}
                  </td>
                  {/* 2025 */}
                  <td style={{ padding: '10px 12px', textAlign: 'right' as const, fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', color: row.y2025 !== null ? '#F0F4F8' : '#5A6A7A' }}>
                    {row.y2025 !== null ? row.y2025 : '—'}
                  </td>
                  {/* Average */}
                  <td style={{ padding: '10px 12px', textAlign: 'right' as const, fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', fontWeight: 600, color: avgColor(row.avg) }}>
                    {row.avg !== null ? row.avg.toFixed(2) : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  )
}

// ── Main client ────────────────────────────────────────────────────────────────

export default function F1FantasyClient() {
  const [activeTab, setActiveTab] = useState<'how-to-play' | 'chip-overview' | 'insights'>('how-to-play')

  const tabs = [
    { id: 'how-to-play',   label: 'How to Play'   },
    { id: 'chip-overview', label: 'Chip Overview'  },
    { id: 'insights',      label: 'Insights'       },
  ] as const

  return (
    <div className="mob-pad-page" style={{ position: 'relative', zIndex: 1, maxWidth: '1400px', margin: '0 auto', padding: '28px 32px 60px' }}>

      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <div style={{ width: '3px', height: '24px', background: '#E8002D', borderRadius: '2px' }} />
          <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '2px', color: '#E8002D', textTransform: 'uppercase' as const }}>F1 Fantasy</span>
        </div>
        <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(2.5rem,5vw,3.5rem)', lineHeight: 1, marginBottom: '8px' }}>F1 Fantasy Hub</div>
        <p style={{ color: '#5A6A7A', fontSize: '14px', maxWidth: '600px', lineHeight: 1.6 }}>
          F1 Fantasy strategy, news and analysis from Rob Beaumont — official F1 Fantasy columnist for formula1.com.
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '24px', flexWrap: 'wrap' as const }}>
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            style={{
              background: activeTab === t.id ? '#E8002D' : '#141B22',
              color: activeTab === t.id ? 'white' : '#5A6A7A',
              border: '1px solid',
              borderColor: activeTab === t.id ? '#E8002D' : 'rgba(255,255,255,0.1)',
              padding: '8px 20px', borderRadius: '8px',
              cursor: 'pointer', fontSize: '13px', fontWeight: 600,
              transition: 'all 0.15s',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'chip-overview' && <ChipOverviewTab />}
      {activeTab === 'how-to-play'   && <HowToPlayTab />}
      {activeTab === 'insights'      && <InsightsTab />}

    </div>
  )
}
