'use client'

import { useState, useEffect } from 'react'
import { RACE_WEEKENDS, type DriverResult, type QualifyingResult } from '@/lib/raceResults'

const card = { background: '#0E1318', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', overflow: 'hidden' as const }
const cardHeader = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px 12px', borderBottom: '1px solid rgba(255,255,255,0.07)' }
const cardTitle = { fontSize: '12px', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '1.5px', color: '#5A6A7A' }

const posColors: Record<number, string> = { 1: '#FFD700', 2: '#C0C0C0', 3: '#CD7F32' }

function timeCell(t: string | null): { text: string; color: string } {
  if (!t) return { text: '—', color: '#3A4A5A' }
  if (t === 'NO TIME SET') return { text: 'NO TIME SET', color: '#3A4A5A' }
  return { text: t, color: '#F0F4F8' }
}

function PracticeTable({ data }: { data: DriverResult[] }) {
  return (
    <div style={{ overflowX: 'auto', minWidth: 0 }}>
      <div style={{ minWidth: '480px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '32px 4px 1fr 1fr 110px 110px', gap: '0 12px', padding: '8px 20px 6px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <span style={{ fontSize: '10px', color: '#5A6A7A', fontWeight: 600, textTransform: 'uppercase' as const }}>Pos</span>
          <span />
          <span style={{ fontSize: '10px', color: '#5A6A7A', fontWeight: 600, textTransform: 'uppercase' as const }}>Driver</span>
          <span style={{ fontSize: '10px', color: '#5A6A7A', fontWeight: 600, textTransform: 'uppercase' as const }}>Team</span>
          <span style={{ fontSize: '10px', color: '#5A6A7A', fontWeight: 600, textTransform: 'uppercase' as const, textAlign: 'right' as const }}>Time</span>
          <span style={{ fontSize: '10px', color: '#5A6A7A', fontWeight: 600, textTransform: 'uppercase' as const, textAlign: 'right' as const }}>Gap</span>
        </div>
        {data.map(r => {
          const t = timeCell(r.time)
          const g = timeCell(r.gap)
          return (
            <div key={r.position} style={{ display: 'grid', gridTemplateColumns: '32px 4px 1fr 1fr 110px 110px', gap: '0 12px', alignItems: 'center', padding: '8px 20px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', fontWeight: r.position <= 3 ? 600 : 400, color: posColors[r.position] || '#5A6A7A' }}>{r.position}</span>
              <div style={{ width: '4px', height: '28px', borderRadius: '2px', background: r.team_colour }} />
              <div style={{ fontSize: '13px', fontWeight: 500 }}>{r.name}</div>
              <div style={{ fontSize: '12px', color: '#5A6A7A' }}>{r.team}</div>
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', color: r.position === 1 ? '#FFB800' : t.color, textAlign: 'right' as const }}>{t.text}</span>
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', color: g.color, textAlign: 'right' as const }}>{r.position === 1 ? '—' : g.text}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function SectionDivider({ label }: { label: string }) {
  return (
    <div style={{ padding: '6px 20px', background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.07)', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
      <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase' as const, color: '#3A4A5A' }}>{label}</span>
    </div>
  )
}

function QualifyingTable({ data, qualifier = 'Q' }: { data: QualifyingResult[]; qualifier?: string }) {
  const q3Group = data.filter(r => r.position <= 10)
  const q2Group = data.filter(r => r.position >= 11 && r.position <= 16)
  const q1Group = data.filter(r => r.position >= 17)

  const Row = ({ r }: { r: QualifyingResult }) => {
    const inQ1Only = r.position >= 17
    const inQ2Only = r.position >= 11 && r.position <= 16
    const q1c = timeCell(r.q1)
    const q2c = timeCell(r.q2)
    const q3c = timeCell(r.q3)
    return (
      <div style={{ display: 'grid', gridTemplateColumns: '32px 4px 1fr 1fr 110px 110px 110px', gap: '0 10px', alignItems: 'center', padding: '8px 20px', borderBottom: '1px solid rgba(255,255,255,0.04)', opacity: inQ1Only ? 0.5 : inQ2Only ? 0.72 : 1 }}>
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', fontWeight: r.position <= 3 ? 600 : 400, color: posColors[r.position] || '#5A6A7A' }}>{r.position}</span>
        <div style={{ width: '4px', height: '28px', borderRadius: '2px', background: r.team_colour }} />
        <div style={{ fontSize: '13px', fontWeight: 500 }}>{r.name}</div>
        <div style={{ fontSize: '12px', color: '#5A6A7A' }}>{r.team}</div>
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: q1c.color, textAlign: 'right' as const }}>{q1c.text}</span>
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: q2c.color, textAlign: 'right' as const }}>{q2c.text}</span>
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', fontWeight: r.q3 && r.position <= 3 ? 600 : 400, color: r.position === 1 && r.q3 ? '#FFB800' : q3c.color, textAlign: 'right' as const }}>{q3c.text}</span>
      </div>
    )
  }

  return (
    <div style={{ overflowX: 'auto', minWidth: 0 }}>
      <div style={{ minWidth: '580px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '32px 4px 1fr 1fr 110px 110px 110px', gap: '0 10px', padding: '8px 20px 6px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <span style={{ fontSize: '10px', color: '#5A6A7A', fontWeight: 600, textTransform: 'uppercase' as const }}>Pos</span>
          <span />
          <span style={{ fontSize: '10px', color: '#5A6A7A', fontWeight: 600, textTransform: 'uppercase' as const }}>Driver</span>
          <span style={{ fontSize: '10px', color: '#5A6A7A', fontWeight: 600, textTransform: 'uppercase' as const }}>Team</span>
          <span style={{ fontSize: '10px', color: '#5A6A7A', fontWeight: 600, textTransform: 'uppercase' as const, textAlign: 'right' as const }}>{qualifier}1</span>
          <span style={{ fontSize: '10px', color: '#5A6A7A', fontWeight: 600, textTransform: 'uppercase' as const, textAlign: 'right' as const }}>{qualifier}2</span>
          <span style={{ fontSize: '10px', color: '#5A6A7A', fontWeight: 600, textTransform: 'uppercase' as const, textAlign: 'right' as const }}>{qualifier}3</span>
        </div>
        {q3Group.map(r => <Row key={r.position} r={r} />)}
        {q2Group.length > 0 && <><SectionDivider label={`— ${qualifier}2 Eliminated (P11–16) —`} />{q2Group.map(r => <Row key={r.position} r={r} />)}</>}
        {q1Group.length > 0 && <><SectionDivider label={`— ${qualifier}1 Eliminated (P17–22) —`} />{q1Group.map(r => <Row key={r.position} r={r} />)}</>}
      </div>
    </div>
  )
}

export default function ResultsTab({ selectedRound }: { selectedRound: number }) {
  const weekend = RACE_WEEKENDS[selectedRound]
  const [activeSession, setActiveSession] = useState('fp1')

  const sessionTabs = [
    { id: 'fp1',               label: 'FP1',               available: !!weekend?.fp1 },
    { id: 'fp2',               label: 'FP2',               available: !weekend?.isSprint && !!weekend?.fp2 },
    { id: 'fp3',               label: 'FP3',               available: !weekend?.isSprint && !!weekend?.fp3 },
    { id: 'sprint-qualifying', label: 'Sprint Qualifying', available: !!weekend?.isSprint && !!weekend?.sprintQualifying },
    { id: 'sprint-race',       label: 'Sprint Race',       available: !!weekend?.isSprint && !!weekend?.sprintRace },
    { id: 'qualifying',        label: 'Qualifying',        available: !!weekend?.qualifying },
    { id: 'race',              label: 'Race',              available: !!weekend?.race },
  ].filter(t => t.available)

  // Reset to first available session when round changes
  useEffect(() => {
    setActiveSession(sessionTabs[0]?.id ?? 'fp1')
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRound])

  const effectiveSession = sessionTabs.some(t => t.id === activeSession) ? activeSession : sessionTabs[0]?.id ?? 'fp1'

  if (!weekend) {
    return (
      <div style={card}>
        <div style={{ padding: '40px', textAlign: 'center' as const, color: '#5A6A7A', fontSize: '13px' }}>
          No data available for this round
        </div>
      </div>
    )
  }

  function renderTable() {
    switch (effectiveSession) {
      case 'fp1':               return weekend.fp1              ? <PracticeTable data={weekend.fp1} /> : null
      case 'fp2':               return weekend.fp2              ? <PracticeTable data={weekend.fp2} /> : null
      case 'fp3':               return weekend.fp3              ? <PracticeTable data={weekend.fp3} /> : null
      case 'sprint-qualifying': return weekend.sprintQualifying ? <QualifyingTable data={weekend.sprintQualifying} qualifier="SQ" /> : null
      case 'sprint-race':       return weekend.sprintRace       ? <PracticeTable data={weekend.sprintRace} /> : null
      case 'qualifying':        return weekend.qualifying       ? <QualifyingTable data={weekend.qualifying} qualifier="Q" /> : null
      case 'race':              return weekend.race             ? <PracticeTable data={weekend.race} /> : null
      default: return null
    }
  }

  return (
    <div style={card}>
      <div style={cardHeader}>
        <span style={cardTitle}>
          <span style={{ fontFamily: 'Twemoji Country Flags, DM Sans, sans-serif', marginRight: '6px' }}>{weekend.flag}</span>
          {weekend.name} GP — Session Results
        </span>
        <span style={{ fontSize: '10px', fontWeight: 600, padding: '3px 8px', borderRadius: '4px', letterSpacing: '0.5px', textTransform: 'uppercase' as const, background: 'rgba(255,255,255,0.06)', color: '#5A6A7A' }}>2026 Results</span>
      </div>

      {/* Session tabs */}
      <div style={{ display: 'flex', gap: '6px', padding: '12px 20px', borderBottom: '1px solid rgba(255,255,255,0.07)', flexWrap: 'wrap' as const }}>
        {sessionTabs.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveSession(t.id)}
            style={{
              background: effectiveSession === t.id ? '#E8002D' : '#141B22',
              color: effectiveSession === t.id ? 'white' : '#5A6A7A',
              border: '1px solid',
              borderColor: effectiveSession === t.id ? '#E8002D' : 'rgba(255,255,255,0.07)',
              padding: '5px 14px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: 600,
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Table */}
      {renderTable() ?? (
        <div style={{ padding: '40px', textAlign: 'center' as const, color: '#5A6A7A', fontSize: '13px' }}>
          No data available for this session
        </div>
      )}
    </div>
  )
}
