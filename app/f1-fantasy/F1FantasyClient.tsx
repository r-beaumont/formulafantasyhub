'use client'

import { useState } from 'react'
import Link from 'next/link'

const card = { background: '#0E1318', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', overflow: 'hidden' as const }
const cardHeader = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px 12px', borderBottom: '1px solid rgba(255,255,255,0.07)' }
const cardTitle = { fontSize: '12px', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '1.5px', color: '#5A6A7A' }

// ── Coming Soon tab ────────────────────────────────────────────────────────────

function ComingSoonTab() {
  return (
    <div>
      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, rgba(232,0,45,0.1) 0%, rgba(14,19,24,1) 100%)', border: '1px solid rgba(232,0,45,0.25)', borderRadius: '16px', padding: '56px 40px', textAlign: 'center', marginBottom: '24px' }}>
        <div style={{ fontSize: '56px', marginBottom: '16px' }}>🚀</div>
        <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(2.5rem,6vw,4rem)', letterSpacing: '3px', color: '#F0F4F8', lineHeight: 1, marginBottom: '12px' }}>
          UPGRADE PACKAGE INCOMING
        </div>
        <p style={{ color: '#5A6A7A', fontSize: '14px', lineHeight: 1.7, maxWidth: '520px', margin: '0 auto' }}>
          F1 Fantasy analysis to help guide your weekly decisions. AI-powered picks, data-driven insights and weekly strategy guides — all in one place.
        </p>
      </div>

      {/* Feature cards */}
      <div className="mob-2col" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px' }}>
        {[
          {
            icon: '🤖',
            title: 'AI Recommendations',
            desc: 'Machine learning models to help guide your weekly fantasy decisions — using key datapoints and analytical insights based on historical data, circuit performances and value opportunity.',
            status: 'IN DEVELOPMENT',
            statusColor: '#FFB800',
            statusBg: 'rgba(255,184,0,0.12)',
          },
          {
            icon: '📰',
            title: 'F1 Fantasy News',
            desc: 'Breaking news, price change alerts and race week strategy updates delivered as soon as they happen. Never miss a deadline or a price rise again.',
            status: 'COMING SOON',
            statusColor: '#E8002D',
            statusBg: 'rgba(232,0,45,0.12)',
          },
          {
            icon: '🏆',
            title: 'AI Model Showdown',
            desc: 'GPT, Gemini and Claude independently predict the top 5 qualifying and race results each weekend. Scores accumulate across the season to find the most accurate AI predictor of 2026.',
            status: 'COMING SOON',
            statusColor: '#E8002D',
            statusBg: 'rgba(232,0,45,0.12)',
          },
        ].map(f => (
          <div key={f.title} style={{ ...card, padding: '24px' }}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>{f.icon}</div>
            <span style={{ fontSize: '9px', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', background: f.statusBg, color: f.statusColor, textTransform: 'uppercase' as const, letterSpacing: '0.5px' }}>{f.status}</span>
            <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '22px', color: '#F0F4F8', marginTop: '10px', marginBottom: '8px' }}>{f.title}</div>
            <p style={{ fontSize: '13px', color: '#5A6A7A', lineHeight: 1.6, margin: 0 }}>{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── How to Play tab ────────────────────────────────────────────────────────────

function ScoringTable({ title, rows, cols }: { title: string; rows: (string | number)[][]; cols: string[] }) {
  return (
    <div style={{ ...card, marginBottom: '20px' }}>
      <div style={cardHeader}>
        <span style={cardTitle}>{title}</span>
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

function HowToPlayTab() {
  return (
    <div>
      {/* Intro */}
      <div style={{ ...card, padding: '28px', marginBottom: '24px' }}>
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

      {/* Qualifying scoring */}
      <ScoringTable
        title="Qualifying Points"
        cols={['Category', 'Points']}
        rows={[
          ['Pole Position (P1)', 10],
          ['2nd Place (P2)', 9],
          ['3rd Place (P3)', 8],
          ['4th Place (P4)', 7],
          ['5th Place (P5)', 6],
          ['6th Place (P6)', 5],
          ['7th Place (P7)', 4],
          ['8th Place (P8)', 3],
          ['9th Place (P9)', 2],
          ['10th Place (P10)', 1],
          ['Out in Q1 (P11+)', 0],
          ['Did Not Qualify', -5],
        ]}
      />

      {/* Sprint scoring */}
      <ScoringTable
        title="Sprint Race Points"
        cols={['Position', 'Points']}
        rows={[
          ['1st Place', 8],
          ['2nd Place', 7],
          ['3rd Place', 6],
          ['4th Place', 5],
          ['5th Place', 4],
          ['6th Place', 3],
          ['7th Place', 2],
          ['8th Place', 1],
        ]}
      />

      {/* Race scoring */}
      <ScoringTable
        title="Race Points"
        cols={['Category', 'Points']}
        rows={[
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
          ['Fastest Lap (Top 10)', 5],
          ['Driver of the Day', 10],
          ['Overtakes (per overtake)', 2],
          ['Positions Gained (per pos)', 2],
          ['Positions Lost (per pos)', -2],
          ['DNF / DSQ', -15],
        ]}
      />

    </div>
  )
}

// ── Chip Overview tab ──────────────────────────────────────────────────────────

function ChipOverviewTab() {
  const chips = [
    {
      accent: '#00C851',
      name: '3X BOOST',
      what: 'Assign to two drivers in your team. One scores 3x points, one scores 2x points for that race weekend.',
      who: 'Two premium drivers you expect to perform — e.g. George Russell and Kimi Antonelli, or whoever is in form that week.',
      when: 'Typically used on sprint weekends for a third scoring session.',
    },
    {
      accent: '#00A8FF',
      name: 'LIMITLESS',
      what: 'Unlimited transfers and unlimited budget for one week only. Price changes apply to your pre-Limitless team after activation, but pre-Limitless transfers do not count.',
      who: 'Build the best possible team at that point of the season with no budget restrictions.',
      when: 'On a weekend early in the season where at least six assets are expected to increase in value and where there is expected to be a significant points delta between Limitless and non-Limitless teams.',
    },
    {
      accent: '#9B59B6',
      name: 'NO NEGATIVE',
      what: 'All negative scoring categories are reset to zero for one race weekend. Any driver with a score below zero — DNF, DSQ, positions lost — scores zero instead.',
      who: 'All drivers and constructors in your team benefit.',
      when: 'Sprint weekends, wet races, high DNF risk tracks.',
    },
    {
      accent: '#E8002D',
      name: 'WILDCARD',
      what: 'Unlimited transfers up to your current team value. All drivers and constructors in your team can be changed.',
      who: 'Your full squad — use it to overhaul your lineup completely.',
      when: "When you've fallen behind the template, need to make multiple changes, or when a major shift in the competitive order demands a full reset.",
    },
    {
      accent: '#00E5CC',
      name: 'AUTOPILOT',
      what: 'Your 2x Boost is automatically reassigned to the highest-scoring driver in your team for that race weekend.',
      who: 'The drivers in your team — whoever performs best gets the multiplier automatically.',
      when: 'Wet races, high DNF risk tracks, sprint weekends, situations where predicting your 2x Boost driver is difficult.',
    },
    {
      accent: '#FFD700',
      name: 'FINAL FIX',
      what: 'One free driver change between the deadline and the race start. Any driver within budget. Can be applied to a driver carrying the 2x Boost. Constructors cannot be changed with this chip.',
      who: 'Any driver in your squad.',
      when: 'Pre-race withdrawals, back-of-the-grid penalties, a driver qualifying unexpectedly out of position. Very hard to plan for — this chip is reactive by nature.',
    },
  ]

  return (
    <div>
      <div style={{ ...card, padding: '20px 24px', marginBottom: '24px' }}>
        <p style={{ color: '#5A6A7A', fontSize: '14px', lineHeight: 1.7, margin: 0 }}>
          Each manager receives one of each chip per season. Chips cannot be used simultaneously. Once activated, a chip cannot be reversed — think strategically before you use it.
        </p>
      </div>
      <div className="mob-1col" style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '16px' }}>
        {chips.map(chip => (
          <div key={chip.name} style={{
            background: '#0E1318',
            border: '1px solid rgba(255,255,255,0.07)',
            borderLeft: `4px solid ${chip.accent}`,
            borderRadius: '14px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column' as const,
            gap: '16px',
          }}>
            <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '26px', color: chip.accent, letterSpacing: '1px' }}>{chip.name}</div>
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
  const [activeTab, setActiveTab] = useState<'coming-soon' | 'how-to-play' | 'chip-overview'>('coming-soon')

  const tabs = [
    { id: 'coming-soon',   label: 'Coming Soon'  },
    { id: 'how-to-play',  label: 'How to Play'  },
    { id: 'chip-overview', label: 'Chip Overview' },
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
      {activeTab === 'coming-soon'   && <ComingSoonTab />}
      {activeTab === 'how-to-play'   && <HowToPlayTab />}
      {activeTab === 'chip-overview' && <ChipOverviewTab />}

    </div>
  )
}
