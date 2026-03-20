'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { SEASON_CALENDAR, CURRENT_RACE } from '@/lib/races'
import { STATIC_RACE_RESULTS } from '@/lib/raceResults'

// Hardcoded FP session keys from OpenF1 for past/current rounds
const FP_SESSION_KEYS: Record<number, Partial<Record<string, number>>> = {
  1: { fp1: 11227, fp2: 11228, fp3: 11229 },
  2: { fp1: 11235 },
  3: { fp1: 11246, fp2: 11247, fp3: 11248 },
}

// OpenF1 meeting keys for all 22 rounds (for dynamic FP session key lookup)
const OPENF1_MEETING_KEYS: Record<number, number> = {
  1: 1279, 2: 1280, 3: 1281, 4: 1284, 5: 1285,
  6: 1286, 7: 1287, 8: 1288, 9: 1289, 10: 1290,
  11: 1291, 12: 1292, 13: 1293, 14: 1294, 15: 1295,
  16: 1296, 17: 1297, 18: 1298, 19: 1299, 20: 1300,
  21: 1301, 22: 1302,
}

// Static fallback practice results (used if live API fails or returns fewer than 22 drivers)
const FP_STATIC_FALLBACK: Record<number, Record<string, any[]>> = {
  1: {
    fp1: [
      { position: 1,  driver_number: 16, name: 'Charles Leclerc',   team: 'Ferrari',        team_colour: '#E8002D', time: '1:20.267', gap: '—'        },
      { position: 2,  driver_number: 44, name: 'Lewis Hamilton',    team: 'Ferrari',        team_colour: '#E8002D', time: '1:20.736', gap: '+0.469s'  },
      { position: 3,  driver_number: 1,  name: 'Max Verstappen',    team: 'Red Bull Racing',team_colour: '#3671C6', time: '1:20.789', gap: '+0.522s'  },
      { position: 4,  driver_number: 6,  name: 'Isack Hadjar',      team: 'Red Bull Racing',team_colour: '#3671C6', time: '1:21.087', gap: '+0.820s'  },
      { position: 5,  driver_number: 7,  name: 'Arvid Lindblad',    team: 'Racing Bulls',   team_colour: '#6692FF', time: '1:21.313', gap: '+1.046s'  },
      { position: 6,  driver_number: 81, name: 'Oscar Piastri',     team: 'McLaren',        team_colour: '#FF8000', time: '1:21.342', gap: '+1.075s'  },
      { position: 7,  driver_number: 63, name: 'George Russell',    team: 'Mercedes',       team_colour: '#27F4D2', time: '1:21.371', gap: '+1.104s'  },
      { position: 8,  driver_number: 12, name: 'Kimi Antonelli',    team: 'Mercedes',       team_colour: '#27F4D2', time: '1:21.376', gap: '+1.109s'  },
      { position: 9,  driver_number: 5,  name: 'Gabriel Bortoleto', team: 'Audi',           team_colour: '#C0C0C0', time: '1:21.696', gap: '+1.429s'  },
      { position: 10, driver_number: 27, name: 'Nico Hülkenberg',   team: 'Audi',           team_colour: '#C0C0C0', time: '1:21.969', gap: '+1.702s'  },
      { position: 11, driver_number: 31, name: 'Esteban Ocon',      team: 'Haas',           team_colour: '#B6BABD', time: '1:22.161', gap: '+1.894s'  },
      { position: 12, driver_number: 55, name: 'Carlos Sainz',      team: 'Williams',       team_colour: '#64C4FF', time: '1:22.323', gap: '+2.056s'  },
      { position: 13, driver_number: 30, name: 'Liam Lawson',       team: 'Racing Bulls',   team_colour: '#6692FF', time: '1:22.613', gap: '+2.346s'  },
      { position: 14, driver_number: 87, name: 'Oliver Bearman',    team: 'Haas',           team_colour: '#B6BABD', time: '1:22.682', gap: '+2.415s'  },
      { position: 15, driver_number: 23, name: 'Alex Albon',        team: 'Williams',       team_colour: '#64C4FF', time: '1:23.130', gap: '+2.863s'  },
      { position: 16, driver_number: 43, name: 'Franco Colapinto',  team: 'Alpine',         team_colour: '#FF69B4', time: '1:23.325', gap: '+3.058s'  },
      { position: 17, driver_number: 77, name: 'Valtteri Bottas',   team: 'Cadillac',       team_colour: '#CC0000', time: '1:24.022', gap: '+3.755s'  },
      { position: 18, driver_number: 10, name: 'Pierre Gasly',      team: 'Alpine',         team_colour: '#FF69B4', time: '1:24.035', gap: '+3.768s'  },
      { position: 19, driver_number: 4,  name: 'Lando Norris',      team: 'McLaren',        team_colour: '#FF8000', time: '1:24.391', gap: '+4.124s'  },
      { position: 20, driver_number: 11, name: 'Sergio Pérez',      team: 'Cadillac',       team_colour: '#CC0000', time: '1:24.620', gap: '+4.353s'  },
      { position: 21, driver_number: 18, name: 'Lance Stroll',      team: 'Aston Martin',   team_colour: '#358C75', time: '1:50.334', gap: '+30.067s' },
      { position: 22, driver_number: 14, name: 'Fernando Alonso',   team: 'Aston Martin',   team_colour: '#358C75', time: 'NO TIME',  gap: null       },
    ],
    fp2: [
      { position: 1,  driver_number: 81, name: 'Oscar Piastri',     team: 'McLaren',        team_colour: '#FF8000', time: '1:19.729', gap: '—'        },
      { position: 2,  driver_number: 12, name: 'Kimi Antonelli',    team: 'Mercedes',       team_colour: '#27F4D2', time: '1:19.943', gap: '+0.214s'  },
      { position: 3,  driver_number: 63, name: 'George Russell',    team: 'Mercedes',       team_colour: '#27F4D2', time: '1:20.049', gap: '+0.320s'  },
      { position: 4,  driver_number: 44, name: 'Lewis Hamilton',    team: 'Ferrari',        team_colour: '#E8002D', time: '1:20.050', gap: '+0.321s'  },
      { position: 5,  driver_number: 16, name: 'Charles Leclerc',   team: 'Ferrari',        team_colour: '#E8002D', time: '1:20.291', gap: '+0.562s'  },
      { position: 6,  driver_number: 1,  name: 'Max Verstappen',    team: 'Red Bull Racing',team_colour: '#3671C6', time: '1:20.366', gap: '+0.637s'  },
      { position: 7,  driver_number: 4,  name: 'Lando Norris',      team: 'McLaren',        team_colour: '#FF8000', time: '1:20.794', gap: '+1.065s'  },
      { position: 8,  driver_number: 7,  name: 'Arvid Lindblad',    team: 'Racing Bulls',   team_colour: '#6692FF', time: '1:20.922', gap: '+1.193s'  },
      { position: 9,  driver_number: 6,  name: 'Isack Hadjar',      team: 'Red Bull Racing',team_colour: '#3671C6', time: '1:20.941', gap: '+1.212s'  },
      { position: 10, driver_number: 31, name: 'Esteban Ocon',      team: 'Haas',           team_colour: '#B6BABD', time: '1:21.179', gap: '+1.450s'  },
      { position: 11, driver_number: 87, name: 'Oliver Bearman',    team: 'Haas',           team_colour: '#B6BABD', time: '1:21.326', gap: '+1.597s'  },
      { position: 12, driver_number: 27, name: 'Nico Hülkenberg',   team: 'Audi',           team_colour: '#C0C0C0', time: '1:21.351', gap: '+1.622s'  },
      { position: 13, driver_number: 30, name: 'Liam Lawson',       team: 'Racing Bulls',   team_colour: '#6692FF', time: '1:21.358', gap: '+1.629s'  },
      { position: 14, driver_number: 5,  name: 'Gabriel Bortoleto', team: 'Audi',           team_colour: '#C0C0C0', time: '1:21.668', gap: '+1.939s'  },
      { position: 15, driver_number: 23, name: 'Alex Albon',        team: 'Williams',       team_colour: '#64C4FF', time: '1:21.847', gap: '+2.118s'  },
      { position: 16, driver_number: 10, name: 'Pierre Gasly',      team: 'Alpine',         team_colour: '#FF69B4', time: '1:22.167', gap: '+2.438s'  },
      { position: 17, driver_number: 55, name: 'Carlos Sainz',      team: 'Williams',       team_colour: '#64C4FF', time: '1:22.253', gap: '+2.524s'  },
      { position: 18, driver_number: 43, name: 'Franco Colapinto',  team: 'Alpine',         team_colour: '#FF69B4', time: '1:22.619', gap: '+2.890s'  },
      { position: 19, driver_number: 77, name: 'Valtteri Bottas',   team: 'Cadillac',       team_colour: '#CC0000', time: '1:23.660', gap: '+3.931s'  },
      { position: 20, driver_number: 14, name: 'Fernando Alonso',   team: 'Aston Martin',   team_colour: '#358C75', time: '1:24.662', gap: '+4.933s'  },
      { position: 21, driver_number: 18, name: 'Lance Stroll',      team: 'Aston Martin',   team_colour: '#358C75', time: '1:25.816', gap: '+6.087s'  },
      { position: 22, driver_number: 11, name: 'Sergio Pérez',      team: 'Cadillac',       team_colour: '#CC0000', time: 'NO TIME',  gap: null       },
    ],
    fp3: [
      { position: 1,  driver_number: 63, name: 'George Russell',    team: 'Mercedes',       team_colour: '#27F4D2', time: '1:19.053', gap: '—'        },
      { position: 2,  driver_number: 44, name: 'Lewis Hamilton',    team: 'Ferrari',        team_colour: '#E8002D', time: '1:19.669', gap: '+0.616s'  },
      { position: 3,  driver_number: 16, name: 'Charles Leclerc',   team: 'Ferrari',        team_colour: '#E8002D', time: '1:19.827', gap: '+0.774s'  },
      { position: 4,  driver_number: 81, name: 'Oscar Piastri',     team: 'McLaren',        team_colour: '#FF8000', time: '1:20.087', gap: '+1.034s'  },
      { position: 5,  driver_number: 6,  name: 'Isack Hadjar',      team: 'Red Bull Racing',team_colour: '#3671C6', time: '1:20.137', gap: '+1.084s'  },
      { position: 6,  driver_number: 1,  name: 'Max Verstappen',    team: 'Red Bull Racing',team_colour: '#3671C6', time: '1:20.197', gap: '+1.144s'  },
      { position: 7,  driver_number: 12, name: 'Kimi Antonelli',    team: 'Mercedes',       team_colour: '#27F4D2', time: '1:20.324', gap: '+1.271s'  },
      { position: 8,  driver_number: 4,  name: 'Lando Norris',      team: 'McLaren',        team_colour: '#FF8000', time: '1:20.443', gap: '+1.390s'  },
      { position: 9,  driver_number: 5,  name: 'Gabriel Bortoleto', team: 'Audi',           team_colour: '#C0C0C0', time: '1:20.459', gap: '+1.406s'  },
      { position: 10, driver_number: 87, name: 'Oliver Bearman',    team: 'Haas',           team_colour: '#B6BABD', time: '1:20.778', gap: '+1.725s'  },
      { position: 11, driver_number: 7,  name: 'Arvid Lindblad',    team: 'Racing Bulls',   team_colour: '#6692FF', time: '1:20.838', gap: '+1.785s'  },
      { position: 12, driver_number: 30, name: 'Liam Lawson',       team: 'Racing Bulls',   team_colour: '#6692FF', time: '1:20.890', gap: '+1.837s'  },
      { position: 13, driver_number: 31, name: 'Esteban Ocon',      team: 'Haas',           team_colour: '#B6BABD', time: '1:20.983', gap: '+1.930s'  },
      { position: 14, driver_number: 27, name: 'Nico Hülkenberg',   team: 'Audi',           team_colour: '#C0C0C0', time: '1:21.067', gap: '+2.014s'  },
      { position: 15, driver_number: 10, name: 'Pierre Gasly',      team: 'Alpine',         team_colour: '#FF69B4', time: '1:21.071', gap: '+2.018s'  },
      { position: 16, driver_number: 43, name: 'Franco Colapinto',  team: 'Alpine',         team_colour: '#FF69B4', time: '1:21.413', gap: '+2.360s'  },
      { position: 17, driver_number: 23, name: 'Alex Albon',        team: 'Williams',       team_colour: '#64C4FF', time: '1:21.664', gap: '+2.611s'  },
      { position: 18, driver_number: 14, name: 'Fernando Alonso',   team: 'Aston Martin',   team_colour: '#358C75', time: '1:22.720', gap: '+3.667s'  },
      { position: 19, driver_number: 77, name: 'Valtteri Bottas',   team: 'Cadillac',       team_colour: '#CC0000', time: '1:23.514', gap: '+4.461s'  },
      { position: 20, driver_number: 11, name: 'Sergio Pérez',      team: 'Cadillac',       team_colour: '#CC0000', time: '1:24.397', gap: '+5.344s'  },
      { position: 21, driver_number: 55, name: 'Carlos Sainz',      team: 'Williams',       team_colour: '#64C4FF', time: 'NO TIME',  gap: null       },
      { position: 22, driver_number: 18, name: 'Lance Stroll',      team: 'Aston Martin',   team_colour: '#358C75', time: 'NO TIME',  gap: null       },
    ],
  },
  2: {
    fp1: [
      { position: 1,  driver_number: 63, name: 'George Russell',    team: 'Mercedes',       team_colour: '#27F4D2', time: '1:32.741', gap: '—'        },
      { position: 2,  driver_number: 12, name: 'Kimi Antonelli',    team: 'Mercedes',       team_colour: '#27F4D2', time: '1:32.861', gap: '+0.120s'  },
      { position: 3,  driver_number: 4,  name: 'Lando Norris',      team: 'McLaren',        team_colour: '#FF8000', time: '1:33.296', gap: '+0.555s'  },
      { position: 4,  driver_number: 81, name: 'Oscar Piastri',     team: 'McLaren',        team_colour: '#FF8000', time: '1:33.472', gap: '+0.731s'  },
      { position: 5,  driver_number: 16, name: 'Charles Leclerc',   team: 'Ferrari',        team_colour: '#E8002D', time: '1:33.599', gap: '+0.858s'  },
      { position: 6,  driver_number: 44, name: 'Lewis Hamilton',    team: 'Ferrari',        team_colour: '#E8002D', time: '1:34.129', gap: '+1.388s'  },
      { position: 7,  driver_number: 87, name: 'Oliver Bearman',    team: 'Haas',           team_colour: '#B6BABD', time: '1:34.426', gap: '+1.685s'  },
      { position: 8,  driver_number: 1,  name: 'Max Verstappen',    team: 'Red Bull Racing',team_colour: '#3671C6', time: '1:34.541', gap: '+1.800s'  },
      { position: 9,  driver_number: 27, name: 'Nico Hülkenberg',   team: 'Audi',           team_colour: '#C0C0C0', time: '1:34.639', gap: '+1.898s'  },
      { position: 10, driver_number: 10, name: 'Pierre Gasly',      team: 'Alpine',         team_colour: '#FF69B4', time: '1:34.676', gap: '+1.935s'  },
      { position: 11, driver_number: 30, name: 'Liam Lawson',       team: 'Racing Bulls',   team_colour: '#6692FF', time: '1:34.773', gap: '+2.032s'  },
      { position: 12, driver_number: 5,  name: 'Gabriel Bortoleto', team: 'Audi',           team_colour: '#C0C0C0', time: '1:34.828', gap: '+2.087s'  },
      { position: 13, driver_number: 6,  name: 'Isack Hadjar',      team: 'Red Bull Racing',team_colour: '#3671C6', time: '1:34.856', gap: '+2.115s'  },
      { position: 14, driver_number: 31, name: 'Esteban Ocon',      team: 'Haas',           team_colour: '#B6BABD', time: '1:34.877', gap: '+2.136s'  },
      { position: 15, driver_number: 43, name: 'Franco Colapinto',  team: 'Alpine',         team_colour: '#FF69B4', time: '1:34.947', gap: '+2.206s'  },
      { position: 16, driver_number: 23, name: 'Alex Albon',        team: 'Williams',       team_colour: '#64C4FF', time: '1:35.480', gap: '+2.739s'  },
      { position: 17, driver_number: 55, name: 'Carlos Sainz',      team: 'Williams',       team_colour: '#64C4FF', time: '1:35.679', gap: '+2.938s'  },
      { position: 18, driver_number: 14, name: 'Fernando Alonso',   team: 'Aston Martin',   team_colour: '#358C75', time: '1:35.856', gap: '+3.115s'  },
      { position: 19, driver_number: 77, name: 'Valtteri Bottas',   team: 'Cadillac',       team_colour: '#CC0000', time: '1:36.057', gap: '+3.316s'  },
      { position: 20, driver_number: 18, name: 'Lance Stroll',      team: 'Aston Martin',   team_colour: '#358C75', time: '1:37.224', gap: '+4.483s'  },
      { position: 21, driver_number: 7,  name: 'Arvid Lindblad',    team: 'Racing Bulls',   team_colour: '#6692FF', time: '1:37.896', gap: '+5.155s'  },
      { position: 22, driver_number: 11, name: 'Sergio Pérez',      team: 'Cadillac',       team_colour: '#CC0000', time: '1:39.200', gap: '+6.459s'  },
    ],
  },
}

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
  const [activeTab, setActiveTab] = useState<'race-info' | 'results' | 'calendar' | 'weather' | 'pitwall'>('race-info')
  const [selectedRound, setSelectedRound] = useState(3)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [sessions, setSessions] = useState<any[]>([])
  const [results, setResults] = useState<any[]>([])
  const [standings, setStandings] = useState<{ drivers: any[]; constructors: any[] }>({ drivers: [], constructors: [] })
  const [weather, setWeather] = useState<any>(null)
  const [forecast, setForecast] = useState<any>(null)
  const [forecastLoading, setForecastLoading] = useState(false)
  const [activeSession, setActiveSession] = useState<string>('race')
  const [loading, setLoading] = useState(true)
  const [resultsLoading, setResultsLoading] = useState(false)
  const [useLocalTime, setUseLocalTime] = useState(false)
  const [practiceData, setPracticeData] = useState<any[]>([])
  const [practiceLoading, setPracticeLoading] = useState(false)

  const selectedRace = SEASON_CALENDAR.find(r => r.round === selectedRound) || SEASON_CALENDAR[1]

  useEffect(() => {
    // Always clear stale data from previous round immediately
    setSessions([])
    setResults([])
    setWeather(null)

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

  // Practice data fetching — fully automated via OpenF1 laps API
  useEffect(() => {
    const isFp = ['fp1', 'fp2', 'fp3'].includes(activeSession)
    if (!isFp) return
    setPracticeData([])

    async function fetchPractice() {
      setPracticeLoading(true)
      try {
        // 1. Try hardcoded session key first
        let sessionKey: number | null = FP_SESSION_KEYS[selectedRound]?.[activeSession] ?? null

        // 2. If not hardcoded, try to find from already-loaded sessions
        if (!sessionKey && sessions.length > 0) {
          const nameMap: Record<string, string> = { fp1: 'practice 1', fp2: 'practice 2', fp3: 'practice 3' }
          const match = sessions.find((s: any) => (s.session_name || '').toLowerCase().includes(nameMap[activeSession] || ''))
          if (match) sessionKey = match.session_key
        }

        // 3. If still not found, fetch from OpenF1 sessions endpoint
        if (!sessionKey) {
          const meetingKey = OPENF1_MEETING_KEYS[selectedRound]
          if (!meetingKey) { setPracticeLoading(false); return }
          const sessRes = await fetch(`/api/f1/sessions?meeting_key=${meetingKey}`)
          const sessData = await sessRes.json()
          if (Array.isArray(sessData)) {
            const nameMap: Record<string, string> = { fp1: 'practice 1', fp2: 'practice 2', fp3: 'practice 3' }
            const match = sessData.find((s: any) => (s.session_name || '').toLowerCase().includes(nameMap[activeSession] || ''))
            if (match) sessionKey = match.session_key
          }
        }

        if (!sessionKey) {
          // No session key found — use static fallback if available
          const fallback = FP_STATIC_FALLBACK[selectedRound]?.[activeSession]
          setPracticeData(fallback || [])
          return
        }

        // 4. Fetch practice results via the dedicated practice route
        const res = await fetch(`/api/f1/practice?session_key=${sessionKey}`)
        const data = await res.json()

        if (Array.isArray(data) && data.length >= 22) {
          setPracticeData(data)
        } else {
          // API returned fewer than 22 drivers — use static fallback for complete 22-driver list
          const fallback = FP_STATIC_FALLBACK[selectedRound]?.[activeSession]
          setPracticeData(fallback || data || [])
        }
      } catch {
        const fallback = FP_STATIC_FALLBACK[selectedRound]?.[activeSession]
        setPracticeData(fallback || [])
      } finally {
        setPracticeLoading(false)
      }
    }

    fetchPractice()
  }, [selectedRound, activeSession])


  const sessionTabs = getSessionTabs(sessions)

  const ResultsTable = ({ data, loading }: { data: any[]; loading: boolean }) => (
    loading ? <Loader label="results" /> : data.length === 0 ? (
      <div style={{ padding: '40px', textAlign: 'center' as const, color: '#5A6A7A', fontSize: '13px' }}>No results available for this session yet</div>
    ) : (
      <div style={{ overflowX: 'auto', minWidth: 0 }}>
        <div style={{ minWidth: '480px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '32px 4px 1fr 1fr 100px 100px', gap: '0 12px', padding: '8px 20px 6px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <span style={{ fontSize: '10px', color: '#5A6A7A', fontWeight: 600, textTransform: 'uppercase' as const }}>Pos</span>
          <span />
          <span style={{ fontSize: '10px', color: '#5A6A7A', fontWeight: 600, textTransform: 'uppercase' as const }}>Driver</span>
          <span style={{ fontSize: '10px', color: '#5A6A7A', fontWeight: 600, textTransform: 'uppercase' as const }}>Team</span>
          <span style={{ fontSize: '10px', color: '#5A6A7A', fontWeight: 600, textTransform: 'uppercase' as const, textAlign: 'right' as const }}>Time</span>
          <span style={{ fontSize: '10px', color: '#5A6A7A', fontWeight: 600, textTransform: 'uppercase' as const, textAlign: 'right' as const }}>Gap</span>
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
                {r.time || '—'}
              </span>
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', color: '#5A6A7A', textAlign: 'right' as const }}>
                {r.position === 1 ? '—' : (r.gap || '—')}
              </span>
            </div>
          )
        })}
        </div>
      </div>
    )
  )

  const QualifyingTable = ({ data, qualifier = 'Q' }: { data: any[], qualifier?: string }) => {
    if (data.length === 0) return (
      <div style={{ padding: '40px', textAlign: 'center' as const, color: '#5A6A7A', fontSize: '13px' }}>No qualifying data available for this session yet</div>
    )
    // Group by position ranges — always 10 / 6 / 6 in F1 qualifying and sprint qualifying
    const q3Group = data.filter(r => r.position <= 10)
    const q2Group = data.filter(r => r.position >= 11 && r.position <= 16)
    const q1Group = data.filter(r => r.position >= 17)
    const SectionDivider = ({ label }: { label: string }) => (
      <div style={{ padding: '6px 20px', background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.07)', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase' as const, color: '#3A4A5A' }}>{label}</span>
      </div>
    )
    const Row = ({ r }: { r: any }) => {
      const posColors: Record<number, string> = { 1: '#FFD700', 2: '#C0C0C0', 3: '#CD7F32' }
      const inQ1Only = r.position >= 17
      const inQ2Only = r.position >= 11 && r.position <= 16
      return (
        <div style={{ display: 'grid', gridTemplateColumns: '32px 4px 1fr 1fr 100px 100px 100px', gap: '0 10px', alignItems: 'center', padding: '8px 20px', borderBottom: '1px solid rgba(255,255,255,0.04)', opacity: inQ1Only ? 0.5 : inQ2Only ? 0.72 : 1 }}>
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', fontWeight: r.position <= 3 ? 600 : 400, color: posColors[r.position] || '#5A6A7A' }}>{r.position}</span>
          <div style={{ width: '4px', height: '28px', borderRadius: '2px', background: r.team_colour }} />
          <div style={{ fontSize: '13px', fontWeight: 500 }}>{r.name}</div>
          <div style={{ fontSize: '12px', color: '#5A6A7A' }}>{r.team}</div>
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: r.q1 ? '#8A9AB0' : '#3A4A5A', textAlign: 'right' as const }}>{r.q1 || '—'}</span>
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: r.q2 ? '#B8C4CF' : '#3A4A5A', textAlign: 'right' as const }}>{r.q2 || '—'}</span>
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', fontWeight: r.q3 && r.position <= 3 ? 600 : 400, color: r.q3 ? (r.position === 1 ? '#FFB800' : '#F0F4F8') : '#3A4A5A', textAlign: 'right' as const }}>{r.q3 || '—'}</span>
        </div>
      )
    }
    return (
      <div style={{ overflowX: 'auto', minWidth: 0 }}>
        <div style={{ minWidth: '560px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '32px 4px 1fr 1fr 100px 100px 100px', gap: '0 10px', padding: '8px 20px 6px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
            <span style={{ fontSize: '10px', color: '#5A6A7A', fontWeight: 600, textTransform: 'uppercase' as const }}>Pos</span>
            <span />
            <span style={{ fontSize: '10px', color: '#5A6A7A', fontWeight: 600, textTransform: 'uppercase' as const }}>Driver</span>
            <span style={{ fontSize: '10px', color: '#5A6A7A', fontWeight: 600, textTransform: 'uppercase' as const }}>Team</span>
            <span style={{ fontSize: '10px', color: '#5A6A7A', fontWeight: 600, textTransform: 'uppercase' as const, textAlign: 'right' as const }}>{qualifier}1</span>
            <span style={{ fontSize: '10px', color: '#5A6A7A', fontWeight: 600, textTransform: 'uppercase' as const, textAlign: 'right' as const }}>{qualifier}2</span>
            <span style={{ fontSize: '10px', color: '#5A6A7A', fontWeight: 600, textTransform: 'uppercase' as const, textAlign: 'right' as const }}>{qualifier}3</span>
          </div>
          {q3Group.length > 0 && <>{q3Group.map(r => <Row key={r.driver_number} r={r} />)}</>}
          {q2Group.length > 0 && <><SectionDivider label={`— ${qualifier}2 Eliminated (P${q3Group.length + 1}–${q3Group.length + q2Group.length}) —`} />{q2Group.map(r => <Row key={r.driver_number} r={r} />)}</>}
          {q1Group.length > 0 && <><SectionDivider label={`— ${qualifier}1 Eliminated (P${q3Group.length + q2Group.length + 1}–${data.length}) —`} />{q1Group.map(r => <Row key={r.driver_number} r={r} />)}</>}
        </div>
      </div>
    )
  }

  const tabs = [
    { id: 'race-info', label: 'Race Info' },
    { id: 'results', label: 'Results' },
    { id: 'calendar', label: 'Racing Calendar' },
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
            <span style={{ fontFamily: 'Twemoji Country Flags, DM Sans, sans-serif', fontSize: 'clamp(2rem,4vw,2.8rem)' }}>{selectedRace.flag}</span>
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

      {/* RESULTS TAB */}
      {activeTab === 'results' && (() => {
        const roundStatic = STATIC_RACE_RESULTS[selectedRound]
        const isFpSession = ['fp1', 'fp2', 'fp3'].includes(activeSession)
        const isQualiSession = activeSession === 'qualifying'
        const isSprintQualiSession = activeSession === 'sprint-qualifying'
        const staticQualiData = isQualiSession ? roundStatic?.qualifying : isSprintQualiSession ? roundStatic?.['sprint-qualifying'] : undefined
        const displayResults: any[] = isFpSession ? practiceData : results

        return (
          <div style={card}>
            <div style={cardHeader}>
              <span style={cardTitle}>{selectedRace.flag} {selectedRace.name} GP — Session Results</span>
              <Badge type={selectedRace.completed ? 'done' : 'live'} label={selectedRace.completed ? '2026 Results' : 'Live'} />
            </div>

            {!selectedRace.completed ? (
              <div style={{ padding: '48px', textAlign: 'center' as const }}>
                <div style={{ fontSize: '28px', marginBottom: '12px' }}>🏁</div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#F0F4F8', marginBottom: '8px' }}>Results not yet available</div>
                <div style={{ fontSize: '13px', color: '#5A6A7A' }}>{selectedRace.name} GP takes place on {selectedRace.date}.</div>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', gap: '6px', padding: '12px 20px', borderBottom: '1px solid rgba(255,255,255,0.07)', flexWrap: 'wrap' as const }}>
                  {loading ? (
                    <span style={{ fontSize: '12px', color: '#5A6A7A' }}>Loading sessions...</span>
                  ) : sessionTabs.length > 0 ? sessionTabs.map(t => (
                    <button key={t.id} onClick={() => setActiveSession(t.id)} style={{
                      background: activeSession === t.id ? '#E8002D' : '#141B22',
                      color: activeSession === t.id ? 'white' : '#5A6A7A',
                      border: '1px solid', borderColor: activeSession === t.id ? '#E8002D' : 'rgba(255,255,255,0.07)',
                      padding: '5px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 600,
                    }}>{t.label}</button>
                  )) : (
                    <span style={{ fontSize: '12px', color: '#5A6A7A' }}>No session data available</span>
                  )}
                </div>
                {staticQualiData
                  ? <QualifyingTable data={staticQualiData} qualifier={isSprintQualiSession ? 'SQ' : 'Q'} />
                  : <ResultsTable data={displayResults} loading={isFpSession ? practiceLoading : resultsLoading} />
                }
              </>
            )}
          </div>
        )
      })()}

      {/* CALENDAR TAB */}
      {activeTab === 'calendar' && (() => {
        const nextRaceRound = SEASON_CALENDAR.find(r => !r.completed && !(r as any).calledOff)?.round
        return (
          <div style={card}>
            <div style={cardHeader}>
              <span style={cardTitle}>2026 Racing Calendar</span>
              <Badge type="blue" label="22 Rounds" />
            </div>
            <div className="mob-2col" style={{ padding: '16px 20px', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '10px' }}>
              {SEASON_CALENDAR.map((race) => {
                const isCalledOff = (race as any).calledOff
                const isNextRace = race.round === nextRaceRound
                const isNew = race.name === 'Madrid'
                const bgColor = isCalledOff ? 'rgba(255,255,255,0.02)' : race.completed ? '#0E1318' : '#141B22'
                const nameColor = isCalledOff ? '#3A4A5A' : race.completed ? '#3A4A5A' : '#F0F4F8'
                return (
                  <div
                    key={race.round}
                    onClick={() => {
                      if (isCalledOff) return
                      setSelectedRound(race.round)
                      setActiveTab('race-info')
                    }}
                    style={{
                      position: 'relative' as const,
                      background: bgColor,
                      border: isCalledOff ? '1px solid rgba(255,255,255,0.04)'
                        : isNextRace ? '1px solid rgba(232,0,45,0.3)'
                        : race.completed ? '1px solid rgba(255,255,255,0.04)'
                        : '1px solid rgba(255,255,255,0.08)',
                      borderLeft: isNextRace ? '3px solid #E8002D' : undefined,
                      borderRadius: '10px', padding: '14px',
                      cursor: isCalledOff ? 'default' : 'pointer',
                      opacity: isCalledOff ? 0.4 : 1,
                      transition: 'border-color 0.2s',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#3A4A5A' }}>R{race.round}</span>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        {isNew && <span style={{ fontSize: '8px', fontWeight: 700, padding: '1px 5px', borderRadius: '3px', background: 'rgba(0,168,255,0.15)', color: '#00A8FF' }}>NEW</span>}
                        {isNextRace && <span style={{ fontSize: '8px', fontWeight: 700, padding: '1px 5px', borderRadius: '3px', background: 'rgba(232,0,45,0.15)', color: '#E8002D' }}>NEXT RACE</span>}
                        {race.sprint && !isCalledOff && !isNextRace && <span style={{ fontSize: '8px', fontWeight: 700, padding: '1px 5px', borderRadius: '3px', background: 'rgba(232,0,45,0.15)', color: '#E8002D' }}>SPRINT</span>}
                        {isCalledOff && <span style={{ fontSize: '8px', fontWeight: 700, padding: '1px 5px', borderRadius: '3px', background: 'rgba(255,255,255,0.08)', color: '#5A6A7A' }}>CANCELLED</span>}
                        {race.completed && !isCalledOff && <span style={{ fontSize: '8px', fontWeight: 700, padding: '1px 5px', borderRadius: '3px', background: 'rgba(0,212,126,0.12)', color: '#00D47E' }}>COMPLETED</span>}
                      </div>
                    </div>
                    <div style={{ fontSize: '20px', marginBottom: '6px' }}>{race.flag}</div>
                    <div style={{ fontSize: '12px', fontWeight: 600, color: nameColor, marginBottom: '2px' }}>{race.name}</div>
                    <div style={{ fontSize: '11px', color: '#3A4A5A', marginBottom: '2px' }}>{race.circuit}</div>
                    <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#3A4A5A' }}>{(race as any).dateRange || race.date}</div>
                    {!isCalledOff && <div style={{ marginTop: '8px', fontSize: '10px', color: race.completed ? '#5A6A7A' : '#E8002D', fontWeight: 600 }}>
                      {race.completed ? 'View results →' : 'View schedule →'}
                    </div>}
                  </div>
                )
              })}
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
                    <span style={cardTitle}>Tyre Compounds — {selectedRace.flag} {raceName} GP</span>
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
