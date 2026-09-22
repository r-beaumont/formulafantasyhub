// Server-only computation for the Standings page. Reads the heavy lib files
// (raceResults, races, standings, seasonStats) once and returns small plain
// data structures for the client components to render/sort.
import { SEASON_CALENDAR, CURRENT_RACE } from '@/lib/races'
import { RACE_WEEKENDS } from '@/lib/raceResults'
import { DRIVER_STANDINGS, CONSTRUCTOR_STANDINGS } from '@/lib/standings'
import { SEASON_STATS, DRIVER_STATS_MAP } from '@/lib/seasonStats'

const RACE_PTS: Record<number, number> = { 1: 25, 2: 18, 3: 15, 4: 12, 5: 10, 6: 8, 7: 6, 8: 4, 9: 2, 10: 1 }
const SPRINT_PTS: Record<number, number> = { 1: 8, 2: 7, 3: 6, 4: 5, 5: 4, 6: 3, 7: 2, 8: 1 }

const SHORT_TEAM: Record<string, string> = { 'Red Bull Racing': 'Red Bull', 'Haas F1 Team': 'Haas' }
export const shortTeam = (t: string) => SHORT_TEAM[t] ?? t

const ENGINE: Record<string, string> = {
  McLaren: 'Mercedes', Mercedes: 'Mercedes', 'Red Bull Racing': 'Red Bull Ford', Ferrari: 'Ferrari',
  Williams: 'Mercedes', 'Racing Bulls': 'Red Bull Ford', 'Aston Martin': 'Honda', Haas: 'Ferrari',
  Audi: 'Audi', Alpine: 'Mercedes', Cadillac: 'Ferrari',
}

export interface OverviewTile {
  label: string
  name: string
  flag: string
  teamColor: string
  value: string
}

export interface DriverRow {
  pos: number
  name: string
  team: string
  teamColor: string
  flag: string
  points: number
  wins: number
  podiums: number
  poles: number
}

export interface ConstructorRow {
  pos: number
  name: string
  engine: string
  color: string
  flag: string
  points: number
  wins: number
  podiums: number
  poles: number
}

export interface PprRow {
  name: string
  displayName: string
  flag: string
  teamColor: string
  pointsByRound: Record<number, number>
  total: number
}

export interface PprRoundHeader {
  round: number
  flag: string
  name: string
}

export interface CalendarTile {
  round: number
  flag: string
  date: string
  completed: boolean
  calledOff: boolean
  sprint: boolean
}

export interface StandingsData {
  lastCompletedRound: number
  lastCompletedRaceName: string
  completedCount: number
  currentRound: number
  overview: {
    driversLeader: OverviewTile
    constructorsLeader: OverviewTile
    mostWins: OverviewTile
    mostPoles: OverviewTile
    mostPodiums: OverviewTile
  }
  differentWinners: { name: string; flag: string }[]
  driverRows: DriverRow[]
  constructorRows: ConstructorRow[]
  driverPpr: PprRow[]
  constructorPpr: PprRow[]
  pprRounds: PprRoundHeader[]
  driverPodiumsByRound: Record<number, string[]>
  constructorPodiumsByRound: Record<number, string[]>
  calendarTiles: CalendarTile[]
}

export function buildStandingsData(): StandingsData {
  const completed = SEASON_CALENDAR.filter(r => r.completed && !r.calledOff)
  const last = completed[completed.length - 1]

  const driverFlagMap: Record<string, string> = Object.fromEntries(DRIVER_STANDINGS.map(d => [d.name, d.flag]))
  const constructorFlagMap: Record<string, string> = Object.fromEntries(CONSTRUCTOR_STANDINGS.map(c => [c.name, c.flag]))

  // ── Driver / constructor tables (points, wins, podiums, poles) ──
  const driverRows: DriverRow[] = DRIVER_STANDINGS.map((d, i) => ({
    pos: i + 1,
    name: d.name,
    team: shortTeam(d.team),
    teamColor: d.teamColor,
    flag: d.flag,
    points: d.points,
    wins: d.wins,
    podiums: DRIVER_STATS_MAP[d.name]?.podiums ?? 0,
    poles: DRIVER_STATS_MAP[d.name]?.poles ?? 0,
  }))

  const constructorRows: ConstructorRow[] = CONSTRUCTOR_STANDINGS.map((c, i) => {
    const poles = DRIVER_STANDINGS.filter(d => d.team === c.name).reduce((sum, d) => sum + (DRIVER_STATS_MAP[d.name]?.poles ?? 0), 0)
    const stats = SEASON_STATS.constructors.find(x => x.team === c.name)
    return {
      pos: i + 1,
      name: shortTeam(c.name),
      engine: ENGINE[c.name] ?? '—',
      color: c.color,
      flag: c.flag,
      points: c.points,
      wins: stats?.wins ?? c.wins,
      podiums: stats?.podiums ?? 0,
      poles,
    }
  })

  // ── Season Overview tiles ──
  const dl = DRIVER_STANDINGS[0]
  const cl = CONSTRUCTOR_STANDINGS[0]
  const mostWinsName = SEASON_STATS.mostWins[0]
  const mostPolesName = SEASON_STATS.mostPoles[0]
  const mostPodiumsName = SEASON_STATS.mostPodiums[0]
  const mwStats = mostWinsName ? DRIVER_STATS_MAP[mostWinsName] : undefined
  const mpoStats = mostPolesName ? DRIVER_STATS_MAP[mostPolesName] : undefined
  const mpoStats2 = mostPodiumsName ? DRIVER_STATS_MAP[mostPodiumsName] : undefined

  const overview = {
    driversLeader: { label: 'Drivers Leader', name: dl.name, flag: dl.flag, teamColor: dl.teamColor, value: `${dl.points} pts` },
    constructorsLeader: { label: 'Constructors Leader', name: shortTeam(cl.name), flag: cl.flag, teamColor: cl.color, value: `${cl.points} pts` },
    mostWins: { label: 'Most Wins', name: mostWinsName ?? '—', flag: mostWinsName ? (driverFlagMap[mostWinsName] ?? '') : '', teamColor: mwStats?.teamColor ?? '#5A6A7A', value: mwStats ? `${mwStats.wins}W` : '—' },
    mostPoles: { label: 'Most Poles', name: mostPolesName ?? '—', flag: mostPolesName ? (driverFlagMap[mostPolesName] ?? '') : '', teamColor: mpoStats?.teamColor ?? '#5A6A7A', value: mpoStats ? `${mpoStats.poles}P` : '—' },
    mostPodiums: { label: 'Most Podiums', name: mostPodiumsName ?? '—', flag: mostPodiumsName ? (driverFlagMap[mostPodiumsName] ?? '') : '', teamColor: mpoStats2?.teamColor ?? '#5A6A7A', value: mpoStats2 ? `${mpoStats2.podiums}` : '—' },
  }

  // ── Different winners ──
  const winnerNames: string[] = []
  for (const c of completed) {
    const w = RACE_WEEKENDS[c.round]?.race?.[0]?.name
    if (w && !winnerNames.includes(w)) winnerNames.push(w)
  }
  const differentWinners = winnerNames.map(name => ({ name, flag: driverFlagMap[name] ?? '' }))

  // ── Points per race ──
  const dRound: Record<string, Record<number, number>> = {}
  const dMeta: Record<string, { team: string; teamColor: string }> = {}
  const driverPodiumsByRound: Record<number, string[]> = {}
  const constructorPodiumsByRound: Record<number, string[]> = {}

  for (const c of completed) {
    const w = RACE_WEEKENDS[c.round]
    if (!w) continue
    for (const r of w.race ?? []) {
      dRound[r.name] = dRound[r.name] ?? {}
      dRound[r.name][c.round] = (dRound[r.name][c.round] ?? 0) + (RACE_PTS[r.position] ?? 0)
      dMeta[r.name] = { team: r.team, teamColor: r.team_colour }
    }
    for (const r of w.sprintRace ?? []) {
      dRound[r.name] = dRound[r.name] ?? {}
      dRound[r.name][c.round] = (dRound[r.name][c.round] ?? 0) + (SPRINT_PTS[r.position] ?? 0)
      dMeta[r.name] = dMeta[r.name] ?? { team: r.team, teamColor: r.team_colour }
    }
    if (w.race?.length) {
      driverPodiumsByRound[c.round] = w.race.slice(0, 3).map(r => r.name)
      constructorPodiumsByRound[c.round] = w.race.slice(0, 3).map(r => r.team)
    }
  }

  const driverPpr: PprRow[] = Object.entries(dRound)
    .map(([name, pointsByRound]) => ({
      name, displayName: name, flag: driverFlagMap[name] ?? '', teamColor: dMeta[name]?.teamColor ?? '#5A6A7A',
      pointsByRound, total: Object.values(pointsByRound).reduce((a, b) => a + b, 0),
    }))
    .sort((a, b) => b.total - a.total)

  const cRound: Record<string, Record<number, number>> = {}
  const cColor: Record<string, string> = {}
  for (const d of driverPpr) {
    const team = dMeta[d.name]?.team
    if (!team) continue
    cColor[team] = d.teamColor
    cRound[team] = cRound[team] ?? {}
    for (const [round, pts] of Object.entries(d.pointsByRound)) {
      cRound[team][Number(round)] = (cRound[team][Number(round)] ?? 0) + pts
    }
  }
  const constructorPpr: PprRow[] = Object.entries(cRound)
    .map(([name, pointsByRound]) => ({
      name, displayName: shortTeam(name), flag: constructorFlagMap[name] ?? '', teamColor: cColor[name] ?? '#5A6A7A',
      pointsByRound, total: Object.values(pointsByRound).reduce((a, b) => a + b, 0),
    }))
    .sort((a, b) => b.total - a.total)

  const pprRounds: PprRoundHeader[] = completed.map(c => ({ round: c.round, flag: c.flag, name: c.name }))

  const calendarTiles: CalendarTile[] = SEASON_CALENDAR.map(r => ({
    round: r.round, flag: r.flag, date: r.date, completed: r.completed, calledOff: r.calledOff, sprint: r.sprint,
  }))

  return {
    lastCompletedRound: last?.round ?? 0,
    lastCompletedRaceName: last?.name ?? '',
    completedCount: completed.length,
    currentRound: CURRENT_RACE.round,
    overview,
    differentWinners,
    driverRows,
    constructorRows,
    driverPpr,
    constructorPpr,
    pprRounds,
    driverPodiumsByRound,
    constructorPodiumsByRound,
    calendarTiles,
  }
}
