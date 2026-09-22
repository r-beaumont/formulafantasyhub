'use client'

import { useState } from 'react'
import { PillToggle } from '@/components/racehub/shared'
import HowToPlayTab from '@/components/fantasy/HowToPlayTab'
import ChipOverviewTab from '@/components/fantasy/ChipOverviewTab'
import InsightsTab from '@/components/fantasy/InsightsTab'

export default function F1FantasyClient() {
  const [activeTab, setActiveTab] = useState<'how-to-play' | 'chip-overview' | 'insights'>('how-to-play')

  return (
    <div className="mob-pad-page" style={{ position: 'relative', zIndex: 1, maxWidth: '1400px', margin: '0 auto', padding: '28px 32px 60px' }}>

      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <div style={{ width: '3px', height: '24px', background: '#E8002D', borderRadius: '2px' }} />
          <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '2px', color: '#E8002D', textTransform: 'uppercase' }}>F1 Fantasy</span>
        </div>
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(2.5rem,5vw,3.5rem)', lineHeight: 1, marginBottom: '8px' }}>F1 Fantasy Hub</div>
        <p style={{ color: 'var(--muted)', fontSize: '14px', maxWidth: '600px', lineHeight: 1.6 }}>
          Chip decisions, circuit data and race-by-race strategy to help you build a winning team.
        </p>
      </div>

      {/* Tabs */}
      <div style={{ marginBottom: '24px' }}>
        <PillToggle
          options={[
            { id: 'how-to-play', label: 'How to Play' },
            { id: 'chip-overview', label: 'Chip Overview' },
            { id: 'insights', label: 'Insights' },
          ]}
          value={activeTab}
          onChange={v => setActiveTab(v as typeof activeTab)}
        />
      </div>

      {activeTab === 'how-to-play' && <HowToPlayTab />}
      {activeTab === 'chip-overview' && <ChipOverviewTab />}
      {activeTab === 'insights' && <InsightsTab />}
    </div>
  )
}
