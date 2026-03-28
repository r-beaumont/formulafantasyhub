'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { RACE_WEEKENDS, type DriverResult, type QualifyingResult } from '@/lib/raceResults'
import { DRIVERS } from '@/lib/drivers'

// ─── Driver helpers ───────────────────────────────────────────────────────────

const DRIVER_FLAG: Record<string, string> = Object.fromEntries(DRIVERS.map(d => [d.name, d.nationality]))

const TEAM_DISPLAY: Record<string, { name: string; color: string }> = {
  mclaren:     { name: 'McLaren',         color: '#FF8000' },
  mercedes:    { name: 'Mercedes',        color: '#27F4D2' },
  redbull:     { name: 'Red Bull Racing', color: '#3671C6' },
  ferrari:     { name: 'Ferrari',         color: '#E8002D' },
  williams:    { name: 'Williams',        color: '#64C4FF' },
  racingbulls: { name: 'Racing Bulls',    color: '#6692FF' },
  astonmartin: { name: 'Aston Martin',    color: '#358C75' },
  haas:        { name: 'Haas',            color: '#B6BABD' },
  audi:        { name: 'Audi',            color: '#C0C0C0' },
  alpine:      { name: 'Alpine',          color: '#FF69B4' },
  cadillac:    { name: 'Cadillac',        color: '#CC0000' },
}

/** Pad live API results to always show all 22 drivers (matched by driver_number). */
function padTo22Practice(rows: any[]): DriverResult[] {
  const seenNums = new Set(rows.map((r: any) => r.driver_number as number))
  let nextPos = rows.length + 1
  const missing: DriverResult[] = DRIVERS
    .filter(d => !seenNums.has(d.number))
    .map(d => ({
      position: nextPos++,
      name: d.name,
      team: TEAM_DISPLAY[d.team]?.name ?? d.team,
      team_colour: d.teamColor,
      time: 'NO TIME SET',
      gap: 'NO TIME SET',
    }))
  return [...rows, ...missing]
}

function padTo22Qualifying(rows: any[]): QualifyingResult[] {
  const seenNums = new Set(rows.map((r: any) => r.driver_number as number))
  let nextPos = rows.length + 1
  const missing: QualifyingResult[] = DRIVERS
    .filter(d => !seenNums.has(d.number))
    .map(d => ({
      position: nextPos++,
      name: d.name,
      team: TEAM_DISPLAY[d.team]?.name ?? d.team,
      team_colour: d.teamColor,
      q1: null,
      q2: null,
      q3: null,
      time: '—',
    }))
  return [...rows, ...missing]
}

// ─── Session helpers ──────────────────────────────────────────────────────────

function sessionNameToTabId(name: string): string | null {
  const n = (name || '').toLowerCase().trim()
  if (n === 'practice 1') return 'fp1'
  if (n === 'practice 2') return 'fp2'
  if (n === 'practice 3') return 'fp3'
  if (n === 'sprint qualifying' || n === 'sprint shootout') return 'sprint-qualifying'
  if (n === 'sprint') return 'sprint-race'
  if (n === 'qualifying') return 'qualifying'
  if (n === 'race') return 'race'
  return null
}

type SessionStatus = 'active' | 'recent' | 'old'

function getSessionStatus(session: any): SessionStatus {
  if (!session?.date_start || !session?.date_end) return 'old'
  const now = Date.now()
  const start = new Date(session.date_start).getTime()
  const end = new Date(session.date_end).getTime()
  if (now >= start && now <= end) return 'active'
  if (now > end && now <= end + 2 * 3600 * 1000) return 'recent'
  return 'old'
}

// ─── Shared styles ────────────────────────────────────────────────────────────

const card = { background: '#0E1318', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', overflow: 'hidden' as const }
const cardHeader = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px 12px', borderBottom: '1px solid rgba(255,255,255,0.07)' }
const cardTitle = { fontSize: '12px', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '1.5px', color: '#5A6A7A' }
const posColors: Record<number, string> = { 1: '#FFD700', 2: '#C0C0C0', 3: '#CD7F32' }

function shortenTeam(team: string): string {
  return team
    .replace('Red Bull Racing', 'Red Bull')
    .replace('Haas F1 Team', 'Haas')
}

// ─── ScrollTable ──────────────────────────────────────────────────────────────

function ScrollTable({ children, minW }: { children: React.ReactNode; minW: number }) {
  const topRef = useRef<HTMLDivElement>(null)
  const botRef = useRef<HTMLDivElement>(null)
  const syncingRef = useRef(false)

  const onTopScroll = useCallback(() => {
    if (syncingRef.current) return
    syncingRef.current = true
    if (botRef.current && topRef.current) botRef.current.scrollLeft = topRef.current.scrollLeft
    syncingRef.current = false
  }, [])

  const onBotScroll = useCallback(() => {
    if (syncingRef.current) return
    syncingRef.current = true
    if (topRef.current && botRef.current) topRef.current.scrollLeft = botRef.current.scrollLeft
    syncingRef.current = false
  }, [])

  return (
    <div>
      <div ref={topRef} onScroll={onTopScroll} style={{ overflowX: 'auto', overflowY: 'hidden', height: '12px' }}>
        <div style={{ width: `${minW}px`, height: '1px' }} />
      </div>
      <div ref={botRef} onScroll={onBotScroll} style={{ overflowX: 'auto', minWidth: 0 }}>
        <div style={{ minWidth: `${minW}px` }}>
          {children}
        </div>
      </div>
    </div>
  )
}

// ─── Time cell ────────────────────────────────────────────────────────────────

function timeCell(t: string | null): { text: string; color: string } {
  if (!t) return { text: '—', color: '#3A4A5A' }
  if (t === 'NO TIME SET') return { text: 'NO TIME SET', color: '#3A4A5A' }
  return { text: t, color: '#F0F4F8' }
}

// ─── PracticeTable ────────────────────────────────────────────────────────────

function PracticeTable({ data }: { data: DriverResult[] }) {
  return (
    <ScrollTable minW={500}>
      <div style={{ display: 'grid', gridTemplateColumns: '32px 4px 140px 110px 110px 110px', gap: '0 12px', padding: '8px 20px 6px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
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
          <div key={r.position} style={{ display: 'grid', gridTemplateColumns: '32px 4px 140px 110px 110px 110px', gap: '0 12px', alignItems: 'center', minHeight: '48px', padding: '0 20px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', fontWeight: r.position <= 3 ? 600 : 400, color: posColors[r.position] || '#5A6A7A' }}>{r.position}</span>
            <div style={{ width: '4px', height: '28px', borderRadius: '2px', background: r.team_colour }} />
            <div style={{ fontSize: '13px', fontWeight: 500, whiteSpace: 'nowrap' as const, overflow: 'hidden', textOverflow: 'ellipsis', display: 'flex', alignItems: 'center', gap: '6px' }}>
              {DRIVER_FLAG[r.name] && <span className={`fi fi-${DRIVER_FLAG[r.name]}`} style={{ width: '1.2em', borderRadius: '2px', display: 'inline-block', flexShrink: 0 }}></span>}
              {r.name}
            </div>
            <div style={{ fontSize: '12px', color: '#5A6A7A', whiteSpace: 'nowrap' as const, overflow: 'hidden', textOverflow: 'ellipsis' }}>{shortenTeam(r.team)}</div>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', color: r.position === 1 ? '#FFB800' : t.color, textAlign: 'right' as const }}>{t.text}</span>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', color: g.color, textAlign: 'right' as const }}>{r.position === 1 ? '—' : g.text}</span>
          </div>
        )
      })}
    </ScrollTable>
  )
}

// ─── SectionDivider ───────────────────────────────────────────────────────────

function SectionDivider({ label }: { label: string }) {
  return (
    <div style={{ padding: '6px 20px', background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.07)', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
      <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase' as const, color: '#3A4A5A' }}>{label}</span>
    </div>
  )
}

// ─── QualifyingTable ──────────────────────────────────────────────────────────

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
      <div style={{ display: 'grid', gridTemplateColumns: '32px 4px 140px 110px 110px 110px 110px', gap: '0 10px', alignItems: 'center', minHeight: '48px', padding: '0 20px', borderBottom: '1px solid rgba(255,255,255,0.04)', opacity: inQ1Only ? 0.5 : inQ2Only ? 0.72 : 1 }}>
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', fontWeight: r.position <= 3 ? 600 : 400, color: posColors[r.position] || '#5A6A7A' }}>{r.position}</span>
        <div style={{ width: '4px', height: '28px', borderRadius: '2px', background: r.team_colour }} />
        <div style={{ fontSize: '13px', fontWeight: 500, whiteSpace: 'nowrap' as const, overflow: 'hidden', textOverflow: 'ellipsis', display: 'flex', alignItems: 'center', gap: '6px' }}>
          {DRIVER_FLAG[r.name] && <span className={`fi fi-${DRIVER_FLAG[r.name]}`} style={{ width: '1.2em', borderRadius: '2px', display: 'inline-block', flexShrink: 0 }}></span>}
          {r.name}
        </div>
        <div style={{ fontSize: '12px', color: '#5A6A7A', whiteSpace: 'nowrap' as const, overflow: 'hidden', textOverflow: 'ellipsis' }}>{shortenTeam(r.team)}</div>
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: q1c.color, textAlign: 'right' as const }}>{q1c.text}</span>
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: q2c.color, textAlign: 'right' as const }}>{q2c.text}</span>
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', fontWeight: r.q3 && r.position <= 3 ? 600 : 400, color: r.position === 1 && r.q3 ? '#FFB800' : q3c.color, textAlign: 'right' as const }}>{q3c.text}</span>
      </div>
    )
  }

  return (
    <ScrollTable minW={580}>
      <div style={{ display: 'grid', gridTemplateColumns: '32px 4px 140px 110px 110px 110px 110px', gap: '0 10px', padding: '8px 20px 6px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
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
    </ScrollTable>
  )
}

// ─── LIVE / FINAL badge ───────────────────────────────────────────────────────

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
    return <span style={{ fontSize: '10px', fontWeight: 700, color: '#5A6A7A', letterSpacing: '1px', padding: '3px 8px', borderRadius: '4px', background: 'rgba(255,255,255,0.06)' }}>FINAL</span>
  }
  return <span style={{ fontSize: '10px', fontWeight: 600, padding: '3px 8px', borderRadius: '4px', letterSpacing: '0.5px', textTransform: 'uppercase' as const, background: 'rgba(255,255,255,0.06)', color: '#5A6A7A' }}>2026 Results</span>
}

// ─── Main ResultsTab ──────────────────────────────────────────────────────────

export default function ResultsTab({ selectedRound, sessions }: { selectedRound: number; sessions: any[] }) {
  const weekend = RACE_WEEKENDS[selectedRound]

  // Map OpenF1 session names → tab IDs
  const sessionMap: Record<string, any> = {}
  for (const s of (sessions || [])) {
    const tabId = sessionNameToTabId(s.session_name)
    if (tabId) sessionMap[tabId] = s
  }

  const isSprint = !!weekend?.isSprint

  // Build available session tabs
  const sessionTabs = [
    { id: 'fp1',               label: 'FP1',               available: !!weekend?.fp1 || !!sessionMap['fp1'] },
    { id: 'fp2',               label: 'FP2',               available: !isSprint && (!!weekend?.fp2 || !!sessionMap['fp2']) },
    { id: 'fp3',               label: 'FP3',               available: !isSprint && (!!weekend?.fp3 || !!sessionMap['fp3']) },
    { id: 'sprint-qualifying', label: 'Sprint Qualifying', available: isSprint && (!!weekend?.sprintQualifying || !!weekend?.sprintQualifyingKeys || !!sessionMap['sprint-qualifying']) },
    { id: 'sprint-race',       label: 'Sprint Race',       available: isSprint && (!!weekend?.sprintRace || !!sessionMap['sprint-race']) },
    { id: 'qualifying',        label: 'Qualifying',        available: !!weekend?.qualifying || !!weekend?.qualifyingKeys || !!sessionMap['qualifying'] },
    { id: 'race',              label: 'Race',              available: !!weekend?.race || !!sessionMap['race'] },
  ].filter(t => t.available)

  const [activeSession, setActiveSession] = useState(sessionTabs[0]?.id ?? 'fp1')
  const [livePracticeData, setLivePracticeData] = useState<DriverResult[] | null>(null)
  const [liveQualData, setLiveQualData] = useState<QualifyingResult[] | null>(null)
  const [loadingLive, setLoadingLive] = useState(false)
  const [isPolling, setIsPolling] = useState(false)
  const [isConcluded, setIsConcluded] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const retryRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const effectiveSession = sessionTabs.some(t => t.id === activeSession) ? activeSession : (sessionTabs[0]?.id ?? 'fp1')

  // Determine if the current tab has static data in RACE_WEEKENDS
  function tabHasStaticData(tab: string): boolean {
    if (!weekend) return false
    if (tab === 'fp1' && weekend.fp1) return true
    if (tab === 'fp2' && weekend.fp2) return true
    if (tab === 'fp3' && weekend.fp3) return true
    if (tab === 'sprint-qualifying' && (weekend.sprintQualifying || weekend.sprintQualifyingKeys)) return true
    if (tab === 'sprint-race' && weekend.sprintRace) return true
    if (tab === 'qualifying' && (weekend.qualifying || weekend.qualifyingKeys)) return true
    if (tab === 'race' && weekend.race) return true
    return false
  }

  // Reset everything on round change
  useEffect(() => {
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null }
    if (retryRef.current) { clearInterval(retryRef.current); retryRef.current = null }
    setActiveSession(sessionTabs[0]?.id ?? 'fp1')
    setLivePracticeData(null)
    setLiveQualData(null)
    setIsPolling(false)
    setIsConcluded(false)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRound])

  // Live fetch + polling — triggered by tab change, round change, or when session key becomes available
  const currentOpenF1Session = sessionMap[effectiveSession]
  const currentSessionKey = currentOpenF1Session?.session_key ?? null

  useEffect(() => {
    const tab = effectiveSession
    const openF1Sess = sessionMap[tab]

    // Clear any previous intervals
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null }
    if (retryRef.current) { clearInterval(retryRef.current); retryRef.current = null }
    setIsPolling(false)
    setIsConcluded(false)
    setLivePracticeData(null)
    setLiveQualData(null)

    // Skip if static data covers this tab
    if (tabHasStaticData(tab)) return
    // Skip if no live session key available yet
    if (!openF1Sess?.session_key) return

    const isQual = tab === 'qualifying' || tab === 'sprint-qualifying'
    const status = getSessionStatus(openF1Sess)

    // Returns true if actual data was received (not empty)
    const doFetch = async (): Promise<boolean> => {
      try {
        if (isQual) {
          const res = await fetch(`/api/f1/qualifying?session_key=${openF1Sess.session_key}`, { cache: 'no-store' })
          if (res.ok) {
            const data = await res.json()
            const results = data.results ?? []
            if (results.length > 0) {
              setLiveQualData(padTo22Qualifying(results))
              return true
            }
          }
        } else {
          const res = await fetch(`/api/f1/practice?session_key=${openF1Sess.session_key}`, { cache: 'no-store' })
          if (res.ok) {
            const raw = await res.json()
            const arr = Array.isArray(raw) ? raw : []
            if (arr.length > 0) {
              setLivePracticeData(padTo22Practice(arr))
              return true
            }
          }
        }
      } catch { /* silent fail */ }
      return false
    }

    // Initial fetch — move all post-fetch logic into .then() to avoid async effect
    setLoadingLive(true)
    doFetch().then(gotData => {
      setLoadingLive(false)

      if (status === 'active') {
        setIsPolling(true)
        intervalRef.current = setInterval(async () => {
          const currentStatus = getSessionStatus(openF1Sess)
          if (currentStatus === 'active') {
            await doFetch()
          } else if (currentStatus === 'recent') {
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
      } else if (openF1Sess?.date_end && Date.now() > new Date(openF1Sess.date_end).getTime()) {
        // Session ended — mark as concluded
        setIsConcluded(true)
        // If data was not available yet, retry every 30s in case OpenF1 is still processing
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
      if (retryRef.current) { clearInterval(retryRef.current); retryRef.current = null }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [effectiveSession, selectedRound, currentSessionKey])

  // Final unmount cleanup
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      if (retryRef.current) clearInterval(retryRef.current)
    }
  }, [])

  // ─── Handle old qualifying key mechanism (kept for backwards compat) ───────
  useEffect(() => {
    const tab = effectiveSession
    if (!tabHasStaticData(tab)) return
    if (tab !== 'qualifying' && tab !== 'sprint-qualifying') return
    const keys = tab === 'qualifying' ? weekend?.qualifyingKeys : weekend?.sprintQualifyingKeys
    if (!keys || weekend?.qualifying || weekend?.sprintQualifying) return

    const params = new URLSearchParams()
    if (keys.q1) params.set('q1_key', keys.q1)
    if (keys.q2) params.set('q2_key', keys.q2)
    if (keys.q3) params.set('q3_key', keys.q3)

    setLoadingLive(true)
    fetch(`/api/f1/qualifying?${params}`, { cache: 'no-store' })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.results) {
          if (tab === 'qualifying') setLiveQualData(data.results)
          else setLiveQualData(data.results)
        }
      })
      .catch(() => {})
      .finally(() => setLoadingLive(false))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [effectiveSession, selectedRound])

  // ─── Render table ─────────────────────────────────────────────────────────

  function renderTable() {
    const tab = effectiveSession

    if (loadingLive && !tabHasStaticData(tab) && !livePracticeData && !liveQualData) {
      return <div style={{ padding: '40px', textAlign: 'center' as const, color: '#5A6A7A', fontSize: '13px' }}>Loading live data…</div>
    }

    switch (tab) {
      case 'fp1':
        if (weekend?.fp1) return <PracticeTable data={weekend.fp1} />
        if (livePracticeData) return <PracticeTable data={livePracticeData} />
        return null
      case 'fp2':
        if (weekend?.fp2) return <PracticeTable data={weekend.fp2} />
        if (livePracticeData) return <PracticeTable data={livePracticeData} />
        return null
      case 'fp3':
        if (weekend?.fp3) return <PracticeTable data={weekend.fp3} />
        if (livePracticeData) return <PracticeTable data={livePracticeData} />
        return null
      case 'sprint-qualifying': {
        const sqData = weekend?.sprintQualifying ?? liveQualData
        if (sqData) return <QualifyingTable data={sqData} qualifier="SQ" />
        return null
      }
      case 'sprint-race':
        if (weekend?.sprintRace) return <PracticeTable data={weekend.sprintRace} />
        if (livePracticeData) return <PracticeTable data={livePracticeData} />
        return null
      case 'qualifying': {
        const qData = weekend?.qualifying ?? liveQualData
        if (qData) return <QualifyingTable data={qData} qualifier="Q" />
        return null
      }
      case 'race':
        if (weekend?.race) return <PracticeTable data={weekend.race} />
        if (livePracticeData) return <PracticeTable data={livePracticeData} />
        return null
      default:
        return null
    }
  }

  // ─── No data at all ───────────────────────────────────────────────────────

  if (!weekend && sessions.length === 0) {
    return (
      <div style={card}>
        <div style={{ padding: '40px', textAlign: 'center' as const, color: '#5A6A7A', fontSize: '13px' }}>
          No data available for this round
        </div>
      </div>
    )
  }

  if (sessionTabs.length === 0) {
    return (
      <div style={card}>
        <div style={{ padding: '40px', textAlign: 'center' as const, color: '#5A6A7A', fontSize: '13px' }}>
          Session data not yet available
        </div>
      </div>
    )
  }

  // ─── Render ───────────────────────────────────────────────────────────────

  const flag = weekend?.flag ?? (sessions[0] && 'jp')
  const name = weekend?.name ?? ''

  return (
    <div style={card}>
      {/* Card header */}
      <div style={cardHeader}>
        <span style={cardTitle}>
          {flag && <span className={`fi fi-${flag}`} style={{ width: '1.2em', borderRadius: '2px', display: 'inline-block', marginRight: '6px' }}></span>}
          {name} GP — Session Results
        </span>
        <StatusBadge polling={isPolling} concluded={isConcluded} />
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

      {/* Table content */}
      {renderTable() ?? (
        <div style={{ padding: '40px', textAlign: 'center' as const, color: '#5A6A7A', fontSize: '13px' }}>
          {loadingLive ? 'Loading live data…' : 'No data available yet — retrying automatically'}
        </div>
      )}
    </div>
  )
}
