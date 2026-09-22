import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import CalendarClient from './CalendarClient'
import type { CalendarRowData, CalendarSession } from '@/components/calendar/CalendarRow'
import type { CalendarTile } from '@/components/home/SeasonCalendarStrip'
import { SEASON_CALENDAR, CURRENT_RACE } from '@/lib/races'
import { RACE_WEEKENDS } from '@/lib/raceResults'
import { DRIVER_STANDINGS } from '@/lib/standings'

export const metadata: Metadata = {
  title: '2026 F1 Racing Calendar — Session Times & Schedule',
  description: 'Full 2026 Formula 1 race calendar with session times, sprint weekends, and circuit information. All 23 rounds of the 2026 F1 season.',
  alternates: { canonical: 'https://formulahub.live/calendar' },
  openGraph: {
    title: '2026 F1 Racing Calendar — Session Times & Schedule',
    description: 'Full 2026 Formula 1 race calendar with session times, sprint weekends, and circuit information. All 23 rounds of the 2026 F1 season.',
    url: 'https://formulahub.live/calendar',
    siteName: 'Formula Hub',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@F_FantasyHub',
    creator: '@F_FantasyHub',
    description: 'Full 2026 Formula 1 race calendar with session times, sprint weekends, and circuit information. All 23 rounds of the 2026 F1 season.',
  },
}

const SHORT: Record<string, string> = {
  'Practice 1': 'FP1', 'Practice 2': 'FP2', 'Practice 3': 'FP3',
  'Sprint Qualifying': 'SQ', 'Sprint': 'SPR', 'Qualifying': 'QUAL', 'Race': 'RACE',
}

function buildSessions(raw: { name: string; date: string; duration: number }[] | undefined): CalendarSession[] {
  if (!raw) return []
  return raw.map(s => ({ name: s.name, short: SHORT[s.name] ?? s.name, isoDate: s.date }))
}

function buildRows(): CalendarRowData[] {
  return SEASON_CALENDAR.map(r => {
    const winnerResult = !r.calledOff && r.completed ? RACE_WEEKENDS[r.round]?.race?.[0] : undefined
    const winner = winnerResult
      ? {
          name: winnerResult.name,
          team: winnerResult.team,
          teamColor: winnerResult.team_colour,
          flag: DRIVER_STANDINGS.find(d => d.name === winnerResult.name)?.flag ?? '',
        }
      : null

    return {
      round: r.round,
      name: r.name,
      flag: r.flag,
      circuit: r.circuit,
      dateRange: r.dateRange || r.date,
      sprint: r.sprint,
      completed: r.completed,
      calledOff: r.calledOff,
      timezone: r.timezone,
      sessions: buildSessions(r.sessions),
      winner,
    }
  })
}

function buildTiles(): CalendarTile[] {
  return SEASON_CALENDAR.map(r => ({
    round: r.round,
    flag: r.flag,
    date: r.date,
    completed: r.completed,
    calledOff: r.calledOff,
    sprint: r.sprint,
  }))
}

export default function CalendarPage() {
  const rows = buildRows()
  const tiles = buildTiles()
  const completedCount = SEASON_CALENDAR.filter(r => r.completed && !r.calledOff).length

  return (
    <>
      <Navbar />
      <div className="mob-pad" style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>
        <div style={{ marginBottom: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '2px', color: '#00D47E', textTransform: 'uppercase' }}>2026 Season</span>
          </div>
          <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(2.5rem,5vw,3.5rem)', lineHeight: 1, marginBottom: '8px' }}>Race Calendar</div>
          <p style={{ color: 'var(--muted)', fontSize: '14px', maxWidth: '600px', lineHeight: 1.6, margin: 0 }}>
            All 23 rounds of the 2026 Formula 1 season — session times, sprint weekends, and circuit details in one place.
          </p>
        </div>
        <CalendarClient rows={rows} tiles={tiles} currentRound={CURRENT_RACE.round} completedCount={completedCount} />
      </div>
      <Footer />
    </>
  )
}
