import { pitwallData } from '@/lib/circuitOverview'
import { cardStyle, cardHeaderStyle, Flag, monoFont } from '@/components/home/shared'
import { rhCardTitleStyle } from './shared'

const downforceBars = [
  { label: 'Low', level: 1 },
  { label: 'Med / Low', level: 2 },
  { label: 'Medium', level: 3 },
  { label: 'Med / High', level: 4 },
  { label: 'High', level: 5 },
]

export default function PitwallTab({ round, raceName, flag, completed }: { round: number; raceName: string; flag: string; completed: boolean }) {
  // Madrid — circuit debut, no historical data exists at all.
  if (round === 14) {
    return (
      <div style={{ ...cardStyle, padding: '40px', textAlign: 'center' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏙️</div>
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '28px', letterSpacing: '1px', color: 'var(--text)', marginBottom: '8px' }}>Circuit Debut</div>
        <div style={{ fontSize: '14px', color: 'var(--muted)', maxWidth: '480px', margin: '0 auto', lineHeight: 1.7 }}>
          The Madring Street Circuit makes its Formula 1 debut in 2026. No historical pitwall data exists for this venue — tyre compound selection and race strategy information will be added once Pirelli confirm their allocation closer to the race weekend.
        </div>
      </div>
    )
  }

  const data = pitwallData[round]
  if (!data) {
    return (
      <div style={{ ...cardStyle, padding: '40px', textAlign: 'center' }}>
        <div style={{ fontSize: '32px', marginBottom: '12px' }}>🏗️</div>
        <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)', marginBottom: '8px' }}>Pitwall data coming soon</div>
        <div style={{ fontSize: '13px', color: 'var(--muted)' }}>Tyre compound and strategy data for {raceName} will be added closer to race weekend.</div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {!completed && (
        <div style={{ background: 'rgba(255,184,0,0.1)', border: '1px solid rgba(255,184,0,0.3)', borderRadius: '10px', padding: '14px 18px', fontSize: '13px', color: '#FFB800', lineHeight: 1.6 }}>
          <b>Based on 2025 season data.</b> Tyre compounds and strategy data for 2026 will be updated once confirmed by Pirelli closer to each race weekend.
        </div>
      )}

      {/* Downforce */}
      <div style={cardStyle}>
        <div style={cardHeaderStyle}><span style={rhCardTitleStyle}>Aerodynamic Setup — Downforce Level</span></div>
        <div style={{ padding: '20px 24px' }}>
          <div style={{ display: 'flex', gap: '6px', alignItems: 'flex-end', height: '80px', margin: '8px 0 14px' }}>
            {downforceBars.map(bar => (
              <div key={bar.level} style={{ flex: 1, textAlign: 'center' }}>
                <div style={{
                  height: `${16 + (bar.level - 1) * 14}px`, borderRadius: '6px 6px 3px 3px',
                  background: bar.level === data.downforceLevel ? 'linear-gradient(180deg,#E8002D,rgba(232,0,45,.4))' : 'var(--surface3)',
                }} />
                <span style={{ fontSize: '9px', color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase', display: 'block', marginTop: '5px', letterSpacing: '0.4px' }}>{bar.label}</span>
              </div>
            ))}
          </div>
          <b style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '24px', color: '#E8002D', display: 'block' }}>{data.downforce}</b>
          <p style={{ fontSize: '13px', color: '#8A9AB0', lineHeight: 1.7, marginTop: '6px' }}>{data.downforceNote}</p>
        </div>
      </div>

      {/* Tyre Compounds */}
      <div style={cardStyle}>
        <div style={cardHeaderStyle}>
          <span style={{ ...rhCardTitleStyle, display: 'flex', alignItems: 'center', gap: '8px' }}>Tyre Compounds — <Flag code={flag} size={14} /> {raceName} GP</span>
        </div>
        <div className="mob-1col" style={{ padding: '16px 24px 20px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
          {data.compounds.map(c => (
            <div key={c.name} style={{ background: 'var(--surface2)', borderRadius: '12px', padding: '18px', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--surface)', border: `3px solid ${c.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ fontFamily: monoFont, fontSize: '10px', fontWeight: 700, color: c.color }}>{c.code}</span>
                </div>
                <div>
                  <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '18px', letterSpacing: '1px', color: c.color }}>{c.name}</div>
                  <div style={{ fontSize: '10px', fontWeight: 600, color: 'var(--muted2)', textTransform: 'uppercase', letterSpacing: '1px' }}>Compound {c.code}</div>
                </div>
              </div>
              <p style={{ fontSize: '12px', color: '#8A9AB0', lineHeight: 1.6, margin: 0 }}>{c.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Strategies */}
      <div style={cardStyle}>
        <div style={cardHeaderStyle}><span style={rhCardTitleStyle}>Expected Race Strategies</span></div>
        <div style={{ padding: '16px 24px 20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {data.strategies.map((s, i) => (
            <div key={i} style={{ background: 'var(--surface2)', borderRadius: '12px', padding: '18px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <span style={{ fontFamily: monoFont, fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '4px', background: s.stops === 1 ? 'rgba(0,212,126,0.12)' : 'rgba(255,184,0,0.12)', color: s.stops === 1 ? '#00D47E' : '#FFB800' }}>
                  {s.stops}-Stop
                </span>
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)' }}>{s.name}</span>
              </div>
              <div style={{ display: 'flex', gap: '6px', marginBottom: '12px', flexWrap: 'wrap' }}>
                {s.laps.map((stint, j) => {
                  const isPit = stint.startsWith('Pit')
                  const tyreColor = stint.includes('Hard') ? '#FFFFFF' : stint.includes('Medium') ? '#FFD700' : stint.includes('Soft') ? '#E8002D' : 'var(--muted)'
                  return (
                    <div key={j} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      {isPit ? (
                        <span style={{ fontSize: '10px', fontWeight: 700, padding: '3px 8px', borderRadius: '4px', background: 'rgba(0,168,255,0.12)', color: '#00A8FF' }}>{stint}</span>
                      ) : (
                        <span style={{ fontSize: '11px', fontWeight: 600, padding: '3px 10px', borderRadius: '4px', background: `${tyreColor}18`, color: tyreColor, border: `1px solid ${tyreColor}30` }}>{stint}</span>
                      )}
                      {j < s.laps.length - 1 && !isPit && <span style={{ color: 'var(--muted2)', fontSize: '10px' }}>→</span>}
                    </div>
                  )
                })}
              </div>
              <p style={{ fontSize: '12px', color: '#8A9AB0', lineHeight: 1.6, margin: 0 }}>💡 {s.note}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
