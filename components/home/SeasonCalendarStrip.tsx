import Link from 'next/link'
import { cardStyle, cardHeaderStyle, cardTitleStyle, cardLinkStyle, monoFont, Flag } from './shared'

export interface CalendarTile {
  round: number
  flag: string
  date: string
  completed: boolean
  calledOff: boolean
  sprint: boolean
}

// Exported so Calendar's SeasonProgressCard and the Standings page can reuse
// the exact same 23-tile grid instead of duplicating it.
export function SeasonTileGrid({ tiles, currentRound }: { tiles: CalendarTile[]; currentRound: number }) {
  return (
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
          <span style={{ display: 'flex', justifyContent: 'center', margin: '4px auto' }}><Flag code={t.flag} size={22} /></span>
          <div style={{ fontSize: '10px', color: 'var(--muted)' }}>{t.date}</div>
        </Link>
      ))}
    </div>
  )
}

export function SeasonTileLegend() {
  return (
    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginTop: '12px', fontSize: '11px', color: 'var(--muted)' }}>
      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><i style={{ width: '11px', height: '11px', borderRadius: '3px', display: 'inline-block', background: 'rgba(0,212,126,.15)', border: '1px solid rgba(0,212,126,.3)' }} />Completed</span>
      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><i style={{ width: '11px', height: '11px', borderRadius: '3px', display: 'inline-block', background: 'var(--surface3)', boxShadow: 'inset 0 -2px 0 #00A8FF' }} />Sprint weekend</span>
      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><i style={{ width: '11px', height: '11px', borderRadius: '3px', display: 'inline-block', background: 'rgba(232,0,45,.15)', border: '1px solid #E8002D' }} />Current round</span>
      <span style={{ color: 'var(--muted2)' }}>Click a flag to open that round in Race Hub</span>
    </div>
  )
}

export default function SeasonCalendarStrip({ tiles, currentRound, completedCount }: { tiles: CalendarTile[]; currentRound: number; completedCount: number }) {
  return (
    <div style={cardStyle}>
      <div style={cardHeaderStyle}>
        <span style={cardTitleStyle}>2026 Season</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontFamily: monoFont, color: 'var(--muted)', fontSize: '12px' }}>{completedCount} of 23 complete</span>
          <Link href="/calendar" style={cardLinkStyle}>Calendar →</Link>
        </div>
      </div>
      <div style={{ padding: '18px 20px' }}>
        <SeasonTileGrid tiles={tiles} currentRound={currentRound} />
        <SeasonTileLegend />
      </div>
    </div>
  )
}
