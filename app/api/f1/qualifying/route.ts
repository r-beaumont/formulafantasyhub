import { NextRequest, NextResponse } from 'next/server'

const BASE = 'https://api.openf1.org/v1'

// 2026 racing grid driver numbers — used to filter out non-racing entries from the API
const GRID_NUMBERS = new Set([1, 4, 5, 6, 7, 10, 11, 12, 14, 16, 18, 23, 27, 30, 31, 43, 44, 55, 63, 77, 81, 87])

const TEAM_COLOURS: Record<string, string> = {
  'mercedes':     '#27F4D2',
  'ferrari':      '#E8002D',
  'mclaren':      '#FF8000',
  'red bull':     '#3671C6',
  'alpine':       '#FF69B4',
  'haas':         '#B6BABD',
  'audi':         '#C0C0C0',
  'racing bulls': '#6692FF',
  'williams':     '#64C4FF',
  'aston martin': '#358C75',
  'cadillac':     '#CC0000',
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
 * Detect Q1/Q2/Q3 segment boundaries by finding time gaps > 7 minutes
 * between consecutive valid lap starts across all grid drivers.
 * Returns up to 2 boundary timestamps (ms) — the end of Q1 and end of Q2.
 */
function detectSegmentBoundaries(validLaps: any[]): number[] {
  // Only use laps with plausible lap times (covers flying laps, not slow formation laps > 5min)
  const racingLaps = validLaps.filter(l => l.lap_duration < 300)
  const times = racingLaps
    .filter(l => l.date_start)
    .map(l => new Date(l.date_start).getTime())
    .sort((a, b) => a - b)

  const SEGMENT_GAP_MS = 7 * 60 * 1000  // 7 minutes between qualifying segments

  const boundaries: number[] = []
  for (let i = 1; i < times.length; i++) {
    if (times[i] - times[i - 1] > SEGMENT_GAP_MS) {
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

  // Build driver info map — only grid drivers
  const driverMap: Record<number, any> = {}
  for (const d of drivers) {
    if (GRID_NUMBERS.has(d.driver_number)) {
      driverMap[d.driver_number] = d
    }
  }

  // Valid timed laps from grid drivers only
  const validLaps = allLaps.filter(
    l => GRID_NUMBERS.has(l.driver_number) && l.lap_duration && l.lap_duration > 0 && l.date_start
  )

  // Detect segment boundaries using valid laps
  const boundaries = detectSegmentBoundaries(validLaps)

  // Track which segments each grid driver participated in (any lap, including invalid)
  const segParticipants: Record<1 | 2 | 3, Set<number>> = { 1: new Set(), 2: new Set(), 3: new Set() }
  for (const lap of allLaps) {
    if (!GRID_NUMBERS.has(lap.driver_number) || !lap.date_start) continue
    const seg = getSegment(lap.date_start, boundaries)
    segParticipants[seg].add(lap.driver_number)
  }

  // Best lap per grid driver per segment
  const segBest: Record<1 | 2 | 3, Record<number, number>> = { 1: {}, 2: {}, 3: {} }
  for (const lap of validLaps) {
    const seg = getSegment(lap.date_start, boundaries)
    const n: number = lap.driver_number
    if (!(n in segBest[seg]) || lap.lap_duration < segBest[seg][n]) {
      segBest[seg][n] = lap.lap_duration
    }
  }

  // Collect all grid driver numbers seen in any segment
  const allNums = new Set<number>()
  for (const seg of [1, 2, 3] as const) {
    segParticipants[seg].forEach(n => allNums.add(n))
  }

  // Build per-driver results with correct q1/q2/q3 strings
  const results = Array.from(allNums).map(num => {
    const d = driverMap[num] || {}
    const name = toProperCase(d.full_name || d.broadcast_name || `Driver #${num}`)
    const team = shortTeam(d.team_name || 'Unknown')

    const q1 = segBest[1][num] != null
      ? secondsToLapTime(segBest[1][num])
      : segParticipants[1].has(num) ? 'NO TIME SET' : null

    const q2 = segBest[2][num] != null
      ? secondsToLapTime(segBest[2][num])
      : segParticipants[2].has(num) ? 'NO TIME SET' : null

    const q3 = segBest[3][num] != null
      ? secondsToLapTime(segBest[3][num])
      : segParticipants[3].has(num) ? 'NO TIME SET' : null

    // Tier: 3 = reached Q3, 2 = reached Q2, 1 = Q1 only
    const tier: 1 | 2 | 3 = segBest[3][num] != null ? 3
      : segParticipants[2].has(num) ? 2
      : 1

    return {
      driver_number: num,
      name,
      team,
      team_colour: resolveTeamColour(team),
      q1,
      q2,
      q3,
      _tier: tier,
      _q1time: segBest[1][num] ?? Infinity,
      _q2time: segBest[2][num] ?? Infinity,
      _q3time: segBest[3][num] ?? Infinity,
    }
  })

  // Sort by F1 qualifying rules:
  //   P1–10:  Q3 finishers sorted by Q3 time
  //   P11–16: Q2-eliminated sorted by Q2 time
  //   P17–22: Q1-eliminated sorted by Q1 time
  results.sort((a, b) => {
    if (a._tier !== b._tier) return b._tier - a._tier  // higher tier = better position
    if (a._tier === 3) return a._q3time - b._q3time
    if (a._tier === 2) return a._q2time - b._q2time
    return a._q1time - b._q1time
  })

  const positioned = results.map(({ _tier: _t, _q1time: _q1, _q2time: _q2, _q3time: _q3, ...r }, i) => ({
    position: i + 1,
    ...r,
  }))

  return NextResponse.json({ results: positioned })
}
