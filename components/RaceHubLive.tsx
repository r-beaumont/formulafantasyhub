'use client'

import { useState, useEffect, useRef } from 'react'
import { DRIVERS } from '@/lib/drivers'

// ─── Types ────────────────────────────────────────────────────────────────────

interface PracticeRow {
  position: number
  driver_number: number
  name: string
  team: string
  team_colour: string
  time: string
  gap: string
}

interface QualRow {
  position: number
  driver_number: number
  name: string
  team: string
  team_colour: string
  q1: string | null
  q2: string | null
  q3: string | null
}

interface RaceRow {
  position: number
  driver_number: number
  name: string
  team: string
  team_colour: string
  gap: string
}

interface OpenF1Session {
  session_key: number
  session_name: string
  date_start: string
  date_end: string
}

interface SessionTab {
  id: string
  label: string
  session: OpenF1Session
}

// ─── Constants ────────────────────────────────────────────────────────────────

const GRID_NUMBERS = new Set(DRIVERS.map(d => d.number))

const pos_colors: Record<number, string> = { 1: '#FFD700', 2: '#C0C0C0', 3: '#CD7F32' }

const TEAM_COLOUR_MAP: Record<string, string> = {
  mclaren:      '#FF8000',
  mercedes:     '#27F4D2',
  redbull:      '#3671C6',
  ferrari:      '#E8002D',
  williams:     '#64C4FF',
  racingbulls:  '#6692FF',
  astonmartin:  '#358C75',
  haas:         '#B6BABD',
  audi:         '#C0C0C0',
  alpine:       '#FF69B4',
  cadillac:     '#CC0000',
}

const DRIVER_FLAG: Record<string, string> = Object.fromEntries(
  DRIVERS.map(d => [d.name, d.nationality])
)

// ─── Helpers ──────────────────────────────────────────────────────────────────

function sessionNameToTabId(name: string): { id: string; label: string } | null {
  const n = (name || '').toLowerCase().trim()
  if (n === 'practice 1')                                  return { id: 'fp1',               label: 'FP1' }
  if (n === 'practice 2')                                  return { id: 'fp2',               label: 'FP2' }
  if (n === 'practice 3')                                  return { id: 'fp3',               label: 'FP3' }
  if (n === 'sprint qualifying' || n === 'sprint shootout') return { id: 'sprint-qualifying', label: 'Sprint Qual' }
  if (n === 'sprint')                                      return { id: 'sprint-race',       label: 'Sprint' }
  if (n === 'qualifying')                                  return { id: 'qualifying',         label: 'Qualifying' }
  if (n === 'race')                                        return { id: 'race',               label: 'Race' }
  return null
}

type SessionStatus = 'active' | 'recent' | 'old'

function getSessionStatus(session: OpenF1Session): SessionStatus {
  if (!session?.date_start || !session?.date_end) return 'old'
  const now = Date.now()
  const start = new Date(session.date_start).getTime()
  const end   = new Date(session.date_end).getTime()
  if (now >= start && now <= end)                  return 'active'
  if (now > end && now <= end + 2 * 3600 * 1000)  return 'recent'
  return 'old'
}

function shortenTeam(team: string): string {
  return team
    .replace('Red Bull Racing', 'Red Bull')
    .replace('Haas F1 Team', 'Haas')
}

function padTo22Practice(rows: PracticeRow[]): PracticeRow[] {
  const gridRows = rows.filter(r => GRID_NUMBERS.has(r.driver_number))
  const seen = new Set(gridRows.map(r => r.driver_number))
  let pos = gridRows.length + 1
  const missing: PracticeRow[] = DRIVERS
    .filter(d => !seen.has(d.number))
    .map(d => ({
      position: pos++,
      driver_number: d.number,
      name: d.name,
      team: d.team,
      team_colour: TEAM_COLOUR_MAP[d.team] ?? d.teamColor,
      time: 'NO TIME SET',
      gap: 'NO TIME SET',
    }))
  return [...gridRows, ...missing]
}

function padTo22Qual(rows: QualRow[]): QualRow[] {
  const gridRows = rows.filter(r => GRID_NUMBERS.has(r.driver_number))
  const seen = new Set(gridRows.map(r => r.driver_number))
  let pos = gridRows.length + 1
  const missing: QualRow[] = DRIVERS
    .filter(d => !seen.has(d.number))
    .map(d => ({
      position: pos++,
      driver_number: d.number,
      name: d.name,
      team: d.team,
      team_colour: TEAM_COLOUR_MAP[d.team] ?? d.teamColor,
      q1: 'NO TIME SET',
      q2: null,
      q3: null,
    }))
  return [...gridRows, ...missing]
}

function padTo22Race(rows: RaceRow[]): RaceRow[] {
  const gridRows = rows.filter(r => GRID_NUMBERS.has(r.driver_number))
  const seen = new Set(gridRows.map(r => r.driver_number))
  let pos = gridRows.length + 1
  const missing: RaceRow[] = DRIVERS
    .filter(d => !seen.has(d.number))
    .map(d => ({
      position: pos++,
      driver_number: d.number,
      name: d.name,
      team: d.team,
      team_colour: TEAM_COLOUR_MAP[d.team] ?? d.teamColor,
      gap: 'NO TIME SET',
    }))
  return [...gridRows, ...missing]
}

function timeCell(t: string | null): { text: string; color: string } {
  if (!t)               return { text: '—',           color: '#3A4A5A' }
  if (t === 'NO TIME SET') return { text: 'NO TIME SET', color: '#3A4A5A' }
  return { text: t, color: '#F0F4F8' }
}

// ─── Shared styles ────────────────────────────────────────────────────────────

const card = {
  background: '#0E1318',
  border: '1px solid rgba(255,255,255,0.07)',
  borderRadius: '14px',
  overflow: 'hidden' as const,
}

const cardHeader = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '16px 20px 12px',
  borderBottom: '1px solid rgba(255,255,255,0.07)',
}

const cardTitle = {
  fontSize: '12px',
  fontWeight: 600,
  textTransform: 'uppercase' as const,
  letterSpacing: '1.5px',
  color: '#5A6A7A',
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatusBadge({ polling, concluded }: { polling: boolean; concluded: boolean }) {
  if (polling) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span className="live-dot" style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#E8002D', display: 'inline-block' }} />
        <span style={{ fontSize: '10px', fontWeight: 700, color: '#E8002D', letterSpacing: '1px' }}>LIVE</span>
      </div>
    )
  }
  if (concluded) {
    return (
      <span style={{ fontSize: '10px', fontWeight: 700, color: '#5A6A7A', letterSpacing: '1px', padding: '3px 8px', borderRadius: '4px', background: 'rgba(255,255,255,0.06)' }}>
        FINAL
      </span>
    )
  }
  return (
    <span style={{ fontSize: '10px', fontWeight: 600, padding: '3px 8px', borderRadius: '4px', letterSpacing: '0.5px', textTransform: 'uppercase' as const, background: 'rgba(255,255,255,0.06)', color: '#5A6A7A' }}>
      2026 Results
    </span>
  )
}

function SectionDivider({ label }: { label: string }) {
  return (
    <div style={{ padding: '5px 20px', background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.07)', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
      <span style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase' as const, color: '#3A4A5A' }}>
        {label}
      </span>
    </div>
  )
}

function DriverCell({ name }: { name: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', overflow: 'hidden' }}>
      {DRIVER_FLAG[name] && (
        <span className={`fi fi-${DRIVER_FLAG[name]}`} style={{ width: '1.2em', borderRadius: '2px', display: 'inline-block', flexShrink: 0 }} />
      )}
      <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', fontWeight: 500, whiteSpace: 'nowrap' as const, overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {name}
      </span>
    </div>
  )
}

function PracticeTable({ data }: { data: PracticeRow[] }) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <div style={{ minWidth: '520px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '36px 4px 1fr 120px 120px 100px', gap: '0 12px', padding: '8px 20px 6px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          {['POS', '', 'DRIVER', 'TEAM', 'TIME', 'GAP'].map((h, i) => (
            <span key={i} style={{ fontSize: '10px', color: '#5A6A7A', fontWeight: 600, textTransform: 'uppercase' as const, textAlign: i >= 4 ? 'right' as const : 'left' as const }}>{h}</span>
          ))}
        </div>
        {data.map(r => {
          const t = timeCell(r.time)
          const g = timeCell(r.gap)
          return (
            <div key={r.position} style={{ display: 'grid', gridTemplateColumns: '36px 4px 1fr 120px 120px 100px', gap: '0 12px', alignItems: 'center', minHeight: '46px', padding: '0 20px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', fontWeight: r.position <= 3 ? 700 : 400, color: pos_colors[r.position] ?? '#5A6A7A' }}>{r.position}</span>
              <div style={{ width: '4px', height: '28px', borderRadius: '2px', background: r.team_colour }} />
              <DriverCell name={r.name} />
              <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: '#5A6A7A', whiteSpace: 'nowrap' as const, overflow: 'hidden', textOverflow: 'ellipsis' }}>{shortenTeam(r.team)}</span>
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', color: r.position === 1 ? '#FFB800' : t.color, textAlign: 'right' as const, whiteSpace: 'nowrap' as const }}>{t.text}</span>
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', color: g.color, textAlign: 'right' as const, whiteSpace: 'nowrap' as const }}>{r.position === 1 ? '—' : g.text}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function QualifyingTable({ data, qualifier = 'Q' }: { data: QualRow[]; qualifier?: string }) {
  const reachedQ3 = data.filter(r => r.position <= 10)
  const reachedQ2 = data.filter(r => r.position > 10 && r.position <= 16)
  const q1Only    = data.filter(r => r.position > 16)

  const Row = ({ r }: { r: QualRow }) => {
    const dimmed = r.position > 10 && r.position <= 16
    const muted  = r.position > 16
    const q1c = timeCell(r.q1)
    const q2c = timeCell(r.q2)
    const q3c = timeCell(r.q3)
    return (
      <div style={{ display: 'grid', gridTemplateColumns: '36px 4px 1fr 120px 110px 110px 110px', gap: '0 10px', alignItems: 'center', minHeight: '46px', padding: '0 20px', borderBottom: '1px solid rgba(255,255,255,0.04)', opacity: muted ? 0.5 : dimmed ? 0.75 : 1 }}>
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', fontWeight: r.position <= 3 ? 700 : 400, color: pos_colors[r.position] ?? '#5A6A7A' }}>{r.position}</span>
        <div style={{ width: '4px', height: '28px', borderRadius: '2px', background: r.team_colour }} />
        <DriverCell name={r.name} />
        <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: '#5A6A7A', whiteSpace: 'nowrap' as const, overflow: 'hidden', textOverflow: 'ellipsis' }}>{shortenTeam(r.team)}</span>
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: q1c.color, textAlign: 'right' as const, whiteSpace: 'nowrap' as const }}>{q1c.text}</span>
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: q2c.color, textAlign: 'right' as const, whiteSpace: 'nowrap' as const }}>{q2c.text}</span>
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', fontWeight: r.q3 && r.position <= 3 ? 700 : 400, color: r.position === 1 && r.q3 ? '#FFB800' : q3c.color, textAlign: 'right' as const, whiteSpace: 'nowrap' as const }}>{q3c.text}</span>
      </div>
    )
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <div style={{ minWidth: '620px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '36px 4px 1fr 120px 110px 110px 110px', gap: '0 10px', padding: '8px 20px 6px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          {['POS', '', 'DRIVER', 'TEAM', `${qualifier}1`, `${qualifier}2`, `${qualifier}3`].map((h, i) => (
            <span key={i} style={{ fontSize: '10px', color: '#5A6A7A', fontWeight: 600, textTransform: 'uppercase' as const, textAlign: i >= 4 ? 'right' as const : 'left' as const }}>{h}</span>
          ))}
        </div>
        {reachedQ3.map(r => <Row key={r.position} r={r} />)}
        {reachedQ2.length > 0 && (
          <>
            <SectionDivider label={`— ${qualifier}2 Eliminated (P11–16) —`} />
            {reachedQ2.map(r => <Row key={r.position} r={r} />)}
          </>
        )}
        {q1Only.length > 0 && (
          <>
            <SectionDivider label={`— ${qualifier}1 Eliminated (P17–22) —`} />
            {q1Only.map(r => <Row key={r.position} r={r} />)}
          </>
        )}
      </div>
    </div>
  )
}

function RaceTable({ data }: { data: RaceRow[] }) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <div style={{ minWidth: '480px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '36px 4px 1fr 140px 120px', gap: '0 12px', padding: '8px 20px 6px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          {['POS', '', 'DRIVER', 'TEAM', 'GAP'].map((h, i) => (
            <span key={i} style={{ fontSize: '10px', color: '#5A6A7A', fontWeight: 600, textTransform: 'uppercase' as const, textAlign: i >= 4 ? 'right' as const : 'left' as const }}>{h}</span>
          ))}
        </div>
        {data.map(r => {
          const g = timeCell(r.gap)
          return (
            <div key={r.position} style={{ display: 'grid', gridTemplateColumns: '36px 4px 1fr 140px 120px', gap: '0 12px', alignItems: 'center', minHeight: '46px', padding: '0 20px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', fontWeight: r.position <= 3 ? 700 : 400, color: pos_colors[r.position] ?? '#5A6A7A' }}>{r.position}</span>
              <div style={{ width: '4px', height: '28px', borderRadius: '2px', background: r.team_colour }} />
              <DriverCell name={r.name} />
              <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: '#5A6A7A', whiteSpace: 'nowrap' as const, overflow: 'hidden', textOverflow: 'ellipsis' }}>{shortenTeam(r.team)}</span>
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', color: r.position === 1 ? '#FFB800' : g.color, textAlign: 'right' as const, whiteSpace: 'nowrap' as const }}>{r.position === 1 ? '—' : g.text}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

interface Props {
  meeting_key: number | string
  flag?: string
  name?: string
  isSprint?: boolean
}

export default function RaceHubLive({ meeting_key, flag, name, isSprint = false }: Props) {
  const [sessionTabs, setSessionTabs]   = useState<SessionTab[]>([])
  const [activeTab, setActiveTab]       = useState<string>('')
  const [loadingSessions, setLoadingSessions] = useState(true)

  const [practiceData, setPracticeData] = useState<PracticeRow[] | null>(null)
  const [qualData,     setQualData]     = useState<QualRow[] | null>(null)
  const [raceData,     setRaceData]     = useState<RaceRow[] | null>(null)
  const [loadingData,  setLoadingData]  = useState(false)
  const [isPolling,    setIsPolling]    = useState(false)
  const [isConcluded,  setIsConcluded]  = useState(false)

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const retryRef    = useRef<ReturnType<typeof setInterval> | null>(null)

  // Fetch sessions on mount
  useEffect(() => {
    setLoadingSessions(true)
    fetch(`/api/f1/sessions?meeting_key=${meeting_key}`)
      .then(r => r.ok ? r.json() : [])
      .then((data: any[]) => {
        if (!Array.isArray(data)) return
        const TAB_ORDER = ['fp1', 'fp2', 'fp3', 'sprint-qualifying', 'sprint-race', 'qualifying', 'race']
        const tabs: SessionTab[] = []
        for (const s of data) {
          const mapped = sessionNameToTabId(s.session_name)
          if (!mapped) continue
          // For sprint weekends, skip FP2/FP3; for standard, skip sprint tabs
          if (isSprint && (mapped.id === 'fp2' || mapped.id === 'fp3')) continue
          if (!isSprint && (mapped.id === 'sprint-qualifying' || mapped.id === 'sprint-race')) continue
          tabs.push({ ...mapped, session: s })
        }
        tabs.sort((a, b) => TAB_ORDER.indexOf(a.id) - TAB_ORDER.indexOf(b.id))
        setSessionTabs(tabs)
        if (tabs.length > 0) setActiveTab(tabs[0].id)
      })
      .catch(() => {})
      .finally(() => setLoadingSessions(false))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meeting_key])

  // Fetch data when active tab changes
  useEffect(() => {
    if (!activeTab || sessionTabs.length === 0) return

    const tab = sessionTabs.find(t => t.id === activeTab)
    if (!tab) return

    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null }
    if (retryRef.current)    { clearInterval(retryRef.current);    retryRef.current    = null }
    setIsPolling(false)
    setIsConcluded(false)
    setPracticeData(null)
    setQualData(null)
    setRaceData(null)

    const sk = tab.session.session_key
    const isQual = activeTab === 'qualifying' || activeTab === 'sprint-qualifying'
    const isRace = activeTab === 'race' || activeTab === 'sprint-race'
    const status = getSessionStatus(tab.session)

    const doFetch = async (): Promise<boolean> => {
      try {
        if (isQual) {
          const res = await fetch(`/api/f1/qualifying?session_key=${sk}`, { cache: 'no-store' })
          if (res.ok) {
            const data = await res.json()
            const rows: QualRow[] = data.results ?? []
            if (rows.length > 0) {
              setQualData(padTo22Qual(rows))
              return true
            }
          }
        } else if (isRace) {
          const res = await fetch(`/api/f1/race?session_key=${sk}`, { cache: 'no-store' })
          if (res.ok) {
            const rows: RaceRow[] = await res.json()
            if (Array.isArray(rows) && rows.length > 0) {
              setRaceData(padTo22Race(rows))
              return true
            }
          }
        } else {
          const res = await fetch(`/api/f1/practice?session_key=${sk}`, { cache: 'no-store' })
          if (res.ok) {
            const rows = await res.json()
            const arr: PracticeRow[] = Array.isArray(rows) ? rows : []
            if (arr.length > 0) {
              setPracticeData(padTo22Practice(arr))
              return true
            }
          }
        }
      } catch { /* silent fail */ }
      return false
    }

    setLoadingData(true)
    doFetch().then(gotData => {
      setLoadingData(false)

      if (status === 'active') {
        setIsPolling(true)
        intervalRef.current = setInterval(async () => {
          const cur = getSessionStatus(tab.session)
          if (cur === 'active') {
            await doFetch()
          } else if (cur === 'recent') {
            setIsPolling(false)
            setIsConcluded(true)
            await doFetch()
            if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null }
          } else {
            setIsPolling(false)
            if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null }
          }
        }, 15000)
      } else if (status === 'recent') {
        setIsConcluded(true)
        intervalRef.current = setInterval(async () => {
          const cur = getSessionStatus(tab.session)
          if (cur === 'old') {
            if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null }
          } else {
            await doFetch()
          }
        }, 15000)
      } else if (tab.session.date_end && Date.now() > new Date(tab.session.date_end).getTime()) {
        setIsConcluded(true)
        if (!gotData) {
          retryRef.current = setInterval(async () => {
            const got = await doFetch()
            if (got && retryRef.current) {
              clearInterval(retryRef.current)
              retryRef.current = null
            }
          }, 30000)
        }
      }
    })

    return () => {
      if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null }
      if (retryRef.current)    { clearInterval(retryRef.current);    retryRef.current    = null }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, sessionTabs.length])

  // Final unmount cleanup
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      if (retryRef.current)    clearInterval(retryRef.current)
    }
  }, [])

  // ─── Loading state ───────────────────────────────────────────────────────
  if (loadingSessions) {
    return (
      <div style={card}>
        <div style={{ padding: '40px', textAlign: 'center' as const, color: '#5A6A7A', fontSize: '13px', fontFamily: 'DM Sans, sans-serif' }}>
          Loading session data…
        </div>
      </div>
    )
  }

  if (sessionTabs.length === 0) {
    return (
      <div style={card}>
        <div style={{ padding: '40px', textAlign: 'center' as const, color: '#5A6A7A', fontSize: '13px', fontFamily: 'DM Sans, sans-serif' }}>
          Session data not yet available
        </div>
      </div>
    )
  }

  // ─── Render table ────────────────────────────────────────────────────────

  function renderTable() {
    if (loadingData && !practiceData && !qualData && !raceData) {
      return (
        <div style={{ padding: '40px', textAlign: 'center' as const, color: '#5A6A7A', fontSize: '13px', fontFamily: 'DM Sans, sans-serif' }}>
          Loading live data…
        </div>
      )
    }
    const isQual = activeTab === 'qualifying' || activeTab === 'sprint-qualifying'
    const isRace = activeTab === 'race' || activeTab === 'sprint-race'
    const qualifier = activeTab === 'sprint-qualifying' ? 'SQ' : 'Q'

    if (isQual && qualData)     return <QualifyingTable data={qualData} qualifier={qualifier} />
    if (isRace && raceData)     return <RaceTable data={raceData} />
    if (!isQual && !isRace && practiceData) return <PracticeTable data={practiceData} />

    return (
      <div style={{ padding: '40px', textAlign: 'center' as const, color: '#5A6A7A', fontSize: '13px', fontFamily: 'DM Sans, sans-serif' }}>
        No data available yet
      </div>
    )
  }

  return (
    <div style={card}>
      {/* Header */}
      <div style={cardHeader}>
        <span style={cardTitle}>
          {flag && (
            <span className={`fi fi-${flag}`} style={{ width: '1.2em', borderRadius: '2px', display: 'inline-block', marginRight: '6px' }} />
          )}
          {name ? `${name} GP — Session Results` : 'Session Results'}
        </span>
        <StatusBadge polling={isPolling} concluded={isConcluded} />
      </div>

      {/* Session tabs */}
      <div style={{ display: 'flex', gap: '6px', padding: '12px 20px', borderBottom: '1px solid rgba(255,255,255,0.07)', flexWrap: 'wrap' as const }}>
        {sessionTabs.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            style={{
              background: activeTab === t.id ? 'rgba(232,0,45,0.15)' : '#141B22',
              color: activeTab === t.id ? '#E8002D' : '#5A6A7A',
              border: activeTab === t.id ? '1px solid rgba(232,0,45,0.4)' : '1px solid rgba(255,255,255,0.07)',
              borderRadius: '6px',
              padding: '5px 14px',
              cursor: 'pointer',
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.5px',
              textTransform: 'uppercase' as const,
              transition: 'all 0.15s',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Table */}
      {renderTable()}
    </div>
  )
}
