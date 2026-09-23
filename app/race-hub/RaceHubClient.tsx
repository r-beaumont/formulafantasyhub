'use client'

import { useEffect, useState } from 'react'
import { SEASON_CALENDAR, computeCurrentRace } from '@/lib/races'
import { useCurrentRace } from '@/lib/useCurrentRace'
import { Flag } from '@/components/home/shared'
import RoundSelector from '@/components/racehub/RoundSelector'
import { PillToggle } from '@/components/racehub/shared'
import OverviewTab from '@/components/racehub/OverviewTab'
import RaceInfoTab, { type RaceInfoSession } from '@/components/racehub/RaceInfoTab'
import WeatherTab, { type ForecastDay, type LiveWeather, type CurrentConditions } from '@/components/racehub/WeatherTab'
import PitwallTab from '@/components/racehub/PitwallTab'

const tabOptions = [
  { id: 'overview', label: 'Overview' },
  { id: 'race-info', label: 'Race Info' },
  { id: 'weather', label: 'Weather' },
  { id: 'pitwall', label: 'Pitwall' },
]

const SHORT: Record<string, string> = {
  'Practice 1': 'FP1', 'Practice 2': 'FP2', 'Practice 3': 'FP3',
  'Sprint Qualifying': 'SQ', 'Sprint': 'SPR',
  'Qualifying': 'QUAL', 'Race': 'RACE',
}

export default function RaceHubClient() {
  const currentRace = useCurrentRace()
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedRound, setSelectedRound] = useState(() => computeCurrentRace(new Date()).round)

  // Read ?round=N and ?tab=N on mount — the Home page season tiles link to
  // /race-hub?round=N, and the Calendar page links to /race-hub?round=N&tab=race-info
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const roundParam = params.get('round')
    if (roundParam) {
      const n = parseInt(roundParam, 10)
      if (!isNaN(n)) setSelectedRound(n)
    }
    const tabParam = params.get('tab')
    if (tabParam && tabOptions.some(t => t.id === tabParam)) {
      setActiveTab(tabParam)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const [openF1Sessions, setOpenF1Sessions] = useState<any[]>([])
  const [weather, setWeather] = useState<LiveWeather | null>(null)
  const [currentConditions, setCurrentConditions] = useState<CurrentConditions | null>(null)
  const [forecast, setForecast] = useState<any>(null)
  const [forecastLoading, setForecastLoading] = useState(false)
  const [loading, setLoading] = useState(true)

  const selectedRace = SEASON_CALENDAR.find(r => r.round === selectedRound) || SEASON_CALENDAR[1]
  const isCurrentRound = selectedRound === currentRace.round

  // Live session/weather lookup from OpenF1
  useEffect(() => {
    setOpenF1Sessions([])
    setWeather(null)
    setCurrentConditions(null)

    async function load() {
      setLoading(true)
      try {
        if (selectedRace.meeting_key) {
          const weekendStarted = selectedRace.weekendStartISO
            ? new Date(selectedRace.weekendStartISO + 'T00:00:00Z').getTime() <= Date.now()
            : false
          const meetingParam = (isCurrentRound && weekendStarted) ? 'latest' : selectedRace.meeting_key
          const sessRes = await fetch(`/api/f1/sessions?meeting_key=${meetingParam}`)
          const sessData = await sessRes.json()
          const list = Array.isArray(sessData) ? sessData : []
          setOpenF1Sessions(list)

          if (list.length) {
            const now = Date.now()
            const started = list.filter((s: any) => s.date_start && new Date(s.date_start).getTime() <= now)
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRound])

  // Refresh live weather every 20 minutes
  useEffect(() => {
    if (!openF1Sessions.length) return
    const poll = async () => {
      try {
        const now = Date.now()
        const started = openF1Sessions.filter((s: any) => s.date_start && new Date(s.date_start).getTime() <= now)
        if (started.length === 0) return
        const weatherSess = started[started.length - 1]
        const res = await fetch(`/api/f1/weather?session_key=${weatherSess.session_key}`)
        const data = await res.json()
        if (data && !data.error) setWeather(data)
      } catch {}
    }
    const id = setInterval(poll, 20 * 60 * 1000)
    return () => clearInterval(id)
  }, [openF1Sessions])

  // Ambient conditions from Open-Meteo, refresh every 60 minutes
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

  // 7-day weekend forecast
  useEffect(() => {
    if (!selectedRace.lat || !selectedRace.lon || !selectedRace.weekendStartISO) return
    setForecastLoading(true)
    setForecast(null)
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

  const forecastDays: ForecastDay[] = forecast?.daily
    ? forecast.daily.time.map((date: string, i: number) => ({
        date,
        maxTemp: forecast.daily.temperature_2m_max[i],
        minTemp: forecast.daily.temperature_2m_min[i],
        rainChance: forecast.daily.precipitation_probability_max[i],
        windMax: forecast.daily.wind_speed_10m_max[i],
        code: forecast.daily.weather_code[i],
      }))
    : []

  const now = Date.now()
  const raceInfoSessions: RaceInfoSession[] = (selectedRace.sessions ?? []).map(s => ({
    name: s.name,
    short: SHORT[s.name] ?? s.name,
    isoDate: s.date,
    isCompleted: new Date(s.date).getTime() + (s.duration ?? 120) * 60_000 < now,
  }))

  return (
    <div className="mob-pad-page" style={{ position: 'relative', zIndex: 1, maxWidth: '1400px', margin: '0 auto', padding: '28px 32px 60px' }}>

      {/* Header */}
      <div style={{ marginBottom: '4px' }}>
        <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(2.5rem,5vw,3.5rem)', letterSpacing: '1px', lineHeight: 1, margin: '0 0 6px', display: 'flex', alignItems: 'center', gap: '14px', fontWeight: 400 }}>
          <Flag code={selectedRace.flag} size="clamp(2rem,4vw,2.8rem)" />
          <span>{selectedRace.name} Grand Prix</span>
        </h1>
        <div style={{ color: 'var(--muted)', fontSize: '13px' }}>
          {selectedRace.circuit} · Round {selectedRace.round} of 23 · {selectedRace.sprint ? <span style={{ color: '#00A8FF', fontWeight: 700 }}>Sprint Weekend</span> : 'Standard Weekend'}
          {(selectedRace as any).calledOff && <span style={{ color: '#E8002D', fontWeight: 700 }}> · Cancelled</span>}
        </div>
      </div>

      {/* Round selector */}
      <RoundSelector
        rounds={SEASON_CALENDAR.map(r => ({ round: r.round, name: r.name, flag: r.flag, completed: r.completed, calledOff: (r as any).calledOff }))}
        selectedRound={selectedRound}
        currentRound={currentRace.round}
        onSelect={setSelectedRound}
      />

      {/* Tab switcher */}
      <div style={{ marginBottom: '20px' }}>
        <PillToggle options={tabOptions} value={activeTab} onChange={setActiveTab} />
      </div>

      {activeTab === 'overview' && <OverviewTab round={selectedRound} />}

      {activeTab === 'race-info' && (
        <RaceInfoTab timezone={selectedRace.timezone} sessions={raceInfoSessions} isCurrentRound={isCurrentRound} />
      )}

      {activeTab === 'weather' && (
        <WeatherTab
          loading={loading}
          weather={weather}
          currentConditions={currentConditions}
          forecastLoading={forecastLoading}
          hasLocation={!!selectedRace.lat}
          forecastDays={forecastDays}
        />
      )}

      {activeTab === 'pitwall' && (
        <PitwallTab round={selectedRound} raceName={selectedRace.name} flag={selectedRace.flag} completed={selectedRace.completed} />
      )}
    </div>
  )
}
