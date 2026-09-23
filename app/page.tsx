import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import HeroSnapshot from '@/components/home/HeroSnapshot'
import ChampionshipCard, { type StandingRow } from '@/components/home/ChampionshipCard'
import SeasonCalendarStrip, { type CalendarTile } from '@/components/home/SeasonCalendarStrip'
import QuickLinkCards from '@/components/home/QuickLinkCards'
import NewsCarouselCard from '@/components/home/NewsCarouselCard'
import LatestVideosCard from '@/components/home/LatestVideosCard'
import type { CircuitFacts } from '@/components/home/LockCard'
import { SEASON_CALENDAR, computeCurrentRace } from '@/lib/races'
import { DRIVER_STANDINGS, CONSTRUCTOR_STANDINGS } from '@/lib/standings'
import { circuitOverviewData } from '@/lib/circuitOverview'
import { articles } from '@/lib/articles'

// Rebuild hourly so computeCurrentRace() below never serves a round that's
// gone stale server-side between deploys — see lib/useCurrentRace.ts for the
// matching client-side auto-advance.
export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Formula Hub — F1 Race Data, Standings & Fantasy Strategy 2026',
  description: 'Live F1 race results, championship standings, session times and fantasy strategy from Rob Beaumont — official F1 Fantasy columnist for formula1.com.',
  alternates: { canonical: 'https://formulahub.live' },
  openGraph: {
    title: 'Formula Hub — F1 Race Data, Standings & Fantasy Strategy 2026',
    description: 'Live F1 race results, championship standings, session times and fantasy strategy from Rob Beaumont — official F1 Fantasy columnist for formula1.com.',
    url: 'https://formulahub.live',
    siteName: 'Formula Hub',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@F_FantasyHub',
    creator: '@F_FantasyHub',
    title: 'Formula Hub — F1 Race Data, Standings & Fantasy Strategy 2026',
    description: 'Live F1 race results, championship standings, session times and fantasy strategy from Rob Beaumont — official F1 Fantasy columnist for formula1.com.',
  },
}

const SHORT_TEAM: Record<string, string> = { 'Red Bull Racing': 'Red Bull', 'Haas F1 Team': 'Haas' }
const shortTeam = (t: string) => SHORT_TEAM[t] ?? t

function expandWinner(short: string | undefined): { name: string; flag: string } | null {
  if (!short) return null
  const surname = short.split(' ').slice(-1)[0]
  const match = DRIVER_STANDINGS.find(d => d.name.endsWith(surname))
  return match ? { name: match.name, flag: match.flag } : null
}

function buildCircuitFacts(round: number): CircuitFacts {
  const o = circuitOverviewData[round] ?? {}
  const winner = expandWinner(o.lastWinner)
  return {
    avgOvertakes: o.avgOvertakes ?? null,
    dnfAvg: typeof o.dnfHistory?.avg === 'number' ? o.dnfHistory.avg : null,
    gridImportance: o.gridImportance ?? 'TBC',
    lastWinnerName: winner?.name ?? null,
    lastWinnerFlag: winner?.flag ?? null,
    mostWinsDriver: o.mostWinsDriver ?? null,
    mostWinsDriverCount: o.mostWinsDriverCount ?? null,
  }
}

// Built for every round rather than just "the current one" — HeroSnapshot
// picks the entry client-side using the same round useCurrentRace() returns,
// so the facts can never drift out of sync with the rest of the hero (name,
// flag, sessions, countdown, map) when the race auto-advances mid-session.
function buildCircuitFactsByRound(): Record<number, CircuitFacts> {
  const map: Record<number, CircuitFacts> = {}
  for (const cal of SEASON_CALENDAR) map[cal.round] = buildCircuitFacts(cal.round)
  return map
}

function buildDriverRows(): StandingRow[] {
  const top = DRIVER_STANDINGS.slice(0, 5)
  const leaderPoints = DRIVER_STANDINGS[0]?.points ?? 0
  return top.map((d, i) => ({
    pos: i + 1,
    name: d.name,
    sub: shortTeam(d.team),
    flag: d.flag,
    teamColor: d.teamColor,
    points: d.points,
    gapLabel: i === 0 ? 'Leader' : `−${leaderPoints - d.points}`,
  }))
}

function buildConstructorRows(): StandingRow[] {
  const top = CONSTRUCTOR_STANDINGS.slice(0, 5)
  const leaderPoints = CONSTRUCTOR_STANDINGS[0]?.points ?? 0
  return top.map((c, i) => ({
    pos: i + 1,
    name: shortTeam(c.name),
    sub: `${c.wins} win${c.wins === 1 ? '' : 's'}`,
    flag: c.flag,
    teamColor: c.color,
    points: c.points,
    gapLabel: i === 0 ? 'Leader' : `−${leaderPoints - c.points}`,
  }))
}

function buildCalendarTiles(): CalendarTile[] {
  return SEASON_CALENDAR.map(r => ({
    round: r.round,
    flag: r.flag,
    date: r.date,
    completed: r.completed,
    calledOff: r.calledOff,
    sprint: r.sprint,
  }))
}

export default function Home() {
  const latestArticles = articles.slice(0, 3)
  const previewSlug = articles[0]?.slug ?? ''
  const circuitFactsByRound = buildCircuitFactsByRound()
  const currentRound = computeCurrentRace(new Date()).round
  const driverRows = buildDriverRows()
  const constructorRows = buildConstructorRows()
  const calendarTiles = buildCalendarTiles()
  const completedCount = SEASON_CALENDAR.filter(r => r.completed && !r.calledOff).length

  return (
    <>
      <Navbar />
      <main style={{ position: 'relative', zIndex: 1 }}>
        <div className="mob-pad-page" style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 32px 60px' }}>

          <HeroSnapshot previewSlug={previewSlug} circuitFactsByRound={circuitFactsByRound} />

          <div className="mob-1col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <ChampionshipCard title="Drivers Championship" rows={driverRows} />
            <ChampionshipCard title="Constructors Championship" rows={constructorRows} />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <SeasonCalendarStrip tiles={calendarTiles} currentRound={currentRound} completedCount={completedCount} />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <QuickLinkCards />
          </div>

          <div className="mob-1col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <NewsCarouselCard articles={latestArticles} />
            <LatestVideosCard />
          </div>

        </div>
      </main>
      <Footer />
    </>
  )
}
