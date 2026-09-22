import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import CardHeader from '@/components/ui/CardHeader'
import { SeasonTileGrid, SeasonTileLegend } from '@/components/home/SeasonCalendarStrip'
import { cardStyle } from '@/components/standings/shared'
import SeasonOverviewCard from '@/components/standings/SeasonOverviewCard'
import StandingsTable, { type NormalizedStandingsRow } from '@/components/standings/StandingsTable'
import PointsPerRaceCard from '@/components/standings/PointsPerRaceCard'
import { buildStandingsData } from '@/components/standings/data'
import { teamRowStyleTag } from '@/components/standings/shared'

export const metadata: Metadata = {
  title: 'F1 Championship Standings 2026 — Drivers & Constructors | Formula Hub',
  description: 'Up-to-date F1 driver and constructor championship standings for the 2026 Formula 1 season. Points, wins, podiums and more.',
  alternates: { canonical: 'https://formulahub.live/standings' },
  openGraph: {
    title: 'F1 Championship Standings 2026 — Drivers & Constructors',
    description: 'Up-to-date F1 driver and constructor championship standings for the 2026 Formula 1 season.',
    url: 'https://formulahub.live/standings',
    siteName: 'Formula Hub',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@F_FantasyHub',
    creator: '@F_FantasyHub',
    description: 'Up-to-date F1 driver and constructor championship standings for the 2026 Formula 1 season.',
  },
}

export default function StandingsPage() {
  const d = buildStandingsData()

  const driverRows: NormalizedStandingsRow[] = d.driverRows.map(r => ({
    pos: r.pos, name: r.name, secondary: r.team, color: r.teamColor, flag: r.flag,
    points: r.points, wins: r.wins, podiums: r.podiums, poles: r.poles,
  }))
  const constructorRows: NormalizedStandingsRow[] = d.constructorRows.map(r => ({
    pos: r.pos, name: r.name, secondary: r.engine, color: r.color, flag: r.flag,
    points: r.points, wins: r.wins, podiums: r.podiums, poles: r.poles,
  }))

  return (
    <>
      <Navbar />
      <main style={{ position: 'relative', zIndex: 1 }}>
        <style dangerouslySetInnerHTML={{ __html: teamRowStyleTag }} />
        <div className="mob-pad-page" style={{ maxWidth: '1400px', margin: '0 auto', padding: '28px 32px 60px' }}>

          {/* Header */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <div style={{ width: '3px', height: '24px', background: '#00A8FF', borderRadius: '2px' }} />
              <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '2px', color: '#00A8FF', textTransform: 'uppercase' }}>2026 Season</span>
            </div>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(2.5rem,5vw,3.5rem)', lineHeight: 1, marginBottom: '8px' }}>F1 Championship Standings 2026</div>
            <p style={{ color: 'var(--muted)', fontSize: '14px', maxWidth: '640px', lineHeight: 1.6 }}>
              Live data — updates after each race · After R{d.lastCompletedRound} {d.lastCompletedRaceName}
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <SeasonOverviewCard
              driversLeader={d.overview.driversLeader}
              constructorsLeader={d.overview.constructorsLeader}
              mostWins={d.overview.mostWins}
              mostPoles={d.overview.mostPoles}
              mostPodiums={d.overview.mostPodiums}
              completedCount={d.completedCount}
              differentWinners={d.differentWinners}
            />

            <StandingsTable title="Driver Championship Standings — 2026" rows={driverRows} primaryLabel="Driver" secondaryLabel="Team" />
            <StandingsTable title="Constructor Championship Standings — 2026" rows={constructorRows} primaryLabel="Constructor" secondaryLabel="Engine" />

            <div style={cardStyle}>
              <CardHeader title="2026 Race Calendar · 23 Rounds" />
              <div style={{ padding: '18px 20px' }}>
                <SeasonTileGrid tiles={d.calendarTiles} currentRound={d.currentRound} />
                <SeasonTileLegend />
              </div>
            </div>

            <PointsPerRaceCard
              driverPpr={d.driverPpr}
              constructorPpr={d.constructorPpr}
              rounds={d.pprRounds}
              driverPodiumsByRound={d.driverPodiumsByRound}
              constructorPodiumsByRound={d.constructorPodiumsByRound}
            />
          </div>

        </div>
      </main>
      <Footer />
    </>
  )
}
