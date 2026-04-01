// lib/openf1.ts
// Server-side utilities for fetching and processing OpenF1 API data.
// These functions can be used from API routes or server components.

const BASE = 'https://api.openf1.org/v1'

export const GRID_NUMBERS = new Set([1, 4, 5, 6, 7, 10, 11, 12, 14, 16, 18, 23, 27, 30, 31, 43, 44, 55, 63, 77, 81, 87])

export const TEAM_COLOURS: Record<string, string> = {
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

// ─── Types ────────────────────────────────────────────────────────────────────

export interface OpenF1Session {
  session_key: number
  session_name: string
  session_type: string
  date_start: string
  date_end: string
  meeting_key: number
}

export interface PracticeResult {
  position: number
  driver_number: number
  name: string
  team: string
  team_colour: string
  time: string
  gap: string
}

export interface QualifyingResult {
  position: number
  driver_number: number
  name: string
  team: string
  team_colour: string
  q1: string | null
  q2: string | null
  q3: string | null
}

export interface RaceResult {
  position: number
  driver_number: number
  name: string
  team: string
  team_colour: string
  gap: string
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function toProperCase(name: string): string {
  return name.toLowerCase().replace(/\b\w/g, c => c.toUpperCase())
}

export function resolveTeamColour(teamName: string): string {
  const tl = teamName.toLowerCase()
  for (const [k, v] of Object.entries(TEAM_COLOURS)) {
    if (tl.includes(k)) return v
  }
  return '#5A6A7A'
}

export function shortTeam(t: string): string {
  return t
    .replace(/Red Bull Racing/i, 'Red Bull')
    .replace(/Haas F1 Team/i, 'Haas')
    .replace(/BWT Alpine.*$/i, 'Alpine')
    .replace(/Visa Cash App RB.*/i, 'Racing Bulls')
    .replace(/Aston Martin Aramco.*/i, 'Aston Martin')
}

function secondsToLapTime(s: number): string {
  const m = Math.floor(s / 60)
  const rem = s % 60
  return `${m}:${rem.toFixed(3).padStart(6, '0')}`
}

function formatGap(gap: unknown): string {
  if (gap == null) return 'NO TIME SET'
  if (gap === 0 || gap === '0') return '—'
  const n = parseFloat(String(gap))
  if (isNaN(n)) return String(gap)
  return n > 0 ? `+${n.toFixed(3)}s` : String(gap)
}

function detectSegmentBoundaries(validLaps: { lap_duration: number; date_start: string }[]): number[] {
  const racingLaps = validLaps.filter(l => l.lap_duration < 300)
  const times = racingLaps
    .filter(l => l.date_start)
    .map(l => new Date(l.date_start).getTime())
    .sort((a, b) => a - b)

  const SEGMENT_GAP_MS = 7 * 60 * 1000
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

// ─── Main functions ───────────────────────────────────────────────────────────

/**
 * Get all sessions for a meeting from OpenF1.
 * Pass meeting_key number or 'latest' for the current race weekend.
 */
export async function getSessionKeys(meeting_key: number | string): Promise<OpenF1Session[]> {
  try {
    const res = await fetch(`${BASE}/sessions?meeting_key=${meeting_key}`, { cache: 'no-store' })
    if (!res.ok) return []
    const data = await res.json()
    return Array.isArray(data) ? data : []
  } catch {
    return []
  }
}

/**
 * Get driver info for a session, filtered to the 2026 racing grid.
 * Returns a map of driver_number → driver object.
 */
export async function getDrivers(session_key: number): Promise<Record<number, { full_name?: string; broadcast_name?: string; team_name?: string }>> {
  try {
    const res = await fetch(`${BASE}/drivers?session_key=${session_key}`, { cache: 'no-store' })
    if (!res.ok) return {}
    const data = await res.json()
    if (!Array.isArray(data)) return {}
    const map: Record<number, any> = {}
    for (const d of data) {
      if (GRID_NUMBERS.has(d.driver_number)) map[d.driver_number] = d
    }
    return map
  } catch {
    return {}
  }
}

/**
 * Get practice session results — best lap per grid driver, sorted by time.
 */
export async function getPracticeResults(session_key: number): Promise<PracticeResult[]> {
  try {
    const [lapsRes, driversRes] = await Promise.all([
      fetch(`${BASE}/laps?session_key=${session_key}`, { cache: 'no-store' }),
      fetch(`${BASE}/drivers?session_key=${session_key}`, { cache: 'no-store' }),
    ])

    const laps: any[] = lapsRes.ok ? await lapsRes.json() : []
    const driversRaw: any[] = driversRes.ok ? await driversRes.json() : []
    if (!Array.isArray(laps) || laps.length === 0) return []

    const driverMap: Record<number, any> = {}
    for (const d of driversRaw) {
      if (GRID_NUMBERS.has(d.driver_number)) driverMap[d.driver_number] = d
    }

    const bestLaps: Record<number, number> = {}
    for (const lap of laps) {
      if (!GRID_NUMBERS.has(lap.driver_number)) continue
      if (lap.lap_duration == null || lap.lap_duration <= 0) continue
      const dn: number = lap.driver_number
      if (!bestLaps[dn] || lap.lap_duration < bestLaps[dn]) {
        bestLaps[dn] = lap.lap_duration
      }
    }

    if (Object.keys(bestLaps).length === 0) return []
    const leaderTime = Math.min(...Object.values(bestLaps))

    return Object.entries(bestLaps)
      .sort(([, a], [, b]) => a - b)
      .map(([driverNum, time], i) => {
        const dn = parseInt(driverNum)
        const d = driverMap[dn] || {}
        const team = shortTeam(d.team_name || 'Unknown')
        return {
          position: i + 1,
          driver_number: dn,
          name: toProperCase(d.full_name || d.broadcast_name || `Driver #${dn}`),
          team,
          team_colour: resolveTeamColour(team),
          time: secondsToLapTime(time),
          gap: i === 0 ? '—' : `+${(time - leaderTime).toFixed(3)}s`,
        }
      })
  } catch {
    return []
  }
}

/**
 * Get qualifying results with Q1/Q2/Q3 columns, sorted by qualifying position.
 * Uses segment detection (7-minute gaps between Q1→Q2→Q3).
 */
export async function getQualifyingResults(session_key: number): Promise<{ results: QualifyingResult[] }> {
  try {
    const [lapsRes, driversRes] = await Promise.all([
      fetch(`${BASE}/laps?session_key=${session_key}`, { cache: 'no-store' }),
      fetch(`${BASE}/drivers?session_key=${session_key}`, { cache: 'no-store' }),
    ])

    const allLaps: any[] = lapsRes.ok ? await lapsRes.json() : []
    const driversRaw: any[] = driversRes.ok ? await driversRes.json() : []
    if (!Array.isArray(allLaps) || allLaps.length === 0) return { results: [] }

    const driverMap: Record<number, any> = {}
    for (const d of driversRaw) {
      if (GRID_NUMBERS.has(d.driver_number)) driverMap[d.driver_number] = d
    }

    const validLaps = allLaps.filter(
      l => GRID_NUMBERS.has(l.driver_number) && l.lap_duration && l.lap_duration > 0 && l.date_start
    )
    const boundaries = detectSegmentBoundaries(validLaps)

    const segParticipants: Record<1 | 2 | 3, Set<number>> = { 1: new Set(), 2: new Set(), 3: new Set() }
    for (const lap of allLaps) {
      if (!GRID_NUMBERS.has(lap.driver_number) || !lap.date_start) continue
      const seg = getSegment(lap.date_start, boundaries)
      segParticipants[seg].add(lap.driver_number)
    }

    const segBest: Record<1 | 2 | 3, Record<number, number>> = { 1: {}, 2: {}, 3: {} }
    for (const lap of validLaps) {
      const seg = getSegment(lap.date_start, boundaries)
      const n: number = lap.driver_number
      if (!(n in segBest[seg]) || lap.lap_duration < segBest[seg][n]) {
        segBest[seg][n] = lap.lap_duration
      }
    }

    const allNums = new Set<number>()
    for (const seg of [1, 2, 3] as const) {
      segParticipants[seg].forEach(n => allNums.add(n))
    }

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

      const tier: 1 | 2 | 3 = segBest[3][num] != null ? 3 : segParticipants[2].has(num) ? 2 : 1

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

    results.sort((a, b) => {
      if (a._tier !== b._tier) return b._tier - a._tier
      if (a._tier === 3) return a._q3time - b._q3time
      if (a._tier === 2) return a._q2time - b._q2time
      return a._q1time - b._q1time
    })

    const positioned = results.map(({ _tier, _q1time, _q2time, _q3time, ...r }, i) => ({
      position: i + 1,
      ...r,
    }))

    return { results: positioned }
  } catch {
    return { results: [] }
  }
}

/**
 * Get race/sprint race results — latest position and gap to leader per grid driver.
 */
export async function getRaceResults(session_key: number): Promise<RaceResult[]> {
  try {
    const [posRes, intRes, drvRes] = await Promise.all([
      fetch(`${BASE}/position?session_key=${session_key}`, { cache: 'no-store' }),
      fetch(`${BASE}/intervals?session_key=${session_key}`, { cache: 'no-store' }),
      fetch(`${BASE}/drivers?session_key=${session_key}`, { cache: 'no-store' }),
    ])

    const positions: any[] = posRes.ok ? await posRes.json() : []
    const intervals: any[] = intRes.ok ? await intRes.json() : []
    const driversRaw: any[] = drvRes.ok ? await drvRes.json() : []

    const driverMap: Record<number, any> = {}
    for (const d of driversRaw) driverMap[d.driver_number] = d

    const latestPos: Record<number, any> = {}
    for (const p of positions) {
      const n: number = p.driver_number
      if (!latestPos[n] || new Date(p.date).getTime() > new Date(latestPos[n].date).getTime()) {
        latestPos[n] = p
      }
    }

    const latestInt: Record<number, any> = {}
    for (const iv of intervals) {
      const n: number = iv.driver_number
      if (!latestInt[n] || new Date(iv.date).getTime() > new Date(latestInt[n].date).getTime()) {
        latestInt[n] = iv
      }
    }

    const allNums = new Set<number>([
      ...Object.keys(latestPos).map(Number),
      ...Object.keys(driverMap).map(Number).filter(n => GRID_NUMBERS.has(n)),
    ])

    const results = Array.from(allNums)
      .filter(n => GRID_NUMBERS.has(n))
      .map(num => {
        const d = driverMap[num] || {}
        const team = shortTeam(d.team_name || 'Unknown')
        const pos = latestPos[num]
        const iv = latestInt[num]
        return {
          position: pos?.position ?? 99,
          driver_number: num,
          name: toProperCase(d.full_name || d.broadcast_name || `Driver #${num}`),
          team,
          team_colour: resolveTeamColour(team),
          gap: iv ? formatGap(iv.gap_to_leader) : 'NO TIME SET',
        }
      })

    results.sort((a, b) => a.position - b.position)
    return results
  } catch {
    return []
  }
}
