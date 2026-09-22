import CardHeader from '@/components/ui/CardHeader'
import { cardStyle } from './shared'

const KEY_TILES = [
  { value: '5', label: 'Drivers', acc: '#00A8FF' },
  { value: '2', label: 'Constructors', acc: '#FFB800' },
  { value: '1', label: '2x Boost Driver', acc: '#E8002D' },
  { value: '$100M', label: 'Budget', acc: '#00D47E' },
]

function KeyTile({ value, label, acc }: { value: string; label: string; acc: string }) {
  return (
    <div
      className="ff-key"
      style={{
        '--acc': acc,
        borderRadius: '14px', padding: '18px', border: '1px solid var(--border)', background: 'var(--surface)',
        transition: 'border-color .3s, background .3s',
      } as React.CSSProperties}
    >
      <b style={{ display: 'block', fontFamily: "'Bebas Neue', sans-serif", fontWeight: 400, fontSize: '44px', lineHeight: 1, color: acc }}>{value}</b>
      <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)' }}>{label}</span>
    </div>
  )
}

function SectionHeading({ label, color }: { label: string; color: string }) {
  return (
    <div style={{ margin: '26px 0 12px' }}>
      <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontWeight: 400, fontSize: '30px', lineHeight: 1, letterSpacing: '0.5px', color }}>{label}</span>
    </div>
  )
}

function pointColor(val: number): string {
  if (val > 0) return '#00D47E'
  if (val < 0) return '#E8002D'
  return 'var(--muted)'
}

function ScoringTable({ title, note, rows }: { title: string; note?: string; rows: [string, number][] }) {
  return (
    <div style={cardStyle}>
      <CardHeader title={title} />
      {note && <div style={{ fontSize: '12px', color: 'var(--muted)', padding: '10px 20px 0' }}>{note}</div>}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '360px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              <th style={{ padding: '10px 20px', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)', textAlign: 'left' }}>Category</th>
              <th style={{ padding: '10px 20px', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)', textAlign: 'right' }}>Points</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(([label, pts], i) => (
              <tr key={i} style={{ borderBottom: i < rows.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                <td style={{ padding: '10px 20px', fontSize: '13px', color: 'var(--text)' }}>{label}</td>
                <td style={{ padding: '10px 20px', fontSize: '13px', fontWeight: 600, fontFamily: "'JetBrains Mono', monospace", color: pointColor(pts), textAlign: 'right' }}>
                  {pts > 0 ? `+${pts}` : pts}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

const NOTES = [
  'Positions gained and lost are calculated based on the starting and finishing position of the driver in the race, not their qualifying result.',
  'Unclassified drivers will not have positions lost calculated and will instead receive the DNF penalty.',
  'Cars starting from the pit lane are considered to have started from a position relative to the last car on the grid.',
  'Overtakes are only valid when one driver legally passes another on track and the driver being passed was not entering the pit lane or suffering a car failure or going unreasonably slow.',
  'Driver of the Day is the result of the official F1 Driver of the Day award.',
  'DNF and Not Classified penalties apply to all drivers including those classed as inactive or not included in the final starting grid.',
  'The current world record pit stop time is 1.8 seconds, set by McLaren at the Qatar Grand Prix 2023.',
]

export default function HowToPlayTab() {
  return (
    <div>
      <style dangerouslySetInnerHTML={{ __html: `
        .ff-key:hover { border-color: color-mix(in srgb, var(--acc) 45%, transparent); background: radial-gradient(120% 100% at 0 0, color-mix(in srgb, var(--acc) 16%, var(--surface)), var(--surface) 70%); }
      ` }} />

      <p style={{ fontSize: '14px', color: 'var(--muted)', lineHeight: 1.6, marginBottom: '16px' }}>
        Each week you select 5 drivers and 2 constructors within a budget. Points are scored based on race performance across Qualifying, the Sprint (at sprint weekends) and the main Grand Prix.
      </p>

      <div className="mob-2col" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '12px', marginBottom: '8px' }}>
        {KEY_TILES.map(t => <KeyTile key={t.label} {...t} />)}
      </div>

      <SectionHeading label="Qualifying" color="#E8002D" />
      <div className="mob-1col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <ScoringTable title="Driver Scoring — Qualifying" rows={[
          ['Pole Position', 10], ['2nd Place', 9], ['3rd Place', 8], ['4th Place', 7], ['5th Place', 6],
          ['6th Place', 5], ['7th Place', 4], ['8th Place', 3], ['9th Place', 2], ['10th Place', 1],
          ['11th–20th Place', 0], ['NC / DSQ / No Time Set', -5],
        ]} />
        <ScoringTable title="Constructor Scoring — Qualifying" note="Constructors score the combined total of both drivers, plus the bonuses below." rows={[
          ['Neither driver reaches Q2', -1], ['One driver reaches Q2', 1], ['Both drivers reach Q2', 3],
          ['One driver reaches Q3', 5], ['Both drivers reach Q3', 10], ['Disqualified driver (per driver)', -5],
        ]} />
      </div>

      <SectionHeading label="Sprint" color="#FFB800" />
      <div className="mob-1col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <ScoringTable title="Driver Scoring — Sprint" rows={[
          ['Positions Gained (per position)', 1], ['Positions Lost (per position)', -1], ['Overtakes Made (per overtake)', 1],
          ['Fastest Lap', 5], ['1st Place', 8], ['2nd Place', 7], ['3rd Place', 6], ['4th Place', 5],
          ['5th Place', 4], ['6th Place', 3], ['7th Place', 2], ['8th Place', 1], ['9th–20th Place', 0],
          ['DNF / DSQ / Not Classified', -10],
        ]} />
        <ScoringTable title="Constructor Scoring — Sprint" note="Constructors score the combined total of both drivers, plus the penalty below." rows={[
          ['Disqualified driver (per driver)', -10],
        ]} />
      </div>

      <SectionHeading label="Race" color="#00D47E" />
      <div className="mob-1col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <ScoringTable title="Driver Scoring — Race" rows={[
          ['Positions Gained (per position)', 1], ['Positions Lost (per position)', -1], ['Overtakes Made (per overtake)', 1],
          ['Fastest Lap', 10], ['Driver of the Day (driver only)', 10], ['1st Place', 25], ['2nd Place', 18],
          ['3rd Place', 15], ['4th Place', 12], ['5th Place', 10], ['6th Place', 8], ['7th Place', 6],
          ['8th Place', 4], ['9th Place', 2], ['10th Place', 1], ['11th–20th Place', 0],
          ['DNF / DSQ / Not Classified', -20],
        ]} />
        <ScoringTable title="Constructor Scoring — Race" note="Constructors score the combined total of both drivers (excluding Driver of the Day), plus pit stop bonuses below." rows={[
          ['Pit Stop: Over 3.0 seconds', 0], ['Pit Stop: 2.50–2.99 seconds', 2], ['Pit Stop: 2.20–2.49 seconds', 5],
          ['Pit Stop: 2.00–2.19 seconds', 10], ['Pit Stop: Under 2.0 seconds', 20], ['Fastest Pit Stop Bonus', 5],
          ['New World Record Pit Stop Bonus', 15], ['Disqualified driver (per driver)', -20],
        ]} />
      </div>

      <SectionHeading label="Team Management" color="#00A8FF" />
      <div className="mob-1col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <ScoringTable title="Transfers" rows={[
          ['Exceeding free transfer allowance (per additional transfer)', -10],
        ]} />
        <div style={cardStyle}>
          <CardHeader title="Notes" />
          <ul style={{ margin: 0, padding: '16px 20px 20px 38px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {NOTES.map((note, i) => (
              <li key={i} style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.65 }}>{note}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
