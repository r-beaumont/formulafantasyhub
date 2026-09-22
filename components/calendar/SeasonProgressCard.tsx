// Reuses the Home page's 23-tile season strip + legend rendering (same
// grid/legend markup as components/home/SeasonCalendarStrip.tsx), but under
// the "Season Progress" title with no self-referential Calendar link — we're
// already on that page. SeasonCalendarStrip itself isn't in this task's
// allowed-edit list and doesn't export the grid as a separate piece, so the
// tile/legend JSX is duplicated here rather than editing that file.
import Link from 'next/link'
import { cardStyle, monoFont } from '@/components/home/shared'
import CardHeader from '@/components/ui/CardHeader'
import type { CalendarTile } from '@/components/home/SeasonCalendarStrip'

export default function SeasonProgressCard({ tiles, currentRound, completedCount }: { tiles: CalendarTile[]; currentRound: number; completedCount: number }) {
  return (
    <div style={cardStyle}>
      <CardHeader
        title="Season Progress"
        right={<span style={{ fontFamily: monoFont, color: 'var(--muted)', fontSize: '12px' }}>{completedCount} of 23 complete</span>}
      />
      <div style={{ padding: '18px 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(23,minmax(44px,1fr))', gap: '6px', overflowX: 'auto', paddingBottom: '4px' }}>
          {tiles.map(t => (
            <Link
              key={t.round}
              href={`/race-hub?round=${t.round}`}
              style={{
                position: 'relative', textDecoration: 'none', color: 'inherit',
                borderRadius: '8px', padding: '9px 4px 6px', textAlign: 'center',
                border: t.round === currentRound ? '1px solid #E8002D' : '1px solid rgba(255,255,255,0.08)',
                background: t.round === currentRound ? 'rgba(232,0,45,0.12)' : (t.completed && !t.calledOff ? 'var(--surface2)' : 'var(--surface3)'),
                boxShadow: t.sprint ? 'inset 0 -2px 0 #00A8FF' : 'none',
                opacity: t.calledOff ? 0.4 : 1,
              }}
            >
              <span style={{ display: 'block', fontFamily: monoFont, fontSize: '10px', color: 'var(--muted)' }}>{t.round}</span>
              {t.completed && !t.calledOff && <span style={{ position: 'absolute', top: '6px', right: '6px', color: '#00D47E', fontSize: '10px' }}>✓</span>}
              <span className={`fi fi-${t.flag}`} style={{ width: '1.4em', height: '1em', borderRadius: '3px', display: 'block', margin: '4px auto' }} />
              <div style={{ fontSize: '10px', color: 'var(--muted)' }}>{t.date}</div>
            </Link>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginTop: '12px', fontSize: '11px', color: 'var(--muted)' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><i style={{ width: '11px', height: '11px', borderRadius: '3px', display: 'inline-block', background: 'rgba(0,212,126,.15)', border: '1px solid rgba(0,212,126,.3)' }} />Completed</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><i style={{ width: '11px', height: '11px', borderRadius: '3px', display: 'inline-block', background: 'var(--surface3)', boxShadow: 'inset 0 -2px 0 #00A8FF' }} />Sprint weekend</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><i style={{ width: '11px', height: '11px', borderRadius: '3px', display: 'inline-block', background: 'rgba(232,0,45,.15)', border: '1px solid #E8002D' }} />Current round</span>
          <span style={{ color: 'var(--muted2)' }}>Click a flag to open that round in Race Hub</span>
        </div>
      </div>
    </div>
  )
}
