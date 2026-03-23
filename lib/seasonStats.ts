/**
 * lib/seasonStats.ts
 * Single source of truth for all 2026 season statistics.
 * Everything is calculated from RACE_WEEKENDS in lib/raceResults.ts.
 * No stats are hardcoded anywhere else on the site.
 */

import { RACE_WEEKENDS } from './raceResults'
import { SEASON_CALENDAR } from './races'

// ── Scoring ───────────────────────────────────────────────────────────────────
const RACE_PTS: Record<number, number> = { 1:25,2:18,3:15,4:12,5:10,6:8,7:6,8:4,9:2,10:1 }
const SPRINT_PTS: Record<number, number> = { 1:8,2:7,3:6,4:5,5:4,6:3,7:2,8:1 }

// ── Interfaces ────────────────────────────────────────────────────────────────
export interface DriverStats {
  name: string
  team: string
  teamColor: string
  points: number
  wins: number
  podiums: number
  poles: number
  sprintWins: number
  sprintPodiums: number
  dnfs: number
}

export interface ConstructorStats {
  team: string
  points: number
  wins: number
  podiums: number
}

export interface SeasonStats {
  drivers: DriverStats[]
  constructors: ConstructorStats[]
  mostWins: string[]
  mostPoles: string[]
  mostPodiums: string[]
  driversLeader: string
  constructorsLeader: string
}

// ── Calculation ───────────────────────────────────────────────────────────────
export function calculateSeasonStats(): SeasonStats {
  const completedRounds = SEASON_CALENDAR.filter(r => r.completed && !r.calledOff)

  const dMap: Record<string, DriverStats> = {}
  const cMap: Record<string, ConstructorStats> = {}

  function ensureDriver(name: string, team: string, teamColor: string) {
    if (!dMap[name]) dMap[name] = { name, team, teamColor, points: 0, wins: 0, podiums: 0, poles: 0, sprintWins: 0, sprintPodiums: 0, dnfs: 0 }
  }
  function ensureCon(team: string) {
    if (!cMap[team]) cMap[team] = { team, points: 0, wins: 0, podiums: 0 }
  }

  for (const calR of completedRounds) {
    const w = RACE_WEEKENDS[calR.round]
    if (!w) continue

    // ── Main race ──
    for (const r of (w.race || [])) {
      ensureDriver(r.name, r.team, r.team_colour)
      ensureCon(r.team)
      const pts = RACE_PTS[r.position] || 0
      dMap[r.name].points += pts
      cMap[r.team].points += pts
      if (r.position === 1) { dMap[r.name].wins++;    cMap[r.team].wins++ }
      if (r.position <= 3) { dMap[r.name].podiums++; cMap[r.team].podiums++ }
    }

    // ── Sprint race ──
    for (const r of (w.sprintRace || [])) {
      ensureDriver(r.name, r.team, r.team_colour)
      ensureCon(r.team)
      const pts = SPRINT_PTS[r.position] || 0
      dMap[r.name].points += pts
      cMap[r.team].points += pts
      if (r.position === 1) dMap[r.name].sprintWins++
      if (r.position <= 3) dMap[r.name].sprintPodiums++
    }

    // ── Qualifying pole — explicitly find position 1, never rely on array order ──
    const pole = w.qualifying?.find(r => r.position === 1)
    if (pole) {
      ensureDriver(pole.name, pole.team, pole.team_colour)
      dMap[pole.name].poles++
    }
  }

  const drivers     = Object.values(dMap).sort((a, b) => b.points - a.points)
  const constructors = Object.values(cMap).sort((a, b) => b.points - a.points)

  const maxWins    = Math.max(...drivers.map(d => d.wins),    0)
  const maxPoles   = Math.max(...drivers.map(d => d.poles),   0)
  const maxPodiums = Math.max(...drivers.map(d => d.podiums), 0)

  return {
    drivers,
    constructors,
    mostWins:    drivers.filter(d => d.wins    === maxWins    && maxWins    > 0).map(d => d.name),
    mostPoles:   drivers.filter(d => d.poles   === maxPoles   && maxPoles   > 0).map(d => d.name),
    mostPodiums: drivers.filter(d => d.podiums === maxPodiums && maxPodiums > 0).map(d => d.name),
    driversLeader:      drivers[0]?.name  || '',
    constructorsLeader: constructors[0]?.team || '',
  }
}

// ── Pre-computed singleton ────────────────────────────────────────────────────
export const SEASON_STATS = calculateSeasonStats()

// Lookup maps for O(1) access by name
export const DRIVER_STATS_MAP: Record<string, DriverStats> = Object.fromEntries(
  SEASON_STATS.drivers.map(d => [d.name, d])
)
export const CON_STATS_MAP: Record<string, ConstructorStats> = Object.fromEntries(
  SEASON_STATS.constructors.map(c => [c.team, c])
)

// ── Build-time verification log ───────────────────────────────────────────────
if (typeof process !== 'undefined' && process.env.NODE_ENV !== 'test') {
  console.log('\n── seasonStats verification ──────────────────────────────')
  const check = [
    { name: 'George Russell',  expPts: 51, expWins: 1, expPodiums: 2, expPoles: 1 },
    { name: 'Kimi Antonelli',  expPts: 47, expWins: 1, expPodiums: 2, expPoles: 1 },
    { name: 'Charles Leclerc', expPts: 34, expWins: 0, expPodiums: 1, expPoles: 0 },
    { name: 'Lewis Hamilton',  expPts: 33, expWins: 0, expPodiums: 1, expPoles: 0 },
  ]
  for (const { name, expPts, expWins, expPodiums, expPoles } of check) {
    const d = DRIVER_STATS_MAP[name]
    const ok = d && d.points === expPts && d.wins === expWins && d.podiums === expPodiums && d.poles === expPoles
    console.log(`  ${ok ? '✓' : '✗'} ${name}: ${d?.points ?? '?'}pts ${d?.wins ?? '?'}W ${d?.podiums ?? '?'}POD ${d?.poles ?? '?'}POL ${ok ? '' : `— expected ${expPts}pts ${expWins}W ${expPodiums}POD ${expPoles}POL`}`)
  }
  console.log('──────────────────────────────────────────────────────────\n')
}
