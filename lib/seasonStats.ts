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

    // ── Grand Prix pole — read from the dedicated pole field, never the
    // qualifying session array (which may be incomplete/placeholder, and
    // must never source Sprint Qualifying poles) ──
    if (w.pole) {
      ensureDriver(w.pole.name, w.pole.team, w.pole.team_colour)
      dMap[w.pole.name].poles++
    }
  }

  // Ties on points are resolved by countback on Grand Prix finishes — most
  // wins, then most 2nds, and so on — so every surface that reads this order
  // shows tied drivers/teams in championship order, not insertion order.
  const gpFinishes: Record<string, number[]> = {}
  for (const calR of completedRounds) {
    for (const r of (RACE_WEEKENDS[calR.round]?.race || [])) {
      ;(gpFinishes[r.name] ||= []).push(r.position)
      ;(gpFinishes[r.team] ||= []).push(r.position)
    }
  }
  const countback = (a: string, b: string) => {
    for (let p = 1; p <= 22; p++) {
      const diff = (gpFinishes[b] || []).filter(x => x === p).length - (gpFinishes[a] || []).filter(x => x === p).length
      if (diff) return diff
    }
    return 0
  }

  const drivers     = Object.values(dMap).sort((a, b) => b.points - a.points || countback(a.name, b.name))
  const constructors = Object.values(cMap).sort((a, b) => b.points - a.points || countback(a.team, b.team))

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
  // Expected values after R19 Mexico City — the FIA-certified final
  // classification with all post-race time penalties applied (Piastri +10s,
  // Colapinto +10s, Gasly +30s), per GPFans' final classification, Crash's
  // post-penalty report and GrandPrix.com timing data. Standings published
  // by Yahoo and SI before those penalties were applied do NOT match and are
  // superseded. Every driver and constructor is asserted, not just the top
  // of each table, so a name-keying slip cannot pass unnoticed.
  const check = [
    { name: 'Kimi Antonelli',   expPts: 380, expWins: 9, expPodiums: 16, expPoles: 7 },
    { name: 'Max Verstappen',   expPts: 261, expWins: 3, expPodiums: 11, expPoles: 2 },
    { name: 'Lewis Hamilton',   expPts: 259, expWins: 1, expPodiums: 7,  expPoles: 1 },
    { name: 'George Russell',   expPts: 250, expWins: 3, expPodiums: 8,  expPoles: 5 },
    { name: 'Charles Leclerc',  expPts: 245, expWins: 1, expPodiums: 6,  expPoles: 0 },
    { name: 'Lando Norris',     expPts: 221, expWins: 2, expPodiums: 5,  expPoles: 3 },
    { name: 'Oscar Piastri',    expPts: 144, expWins: 0, expPodiums: 2,  expPoles: 0 },
    { name: 'Isack Hadjar',     expPts: 107, expWins: 0, expPodiums: 2,  expPoles: 0 },
    { name: 'Liam Lawson',      expPts: 83,  expWins: 0, expPodiums: 0,  expPoles: 0 },
    { name: 'Pierre Gasly',     expPts: 42,  expWins: 0, expPodiums: 0,  expPoles: 1 },
    { name: 'Arvid Lindblad',   expPts: 38,  expWins: 0, expPodiums: 0,  expPoles: 0 },
    { name: 'Franco Colapinto', expPts: 27,  expWins: 0, expPodiums: 0,  expPoles: 0 },
    { name: 'Oliver Bearman',   expPts: 23,  expWins: 0, expPodiums: 0,  expPoles: 0 },
    { name: 'Gabriel Bortoleto',expPts: 14,  expWins: 0, expPodiums: 0,  expPoles: 0 },
    { name: 'Nico Hülkenberg',  expPts: 13,  expWins: 0, expPodiums: 0,  expPoles: 0 },
    // Three-way tie on 7 — Ocon retains his despite not racing at R19.
    { name: 'Esteban Ocon',     expPts: 7,   expWins: 0, expPodiums: 0,  expPoles: 0 },
    { name: 'Fernando Alonso',  expPts: 7,   expWins: 0, expPodiums: 0,  expPoles: 0 },
    { name: 'Carlos Sainz',     expPts: 7,   expWins: 0, expPodiums: 0,  expPoles: 0 },
    { name: 'Alex Albon',       expPts: 5,   expWins: 0, expPodiums: 0,  expPoles: 0 },
    // Tied on 1 — Hirakawa from his R19 debut, Tsunoda from R12 (he has not
    // raced since R14 but keeps his point).
    { name: 'Ryo Hirakawa',     expPts: 1,   expWins: 0, expPodiums: 0,  expPoles: 0 },
    { name: 'Yuki Tsunoda',     expPts: 1,   expWins: 0, expPodiums: 0,  expPoles: 0 },
    { name: 'Lance Stroll',     expPts: 0,   expWins: 0, expPodiums: 0,  expPoles: 0 },
    { name: 'Valtteri Bottas',  expPts: 0,   expWins: 0, expPodiums: 0,  expPoles: 0 },
    { name: 'Sergio Pérez',     expPts: 0,   expWins: 0, expPodiums: 0,  expPoles: 0 },
  ]
  for (const { name, expPts, expWins, expPodiums, expPoles } of check) {
    const d = DRIVER_STATS_MAP[name]
    const pos = SEASON_STATS.drivers.findIndex(x => x.name === name) + 1
    const ok = d && d.points === expPts && d.wins === expWins && d.podiums === expPodiums && d.poles === expPoles
    console.log(`  ${ok ? '✓' : '✗'} P${pos} ${name}: ${d?.points ?? '?'}pts ${d?.wins ?? '?'}W ${d?.podiums ?? '?'}POD ${d?.poles ?? '?'}POL ${ok ? '' : `— expected ${expPts}pts ${expWins}W ${expPodiums}POD ${expPoles}POL`}`)
  }
  // 22 regular drivers + Tsunoda (R12) + Hirakawa (R19) = 24 entries.
  const expDrivers = 24
  console.log(`  ${SEASON_STATS.drivers.length === expDrivers ? '✓' : '✗'} driver entries: ${SEASON_STATS.drivers.length} (expected ${expDrivers})`)

  // Constructor totals after R19. Red Bull Racing's 27 points at Mexico City
  // broke the R18 tie with McLaren and moved it clear into P3.
  const conCheck: [string, number, number, number][] = [
    ['Mercedes',        630, 12, 24],
    ['Ferrari',         504, 2,  13],
    ['Red Bull Racing', 382, 3,  13],
    ['McLaren',         365, 2,  7],
    ['Racing Bulls',    108, 0,  0],
    ['Alpine',          69,  0,  0],
    ['Haas',            31,  0,  0],
    ['Audi',            27,  0,  0],
    ['Williams',        12,  0,  0],
    ['Aston Martin',    7,   0,  0],
    ['Cadillac',        0,   0,  0],
  ]
  for (const [team, expPts, expWins, expPodiums] of conCheck) {
    const c = CON_STATS_MAP[team]
    const pos = SEASON_STATS.constructors.findIndex(x => x.team === team) + 1
    const ok = c && c.points === expPts && c.wins === expWins && c.podiums === expPodiums
    console.log(`  ${ok ? '✓' : '✗'} P${pos} ${team}: ${c?.points ?? '?'}pts ${c?.wins ?? '?'}W ${c?.podiums ?? '?'}POD ${ok ? '' : `— expected ${expPts}pts ${expWins}W ${expPodiums}POD`}`)
  }

  // Season totals — 19 rounds run, 6 different race winners.
  const totals: [string, number, number][] = [
    ['wins',    SEASON_STATS.drivers.reduce((a, d) => a + d.wins, 0),    19],
    ['poles',   SEASON_STATS.drivers.reduce((a, d) => a + d.poles, 0),   19],
    ['podiums', SEASON_STATS.drivers.reduce((a, d) => a + d.podiums, 0), 57],
  ]
  for (const [label, actual, exp] of totals) {
    console.log(`  ${actual === exp ? '✓' : '✗'} total ${label}: ${actual} (expected ${exp})`)
  }
  const winners = new Set(SEASON_STATS.drivers.filter(d => d.wins > 0).map(d => d.name))
  console.log(`  ${winners.size === 6 ? '✓' : '✗'} different winners: ${winners.size} (expected 6)`)
  console.log('──────────────────────────────────────────────────────────\n')
}
