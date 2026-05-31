'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'

const card = { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '14px', overflow: 'hidden' as const }
const cardHeader = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px 12px', borderBottom: '1px solid var(--border)' }
const cardTitle = { fontSize: '12px', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '1.5px', color: 'var(--muted)' }

// ── How to Play tab ────────────────────────────────────────────────────────────

function ScoringTable({ title, note, rows, cols }: { title: string; note?: string; rows: (string | number)[][]; cols: string[] }) {
  return (
    <div style={{ ...card, marginBottom: '16px' }}>
      <div style={cardHeader}>
        <div>
          <span style={cardTitle}>{title}</span>
          {note && <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '4px', fontWeight: 400, letterSpacing: 0, textTransform: 'none' as const }}>{note}</div>}
        </div>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' as const, minWidth: '400px' }}>
          <colgroup>
            <col />
            {cols.slice(1).map((_, i) => <col key={i} style={{ width: '80px' }} />)}
          </colgroup>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              {cols.map((c, i) => (
                <th key={c} style={{ padding: '10px 24px', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '1px', color: 'var(--muted)', textAlign: i === 0 ? 'left' as const : 'right' as const }}>{c}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                {row.map((cell, j) => (
                  <td key={j} style={{ padding: '10px 24px', fontSize: '13px', color: typeof cell === 'number' && cell > 0 ? '#00D47E' : typeof cell === 'number' && cell < 0 ? '#E8002D' : 'var(--text)', fontFamily: typeof cell === 'number' ? 'JetBrains Mono, monospace' : 'inherit', fontWeight: j === 0 ? 500 : 400, textAlign: j === 0 ? 'left' as const : 'right' as const, whiteSpace: j > 0 ? 'nowrap' as const : undefined }}>
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
      <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '28px', color: 'var(--text)', letterSpacing: '1px' }}>{label}</span>
    </div>
  )
}

function HowToPlayTab() {
  return (
    <div>
      {/* Intro */}
      <div style={{ ...card, padding: '28px', marginBottom: '8px' }}>
        <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '32px', marginBottom: '12px' }}>How F1 Fantasy Works</div>
        <p style={{ color: 'var(--muted)', fontSize: '14px', lineHeight: 1.7, marginBottom: '16px' }}>
          Each week you select 5 drivers and 2 constructors within a budget. Points are scored based on race performance across Qualifying, the Sprint (at sprint weekends) and the main Grand Prix.
        </p>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' as const }}>
          {[
            { label: '5 Drivers', icon: '👤', color: '#00A8FF' },
            { label: '2 Constructors', icon: '🏎️', color: '#FFB800' },
            { label: '1 2x Boost Driver', icon: '🚀', color: '#E8002D' },
            { label: '$100M Budget', icon: '💰', color: '#00D47E' },
          ].map(item => (
            <div key={item.label} style={{ background: 'var(--surface2)', borderRadius: '8px', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
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
        <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '1.5px', color: 'var(--muted)', marginBottom: '14px' }}>Notes</div>
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
            <li key={i} style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.65 }}>{note}</li>
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
        <p style={{ color: 'var(--muted)', fontSize: '14px', lineHeight: 1.7, margin: 0 }}>
          Each manager receives one of each chip per season. Chips cannot be used simultaneously. Once activated, a chip cannot be reversed — think strategically before you use it.
        </p>
      </div>
      <div className="mob-1col" style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '16px' }}>
        {chips.map(chip => (
          <div key={chip.name} style={{
            background: 'var(--surface)',
            border: chip.priority ? `1px solid ${chip.accent}40` : '1px solid var(--border)',
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

// ── CSV helpers ────────────────────────────────────────────────────────────────

function parseCSVLine(line: string): string[] {
  line = line.replace(/\r/g, '')
  const result: string[] = []
  let cur = ''
  let inQ = false
  for (let i = 0; i < line.length; i++) {
    const c = line[i]
    if (c === '"') { inQ = !inQ }
    else if (c === ',' && !inQ) { result.push(cur.trim()); cur = '' }
    else { cur += c }
  }
  result.push(cur.trim())
  return result
}

function parseCSV(text: string): Record<string, string>[] {
  const lines = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').trim().split('\n')
  const headers = parseCSVLine(lines[0])
  return lines.slice(1).filter(l => l.trim()).map(line => {
    const vals = parseCSVLine(line)
    return Object.fromEntries(headers.map((h, i) => [h, (vals[i] ?? '').trim()]))
  })
}

// ── Driver History data ────────────────────────────────────────────────────────

const DRIVER_LIST = [
  'Alexander Albon',
  'Andrea Kimi Antonelli',
  'Carlos Sainz',
  'Charles Leclerc',
  'Esteban Ocon',
  'Fernando Alonso',
  'Franco Colapinto',
  'Gabriel Bortoleto',
  'George Russell',
  'Isack Hadjar',
  'Lance Stroll',
  'Lando Norris',
  'Lewis Hamilton',
  'Liam Lawson',
  'Max Verstappen',
  'Nico Hulkenberg',
  'Oliver Bearman',
  'Oscar Piastri',
  'Pierre Gasly',
  'Sergio Perez',
  'Valtteri Bottas',
  'Arvid Lindblad',
]

const CIRCUIT_LIST: { value: string; display: string; cancelled?: boolean }[] = [
  { value: 'Albert Park',                    display: 'Albert Park (Australia)' },
  { value: 'Shanghai International Circuit', display: 'Shanghai International Circuit (China)' },
  { value: 'Suzuka Circuit',                 display: 'Suzuka Circuit (Japan)' },
  { value: 'Miami International Autodrome',  display: 'Miami International Autodrome' },
  { value: 'Circuit Gilles Villeneuve',      display: 'Circuit Gilles Villeneuve (Canada)' },
  { value: 'Circuit de Monaco',              display: 'Circuit de Monaco' },
  { value: 'Circuit de Barcelona-Catalunya', display: 'Circuit de Barcelona-Catalunya' },
  { value: 'Red Bull Ring',                  display: 'Red Bull Ring (Austria)' },
  { value: 'Silverstone Circuit',            display: 'Silverstone Circuit' },
  { value: 'Circuit de Spa-Francorchamps',   display: 'Circuit de Spa-Francorchamps' },
  { value: 'Hungaroring',                    display: 'Hungaroring' },
  { value: 'Circuit Zandvoort',              display: 'Circuit Zandvoort' },
  { value: 'Autodromo Nazionale di Monza',   display: 'Autodromo Nazionale di Monza' },
  { value: 'Madrid Street Circuit',          display: 'Madrid Street Circuit' },
  { value: 'Baku City Circuit',              display: 'Baku City Circuit' },
  { value: 'Marina Bay Street Circuit',      display: 'Marina Bay Street Circuit (Singapore)' },
  { value: 'Circuit of the Americas',        display: 'Circuit of the Americas (Austin)' },
  { value: 'Autodromo Hermanos Rodriguez',   display: 'Autodromo Hermanos Rodriguez (Mexico)' },
  { value: 'Autodromo Jose Carlos Pace',     display: 'Autodromo Jose Carlos Pace (Interlagos)' },
  { value: 'Las Vegas Strip Circuit',        display: 'Las Vegas Strip Circuit' },
  { value: 'Lusail International Circuit',   display: 'Lusail International Circuit (Qatar)' },
  { value: 'Yas Marina Circuit',             display: 'Yas Marina Circuit (Abu Dhabi)' },
  { value: 'Bahrain International Circuit',  display: 'Bahrain International Circuit (Cancelled 2026)', cancelled: true },
  { value: 'Jeddah Corniche Circuit',        display: 'Jeddah Corniche Circuit (Saudi Arabia) (Cancelled 2026)', cancelled: true },
]

// ── Driver History panel ───────────────────────────────────────────────────────

function DriverHistoryPanel() {
  const [driver,    setDriver]    = useState('Lando Norris')
  const [circuit,   setCircuit]   = useState('Silverstone Circuit')
  const [rawData,   setRawData]   = useState<Record<string, string>[]>([])
  const [aggData,   setAggData]   = useState<Record<string, string>[]>([])
  const [noAppData, setNoAppData] = useState<Record<string, string>[]>([])
  const [loading,   setLoading]   = useState(true)
  const [loadError, setLoadError] = useState(false)

  useEffect(() => {
    Promise.all([
      fetch('/data/f1_raw_results.csv').then(r => { if (!r.ok) throw new Error('missing'); return r.text() }),
      fetch('/data/f1_aggregated_stats.csv').then(r => { if (!r.ok) throw new Error('missing'); return r.text() }),
      fetch('/data/f1_no_appearances.csv').then(r => { if (!r.ok) throw new Error('missing'); return r.text() }),
    ]).then(([raw, agg, noApp]) => {
      setRawData(parseCSV(raw))
      setAggData(parseCSV(agg))
      setNoAppData(parseCSV(noApp))
      setLoading(false)
    }).catch(() => {
      setLoadError(true)
      setLoading(false)
    })
  }, [])

  const aggEntry   = aggData.find(r => r['Driver'] === driver && r['Circuit'] === circuit)
  const noAppEntry = noAppData.find(r => r['Driver'] === driver && r['Circuit'] === circuit)
  const yearRows   = rawData
    .filter(r => r['Driver'] === driver && r['Circuit'] === circuit)
    .sort((a, b) => Number(a['Year']) - Number(b['Year']))

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
    const n = Number(val)
    if (!isNaN(n)) {
      if (n === 1)  return '#00C851'
      if (n <= 3)   return '#FFD700'
      if (n <= 10)  return 'var(--text)'
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
    if (n === 1)  return '#00C851'
    if (n <= 3)   return '#FFD700'
    return 'var(--text)'
  }

  const starts     = aggEntry ? Number(aggEntry['Starts']) : 0
  const wins       = yearRows.filter(r => parseInt(r['Race Finish Position'], 10) === 1).length
  const podiums    = yearRows.filter(r => { const p = parseInt(r['Race Finish Position'], 10); return !isNaN(p) && p <= 3 }).length
  const rawDnfPct  = aggEntry ? Number((aggEntry['DNF %'] ?? '0').replace('%', '')) : 0
  const dnfPct     = isNaN(rawDnfPct) ? 0 : rawDnfPct
  const retirements = Math.round(dnfPct / 100 * starts)
  const winRate    = starts > 0 ? Math.round((wins / starts) * 100) : 0
  const podiumRate = starts > 0 ? Math.round((podiums / starts) * 100) : 0

  function dnfColor(): string {
    if (dnfPct === 0)   return '#00C851'
    if (dnfPct <= 20)   return '#FF8700'
    return '#E8002D'
  }

  const selectStyle: React.CSSProperties = {
    background: 'var(--surface2)',
    color: 'var(--text)',
    border: '1px solid var(--border)',
    borderRadius: '8px',
    padding: '9px 32px 9px 12px',
    fontSize: '13px',
    fontFamily: 'DM Sans, sans-serif',
    cursor: 'pointer',
    outline: 'none',
    appearance: 'none',
    WebkitAppearance: 'none',
    width: '100%',
  }

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '10px',
    fontWeight: 700,
    letterSpacing: '1.5px',
    textTransform: 'uppercase',
    color: 'var(--muted)',
    marginBottom: '6px',
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--muted)', fontFamily: 'DM Sans, sans-serif', fontSize: '14px' }}>
        Loading driver data…
      </div>
    )
  }

  if (loadError) {
    return (
      <div style={{ background: 'var(--surface)', border: '0.5px solid var(--border)', borderRadius: '12px', padding: '40px 24px', textAlign: 'center' }}>
        <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '24px', color: 'var(--muted)', marginBottom: '10px' }}>Data Not Available</div>
        <div style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.6 }}>
          CSV data files have not been uploaded yet. Place the three CSV files in{' '}
          <code style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', background: 'var(--surface2)', padding: '2px 6px', borderRadius: '4px' }}>public/data/</code>{' '}
          to enable this feature.
        </div>
      </div>
    )
  }

  const showNoData = !aggEntry || !!noAppEntry
  const circuitDisplayName = CIRCUIT_LIST.find(c => c.value === circuit)?.display ?? circuit

  return (
    <div>
      {/* Dropdowns */}
      <div className="mob-1col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
        {/* Driver */}
        <div>
          <label style={labelStyle}>Driver</label>
          <div style={{ position: 'relative' }}>
            <select value={driver} onChange={e => setDriver(e.target.value)} style={selectStyle}>
              {DRIVER_LIST.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
            <span style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--muted)', fontSize: '10px' }}>▼</span>
          </div>
        </div>
        {/* Circuit */}
        <div>
          <label style={labelStyle}>Circuit</label>
          <div style={{ position: 'relative' }}>
            <select value={circuit} onChange={e => setCircuit(e.target.value)} style={selectStyle}>
              {CIRCUIT_LIST.map(c => (
                <option key={c.value} value={c.value} style={c.cancelled ? { color: '#5A6A7A' } : {}}>
                  {c.display}
                </option>
              ))}
            </select>
            <span style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--muted)', fontSize: '10px' }}>▼</span>
          </div>
        </div>
      </div>

      {/* Results */}
      {showNoData ? (
        /* NO DATA STATE */
        <div style={{ background: 'var(--surface)', border: '0.5px solid var(--border)', borderRadius: '12px', padding: '52px 24px', textAlign: 'center' }}>
          <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '28px', color: 'var(--muted)', marginBottom: '10px', letterSpacing: '1px' }}>
            No Historical Data
          </div>
          <div style={{ fontSize: '13px', color: 'var(--muted)', maxWidth: '380px', margin: '0 auto', lineHeight: 1.65 }}>
            {noAppEntry
              ? noAppEntry['Note']
              : driver === 'Arvid Lindblad'
                ? 'No F1 starts'
                : 'No prior appearances at this circuit'}
          </div>
        </div>
      ) : (
        /* STATS CARD */
        <div style={{ background: 'var(--surface)', border: '0.5px solid var(--border)', borderRadius: '12px', overflow: 'hidden' }}>

          {/* Header */}
          <div style={{ padding: '20px 24px 16px', borderBottom: '0.5px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
              <div>
                <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '36px', color: 'var(--text)', lineHeight: 1, letterSpacing: '0.5px' }}>
                  {driver}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '5px' }}>
                  <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#E8002D', flexShrink: 0 }} />
                  <span style={{ fontSize: '12px', color: 'var(--muted)', fontFamily: 'DM Sans, sans-serif' }}>
                    {circuitDisplayName}
                  </span>
                </div>
              </div>
              <span style={{
                fontSize: '11px', fontWeight: 600,
                padding: '5px 14px', borderRadius: '20px',
                background: 'rgba(232,0,45,0.1)', border: '1px solid rgba(232,0,45,0.2)',
                color: '#E8002D', whiteSpace: 'nowrap',
                fontFamily: 'JetBrains Mono, monospace', flexShrink: 0,
              }}>
                {aggEntry!['Years Active At Circuit']}
              </span>
            </div>
          </div>

          <div style={{ padding: '16px 20px 20px' }}>

            {/* Primary stats — 4 columns */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '8px' }}>
              {/* Starts */}
              <div style={{ background: 'var(--surface2)', borderRadius: '10px', padding: '14px 8px', textAlign: 'center' }}>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '26px', fontWeight: 700, color: 'var(--text)', lineHeight: 1 }}>{starts}</div>
                <div style={{ fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)', marginTop: '7px', marginBottom: '3px' }}>Starts</div>
                <div style={{ fontSize: '10px', color: '#8A9AB0' }}>Grand Prix entries</div>
              </div>
              {/* Wins */}
              <div style={{ background: 'var(--surface2)', borderRadius: '10px', padding: '14px 8px', textAlign: 'center' }}>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '26px', fontWeight: 700, color: wins > 0 ? '#00C851' : 'var(--text)', lineHeight: 1 }}>{wins}</div>
                <div style={{ fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)', marginTop: '7px', marginBottom: '3px' }}>Wins</div>
                <div style={{ fontSize: '10px', color: '#8A9AB0' }}>{winRate}% win rate</div>
              </div>
              {/* Podiums */}
              <div style={{ background: 'var(--surface2)', borderRadius: '10px', padding: '14px 8px', textAlign: 'center' }}>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '26px', fontWeight: 700, color: podiums > 0 ? '#FFD700' : 'var(--text)', lineHeight: 1 }}>{podiums}</div>
                <div style={{ fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)', marginTop: '7px', marginBottom: '3px' }}>Podiums</div>
                <div style={{ fontSize: '10px', color: '#8A9AB0' }}>{podiumRate}% podium rate</div>
              </div>
              {/* DNF % */}
              <div style={{ background: 'var(--surface2)', borderRadius: '10px', padding: '14px 8px', textAlign: 'center' }}>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '26px', fontWeight: 700, color: dnfColor(), lineHeight: 1 }}>{dnfPct.toFixed(1)}%</div>
                <div style={{ fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)', marginTop: '7px', marginBottom: '3px' }}>DNF %</div>
                <div style={{ fontSize: '10px', color: '#8A9AB0' }}>{retirements} retirement{retirements !== 1 ? 's' : ''}</div>
              </div>
            </div>

            {/* Secondary stats — 5 columns */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px', marginBottom: '20px' }}>
              {[
                { label: 'Avg Grid',      val: fmtStat(aggEntry!['Avg Grid']),          color: undefined },
                { label: 'Avg Finish',    val: fmtStat(aggEntry!['Avg Finish']),         color: undefined },
                { label: 'Median Grid',   val: fmtStat(aggEntry!['Median Grid']),        color: undefined },
                { label: 'Median Finish', val: fmtStat(aggEntry!['Median Finish']),      color: undefined },
                { label: 'Best Finish',   val: fmtBestFinish(aggEntry!['Best Finish']),  color: bestFinishColor(aggEntry!['Best Finish']) },
              ].map(({ label, val, color }) => (
                <div key={label} style={{ background: 'var(--surface2)', borderRadius: '8px', padding: '10px 6px', textAlign: 'center' }}>
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '16px', fontWeight: 700, color: color ?? 'var(--text)', lineHeight: 1 }}>{val}</div>
                  <div style={{ fontSize: '9px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.8px', color: 'var(--muted)', marginTop: '6px' }}>{label}</div>
                </div>
              ))}
            </div>

            {/* Year-by-year table */}
            {yearRows.length > 0 && (
              <div>
                <div style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--muted)', marginBottom: '10px' }}>
                  Season by Season
                </div>
                <div style={{ border: '0.5px solid var(--border)', borderRadius: '8px', overflow: 'hidden' }}>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '360px' }}>
                      <thead>
                        <tr style={{ background: '#131A21', borderBottom: '0.5px solid var(--border)' }}>
                          {[
                            { label: 'Season', align: 'left'   as const },
                            { label: 'Grid',   align: 'center' as const },
                            { label: 'Finish', align: 'center' as const },
                            { label: 'Team',   align: 'left'   as const },
                          ].map(h => (
                            <th key={h.label} style={{
                              padding: '8px 14px',
                              fontSize: '9px', fontWeight: 700,
                              textTransform: 'uppercase', letterSpacing: '1.2px',
                              color: 'var(--muted)', textAlign: h.align,
                              whiteSpace: 'nowrap',
                            }}>{h.label}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {yearRows.map((row, idx) => {
                          const finPos  = row['Race Finish Position'] ?? ''
                          const gridPos = row['Grid Position'] ?? ''
                          return (
                            <tr
                              key={idx}
                              style={{ borderBottom: idx < yearRows.length - 1 ? '0.5px solid var(--border)' : 'none' }}
                            >
                              <td style={{ padding: '9px 14px', fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', color: 'var(--text)', fontWeight: 600 }}>
                                {row['Year']}
                              </td>
                              <td style={{ padding: '9px 14px', textAlign: 'center', fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', color: 'var(--muted)' }}>
                                {gridDisplay(gridPos)}
                              </td>
                              <td style={{ padding: '9px 14px', textAlign: 'center', fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', color: finishColor(finPos), fontWeight: Number(finPos) === 1 ? 700 : 400 }}>
                                {finishDisplay(finPos)}
                              </td>
                              <td style={{ padding: '9px 14px' }}>
                                <span style={{
                                  display: 'inline-block', fontSize: '11px', fontWeight: 500,
                                  padding: '2px 10px', borderRadius: '4px',
                                  background: 'var(--surface3)', color: 'var(--muted)',
                                  whiteSpace: 'nowrap',
                                }}>
                                  {row['Team']}
                                </span>
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

// ── Insights tab ───────────────────────────────────────────────────────────────

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

const rainRisk: Record<string, 'HIGH' | 'MEDIUM' | 'LOW'> = {
  'Australia':     'MEDIUM',
  'China':         'MEDIUM',
  'Japan':         'MEDIUM',
  'Miami':         'HIGH',
  'Canada':        'HIGH',
  'Monaco':        'MEDIUM',
  'Spain':         'LOW',
  'Austria':       'MEDIUM',
  'Britain':       'HIGH',
  'Belgium':       'HIGH',
  'Hungary':       'MEDIUM',
  'Netherlands':   'HIGH',
  'Italy':         'MEDIUM',
  'Madrid':        'LOW',
  'Azerbaijan':    'MEDIUM',
  'Singapore':     'HIGH',
  'United States': 'LOW',
  'Mexico':        'LOW',
  'Brazil':        'HIGH',
  'Las Vegas':     'LOW',
  'Qatar':         'LOW',
  'Abu Dhabi':     'LOW',
}

const otDifficulty: Record<string, 'HIGH' | 'MEDIUM' | 'LOW'> = {
  'Australia':     'MEDIUM',
  'China':         'LOW',
  'Japan':         'HIGH',
  'Miami':         'LOW',
  'Canada':        'MEDIUM',
  'Monaco':        'HIGH',
  'Spain':         'LOW',
  'Austria':       'LOW',
  'Britain':       'MEDIUM',
  'Belgium':       'MEDIUM',
  'Hungary':       'HIGH',
  'Netherlands':   'HIGH',
  'Italy':         'MEDIUM',
  'Madrid':        'MEDIUM',
  'Azerbaijan':    'MEDIUM',
  'Singapore':     'HIGH',
  'United States': 'LOW',
  'Mexico':        'LOW',
  'Brazil':        'LOW',
  'Las Vegas':     'LOW',
  'Qatar':         'MEDIUM',
  'Abu Dhabi':     'LOW',
}

const riskColors = {
  HIGH:   { color: '#E8002D', bg: 'rgba(232,0,45,0.12)',   border: 'rgba(232,0,45,0.4)'   },
  MEDIUM: { color: '#FF8700', bg: 'rgba(255,135,0,0.12)',  border: 'rgba(255,135,0,0.4)'  },
  LOW:    { color: '#00C851', bg: 'rgba(0,200,81,0.12)',   border: 'rgba(0,200,81,0.4)'   },
}

function RiskBadge({ level }: { level: 'HIGH' | 'MEDIUM' | 'LOW' | undefined }) {
  if (!level) return <span style={{ color: 'var(--muted)', fontFamily: 'JetBrains Mono, monospace', fontSize: '11px' }}>—</span>
  const c = riskColors[level]
  return (
    <span style={{
      display: 'inline-block',
      padding: '2px 10px',
      borderRadius: '4px',
      fontFamily: 'JetBrains Mono, monospace',
      fontSize: '11px',
      fontWeight: 600,
      letterSpacing: '0.05em',
      background: c.bg,
      border: `0.5px solid ${c.border}`,
      color: c.color,
    }}>{level}</span>
  )
}

function calcAvg(row: CircuitRow): number | null {
  const vals = [row.y2023, row.y2024, row.y2025].filter((v): v is number => v !== null)
  if (vals.length === 0) return null
  return vals.reduce((a, b) => a + b, 0) / vals.length
}

function InsightsTab() {
  const [view, setView]         = useState<'driver-history' | 'overtakes' | 'dnf'>('overtakes')
  const [sortCol, setSortCol]   = useState<SortCol>('avg')
  const [sortDir, setSortDir]   = useState<SortDir>('desc')

  const data = view === 'dnf' ? dnfData : overtakesData

  const withAvg = data.map(row => ({ ...row, avg: calcAvg(row) }))

  // All averages for colour-coding overtakes mode
  const numericAvgs = withAvg.map(r => r.avg).filter((v): v is number => v !== null)
  numericAvgs.sort((a, b) => a - b)
  const q25 = numericAvgs[Math.floor(numericAvgs.length * 0.75)] ?? 0
  const q65 = numericAvgs[Math.floor(numericAvgs.length * 0.35)] ?? 0

  function avgColor(avg: number | null): string {
    if (avg === null) return 'var(--muted)'
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

  const badgeRank: Record<string, number> = { LOW: 1, MEDIUM: 2, HIGH: 3 }

  const sorted = [...withAvg].sort((a, b) => {
    const dir = sortDir === 'desc' ? -1 : 1
    if (sortCol === 'circuit') {
      return dir * a.circuit.localeCompare(b.circuit)
    }
    if (sortCol === 'badge') {
      const map = view === 'overtakes' ? otDifficulty : rainRisk
      const ra = badgeRank[map[a.circuit] ?? ''] ?? 0
      const rb = badgeRank[map[b.circuit] ?? ''] ?? 0
      return dir * (ra - rb)
    }
    const va = sortCol === 'avg' ? a.avg : a[`y${sortCol}` as keyof typeof a] as number | null
    const vb = sortCol === 'avg' ? b.avg : b[`y${sortCol}` as keyof typeof b] as number | null
    if (va === null && vb === null) return 0
    if (va === null) return 1
    if (vb === null) return -1
    return dir * (va - vb)
  })

  const tableTitle  = view === 'overtakes' ? 'Overtakes per Race' : 'DNFs per Race'
  const cols: { key: SortCol; label: string; width?: string }[] = [
    { key: 'circuit', label: 'Circuit', width: '24%'  },
    { key: '2023',    label: '2023',    width: '13%'  },
    { key: '2024',    label: '2024',    width: '13%'  },
    { key: '2025',    label: '2025',    width: '13%'  },
    { key: 'avg',     label: 'Average', width: '15%'  },
  ]

  function arrow(col: SortCol) {
    if (col !== sortCol) return <span style={{ color: 'var(--muted2)', marginLeft: '4px' }}>↕</span>
    return <span style={{ color: '#E8002D', marginLeft: '4px' }}>{sortDir === 'desc' ? '↓' : '↑'}</span>
  }

  return (
    <div>

      {/* Section 1 — Intro banner */}
      <div style={{ background: 'var(--surface)', border: '0.5px solid var(--border)', borderRadius: '12px', padding: '20px 24px', marginBottom: '12px', display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
        <div style={{ fontSize: '22px', flexShrink: 0, marginTop: '2px' }}>📊</div>
        <div>
          <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', fontWeight: 600, color: '#E8002D', textTransform: 'uppercase' as const, letterSpacing: '0.1em', marginBottom: '8px' }}>F1 Fantasy Statistics</div>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: '#8A9AB0', lineHeight: 1.6, margin: 0 }}>
            Circuit data to drive your team forward — driver history at every circuit on the 2026 calendar, plus three years of overtaking and DNF history, fully sortable so you can spot the patterns that matter.
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
        {([
          { id: 'driver-history' as const, label: 'Driver History' },
          { id: 'overtakes'      as const, label: 'Overtakes'      },
          { id: 'dnf'            as const, label: 'DNFs'           },
        ]).map(({ id, label }) => {
          const active = view === id
          return (
            <button
              key={id}
              onClick={() => { setView(id); if (id !== 'driver-history') { setSortCol('avg'); setSortDir('desc') } }}
              style={{
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '12px',
                fontWeight: 600,
                padding: '5px 12px',
                borderRadius: '6px',
                cursor: 'pointer',
                background: active ? 'rgba(232,0,45,0.12)' : 'transparent',
                color: active ? '#E8002D' : 'var(--muted)',
                border: active ? '0.5px solid rgba(232,0,45,0.3)' : '0.5px solid var(--border)',
                transition: 'all 0.15s',
              }}
            >
              {label}
            </button>
          )
        })}
      </div>

      {/* Section 4 — Driver History panel OR Sortable table + Legend */}
      {view === 'driver-history' ? (
        <DriverHistoryPanel />
      ) : (
        <>
          {/* Sortable table */}
          <div style={{ background: 'var(--surface)', border: '0.5px solid var(--border)', borderRadius: '12px', overflow: 'hidden' as const }}>
            {/* Card header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderBottom: '0.5px solid var(--border)' }}>
              <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '10px', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.08em', color: 'var(--muted)' }}>{tableTitle}</span>
              <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', color: 'var(--muted)' }}>Click any column to sort</span>
            </div>

            {/* Table */}
            <div style={{ overflowX: 'auto' as const }}>
              <table style={{ width: '100%', tableLayout: 'fixed' as const, borderCollapse: 'collapse' as const, minWidth: '640px' }}>
                <thead>
                  <tr style={{ background: '#131A21', borderBottom: '0.5px solid var(--border)' }}>
                    {cols.map((col, colIdx) => (
                      <React.Fragment key={col.key}>
                        <th
                          onClick={() => handleSort(col.key)}
                          style={{
                            padding: '10px 12px',
                            ...(col.width ? { width: col.width } : {}),
                            fontFamily: 'DM Sans, sans-serif',
                            fontSize: '10px',
                            fontWeight: 600,
                            textTransform: 'uppercase' as const,
                            letterSpacing: '0.08em',
                            color: sortCol === col.key ? '#E8002D' : 'var(--muted)',
                            textAlign: col.key === 'circuit' ? 'left' as const : 'right' as const,
                            cursor: 'pointer',
                            paddingLeft: col.key === 'circuit' ? '20px' : '12px',
                            whiteSpace: 'nowrap' as const,
                            userSelect: 'none' as const,
                            overflow: 'hidden' as const,
                          }}
                        >
                          {col.label}{arrow(col.key)}
                        </th>
                        {/* Sortable badge column */}
                        {colIdx === 0 && (
                          <th
                            onClick={() => handleSort('badge')}
                            style={{ padding: '10px 12px', width: '22%', fontFamily: 'DM Sans, sans-serif', fontSize: '10px', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.08em', color: sortCol === 'badge' ? '#E8002D' : 'var(--muted)', textAlign: 'left' as const, whiteSpace: 'nowrap' as const, cursor: 'pointer', userSelect: 'none' as const, overflow: 'hidden' as const }}
                          >
                            {view === 'overtakes' ? 'Overtaking Difficulty' : 'Rain Risk'}{arrow('badge')}
                          </th>
                        )}
                      </React.Fragment>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sorted.map((row, idx) => (
                    <tr
                      key={row.circuit}
                      style={{
                        borderBottom: idx < sorted.length - 1 ? '0.5px solid var(--border)' : 'none',
                        transition: 'background 0.1s',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      {/* Circuit */}
                      <td style={{ padding: '10px 12px', paddingLeft: '20px', whiteSpace: 'nowrap' as const }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span className={`fi fi-${row.flag}`} style={{ width: '1.2em', borderRadius: '2px', flexShrink: 0 }} />
                          <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', fontWeight: 500, color: 'var(--text)' }}>{row.circuit}</span>
                        </div>
                      </td>
                      {/* Badge column — OT Difficulty (overtakes) or Rain Risk (DNFs) */}
                      <td style={{ padding: '10px 12px', width: '22%', overflow: 'hidden' as const }}>
                        <RiskBadge level={view === 'overtakes' ? otDifficulty[row.circuit] : rainRisk[row.circuit]} />
                      </td>
                      {/* 2023 */}
                      <td style={{ padding: '10px 12px', textAlign: 'right' as const, fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', color: row.y2023 !== null ? 'var(--text)' : 'var(--muted)' }}>
                        {row.y2023 !== null ? row.y2023 : '—'}
                      </td>
                      {/* 2024 */}
                      <td style={{ padding: '10px 12px', textAlign: 'right' as const, fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', color: row.y2024 !== null ? 'var(--text)' : 'var(--muted)' }}>
                        {row.y2024 !== null ? row.y2024 : '—'}
                      </td>
                      {/* 2025 */}
                      <td style={{ padding: '10px 12px', textAlign: 'right' as const, fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', color: row.y2025 !== null ? 'var(--text)' : 'var(--muted)' }}>
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

          {/* Legend note */}
          <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '16px', marginTop: '12px', padding: '0 4px' }}>
            {view === 'overtakes' ? (
              <>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <span style={{ display: 'inline-block', marginTop: '2px', padding: '1px 8px', borderRadius: '4px', fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', fontWeight: 700, color: riskColors.HIGH.color, background: riskColors.HIGH.bg, border: `0.5px solid ${riskColors.HIGH.border}`, whiteSpace: 'nowrap' as const, flexShrink: 0 }}>HIGH</span>
                  <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: 'var(--muted)', lineHeight: 1.5 }}>Few genuine overtaking opportunities; starting position has a strong bearing on final result.</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <span style={{ display: 'inline-block', marginTop: '2px', padding: '1px 8px', borderRadius: '4px', fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', fontWeight: 700, color: riskColors.MEDIUM.color, background: riskColors.MEDIUM.bg, border: `0.5px solid ${riskColors.MEDIUM.border}`, whiteSpace: 'nowrap' as const, flexShrink: 0 }}>MEDIUM</span>
                  <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: 'var(--muted)', lineHeight: 1.5 }}>Moderate passing frequency; strategy and race pace share influence with qualifying position.</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <span style={{ display: 'inline-block', marginTop: '2px', padding: '1px 8px', borderRadius: '4px', fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', fontWeight: 700, color: riskColors.LOW.color, background: riskColors.LOW.bg, border: `0.5px solid ${riskColors.LOW.border}`, whiteSpace: 'nowrap' as const, flexShrink: 0 }}>LOW</span>
                  <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: 'var(--muted)', lineHeight: 1.5 }}>High overtaking frequency; drivers can recover positions through race pace and strategy.</span>
                </div>
              </>
            ) : (
              <>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <span style={{ display: 'inline-block', marginTop: '2px', padding: '1px 8px', borderRadius: '4px', fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', fontWeight: 700, color: riskColors.HIGH.color, background: riskColors.HIGH.bg, border: `0.5px solid ${riskColors.HIGH.border}`, whiteSpace: 'nowrap' as const, flexShrink: 0 }}>HIGH</span>
                  <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: 'var(--muted)', lineHeight: 1.5 }}>Historically elevated rainfall probability; expect variable conditions and higher DNF rates.</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <span style={{ display: 'inline-block', marginTop: '2px', padding: '1px 8px', borderRadius: '4px', fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', fontWeight: 700, color: riskColors.MEDIUM.color, background: riskColors.MEDIUM.bg, border: `0.5px solid ${riskColors.MEDIUM.border}`, whiteSpace: 'nowrap' as const, flexShrink: 0 }}>MEDIUM</span>
                  <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: 'var(--muted)', lineHeight: 1.5 }}>Moderate likelihood of rain; conditions may shift during the session.</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <span style={{ display: 'inline-block', marginTop: '2px', padding: '1px 8px', borderRadius: '4px', fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', fontWeight: 700, color: riskColors.LOW.color, background: riskColors.LOW.bg, border: `0.5px solid ${riskColors.LOW.border}`, whiteSpace: 'nowrap' as const, flexShrink: 0 }}>LOW</span>
                  <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: 'var(--muted)', lineHeight: 1.5 }}>Typically dry conditions; more predictable scoring environment.</span>
                </div>
              </>
            )}
          </div>
        </>
      )}

    </div>
  )
}

// ── Main client ────────────────────────────────────────────────────────────────

export default function F1FantasyClient() {
  const [activeTab, setActiveTab] = useState<'how-to-play' | 'chip-overview' | 'statistics'>('how-to-play')

  const tabs = [
    { id: 'how-to-play',   label: 'How to Play'   },
    { id: 'chip-overview', label: 'Chip Overview'  },
    { id: 'statistics',    label: 'Statistics'     },
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
        <p style={{ color: 'var(--muted)', fontSize: '14px', maxWidth: '600px', lineHeight: 1.6 }}>
          Chip decisions, circuit data and race-by-race strategy to help you build a winning team.
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '24px', flexWrap: 'wrap' as const }}>
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            style={{
              background: activeTab === t.id ? '#E8002D' : 'var(--surface2)',
              color: activeTab === t.id ? 'var(--text)' : 'var(--muted)',
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
      {activeTab === 'statistics'    && <InsightsTab />}

    </div>
  )
}
