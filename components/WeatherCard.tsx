'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { SEASON_CALENDAR, CURRENT_RACE } from '@/lib/races'

// Identical icon/label logic to the Race Hub weather tab
function wmoIcon(code: number): string {
  if (code === 0) return '☀️'
  if (code <= 2) return '🌤️'
  if (code === 3) return '☁️'
  if (code <= 48) return '🌫️'
  if (code <= 57) return '🌦️'
  if (code <= 67) return '🌧️'
  if (code <= 77) return '❄️'
  if (code <= 82) return '🌦️'
  if (code <= 84) return '🌨️'
  if (code <= 99) return '⛈️'
  return '🌡️'
}

interface DayForecast {
  date: string
  maxTemp: number
  minTemp: number
  rainChance: number
  windMax: number
  code: number
}

export default function WeatherCard() {
  const [days, setDays] = useState<DayForecast[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const calRace = SEASON_CALENDAR.find(r => r.round === CURRENT_RACE.round)
    if (!calRace?.lat || !calRace?.lon || !calRace?.weekendStartISO) {
      setLoading(false)
      return
    }

    // Fetch just the 3 race weekend days (Fri/Sat/Sun)
    const fri = new Date(calRace.weekendStartISO + 'T00:00:00Z')
    const sun = new Date(fri)
    sun.setUTCDate(fri.getUTCDate() + 2)
    const startDate = fri.toISOString().slice(0, 10)
    const endDate = sun.toISOString().slice(0, 10)

    fetch(`/api/forecast?lat=${calRace.lat}&lon=${calRace.lon}&start_date=${startDate}&end_date=${endDate}`)
      .then(r => r.json())
      .then(data => {
        const daily = data?.daily
        if (!daily) return
        const parsed: DayForecast[] = daily.time.map((date: string, i: number) => ({
          date,
          maxTemp: daily.temperature_2m_max[i],
          minTemp: daily.temperature_2m_min[i],
          rainChance: daily.precipitation_probability_max[i],
          windMax: daily.wind_speed_10m_max[i],
          code: daily.weather_code[i],
        }))
        setDays(parsed)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const dayLabels = ['Fri', 'Sat', 'Sun']

  return (
    <div style={{ background: '#0E1318', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', overflow: 'hidden', position: 'relative', display: 'flex', flexDirection: 'column' }}>
      {/* Blue accent band — matches #00BFFF tile theme */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg,#00BFFF,rgba(0,191,255,0.2))' }} />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px 12px', minHeight: '52px', boxSizing: 'border-box' as const, borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <span style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '1.5px', color: '#5A6A7A' }}>🌤️ Weather</span>
        <span className={`fi fi-${CURRENT_RACE.flag}`} style={{ width: '1.2em', borderRadius: '2px', display: 'inline-block' }}></span>
      </div>

      <div style={{ padding: '10px 16px 0', flex: 1 }}>
        {loading ? (
          <div style={{ padding: '18px 0', textAlign: 'center' as const, fontSize: '11px', color: '#3A4A5A', fontFamily: 'JetBrains Mono, monospace' }}>Loading…</div>
        ) : days.length === 0 ? (
          <div style={{ padding: '18px 0', textAlign: 'center' as const, fontSize: '11px', color: '#3A4A5A' }}>No forecast available</div>
        ) : (
          days.map((w, i) => {
            const rainHigh = w.rainChance >= 60
            const rainMed  = w.rainChance >= 30
            const rainColor = rainHigh ? '#E8002D' : rainMed ? '#FFB800' : '#5A6A7A'
            return (
              <div key={w.date} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '7px 0', borderBottom: i < days.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                <span style={{ fontSize: '18px', flexShrink: 0 }}>{wmoIcon(w.code)}</span>
                <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '15px', color: '#5A6A7A', width: '28px', flexShrink: 0 }}>{dayLabels[i]}</span>
                <div style={{ flex: 1 }}>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', fontWeight: 600 }}>{Math.round(w.maxTemp)}°</span>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: '#5A6A7A', marginLeft: '4px' }}>{Math.round(w.minTemp)}°</span>
                </div>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: rainColor, flexShrink: 0 }}>💧{w.rainChance}%</span>
              </div>
            )
          })
        )}
      </div>

      {/* Footer link — identical style to Race Hub → and More F1 Fantasy → */}
      <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(255,255,255,0.05)', marginTop: '10px' }}>
        <Link href="/race-hub?tab=weather" style={{ fontSize: '12px', color: '#00BFFF', textDecoration: 'none', fontWeight: 600 }}>
          Full Forecast →
        </Link>
      </div>
    </div>
  )
}
