// Reuses the Home page's 23-tile season strip + legend (now exported as
// SeasonTileGrid / SeasonTileLegend), under the "Season Progress" title with
// no self-referential Calendar link — we're already on that page.
import { cardStyle, monoFont } from '@/components/home/shared'
import { SeasonTileGrid, SeasonTileLegend, type CalendarTile } from '@/components/home/SeasonCalendarStrip'
import CardHeader from '@/components/ui/CardHeader'

export default function SeasonProgressCard({ tiles, currentRound, completedCount }: { tiles: CalendarTile[]; currentRound: number; completedCount: number }) {
  return (
    <div style={cardStyle}>
      <CardHeader
        title="Season Progress"
        right={<span style={{ fontFamily: monoFont, color: 'var(--muted)', fontSize: '12px' }}>{completedCount} of 23 complete</span>}
      />
      <div style={{ padding: '18px 20px' }}>
        <SeasonTileGrid tiles={tiles} currentRound={currentRound} />
        <SeasonTileLegend />
      </div>
    </div>
  )
}
