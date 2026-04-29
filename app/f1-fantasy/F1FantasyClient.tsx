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
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
              {cols.map(c => (
                <th key={c} style={{ padding: '10px 20px', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '1px', color: '#5A6A7A', textAlign: 'left' as const }}>{c}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                {row.map((cell, j) => (
                  <td key={j} style={{ padding: '10px 20px', fontSize: '13px', color: typeof cell === 'number' && cell > 0 ? '#00D47E' : typeof cell === 'number' && cell < 0 ? '#E8002D' : '#F0F4F8', fontFamily: typeof cell === 'number' ? 'JetBrains Mono, monospace' : 'inherit', fontWeight: j === 0 ? 500 : 400 }}>
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
      <div style={{ background: 'rgba(0,200,81,0.08)', border: '1px solid rgba(0,200,81,0.25)', borderRadius: '10px', padding: '12px 16px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', background: 'rgba(0,200,81,0.15)', color: '#00C851', textTransform: 'uppercase' as const, letterSpacing: '0.5px', flexShrink: 0 }}>Miami R4 Sprint Pick</span>
        <span style={{ fontSize: '13px', color: '#8A9AB0' }}>Miami is a sprint weekend — <strong style={{ color: '#F0F4F8' }}>3x Boost</strong> and <strong style={{ color: '#F0F4F8' }}>No Negative</strong> are the priority chips. A third scoring session increases the value of 3x Boost, while No Negative protects against sprint DNF penalties.</span>
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

// ── Main client ────────────────────────────────────────────────────────────────

export default function F1FantasyClient() {
  const [activeTab, setActiveTab] = useState<'chip-overview' | 'how-to-play'>('chip-overview')

  const tabs = [
    { id: 'chip-overview', label: 'Chip Overview' },
    { id: 'how-to-play',  label: 'How to Play'  },
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

    </div>
  )
}
