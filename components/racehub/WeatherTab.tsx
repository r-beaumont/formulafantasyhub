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
function wmoLabel(code: number): string {
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

const tileGridStyle = {
  display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '10px',
} as const

function ConditionTile({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div style={{ background: 'var(--surface2)', borderRadius: '8px', padding: '14px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', minHeight: '118px' }}>
      <div style={{ fontSize: '20px' }}>{icon}</div>
      <div style={{ fontFamily: monoFont, fontSize: '17px', fontWeight: 600, marginTop: '6px' }}>{value}</div>
      <div style={{ fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.8px', marginTop: '4px' }}>{label}</div>
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
    <div className="mob-1col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 1000px) { .rh-wxtiles { grid-template-columns: repeat(4, 1fr) !important; } }
        @media (max-width: 560px) { .rh-wxtiles { grid-template-columns: repeat(2, 1fr) !important; } }
      ` }} />

      {/* Live Track Conditions */}
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
            <>
              <div style={{ fontSize: '10px', color: 'var(--muted)', marginBottom: '12px', letterSpacing: '0.5px' }}>
                Ambient conditions — live session data available during race weekends
              </div>
              <div className="rh-wxtiles" style={tileGridStyle}>
                <ConditionTile icon="🌡️" label="Air Temp" value={`${currentConditions.temperature_2m?.toFixed(1) ?? '—'}°C`} />
                <ConditionTile icon="🏎️" label="Track Temp" value="N/A" />
                <ConditionTile icon="💨" label="Wind Speed" value={`${(currentConditions.wind_speed_10m ?? 0).toFixed(1)} km/h`} />
                <ConditionTile icon="🧭" label="Wind Dir" value={`${currentConditions.wind_direction_10m ?? '—'}°`} />
                <ConditionTile icon="💧" label="Humidity" value={`${currentConditions.relative_humidity_2m?.toFixed(0) ?? '—'}%`} />
                <ConditionTile icon="📊" label="Pressure" value={`${currentConditions.surface_pressure?.toFixed(1) ?? '—'} hPa`} />
                <ConditionTile icon="🌦️" label="Rainfall" value={(currentConditions.precipitation ?? 0) > 0 ? `${currentConditions.precipitation?.toFixed(1)} mm` : 'None'} />
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
              {[
                { label: 'Pre-Weekend', days: forecastDays.slice(0, 4), accent: 'var(--muted)', isRaceWeekend: false },
                { label: 'Race Weekend', days: forecastDays.slice(4, 7), accent: '#E8002D', isRaceWeekend: true },
              ].map(section => (
                <div key={section.label} style={{ marginBottom: '16px' }}>
                  <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: section.accent, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {section.isRaceWeekend && <div style={{ width: '6px', height: '6px', background: '#E8002D', borderRadius: '50%' }} />}
                    {section.label}
                  </div>
                  <div style={{ overflowX: 'auto', margin: '0 -4px', padding: '0 4px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', minWidth: '440px' }}>
                      {section.days.map(day => {
                        const d = new Date(day.date + 'T12:00:00Z')
                        const dayLabel = d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'UTC' })
                        const rainHigh = day.rainChance >= 60
                        const rainMed = day.rainChance >= 30
                        return (
                          <div key={day.date} style={{ display: 'grid', gridTemplateColumns: '90px 28px 1fr auto auto auto', alignItems: 'center', gap: '8px', padding: '9px 12px', background: section.isRaceWeekend ? 'rgba(232,0,45,0.04)' : 'var(--surface2)', borderRadius: '8px', border: section.isRaceWeekend ? '1px solid rgba(232,0,45,0.12)' : '1px solid rgba(255,255,255,0.04)' }}>
                            <span style={{ fontFamily: monoFont, fontSize: '11px', color: section.isRaceWeekend ? 'var(--text)' : '#8A9AB0' }}>{dayLabel}</span>
                            <span style={{ fontSize: '18px', textAlign: 'center' }}>{wmoIcon(day.code)}</span>
                            <span style={{ fontSize: '11px', color: 'var(--muted)' }}>{wmoLabel(day.code)}</span>
                            <div style={{ textAlign: 'right' }}>
                              <span style={{ fontFamily: monoFont, fontSize: '13px', fontWeight: 600, color: 'var(--text)' }}>{Math.round(day.maxTemp)}°</span>
                              <span style={{ fontFamily: monoFont, fontSize: '11px', color: 'var(--muted)', marginLeft: '4px' }}>{Math.round(day.minTemp)}°</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                              <span style={{ fontSize: '10px' }}>💧</span>
                              <span style={{ fontFamily: monoFont, fontSize: '11px', fontWeight: 600, color: rainHigh ? '#E8002D' : rainMed ? '#FFB800' : 'var(--muted)' }}>{day.rainChance}%</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                              <span style={{ fontSize: '10px' }}>💨</span>
                              <span style={{ fontFamily: monoFont, fontSize: '10px', color: 'var(--muted)' }}>{Math.round(day.windMax)}<span style={{ fontSize: '9px' }}>km/h</span></span>
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
}
