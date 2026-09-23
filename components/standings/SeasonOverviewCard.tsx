import CardHeader from '@/components/ui/CardHeader'
import Flag from '@/components/ui/Flag'
import { monoFont } from '@/components/home/shared'
import { cardStyle } from './shared'
import type { OverviewTile } from './data'

function Tile({ tile }: { tile: OverviewTile }) {
  return (
    <div style={{
      background: `linear-gradient(135deg, color-mix(in srgb, ${tile.teamColor} 22%, var(--surface2)), var(--surface2) 70%)`,
      borderRadius: '12px', padding: '16px', position: 'relative', overflow: 'hidden',
    }}>
      <span style={{ display: 'block', fontSize: '11px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--muted)', marginBottom: '8px' }}>{tile.label}</span>
      <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '26px', lineHeight: 1, display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text)' }}>
        {tile.flag && <Flag code={tile.flag} size={18} />}
        {tile.name}
      </div>
      <div style={{ fontFamily: monoFont, fontWeight: 700, fontSize: '13px', marginTop: '6px', color: tile.teamColor }}>{tile.value}</div>
    </div>
  )
}

export default function SeasonOverviewCard({
  driversLeader, constructorsLeader, mostWins, mostPoles, mostPodiums,
  completedCount, differentWinners,
}: {
  driversLeader: OverviewTile
  constructorsLeader: OverviewTile
  mostWins: OverviewTile
  mostPoles: OverviewTile
  mostPodiums: OverviewTile
  completedCount: number
  differentWinners: { name: string; flag: string }[]
}) {
  return (
    <div style={cardStyle}>
      <CardHeader
        title="Season Overview"
        right={<span style={{ fontSize: '11px', fontWeight: 700, padding: '4px 10px', borderRadius: '6px', color: '#00D47E', background: 'rgba(0,212,126,0.12)' }}>{completedCount} Races</span>}
      />
      <div style={{ padding: '18px 20px' }}>
        <div className="mob-2col" style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: '12px' }}>
          <Tile tile={driversLeader} />
          <Tile tile={constructorsLeader} />
          <Tile tile={mostWins} />
          <Tile tile={mostPoles} />
          <Tile tile={mostPodiums} />
        </div>

        <div className="mob-1col" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '12px', marginTop: '12px' }}>
          <div style={{ background: 'var(--surface2)', borderRadius: '12px', padding: '16px' }}>
            <span style={{ display: 'block', fontSize: '11px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--muted)', marginBottom: '8px' }}>Races Completed</span>
            <div>
              <b style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '44px', lineHeight: 1, color: '#E8002D' }}>{completedCount}</b>
              {' '}<span style={{ color: 'var(--muted)', fontFamily: monoFont }}>of 23</span>
            </div>
          </div>
          <div style={{ background: 'var(--surface2)', borderRadius: '12px', padding: '16px' }}>
            <span style={{ display: 'block', fontSize: '11px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--muted)', marginBottom: '8px' }}>Different Winners</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
              <b style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '44px', lineHeight: 1, color: '#FFD700' }}>{differentWinners.length}</b>
              {differentWinners.map(w => (
                <span key={w.name} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px', background: 'var(--surface3)', padding: '4px 10px', borderRadius: '20px' }}>
                  {w.flag && <Flag code={w.flag} size={14} />}
                  {w.name.split(' ').slice(-1)[0]}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
