import Link from 'next/link'
import { cardStyle, cardHeaderStyle, cardTitleStyle, cardLinkStyle, monoFont, Flag } from './shared'

export interface StandingRow {
  pos: number
  name: string
  sub: string
  flag: string
  teamColor: string
  points: number
  gapLabel: string
}

function posColor(pos: number) {
  if (pos === 1) return '#FFD700'
  if (pos === 2) return '#C0C0C0'
  if (pos === 3) return '#CD7F32'
  return 'var(--muted)'
}

export default function ChampionshipCard({ title, rows }: { title: string; rows: StandingRow[] }) {
  return (
    <div style={cardStyle}>
      <style dangerouslySetInnerHTML={{ __html: `
        .champ-row { background: linear-gradient(90deg, color-mix(in srgb, var(--tc) 10%, transparent), transparent 45%); transition: background .25s; }
        .champ-row:hover { background: linear-gradient(90deg, color-mix(in srgb, var(--tc) 26%, transparent), transparent 70%); }
        .champ-row:hover .champ-tl { box-shadow: 0 0 10px var(--tc); }
        .champ-row:hover .champ-flag { transform: scale(1.14); }
      ` }} />
      <div style={cardHeaderStyle}>
        <span style={cardTitleStyle}>{title}</span>
        <Link href="/standings" style={cardLinkStyle}>Full standings →</Link>
      </div>
      <div style={{ padding: '6px 20px 8px' }}>
        {rows.map((r, i) => (
          <Link
            key={r.pos}
            href="/standings"
            className="champ-row"
            style={{
              '--tc': r.teamColor,
              display: 'grid', gridTemplateColumns: '24px 3px 20px 1fr auto', gap: '10px', alignItems: 'center',
              padding: '9px 10px', margin: '0 -10px', borderRadius: '10px',
              borderBottom: i < rows.length - 1 ? '1px solid var(--border)' : 'none',
              textDecoration: 'none', color: 'inherit',
            } as React.CSSProperties}
          >
            <span style={{ fontFamily: monoFont, fontWeight: 600, fontSize: '12px', color: posColor(r.pos), textAlign: 'center' }}>{r.pos}</span>
            <i className="champ-tl" style={{ width: '3px', height: '22px', borderRadius: '2px', flexShrink: 0, background: r.teamColor, transition: 'box-shadow .25s' }} />
            <span className="champ-flag" style={{ display: 'inline-flex' }}><Flag code={r.flag} size={14} /></span>
            <span style={{ fontWeight: 600, fontSize: '13px', lineHeight: 1.2 }}>
              {r.name}
              <small style={{ display: 'block', fontWeight: 400, fontSize: '11px', color: 'var(--muted)' }}>{r.sub}</small>
            </span>
            <span style={{ fontFamily: monoFont, fontWeight: 700, fontSize: '15px', textAlign: 'right' }}>
              {r.points}
              <span style={{ display: 'block', fontFamily: monoFont, fontWeight: 400, fontSize: '10px', color: 'var(--muted)' }}>{r.gapLabel}</span>
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}
