'use client'
import { cardStyle, cardHeaderStyle, monoFont } from '@/components/home/shared'
import { rhCardTitleStyle } from './shared'

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
  if (code <= 86) return '❄️'
  if (code <= 99) return '⛈️'
  return '🌡️'
}

const tileGridStyle = {
  display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '10px',
} as const

function ConditionTile({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div style={{ background: 'var(--surface2)', borderRadius: '8px', padding: '14px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', minHeight: '118px' }}>
      <div style={{ fontSize: '20px' }}>{icon}</div>
      <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '17px', fontWeight: 700, marginTop: '6px' }}>{value}</div>
      <div style={{ fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.9px', marginTop: '4px' }}>{label}</div>
    </div>
  )
}

function ForecastDayTile({ day, isRaceWeekend }: { day: ForecastDay; isRaceWeekend: boolean }) {
  const d = new Date(day.date + 'T12:00:00Z')
  const weekday = d.toLocaleDateString('en-GB', { weekday: 'short', timeZone: 'UTC' }).toUpperCase()
  const dayNum = d.toLocaleDateString('en-GB', { day: 'numeric', timeZone: 'UTC' })
  const rainHigh = day.rainChance >= 60
  const rainMed = day.rainChance >= 30
  return (
    <div style={{
      background: isRaceWeekend ? 'rgba(232,0,45,0.06)' : 'var(--surface2)',
      border: isRaceWeekend ? '1px solid rgba(232,0,45,0.35)' : '1px solid transparent',
      borderRadius: '12px', padding: '14px 10px', textAlign: 'center',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
    }}>
      <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.9px', color: 'var(--muted)' }}>{weekday} {dayNum}</span>
      <span style={{ fontSize: '26px', margin: '6px 0' }}>{wmoIcon(day.code)}</span>
      <span>
        <span style={{ fontFamily: monoFont, fontSize: '15px', fontWeight: 700, color: 'var(--text)' }}>{Math.round(day.maxTemp)}°</span>
        <span style={{ fontFamily: monoFont, fontSize: '11px', color: 'var(--muted)', marginLeft: '5px' }}>{Math.round(day.minTemp)}°</span>
      </span>
      <span style={{ fontFamily: monoFont, fontSize: '11px', fontWeight: 600, marginTop: '4px', color: rainHigh ? '#E8002D' : rainMed ? '#FFB800' : 'var(--muted)' }}>💧{day.rainChance}%</span>
      <span style={{ fontFamily: monoFont, fontSize: '10px', color: 'var(--muted)', marginTop: '2px' }}>💨 {Math.round(day.windMax)} km/h</span>
    </div>
  )
}

export interface LiveWeather {
  air_temperature?: number
  track_temperature?: number
  wind_speed?: number
  wind_direction?: number
  humidity?: number
  pressure?: number
  rainfall?: boolean
}

export interface CurrentConditions {
  temperature_2m?: number
  wind_speed_10m?: number
  wind_direction_10m?: number
  relative_humidity_2m?: number
  surface_pressure?: number
  precipitation?: number
  weather_code?: number
}

export interface ForecastDay {
  date: string
  maxTemp: number
  minTemp: number
  rainChance: number
  windMax: number
  code: number
}

export default function WeatherTab({
  loading, weather, currentConditions, forecastLoading, hasLocation, forecastDays,
}: {
  loading: boolean
  weather: LiveWeather | null
  currentConditions: CurrentConditions | null
  forecastLoading: boolean
  hasLocation: boolean
  forecastDays: ForecastDay[]
}) {
  return (
    <div style={{ display: 'grid', gap: '20px' }}>
      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 1000px) { .rh-wxtiles { grid-template-columns: repeat(4, 1fr) !important; } }
        @media (max-width: 560px) { .rh-wxtiles { grid-template-columns: repeat(2, 1fr) !important; } }
      ` }} />

      {/* Live Track Conditions — full width */}
      <div style={cardStyle}>
        <div style={cardHeaderStyle}><span style={rhCardTitleStyle}>Live Track Conditions</span></div>
        <div style={{ padding: '20px' }}>
          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--muted2)', fontFamily: monoFont, fontSize: '12px' }}>Loading conditions...</div>
          ) : weather ? (
            <div className="rh-wxtiles" style={tileGridStyle}>
              <ConditionTile icon="🌡️" label="Air Temp" value={`${weather.air_temperature?.toFixed(1) ?? '—'}°C`} />
              <ConditionTile icon="🏎️" label="Track Temp" value={`${weather.track_temperature?.toFixed(1) ?? '—'}°C`} />
              <ConditionTile icon="💨" label="Wind Speed" value={`${weather.wind_speed?.toFixed(1) ?? '—'} m/s`} />
              <ConditionTile icon="🧭" label="Wind Dir" value={`${weather.wind_direction ?? '—'}°`} />
              <ConditionTile icon="💧" label="Humidity" value={`${weather.humidity?.toFixed(0) ?? '—'}%`} />
              <ConditionTile icon="📊" label="Pressure" value={`${weather.pressure?.toFixed(1) ?? '—'} hPa`} />
              <ConditionTile icon="🌦️" label="Rainfall" value={weather.rainfall ? 'Yes' : 'No'} />
            </div>
          ) : currentConditions ? (
            <div className="rh-wxtiles" style={tileGridStyle}>
              <ConditionTile icon="🌡️" label="Air Temp" value={`${currentConditions.temperature_2m?.toFixed(1) ?? '—'}°C`} />
              <ConditionTile icon="🏎️" label="Track Temp" value="N/A" />
              <ConditionTile icon="💨" label="Wind Speed" value={`${(currentConditions.wind_speed_10m ?? 0).toFixed(1)} km/h`} />
              <ConditionTile icon="🧭" label="Wind Dir" value={`${currentConditions.wind_direction_10m ?? '—'}°`} />
              <ConditionTile icon="💧" label="Humidity" value={`${currentConditions.relative_humidity_2m?.toFixed(0) ?? '—'}%`} />
              <ConditionTile icon="📊" label="Pressure" value={`${currentConditions.surface_pressure?.toFixed(1) ?? '—'} hPa`} />
              <ConditionTile icon="🌦️" label="Rainfall" value={(currentConditions.precipitation ?? 0) > 0 ? `${currentConditions.precipitation?.toFixed(1)} mm` : 'None'} />
            </div>
          ) : (
            <div style={{ color: 'var(--muted)', fontSize: '13px' }}>No conditions data available</div>
          )}
        </div>
      </div>

      {/* Weekend Forecast — full width */}
      <div style={cardStyle}>
        <div style={cardHeaderStyle}><span style={rhCardTitleStyle}>Weekend Forecast</span></div>
        <div style={{ padding: '20px' }}>
          {forecastLoading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--muted2)', fontFamily: monoFont, fontSize: '12px' }}>Loading forecast...</div>
          ) : !hasLocation ? (
            <div style={{ color: 'var(--muted)', fontSize: '13px' }}>No location data available for this circuit</div>
          ) : forecastDays.length === 0 ? (
            <div style={{ color: 'var(--muted)', fontSize: '13px' }}>Could not load forecast data</div>
          ) : (
            <>
              <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '8px' }}>Pre-Weekend</div>
              <div style={{ overflowX: 'auto', margin: '0 -4px 16px', padding: '0 4px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', minWidth: '440px' }}>
                  {forecastDays.slice(0, 4).map(day => <ForecastDayTile key={day.date} day={day} isRaceWeekend={false} />)}
                </div>
              </div>

              <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#E8002D', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '6px', height: '6px', background: '#E8002D', borderRadius: '50%' }} />
                Race Weekend
              </div>
              <div style={{ overflowX: 'auto', margin: '0 -4px', padding: '0 4px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', minWidth: '330px' }}>
                  {forecastDays.slice(4, 7).map(day => <ForecastDayTile key={day.date} day={day} isRaceWeekend={true} />)}
                </div>
              </div>

              <div style={{ marginTop: '16px', fontSize: '10px', color: 'var(--muted2)', lineHeight: 1.6 }}>
                Forecast data provided by Open-Meteo (open-meteo.com) · Updates hourly
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
