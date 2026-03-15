import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { CURRENT_RACE, SEASON_CALENDAR } from '@/lib/races'
import { DRIVER_STANDINGS, CONSTRUCTOR_STANDINGS } from '@/lib/standings'
import { articles } from '@/lib/articles'

export default function Home() {
  const top5Drivers = DRIVER_STANDINGS.slice(0, 5)
  const top5Constructors = CONSTRUCTOR_STANDINGS.slice(0, 5)
  const latestArticles = articles.slice(0, 3)
  const nextSession = CURRENT_RACE.sessions.find(s => !s.completed)

  return (
    <>
      <Navbar />
      <main style={{ position: 'relative', zIndex: 1 }}>

        {/* HERO BANNER */}
        <div style={{
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          background: 'linear-gradient(180deg, rgba(232,0,45,0.08) 0%, transparent 100%)',
          padding: '48px 32px 40px',
        }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <div style={{ width: '3px', height: '32px', background: '#E8002D', borderRadius: '2px' }} />
              <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '3px', color: '#E8002D', textTransform: 'uppercase' }}>
                Formula Hub — Your F1 Home
              </span>
            </div>
            <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(3rem,8vw,6rem)', lineHeight: 0.95, marginBottom: '16px' }}>
              Everything F1.<br />One place.
            </div>
            <p style={{ color: '#5A6A7A', fontSize: '14px', maxWidth: '500px', lineHeight: 1.7, marginBottom: '28px' }}>
              Live race data, championship standings, fantasy strategy and expert analysis from Rob Beaumont — official F1 Fantasy columnist for formula1.com.
            </p>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <Link href="/race-hub" style={{ background: '#E8002D', color: 'white', padding: '10px 24px', borderRadius: '8px', textDecoration: 'none', fontSize: '13px', fontWeight: 600 }}>Race Hub →</Link>
              <Link href="/f1-fantasy" style={{ background: 'transparent', color: '#F0F4F8', padding: '10px 24px', borderRadius: '8px', textDecoration: 'none', fontSize: '13px', fontWeight: 600, border: '1px solid rgba(255,255,255,0.15)' }}>F1 Fantasy →</Link>
            </div>
          </div>
        </div>

        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '28px 32px 60px' }}>

          {/* NEXT RACE + WEATHER ROW */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginBottom: '20px' }}>

            {/* Next Race */}
            <div style={{ background: '#0E1318', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', overflow: 'hidden', position: 'relative' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #E8002D, rgba(232,0,45,0.2))' }} />
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px 12px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                <span style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1.5px', color: '#5A6A7A' }}>Current Race Weekend</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '7px', height: '7px', background: '#E8002D', borderRadius: '50%', animation: 'pulse 2s infinite' }} />
                  <span style={{ fontSize: '10px', fontWeight: 600, color: '#E8002D', textTransform: 'uppercase', letterSpacing: '1px' }}>Live</span>
                </div>
              </div>
              <div style={{ padding: '20px' }}>
                <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '36px', lineHeight: 1, marginBottom: '4px' }}>
                  {CURRENT_RACE.flag} {CURRENT_RACE.name}
                </div>
                <div style={{ color: '#5A6A7A', fontSize: '13px', marginBottom: '20px' }}>
                  Round {CURRENT_RACE.round} · {CURRENT_RACE.isSprint ? '⚡ Sprint Weekend' : 'Standard Weekend'}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: `repeat(${CURRENT_RACE.sessions.length}, 1fr)`, gap: '8px' }}>
                  {CURRENT_RACE.sessions.map((session) => {
                    const isNext = session === nextSession
                    return (
                      <div key={session.name} style={{
                        background: isNext ? 'rgba(232,0,45,0.08)' : '#141B22',
                        border: isNext ? '1px solid rgba(232,0,45,0.4)' : '1px solid rgba(255,255,255,0.05)',
                        borderRadius: '8px', padding: '10px 12px',
                      }}>
                        <div style={{ fontSize: '9px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', color: session.completed ? '#3A4A5A' : isNext ? '#E8002D' : '#5A6A7A', marginBottom: '4px' }}>
                          {session.completed ? '✓' : isNext ? '● Next' : '○'}
                        </div>
                        <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '14px', color: session.completed ? '#3A4A5A' : '#F0F4F8', marginBottom: '2px' }}>{session.name}</div>
                        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: session.completed ? '#3A4A5A' : '#FFB800' }}>{session.timeUTC}</div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Weather */}
            <div style={{ background: '#0E1318', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px 12px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                <span style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1.5px', color: '#5A6A7A' }}>Weekend Weather</span>
                <span style={{ fontSize: '10px', color: '#5A6A7A', fontFamily: 'JetBrains Mono, monospace' }}>Shanghai</span>
              </div>
              <div style={{ padding: '16px 20px' }}>
                {[
                  { day: 'Fri', icon: '🌤️', high: '16°', low: '10°', rain: '10%' },
                  { day: 'Sat', icon: '⛅', high: '15°', low: '9°', rain: '20%' },
                  { day: 'Sun', icon: '🌧️', high: '13°', low: '8°', rain: '45%' },
                ].map((w, i) => (
                  <div key={w.day} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 0', borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                    <span style={{ fontSize: '22px' }}>{w.icon}</span>
                    <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '18px', color: '#5A6A7A', width: '32px' }}>{w.day}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '14px', fontWeight: 600 }}>{w.high} <span style={{ color: '#3A4A5A', fontSize: '12px' }}>{w.low}</span></div>
                    </div>
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', color: parseInt(w.rain) > 30 ? '#00A8FF' : '#5A6A7A' }}>💧{w.rain}</span>
                  </div>
                ))}
                <Link href="/race-hub" style={{ display: 'block', textAlign: 'center', marginTop: '12px', fontSize: '12px', color: '#E8002D', textDecoration: 'none', fontWeight: 600 }}>
                  Full forecast →
                </Link>
              </div>
            </div>
          </div>

          {/* SESSION RESULTS */}
          <div style={{ background: '#0E1318', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', overflow: 'hidden', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px 12px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1.5px', color: '#5A6A7A' }}>Latest Session Results — Australian GP</span>
              <Link href="/race-hub" style={{ fontSize: '12px', color: '#E8002D', textDecoration: 'none', fontWeight: 500 }}>Full results →</Link>
            </div>
            <div style={{ padding: '16px 20px' }}>
              <div style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', color: '#5A6A7A', marginBottom: '12px' }}>Race Result · Round 1</div>
              {[
                { pos: 1, posC: '#FFD700', bar: '#27F4D2', driver: 'G. Russell', team: 'Mercedes', time: '1:21:32.456', gap: 'Winner' },
                { pos: 2, posC: '#C0C0C0', bar: '#27F4D2', driver: 'K. Antonelli', team: 'Mercedes', time: '+5.123', gap: '+5.1s' },
                { pos: 3, posC: '#CD7F32', bar: '#E8002D', driver: 'C. Leclerc', team: 'Ferrari', time: '+12.456', gap: '+12.5s' },
                { pos: 4, posC: '#5A6A7A', bar: '#E8002D', driver: 'L. Hamilton', team: 'Ferrari', time: '+18.901', gap: '+18.9s' },
                { pos: 5, posC: '#5A6A7A', bar: '#FF8000', driver: 'L. Norris', team: 'McLaren', time: '+24.567', gap: '+24.6s' },
              ].map((r) => (
                <div key={r.driver} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '14px', fontWeight: 600, color: r.posC, width: '24px' }}>{r.pos}</span>
                  <div style={{ width: '3px', height: '28px', borderRadius: '2px', background: r.bar }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '13px', fontWeight: 600 }}>{r.driver}</div>
                    <div style={{ fontSize: '11px', color: '#5A6A7A' }}>{r.team}</div>
                  </div>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', color: r.pos === 1 ? '#FFB800' : '#5A6A7A' }}>{r.gap}</span>
                </div>
              ))}
            </div>
          </div>

          {/* STANDINGS ROW */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>

            {/* Drivers */}
            <div style={{ background: '#0E1318', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px 12px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                <span style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1.5px', color: '#5A6A7A' }}>Drivers Championship</span>
                <Link href="/statistics" style={{ fontSize: '12px', color: '#E8002D', textDecoration: 'none', fontWeight: 500 }}>Full standings →</Link>
              </div>
              <div style={{ padding: '8px 20px' }}>
                {top5Drivers.map((d) => {
                  const posColors: Record<number,string> = { 1: '#FFD700', 2: '#C0C0C0', 3: '#CD7F32' }
                  return (
                    <div key={d.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '9px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', color: posColors[d.pos] || '#5A6A7A', width: '20px', fontWeight: d.pos <= 3 ? 600 : 400 }}>{d.pos}</span>
                      <div style={{ width: '3px', height: '28px', borderRadius: '2px', background: d.teamColor }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '13px', fontWeight: 500 }}>{d.nationality} {d.name}</div>
                        <div style={{ fontSize: '11px', color: '#5A6A7A' }}>{d.team}</div>
                      </div>
                      <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '15px', fontWeight: 600, color: '#F0F4F8' }}>{d.points}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Constructors */}
            <div style={{ background: '#0E1318', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px 12px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                <span style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1.5px', color: '#5A6A7A' }}>Constructors Championship</span>
                <Link href="/statistics" style={{ fontSize: '12px', color: '#E8002D', textDecoration: 'none', fontWeight: 500 }}>Full standings →</Link>
              </div>
              <div style={{ padding: '8px 20px' }}>
                {top5Constructors.map((c) => {
                  const posColors: Record<number,string> = { 1: '#FFD700', 2: '#C0C0C0', 3: '#CD7F32' }
                  const maxPts = CONSTRUCTOR_STANDINGS[0].points
                  return (
                    <div key={c.name} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '9px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', color: posColors[c.pos] || '#5A6A7A', width: '20px', fontWeight: c.pos <= 3 ? 600 : 400 }}>{c.pos}</span>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: c.color, flexShrink: 0 }} />
                      <span style={{ flex: 1, fontSize: '13px', fontWeight: 500 }}>{c.name}</span>
                      <div style={{ width: '60px', height: '3px', background: '#1C2630', borderRadius: '2px', overflow: 'hidden' }}>
                        <div style={{ width: maxPts > 0 ? `${(c.points/maxPts)*100}%` : '4px', height: '100%', background: c.color, opacity: 0.8 }} />
                      </div>
                      <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '15px', fontWeight: 600, color: '#F0F4F8', width: '32px', textAlign: 'right' }}>{c.points}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* SECTION LINKS — summary of main pages */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '12px', marginBottom: '20px' }}>
            {[
              { href: '/race-hub', icon: '🏎️', label: 'Race Hub', desc: 'Live timing, results & circuit info', color: '#E8002D' },
              { href: '/f1-fantasy', icon: '🏆', label: 'F1 Fantasy', desc: 'Picks, price changes & strategy', color: '#FFB800' },
              { href: '/statistics', icon: '📊', label: 'Statistics', desc: 'Full championship standings & data', color: '#00A8FF' },
              { href: '/videos', icon: '▶️', label: 'Videos', desc: 'Latest YouTube content from Rob', color: '#00D47E' },
            ].map((item) => (
              <Link key={item.href} href={item.href} style={{ textDecoration: 'none' }}>
                <div style={{ background: '#0E1318', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '20px', cursor: 'pointer', transition: 'border-color 0.2s', height: '100%' }}>
                  <div style={{ fontSize: '28px', marginBottom: '12px' }}>{item.icon}</div>
                  <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '20px', color: item.color, marginBottom: '6px' }}>{item.label}</div>
                  <div style={{ fontSize: '12px', color: '#5A6A7A', lineHeight: 1.5 }}>{item.desc}</div>
                </div>
              </Link>
            ))}
          </div>

          {/* ARTICLES + VIDEOS ROW */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>

            {/* Latest Articles */}
            <div style={{ background: '#0E1318', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px 12px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                <span style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1.5px', color: '#5A6A7A' }}>Latest Articles</span>
                <Link href="/articles" style={{ fontSize: '12px', color: '#E8002D', textDecoration: 'none', fontWeight: 500 }}>View all →</Link>
              </div>
              <div style={{ padding: '8px 20px' }}>
                {latestArticles.map((a, i) => (
                  <Link key={a.slug} href={`/articles/${a.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div style={{ display: 'flex', gap: '12px', padding: '12px 0', borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.05)' : 'none', cursor: 'pointer' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '6px' }}>
                          <span style={{ fontSize: '9px', fontWeight: 700, padding: '2px 6px', borderRadius: '3px', background: a.premium ? 'rgba(255,184,0,0.15)' : 'rgba(0,212,126,0.12)', color: a.premium ? '#FFB800' : '#00D47E', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            {a.tag}
                          </span>
                          {a.premium && <span style={{ fontSize: '9px', fontWeight: 700, padding: '2px 6px', borderRadius: '3px', background: 'rgba(232,0,45,0.15)', color: '#E8002D', textTransform: 'uppercase' }}>Premium</span>}
                        </div>
                        <div style={{ fontSize: '13px', fontWeight: 600, lineHeight: 1.4, marginBottom: '4px' }}>{a.title}</div>
                        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#3A4A5A' }}>{a.date}</div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Latest Videos */}
            <div style={{ background: '#0E1318', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px 12px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                <span style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1.5px', color: '#5A6A7A' }}>Latest Videos</span>
                <Link href="/videos" style={{ fontSize: '12px', color: '#E8002D', textDecoration: 'none', fontWeight: 500 }}>View all →</Link>
              </div>
              <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ position: 'relative', paddingBottom: '56.25%', background: '#080C10', borderRadius: '8px', overflow: 'hidden' }}>
                  <iframe
                    src="https://www.youtube.com/embed?listType=user_uploads&list=formulafantasyhub&index=0"
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <a href="https://www.youtube.com/@formulafantasyhub" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: '#E8002D', color: 'white', padding: '10px', borderRadius: '8px', textDecoration: 'none', fontSize: '13px', fontWeight: 600 }}>
                  ▶ Subscribe on YouTube
                </a>
              </div>
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </>
  )
}
