'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { SEASON_CALENDAR, computeCurrentRace, type Race } from '@/lib/races'
import { useCurrentRace } from '@/lib/useCurrentRace'
import { circuitOverviewData, TRACK_SPEEDS, CIRCUIT_DESCRIPTIONS, pitwallData } from '@/lib/circuitOverview'

const card = { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '14px', overflow: 'hidden' as const }
const cardHeader = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px 12px', borderBottom: '1px solid var(--border)' }
const cardTitle = { fontSize: '12px', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '1.5px', color: 'var(--muted)' }

function Badge({ type, label }: { type: string; label: string }) {
  const map: Record<string, { bg: string; color: string }> = {
    live: { bg: 'rgba(232,0,45,0.15)', color: '#E8002D' },
    new: { bg: 'rgba(0,212,126,0.12)', color: '#00D47E' },
    race: { bg: 'rgba(255,184,0,0.12)', color: '#FFB800' },
    blue: { bg: 'rgba(0,168,255,0.12)', color: '#00A8FF' },
    done: { bg: 'rgba(255,255,255,0.06)', color: 'var(--muted)' },
  }
  const st = map[type] || map.live
  return <span style={{ fontSize: '10px', fontWeight: 600, padding: '3px 8px', borderRadius: '4px', letterSpacing: '0.5px', textTransform: 'uppercase' as const, background: st.bg, color: st.color }}>{label}</span>
}

function Loader({ label }: { label: string }) {
  return <div style={{ padding: '40px', textAlign: 'center' as const, color: 'var(--muted2)', fontFamily: 'JetBrains Mono, monospace', fontSize: '12px' }}>Loading {label}...</div>
}

// Format a session ISO date using the circuit's IANA timezone (Track mode)
// or the user's device timezone (Local mode). Returns separate date and time labels.
function formatSessionDateTime(
  isoDate: string,
  timezone: string,
  useLocal: boolean
): { dateLabel: string; timeLabel: string } {
  const d = new Date(isoDate)
  if (useLocal) {
    return {
      dateLabel: d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }),
      timeLabel: d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
    }
  }
  const tzAbbr = new Intl.DateTimeFormat('en-US', { timeZone: timezone, timeZoneName: 'short' })
    .formatToParts(d)
    .find(p => p.type === 'timeZoneName')?.value ?? ''
  return {
    dateLabel: d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', timeZone: timezone }),
    timeLabel: d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: timezone }) + (tzAbbr ? ` ${tzAbbr}` : ''),
  }
}

function formatTime(seconds: number | null | undefined): string {
  if (!seconds) return '—'
  const mins = Math.floor(seconds / 60)
  const secs = (seconds % 60).toFixed(3).padStart(6, '0')
  return mins > 0 ? `${mins}:${secs}` : `${secs}s`
}

function formatDelta(seconds: number | null | undefined): string {
  if (!seconds) return '—'
  return `+${seconds.toFixed(3)}s`
}

export default function RaceHubClient() {
  const currentRace = useCurrentRace()
  const [activeTab, setActiveTab] = useState<'overview' | 'race-info' | 'weather' | 'pitwall'>('overview')
  const [selectedRound, setSelectedRound] = useState(() => computeCurrentRace(new Date()).round)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  // Read URL params on mount (?round=N&tab=results deep-link from standings)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const roundParam = params.get('round')
    const tabParam = params.get('tab')
    if (roundParam) {
      const n = parseInt(roundParam, 10)
      if (!isNaN(n)) setSelectedRound(n)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const [sessions, setSessions] = useState<any[]>([])
const [standings, setStandings] = useState<{ drivers: any[]; constructors: any[] }>({ drivers: [], constructors: [] })
  const [weather, setWeather] = useState<any>(null)
  const [currentConditions, setCurrentConditions] = useState<any>(null)
  const [forecast, setForecast] = useState<any>(null)
  const [forecastLoading, setForecastLoading] = useState(false)
  const [loading, setLoading] = useState(true)
  const [useLocalTime, setUseLocalTime] = useState(false)

  const selectedRace = SEASON_CALENDAR.find(r => r.round === selectedRound) || SEASON_CALENDAR[1]

  useEffect(() => {
    // Always clear stale data from previous round immediately
    setSessions([])
    setWeather(null)
    setCurrentConditions(null)

    async function load() {
      setLoading(true)
      try {
        const standRes = await fetch('/api/f1/standings')
        const standData = await standRes.json()
        setStandings(standData)

        if (selectedRace.meeting_key) {
          // Use 'latest' only when the race weekend has actually started — otherwise OpenF1
          // 'latest' returns the previous race's data, leaking stale weather into future rounds
          const weekendStarted = selectedRace.weekendStartISO
            ? new Date(selectedRace.weekendStartISO + 'T00:00:00Z').getTime() <= Date.now()
            : false
          const meetingParam = (selectedRound === currentRace.round && weekendStarted)
            ? 'latest'
            : selectedRace.meeting_key
          const sessRes = await fetch(`/api/f1/sessions?meeting_key=${meetingParam}`)
          const sessData = await sessRes.json()
          setSessions(Array.isArray(sessData) ? sessData : [])

          if (Array.isArray(sessData) && sessData.length) {
            // Only fetch weather for sessions that have already started
            const now = Date.now()
            const started = sessData.filter((s: any) => s.date_start && new Date(s.date_start).getTime() <= now)
            if (started.length > 0) {
              const weatherSess = started[started.length - 1]
              const weatherRes = await fetch(`/api/f1/weather?session_key=${weatherSess.session_key}`)
              const weatherData = await weatherRes.json()
              setWeather(weatherData)
            }
          }
        }
      } catch (e) { console.error(e) }
      finally { setLoading(false) }
    }
    load()
  }, [selectedRound])

  // Refresh track conditions every 20 minutes
  useEffect(() => {
    if (!sessions.length) return
    const poll = async () => {
      try {
        const now = Date.now()
        const started = sessions.filter((s: any) => s.date_start && new Date(s.date_start).getTime() <= now)
        if (started.length === 0) return
        const weatherSess = started[started.length - 1]
        const res = await fetch(`/api/f1/weather?session_key=${weatherSess.session_key}`)
        const data = await res.json()
        if (data && !data.error) setWeather(data)
      } catch {}
    }
    const id = setInterval(poll, 20 * 60 * 1000)
    return () => clearInterval(id)
  }, [sessions])

  // Fetch ambient conditions from Open-Meteo, refresh every 60 minutes
  useEffect(() => {
    if (!selectedRace.lat || !selectedRace.lon) return
    const fetchConditions = async () => {
      try {
        const res = await fetch(`/api/current-conditions?lat=${selectedRace.lat}&lon=${selectedRace.lon}`)
        const data = await res.json()
        if (data && !data.error) setCurrentConditions(data)
      } catch {}
    }
    fetchConditions()
    const id = setInterval(fetchConditions, 60 * 60 * 1000)
    return () => clearInterval(id)
  }, [selectedRound])

  useEffect(() => {
    if (!selectedRace.lat || !selectedRace.lon || !selectedRace.weekendStartISO) return
    setForecastLoading(true)
    setForecast(null)
    // Mon before the weekend to Sunday of race day = 7 days
    const friday = new Date(selectedRace.weekendStartISO + 'T12:00:00Z')
    const monday = new Date(friday)
    monday.setUTCDate(friday.getUTCDate() - 4)
    const sunday = new Date(friday)
    sunday.setUTCDate(friday.getUTCDate() + 2)
    const startDate = monday.toISOString().slice(0, 10)
    const endDate = sunday.toISOString().slice(0, 10)
    fetch(`/api/forecast?lat=${selectedRace.lat}&lon=${selectedRace.lon}&start_date=${startDate}&end_date=${endDate}`)
      .then(r => r.json())
      .then(data => setForecast(data))
      .catch(() => {})
      .finally(() => setForecastLoading(false))
  }, [selectedRound])

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'race-info', label: 'Race Info' },
    { id: 'weather', label: 'Weather' },
    { id: 'pitwall', label: 'Pitwall' },
  ]

  return (
    <div className="mob-pad-page" style={{ position: 'relative', zIndex: 1, maxWidth: '1400px', margin: '0 auto', padding: '28px 32px 60px' }}>

      {/* Header + Dropdown */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '20px', gap: '20px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <div style={{ width: '3px', height: '24px', background: '#E8002D', borderRadius: '2px' }} />
            <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '2px', color: '#E8002D', textTransform: 'uppercase' as const }}>Race Hub</span>
          </div>
          <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(2.5rem,5vw,3.5rem)', letterSpacing: '1px', lineHeight: 1, marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '12px', fontWeight: 400, margin: '0 0 4px' }}>
            <span className={`fi fi-${selectedRace.flag}`} style={{ width: '1.2em', borderRadius: '2px', display: 'inline-block', fontSize: 'clamp(2rem,4vw,2.8rem)' }}></span>
            <span>{selectedRace.name} Grand Prix</span>
          </h1>
          <div style={{ color: 'var(--muted)', fontSize: '13px' }}>
            {selectedRace.circuit} · Round {selectedRace.round} of 23 · {selectedRace.sprint ? '⚡ Sprint Weekend' : 'Standard Weekend'}
          </div>
        </div>

        {/* Race Weekend Dropdown — custom (native select can't render emoji on Windows) */}
        <div style={{ flexShrink: 0, position: 'relative' as const }}>
          <div style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '1px', color: 'var(--muted)', textTransform: 'uppercase' as const, marginBottom: '8px' }}>Select Race Weekend</div>
          <div style={{ position: 'relative' as const }}>
            {/* Visible selected value */}
            <div
              onClick={() => setDropdownOpen(o => !o)}
              style={{
                background: 'var(--surface2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px',
                color: 'var(--text)', padding: '10px 40px 10px 14px', fontSize: '13px', fontWeight: 500,
                cursor: 'pointer', minWidth: '240px', userSelect: 'none' as const,
                display: 'flex', alignItems: 'center', gap: '8px',
              }}
            >
              <span className={`fi fi-${selectedRace.flag}`} style={{ width: '1.2em', borderRadius: '2px', display: 'inline-block' }}></span>
              <span>R{selectedRace.round} — {selectedRace.name}</span>
              {selectedRace.sprint && <span style={{ fontSize: '11px', color: '#E8002D' }}>⚡</span>}
              {selectedRace.completed && <span style={{ fontSize: '11px', color: '#00D47E' }}>✓</span>}
              <span style={{ marginLeft: 'auto', color: 'var(--muted)', fontSize: '11px' }}>▼</span>
            </div>
            {/* Dropdown list */}
            {dropdownOpen && (
              <div style={{
                position: 'absolute' as const, top: 'calc(100% + 4px)', left: 0, right: 0,
                background: 'var(--surface2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px',
                zIndex: 100, maxHeight: '320px', overflowY: 'auto' as const,
                boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
              }}>
                {SEASON_CALENDAR.map(race => {
                  const isCalledOff = (race as any).calledOff
                  return (
                    <div
                      key={race.round}
                      onClick={() => { if (!isCalledOff) { setSelectedRound(race.round); setDropdownOpen(false) } }}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '8px',
                        padding: '9px 14px', cursor: isCalledOff ? 'default' : 'pointer', fontSize: '13px',
                        background: race.round === selectedRound ? 'rgba(232,0,45,0.1)' : 'transparent',
                        color: isCalledOff ? 'var(--muted2)' : race.round === selectedRound ? '#E8002D' : 'var(--text)',
                        borderBottom: '1px solid rgba(255,255,255,0.04)',
                        opacity: isCalledOff ? 0.5 : 1,
                      }}
                    >
                      <span className={`fi fi-${race.flag}`} style={{ width: '1.2em', borderRadius: '2px', display: 'inline-block' }}></span>
                      <span>R{race.round} — {race.name}</span>
                      {race.sprint && !isCalledOff && <span style={{ fontSize: '10px', color: '#E8002D' }}>⚡</span>}
                      {isCalledOff && <span style={{ fontSize: '9px', color: 'var(--muted)', marginLeft: 'auto', fontWeight: 600 }}>CANCELLED</span>}
                      {race.completed && !isCalledOff && <span style={{ fontSize: '10px', color: '#00D47E', marginLeft: 'auto' }}>✓</span>}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tab nav */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '20px', borderBottom: '1px solid var(--border)', overflowX: 'auto', WebkitOverflowScrolling: 'touch', whiteSpace: 'nowrap' }}>
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} style={{
            background: activeTab === tab.id ? 'rgba(232,0,45,0.1)' : 'transparent',
            color: activeTab === tab.id ? '#E8002D' : 'var(--muted)',
            border: 'none', borderBottom: activeTab === tab.id ? '2px solid #E8002D' : '2px solid transparent',
            padding: '10px 20px', cursor: 'pointer', fontSize: '13px', fontWeight: 600,
            letterSpacing: '0.3px', transition: 'all 0.2s', borderRadius: '6px 6px 0 0',
            flexShrink: 0,
          }}>{tab.label}</button>
        ))}
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && (() => {
        const overview = circuitOverviewData[selectedRound]
        const gridImportanceConfig: Record<string, { bg: string; color: string; label: string }> = {
          HIGH:   { bg: 'rgba(232,0,45,0.15)',    color: '#E8002D', label: 'Qualifying position critical' },
          MEDIUM: { bg: 'rgba(255,128,0,0.15)',   color: '#FF8000', label: 'Passing possible but grid position remains important' },
          LOW:    { bg: 'rgba(0,200,81,0.15)',     color: '#00C851', label: 'Overtaking-friendly circuit' },
          TBC:    { bg: 'rgba(90,106,122,0.15)',   color: 'var(--muted)', label: 'No data yet — debut race' },
        }
        const gi = overview ? gridImportanceConfig[overview.gridImportance] || gridImportanceConfig.TBC : gridImportanceConfig.TBC

        if (!overview) {
          return (
            <div style={{ ...card, padding: '40px', textAlign: 'center' as const }}>
              <div style={{ fontSize: '14px', color: 'var(--muted)' }}>Overview data coming soon for this circuit.</div>
            </div>
          )
        }

        // Full winner name + team lookup for display
        const winnerDisplayMap: Record<string, string> = {
          'L. Norris':     'Lando Norris (McLaren)',
          'O. Piastri':    'Oscar Piastri (McLaren)',
          'G. Russell':    'George Russell (Mercedes)',
          'M. Verstappen': 'Max Verstappen (Red Bull)',
        }
        const winnerDisplay = overview.lastWinner ? (winnerDisplayMap[overview.lastWinner] ?? overview.lastWinner) : null
        const trackSpeed = TRACK_SPEEDS[selectedRound] ?? '—'
        const circuitDescription = CIRCUIT_DESCRIPTIONS[selectedRound] ?? ''

        // DNF risk indicator config
        const dnfAvgNum = typeof overview.dnfHistory.avg === 'number' ? overview.dnfHistory.avg : null
        const dnfRisk = dnfAvgNum !== null
          ? dnfAvgNum >= 3.0
            ? { label: 'HIGH',   color: '#E8002D', bg: 'rgba(232,0,45,0.15)',    desc: 'High DNF risk historically' }
            : dnfAvgNum >= 1.5
            ? { label: 'MEDIUM', color: '#FF8700', bg: 'rgba(255,135,0,0.15)',   desc: 'Moderate DNF risk historically' }
            : { label: 'LOW',    color: '#00C851', bg: 'rgba(0,200,81,0.15)',    desc: 'Low DNF risk historically' }
          : null

        return (
          <div className="mob-1col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>

            {/* CARD 1 — CIRCUIT SNAPSHOT + CIRCUIT RECORDS (merged) */}
            <div style={card}>
              <div style={cardHeader}>
                <span style={cardTitle}>Circuit Snapshot</span>
              </div>
              <div style={{ padding: '20px' }}>

                {/* ── TOP HALF: CIRCUIT FACTS ── */}
                {winnerDisplay && (
                  <div style={{ background: 'var(--surface2)', borderRadius: '10px', padding: '12px 16px', marginBottom: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', fontWeight: 500, textTransform: 'uppercase' as const, letterSpacing: '0.08em', color: 'var(--muted)' }}>2025 Winner</div>
                    <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', fontWeight: 600, color: 'var(--text)' }}>{winnerDisplay}</div>
                  </div>
                )}

                {/* 4-cell 2×2 stat grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '20px' }}>
                  {[
                    { label: 'Total GPs', value: overview.totalGPs === 0 ? '—' : String(overview.totalGPs) },
                    { label: 'First GP', value: String(overview.firstGP) },
                    { label: 'Circuit Length', value: overview.circuitLength },
                    { label: 'Track Speed', value: trackSpeed },
                  ].map(stat => (
                    <div key={stat.label} style={{ background: 'var(--surface2)', borderRadius: '10px', padding: '16px 12px', textAlign: 'center' as const }}>
                      <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '22px', fontWeight: 700, color: 'var(--text)', lineHeight: 1 }}>{stat.value}</div>
                      <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', fontWeight: 500, textTransform: 'uppercase' as const, letterSpacing: '0.08em', color: 'var(--muted)', marginTop: '6px' }}>{stat.label}</div>
                    </div>
                  ))}
                </div>

                {/* Circuit Background subsection */}
                <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', fontWeight: 500, textTransform: 'uppercase' as const, letterSpacing: '0.08em', color: 'var(--muted)', marginBottom: '10px' }}>Circuit Background</div>
                {circuitDescription && (
                  <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', fontWeight: 400, color: '#8A9BB0', lineHeight: 1.6, margin: '0 0 24px' }}>{circuitDescription}</p>
                )}

                {/* ── DIVIDER ── */}
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '24px' }}>

                  {/* ── BOTTOM HALF: CIRCUIT RECORDS ── */}
                  <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', fontWeight: 500, textTransform: 'uppercase' as const, letterSpacing: '0.08em', color: 'var(--muted)', marginBottom: '12px' }}>Circuit Records</div>

                  {overview.isDebut ? (
                    <div style={{ border: '1px solid rgba(232,0,45,0.3)', borderRadius: '10px', background: 'rgba(232,0,45,0.07)', padding: '20px', marginTop: '12px' }}>
                      <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '16px', letterSpacing: '1px', color: '#E8002D', marginBottom: '10px' }}>Debut Race 2026</div>
                      <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', fontWeight: 400, color: '#8A9AB0', lineHeight: 1.7, margin: 0 }}>{overview.debutMessage}</p>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '0' }}>
                      {[
                        { label: 'Most Race Wins (Driver)',           value: overview.mostWinsDriver,       count: overview.mostWinsDriverCount },
                        { label: 'Most Race Wins (Constructor)',      value: overview.mostWinsConstructor,  count: overview.mostWinsConstructorCount },
                        { label: 'Most Pole Positions (Driver)',      value: overview.mostPolesDriver,      count: overview.mostPolesDriverCount },
                        { label: 'Most Pole Positions (Constructor)', value: overview.mostPolesConstructor, count: overview.mostPolesConstructorCount },
                      ].map((row, i, arr) => (
                        <div key={row.label} style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', padding: '14px 0', borderBottom: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
                          <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', fontWeight: 400, color: '#8A9BB0', lineHeight: 1.4 }}>{row.label}</div>
                          <div style={{ textAlign: 'right' as const, flexShrink: 0 }}>
                            <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', fontWeight: 600, color: 'var(--text)' }}>{row.value}</div>
                            {row.count != null && (
                              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', color: '#E8002D', marginTop: '2px' }}>{row.count}×</div>
                            )}
                          </div>
                        </div>
                      ))}
                      {overview.circuitNote && (
                        <div style={{ marginTop: '12px', fontSize: '11px', color: 'var(--muted)', fontStyle: 'italic' }}>{overview.circuitNote}</div>
                      )}
                    </div>
                  )}

                </div>
              </div>
            </div>

            {/* CARD 2 — TRACK PROFILE */}
            <div style={card}>
              <div style={cardHeader}>
                <span style={cardTitle}>Racing Profile</span>
              </div>
              <div style={{ padding: '20px' }}>

                {/* ── SECTION 1: OVERTAKING ── */}
                <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase' as const, color: 'var(--muted)', marginBottom: '14px' }}>Overtaking</div>

                {overview.overtakes2023 === null && overview.overtakes2024 === null && overview.overtakes2025 === null ? (
                  <div style={{ textAlign: 'center' as const, color: 'var(--muted)', fontSize: '13px', padding: '8px 0 16px' }}>No historical data — debut circuit</div>
                ) : (
                  <>
                    {/* Large average — above year table */}
                    <div style={{ textAlign: 'center' as const, marginBottom: '16px' }}>
                      <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '52px', fontWeight: 700, color: 'var(--text)', lineHeight: 1 }}>{overview.avgOvertakes}</div>
                      <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '4px' }}>Average Overtakes per Race ({overview.overtakeSeasonsLabel})</div>
                    </div>
                    {/* Year table */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '7px', marginBottom: '12px' }}>
                      {([
                        { year: '2023', val: overview.overtakes2023 },
                        { year: '2024', val: overview.overtakes2024 },
                        { year: '2025', val: overview.overtakes2025 },
                      ] as { year: string; val: number | null }[]).map(({ year, val }) => (
                        <div key={year} style={{ background: 'var(--surface2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '12px 8px', textAlign: 'center' as const }}>
                          <div style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase' as const, color: val !== null ? '#E8002D' : 'rgba(255,255,255,0.2)', marginBottom: '6px' }}>{year}</div>
                          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '24px', fontWeight: 700, color: val !== null ? 'var(--text)' : 'rgba(255,255,255,0.2)', lineHeight: 1 }}>{val !== null ? val : '—'}</div>
                        </div>
                      ))}
                    </div>
                    {/* Grid Importance Indicator */}
                    <div>
                      <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase' as const, color: 'var(--muted)', marginBottom: '8px' }}>Grid Importance Indicator</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: gi.bg, borderRadius: '8px', padding: '12px 14px' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: gi.color, flexShrink: 0 }} />
                        <div>
                          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', fontWeight: 700, color: gi.color }}>{overview.gridImportance}</div>
                          <div style={{ fontSize: '11px', color: '#8A9AB0', marginTop: '2px', lineHeight: 1.4 }}>{gi.label}</div>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* ── DIVIDER ── */}
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', marginTop: '24px', paddingTop: '24px' }}>

                  {/* ── SECTION 2: DNF HISTORY ── */}
                  <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase' as const, color: 'var(--muted)', marginBottom: '14px' }}>DNF History (Incl. DSQs)</div>

                  {overview.dnfHistory.y2023 === null && overview.dnfHistory.y2024 === null && overview.dnfHistory.y2025 === null ? (
                    <div style={{ textAlign: 'center' as const, color: 'var(--muted)', fontSize: '13px', padding: '8px 0' }}>No historical data — debut circuit</div>
                  ) : (
                    <>
                      {/* Large average — above year table */}
                      <div style={{ textAlign: 'center' as const, marginBottom: '16px' }}>
                        <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '52px', fontWeight: 700, color: 'var(--text)', lineHeight: 1 }}>{overview.dnfHistory.avg}</div>
                        <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '4px' }}>Average DNFs per Race (2023–2025)</div>
                      </div>
                      {/* Year table */}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '7px', marginBottom: '12px' }}>
                        {([
                          { year: '2023', val: overview.dnfHistory.y2023 },
                          { year: '2024', val: overview.dnfHistory.y2024 },
                          { year: '2025', val: overview.dnfHistory.y2025 },
                        ] as { year: string; val: number | null }[]).map(({ year, val }) => (
                          <div key={year} style={{ background: 'var(--surface2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '12px 8px', textAlign: 'center' as const }}>
                            <div style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase' as const, color: val !== null ? '#E8002D' : 'rgba(255,255,255,0.2)', marginBottom: '6px' }}>{year}</div>
                            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '24px', fontWeight: 700, color: val !== null ? 'var(--text)' : 'rgba(255,255,255,0.2)', lineHeight: 1 }}>{val !== null ? val : '—'}</div>
                          </div>
                        ))}
                      </div>
                      {/* DNF Risk Indicator */}
                      {dnfRisk && (
                        <div>
                          <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase' as const, color: 'var(--muted)', marginBottom: '8px' }}>DNF Risk Indicator</div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: dnfRisk.bg, borderRadius: '8px', padding: '12px 14px' }}>
                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: dnfRisk.color, flexShrink: 0 }} />
                            <div>
                              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', fontWeight: 700, color: dnfRisk.color }}>{dnfRisk.label}</div>
                              <div style={{ fontSize: '11px', color: '#8A9AB0', marginTop: '2px', lineHeight: 1.4 }}>{dnfRisk.desc}</div>
                            </div>
                          </div>
                          <div style={{ fontSize: '10px', color: 'var(--muted2)', marginTop: '8px', lineHeight: 1.6 }}>
                            <span style={{ color: '#00C851' }}>Low</span>{' '}&lt; 1.5 DNFs &nbsp;·&nbsp; <span style={{ color: '#FF8700' }}>Medium</span>{' '}1.5–3.0 DNFs &nbsp;·&nbsp; <span style={{ color: '#E8002D' }}>High</span>{' '}&gt;3.0 DNFs
                          </div>
                        </div>
                      )}
                    </>
                  )}

                </div>
              </div>
            </div>

          </div>
        )
      })()}

      {/* RACE INFO TAB */}
      {activeTab === 'race-info' && (() => {
        const raceTimezone = selectedRace?.timezone ?? 'UTC'
        const now = new Date()
        const shortMap: Record<string, string> = {
          'Practice 1': 'FP1', 'Practice 2': 'FP2', 'Practice 3': 'FP3',
          'Sprint Qualifying': 'SQ', 'Sprint': 'SPR',
          'Qualifying': 'QUAL', 'Race': 'RACE',
        }

        // Build a unified session list for all 23 rounds using a single data structure.
        // Priority: CURRENT_RACE static data (current round) → SEASON_CALENDAR sessions → OpenF1 fallback (R1/R2).
        type USession = { name: string; short: string; isoDate: string; isCompleted: boolean }
        let displaySessions: USession[] = []

        if (selectedRound === currentRace.round) {
          // Current race — use hook's race which has per-session completed flags
          displaySessions = currentRace.sessions.map(s => ({
            name: s.name,
            short: s.short ?? shortMap[s.name] ?? s.name,
            isoDate: s.dateISO ?? '',
            isCompleted: s.completed,
          }))
        } else {
          const calSessions = SEASON_CALENDAR.find(r => r.round === selectedRound)?.sessions
          if (calSessions?.length) {
            // All other rounds with calendar data (R3–R23 except current)
            displaySessions = calSessions.map(s => ({
              name: s.name,
              short: shortMap[s.name] ?? s.name,
              isoDate: s.date,
              isCompleted: new Date(s.date).getTime() + (s.duration ?? 120) * 60 * 1000 < now.getTime(),
            }))
          } else if (sessions.length > 0) {
            // R1/R2 fallback — completed races with OpenF1 data
            displaySessions = sessions.map((s: any) => ({
              name: s.session_name,
              short: shortMap[s.session_name] ?? s.session_name,
              isoDate: s.date_start ?? '',
              isCompleted: s.date_start ? new Date(s.date_start) < now : true,
            }))
          }
        }

        return (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
            <div style={card}>
              <div style={cardHeader}>
                <span style={cardTitle}>Session Schedule</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ display: 'flex', background: 'var(--surface2)', borderRadius: '6px', border: '1px solid var(--border)', overflow: 'hidden' }}>
                    <button onClick={() => setUseLocalTime(false)} style={{ background: !useLocalTime ? 'rgba(232,0,45,0.15)' : 'transparent', color: !useLocalTime ? '#E8002D' : 'var(--muted)', border: 'none', padding: '4px 10px', cursor: 'pointer', fontSize: '10px', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.5px' }}>Track</button>
                    <button onClick={() => setUseLocalTime(true)}  style={{ background: useLocalTime  ? 'rgba(232,0,45,0.15)' : 'transparent', color: useLocalTime  ? '#E8002D' : 'var(--muted)', border: 'none', borderLeft: '1px solid var(--border)', padding: '4px 10px', cursor: 'pointer', fontSize: '10px', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.5px' }}>Local</button>
                  </div>
                  <Badge type={selectedRace.completed ? 'done' : 'live'} label={selectedRace.completed ? 'Completed' : 'Upcoming'} />
                </div>
              </div>
              <div style={{ padding: '16px 20px' }}>
                {loading ? <Loader label="sessions" /> : displaySessions.length === 0 ? (
                  <div style={{ color: 'var(--muted)', fontSize: '13px', padding: '20px 0' }}>Session data not available.</div>
                ) : displaySessions.map((s, i) => {
                  const { dateLabel, timeLabel } = s.isoDate
                    ? formatSessionDateTime(s.isoDate, raceTimezone, useLocalTime)
                    : { dateLabel: '—', timeLabel: '—' }
                  return (
                    <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 0', borderBottom: i < displaySessions.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none', opacity: s.isCompleted ? 0.45 : 1 }}>
                      <div style={{ width: '52px', fontFamily: 'Bebas Neue, sans-serif', fontSize: '12px', letterSpacing: '0.5px', color: s.isCompleted ? 'var(--muted2)' : '#8A9AB0', textAlign: 'center' as const, background: 'rgba(255,255,255,0.04)', padding: '4px 6px', borderRadius: '5px', flexShrink: 0 }}>
                        {s.short}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: s.isCompleted ? 'var(--muted2)' : 'var(--text)' }}>{s.name}</div>
                        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: 'var(--muted)', marginTop: '2px' }}>{dateLabel} · {timeLabel}</div>
                      </div>
                      {s.isCompleted && <span style={{ fontSize: '12px', color: '#00D47E', flexShrink: 0 }}>✓</span>}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )
      })()}

      {/* WEATHER TAB */}
      {activeTab === 'weather' && (() => {
        const wmoIcon = (code: number): string => {
          if (code === 0) return '☀️'
          if (code <= 2) return '🌤️'
          if (code === 3) return '☁️'
          if (code <= 48) return '🌫️'
          if (code <= 57) return '🌦️'
          if (code <= 67) return '🌧️'
          if (code <= 77) return '❄️'
          if (code <= 82) return '🌦️'
          if (code <= 84) return '🌨️'
          if (code <= 86) return '❄️'
          if (code <= 99) return '⛈️'
          return '🌡️'
        }
        const wmoLabel = (code: number): string => {
          if (code === 0) return 'Clear sky'
          if (code === 1) return 'Mainly clear'
          if (code === 2) return 'Partly cloudy'
          if (code === 3) return 'Overcast'
          if (code <= 48) return 'Foggy'
          if (code <= 55) return 'Drizzle'
          if (code <= 57) return 'Freezing drizzle'
          if (code <= 63) return 'Rain'
          if (code <= 67) return 'Heavy rain'
          if (code <= 75) return 'Snow'
          if (code <= 77) return 'Snow grains'
          if (code <= 82) return 'Rain showers'
          if (code <= 86) return 'Snow showers'
          if (code <= 99) return 'Thunderstorm'
          return 'Unknown'
        }

        const dailyData = forecast?.daily
        const forecastDays = dailyData
          ? dailyData.time.map((date: string, i: number) => ({
              date,
              maxTemp: dailyData.temperature_2m_max[i],
              minTemp: dailyData.temperature_2m_min[i],
              rainChance: dailyData.precipitation_probability_max[i],
              windMax: dailyData.wind_speed_10m_max[i],
              code: dailyData.weather_code[i],
            }))
          : []

        return (
          <div className="mob-1col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            {/* Live Track Conditions */}
            <div style={card}>
              <div style={cardHeader}>
                <span style={cardTitle}>Live Track Conditions</span>
                {weather ? <Badge type="live" label="Live" /> : <Badge type="new" label="Open-Meteo" />}
              </div>
              <div style={{ padding: '20px' }}>
                {loading ? <Loader label="weather" /> : weather ? (
                  <div className="mob-2col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    {[
                      { label: 'Air Temp', value: `${weather.air_temperature?.toFixed(1) ?? '—'}°C`, icon: '🌡️' },
                      { label: 'Track Temp', value: `${weather.track_temperature?.toFixed(1) ?? '—'}°C`, icon: '🏎️' },
                      { label: 'Wind Speed', value: `${weather.wind_speed?.toFixed(1) ?? '—'} m/s`, icon: '💨' },
                      { label: 'Wind Dir', value: `${weather.wind_direction ?? '—'}°`, icon: '🧭' },
                      { label: 'Humidity', value: `${weather.humidity?.toFixed(0) ?? '—'}%`, icon: '💧' },
                      { label: 'Pressure', value: `${weather.pressure?.toFixed(1) ?? '—'} hPa`, icon: '📊' },
                      { label: 'Rainfall', value: weather.rainfall ? 'Yes 🌧️' : 'No ☀️', icon: '🌦️' },
                    ].map((stat) => (
                      <div key={stat.label} style={{ background: 'var(--surface2)', borderRadius: '8px', padding: '14px' }}>
                        <div style={{ fontSize: '11px', color: 'var(--muted)', textTransform: 'uppercase' as const, letterSpacing: '1px', marginBottom: '6px' }}>{stat.icon} {stat.label}</div>
                        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '18px', fontWeight: 600 }}>{stat.value}</div>
                      </div>
                    ))}
                  </div>
                ) : currentConditions ? (
                  <>
                    <div style={{ fontSize: '10px', color: 'var(--muted)', marginBottom: '12px', letterSpacing: '0.5px' }}>
                      Ambient conditions — live session data available during race weekends
                    </div>
                    <div className="mob-2col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      {[
                        { label: 'Air Temp', value: `${currentConditions.temperature_2m?.toFixed(1) ?? '—'}°C`, icon: '🌡️' },
                        { label: 'Track Temp', value: 'N/A', icon: '🏎️' },
                        { label: 'Wind Speed', value: `${(currentConditions.wind_speed_10m ?? 0).toFixed(1)} km/h`, icon: '💨' },
                        { label: 'Wind Dir', value: `${currentConditions.wind_direction_10m ?? '—'}°`, icon: '🧭' },
                        { label: 'Humidity', value: `${currentConditions.relative_humidity_2m?.toFixed(0) ?? '—'}%`, icon: '💧' },
                        { label: 'Pressure', value: `${currentConditions.surface_pressure?.toFixed(1) ?? '—'} hPa`, icon: '📊' },
                        { label: 'Rainfall', value: (currentConditions.precipitation ?? 0) > 0 ? `${currentConditions.precipitation?.toFixed(1)} mm 🌧️` : 'None ☀️', icon: '🌦️' },
                      ].map((stat) => (
                        <div key={stat.label} style={{ background: 'var(--surface2)', borderRadius: '8px', padding: '14px' }}>
                          <div style={{ fontSize: '11px', color: 'var(--muted)', textTransform: 'uppercase' as const, letterSpacing: '1px', marginBottom: '6px' }}>{stat.icon} {stat.label}</div>
                          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '18px', fontWeight: 600 }}>{stat.value}</div>
                        </div>
                      ))}
                    </div>
                    {currentConditions.weather_code !== undefined && (
                      <div style={{ marginTop: '12px', padding: '10px 14px', background: 'var(--surface2)', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '20px' }}>{wmoIcon(currentConditions.weather_code)}</span>
                        <span style={{ fontSize: '13px', color: '#8A9AB0' }}>{wmoLabel(currentConditions.weather_code)}</span>
                      </div>
                    )}
                  </>
                ) : (
                  <div style={{ color: 'var(--muted)', fontSize: '13px' }}>No conditions data available</div>
                )}
              </div>
            </div>

            {/* Weekend Forecast */}
            <div style={card}>
              <div style={cardHeader}>
                <span style={cardTitle}>Weekend Forecast</span>
                <Badge type="new" label="Open-Meteo" />
              </div>
              <div style={{ padding: '20px' }}>
                {forecastLoading ? (
                  <Loader label="forecast" />
                ) : !selectedRace.lat ? (
                  <div style={{ color: 'var(--muted)', fontSize: '13px' }}>No location data available for this circuit</div>
                ) : forecastDays.length === 0 ? (
                  <div style={{ color: 'var(--muted)', fontSize: '13px' }}>Could not load forecast data</div>
                ) : (
                  <>
                    {[
                      { label: 'Pre-Weekend', days: forecastDays.slice(0, 4), accent: 'var(--muted)' },
                      { label: 'Race Weekend', days: forecastDays.slice(4, 7), accent: '#E8002D' },
                    ].map(section => (
                      <div key={section.label} style={{ marginBottom: '16px' }}>
                        <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase' as const, color: section.accent, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          {section.label === 'Race Weekend' && <div style={{ width: '6px', height: '6px', background: '#E8002D', borderRadius: '50%' }} />}
                          {section.label}
                        </div>
                        <div style={{ overflowX: 'auto' as const, margin: '0 -4px', padding: '0 4px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '6px', minWidth: '440px' }}>
                          {section.days.map((day: any) => {
                            const d = new Date(day.date + 'T12:00:00Z')
                            const dayLabel = d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'UTC' })
                            const rainHigh = day.rainChance >= 60
                            const rainMed = day.rainChance >= 30
                            const isRaceWeekend = section.label === 'Race Weekend'
                            return (
                              <div key={day.date} style={{ display: 'grid', gridTemplateColumns: '90px 28px 1fr auto auto auto', alignItems: 'center', gap: '8px', padding: '9px 12px', background: isRaceWeekend ? 'rgba(232,0,45,0.04)' : 'var(--surface2)', borderRadius: '8px', border: isRaceWeekend ? '1px solid rgba(232,0,45,0.12)' : '1px solid rgba(255,255,255,0.04)' }}>
                                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: isRaceWeekend ? 'var(--text)' : '#8A9AB0' }}>{dayLabel}</span>
                                <span style={{ fontSize: '18px', textAlign: 'center' as const }}>{wmoIcon(day.code)}</span>
                                <span style={{ fontSize: '11px', color: 'var(--muted)' }}>{wmoLabel(day.code)}</span>
                                <div style={{ textAlign: 'right' as const }}>
                                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', fontWeight: 600, color: 'var(--text)' }}>{Math.round(day.maxTemp)}°</span>
                                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: 'var(--muted)', marginLeft: '4px' }}>{Math.round(day.minTemp)}°</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                                  <span style={{ fontSize: '10px' }}>💧</span>
                                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', fontWeight: 600, color: rainHigh ? '#E8002D' : rainMed ? '#FFB800' : 'var(--muted)' }}>{day.rainChance}%</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                                  <span style={{ fontSize: '10px' }}>💨</span>
                                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: 'var(--muted)' }}>{Math.round(day.windMax)}<span style={{ fontSize: '9px' }}>km/h</span></span>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                        </div>
                      </div>
                    ))}
                    <div style={{ marginTop: '6px', fontSize: '10px', color: 'var(--muted2)', lineHeight: 1.6 }}>
                      Forecast data provided by Open-Meteo (open-meteo.com) · Updates hourly
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )
      })()}

      {/* PITWALL TAB */}
      {activeTab === 'pitwall' && (() => {
        const race = SEASON_CALENDAR.find(r => r.round === selectedRound)
        const raceName = race?.name || selectedRace.name


        const data = pitwallData[selectedRound]
        const downforceBars = [
          { label: 'Low',        level: 1 },
          { label: 'Med / Low',  level: 2 },
          { label: 'Medium',     level: 3 },
          { label: 'Med / High', level: 4 },
          { label: 'High',       level: 5 },
        ]

        return (
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '20px' }}>

            {/* Disclaimer banner for upcoming rounds */}

            {/* Madrid debut — no historical data */}
            {selectedRound === 14 ? (
              <div style={{ ...card, padding: '40px', textAlign: 'center' as const }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏙️</div>
                <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '28px', letterSpacing: '1px', color: 'var(--text)', marginBottom: '8px' }}>Circuit Debut</div>
                <div style={{ fontSize: '14px', color: 'var(--muted)', maxWidth: '480px', margin: '0 auto', lineHeight: 1.7 }}>
                  The Madring Street Circuit makes its Formula 1 debut in 2026. No historical pitwall data exists for this venue — tyre compound selection and race strategy information will be added once Pirelli confirm their allocation closer to the race weekend.
                </div>
              </div>
            ) : !data ? (
              <div style={{ ...card, padding: '40px', textAlign: 'center' as const }}>
                <div style={{ fontSize: '32px', marginBottom: '12px' }}>🏗️</div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)', marginBottom: '8px' }}>Pitwall data coming soon</div>
                <div style={{ fontSize: '13px', color: 'var(--muted)' }}>Tyre compound and strategy data for {raceName} will be added closer to race weekend.</div>
              </div>
            ) : (
              <>
                {/* Downforce */}
                <div style={card}>
                  <div style={cardHeader}>
                    <span style={cardTitle}>Aerodynamic Setup — Downforce Level</span>
                    <Badge type="blue" label={data.downforce} />
                  </div>
                  <div style={{ padding: '20px 24px' }}>
                    {/* Bar visualiser */}
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'flex-end', marginBottom: '16px' }}>
                      {downforceBars.map(bar => (
                        <div key={bar.level} style={{ flex: 1, display: 'flex', flexDirection: 'column' as const, alignItems: 'center', gap: '6px' }}>
                          <div style={{
                            width: '100%',
                            height: `${bar.level * 18}px`,
                            borderRadius: '4px 4px 0 0',
                            background: bar.level <= data.downforceLevel
                              ? bar.level === data.downforceLevel ? '#E8002D' : 'rgba(232,0,45,0.35)'
                              : 'rgba(255,255,255,0.06)',
                            transition: 'background 0.2s',
                          }} />
                          <span style={{ fontSize: '9px', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.5px', color: bar.level === data.downforceLevel ? 'var(--text)' : 'var(--muted2)', textAlign: 'center' as const, whiteSpace: 'nowrap' as const }}>{bar.label}</span>
                        </div>
                      ))}
                    </div>
                    <p style={{ fontSize: '13px', color: '#8A9AB0', lineHeight: 1.7, margin: 0 }}>{data.downforceNote}</p>
                  </div>
                </div>

                {/* Tyre Compounds */}
                <div style={card}>
                  <div style={cardHeader}>
                    <span style={cardTitle}>Tyre Compounds — <span className={`fi fi-${selectedRace.flag}`} style={{ width: '1.2em', borderRadius: '2px', display: 'inline-block' }}></span> {raceName} GP</span>
                    <Badge type="race" label="Pirelli" />
                  </div>
                  <div className="mob-1col" style={{ padding: '16px 24px 20px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
                    {data.compounds.map(c => (
                      <div key={c.name} style={{ background: 'var(--surface2)', borderRadius: '12px', padding: '18px', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column' as const, gap: '10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          {/* Tyre circle */}
                          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--surface)', border: `3px solid ${c.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', fontWeight: 700, color: c.color }}>{c.code}</span>
                          </div>
                          <div>
                            <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '18px', letterSpacing: '1px', color: c.color }}>{c.name}</div>
                            <div style={{ fontSize: '10px', fontWeight: 600, color: 'var(--muted2)', textTransform: 'uppercase' as const, letterSpacing: '1px' }}>Compound {c.code}</div>
                          </div>
                        </div>
                        <p style={{ fontSize: '12px', color: '#8A9AB0', lineHeight: 1.6, margin: 0 }}>{c.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Strategies */}
                <div style={card}>
                  <div style={cardHeader}>
                    <span style={cardTitle}>Expected Race Strategies</span>
                    <Badge type="new" label={`${data.strategies.length} Options`} />
                  </div>
                  <div style={{ padding: '16px 24px 20px', display: 'flex', flexDirection: 'column' as const, gap: '12px' }}>
                    {data.strategies.map((s, i) => (
                      <div key={i} style={{ background: 'var(--surface2)', borderRadius: '12px', padding: '18px', border: '1px solid rgba(255,255,255,0.06)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '4px', background: s.stops === 1 ? 'rgba(0,212,126,0.12)' : 'rgba(255,184,0,0.12)', color: s.stops === 1 ? '#00D47E' : '#FFB800' }}>
                            {s.stops}-Stop
                          </span>
                          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)' }}>{s.name}</span>
                        </div>
                        {/* Stint visualiser */}
                        <div style={{ display: 'flex', gap: '6px', marginBottom: '12px', flexWrap: 'wrap' as const }}>
                          {s.laps.map((stint, j) => {
                            const isPit = stint.startsWith('Pit')
                            const tyreColor = stint.includes('Hard') ? '#FFFFFF' : stint.includes('Medium') ? '#FFD700' : stint.includes('Soft') ? '#E8002D' : 'var(--muted)'
                            return (
                              <div key={j} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                {isPit ? (
                                  <span style={{ fontSize: '10px', fontWeight: 700, padding: '3px 8px', borderRadius: '4px', background: 'rgba(0,168,255,0.12)', color: '#00A8FF' }}>{stint}</span>
                                ) : (
                                  <span style={{ fontSize: '11px', fontWeight: 600, padding: '3px 10px', borderRadius: '4px', background: `${tyreColor}18`, color: tyreColor, border: `1px solid ${tyreColor}30` }}>{stint}</span>
                                )}
                                {j < s.laps.length - 1 && !isPit && <span style={{ color: 'var(--muted2)', fontSize: '10px' }}>→</span>}
                              </div>
                            )
                          })}
                        </div>
                        <p style={{ fontSize: '12px', color: '#8A9AB0', lineHeight: 1.6, margin: 0 }}>💡 {s.note}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        )
      })()}


    </div>
  )
}
