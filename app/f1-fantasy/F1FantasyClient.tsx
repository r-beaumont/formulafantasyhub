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
        <p style={{ color: '#5A6A7A', fontSize: '14px', lineHeight: 1.7, maxWidth: '520px', margin: '0 auto 32px' }}>
          A full suite of F1 Fantasy tools is being built for Formula Hub. Real-time price alerts, AI-powered picks, performance tracking and weekly strategy guides — all in one place.
        </p>
        <Link href="/subscribe" style={{ background: '#E8002D', color: 'white', padding: '12px 32px', borderRadius: '8px', textDecoration: 'none', fontWeight: 700, fontSize: '14px', boxShadow: '0 0 28px rgba(232,0,45,0.35)' }}>
          Get Early Access →
        </Link>
      </div>

      {/* Feature cards */}
      <div className="mob-2col" style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '16px' }}>
        {[
          {
            icon: '📊',
            title: 'Fantasy Performance Tracker',
            desc: 'Track every driver and constructor across each race weekend. Points breakdowns, price movement history and ownership trends — all visualised in real time.',
            status: 'IN DEVELOPMENT',
            statusColor: '#FFB800',
            statusBg: 'rgba(255,184,0,0.12)',
          },
          {
            icon: '🤖',
            title: 'AI Race Recommendations',
            desc: 'Machine learning models trained on five years of F1 data. Get driver and constructor picks ranked by expected points, circuit fit and price efficiency.',
            status: 'IN DEVELOPMENT',
            statusColor: '#FFB800',
            statusBg: 'rgba(255,184,0,0.12)',
          },
          {
            icon: '📰',
            title: 'F1 Fantasy News Hub',
            desc: 'Breaking news, price change alerts and race week strategy updates delivered as soon as they happen. Never miss a deadline or a price rise again.',
            status: 'COMING SOON',
            statusColor: '#E8002D',
            statusBg: 'rgba(232,0,45,0.12)',
          },
          {
            icon: '🏆',
            title: 'Mini-League Analytics',
            desc: 'See exactly where you\'re winning and losing against your mini-league. Differential pick analysis, chip timing comparison and head-to-head breakdowns.',
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
            { label: '1 Turbo Driver (3×)', icon: '🚀', color: '#E8002D' },
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

      <div style={{ ...card, padding: '20px' }}>
        <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '20px', marginBottom: '8px', color: '#FFB800' }}>Constructors</div>
        <p style={{ color: '#5A6A7A', fontSize: '13px', lineHeight: 1.6, margin: 0 }}>
          Constructor points are the sum of both of their drivers' qualifying, sprint and race points. Constructors score double when both drivers finish in the points.
        </p>
      </div>
    </div>
  )
}

// ── Chip Overview tab ──────────────────────────────────────────────────────────

function ChipOverviewTab() {
  const chips = [
    {
      name: '3x Boost',
      icon: '🚀',
      color: '#E8002D',
      border: 'rgba(232,0,45,0.3)',
      bg: 'rgba(232,0,45,0.06)',
      tagline: 'Triple your captain\'s points',
      desc: 'Your selected Turbo Driver scores 3× points instead of 2× for one race weekend. Use this on a driver you expect to dominate — pole, win, fastest lap and Driver of the Day is the dream scenario.',
      tips: [
        'Best used at low-overtake circuits where the fastest driver runs away',
        'Target weekends where one driver has clear pace advantage',
        'Avoid sprint weekends — you only get the 3× boost for the main race',
      ],
    },
    {
      name: 'Limitless',
      icon: '♾️',
      color: '#00A8FF',
      border: 'rgba(0,168,255,0.3)',
      bg: 'rgba(0,168,255,0.06)',
      tagline: 'No budget, no restrictions',
      desc: 'For one race weekend, you can select any 5 drivers and 2 constructors with no budget cap. Build the ultimate squad without any compromise. All changes revert after the round.',
      tips: [
        'Sprint weekends give you double the scoring sessions — highest ceiling',
        'Stack the top teams: all Mercedes + Ferrari assets simultaneously',
        'Use when you are behind in a mini-league and need maximum points',
      ],
    },
    {
      name: 'No Negative',
      icon: '🛡️',
      color: '#00D47E',
      border: 'rgba(0,212,126,0.3)',
      bg: 'rgba(0,212,126,0.06)',
      tagline: 'Floor your score at zero',
      desc: 'No driver or constructor in your squad can score negative points for that race weekend. DNFs, DSQs and poor qualifying performances cannot hurt you. Your worst-case outcome is zero.',
      tips: [
        'Ideal for chaotic circuits (Baku, Monaco, Singapore)',
        'Use when you hold a risky differential pick that might DNF',
        'Strong at early-season weekends before reliability is established',
      ],
    },
    {
      name: 'Wildcard',
      icon: '🃏',
      color: '#FFB800',
      border: 'rgba(255,184,0,0.3)',
      bg: 'rgba(255,184,0,0.06)',
      tagline: 'Free transfers for one round',
      desc: 'Make unlimited transfers for one race weekend with no budget penalty and no points deductions. Your squad resets to its pre-Wildcard state the following round.',
      tips: [
        'Use after a major grid shake-up (new team, mid-season driver change)',
        'Stack with a Limitless when you are wildly off the optimal squad',
        'Best deployed before a price rise wave to lock in value',
      ],
    },
    {
      name: 'Autopilot',
      icon: '✈️',
      color: '#C0C0C0',
      border: 'rgba(192,192,192,0.3)',
      bg: 'rgba(192,192,192,0.06)',
      tagline: 'Automatic optimal selection',
      desc: 'The game selects the highest-scoring squad for you for that round — with the benefit of hindsight. Guarantees your maximum possible score for one race weekend.',
      tips: [
        'Never use proactively — always save for emergencies',
        'Activate if you cannot set your team before a deadline',
        'Do not use on sprint weekends — you only score the main race',
      ],
    },
    {
      name: 'Final Fix',
      icon: '🔧',
      color: '#FF69B4',
      border: 'rgba(255,105,180,0.3)',
      bg: 'rgba(255,105,180,0.06)',
      tagline: 'One free transfer after qualifying',
      desc: 'Make one free transfer after qualifying has concluded, before the race starts. Perfect for replacing a DNQ driver or reacting to a grid penalty.',
      tips: [
        'Hold this chip all season — it pays off at least once every year',
        'Use when your Turbo Driver fails to qualify or takes a grid penalty',
        'Can be combined with other chips for maximum flexibility',
      ],
    },
  ]

  return (
    <div>
      <div style={{ ...card, padding: '20px 24px', marginBottom: '24px' }}>
        <p style={{ color: '#5A6A7A', fontSize: '14px', lineHeight: 1.7, margin: 0 }}>
          Each manager receives one of each chip per season. Chips cannot be used simultaneously (except Final Fix, which can stack with other chips). Use them wisely — a well-timed chip is worth 50+ points in a mini-league.
        </p>
      </div>
      <div className="mob-1col" style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '16px' }}>
        {chips.map(chip => (
          <div key={chip.name} style={{ background: chip.bg, border: `1px solid ${chip.border}`, borderRadius: '14px', padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <div style={{ fontSize: '32px' }}>{chip.icon}</div>
              <div>
                <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '22px', color: chip.color }}>{chip.name}</div>
                <div style={{ fontSize: '12px', color: '#5A6A7A', fontStyle: 'italic' }}>{chip.tagline}</div>
              </div>
            </div>
            <p style={{ fontSize: '13px', color: '#8A9AB0', lineHeight: 1.65, marginBottom: '16px' }}>{chip.desc}</p>
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: '12px' }}>
              <div style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '1px', color: chip.color, marginBottom: '8px' }}>Strategy Tips</div>
              {chip.tips.map((tip, i) => (
                <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', marginBottom: '6px' }}>
                  <span style={{ color: chip.color, fontSize: '12px', flexShrink: 0, marginTop: '1px' }}>›</span>
                  <span style={{ fontSize: '12px', color: '#5A6A7A', lineHeight: 1.5 }}>{tip}</span>
                </div>
              ))}
            </div>
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
