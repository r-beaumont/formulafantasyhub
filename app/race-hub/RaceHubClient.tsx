'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { SEASON_CALENDAR } from '@/lib/races'

const card = { background: '#0E1318', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', overflow: 'hidden' as const }
const cardHeader = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px 12px', borderBottom: '1px solid rgba(255,255,255,0.07)' }
const cardTitle = { fontSize: '12px', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '1.5px', color: '#5A6A7A' }

function Badge({ type, label }: { type: string; label: string }) {
  const map: Record<string, { bg: string; color: string }> = {
    live: { bg: 'rgba(232,0,45,0.15)', color: '#E8002D' },
    new: { bg: 'rgba(0,212,126,0.12)', color: '#00D47E' },
    race: { bg: 'rgba(255,184,0,0.12)', color: '#FFB800' },
    blue: { bg: 'rgba(0,168,255,0.12)', color: '#00A8FF' },
    done: { bg: 'rgba(255,255,255,0.06)', color: '#5A6A7A' },
  }
  const st = map[type] || map.live
  return <span style={{ fontSize: '10px', fontWeight: 600, padding: '3px 8px', borderRadius: '4px', letterSpacing: '0.5px', textTransform: 'uppercase' as const, background: st.bg, color: st.color }}>{label}</span>
}

function Loader({ label }: { label: string }) {
  return <div style={{ padding: '40px', textAlign: 'center' as const, color: '#3A4A5A', fontFamily: 'JetBrains Mono, monospace', fontSize: '12px' }}>Loading {label}...</div>
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
  const [activeTab, setActiveTab] = useState<'race-info' | 'results' | 'calendar' | 'weather'>('race-info')
  const [selectedRound, setSelectedRound] = useState(3)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [sessions, setSessions] = useState<any[]>([])
  const [results, setResults] = useState<any[]>([])
  const [standings, setStandings] = useState<{ drivers: any[]; constructors: any[] }>({ drivers: [], constructors: [] })
  const [weather, setWeather] = useState<any>(null)
  const [activeSession, setActiveSession] = useState<string>('race')
  const [loading, setLoading] = useState(true)
  const [resultsLoading, setResultsLoading] = useState(false)
  const [calendarRound, setCalendarRound] = useState<number | null>(null)
  const [calendarSessions, setCalendarSessions] = useState<any[]>([])
  const [calendarResults, setCalendarResults] = useState<any[]>([])
  const [calendarSessionTab, setCalendarSessionTab] = useState<string>('race')

  const selectedRace = SEASON_CALENDAR.find(r => r.round === selectedRound) || SEASON_CALENDAR[1]

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const standRes = await fetch('/api/f1/standings')
        const standData = await standRes.json()
        setStandings(standData)

        if (selectedRace.meeting_key) {
          const sessRes = await fetch(`/api/f1/sessions?meeting_key=${selectedRace.meeting_key}`)
          const sessData = await sessRes.json()
          setSessions(Array.isArray(sessData) ? sessData : [])

          if (sessData.length) {
            const latestSess = sessData[sessData.length - 1]
            const weatherRes = await fetch(`/api/f1/weather?session_key=${latestSess.session_key}`)
            const weatherData = await weatherRes.json()
            setWeather(weatherData)
          }
        }
      } catch (e) { console.error(e) }
      finally { setLoading(false) }
    }
    load()
  }, [selectedRound])

  const getSessionTabs = (sessList: any[]) => {
    const names = sessList.map((s: any) => (s.session_name || '').toLowerCase())
    return [
      { id: 'fp1', label: 'FP1', check: (n: string) => n.includes('practice 1') },
      { id: 'fp2', label: 'FP2', check: (n: string) => n.includes('practice 2') },
      { id: 'fp3', label: 'FP3', check: (n: string) => n.includes('practice 3') },
      { id: 'sprint-qualifying', label: 'Sprint Quali', check: (n: string) => n.includes('sprint qualifying') || n.includes('sprint shootout') },
      { id: 'sprint', label: 'Sprint', check: (n: string) => n === 'sprint' },
      { id: 'qualifying', label: 'Qualifying', check: (n: string) => n.includes('qualifying') && !n.includes('sprint') },
      { id: 'race', label: 'Race', check: (n: string) => n === 'race' },
    ].filter(t => names.some(t.check))
  }

  const fetchResultsForSession = useCallback(async (sessList: any[], sessionId: string, setter: (r: any[]) => void, loadSetter: (b: boolean) => void) => {
    const sessionMap: Record<string, any> = {}
    for (const s of sessList) {
      const name = (s.session_name || '').toLowerCase()
      if (name.includes('practice 1')) sessionMap['fp1'] = s
      else if (name.includes('practice 2')) sessionMap['fp2'] = s
      else if (name.includes('practice 3')) sessionMap['fp3'] = s
      else if (name.includes('sprint qualifying') || name.includes('sprint shootout')) sessionMap['sprint-qualifying'] = s
      else if (name === 'sprint') sessionMap['sprint'] = s
      else if (name.includes('qualifying') && !name.includes('sprint')) sessionMap['qualifying'] = s
      else if (name === 'race') sessionMap['race'] = s
    }
    const target = sessionMap[sessionId]
    if (!target) { setter([]); return }
    loadSetter(true)
    try {
      const res = await fetch(`/api/f1/results?session_key=${target.session_key}&session_type=${sessionId}`)
      const data = await res.json()
      setter(Array.isArray(data) ? data : [])
    } catch (e) { setter([]) }
    finally { loadSetter(false) }
  }, [])

  useEffect(() => {
    if (sessions.length) fetchResultsForSession(sessions, activeSession, setResults, setResultsLoading)
  }, [sessions, activeSession])

  useEffect(() => {
    if (calendarRound !== null) {
      const race = SEASON_CALENDAR.find(r => r.round === calendarRound)
      if (race?.meeting_key) {
        fetch(`/api/f1/sessions?meeting_key=${race.meeting_key}`)
          .then(r => r.json())
          .then(data => {
            const sessData = Array.isArray(data) ? data : []
            setCalendarSessions(sessData)
            if (sessData.length) fetchResultsForSession(sessData, calendarSessionTab, setCalendarResults, setResultsLoading)
          })
      }
    }
  }, [calendarRound])

  useEffect(() => {
    if (calendarSessions.length) fetchResultsForSession(calendarSessions, calendarSessionTab, setCalendarResults, setResultsLoading)
  }, [calendarSessionTab])

  const sessionTabs = getSessionTabs(sessions)

  const ResultsTable = ({ data, loading }: { data: any[]; loading: boolean }) => (
    loading ? <Loader label="results" /> : data.length === 0 ? (
      <div style={{ padding: '40px', textAlign: 'center' as const, color: '#5A6A7A', fontSize: '13px' }}>No results available for this session yet</div>
    ) : (
      <>
        <div style={{ display: 'grid', gridTemplateColumns: '32px 4px 1fr 1fr 100px 100px', gap: '0 12px', padding: '8px 20px 6px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <span style={{ fontSize: '10px', color: '#5A6A7A', fontWeight: 600, textTransform: 'uppercase' as const }}>Pos</span>
          <span />
          <span style={{ fontSize: '10px', color: '#5A6A7A', fontWeight: 600, textTransform: 'uppercase' as const }}>Driver</span>
          <span style={{ fontSize: '10px', color: '#5A6A7A', fontWeight: 600, textTransform: 'uppercase' as const }}>Team</span>
          <span style={{ fontSize: '10px', color: '#5A6A7A', fontWeight: 600, textTransform: 'uppercase' as const, textAlign: 'right' as const }}>Time</span>
          <span style={{ fontSize: '10px', color: '#5A6A7A', fontWeight: 600, textTransform: 'uppercase' as const, textAlign: 'right' as const }}>Delta</span>
        </div>
        {data.map((r: any) => {
          const posColors: Record<number, string> = { 1: '#FFD700', 2: '#C0C0C0', 3: '#CD7F32' }
          return (
            <div key={r.driver_number} style={{ display: 'grid', gridTemplateColumns: '32px 4px 1fr 1fr 100px 100px', gap: '0 12px', alignItems: 'center', padding: '8px 20px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', fontWeight: r.position <= 3 ? 600 : 400, color: posColors[r.position] || '#5A6A7A' }}>{r.position}</span>
              <div style={{ width: '4px', height: '28px', borderRadius: '2px', background: r.team_colour }} />
              <div>
                <div style={{ fontSize: '13px', fontWeight: 500 }}>{r.name}</div>
              </div>
              <div style={{ fontSize: '12px', color: '#5A6A7A' }}>{r.team}</div>
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', color: r.position === 1 ? '#FFB800' : '#F0F4F8', textAlign: 'right' as const }}>
                {r.position === 1 ? (r.time || '—') : (r.time || '—')}
              </span>
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', color: '#5A6A7A', textAlign: 'right' as const }}>
                {r.position === 1 ? '—' : (r.gap ? `+${r.gap}` : '—')}
              </span>
            </div>
          )
        })}
      </>
    )
  )

  const tabs = [
    { id: 'race-info', label: 'Race Info' },
    { id: 'results', label: 'Results' },
    { id: 'calendar', label: 'Racing Calendar' },
    { id: 'weather', label: 'Weather' },
  ]

  return (
    <div style={{ position: 'relative', zIndex: 1, maxWidth: '1400px', margin: '0 auto', padding: '28px 32px 60px' }}>

      {/* Header + Dropdown */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '20px', gap: '20px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <div style={{ width: '3px', height: '24px', background: '#E8002D', borderRadius: '2px' }} />
            <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '2px', color: '#E8002D', textTransform: 'uppercase' as const }}>Race Hub</span>
          </div>
          <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(2.5rem,5vw,3.5rem)', letterSpacing: '1px', lineHeight: 1, marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontFamily: 'Twemoji Country Flags, DM Sans, sans-serif', fontSize: 'clamp(2rem,4vw,2.8rem)' }}>{selectedRace.flag}</span>
            <span>{selectedRace.name} Grand Prix</span>
          </div>
          <div style={{ color: '#5A6A7A', fontSize: '13px' }}>
            {selectedRace.circuit} · Round {selectedRace.round} of 24 · {selectedRace.sprint ? '⚡ Sprint Weekend' : 'Standard Weekend'}
          </div>
        </div>

        {/* Race Weekend Dropdown — custom (native select can't render emoji on Windows) */}
        <div style={{ flexShrink: 0, position: 'relative' as const }}>
          <div style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '1px', color: '#5A6A7A', textTransform: 'uppercase' as const, marginBottom: '8px' }}>Select Race Weekend</div>
          <div style={{ position: 'relative' as const }}>
            {/* Visible selected value */}
            <div
              onClick={() => setDropdownOpen(o => !o)}
              style={{
                background: '#141B22', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px',
                color: '#F0F4F8', padding: '10px 40px 10px 14px', fontSize: '13px', fontWeight: 500,
                cursor: 'pointer', minWidth: '240px', userSelect: 'none' as const,
                display: 'flex', alignItems: 'center', gap: '8px',
              }}
            >
              <span>{selectedRace.flag}</span>
              <span>R{selectedRace.round} — {selectedRace.name}</span>
              {selectedRace.sprint && <span style={{ fontSize: '11px', color: '#E8002D' }}>⚡</span>}
              {selectedRace.completed && <span style={{ fontSize: '11px', color: '#00D47E' }}>✓</span>}
              <span style={{ marginLeft: 'auto', color: '#5A6A7A', fontSize: '11px' }}>▼</span>
            </div>
            {/* Dropdown list */}
            {dropdownOpen && (
              <div style={{
                position: 'absolute' as const, top: 'calc(100% + 4px)', left: 0, right: 0,
                background: '#141B22', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px',
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
                        color: isCalledOff ? '#3A4A5A' : race.round === selectedRound ? '#E8002D' : '#F0F4F8',
                        borderBottom: '1px solid rgba(255,255,255,0.04)',
                        opacity: isCalledOff ? 0.5 : 1,
                      }}
                    >
                      <span>{race.flag}</span>
                      <span>R{race.round} — {race.name}</span>
                      {race.sprint && !isCalledOff && <span style={{ fontSize: '10px', color: '#E8002D' }}>⚡</span>}
                      {isCalledOff && <span style={{ fontSize: '9px', color: '#5A6A7A', marginLeft: 'auto', fontWeight: 600 }}>CANCELLED</span>}
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
      <div style={{ display: 'flex', gap: '4px', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} style={{
            background: activeTab === tab.id ? 'rgba(232,0,45,0.1)' : 'transparent',
            color: activeTab === tab.id ? '#E8002D' : '#5A6A7A',
            border: 'none', borderBottom: activeTab === tab.id ? '2px solid #E8002D' : '2px solid transparent',
            padding: '10px 20px', cursor: 'pointer', fontSize: '13px', fontWeight: 600,
            letterSpacing: '0.3px', transition: 'all 0.2s', borderRadius: '6px 6px 0 0',
          }}>{tab.label}</button>
        ))}
      </div>

      {/* RACE INFO TAB */}
      {activeTab === 'race-info' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
          <div style={card}>
            <div style={cardHeader}>
              <span style={cardTitle}>Session Schedule</span>
              <Badge type={selectedRace.completed ? 'done' : 'live'} label={selectedRace.completed ? 'Completed' : 'Upcoming'} />
            </div>
            <div style={{ padding: '16px 20px' }}>
              {loading ? <Loader label="sessions" /> : sessions.length === 0 ? (
                <div style={{ color: '#5A6A7A', fontSize: '13px', padding: '20px 0' }}>
                  {selectedRace.completed ? 'Session data not yet available from OpenF1' : `Sessions will appear closer to race weekend (${selectedRace.date})`}
                </div>
              ) : sessions.map((s: any, i: number) => (
                <div key={s.session_key} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 0', borderBottom: i < sessions.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '13px', fontWeight: 600 }}>{s.session_name}</div>
                    <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: '#5A6A7A', marginTop: '2px' }}>
                      {s.date_start ? new Date(s.date_start).toLocaleString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', timeZone: 'UTC' }) + ' UTC' : '—'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* RESULTS TAB */}
      {activeTab === 'results' && (
        <div style={card}>
          <div style={cardHeader}>
            <span style={cardTitle}>{selectedRace.flag} {selectedRace.name} GP — Session Results</span>
            <Badge type="new" label="OpenF1" />
          </div>
          <div style={{ display: 'flex', gap: '6px', padding: '12px 20px', borderBottom: '1px solid rgba(255,255,255,0.07)', flexWrap: 'wrap' as const }}>
            {sessionTabs.length > 0 ? sessionTabs.map(t => (
              <button key={t.id} onClick={() => setActiveSession(t.id)} style={{
                background: activeSession === t.id ? '#E8002D' : '#141B22',
                color: activeSession === t.id ? 'white' : '#5A6A7A',
                border: '1px solid', borderColor: activeSession === t.id ? '#E8002D' : 'rgba(255,255,255,0.07)',
                padding: '5px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 600,
              }}>{t.label}</button>
            )) : (
              <span style={{ fontSize: '12px', color: '#5A6A7A' }}>No session data available for this race weekend</span>
            )}
          </div>
          <ResultsTable data={results} loading={resultsLoading} />
        </div>
      )}

      {/* CALENDAR TAB */}
      {activeTab === 'calendar' && (
        <div>
          {calendarRound === null ? (
            <div style={card}>
              <div style={cardHeader}>
                <span style={cardTitle}>2026 Racing Calendar</span>
                <Badge type="blue" label="24 Rounds" />
              </div>
              <div style={{ padding: '16px 20px', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '10px' }}>
                {SEASON_CALENDAR.map((race) => {
                  const isCurrent = race.round === selectedRound
                  const isCalledOff = (race as any).calledOff
                  const isNew = race.name === 'Madrid'
                  return (
                    <div
                      key={race.round}
                      onClick={() => race.completed && !isCalledOff ? setCalendarRound(race.round) : null}
                      style={{
                        background: isCalledOff ? 'rgba(255,255,255,0.02)' : isCurrent ? 'rgba(232,0,45,0.08)' : '#141B22',
                        border: isCalledOff ? '1px solid rgba(255,255,255,0.04)' : isCurrent ? '1px solid rgba(232,0,45,0.3)' : '1px solid rgba(255,255,255,0.05)',
                        borderRadius: '10px', padding: '14px',
                        cursor: race.completed && !isCalledOff ? 'pointer' : 'default',
                        opacity: isCalledOff ? 0.4 : !race.completed && race.round > selectedRound ? 0.6 : 1,
                        transition: 'border-color 0.2s',
                        position: 'relative' as const,
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#3A4A5A' }}>R{race.round}</span>
                        <div style={{ display: 'flex', gap: '4px' }}>
                          {isNew && <span style={{ fontSize: '8px', fontWeight: 700, padding: '1px 5px', borderRadius: '3px', background: 'rgba(0,168,255,0.15)', color: '#00A8FF' }}>NEW</span>}
                          {race.sprint && !isCalledOff && <span style={{ fontSize: '8px', fontWeight: 700, padding: '1px 5px', borderRadius: '3px', background: 'rgba(232,0,45,0.15)', color: '#E8002D' }}>SPRINT</span>}
                          {isCalledOff && <span style={{ fontSize: '8px', fontWeight: 700, padding: '1px 5px', borderRadius: '3px', background: 'rgba(255,255,255,0.08)', color: '#5A6A7A' }}>CANCELLED</span>}
                          {race.completed && !isCalledOff && <span style={{ fontSize: '8px', fontWeight: 700, padding: '1px 5px', borderRadius: '3px', background: 'rgba(0,212,126,0.12)', color: '#00D47E' }}>✓</span>}
                        </div>
                      </div>
                      <div style={{ fontSize: '20px', marginBottom: '6px' }}>{race.flag}</div>
                      <div style={{ fontSize: '12px', fontWeight: 600, color: isCalledOff ? '#3A4A5A' : isCurrent ? '#F0F4F8' : '#5A6A7A', marginBottom: '2px' }}>{race.name}</div>
                      <div style={{ fontSize: '11px', color: '#3A4A5A', marginBottom: '2px' }}>{race.circuit}</div>
                      <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#3A4A5A' }}>{(race as any).dateRange || race.date}</div>
                      {isCalledOff && <div style={{ marginTop: '8px', fontSize: '10px', color: '#5A6A7A', fontWeight: 600 }}>Called off</div>}
                      {race.completed && !isCalledOff && <div style={{ marginTop: '8px', fontSize: '10px', color: '#E8002D', fontWeight: 600 }}>Click for results →</div>}
                    </div>
                  )
                })}
              </div>
            </div>
          ) : (
            // Calendar detail — results for clicked race
            <div style={card}>
              <div style={cardHeader}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <button onClick={() => { setCalendarRound(null); setCalendarSessions([]); setCalendarResults([]) }} style={{ background: '#141B22', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#F0F4F8', padding: '4px 10px', cursor: 'pointer', fontSize: '12px' }}>← Back</button>
                  <span style={cardTitle}>
                    {SEASON_CALENDAR.find(r => r.round === calendarRound)?.flag} {SEASON_CALENDAR.find(r => r.round === calendarRound)?.name} GP Results
                  </span>
                </div>
                <Badge type="done" label="Completed" />
              </div>
              <div style={{ display: 'flex', gap: '6px', padding: '12px 20px', borderBottom: '1px solid rgba(255,255,255,0.07)', flexWrap: 'wrap' as const }}>
                {getSessionTabs(calendarSessions).map(t => (
                  <button key={t.id} onClick={() => setCalendarSessionTab(t.id)} style={{
                    background: calendarSessionTab === t.id ? '#E8002D' : '#141B22',
                    color: calendarSessionTab === t.id ? 'white' : '#5A6A7A',
                    border: '1px solid', borderColor: calendarSessionTab === t.id ? '#E8002D' : 'rgba(255,255,255,0.07)',
                    padding: '5px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 600,
                  }}>{t.label}</button>
                ))}
              </div>
              <ResultsTable data={calendarResults} loading={resultsLoading} />
            </div>
          )}
        </div>
      )}

      {/* WEATHER TAB */}
      {activeTab === 'weather' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div style={card}>
            <div style={cardHeader}>
              <span style={cardTitle}>Live Track Conditions</span>
              <Badge type="live" label="OpenF1" />
            </div>
            <div style={{ padding: '20px' }}>
              {loading ? <Loader label="weather" /> : !weather ? (
                <div style={{ color: '#5A6A7A', fontSize: '13px' }}>No weather data available for this weekend</div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  {[
                    { label: 'Air Temp', value: `${weather.air_temperature?.toFixed(1) ?? '—'}°C`, icon: '🌡️' },
                    { label: 'Track Temp', value: `${weather.track_temperature?.toFixed(1) ?? '—'}°C`, icon: '🏎️' },
                    { label: 'Wind Speed', value: `${weather.wind_speed?.toFixed(1) ?? '—'} m/s`, icon: '💨' },
                    { label: 'Wind Dir', value: `${weather.wind_direction ?? '—'}°`, icon: '🧭' },
                    { label: 'Humidity', value: `${weather.humidity?.toFixed(0) ?? '—'}%`, icon: '💧' },
                    { label: 'Pressure', value: `${weather.pressure?.toFixed(1) ?? '—'} hPa`, icon: '📊' },
                    { label: 'Rainfall', value: weather.rainfall ? 'Yes 🌧️' : 'No ☀️', icon: '🌦️' },
                  ].map((stat) => (
                    <div key={stat.label} style={{ background: '#141B22', borderRadius: '8px', padding: '14px' }}>
                      <div style={{ fontSize: '11px', color: '#5A6A7A', textTransform: 'uppercase' as const, letterSpacing: '1px', marginBottom: '6px' }}>{stat.icon} {stat.label}</div>
                      <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '18px', fontWeight: 600 }}>{stat.value}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div style={card}>
            <div style={cardHeader}>
              <span style={cardTitle}>Weekend Forecast</span>
              <Badge type="blue" label={selectedRace.flag + ' ' + selectedRace.name} />
            </div>
            <div style={{ padding: '20px', color: '#5A6A7A', fontSize: '13px', lineHeight: 1.7 }}>
              Live weather forecast data from OpenWeatherMap coming soon. Track conditions above are sourced directly from F1 timing data via OpenF1.
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
