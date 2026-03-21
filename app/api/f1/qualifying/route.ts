import { NextRequest, NextResponse } from 'next/server'

export const revalidate = 300

const TEAM_COLOURS: Record<string, string> = {
  'Mercedes':          '#27F4D2',
  'Ferrari':           '#E8002D',
  'McLaren':           '#FF8000',
  'Red Bull Racing':   '#3671C6',
  'Alpine':            '#FF69B4',
  'Haas':              '#B6BABD',
  'Audi':              '#C0C0C0',
  'Racing Bulls':      '#6692FF',
  'Williams':          '#64C4FF',
  'Aston Martin':      '#358C75',
  'Cadillac':          '#CC0000',
}

function secondsToLapTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  const sStr = s.toFixed(3).padStart(6, '0')
  return `${m}:${sStr}`
}

function teamColour(teamName: string): string {
  for (const [key, colour] of Object.entries(TEAM_COLOURS)) {
    if (teamName.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(teamName.toLowerCase())) {
      return colour
    }
  }
  return '#5A6A7A'
}

async function fetchSession(sessionKey: string): Promise<Record<number, number>> {
  const res = await fetch(
    `https://api.openf1.org/v1/laps?session_key=${sessionKey}`,
    { next: { revalidate: 300 } }
  )
  if (!res.ok) return {}
  const laps: any[] = await res.json()
  const bestLaps: Record<number, number> = {}
  for (const lap of laps) {
    if (!lap.lap_duration || lap.is_pit_out_lap) continue
    const num: number = lap.driver_number
    if (!(num in bestLaps) || lap.lap_duration < bestLaps[num]) {
      bestLaps[num] = lap.lap_duration
    }
  }
  return bestLaps
}

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams
  const q1Key = sp.get('q1_key')
  const q2Key = sp.get('q2_key')
  const q3Key = sp.get('q3_key') || sp.get('session_key')

  if (!q1Key && !q2Key && !q3Key) {
    return NextResponse.json({ error: 'Provide at least one of: q1_key, q2_key, q3_key, session_key' }, { status: 400 })
  }

  // Fetch drivers from whichever key is available
  const primaryKey = q3Key || q2Key || q1Key
  const empty: Record<number, number> = {}
  const [driversRes, q1Data, q2Data, q3Data] = await Promise.all([
    fetch(`https://api.openf1.org/v1/drivers?session_key=${primaryKey}`, { next: { revalidate: 300 } }),
    q1Key ? fetchSession(q1Key) : Promise.resolve(empty),
    q2Key ? fetchSession(q2Key) : Promise.resolve(empty),
    q3Key ? fetchSession(q3Key) : Promise.resolve(empty),
  ])

  const drivers: any[] = driversRes.ok ? await driversRes.json() : []
  const driverMap: Record<number, { name: string; team: string; number: number }> = {}
  for (const d of drivers) {
    driverMap[d.driver_number] = {
      name: d.full_name || d.broadcast_name || `Driver #${d.driver_number}`,
      team: d.team_name || 'Unknown',
      number: d.driver_number,
    }
  }

  // Collect all driver numbers across segments
  const allDriverNums = new Set([
    ...Object.keys(q1Data),
    ...Object.keys(q2Data),
    ...Object.keys(q3Data),
  ].map(Number))

  // Determine best time per driver (Q3 > Q2 > Q1 priority) for sorting
  const results = Array.from(allDriverNums).map(num => {
    const info = driverMap[num] || { name: `Driver #${num}`, team: 'Unknown', number: num }
    const q1 = q1Data[num] != null ? secondsToLapTime(q1Data[num]) : null
    const q2 = q2Data[num] != null ? secondsToLapTime(q2Data[num]) : null
    const q3 = q3Data[num] != null ? secondsToLapTime(q3Data[num]) : null
    const bestSeconds = q3Data[num] ?? q2Data[num] ?? q1Data[num] ?? Infinity
    const time = bestSeconds < Infinity ? secondsToLapTime(bestSeconds) : '—'
    return { driver_number: num, name: info.name, team: info.team, team_colour: teamColour(info.team), q1, q2, q3, time, _sort: bestSeconds }
  })

  results.sort((a, b) => a._sort - b._sort)
  const positioned = results.map(({ _sort: _, ...r }, i) => ({ position: i + 1, ...r }))

  return NextResponse.json({ results: positioned })
}
