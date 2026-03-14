import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const s = {
  page: {
    position: 'relative' as const, zIndex: 1,
    maxWidth: '1400px', margin: '0 auto', padding: '28px 32px 60px',
  },
  card: {
    background: '#0E1318',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: '14px', overflow: 'hidden' as const,
  },
  cardHeader: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '16px 20px 12px', borderBottom: '1px solid rgba(255,255,255,0.07)',
  },
  cardTitle: {
    fontSize: '12px', fontWeight: 600, textTransform: 'uppercase' as const,
    letterSpacing: '1.5px', color: '#5A6A7A',
  },
  cardBody: { padding: '16px 20px' },
}

const Badge = ({ type, label }: { type: string; label: string }) => {
  const styles: Record<string, { bg: string; color: string }> = {
    live: { bg: 'rgba(232,0,45,0.15)', color: '#E8002D' },
    race: { bg: 'rgba(255,184,0,0.12)', color: '#FFB800' },
    new: { bg: 'rgba(0,212,126,0.12)', color: '#00D47E' },
    blue: { bg: 'rgba(0,168,255,0.12)', color: '#00A8FF' },
    premium: { bg: 'rgba(255,184,0,0.12)', color: '#FFB800' },
  }
  const st = styles[type] || styles.live
  return (
    <span style={{
      fontSize: '10px', fontWeight: 600, padding: '3px 8px',
      borderRadius: '4px', letterSpacing: '0.5px', textTransform: 'uppercase' as const,
      background: st.bg, color: st.color,
    }}>{label}</span>
  )
}

const TeamDot = ({ color }: { color: string }) => (
  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: color, flexShrink: 0 }} />
)

export default function Home() {
  return (
    <>
      <Navbar />
      <div style={s.page}>

        {/* HERO */}
        <div style={{
          ...s.card,
          padding: '28px 32px', marginBottom: '24px',
          display: 'grid', gridTemplateColumns: '1fr auto',
          alignItems: 'center', gap: '24px',
          position: 'relative' as const,
        }}>
          <div style={{
            position: 'absolute' as const, left: 0, top: 0, bottom: 0,
            width: '4px', background: '#E8002D', borderRadius: '2px 0 0 2px',
          }} />
          <div>
            <div style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '2px', color: '#E8002D', textTransform: 'uppercase' as const, marginBottom: '6px' }}>
              🏁 Race Weekend Active
            </div>
            <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '36px', letterSpacing: '1px', lineHeight: 1, marginBottom: '6px' }}>
              Chinese Grand Prix 2026
            </div>
            <div style={{ fontSize: '13px', color: '#5A6A7A' }}>
              Sprint weekend · <strong style={{ color: '#F0F4F8' }}>Deadline Saturday 03:00 UTC</strong> &nbsp;·&nbsp; Round 2 of 24 &nbsp;·&nbsp; 🇨🇳 Shanghai
            </div>
          </div>
          {/* Countdown */}
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            {[['01', 'Days'], ['08', 'Hrs'], ['24', 'Min']].map(([num, label], i) => (
              <>
                <div key={label} style={{
                  textAlign: 'center' as const, background: '#141B22',
                  border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: '10px', padding: '10px 16px', minWidth: '60px',
                }}>
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '26px', fontWeight: 600, lineHeight: 1, color: '#E8002D' }}>{num}</div>
                  <div style={{ fontSize: '10px', color: '#5A6A7A', textTransform: 'uppercase' as const, letterSpacing: '1px', marginTop: '3px' }}>{label}</div>
                </div>
                {i < 2 && <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '22px', color: '#3A4A5A', marginBottom: '12px' }}>:</span>}
              </>
            ))}
          </div>
        </div>

        {/* STANDINGS STRIP */}
        <div style={{
          display: 'flex', background: '#0E1318',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: '12px', overflow: 'hidden', marginBottom: '24px',
        }}>
          {[
            { pos: '1', posStyle: { color: '#FFD700' }, barColor: '#3671C6', driver: 'M. Verstappen', team: 'Red Bull Racing', pts: '87' },
            { pos: '2', posStyle: { color: '#C0C0C0' }, barColor: '#FF8000', driver: 'L. Norris', team: 'McLaren', pts: '74' },
            { pos: '3', posStyle: { color: '#CD7F32' }, barColor: '#FF8000', driver: 'O. Piastri', team: 'McLaren', pts: '61' },
            { pos: '4', posStyle: { color: '#3A4A5A' }, barColor: '#E8002D', driver: 'C. Leclerc', team: 'Ferrari', pts: '52' },
            { pos: '5', posStyle: { color: '#3A4A5A' }, barColor: '#E8002D', driver: 'C. Sainz', team: 'Ferrari', pts: '48' },
          ].map((item, i) => (
            <div key={item.driver} style={{
              flex: 1, padding: '14px 18px',
              borderRight: i < 4 ? '1px solid rgba(255,255,255,0.07)' : 'none',
              display: 'flex', alignItems: 'center', gap: '12px',
            }}>
              <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '28px', lineHeight: 1, width: '28px', ...item.posStyle }}>{item.pos}</div>
              <div style={{ width: '3px', height: '32px', borderRadius: '2px', background: item.barColor, flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600 }}>{item.driver}</div>
                <div style={{ fontSize: '11px', color: '#5A6A7A' }}>{item.team}</div>
              </div>
              <div style={{ marginLeft: 'auto', fontFamily: 'JetBrains Mono, monospace', fontSize: '15px', fontWeight: 600, color: '#FFB800' }}>{item.pts}</div>
            </div>
          ))}
        </div>

        {/* MAIN GRID */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '20px' }}>

          {/* Price Changes */}
          <div style={s.card}>
            <div style={s.cardHeader}>
              <span style={s.cardTitle}>Price Changes</span>
              <Badge type="live" label="LIVE" />
            </div>
            <div style={{ padding: '14px 20px' }}>
              <div style={{ fontSize: '10px', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '1.5px', color: '#00D47E', marginBottom: '10px' }}>▲ Rising</div>
              {[
                { color: '#FF8000', name: 'L. Norris', team: 'McLaren', change: '+0.2 → $29.0M' },
                { color: '#3671C6', name: 'M. Verstappen', team: 'Red Bull', change: '+0.1 → $30.5M' },
                { color: '#27F4D2', name: 'G. Russell', team: 'Mercedes', change: '+0.1 → $22.0M' },
              ].map((d) => (
                <div key={d.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid rgba(255,255,255,0.03)', fontSize: '13px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <TeamDot color={d.color} />
                    <div>
                      <div style={{ fontWeight: 500 }}>{d.name}</div>
                      <div style={{ fontSize: '11px', color: '#5A6A7A' }}>{d.team}</div>
                    </div>
                  </div>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', fontWeight: 600, color: '#00D47E' }}>{d.change}</span>
                </div>
              ))}
            </div>
            <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.07)' }} />
            <div style={{ padding: '14px 20px' }}>
              <div style={{ fontSize: '10px', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '1.5px', color: '#E8002D', marginBottom: '10px' }}>▼ Falling</div>
              {[
                { color: '#B6BABD', name: 'V. Bottas', team: 'Kick Sauber', change: '-0.1 → $8.0M' },
                { color: '#005AFF', name: 'F. Alonso', team: 'Aston Martin', change: '-0.2 → $19.5M' },
              ].map((d) => (
                <div key={d.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid rgba(255,255,255,0.03)', fontSize: '13px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <TeamDot color={d.color} />
                    <div>
                      <div style={{ fontWeight: 500 }}>{d.name}</div>
                      <div style={{ fontSize: '11px', color: '#5A6A7A' }}>{d.team}</div>
                    </div>
                  </div>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', fontWeight: 600, color: '#E8002D' }}>{d.change}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Race Projections */}
          <div style={s.card}>
            <div style={s.cardHeader}>
              <span style={s.cardTitle}>Race Projections</span>
              <Badge type="race" label="China" />
            </div>
            <div style={s.cardBody}>
              {[
                { rank: '1', rankColor: '#FFD700', color: '#3671C6', name: 'M. Verstappen', team: 'Red Bull', pct: 100, pts: 68 },
                { rank: '2', rankColor: '#C0C0C0', color: '#FF8000', name: 'L. Norris', team: 'McLaren', pct: 88, pts: 61 },
                { rank: '3', rankColor: '#CD7F32', color: '#E8002D', name: 'C. Leclerc', team: 'Ferrari', pct: 75, pts: 52 },
                { rank: '4', rankColor: '#5A6A7A', color: '#FF8000', name: 'O. Piastri', team: 'McLaren', pct: 68, pts: 47 },
                { rank: '5', rankColor: '#5A6A7A', color: '#27F4D2', name: 'G. Russell', team: 'Mercedes', pct: 55, pts: 38 },
                { rank: '6', rankColor: '#5A6A7A', color: '#E8002D', name: 'C. Sainz', team: 'Ferrari', pct: 48, pts: 34 },
              ].map((d) => (
                <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '9px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: d.rankColor, width: '18px', textAlign: 'center' as const }}>{d.rank}</span>
                  <TeamDot color={d.color} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '13px', fontWeight: 500 }}>{d.name}</div>
                    <div style={{ fontSize: '11px', color: '#5A6A7A' }}>{d.team}</div>
                  </div>
                  <div style={{ width: '60px', height: '4px', background: '#1C2630', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ width: `${d.pct}%`, height: '100%', background: 'linear-gradient(90deg, #FFB800, rgba(255,184,0,0.4))', borderRadius: '2px' }} />
                  </div>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '14px', fontWeight: 600, color: '#FFB800' }}>{d.pts}</span>
                </div>
              ))}
            </div>
          </div>

          {/* DRS Boost Picks */}
          <div style={s.card}>
            <div style={s.cardHeader}>
              <span style={s.cardTitle}>Top DRS Boost Picks</span>
              <Badge type="blue" label="Top 10K" />
            </div>
            <div style={s.cardBody}>
              <div style={{ fontSize: '11px', color: '#5A6A7A', marginBottom: '12px' }}>Most popular 2× DRS boost among top 10,000 managers</div>
              {[
                { color: '#3671C6', name: 'M. Verstappen', pct: 78 },
                { color: '#FF8000', name: 'L. Norris', pct: 62 },
                { color: '#E8002D', name: 'C. Leclerc', pct: 34 },
                { color: '#FF8000', name: 'O. Piastri', pct: 18 },
                { color: '#27F4D2', name: 'G. Russell', pct: 8 },
              ].map((d) => (
                <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <TeamDot color={d.color} />
                  <span style={{ flexShrink: 0, width: '110px', fontSize: '13px', fontWeight: 500 }}>{d.name}</span>
                  <div style={{ flex: 1, height: '6px', background: '#1C2630', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: `${d.pct}%`, height: '100%', background: 'linear-gradient(90deg, #00A8FF, rgba(0,168,255,0.4))', borderRadius: '3px' }} />
                  </div>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', fontWeight: 600, color: '#00A8FF', width: '36px', textAlign: 'right' as const }}>{d.pct}%</span>
                </div>
              ))}

              {/* Chip usage */}
              <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                <div style={{ fontSize: '11px', color: '#5A6A7A', marginBottom: '10px', textTransform: 'uppercase' as const, letterSpacing: '1px', fontWeight: 600 }}>Chip Usage This Race</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  {[
                    { icon: '♾️', name: 'Limitless', pct: '34%', bg: 'rgba(0,212,126,0.12)' },
                    { icon: '🚫', name: 'No Negative', pct: '12%', bg: 'rgba(255,184,0,0.12)' },
                    { icon: '✖️', name: 'Extra DRS', pct: '8%', bg: 'rgba(0,168,255,0.12)' },
                    { icon: '🔀', name: 'Wildcard', pct: '5%', bg: 'rgba(232,0,45,0.12)' },
                  ].map((chip) => (
                    <div key={chip.name} style={{ background: '#141B22', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '10px', padding: '12px 14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: chip.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 }}>{chip.icon}</div>
                      <div>
                        <div style={{ fontSize: '12px', fontWeight: 600 }}>{chip.name}</div>
                        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: '#5A6A7A' }}><span style={{ color: '#F0F4F8' }}>{chip.pct}</span> used</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* WIDE GRID */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginBottom: '28px' }}>

          {/* Stats table */}
          <div style={s.card}>
            <div style={s.cardHeader}>
              <span style={s.cardTitle}>Driver Statistics — Season 2026</span>
              <Badge type="new" label="Live Data" />
            </div>
            <div style={s.cardBody}>
              <table style={{ width: '100%', borderCollapse: 'collapse' as const }}>
                <thead>
                  <tr>
                    {['Driver', 'Price', 'Pts', 'Avg', 'PPM', 'Wins', 'Poles', 'FL', 'DNF'].map((h) => (
                      <th key={h} style={{ fontSize: '10px', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '1px', color: '#5A6A7A', textAlign: h === 'Driver' ? 'left' as const : 'center' as const, padding: '0 0 10px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { color: '#3671C6', name: 'M. Verstappen', price: '$30.5M', pts: 87, avg: 43.5, ppm: 1.43, wins: 2, poles: 2, fl: 1, dnf: 0, highlight: true },
                    { color: '#FF8000', name: 'L. Norris', price: '$29.0M', pts: 74, avg: 37.0, ppm: 1.28, wins: 1, poles: 1, fl: 1, dnf: 0, highlight: false },
                    { color: '#FF8000', name: 'O. Piastri', price: '$26.0M', pts: 61, avg: 30.5, ppm: 1.17, wins: 0, poles: 0, fl: 0, dnf: 0, highlight: false },
                    { color: '#E8002D', name: 'C. Leclerc', price: '$25.5M', pts: 52, avg: 26.0, ppm: 1.02, wins: 0, poles: 1, fl: 1, dnf: 1, highlight: false },
                    { color: '#E8002D', name: 'C. Sainz', price: '$22.0M', pts: 48, avg: 24.0, ppm: 1.09, wins: 0, poles: 0, fl: 0, dnf: 0, highlight: false },
                    { color: '#27F4D2', name: 'G. Russell', price: '$22.0M', pts: 41, avg: 20.5, ppm: 0.93, wins: 0, poles: 0, fl: 1, dnf: 0, highlight: false },
                  ].map((d) => (
                    <tr key={d.name}>
                      <td style={{ padding: '9px 0', borderBottom: '1px solid rgba(255,255,255,0.03)', fontSize: '13px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 500 }}>
                          <TeamDot color={d.color} />{d.name}
                        </div>
                      </td>
                      {[d.price, d.pts, d.avg, d.ppm, d.wins, d.poles, d.fl, d.dnf].map((val, i) => (
                        <td key={i} style={{ padding: '9px 0', borderBottom: '1px solid rgba(255,255,255,0.03)', textAlign: 'center' as const, fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', color: (i === 1 || i === 3) && d.highlight ? '#FFB800' : '#5A6A7A', fontWeight: (i === 1 || i === 3) && d.highlight ? 600 : 400 }}>{val}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Score events */}
          <div style={s.card}>
            <div style={s.cardHeader}>
              <span style={s.cardTitle}>Recent Score Events</span>
              <Badge type="live" label="Live" />
            </div>
            <div style={s.cardBody}>
              {[
                { type: 'positive', icon: '🏆', title: 'Driver of the Day', meta: 'O. Piastri · Australia GP', pts: '+10' },
                { type: 'positive', icon: '⚡', title: 'Fastest Lap Bonus', meta: 'M. Verstappen · Australia GP', pts: '+5' },
                { type: 'positive', icon: '🔧', title: 'Best Pit Stop', meta: 'Red Bull Racing · Australia GP', pts: '+10' },
                { type: 'negative', icon: '💥', title: 'DNF Penalty', meta: 'K. Magnussen · Australia GP', pts: '−15' },
                { type: 'neutral', icon: '📊', title: 'Price Changes Applied', meta: '3 rises · 4 falls', pts: '—' },
              ].map((e) => (
                <div key={e.title} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <div style={{ width: '30px', height: '30px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', flexShrink: 0, background: e.type === 'positive' ? 'rgba(0,212,126,0.12)' : e.type === 'negative' ? 'rgba(232,0,45,0.15)' : 'rgba(255,184,0,0.12)' }}>{e.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '13px', fontWeight: 500 }}>{e.title}</div>
                    <div style={{ fontSize: '11px', color: '#5A6A7A', marginTop: '2px' }}>{e.meta}</div>
                  </div>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', fontWeight: 600, color: e.type === 'positive' ? '#00D47E' : e.type === 'negative' ? '#E8002D' : '#5A6A7A', flexShrink: 0 }}>{e.pts}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ARTICLES */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '20px', letterSpacing: '1px' }}>Latest Strategy Articles</div>
          <Link href="/articles" style={{ fontSize: '12px', color: '#E8002D', textDecoration: 'none', fontWeight: 500 }}>View all →</Link>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '28px' }}>
          {[
            { bg: 'linear-gradient(135deg,#1a0a00,#3d1500)', icon: '🏎️', tag: 'Race Preview', tagStyle: { background: 'rgba(232,0,45,0.85)', color: 'white' }, title: 'China GP: Best Fantasy Picks & DRS Boost Candidates for Round 2', date: 'Mar 13, 2026', read: '5 min', href: '/articles/chinese-gp-fantasy-preview-2026', premium: false },
            { bg: 'linear-gradient(135deg,#000a1a,#001a3d)', icon: '💡', tag: 'Chip Guide', tagStyle: { background: 'rgba(0,168,255,0.85)', color: 'white' }, title: 'When to Play Your Limitless Chip in 2026 — Data-Driven Analysis', date: 'Mar 9, 2026', read: '8 min', href: '/articles/limitless-chip-guide-2026', premium: true },
            { bg: 'linear-gradient(135deg,#001a00,#003d00)', icon: '💰', tag: 'Value Picks', tagStyle: { background: 'rgba(0,212,126,0.85)', color: 'black' }, title: 'Top 5 Budget Drivers Under $15M Delivering Exceptional Points Per Million', date: 'Mar 7, 2026', read: '6 min', href: '/articles/price-changes-to-watch-china', premium: true },
          ].map((a) => (
            <Link key={a.title} href={a.href} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{ background: '#0E1318', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', overflow: 'hidden', transition: 'border-color 0.2s, transform 0.2s', cursor: 'pointer' }}>
                <div style={{ height: '140px', background: a.bg, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px' }}>
                  {a.icon}
                  <span style={{ position: 'absolute', top: '10px', left: '10px', fontSize: '10px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase' as const, padding: '3px 8px', borderRadius: '4px', ...a.tagStyle }}>{a.tag}</span>
                  {a.premium && <span style={{ position: 'absolute', top: '10px', right: '10px', fontSize: '10px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase' as const, padding: '3px 8px', borderRadius: '4px', background: 'rgba(255,184,0,0.85)', color: 'black' }}>Premium</span>}
                </div>
                <div style={{ padding: '14px 16px' }}>
                  <div style={{ fontSize: '14px', fontWeight: 600, lineHeight: 1.4, marginBottom: '8px' }}>{a.title}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: '#5A6A7A' }}>
                    <span>{a.date}</span>
                    <div style={{ width: '3px', height: '3px', background: '#3A4A5A', borderRadius: '50%' }} />
                    <span>{a.read} read</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* RESOURCES */}
        <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '20px', letterSpacing: '1px', marginBottom: '16px' }}>Useful Resources</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
          {[
            { icon: '🎮', name: 'Official Fantasy Game', desc: 'fantasy.formula1.com', href: 'https://fantasy.formula1.com' },
            { icon: '📊', name: 'F1 Fantasy Tools', desc: 'f1fantasytools.com', href: 'https://f1fantasytools.com' },
            { icon: '▶️', name: 'YouTube Channel', desc: '@formulafantasyhub', href: 'https://www.youtube.com/@formulafantasyhub' },
            { icon: '💬', name: 'r/FantasyF1', desc: 'Community & discussion', href: 'https://reddit.com/r/FantasyF1' },
          ].map((r) => (
            <a key={r.name} href={r.href} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{ background: '#0E1318', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', padding: '16px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', transition: 'border-color 0.2s' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0, background: '#141B22' }}>{r.icon}</div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#F0F4F8' }}>{r.name}</div>
                  <div style={{ fontSize: '11px', color: '#5A6A7A', marginTop: '2px' }}>{r.desc}</div>
                </div>
              </div>
            </a>
          ))}
        </div>

      </div>
      <Footer />
    </>
  )
}
