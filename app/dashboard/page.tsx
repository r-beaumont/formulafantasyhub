import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'

const sessions = [
  { name: 'Practice 1',  short: 'FP1',  date: 'Fri 27 Mar', timeUTC: '02:30 UTC', timeLocal: '11:30 JST', completed: false },
  { name: 'Practice 2',  short: 'FP2',  date: 'Fri 27 Mar', timeUTC: '06:00 UTC', timeLocal: '15:00 JST', completed: false },
  { name: 'Practice 3',  short: 'FP3',  date: 'Sat 28 Mar', timeUTC: '02:30 UTC', timeLocal: '11:30 JST', completed: false },
  { name: 'Qualifying',  short: 'QUAL', date: 'Sat 28 Mar', timeUTC: '06:00 UTC', timeLocal: '15:00 JST', completed: false },
  { name: 'Race',        short: 'RACE', date: 'Sun 29 Mar', timeUTC: '05:00 UTC', timeLocal: '14:00 JST', completed: false },
]

const pointsFeed = [
  { icon: '⭐', type: 'positive', label: 'Driver of the Day', driver: 'C. Leclerc',    round: 'R2',  ago: '2h ago',   pts: '+10' },
  { icon: '⚡', type: 'positive', label: 'Fastest Lap',        driver: 'M. Verstappen', round: 'R2',  ago: '2h ago',   pts: '+5'  },
  { icon: '✕', type: 'negative', label: 'DNF Penalty',         driver: 'S. Perez',      round: 'R2',  ago: '3h ago',   pts: '-15' },
  { icon: '🏆', type: 'positive', label: 'Sprint Race Win',    driver: 'L. Norris',     round: 'R2',  ago: '1d ago',   pts: '+8'  },
  { icon: '✕', type: 'negative', label: '5-place Grid Penalty',driver: 'F. Alonso',     round: 'R2',  ago: '1d ago',   pts: '-5'  },
  { icon: '⚡', type: 'positive', label: 'Pole Position Bonus', driver: 'G. Russell',   round: 'R2',  ago: '1d ago',   pts: '+10' },
]

const nextSession = sessions.find(s => !s.completed)

export default function DashboardPage() {
  return (
    <>
      <Navbar />
      <main style={{ position: 'relative', zIndex: 1, maxWidth: '1400px', margin: '0 auto', padding: '28px 32px 60px' }}>

        {/* Page header */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <div style={{ width: '3px', height: '24px', background: '#E8002D', borderRadius: '2px' }} />
            <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '2px', color: '#E8002D', textTransform: 'uppercase' as const }}>My Dashboard</span>
          </div>
          <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '56px', letterSpacing: '1px', lineHeight: 1 }}>
            F1 Fantasy HQ
          </div>
          <div style={{ color: '#5A6A7A', fontSize: '13px', marginTop: '6px' }}>Season overview · 2026 · After R2 China</div>
        </div>

        {/* ── TOP STATS ROW ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '20px' }}>

          {/* Budget Remaining */}
          <div style={{ background: '#0E1318', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '20px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #00D47E, rgba(0,212,126,0.2))' }} />
            <div style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '1.5px', color: '#5A6A7A', marginBottom: '10px' }}>Budget Remaining</div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '32px', fontWeight: 600, color: '#00D47E', lineHeight: 1, marginBottom: '6px' }}>$28.5M</div>
            <div style={{ fontSize: '11px', color: '#3A4A5A' }}>of $100M cap</div>
          </div>

          {/* Team Value */}
          <div style={{ background: '#0E1318', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '20px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #00A8FF, rgba(0,168,255,0.2))' }} />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <div style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '1.5px', color: '#5A6A7A' }}>Team Value</div>
              <span style={{ fontSize: '10px', fontWeight: 700, padding: '2px 7px', borderRadius: '20px', background: 'rgba(0,212,126,0.15)', color: '#00D47E' }}>+$2.1M</span>
            </div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '32px', fontWeight: 600, color: '#00A8FF', lineHeight: 1, marginBottom: '6px' }}>$101.5M</div>
            <div style={{ fontSize: '11px', color: '#3A4A5A' }}>since season start</div>
          </div>

          {/* Overall Rank */}
          <div style={{ background: '#0E1318', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '20px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #FFB800, rgba(255,184,0,0.2))' }} />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <div style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '1.5px', color: '#5A6A7A' }}>Overall Rank</div>
              <span style={{ fontSize: '12px', color: '#00D47E', fontWeight: 700 }}>↑ 812</span>
            </div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '32px', fontWeight: 600, color: '#FFB800', lineHeight: 1, marginBottom: '6px' }}>#4,231</div>
            <div style={{ fontSize: '11px', color: '#3A4A5A' }}>global ranking</div>
          </div>

          {/* Points This Round */}
          <div style={{ background: '#0E1318', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '20px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #E8002D, rgba(232,0,45,0.2))' }} />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <div style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '1.5px', color: '#5A6A7A' }}>Points This Round</div>
              <span style={{ fontSize: '10px', fontWeight: 700, padding: '2px 7px', borderRadius: '20px', background: 'rgba(0,168,255,0.12)', color: '#00A8FF' }}>vs avg +24</span>
            </div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '32px', fontWeight: 600, color: '#F0F4F8', lineHeight: 1, marginBottom: '6px' }}>147 pts</div>
            <div style={{ fontSize: '11px', color: '#3A4A5A' }}>R2 China · avg 123</div>
          </div>

        </div>

        {/* ── MAIN CONTENT ROW ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '20px' }}>

          {/* LEFT — Race Weekend Panel */}
          <div style={{ background: '#0E1318', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', overflow: 'hidden' }}>
            {/* Red accent bar */}
            <div style={{ height: '3px', background: 'linear-gradient(90deg, #E8002D, rgba(232,0,45,0.2))' }} />

            {/* Header */}
            <div style={{ padding: '20px 24px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '1.5px', color: '#5A6A7A' }}>Next Race Weekend</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '7px', height: '7px', background: '#E8002D', borderRadius: '50%', animation: 'pulse 2s infinite' }} />
                  <span style={{ fontSize: '10px', fontWeight: 600, color: '#E8002D', textTransform: 'uppercase' as const, letterSpacing: '1px' }}>Upcoming</span>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '10px' }}>
                <span style={{ fontSize: '48px', lineHeight: 1 }}>🇯🇵</span>
                <div>
                  <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '36px', lineHeight: 1, letterSpacing: '1px' }}>Japanese Grand Prix</div>
                  <div style={{ color: '#5A6A7A', fontSize: '13px', marginTop: '2px' }}>
                    Suzuka Circuit · Round 3 of 24 · Standard Weekend
                  </div>
                </div>
              </div>
            </div>

            {/* Session cards */}
            <div style={{ padding: '20px 24px' }}>
              <div style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '1.5px', color: '#5A6A7A', marginBottom: '12px' }}>Session Schedule</div>
              <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '8px' }}>
                {sessions.map((s) => {
                  const isNext = s === nextSession
                  return (
                    <div
                      key={s.name}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '72px 1fr auto auto',
                        alignItems: 'center',
                        gap: '16px',
                        padding: '12px 16px',
                        borderRadius: '10px',
                        background: isNext ? 'rgba(232,0,45,0.07)' : '#141B22',
                        border: isNext ? '1px solid rgba(232,0,45,0.35)' : '1px solid rgba(255,255,255,0.05)',
                      }}
                    >
                      {/* Session badge */}
                      <div style={{
                        fontFamily: 'Bebas Neue, sans-serif',
                        fontSize: '13px',
                        letterSpacing: '1px',
                        color: s.completed ? '#3A4A5A' : isNext ? '#E8002D' : '#8A9AB0',
                        textAlign: 'center' as const,
                        background: isNext ? 'rgba(232,0,45,0.12)' : 'rgba(255,255,255,0.04)',
                        padding: '5px 8px',
                        borderRadius: '6px',
                      }}>
                        {s.short}
                      </div>

                      {/* Session name + date */}
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: s.completed ? '#3A4A5A' : '#F0F4F8' }}>{s.name}</div>
                        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: '#3A4A5A', marginTop: '1px' }}>{s.date}</div>
                      </div>

                      {/* UTC time */}
                      <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', fontWeight: 600, color: s.completed ? '#3A4A5A' : isNext ? '#FFB800' : '#8A9AB0', textAlign: 'right' as const }}>
                        {s.timeUTC}
                      </div>

                      {/* Status / Next badge */}
                      <div style={{ width: '52px', textAlign: 'right' as const }}>
                        {isNext ? (
                          <span style={{ fontSize: '9px', fontWeight: 700, padding: '3px 7px', borderRadius: '20px', background: '#E8002D', color: 'white', textTransform: 'uppercase' as const, letterSpacing: '0.5px' }}>Next</span>
                        ) : s.completed ? (
                          <span style={{ fontSize: '12px', color: '#00D47E' }}>✓</span>
                        ) : (
                          <span style={{ fontSize: '10px', color: '#3A4A5A' }}>○</span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Action buttons */}
              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <Link
                  href="/race-hub"
                  style={{
                    flex: 1, display: 'block', textAlign: 'center' as const,
                    background: '#E8002D', color: 'white',
                    padding: '11px 20px', borderRadius: '8px',
                    textDecoration: 'none', fontSize: '13px', fontWeight: 600,
                    boxShadow: '0 0 20px rgba(232,0,45,0.25)',
                  }}
                >
                  Race Projections →
                </Link>
                <Link
                  href="/race-hub"
                  style={{
                    flex: 1, display: 'block', textAlign: 'center' as const,
                    background: 'transparent', color: '#F0F4F8',
                    padding: '11px 20px', borderRadius: '8px',
                    textDecoration: 'none', fontSize: '13px', fontWeight: 600,
                    border: '1px solid rgba(255,255,255,0.12)',
                  }}
                >
                  Full Calendar
                </Link>
              </div>
            </div>
          </div>

          {/* RIGHT — Points Updates Feed */}
          <div style={{ background: '#0E1318', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', overflow: 'hidden', display: 'flex', flexDirection: 'column' as const }}>
            <div style={{ height: '3px', background: 'linear-gradient(90deg, #E8002D, rgba(232,0,45,0.2))' }} />

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px 12px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '1.5px', color: '#5A6A7A' }}>Points Updates</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(232,0,45,0.12)', border: '1px solid rgba(232,0,45,0.25)', borderRadius: '20px', padding: '4px 10px' }}>
                <div style={{ width: '6px', height: '6px', background: '#E8002D', borderRadius: '50%', animation: 'pulse 2s infinite' }} />
                <span style={{ fontSize: '10px', fontWeight: 700, color: '#E8002D', textTransform: 'uppercase' as const, letterSpacing: '1px' }}>Live</span>
              </div>
            </div>

            {/* Feed items */}
            <div style={{ flex: 1, padding: '8px 0' }}>
              {pointsFeed.map((item, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    padding: '12px 20px',
                    borderBottom: i < pointsFeed.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                  }}
                >
                  {/* Icon */}
                  <div style={{
                    width: '34px', height: '34px', borderRadius: '8px', flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: item.type === 'positive' ? 'rgba(0,212,126,0.1)' : 'rgba(232,0,45,0.1)',
                    border: `1px solid ${item.type === 'positive' ? 'rgba(0,212,126,0.2)' : 'rgba(232,0,45,0.2)'}`,
                    fontSize: '14px',
                  }}>
                    {item.icon}
                  </div>

                  {/* Text */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '12px', fontWeight: 600, color: '#F0F4F8', whiteSpace: 'nowrap' as const, overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.label}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                      <span style={{ fontSize: '11px', color: '#5A6A7A' }}>{item.driver}</span>
                      <span style={{ fontSize: '9px', fontWeight: 700, padding: '1px 5px', borderRadius: '3px', background: 'rgba(255,255,255,0.06)', color: '#5A6A7A' }}>{item.round}</span>
                      <span style={{ fontSize: '10px', color: '#3A4A5A', fontFamily: 'JetBrains Mono, monospace' }}>{item.ago}</span>
                    </div>
                  </div>

                  {/* Points */}
                  <div style={{
                    fontFamily: 'JetBrains Mono, monospace', fontSize: '15px', fontWeight: 700, flexShrink: 0,
                    color: item.type === 'positive' ? '#00D47E' : '#E8002D',
                  }}>
                    {item.pts}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer link */}
            <div style={{ padding: '12px 20px', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
              <Link href="/standings" style={{ display: 'block', textAlign: 'center' as const, fontSize: '12px', color: '#E8002D', textDecoration: 'none', fontWeight: 600 }}>
                View full points breakdown →
              </Link>
            </div>
          </div>

        </div>

        <style>{`@keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(1.3)} }`}</style>
      </main>
      <Footer />
    </>
  )
}
