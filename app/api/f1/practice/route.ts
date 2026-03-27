import { NextResponse } from 'next/server'
const BASE = 'https://api.openf1.org/v1'

function toProperCase(name: string): string {
  return name.toLowerCase().replace(/\b\w/g, c => c.toUpperCase())
}

function formatLapTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  const secsStr = secs.toFixed(3).padStart(6, '0')
  return mins > 0 ? `${mins}:${secsStr}` : `${secsStr}s`
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionKey = searchParams.get('session_key')
    if (!sessionKey) return NextResponse.json([], { status: 400 })

    const [lapsRes, driversRes] = await Promise.all([
      fetch(`${BASE}/laps?session_key=${sessionKey}`, { cache: 'no-store' }),
      fetch(`${BASE}/drivers?session_key=${sessionKey}`, { cache: 'no-store' }),
    ])

    const laps = await lapsRes.json()
    const drivers = await driversRes.json()

    // Build driver info map
    const driverMap: Record<number, any> = {}
    if (Array.isArray(drivers)) {
      for (const d of drivers) driverMap[d.driver_number] = d
    }

    if (!Array.isArray(laps) || laps.length === 0) {
      return NextResponse.json([])
    }

    // Find best lap per driver_number (minimum lap_duration)
    const bestLaps: Record<number, number> = {}
    for (const lap of laps) {
      if (lap.lap_duration == null || lap.lap_duration <= 0) continue
      const dn = lap.driver_number
      if (!bestLaps[dn] || lap.lap_duration < bestLaps[dn]) {
        bestLaps[dn] = lap.lap_duration
      }
    }

    if (Object.keys(bestLaps).length === 0) return NextResponse.json([])

    const leaderTime = Math.min(...Object.values(bestLaps))

    // Sort by best lap and format
    const sorted = Object.entries(bestLaps)
      .sort(([, a], [, b]) => a - b)
      .map(([driverNum, time], i) => {
        const dn = parseInt(driverNum)
        const driver = driverMap[dn] || {}
        return {
          position: i + 1,
          driver_number: dn,
          name: toProperCase(driver.full_name || driver.broadcast_name || `#${dn}`),
          team: driver.team_name || '—',
          team_colour: driver.team_colour ? `#${driver.team_colour}` : '#5A6A7A',
          time: formatLapTime(time),
          gap: i === 0 ? '—' : `+${(time - leaderTime).toFixed(3)}s`,
        }
      })

    return NextResponse.json(sorted)
  } catch {
    return NextResponse.json([])
  }
}
