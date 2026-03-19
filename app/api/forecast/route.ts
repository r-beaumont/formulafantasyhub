import { NextRequest, NextResponse } from 'next/server'

export const revalidate = 3600 // cache 1 hour

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const lat = searchParams.get('lat')
  const lon = searchParams.get('lon')
  const startDate = searchParams.get('start_date')
  const endDate = searchParams.get('end_date')

  if (!lat || !lon) {
    return NextResponse.json({ error: 'lat and lon required' }, { status: 400 })
  }

  try {
    const dateParams = startDate && endDate
      ? `&start_date=${startDate}&end_date=${endDate}`
      : `&forecast_days=7`

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,weather_code,wind_speed_10m_max&timezone=auto${dateParams}`
    const res = await fetch(url, { next: { revalidate: 3600 } })
    const data = await res.json()
    return NextResponse.json(data)
  } catch (e) {
    return NextResponse.json({ error: 'Failed to fetch forecast' }, { status: 500 })
  }
}
