'use client'

import { useState, useEffect, useRef } from 'react'
import { RACE_WEEKENDS } from '@/lib/raceResults'
import { DRIVERS } from '@/lib/drivers'

// ─── Types ────────────────────────────────────────────────────────────────────

interface PracticeRow {
  position: number
  driver_number: number
  name: string
  team: string
  team_colour: string
  time: string   // 'NO TIME SET' or formatted lap time
  gap: string
}

interface QualRow {
  position: number
  driver_number: number
  name: string
  team: string
  team_colour: string
  q1: string | null   // null = did not reach this segment, 'NO TIME SET' = participated but no time
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

// ─── Constants ────────────────────────────────────────────────────────────────

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

function shortenTeam(team: string): string {
  return team
    .replace('Red Bull Racing', 'Red Bull')
    .replace('Haas F1 Team', 'Haas')
}

/** Pad practice results to always show all 22 grid drivers.
 *  Filters out non-grid entries from the API before padding. */
function padTo22Practice(rows: PracticeRow[]): PracticeRow[] {
  const GRID_NUMBERS = new Set(DRIVERS.map(d => d.number))
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

/** Pad qualifying results to exactly 22 grid drivers.
 *  First filters out any non-grid driver_numbers from the API (test/reserve/safety car entries).
 *  Then pads any missing grid drivers with q1='NO TIME SET', q2=null, q3=null. */
function padTo22Qual(rows: QualRow[]): QualRow[] {
  const GRID_NUMBERS = new Set(DRIVERS.map(d => d.number))
  // Remove non-grid entries that the API may have returned
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

/** Pad race results to exactly 22 grid drivers.
 *  Filters out non-grid entries from the API before padding. */
function padTo22Race(rows: RaceRow[]): RaceRow[] {
  const GRID_NUMBERS = new Set(DRIVERS.map(d => d.number))
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

// ─── Shared card styles ───────────────────────────────────────────────────────

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

// ─── Time cell helper ─────────────────────────────────────────────────────────

function timeCell(t: string | null): { text: string; color: string } {
  if (!t) return { text: '—', color: '#3A4A5A' }
  if (t === 'NO TIME SET') return { text: 'NO TIME SET', color: '#3A4A5A' }
  return { text: t, color: '#F0F4F8' }
}

// ─── Status badge ─────────────────────────────────────────────────────────────

function StatusBadge({ polling, concluded }: { polling: boolean; concluded: boolean }) {
  if (polling) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span
          className="live-dot"
          style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#E8002D', display: 'inline-block' }}
        />
        <span style={{ fontSize: '10px', fontWeight: 700, color: '#E8002D', letterSpacing: '1px' }}>LIVE</span>
      </div>
    )
  }
  if (concluded) {
    return (
      <span style={{
        fontSize: '10px', fontWeight: 700, color: '#5A6A7A', letterSpacing: '1px',
        padding: '3px 8px', borderRadius: '4px', background: 'rgba(255,255,255,0.06)',
      }}>FINAL</span>
    )
  }
  return (
    <span style={{
      fontSize: '10px', fontWeight: 600, padding: '3px 8px', borderRadius: '4px',
      letterSpacing: '0.5px', textTransform: 'uppercase' as const,
      background: 'rgba(255,255,255,0.06)', color: '#5A6A7A',
    }}>2026 Results</span>
  )
}

// ─── Section divider ──────────────────────────────────────────────────────────

function SectionDivider({ label }: { label: string }) {
  return (
    <div style={{
      padding: '5px 20px',
      background: 'rgba(255,255,255,0.02)',
      borderBottom: '1px solid rgba(255,255,255,0.07)',
      borderTop: '1px solid rgba(255,255,255,0.07)',
    }}>
      <span style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase' as const, color: '#3A4A5A' }}>
        {label}
      </span>
    </div>
  )
}

// ─── Practice / Sprint Race Table ─────────────────────────────────────────────

function PracticeTable({ data }: { data: PracticeRow[] }) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <div style={{ minWidth: '520px' }}>
        {/* Header */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '36px 4px 1fr 120px 120px 100px',
          gap: '0 12px',
          padding: '8px 20px 6px',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
        }}>
          {['POS', '', 'DRIVER', 'TEAM', 'TIME', 'GAP'].map((h, i) => (
            <span key={i} style={{ fontSize: '10px', color: '#5A6A7A', fontWeight: 600, textTransform: 'uppercase' as const, textAlign: i >= 4 ? 'right' as const : 'left' as const }}>
              {h}
            </span>
          ))}
        </div>
        {/* Rows */}
        {data.map(r => {
          const t = timeCell(r.time)
          const g = timeCell(r.gap)
          return (
            <div
              key={r.position}
              style={{
                display: 'grid',
                gridTemplateColumns: '36px 4px 1fr 120px 120px 100px',
                gap: '0 12px',
                alignItems: 'center',
                minHeight: '46px',
                padding: '0 20px',
                borderBottom: '1px solid rgba(255,255,255,0.04)',
              }}
            >
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', fontWeight: r.position <= 3 ? 700 : 400, color: pos_colors[r.position] ?? '#5A6A7A' }}>
                {r.position}
              </span>
              <div style={{ width: '4px', height: '28px', borderRadius: '2px', background: r.team_colour }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', overflow: 'hidden' }}>
                {DRIVER_FLAG[r.name] && (
                  <span className={`fi fi-${DRIVER_FLAG[r.name]}`} style={{ width: '1.2em', borderRadius: '2px', display: 'inline-block', flexShrink: 0 }} />
                )}
                <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', fontWeight: 500, whiteSpace: 'nowrap' as const, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {r.name}
                </span>
              </div>
              <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: '#5A6A7A', whiteSpace: 'nowrap' as const, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {shortenTeam(r.team)}
              </span>
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', color: r.position === 1 ? '#FFB800' : t.color, textAlign: 'right' as const, whiteSpace: 'nowrap' as const }}>
                {t.text}
              </span>
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', color: g.color, textAlign: 'right' as const, whiteSpace: 'nowrap' as const }}>
                {r.position === 1 ? '—' : g.text}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Qualifying Table ─────────────────────────────────────────────────────────

function QualifyingTable({ data, qualifier = 'Q' }: { data: QualRow[]; qualifier?: string }) {
  const q3Group = data.filter(r => r.q3 != null && r.q3 !== 'NO TIME SET')
  const q2Only = data.filter(r => (r.q3 == null) && (r.q2 != null || (r.q2 === null && data.some(x => x.q2 != null))))

  // Determine groups by segment reached
  // Q1 = 22 drivers, Q2 = 16 (positions 1–16), Q3 = 10 (positions 1–10)
  const reachedQ3 = data.filter(r => r.position <= 10)
  const reachedQ2 = data.filter(r => r.position > 10 && r.position <= 16)
  const q1Only   = data.filter(r => r.position > 16)

  const Row = ({ r }: { r: QualRow }) => {
    const inQ1Only = r.position > 15
    const inQ2Only = r.position > 10 && r.position <= 15
    const q1c = timeCell(r.q1)
    const q2c = timeCell(r.q2)
    const q3c = timeCell(r.q3)
    return (
      <div style={{
        display: 'grid',
        gridTemplateColumns: '36px 4px 1fr 120px 110px 110px 110px',
        gap: '0 10px',
        alignItems: 'center',
        minHeight: '46px',
        padding: '0 20px',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
        opacity: inQ1Only ? 0.5 : inQ2Only ? 0.75 : 1,
      }}>
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', fontWeight: r.position <= 3 ? 700 : 400, color: pos_colors[r.position] ?? '#5A6A7A' }}>
          {r.position}
        </span>
        <div style={{ width: '4px', height: '28px', borderRadius: '2px', background: r.team_colour }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', overflow: 'hidden' }}>
          {DRIVER_FLAG[r.name] && (
            <span className={`fi fi-${DRIVER_FLAG[r.name]}`} style={{ width: '1.2em', borderRadius: '2px', display: 'inline-block', flexShrink: 0 }} />
          )}
          <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', fontWeight: 500, whiteSpace: 'nowrap' as const, overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {r.name}
          </span>
        </div>
        <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: '#5A6A7A', whiteSpace: 'nowrap' as const, overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {shortenTeam(r.team)}
        </span>
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: q1c.color, textAlign: 'right' as const, whiteSpace: 'nowrap' as const }}>
          {q1c.text}
        </span>
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: q2c.color, textAlign: 'right' as const, whiteSpace: 'nowrap' as const }}>
          {q2c.text}
        </span>
        <span style={{
          fontFamily: 'JetBrains Mono, monospace', fontSize: '11px',
          fontWeight: r.q3 && r.position <= 3 ? 700 : 400,
          color: r.position === 1 && r.q3 ? '#FFB800' : q3c.color,
          textAlign: 'right' as const,
          whiteSpace: 'nowrap' as const,
        }}>
          {q3c.text}
        </span>
      </div>
    )
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <div style={{ minWidth: '620px' }}>
        {/* Header */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '36px 4px 1fr 120px 110px 110px 110px',
          gap: '0 10px',
          padding: '8px 20px 6px',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
        }}>
          {['POS', '', 'DRIVER', 'TEAM', `${qualifier}1`, `${qualifier}2`, `${qualifier}3`].map((h, i) => (
            <span key={i} style={{ fontSize: '10px', color: '#5A6A7A', fontWeight: 600, textTransform: 'uppercase' as const, textAlign: i >= 4 ? 'right' as const : 'left' as const }}>
              {h}
            </span>
          ))}
        </div>
        {/* Q3 group */}
        {reachedQ3.map(r => <Row key={r.position} r={r} />)}
        {/* Q2 eliminated */}
        {reachedQ2.length > 0 && (
          <>
            <SectionDivider label={`— ${qualifier}2 Eliminated (P11–16) —`} />
            {reachedQ2.map(r => <Row key={r.position} r={r} />)}
          </>
        )}
        {/* Q1 eliminated */}
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

// ─── Race / Sprint Race Table ──────────────────────────────────────────────────

function RaceTable({ data }: { data: RaceRow[] }) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <div style={{ minWidth: '480px' }}>
        {/* Header */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '36px 4px 1fr 140px 120px',
          gap: '0 12px',
          padding: '8px 20px 6px',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
        }}>
          {['POS', '', 'DRIVER', 'TEAM', 'GAP'].map((h, i) => (
            <span key={i} style={{ fontSize: '10px', color: '#5A6A7A', fontWeight: 600, textTransform: 'uppercase' as const, textAlign: i >= 4 ? 'right' as const : 'left' as const }}>
              {h}
            </span>
          ))}
        </div>
        {/* Rows */}
        {data.map(r => {
          const g = timeCell(r.gap)
          return (
            <div
              key={r.position}
              style={{
                display: 'grid',
                gridTemplateColumns: '36px 4px 1fr 140px 120px',
                gap: '0 12px',
                alignItems: 'center',
                minHeight: '46px',
                padding: '0 20px',
                borderBottom: '1px solid rgba(255,255,255,0.04)',
              }}
            >
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', fontWeight: r.position <= 3 ? 700 : 400, color: pos_colors[r.position] ?? '#5A6A7A' }}>
                {r.position}
              </span>
              <div style={{ width: '4px', height: '28px', borderRadius: '2px', background: r.team_colour }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', overflow: 'hidden' }}>
                {DRIVER_FLAG[r.name] && (
                  <span className={`fi fi-${DRIVER_FLAG[r.name]}`} style={{ width: '1.2em', borderRadius: '2px', display: 'inline-block', flexShrink: 0 }} />
                )}
                <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', fontWeight: 500, whiteSpace: 'nowrap' as const, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {r.name}
                </span>
              </div>
              <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: '#5A6A7A', whiteSpace: 'nowrap' as const, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {shortenTeam(r.team)}
              </span>
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', color: r.position === 1 ? '#FFB800' : g.color, textAlign: 'right' as const, whiteSpace: 'nowrap' as const }}>
                {r.position === 1 ? '—' : g.text}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Main ResultsTab ──────────────────────────────────────────────────────────

export default function ResultsTab({ selectedRound, sessions }: { selectedRound: number; sessions: any[] }) {
  const weekend = RACE_WEEKENDS[selectedRound]

  // Map OpenF1 session_name → tab ID
  const sessionMap: Record<string, any> = {}
  for (const s of sessions ?? []) {
    const id = sessionNameToTabId(s.session_name)
    if (id) sessionMap[id] = s
  }

  const isSprint = !!weekend?.isSprint

  // Build available tabs
  const sessionTabs = [
    { id: 'fp1',               label: 'FP1',               available: !!weekend?.fp1 || !!sessionMap['fp1'] },
    { id: 'fp2',               label: 'FP2',               available: !isSprint && (!!weekend?.fp2 || !!sessionMap['fp2']) },
    { id: 'fp3',               label: 'FP3',               available: !isSprint && (!!weekend?.fp3 || !!sessionMap['fp3']) },
    { id: 'sprint-qualifying', label: 'Sprint Qual',       available: isSprint && !!sessionMap['sprint-qualifying'] },
    { id: 'sprint-race',       label: 'Sprint Race',       available: isSprint && !!sessionMap['sprint-race'] },
    { id: 'qualifying',        label: 'Qualifying',        available: !!weekend?.qualifying || !!sessionMap['qualifying'] },
    { id: 'race',              label: 'Race',              available: !!weekend?.race || !!sessionMap['race'] },
  ].filter(t => t.available)

  const [activeSession, setActiveSession] = useState(sessionTabs[0]?.id ?? 'fp1')
  const [livePracticeData,  setLivePracticeData]  = useState<PracticeRow[] | null>(null)
  const [liveQualData,      setLiveQualData]      = useState<QualRow[] | null>(null)
  const [liveRaceData,      setLiveRaceData]      = useState<RaceRow[] | null>(null)
  const [loadingLive,       setLoadingLive]       = useState(false)
  const [isPolling,         setIsPolling]         = useState(false)
  const [isConcluded,       setIsConcluded]       = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const retryRef    = useRef<ReturnType<typeof setInterval> | null>(null)

  const effectiveSession = sessionTabs.some(t => t.id === activeSession)
    ? activeSession
    : (sessionTabs[0]?.id ?? 'fp1')

  function tabHasStaticData(tab: string): boolean {
    if (!weekend) return false
    if (tab === 'fp1'              && weekend.fp1)              return true
    if (tab === 'fp2'              && weekend.fp2)              return true
    if (tab === 'fp3'              && weekend.fp3)              return true
    if (tab === 'sprint-qualifying'&& weekend.sprintQualifying) return true
    if (tab === 'sprint-race'      && weekend.sprintRace)       return true
    if (tab === 'qualifying'       && weekend.qualifying)       return true
    if (tab === 'race'             && weekend.race)             return true
    return false
  }

  // Clear everything when round changes
  useEffect(() => {
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null }
    if (retryRef.current)    { clearInterval(retryRef.current);    retryRef.current    = null }
    setActiveSession(sessionTabs[0]?.id ?? 'fp1')
    setLivePracticeData(null)
    setLiveQualData(null)
    setLiveRaceData(null)
    setIsPolling(false)
    setIsConcluded(false)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRound])

  const currentSessionKey = sessionMap[effectiveSession]?.session_key ?? null

  // Live fetch + polling
  useEffect(() => {
    const tab = effectiveSession
    const openF1Sess = sessionMap[tab]

    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null }
    if (retryRef.current)    { clearInterval(retryRef.current);    retryRef.current    = null }
    setIsPolling(false)
    setIsConcluded(false)
    setLivePracticeData(null)
    setLiveQualData(null)
    setLiveRaceData(null)

    if (tabHasStaticData(tab)) return
    if (!openF1Sess?.session_key) return

    const sk = openF1Sess.session_key
    const isQual  = tab === 'qualifying' || tab === 'sprint-qualifying'
    const isRace  = tab === 'race' || tab === 'sprint-race'
    const status  = getSessionStatus(openF1Sess)

    const doFetch = async (): Promise<boolean> => {
      try {
        if (isQual) {
          const res = await fetch(`/api/f1/qualifying?session_key=${sk}`, { cache: 'no-store' })
          if (res.ok) {
            const data = await res.json()
            const rows: QualRow[] = data.results ?? []
            if (rows.length > 0) {
              setLiveQualData(padTo22Qual(rows))
              return true
            }
          }
        } else if (isRace) {
          const res = await fetch(`/api/f1/race?session_key=${sk}`, { cache: 'no-store' })
          if (res.ok) {
            const rows: RaceRow[] = await res.json()
            if (Array.isArray(rows) && rows.length > 0) {
              setLiveRaceData(padTo22Race(rows))
              return true
            }
          }
        } else {
          // Practice sessions
          const res = await fetch(`/api/f1/practice?session_key=${sk}`, { cache: 'no-store' })
          if (res.ok) {
            const rows = await res.json()
            const arr: PracticeRow[] = Array.isArray(rows) ? rows : []
            if (arr.length > 0) {
              setLivePracticeData(padTo22Practice(arr))
              return true
            }
          }
        }
      } catch { /* silent fail */ }
      return false
    }

    setLoadingLive(true)
    doFetch().then(gotData => {
      setLoadingLive(false)

      if (status === 'active') {
        setIsPolling(true)
        intervalRef.current = setInterval(async () => {
          const cur = getSessionStatus(openF1Sess)
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
        // Keep refreshing for 2 hours after session end
        intervalRef.current = setInterval(async () => {
          const cur = getSessionStatus(openF1Sess)
          if (cur === 'old') {
            if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null }
          } else {
            await doFetch()
          }
        }, 15000)
      } else if (openF1Sess?.date_end && Date.now() > new Date(openF1Sess.date_end).getTime()) {
        setIsConcluded(true)
        // Retry every 30s if no data yet (OpenF1 may still be processing)
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
  }, [effectiveSession, selectedRound, currentSessionKey])

  // Final unmount cleanup
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      if (retryRef.current)    clearInterval(retryRef.current)
    }
  }, [])

  // ─── Render table ─────────────────────────────────────────────────────────

  function renderTable() {
    const tab = effectiveSession

    if (loadingLive && !tabHasStaticData(tab) && !livePracticeData && !liveQualData && !liveRaceData) {
      return (
        <div style={{ padding: '40px', textAlign: 'center' as const, color: '#5A6A7A', fontSize: '13px', fontFamily: 'DM Sans, sans-serif' }}>
          Loading live data…
        </div>
      )
    }

    switch (tab) {
      case 'fp1':
      case 'fp2':
      case 'fp3': {
        const staticKey = tab as 'fp1' | 'fp2' | 'fp3'
        if (weekend?.[staticKey]) return <PracticeTable data={weekend[staticKey] as PracticeRow[]} />
        if (livePracticeData)     return <PracticeTable data={livePracticeData} />
        return null
      }
      case 'sprint-qualifying': {
        const sq = weekend?.sprintQualifying as QualRow[] | undefined
        if (sq) return <QualifyingTable data={sq} qualifier="SQ" />
        if (liveQualData) return <QualifyingTable data={liveQualData} qualifier="SQ" />
        return null
      }
      case 'sprint-race': {
        if (weekend?.sprintRace) return <PracticeTable data={weekend.sprintRace as PracticeRow[]} />
        if (liveRaceData)        return <RaceTable data={liveRaceData} />
        if (livePracticeData)    return <PracticeTable data={livePracticeData} />
        return null
      }
      case 'qualifying': {
        const q = weekend?.qualifying as QualRow[] | undefined
        if (q) return <QualifyingTable data={q} qualifier="Q" />
        if (liveQualData) return <QualifyingTable data={liveQualData} qualifier="Q" />
        return null
      }
      case 'race': {
        if (weekend?.race) return <PracticeTable data={weekend.race as PracticeRow[]} />
        if (liveRaceData)  return <RaceTable data={liveRaceData} />
        return null
      }
      default:
        return null
    }
  }

  // ─── No data states ───────────────────────────────────────────────────────

  if (!weekend && (!sessions || sessions.length === 0)) {
    return (
      <div style={card}>
        <div style={{ padding: '40px', textAlign: 'center' as const, color: '#5A6A7A', fontSize: '13px', fontFamily: 'DM Sans, sans-serif' }}>
          No data available for this round
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

  const flag = weekend?.flag ?? (sessions?.[0] ? 'jp' : undefined)
  const name = weekend?.name ?? ''

  return (
    <div style={card}>
      {/* Header */}
      <div style={cardHeader}>
        <span style={cardTitle}>
          {flag && (
            <span
              className={`fi fi-${flag}`}
              style={{ width: '1.2em', borderRadius: '2px', display: 'inline-block', marginRight: '6px' }}
            />
          )}
          {name} GP — Session Results
        </span>
        <StatusBadge polling={isPolling} concluded={isConcluded} />
      </div>

      {/* Session tabs */}
      <div style={{
        display: 'flex', gap: '6px', padding: '12px 20px',
        borderBottom: '1px solid rgba(255,255,255,0.07)', flexWrap: 'wrap' as const,
      }}>
        {sessionTabs.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveSession(t.id)}
            style={{
              background:   effectiveSession === t.id ? '#E8002D' : '#141B22',
              color:        effectiveSession === t.id ? 'white'   : '#5A6A7A',
              border:       '1px solid',
              borderColor:  effectiveSession === t.id ? '#E8002D' : 'rgba(255,255,255,0.07)',
              padding:      '5px 14px',
              borderRadius: '6px',
              cursor:       'pointer',
              fontSize:     '12px',
              fontWeight:   600,
              fontFamily:   'DM Sans, sans-serif',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Table */}
      {renderTable() ?? (
        <div style={{ padding: '40px', textAlign: 'center' as const, color: '#5A6A7A', fontSize: '13px', fontFamily: 'DM Sans, sans-serif' }}>
          {loadingLive ? 'Loading live data…' : 'No data available yet — retrying automatically'}
        </div>
      )}
    </div>
  )
}
