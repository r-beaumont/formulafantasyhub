// Server-only aggregation of the small, static values the race ticker needs.
// Deliberately returns plain strings/numbers so app/layout.tsx (a server
// component) can compute this once and hand it down as serializable props —
// keeping lib/articles.ts, lib/raceResults.ts and lib/standings.ts out of the
// client bundle entirely.
import { SEASON_CALENDAR } from './races'
import { RACE_WEEKENDS } from './raceResults'
import { DRIVER_STANDINGS, CONSTRUCTOR_STANDINGS } from './standings'
import { articles } from './articles'

export interface TickerStaticData {
  driverLeaderName: string
  driverLeaderFlag: string
  driverLeaderPoints: number
  driverGap: number
  conLeaderName: string
  conLeaderFlag: string
  conLeaderPoints: number
  lastRaceName: string
  lastRaceFlag: string
  lastRaceWinner: string | null
  latestArticleTitle: string | null
}

export function getTickerData(): TickerStaticData {
  const driverLeader = DRIVER_STANDINGS[0]
  const driverSecond = DRIVER_STANDINGS[1]
  const conLeader = CONSTRUCTOR_STANDINGS[0]

  const completedRounds = SEASON_CALENDAR.filter(c => c.completed && !c.calledOff)
  const lastRace = completedRounds[completedRounds.length - 1]
  const lastWinner = lastRace ? RACE_WEEKENDS[lastRace.round]?.race?.[0]?.name ?? null : null

  const latestArticle = articles[0]?.title ?? null

  return {
    driverLeaderName: driverLeader?.name ?? '',
    driverLeaderFlag: driverLeader?.flag ?? '',
    driverLeaderPoints: driverLeader?.points ?? 0,
    driverGap: driverLeader && driverSecond ? driverLeader.points - driverSecond.points : 0,
    conLeaderName: conLeader?.name ?? '',
    conLeaderFlag: conLeader?.flag ?? '',
    conLeaderPoints: conLeader?.points ?? 0,
    lastRaceName: lastRace?.name ?? '',
    lastRaceFlag: lastRace?.flag ?? '',
    lastRaceWinner: lastWinner,
    latestArticleTitle: latestArticle,
  }
}
