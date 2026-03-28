import { NextRequest, NextResponse } from 'next/server'

const BASE = 'https://api.openf1.org/v1'

const TEAM_COLOURS: Record<string, string> = {
  'mercedes':    '#27F4D2',
  'ferrari':     '#E8002D',
  'mclaren':     '#FF8000',
  'red bull':    '#3671C6',
  'alpine':      '#FF69B4',
  'haas':        '#B6BABD',
  'audi':        '#C0C0C0',
  'racing bulls':'#6692FF',
  'williams':    '#64C4FF',
  'aston martin':'#358C75',
  'cadillac':    '#CC0000',
}

function toProperCase(name: string): string {
  return name.toLowerCase().replace(/\b\w/g, c => c.toUpperCase())
}

function secondsToLapTime(s: number): string {
  const m = Math.floor(s / 60)
  const rem = s % 60
  return `${m}:${rem.toFixed(3).padStart(6, '0')}`
}

function resolveTeamColour(teamName: string): string {
  const tl = teamName.toLowerCase()
  for (const [k, v] of Object.entries(TEAM_COLOURS)) {
    if (tl.includes(k)) return v
  }
  return '#5A6A7A'
}

function shortTeam(t: string): string {
  return t
    .replace(/Red Bull Racing/i, 'Red Bull')
    .replace(/Haas F1 Team/i, 'Haas')
    .replace(/BWT Alpine.*$/i, 'Alpine')
    .replace(/Visa Cash App RB.*/i, 'Racing Bulls')
    .replace(/Aston Martin Aramco.*/i, 'Aston Martin')
}

/**
 * Detect Q1/Q2/Q3 segment boundaries by finding gaps > 5 minutes
 * between consecutive lap starts across all drivers.
 * Returns an array of up to 2 boundary timestamps (ms).
 * boundary[0] = end of Q1 (last lap start before inter-segment gap)
 * boundary[1] = end of Q2
 */
function detectSegmentBoundaries(laps: any[]): number[] {
  const times = laps
    .filter(l => l.date_start)
    .map(l => new Date(l.date_start).getTime())
    .sort((a, b) => a - b)

  const boundaries: number[] = []
  for (let i = 1; i < times.length; i++) {
    if (times[i] - times[i - 1] > 5 * 60 * 1000) {
      boundaries.push(times[i - 1])
      if (boundaries.length === 2) break
    }
  }
  return boundaries
}

function getSegment(lapDateStart: string, boundaries: number[]): 1 | 2 | 3 {
  const t = new Date(lapDateStart).getTime()
  if (boundaries.length === 0) return 1
  if (t <= boundaries[0]) return 1
  if (boundaries.length === 1 || t <= boundaries[1]) return 2
  return 3
}

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams
  const sessionKey = sp.get('session_key')

  if (!sessionKey) {
    return NextResponse.json({ error: 'Provide session_key' }, { status: 400 })
  }

  const [lapsRes, driversRes] = await Promise.all([
    fetch(`${BASE}/laps?session_key=${sessionKey}`, { cache: 'no-store' }),
    fetch(`${BASE}/drivers?session_key=${sessionKey}`, { cache: 'no-store' }),
  ])

  if (!lapsRes.ok) return NextResponse.json({ results: [] })

  const allLaps: any[] = await lapsRes.json()
  const drivers: any[] = driversRes.ok ? await driversRes.json() : []

  if (!Array.isArray(allLaps) || allLaps.length === 0) {
    return NextResponse.json({ results: [] })
  }

  // Build driver info map
  const driverMap: Record<number, any> = {}
  for (const d of drivers) driverMap[d.driver_number] = d

  // Detect segment boundaries from all lap timestamps
  const boundaries = detectSegmentBoundaries(allLaps)

  // Valid timing laps only (exclude laps with no duration)
  const timedLaps = allLaps.filter(l => l.lap_duration && l.lap_duration > 0 && l.date_start)

  // Best lap per driver per segment
  const segBest: Record<1 | 2 | 3, Record<number, number>> = { 1: {}, 2: {}, 3: {} }
  // Track which segments each driver participated in (any lap at all, even invalid)
  const segParticipants: Record<1 | 2 | 3, Set<number>> = { 1: new Set(), 2: new Set(), 3: new Set() }

  for (const lap of allLaps) {
    if (!lap.date_start) continue
    const seg = getSegment(lap.date_start, boundaries)
    segParticipants[seg].add(lap.driver_number)
  }

  for (const lap of timedLaps) {
    const seg = getSegment(lap.date_start, boundaries)
    const n: number = lap.driver_number
    if (!(n in segBest[seg]) || lap.lap_duration < segBest[seg][n]) {
      segBest[seg][n] = lap.lap_duration
    }
  }

  // All drivers seen across all segments
  const allNums = new Set<number>()
  for (const seg of [1, 2, 3] as const) {
    segParticipants[seg].forEach(n => allNums.add(n))
  }

  const results = Array.from(allNums).map(num => {
    const d = driverMap[num] || {}
    const name = toProperCase(d.full_name || d.broadcast_name || `Driver #${num}`)
    const team = shortTeam(d.team_name || 'Unknown')

    // Time string: set if best time exists, 'NO TIME SET' if participated but no time, null if didn't reach segment
    const q1 = segBest[1][num] != null
      ? secondsToLapTime(segBest[1][num])
      : segParticipants[1].has(num) ? 'NO TIME SET' : null
    const q2 = segBest[2][num] != null
      ? secondsToLapTime(segBest[2][num])
      : segParticipants[2].has(num) ? 'NO TIME SET' : null
    const q3 = segBest[3][num] != null
      ? secondsToLapTime(segBest[3][num])
      : segParticipants[3].has(num) ? 'NO TIME SET' : null

    const sortTime = segBest[3][num] ?? segBest[2][num] ?? segBest[1][num] ?? Infinity
    return {
      driver_number: num,
      name,
      team,
      team_colour: resolveTeamColour(team),
      q1,
      q2,
      q3,
      _sort: sortTime,
    }
  })

  results.sort((a, b) => a._sort - b._sort)
  const positioned = results.map(({ _sort: _, ...r }, i) => ({ position: i + 1, ...r }))

  return NextResponse.json({ results: positioned })
}
