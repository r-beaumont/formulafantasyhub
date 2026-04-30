'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { SEASON_CALENDAR, CURRENT_RACE } from '@/lib/races'

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
  const [activeTab, setActiveTab] = useState<'overview' | 'race-info' | 'weather' | 'pitwall'>('overview')
  const [selectedRound, setSelectedRound] = useState(4)
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
  const [forecast, setForecast] = useState<any>(null)
  const [forecastLoading, setForecastLoading] = useState(false)
  const [loading, setLoading] = useState(true)
  const [useLocalTime, setUseLocalTime] = useState(false)

  const selectedRace = SEASON_CALENDAR.find(r => r.round === selectedRound) || SEASON_CALENDAR[1]

  useEffect(() => {
    // Always clear stale data from previous round immediately
    setSessions([])
    setWeather(null)

    async function load() {
      setLoading(true)
      try {
        const standRes = await fetch('/api/f1/standings')
        const standData = await standRes.json()
        setStandings(standData)

        if (selectedRace.meeting_key) {
          // Use 'latest' for the current race weekend — guarantees correct OpenF1 meeting key
          const meetingParam = selectedRound === CURRENT_RACE.round ? 'latest' : selectedRace.meeting_key
          const sessRes = await fetch(`/api/f1/sessions?meeting_key=${meetingParam}`)
          const sessData = await sessRes.json()
          setSessions(Array.isArray(sessData) ? sessData : [])

          if (Array.isArray(sessData) && sessData.length) {
            // Use the most recently started session — future sessions have no weather data
            const now = Date.now()
            const started = sessData.filter((s: any) => s.date_start && new Date(s.date_start).getTime() <= now)
            const weatherSess = started.length > 0 ? started[started.length - 1] : sessData[0]
            const weatherRes = await fetch(`/api/f1/weather?session_key=${weatherSess.session_key}`)
            const weatherData = await weatherRes.json()
            setWeather(weatherData)
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
        const weatherSess = started.length > 0 ? started[started.length - 1] : sessions[0]
        const res = await fetch(`/api/f1/weather?session_key=${weatherSess.session_key}`)
        const data = await res.json()
        if (data && !data.error) setWeather(data)
      } catch {}
    }
    const id = setInterval(poll, 20 * 60 * 1000)
    return () => clearInterval(id)
  }, [sessions])

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

  // Circuit overview data — keyed by round number matching SEASON_CALENDAR
  const circuitOverviewData: Record<number, any> = {
    1: { // Australia — Albert Park
      lastWinner: 'L. Norris',
      mostWinsDriver: 'M. Schumacher', mostWinsDriverCount: 4,
      mostWinsConstructor: 'Ferrari', mostWinsConstructorCount: 8,
      mostPolesDriver: 'L. Hamilton', mostPolesDriverCount: 8,
      mostPolesConstructor: 'Ferrari', mostPolesConstructorCount: 8,
      avgOvertakes: 51, overtakeSeasonsLabel: '2023–2025',
      overtakes2023: 74, overtakes2024: 35, overtakes2025: 45,
      gridImportance: 'MEDIUM',
      totalGPs: 29, firstGP: 1996, circuitLength: '5.278 km',
      dnfHistory: { y2023: 3, y2024: 2, y2025: 6, avg: 3.67 },
    },
    2: { // China — Shanghai
      lastWinner: 'O. Piastri',
      mostWinsDriver: 'L. Hamilton', mostWinsDriverCount: 6,
      mostWinsConstructor: 'Mercedes', mostWinsConstructorCount: 6,
      mostPolesDriver: 'L. Hamilton', mostPolesDriverCount: 6,
      mostPolesConstructor: 'Mercedes', mostPolesConstructorCount: 6,
      avgOvertakes: 87, overtakeSeasonsLabel: '2024–2025',
      overtakes2023: null, overtakes2024: 102, overtakes2025: 72,
      gridImportance: 'LOW',
      totalGPs: 19, firstGP: 2004, circuitLength: '5.451 km',
      dnfHistory: { y2023: null, y2024: 3, y2025: 4, avg: 3.50 },
    },
    3: { // Japan — Suzuka
      lastWinner: 'M. Verstappen',
      mostWinsDriver: 'M. Schumacher', mostWinsDriverCount: 6,
      mostWinsConstructor: 'McLaren', mostWinsConstructorCount: 9,
      mostPolesDriver: 'M. Schumacher', mostPolesDriverCount: 8,
      mostPolesConstructor: 'McLaren', mostPolesConstructorCount: 12,
      avgOvertakes: 65, overtakeSeasonsLabel: '2023–2025',
      overtakes2023: 81, overtakes2024: 85, overtakes2025: 28,
      gridImportance: 'MEDIUM',
      totalGPs: 36, firstGP: 1987, circuitLength: '5.807 km',
      dnfHistory: { y2023: 5, y2024: 3, y2025: 0, avg: 2.67 },
    },
    4: { // Miami — Miami International Autodrome
      lastWinner: 'O. Piastri',
      mostWinsDriver: 'M. Verstappen', mostWinsDriverCount: 2,
      mostWinsConstructor: 'Red Bull', mostWinsConstructorCount: 2,
      mostPolesDriver: 'M. Verstappen', mostPolesDriverCount: 2,
      mostPolesConstructor: 'Red Bull', mostPolesConstructorCount: 2,
      avgOvertakes: 89, overtakeSeasonsLabel: '2023–2025',
      overtakes2023: 94, overtakes2024: 93, overtakes2025: 80,
      gridImportance: 'LOW',
      totalGPs: 4, firstGP: 2022, circuitLength: '5.412 km',
      dnfHistory: { y2023: 0, y2024: 1, y2025: 5, avg: 2.00 },
    },
    5: { // Canada — Circuit Gilles Villeneuve
      lastWinner: 'G. Russell',
      mostWinsDriver: 'M. Schumacher / L. Hamilton', mostWinsDriverCount: 7,
      mostWinsConstructor: 'Ferrari', mostWinsConstructorCount: 14,
      mostPolesDriver: 'M. Schumacher / L. Hamilton', mostPolesDriverCount: 6,
      mostPolesConstructor: 'Ferrari', mostPolesConstructorCount: 11,
      avgOvertakes: 68, overtakeSeasonsLabel: '2023–2025',
      overtakes2023: 46, overtakes2024: 83, overtakes2025: 75,
      gridImportance: 'MEDIUM',
      totalGPs: 44, firstGP: 1978, circuitLength: '4.361 km',
      dnfHistory: { y2023: 2, y2024: 5, y2025: 2, avg: 3.00 },
    },
    6: { // Monaco — Circuit de Monaco
      lastWinner: 'L. Norris',
      mostWinsDriver: 'A. Senna', mostWinsDriverCount: 6,
      mostWinsConstructor: 'McLaren', mostWinsConstructorCount: 15,
      mostPolesDriver: 'A. Senna', mostPolesDriverCount: 5,
      mostPolesConstructor: 'Ferrari', mostPolesConstructorCount: 12,
      avgOvertakes: 19, overtakeSeasonsLabel: '2023–2025',
      overtakes2023: 36, overtakes2024: 17, overtakes2025: 4,
      gridImportance: 'HIGH',
      totalGPs: 71, firstGP: 1950, circuitLength: '3.337 km',
      dnfHistory: { y2023: 2, y2024: 2, y2025: 0, avg: 1.33 },
    },
    7: { // Spain — Circuit de Barcelona-Catalunya
      lastWinner: 'O. Piastri',
      mostWinsDriver: 'M. Schumacher / L. Hamilton', mostWinsDriverCount: 6,
      mostWinsConstructor: 'Ferrari', mostWinsConstructorCount: 14,
      mostPolesDriver: 'M. Schumacher', mostPolesDriverCount: 7,
      mostPolesConstructor: 'Ferrari', mostPolesConstructorCount: 14,
      avgOvertakes: 90, overtakeSeasonsLabel: '2023–2025',
      overtakes2023: 107, overtakes2024: 86, overtakes2025: 78,
      gridImportance: 'LOW',
      totalGPs: 34, firstGP: 1991, circuitLength: '4.657 km',
      dnfHistory: { y2023: 0, y2024: 0, y2025: 3, avg: 1.00 },
    },
    8: { // Austria — Red Bull Ring
      lastWinner: 'L. Norris',
      mostWinsDriver: 'M. Verstappen', mostWinsDriverCount: 5,
      mostWinsConstructor: 'Red Bull', mostWinsConstructorCount: 9,
      mostPolesDriver: 'M. Verstappen', mostPolesDriverCount: 5,
      mostPolesConstructor: 'Red Bull', mostPolesConstructorCount: 7,
      avgOvertakes: 90, overtakeSeasonsLabel: '2023–2025',
      overtakes2023: 105, overtakes2024: 85, overtakes2025: 81,
      gridImportance: 'LOW',
      totalGPs: 34, firstGP: 1970, circuitLength: '4.318 km',
      dnfHistory: { y2023: 1, y2024: 0, y2025: 4, avg: 1.67 },
    },
    9: { // Britain — Silverstone
      lastWinner: 'G. Russell',
      mostWinsDriver: 'L. Hamilton', mostWinsDriverCount: 9,
      mostWinsConstructor: 'Ferrari', mostWinsConstructorCount: 19,
      mostPolesDriver: 'L. Hamilton', mostPolesDriverCount: 7,
      mostPolesConstructor: 'Ferrari', mostPolesConstructorCount: 19,
      avgOvertakes: 54, overtakeSeasonsLabel: '2023–2025',
      overtakes2023: 50, overtakes2024: 55, overtakes2025: 58,
      gridImportance: 'MEDIUM',
      totalGPs: 60, firstGP: 1950, circuitLength: '5.891 km',
      dnfHistory: { y2023: 2, y2024: 2, y2025: 5, avg: 3.00 },
    },
    10: { // Belgium — Spa-Francorchamps
      lastWinner: 'O. Piastri',
      mostWinsDriver: 'M. Schumacher', mostWinsDriverCount: 6,
      mostWinsConstructor: 'Ferrari', mostWinsConstructorCount: 18,
      mostPolesDriver: 'L. Hamilton', mostPolesDriverCount: 6,
      mostPolesConstructor: 'Ferrari', mostPolesConstructorCount: 21,
      avgOvertakes: 67, overtakeSeasonsLabel: '2023–2025',
      overtakes2023: 95, overtakes2024: 58, overtakes2025: 49,
      gridImportance: 'MEDIUM',
      totalGPs: 58, firstGP: 1950, circuitLength: '7.004 km',
      dnfHistory: { y2023: 2, y2024: 2, y2025: 0, avg: 1.33 },
    },
    11: { // Hungary — Hungaroring
      lastWinner: 'L. Norris',
      mostWinsDriver: 'L. Hamilton', mostWinsDriverCount: 8,
      mostWinsConstructor: 'McLaren', mostWinsConstructorCount: 12,
      mostPolesDriver: 'L. Hamilton', mostPolesDriverCount: 9,
      mostPolesConstructor: 'McLaren', mostPolesConstructorCount: 14,
      avgOvertakes: 62, overtakeSeasonsLabel: '2023–2025',
      overtakes2023: 51, overtakes2024: 65, overtakes2025: 69,
      gridImportance: 'HIGH',
      totalGPs: 40, firstGP: 1986, circuitLength: '4.381 km',
      dnfHistory: { y2023: 2, y2024: 1, y2025: 1, avg: 1.33 },
    },
    12: { // Netherlands — Zandvoort
      lastWinner: 'O. Piastri',
      mostWinsDriver: 'J. Clark', mostWinsDriverCount: 4,
      mostWinsConstructor: 'Red Bull', mostWinsConstructorCount: 3,
      mostPolesDriver: 'R. Arnoux / M. Verstappen', mostPolesDriverCount: 3,
      mostPolesConstructor: 'Red Bull', mostPolesConstructorCount: 3,
      avgOvertakes: 72, overtakeSeasonsLabel: '2022–2024',
      overtakes2023: 240, overtakes2024: 73, overtakes2025: 70,
      gridImportance: 'HIGH',
      totalGPs: 30, firstGP: 1952, circuitLength: '4.259 km',
      dnfHistory: { y2023: 3, y2024: 0, y2025: 2, avg: 1.67 },
    },
    13: { // Italy — Monza
      lastWinner: 'M. Verstappen',
      mostWinsDriver: 'M. Schumacher / L. Hamilton', mostWinsDriverCount: 5,
      mostWinsConstructor: 'Ferrari', mostWinsConstructorCount: 20,
      mostPolesDriver: 'L. Hamilton', mostPolesDriverCount: 7,
      mostPolesConstructor: 'Ferrari', mostPolesConstructorCount: 22,
      avgOvertakes: 56, overtakeSeasonsLabel: '2023–2025',
      overtakes2023: 49, overtakes2024: 71, overtakes2025: 47,
      gridImportance: 'MEDIUM',
      totalGPs: 75, firstGP: 1950, circuitLength: '5.793 km',
      dnfHistory: { y2023: 2, y2024: 1, y2025: 2, avg: 1.67 },
    },
    14: { // Madrid — DEBUT
      lastWinner: null,
      isDebut: true,
      debutMessage: 'The Madrid Grand Prix makes its Formula 1 debut in 2026. No historical records exist yet — this is where history begins.',
      avgOvertakes: null, overtakeSeasonsLabel: null,
      overtakes2023: null, overtakes2024: null, overtakes2025: null,
      gridImportance: 'TBC',
      totalGPs: 0, firstGP: 2026, circuitLength: '5.474 km',
      dnfHistory: { y2023: null, y2024: null, y2025: null, avg: '—' },
    },
    15: { // Azerbaijan — Baku City Circuit
      lastWinner: 'M. Verstappen',
      mostWinsDriver: 'S. Perez / M. Verstappen', mostWinsDriverCount: 2,
      mostWinsConstructor: 'Red Bull', mostWinsConstructorCount: 4,
      mostPolesDriver: 'C. Leclerc', mostPolesDriverCount: 4,
      mostPolesConstructor: 'Ferrari', mostPolesConstructorCount: 5,
      avgOvertakes: 57, overtakeSeasonsLabel: '2023–2025',
      overtakes2023: 50, overtakes2024: 66, overtakes2025: 55,
      gridImportance: 'MEDIUM',
      totalGPs: 9, firstGP: 2017, circuitLength: '6.003 km',
      dnfHistory: { y2023: 2, y2024: 1, y2025: 1, avg: 1.33 },
    },
    16: { // Singapore — Marina Bay Street Circuit
      lastWinner: 'G. Russell',
      mostWinsDriver: 'S. Vettel', mostWinsDriverCount: 5,
      mostWinsConstructor: 'Red Bull', mostWinsConstructorCount: 5,
      mostPolesDriver: 'S. Vettel / L. Hamilton', mostPolesDriverCount: 4,
      mostPolesConstructor: 'Ferrari', mostPolesConstructorCount: 7,
      avgOvertakes: 68, overtakeSeasonsLabel: '2023–2025',
      overtakes2023: 85, overtakes2024: 62, overtakes2025: 58,
      gridImportance: 'HIGH',
      totalGPs: 17, firstGP: 2008, circuitLength: '4.940 km',
      dnfHistory: { y2023: 3, y2024: 1, y2025: 0, avg: 1.33 },
    },
    17: { // United States — Circuit of the Americas
      lastWinner: 'M. Verstappen',
      mostWinsDriver: 'L. Hamilton', mostWinsDriverCount: 5,
      mostWinsConstructor: 'Mercedes', mostWinsConstructorCount: 7,
      mostPolesDriver: 'L. Hamilton', mostPolesDriverCount: 5,
      mostPolesConstructor: 'Mercedes', mostPolesConstructorCount: 6,
      avgOvertakes: 78, overtakeSeasonsLabel: '2023–2025',
      overtakes2023: 78, overtakes2024: 86, overtakes2025: 71,
      gridImportance: 'LOW',
      totalGPs: 13, firstGP: 2012, circuitLength: '5.513 km',
      dnfHistory: { y2023: 5, y2024: 1, y2025: 1, avg: 2.33 },
    },
    18: { // Mexico — Autodromo Hermanos Rodriguez
      lastWinner: 'L. Norris',
      mostWinsDriver: 'M. Verstappen', mostWinsDriverCount: 5,
      mostWinsConstructor: 'Red Bull', mostWinsConstructorCount: 6,
      mostPolesDriver: 'J. Clark', mostPolesDriverCount: 4,
      mostPolesConstructor: 'Red Bull', mostPolesConstructorCount: 7,
      avgOvertakes: 102, overtakeSeasonsLabel: '2023–2025',
      overtakes2023: 121, overtakes2024: 87, overtakes2025: 97,
      gridImportance: 'LOW',
      totalGPs: 23, firstGP: 1963, circuitLength: '4.304 km',
      dnfHistory: { y2023: 3, y2024: 3, y2025: 3, avg: 3.00 },
    },
    19: { // Brazil — Autodromo Jose Carlos Pace
      lastWinner: 'L. Norris',
      mostWinsDriver: 'M. Schumacher', mostWinsDriverCount: 4,
      mostWinsConstructor: 'Ferrari', mostWinsConstructorCount: 9,
      mostPolesDriver: 'A. Senna', mostPolesDriverCount: 5,
      mostPolesConstructor: 'McLaren', mostPolesConstructorCount: 9,
      avgOvertakes: 78, overtakeSeasonsLabel: '2023–2025',
      overtakes2023: 69, overtakes2024: 70, overtakes2025: 96,
      gridImportance: 'LOW',
      totalGPs: 42, firstGP: 1973, circuitLength: '4.309 km',
      dnfHistory: { y2023: 6, y2024: 5, y2025: 3, avg: 4.67 },
    },
    20: { // Las Vegas — Las Vegas Strip Circuit
      lastWinner: 'M. Verstappen',
      mostWinsDriver: 'M. Verstappen', mostWinsDriverCount: 2,
      mostWinsConstructor: 'Red Bull', mostWinsConstructorCount: 2,
      mostPolesDriver: 'C. Leclerc / G. Russell / L. Norris', mostPolesDriverCount: 1,
      mostPolesConstructor: 'Ferrari / Mercedes / McLaren', mostPolesConstructorCount: 1,
      circuitNote: '3 races held (2023–2025)',
      avgOvertakes: 108, overtakeSeasonsLabel: '2023–2025',
      overtakes2023: 181, overtakes2024: 109, overtakes2025: 34,
      gridImportance: 'LOW',
      totalGPs: 3, firstGP: 2023, circuitLength: '6.201 km',
      dnfHistory: { y2023: 1, y2024: 2, y2025: 5, avg: 2.67 },
    },
    21: { // Qatar — Lusail International Circuit
      lastWinner: 'M. Verstappen',
      mostWinsDriver: 'M. Verstappen', mostWinsDriverCount: 3,
      mostWinsConstructor: 'Red Bull', mostWinsConstructorCount: 3,
      mostPolesDriver: 'M. Verstappen', mostPolesDriverCount: 2,
      mostPolesConstructor: 'Red Bull', mostPolesConstructorCount: 2,
      circuitNote: '4 races held (2021–2025)',
      avgOvertakes: 77, overtakeSeasonsLabel: '2023–2025',
      overtakes2023: 108, overtakes2024: 81, overtakes2025: 41,
      gridImportance: 'MEDIUM',
      totalGPs: 4, firstGP: 2021, circuitLength: '5.380 km',
      dnfHistory: { y2023: 3, y2024: 5, y2025: 2, avg: 3.33 },
    },
    22: { // Abu Dhabi — Yas Marina Circuit
      lastWinner: 'M. Verstappen',
      mostWinsDriver: 'L. Hamilton / M. Verstappen', mostWinsDriverCount: 5,
      mostWinsConstructor: 'Red Bull', mostWinsConstructorCount: 8,
      mostPolesDriver: 'L. Hamilton', mostPolesDriverCount: 5,
      mostPolesConstructor: 'Red Bull', mostPolesConstructorCount: 7,
      avgOvertakes: 111, overtakeSeasonsLabel: '2023–2025',
      overtakes2023: 113, overtakes2024: 96, overtakes2025: 125,
      gridImportance: 'LOW',
      totalGPs: 16, firstGP: 2009, circuitLength: '5.281 km',
      dnfHistory: { y2023: 0, y2024: 3, y2025: 0, avg: 1.00 },
    },
  }

  const TRACK_SPEEDS: Record<number, string> = {
    1: 'High', 2: 'High', 3: 'Very High', 4: 'High', 5: 'High',
    6: 'Medium', 7: 'Medium-High', 8: 'High', 9: 'Very High', 10: 'Very High',
    11: 'Medium', 12: 'Medium-High', 13: 'Very High', 14: 'Medium-High', 15: 'Very High',
    16: 'Medium', 17: 'High', 18: 'High', 19: 'Medium-High', 20: 'Very High',
    21: 'High', 22: 'Medium-High',
  }

  const CIRCUIT_DESCRIPTIONS: Record<number, string> = {
    1: `Set around Albert Park Lake just minutes from Melbourne city centre, this semi-permanent street circuit blends flowing high-speed sections with public roads that serve residents year-round. Unpredictable weather and a track surface that evolves dramatically across the weekend make it one of the most strategically varied rounds on the calendar.`,
    2: `The Shanghai International Circuit is defined by its sweeping snail-shell layout and one of the longest back straights in Formula 1, where cars top 320 km/h before arriving at a punishing braking zone. Its varied corner sequences test every aspect of car performance, from mechanical grip in the tight opening sector to aerodynamic efficiency across the fast middle section.`,
    3: `Suzuka is widely regarded as the purest driver circuit on the calendar, with its figure-eight layout and relentless sequence of high-speed corners demanding total commitment and precise car balance. The legendary Esses, 130R, and Spoon Curve have defined careers and remain the ultimate benchmark for driver skill.`,
    4: `Built around the Hard Rock Stadium in Miami Gardens, this circuit combines modern street circuit design with a backdrop that captures the energy and glamour of South Florida. High temperatures and humidity push both drivers and machinery to their limits, adding a strategic dimension to every race weekend.`,
    5: `The Circuit Gilles Villeneuve sits on the artificial Île Notre-Dame island in the St. Lawrence River, pairing long full-throttle straights with one of Formula 1's heaviest braking zones at the famous hairpin. The notorious Wall of Champions at the exit of the final chicane has ended the races of multiple world champions and remains a constant threat.`,
    6: `The Circuit de Monaco is motorsport's most prestigious address, threading through the narrow streets of Monte Carlo where barriers stand centimetres from the racing line and there is zero margin for error. From the tunnel exit to the Fairmont Hairpin — Formula 1's slowest corner at around 50 km/h — every lap is a high-wire act that rewards perfection and punishes everything else.`,
    7: `The Circuit de Barcelona-Catalunya has served as Formula 1's primary pre-season testing venue for decades, making it the most thoroughly understood circuit on the calendar. Its balanced mix of high-speed sweeps, technical corners, and elevation changes means that performance here translates across the widest range of conditions.`,
    8: `Nestled in the Styrian Alps, the Red Bull Ring is a compact, high-energy circuit with significant elevation changes across its ten corners. The steep uphill run from Turn 2 to Turn 3 and the fast flowing back section consistently produce close racing and late-braking battles into Turn 1.`,
    9: `Silverstone is the spiritual home of Formula 1, built on the runways of a former RAF station and home to the sport's opening world championship round in 1950. The high-speed Copse and Maggotts-Becketts-Chapel complex remain among the most demanding and exhilarating sequences in motorsport.`,
    10: `Spa-Francorchamps is the cathedral of motorsport — 7 kilometres of circuit carved through the Belgian Ardennes with over 100 metres of elevation change. The Eau Rouge-Raidillon complex, taken flat-out at close to 300 km/h, and the unpredictable microclimate that can produce simultaneous dry and wet conditions across different parts of the circuit make it uniquely demanding.`,
    11: `Often described as Monaco without the walls, the Hungaroring is a tight, twisty circuit in the hills outside Budapest where track position is everything and overtaking opportunities are scarce. Qualifying performance is critical, and the dusty surface that rubbers-in progressively over the weekend rewards those who improve setup quickly.`,
    12: `Circuit Zandvoort is tucked into the coastal dunes just kilometres from the North Sea, with a layout that follows the natural contours of the land rather than conforming to modern geometric design. The banked corners at Turns 3 and 14 are unique in Formula 1, creating racing dynamics that challenge both engineers and drivers to explore new limits of speed and grip.`,
    13: `The Autodromo Nazionale di Monza — the Temple of Speed — is Formula 1's fastest circuit, where cars exceed 340 km/h on the long straights and aerodynamic efficiency matters above almost everything else. The passionate Tifosi fill the grandstands with a wall of red and noise that makes a win here feel like nothing else in the sport.`,
    14: `The Madring brings Formula 1 to the heart of Spain's capital city for the first time, weaving through wide boulevards and alongside landmark architecture in a 5.47-kilometre layout that combines street circuit characteristics with ambitious design. As a debut venue, every session will provide new data that teams and drivers must process quickly.`,
    15: `The Baku City Circuit is a circuit of extreme contrasts — the claustrophobic passage through the UNESCO World Heritage Old City gives way to one of Formula 1's longest straights along the Caspian Sea waterfront where cars exceed 350 km/h. Safety cars are a near-certainty, making race strategy and reliability as important as outright pace.`,
    16: `The Marina Bay Street Circuit was Formula 1's first purpose-designed night race, with over 1,600 flood projectors turning the Singapore skyline into a uniquely spectacular backdrop. The 23-corner layout demands total concentration across one of the most physically gruelling race distances on the calendar.`,
    17: `The Circuit of the Americas was designed from the ground up to incorporate challenges inspired by legendary circuits, including an uphill run to Turn 1 that provides spectacular first-lap incidents and one of the sport's best viewing platforms for fans. The wide, flowing layout encourages multiple racing lines and consistent overtaking.`,
    18: `The Autódromo Hermanos Rodríguez sits at 2,285 metres above sea level — the highest venue on the Formula 1 calendar — where thin air reduces aerodynamic downforce and engine power in ways that demand entirely different car setups to every other round. The stadium section through the Foro Sol baseball arena creates a unique amphitheatre atmosphere where over 15,000 fans watch racing from just metres away.`,
    19: `Interlagos is built into the undulating landscape of São Paulo, with an anti-clockwise layout that rises and falls more than 40 metres across its compact 4.3-kilometre lap. São Paulo's tropical climate is capable of producing sudden downpours that transform race strategy entirely, and some of Formula 1's most dramatic moments have been decided here in the final laps.`,
    20: `The Las Vegas Strip Street Circuit runs down one of the world's most famous streets, with a 1.9-kilometre main straight along Las Vegas Boulevard that is the longest in Formula 1. The night racing format, cold track temperatures in the Nevada desert, and the neon backdrop of the Strip casinos create a race weekend unlike anything else on the calendar.`,
    21: `The Losail International Circuit was originally built for MotoGP and has evolved into a Formula 1 venue that rewards aerodynamic efficiency and tyre management across 16 flowing corners under floodlights. Qatar's extreme heat and tyre degradation consistently produce some of the most physically demanding race conditions of the season.`,
    22: `Yas Marina is Formula 1's traditional season finale, a purpose-built circuit on Yas Island where the iconic Yas Viceroy hotel straddles the track and the twilight race format transitions from late-afternoon sunshine to full floodlight illumination. Significant modifications in 2021 opened up the layout and improved overtaking opportunities for what has become a fitting stage for a championship conclusion.`,
  }

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
          <div style={{ color: '#5A6A7A', fontSize: '13px' }}>
            {selectedRace.circuit} · Round {selectedRace.round} of 22 · {selectedRace.sprint ? '⚡ Sprint Weekend' : 'Standard Weekend'}
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
              <span className={`fi fi-${selectedRace.flag}`} style={{ width: '1.2em', borderRadius: '2px', display: 'inline-block' }}></span>
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
                      <span className={`fi fi-${race.flag}`} style={{ width: '1.2em', borderRadius: '2px', display: 'inline-block' }}></span>
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
      <div style={{ display: 'flex', gap: '4px', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.07)', overflowX: 'auto', WebkitOverflowScrolling: 'touch', whiteSpace: 'nowrap' }}>
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} style={{
            background: activeTab === tab.id ? 'rgba(232,0,45,0.1)' : 'transparent',
            color: activeTab === tab.id ? '#E8002D' : '#5A6A7A',
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
          TBC:    { bg: 'rgba(90,106,122,0.15)',   color: '#5A6A7A', label: 'No data yet — debut race' },
        }
        const gi = overview ? gridImportanceConfig[overview.gridImportance] || gridImportanceConfig.TBC : gridImportanceConfig.TBC

        if (!overview) {
          return (
            <div style={{ ...card, padding: '40px', textAlign: 'center' as const }}>
              <div style={{ fontSize: '14px', color: '#5A6A7A' }}>Overview data coming soon for this circuit.</div>
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
            ? { label: 'HIGH',   color: '#E8002D', bg: 'rgba(232,0,45,0.15)',    desc: 'High DNF risk — strongly consider chip protection' }
            : dnfAvgNum >= 1.5
            ? { label: 'MEDIUM', color: '#FF8700', bg: 'rgba(255,135,0,0.15)',   desc: 'Moderate DNF risk — consider chip protection' }
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
                  <div style={{ background: '#141B22', borderRadius: '10px', padding: '12px 16px', marginBottom: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', fontWeight: 500, textTransform: 'uppercase' as const, letterSpacing: '0.08em', color: '#5A6A7A' }}>2025 Winner</div>
                    <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', fontWeight: 600, color: '#F0F4F8' }}>{winnerDisplay}</div>
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
                    <div key={stat.label} style={{ background: '#141B22', borderRadius: '10px', padding: '16px 12px', textAlign: 'center' as const }}>
                      <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '22px', fontWeight: 700, color: '#F0F4F8', lineHeight: 1 }}>{stat.value}</div>
                      <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', fontWeight: 500, textTransform: 'uppercase' as const, letterSpacing: '0.08em', color: '#5A6A7A', marginTop: '6px' }}>{stat.label}</div>
                    </div>
                  ))}
                </div>

                {/* Circuit Background subsection */}
                <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', fontWeight: 500, textTransform: 'uppercase' as const, letterSpacing: '0.08em', color: '#5A6A7A', marginBottom: '10px' }}>Circuit Background</div>
                {circuitDescription && (
                  <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', fontWeight: 400, color: '#8A9BB0', lineHeight: 1.6, margin: '0 0 24px' }}>{circuitDescription}</p>
                )}

                {/* ── DIVIDER ── */}
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '24px' }}>

                  {/* ── BOTTOM HALF: CIRCUIT RECORDS ── */}
                  <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', fontWeight: 500, textTransform: 'uppercase' as const, letterSpacing: '0.08em', color: '#5A6A7A', marginBottom: '12px' }}>Circuit Records</div>

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
                            <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', fontWeight: 600, color: '#F0F4F8' }}>{row.value}</div>
                            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', color: '#E8002D', marginTop: '2px' }}>{row.count}×</div>
                          </div>
                        </div>
                      ))}
                      {overview.circuitNote && (
                        <div style={{ marginTop: '12px', fontSize: '11px', color: '#5A6A7A', fontStyle: 'italic' }}>{overview.circuitNote}</div>
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
                <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase' as const, color: '#5A6A7A', marginBottom: '14px' }}>Overtaking</div>

                {overview.overtakes2023 === null && overview.overtakes2024 === null && overview.overtakes2025 === null ? (
                  <div style={{ textAlign: 'center' as const, color: '#5A6A7A', fontSize: '13px', padding: '8px 0 16px' }}>No historical data — debut circuit</div>
                ) : (
                  <>
                    {/* Large average — above year table */}
                    <div style={{ textAlign: 'center' as const, marginBottom: '16px' }}>
                      <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '52px', fontWeight: 700, color: '#F0F4F8', lineHeight: 1 }}>{overview.avgOvertakes}</div>
                      <div style={{ fontSize: '12px', color: '#5A6A7A', marginTop: '4px' }}>Average Overtakes per Race ({overview.overtakeSeasonsLabel})</div>
                    </div>
                    {/* Year table */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '16px' }}>
                      {([
                        { year: '2023', val: overview.overtakes2023 },
                        { year: '2024', val: overview.overtakes2024 },
                        { year: '2025', val: overview.overtakes2025 },
                      ] as { year: string; val: number | null }[]).map(({ year, val }) => (
                        <div key={year} style={{ textAlign: 'center' as const }}>
                          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: '#5A6A7A', textTransform: 'uppercase' as const, letterSpacing: '0.5px', marginBottom: '4px' }}>{year}</div>
                          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '22px', fontWeight: 600, color: val !== null ? '#F0F4F8' : '#5A6A7A' }}>{val !== null ? val : '—'}</div>
                        </div>
                      ))}
                    </div>
                    {/* Grid Importance Indicator */}
                    <div>
                      <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase' as const, color: '#5A6A7A', marginBottom: '8px' }}>Grid Importance Indicator</div>
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
                  <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase' as const, color: '#5A6A7A', marginBottom: '14px' }}>DNF History (Incl. DSQs)</div>

                  {overview.dnfHistory.y2023 === null && overview.dnfHistory.y2024 === null && overview.dnfHistory.y2025 === null ? (
                    <div style={{ textAlign: 'center' as const, color: '#5A6A7A', fontSize: '13px', padding: '8px 0' }}>No historical data — debut circuit</div>
                  ) : (
                    <>
                      {/* Large average — above year table */}
                      <div style={{ textAlign: 'center' as const, marginBottom: '16px' }}>
                        <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '52px', fontWeight: 700, color: '#F0F4F8', lineHeight: 1 }}>{overview.dnfHistory.avg}</div>
                        <div style={{ fontSize: '12px', color: '#5A6A7A', marginTop: '4px' }}>Average DNFs per Race (2023–2025)</div>
                      </div>
                      {/* Year table */}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '16px' }}>
                        {([
                          { year: '2023', val: overview.dnfHistory.y2023 },
                          { year: '2024', val: overview.dnfHistory.y2024 },
                          { year: '2025', val: overview.dnfHistory.y2025 },
                        ] as { year: string; val: number | null }[]).map(({ year, val }) => (
                          <div key={year} style={{ textAlign: 'center' as const }}>
                            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: '#5A6A7A', textTransform: 'uppercase' as const, letterSpacing: '0.5px', marginBottom: '4px' }}>{year}</div>
                            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '22px', fontWeight: 600, color: val !== null ? '#F0F4F8' : '#5A6A7A' }}>{val !== null ? val : '—'}</div>
                          </div>
                        ))}
                      </div>
                      {/* DNF Risk Indicator */}
                      {dnfRisk && (
                        <div>
                          <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase' as const, color: '#5A6A7A', marginBottom: '8px' }}>DNF Risk Indicator</div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: dnfRisk.bg, borderRadius: '8px', padding: '12px 14px' }}>
                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: dnfRisk.color, flexShrink: 0 }} />
                            <div>
                              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', fontWeight: 700, color: dnfRisk.color }}>{dnfRisk.label}</div>
                              <div style={{ fontSize: '11px', color: '#8A9AB0', marginTop: '2px', lineHeight: 1.4 }}>{dnfRisk.desc}</div>
                            </div>
                          </div>
                          <div style={{ fontSize: '10px', color: '#3A4A5A', marginTop: '8px', lineHeight: 1.6 }}>
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
        const isCurrentRace = selectedRound === CURRENT_RACE.round
        const useStaticSessions = !loading && sessions.length === 0 && isCurrentRace && CURRENT_RACE.sessions.length > 0
        const calendarSessData = SEASON_CALENDAR.find(r => r.round === selectedRound)?.sessions
        const useCalendarSessions = !loading && sessions.length === 0 && !useStaticSessions && !!calendarSessData?.length
        const raceTimezone = selectedRace?.timezone ?? 'UTC'
        return (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
            <div style={card}>
              <div style={cardHeader}>
                <span style={cardTitle}>Session Schedule</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {/* Timezone toggle */}
                  <div style={{ display: 'flex', background: '#141B22', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.07)', overflow: 'hidden' }}>
                    <button
                      onClick={() => setUseLocalTime(false)}
                      style={{
                        background: !useLocalTime ? 'rgba(232,0,45,0.15)' : 'transparent',
                        color: !useLocalTime ? '#E8002D' : '#5A6A7A',
                        border: 'none', padding: '4px 10px', cursor: 'pointer',
                        fontSize: '10px', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.5px',
                      }}
                    >Track</button>
                    <button
                      onClick={() => setUseLocalTime(true)}
                      style={{
                        background: useLocalTime ? 'rgba(232,0,45,0.15)' : 'transparent',
                        color: useLocalTime ? '#E8002D' : '#5A6A7A',
                        border: 'none', borderLeft: '1px solid rgba(255,255,255,0.07)',
                        padding: '4px 10px', cursor: 'pointer',
                        fontSize: '10px', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.5px',
                      }}
                    >Local</button>
                  </div>
                  <Badge type={selectedRace.completed ? 'done' : 'live'} label={selectedRace.completed ? 'Completed' : 'Upcoming'} />
                </div>
              </div>
              <div style={{ padding: '16px 20px' }}>
                {loading ? <Loader label="sessions" /> : sessions.length === 0 && !useStaticSessions && !useCalendarSessions ? (
                  <div style={{ color: '#5A6A7A', fontSize: '13px', padding: '20px 0' }}>
                    {selectedRace.completed ? 'Session data not yet available' : `Sessions will appear closer to race weekend (${selectedRace.date})`}
                  </div>
                ) : useCalendarSessions ? (
                  calendarSessData!.map((s, i) => {
                    const now = new Date()
                    const sessionDate = new Date(s.date)
                    const isCompleted = sessionDate < now
                    const isNext = !isCompleted && calendarSessData!.findIndex(x => new Date(x.date) >= now) === i
                    const shortMap: Record<string, string> = { 'Practice 1': 'FP1', 'Practice 2': 'FP2', 'Practice 3': 'FP3', 'Sprint Qualifying': 'SQ', 'Sprint': 'SPRINT', 'Qualifying': 'QUAL', 'Race': 'RACE' }
                    const shortLabel = shortMap[s.name] || s.name
                    const { dateLabel, timeLabel: displayTime } = formatSessionDateTime(s.date, raceTimezone, useLocalTime)
                    return (
                      <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 0', borderBottom: i < calendarSessData!.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none', opacity: isCompleted ? 0.45 : 1 }}>
                        <div style={{ width: '52px', fontFamily: 'Bebas Neue, sans-serif', fontSize: '12px', letterSpacing: '0.5px', color: isNext ? '#E8002D' : isCompleted ? '#3A4A5A' : '#8A9AB0', textAlign: 'center' as const, background: isNext ? 'rgba(232,0,45,0.1)' : 'rgba(255,255,255,0.04)', padding: '4px 6px', borderRadius: '5px', flexShrink: 0 }}>
                          {shortLabel}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '13px', fontWeight: 600, color: isCompleted ? '#3A4A5A' : '#F0F4F8' }}>{s.name}</div>
                          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: '#5A6A7A', marginTop: '2px' }}>{dateLabel} · {displayTime}</div>
                        </div>
                        {isNext && <span style={{ fontSize: '9px', fontWeight: 700, padding: '3px 7px', borderRadius: '20px', background: '#E8002D', color: 'white', textTransform: 'uppercase' as const, letterSpacing: '0.5px', flexShrink: 0 }}>Next</span>}
                        {isCompleted && <span style={{ fontSize: '12px', color: '#00D47E', flexShrink: 0 }}>✓</span>}
                      </div>
                    )
                  })
                ) : useStaticSessions ? (
                  CURRENT_RACE.sessions.map((s, i) => {
                    const nextSession = CURRENT_RACE.sessions.find(x => !x.completed)
                    const isNext = s === nextSession
                    const { dateLabel, timeLabel: displayTime } = s.dateISO
                      ? formatSessionDateTime(s.dateISO, CURRENT_RACE.timezone, useLocalTime)
                      : { dateLabel: s.date, timeLabel: useLocalTime ? new Date(s.dateISO ?? '').toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) : s.timeLocal }
                    return (
                      <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 0', borderBottom: i < CURRENT_RACE.sessions.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none', opacity: s.completed ? 0.45 : 1 }}>
                        <div style={{ width: '52px', fontFamily: 'Bebas Neue, sans-serif', fontSize: '12px', letterSpacing: '0.5px', color: isNext ? '#E8002D' : s.completed ? '#3A4A5A' : '#8A9AB0', textAlign: 'center' as const, background: isNext ? 'rgba(232,0,45,0.1)' : 'rgba(255,255,255,0.04)', padding: '4px 6px', borderRadius: '5px', flexShrink: 0 }}>
                          {s.short}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '13px', fontWeight: 600, color: s.completed ? '#3A4A5A' : '#F0F4F8' }}>{s.name}</div>
                          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: '#5A6A7A', marginTop: '2px' }}>
                            {dateLabel} · {displayTime}
                          </div>
                        </div>
                        {isNext && <span style={{ fontSize: '9px', fontWeight: 700, padding: '3px 7px', borderRadius: '20px', background: '#E8002D', color: 'white', textTransform: 'uppercase' as const, letterSpacing: '0.5px', flexShrink: 0 }}>Next</span>}
                        {s.completed && <span style={{ fontSize: '12px', color: '#00D47E', flexShrink: 0 }}>✓</span>}
                      </div>
                    )
                  })
                ) : sessions.map((s: any, i: number) => (
                  <div key={s.session_key} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 0', borderBottom: i < sessions.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '13px', fontWeight: 600 }}>{s.session_name}</div>
                      <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: '#5A6A7A', marginTop: '2px' }}>
                        {s.date_start
                          ? (() => {
                              const { dateLabel, timeLabel } = formatSessionDateTime(s.date_start, raceTimezone, useLocalTime)
                              return `${dateLabel} · ${timeLabel}`
                            })()
                          : '—'}
                      </div>
                    </div>
                  </div>
                ))}
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
                <Badge type="live" label="Live" />
              </div>
              <div style={{ padding: '20px' }}>
                {loading ? <Loader label="weather" /> : !weather ? (
                  <div style={{ color: '#5A6A7A', fontSize: '13px' }}>No live track data available — check back during the race weekend</div>
                ) : (
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
                      <div key={stat.label} style={{ background: '#141B22', borderRadius: '8px', padding: '14px' }}>
                        <div style={{ fontSize: '11px', color: '#5A6A7A', textTransform: 'uppercase' as const, letterSpacing: '1px', marginBottom: '6px' }}>{stat.icon} {stat.label}</div>
                        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '18px', fontWeight: 600 }}>{stat.value}</div>
                      </div>
                    ))}
                  </div>
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
                  <div style={{ color: '#5A6A7A', fontSize: '13px' }}>No location data available for this circuit</div>
                ) : forecastDays.length === 0 ? (
                  <div style={{ color: '#5A6A7A', fontSize: '13px' }}>Could not load forecast data</div>
                ) : (
                  <>
                    {[
                      { label: 'Pre-Weekend', days: forecastDays.slice(0, 4), accent: '#5A6A7A' },
                      { label: 'Race Weekend', days: forecastDays.slice(4, 7), accent: '#E8002D' },
                    ].map(section => (
                      <div key={section.label} style={{ marginBottom: '16px' }}>
                        <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase' as const, color: section.accent, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          {section.label === 'Race Weekend' && <div style={{ width: '6px', height: '6px', background: '#E8002D', borderRadius: '50%' }} />}
                          {section.label}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '6px' }}>
                          {section.days.map((day: any) => {
                            const d = new Date(day.date + 'T12:00:00Z')
                            const dayLabel = d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'UTC' })
                            const rainHigh = day.rainChance >= 60
                            const rainMed = day.rainChance >= 30
                            const isRaceWeekend = section.label === 'Race Weekend'
                            return (
                              <div key={day.date} style={{ display: 'grid', gridTemplateColumns: '90px 28px 1fr auto auto auto', alignItems: 'center', gap: '8px', padding: '9px 12px', background: isRaceWeekend ? 'rgba(232,0,45,0.04)' : '#141B22', borderRadius: '8px', border: isRaceWeekend ? '1px solid rgba(232,0,45,0.12)' : '1px solid rgba(255,255,255,0.04)' }}>
                                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: isRaceWeekend ? '#F0F4F8' : '#8A9AB0' }}>{dayLabel}</span>
                                <span style={{ fontSize: '18px', textAlign: 'center' as const }}>{wmoIcon(day.code)}</span>
                                <span style={{ fontSize: '11px', color: '#5A6A7A' }}>{wmoLabel(day.code)}</span>
                                <div style={{ textAlign: 'right' as const }}>
                                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', fontWeight: 600, color: '#F0F4F8' }}>{Math.round(day.maxTemp)}°</span>
                                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: '#5A6A7A', marginLeft: '4px' }}>{Math.round(day.minTemp)}°</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                                  <span style={{ fontSize: '10px' }}>💧</span>
                                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', fontWeight: 600, color: rainHigh ? '#E8002D' : rainMed ? '#FFB800' : '#5A6A7A' }}>{day.rainChance}%</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                                  <span style={{ fontSize: '10px' }}>💨</span>
                                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#5A6A7A' }}>{Math.round(day.windMax)}<span style={{ fontSize: '9px' }}>km/h</span></span>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    ))}
                    <div style={{ marginTop: '6px', fontSize: '10px', color: '#3A4A5A', lineHeight: 1.6 }}>
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

        // Per-circuit pitwall data — keyed by round
        const pitwallData: Record<number, {
          downforce: string
          downforceLevel: number // 1=low … 5=high
          downforceNote: string
          compounds: { name: string; color: string; code: string; desc: string }[]
          strategies: { name: string; stops: number; laps: string[]; note: string }[]
        }> = {
          4: { // Miami — Miami International Autodrome
            downforce: 'Medium / Low',
            downforceLevel: 2,
            downforceNote: 'Miami\'s long straights reward low downforce setups. Teams sacrifice cornering grip for straight-line speed, similar to Monza but with more medium-speed corners requiring a compromise.',
            compounds: [
              { name: 'Hard',   color: '#FFFFFF', code: 'C3', desc: 'Durable race tyre. Used for long first stints in 1-stop strategies.' },
              { name: 'Medium', color: '#FFD700', code: 'C4', desc: 'Most flexible option. Used in both stints of a 1-stop or the middle stint of a 2-stop.' },
              { name: 'Soft',   color: '#E8002D', code: 'C5', desc: 'Fast qualifying tyre. Degrades quickly in Miami heat.' },
            ],
            strategies: [
              { name: '1-Stop Medium → Hard',     stops: 1, laps: ['Lap 1–27: Medium', 'Pit ~Lap 27', 'Lap 28–57: Hard'],                                              note: 'Benchmark strategy. Delivered the race win in 2025 and expected to be the frontrunner default again this year.' },
              { name: '1-Stop Soft → Hard',       stops: 1, laps: ['Lap 1–18: Soft',   'Pit ~Lap 18', 'Lap 19–57: Hard'],                                              note: 'Aggressive option for drivers looking to gain track position off the line. Higher tyre risk in Miami heat.' },
              { name: '2-Stop Soft → Med → Hard', stops: 2, laps: ['Lap 1–15: Soft',   'Pit ~Lap 15', 'Lap 16–36: Medium', 'Pit ~Lap 36', 'Lap 37–57: Hard'], note: 'Used after safety car or if degradation is high. Can be reactive to race events.' },
            ],
          },
          3: { // Japan — Suzuka
            downforce: 'High',
            downforceLevel: 5,
            downforceNote: 'Suzuka\'s high-speed corners (Turns 1–9, 130R) demand maximum downforce. Teams typically run their highest-downforce configurations of the year here.',
            compounds: [
              { name: 'Hard',   color: '#FFFFFF', code: 'C1', desc: 'Primary race tyre. Very durable — teams may attempt a 1-stop on H–M.' },
              { name: 'Medium', color: '#FFD700', code: 'C2', desc: 'Versatile option for both stints. Often used as the second tyre in a 1-stop.' },
              { name: 'Soft',   color: '#E8002D', code: 'C3', desc: 'Fast qualifying tyre. Degrades quickly at Suzuka\'s high-speed corners.' },
            ],
            strategies: [
              { name: '1-Stop Medium → Hard',  stops: 1, laps: ['Lap 1–20: Medium', 'Pit ~Lap 20', 'Lap 21–53: Hard'],  note: 'Frontrunner default. Prioritises track position. Works well in clean air.' },
              { name: '1-Stop Hard → Medium',  stops: 1, laps: ['Lap 1–28: Hard',   'Pit ~Lap 28', 'Lap 29–53: Medium'], note: 'Aggressive undercut option — opens up faster final stint pace.' },
              { name: '2-Stop Soft → Med → Hard', stops: 2, laps: ['Lap 1–14: Soft', 'Pit ~Lap 14', 'Lap 15–34: Medium', 'Pit ~Lap 34', 'Lap 35–53: Hard'], note: 'Used if degradation is higher than expected or after a safety car.' },
            ],
          },
          1: { // Australia — Albert Park
            downforce: 'Medium / High',
            downforceLevel: 4,
            downforceNote: 'Albert Park combines fast flowing sections with technical chicanes. Teams run medium-high downforce to balance cornering grip with straight-line speed.',
            compounds: [
              { name: 'Hard',   color: '#FFFFFF', code: 'C2', desc: 'Durable option for a 1-stop. Suits cooler Melbourne conditions.' },
              { name: 'Medium', color: '#FFD700', code: 'C3', desc: 'Versatile — commonly used in the opening stint or as the second tyre.' },
              { name: 'Soft',   color: '#E8002D', code: 'C4', desc: 'Qualifying tyre. Can be used at race start from grid position.' },
            ],
            strategies: [
              { name: '1-Stop Medium → Hard',  stops: 1, laps: ['Lap 1–22: Medium', 'Pit ~Lap 22', 'Lap 23–58: Hard'],  note: 'Dominant strategy in recent years. Track position key at Albert Park.' },
              { name: '1-Stop Soft → Hard',    stops: 1, laps: ['Lap 1–18: Soft',   'Pit ~Lap 18', 'Lap 19–58: Hard'],  note: 'Works for drivers starting from the front who can manage early tyre life.' },
              { name: '2-Stop Soft → Med → Med', stops: 2, laps: ['Lap 1–15: Soft', 'Pit ~Lap 15', 'Lap 16–38: Medium', 'Pit ~Lap 38', 'Lap 39–58: Medium'], note: 'Safety car play or teams unable to make 1-stop work.' },
            ],
          },
          2: { // China — Shanghai
            downforce: 'Medium',
            downforceLevel: 3,
            downforceNote: 'Shanghai has a mix of long straights and medium-speed corners. Teams target a balanced downforce setup — too much costs too much speed on the back straight.',
            compounds: [
              { name: 'Hard',   color: '#FFFFFF', code: 'C2', desc: 'Used on the harder end of the range for China\'s abrasive surface.' },
              { name: 'Medium', color: '#FFD700', code: 'C3', desc: 'Common race tyre. Good balance of pace and durability.' },
              { name: 'Soft',   color: '#E8002D', code: 'C4', desc: 'Qualifying tyre. Tends to drop off quickly in the race.' },
            ],
            strategies: [
              { name: '1-Stop Medium → Hard',  stops: 1, laps: ['Lap 1–20: Medium', 'Pit ~Lap 20', 'Lap 21–56: Hard'],  note: 'Standard 1-stop. Works on the Sprint weekend format.' },
              { name: '2-Stop Soft → Med → Hard', stops: 2, laps: ['Lap 1–12: Soft', 'Pit ~Lap 12', 'Lap 13–35: Medium', 'Pit ~Lap 35', 'Lap 36–56: Hard'], note: 'Aggressive option — often triggered by safety car.' },
            ],
          },
        }

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

            {!data ? (
              <div style={{ ...card, padding: '40px', textAlign: 'center' as const }}>
                <div style={{ fontSize: '32px', marginBottom: '12px' }}>🏗️</div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#F0F4F8', marginBottom: '8px' }}>Pitwall data coming soon</div>
                <div style={{ fontSize: '13px', color: '#5A6A7A' }}>Tyre compound and strategy data for {raceName} will be added closer to race weekend.</div>
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
                          <span style={{ fontSize: '9px', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.5px', color: bar.level === data.downforceLevel ? '#F0F4F8' : '#3A4A5A', textAlign: 'center' as const, whiteSpace: 'nowrap' as const }}>{bar.label}</span>
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
                      <div key={c.name} style={{ background: '#141B22', borderRadius: '12px', padding: '18px', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column' as const, gap: '10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          {/* Tyre circle */}
                          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#0E1318', border: `3px solid ${c.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', fontWeight: 700, color: c.color }}>{c.code}</span>
                          </div>
                          <div>
                            <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '18px', letterSpacing: '1px', color: c.color }}>{c.name}</div>
                            <div style={{ fontSize: '10px', fontWeight: 600, color: '#3A4A5A', textTransform: 'uppercase' as const, letterSpacing: '1px' }}>Compound {c.code}</div>
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
                      <div key={i} style={{ background: '#141B22', borderRadius: '12px', padding: '18px', border: '1px solid rgba(255,255,255,0.06)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '4px', background: s.stops === 1 ? 'rgba(0,212,126,0.12)' : 'rgba(255,184,0,0.12)', color: s.stops === 1 ? '#00D47E' : '#FFB800' }}>
                            {s.stops}-Stop
                          </span>
                          <span style={{ fontSize: '13px', fontWeight: 600, color: '#F0F4F8' }}>{s.name}</span>
                        </div>
                        {/* Stint visualiser */}
                        <div style={{ display: 'flex', gap: '6px', marginBottom: '12px', flexWrap: 'wrap' as const }}>
                          {s.laps.map((stint, j) => {
                            const isPit = stint.startsWith('Pit')
                            const tyreColor = stint.includes('Hard') ? '#FFFFFF' : stint.includes('Medium') ? '#FFD700' : stint.includes('Soft') ? '#E8002D' : '#5A6A7A'
                            return (
                              <div key={j} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                {isPit ? (
                                  <span style={{ fontSize: '10px', fontWeight: 700, padding: '3px 8px', borderRadius: '4px', background: 'rgba(0,168,255,0.12)', color: '#00A8FF' }}>{stint}</span>
                                ) : (
                                  <span style={{ fontSize: '11px', fontWeight: 600, padding: '3px 10px', borderRadius: '4px', background: `${tyreColor}18`, color: tyreColor, border: `1px solid ${tyreColor}30` }}>{stint}</span>
                                )}
                                {j < s.laps.length - 1 && !isPit && <span style={{ color: '#3A4A5A', fontSize: '10px' }}>→</span>}
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
