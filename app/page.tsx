import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import StandingsWidget from '@/components/StandingsWidget'
import RaceWeekendCard from '@/components/RaceWeekendCard'
import { articles } from '@/lib/articles'

export default function Home() {
  const latestArticles = articles.slice(0, 3)

  const lastRaceResults = [
    { pos: 1, posC: '#FFD700', bar: '#27F4D2', driver: 'K. Antonelli', flag: '🇮🇹', team: 'Mercedes', gap: 'Winner' },
    { pos: 2, posC: '#C0C0C0', bar: '#27F4D2', driver: 'G. Russell',   flag: '🇬🇧', team: 'Mercedes', gap: '+5.5s' },
    { pos: 3, posC: '#CD7F32', bar: '#E8002D', driver: 'L. Hamilton',  flag: '🇬🇧', team: 'Ferrari',  gap: '+25.3s' },
    { pos: 4, posC: '#5A6A7A', bar: '#E8002D', driver: 'C. Leclerc',   flag: '🇲🇨', team: 'Ferrari',  gap: '+28.9s' },
    { pos: 5, posC: '#5A6A7A', bar: '#B6BABD', driver: 'O. Bearman',   flag: '🇬🇧', team: 'Haas',     gap: '+57.3s' },
  ]

  return (
    <>
      <Navbar />
      <main style={{ position: 'relative', zIndex: 1 }}>
        <style>{`@keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(1.3)} }`}</style>

        {/* HERO */}
        <div className="mob-pad-hero" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', background: 'linear-gradient(180deg,rgba(232,0,45,0.08) 0%,transparent 100%)', padding: '48px 32px 40px' }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <div style={{ width: '3px', height: '32px', background: '#E8002D', borderRadius: '2px' }} />
              <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '3px', color: '#E8002D', textTransform: 'uppercase' as const }}>Formula Hub — Your F1 Home</span>
            </div>
            <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(3rem,8vw,6rem)', lineHeight: 0.95, marginBottom: '16px' }}>
              Everything F1.<br />One place.
            </div>
            <p style={{ color: '#5A6A7A', fontSize: '14px', maxWidth: '500px', lineHeight: 1.7, marginBottom: '28px' }}>
              Live race data, championship standings, fantasy strategy and expert analysis from Rob Beaumont — official F1 Fantasy columnist for formula1.com.
            </p>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' as const }}>
              <Link href="/race-hub" style={{ background: '#E8002D', color: 'white', padding: '10px 24px', borderRadius: '8px', textDecoration: 'none', fontSize: '13px', fontWeight: 600 }}>Race Hub →</Link>
              <Link href="/f1-fantasy" style={{ background: 'transparent', color: '#F0F4F8', padding: '10px 24px', borderRadius: '8px', textDecoration: 'none', fontSize: '13px', fontWeight: 600, border: '1px solid rgba(255,255,255,0.15)' }}>F1 Fantasy →</Link>
            </div>
          </div>
        </div>

        <div className="mob-pad-page" style={{ maxWidth: '1400px', margin: '0 auto', padding: '28px 32px 60px' }}>

          {/* RACE WEEKEND + WEATHER */}
          <div className="mob-1col" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <RaceWeekendCard />

            <div style={{ background: '#0E1318', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px 12px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                <span style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '1.5px', color: '#5A6A7A' }}>Weekend Weather</span>
                <span style={{ fontSize: '12px' }}>🇯🇵</span>
              </div>
              <div style={{ padding: '16px 20px' }}>
                {[{ day: 'Fri', icon: '🌤️', high: '16°', rain: '10%' }, { day: 'Sat', icon: '⛅', high: '15°', rain: '20%' }, { day: 'Sun', icon: '🌧️', high: '13°', rain: '45%' }].map((w, i) => (
                  <div key={w.day} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 0', borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                    <span style={{ fontSize: '22px' }}>{w.icon}</span>
                    <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '18px', color: '#5A6A7A', width: '32px' }}>{w.day}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '14px', fontWeight: 600 }}>{w.high}</div>
                    </div>
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', color: parseInt(w.rain) > 30 ? '#00A8FF' : '#5A6A7A' }}>💧{w.rain}</span>
                  </div>
                ))}
                <Link href="/race-hub" style={{ display: 'block', textAlign: 'center' as const, marginTop: '12px', fontSize: '12px', color: '#E8002D', textDecoration: 'none', fontWeight: 600 }}>Full forecast →</Link>
              </div>
            </div>
          </div>

          {/* LAST RACE RESULTS */}
          <div style={{ background: '#0E1318', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', overflow: 'hidden', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px 12px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '1.5px', color: '#5A6A7A' }}>
                🇨🇳 Chinese GP — Race Result · Round 2
              </span>
              <Link href="/race-hub" style={{ fontSize: '12px', color: '#E8002D', textDecoration: 'none', fontWeight: 500 }}>Full results →</Link>
            </div>
            <div style={{ padding: '8px 20px' }}>
              {lastRaceResults.map((r) => (
                <div key={r.driver} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '14px', fontWeight: r.pos <= 3 ? 600 : 400, color: r.posC, width: '24px' }}>{r.pos}</span>
                  <div style={{ width: '3px', height: '28px', borderRadius: '2px', background: r.bar }} />
                  <span style={{ fontSize: '16px' }}>{r.flag}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '13px', fontWeight: 600 }}>{r.driver}</div>
                    <div style={{ fontSize: '11px', color: '#5A6A7A' }}>{r.team}</div>
                  </div>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', color: r.pos === 1 ? '#FFB800' : '#5A6A7A' }}>{r.gap}</span>
                </div>
              ))}
            </div>
          </div>

          {/* STANDINGS — auto-updating via StandingsWidget */}
          <div className="mob-1col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <StandingsWidget type="drivers" limit={5} showLink={true} />
            <StandingsWidget type="constructors" limit={5} showLink={true} />
          </div>

          {/* SECTION LINKS */}
          <div className="mob-2col" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '12px', marginBottom: '20px' }}>
            {[
              { href: '/race-hub',   icon: '🏎️', label: 'Race Hub',   desc: 'Live timing, results & circuit info',   color: '#E8002D' },
              { href: '/f1-fantasy', icon: '🏆', label: 'F1 Fantasy', desc: 'Picks, price changes & strategy',        color: '#FFB800' },
              { href: '/standings', icon: '📊', label: 'Statistics',  desc: 'Full championship standings & data',    color: '#00A8FF' },
              { href: '/videos',     icon: '▶️', label: 'Videos',      desc: 'Latest YouTube content from Rob',       color: '#00D47E' },
            ].map((item) => (
              <Link key={item.href} href={item.href} style={{ textDecoration: 'none' }}>
                <div style={{ background: '#0E1318', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '20px', cursor: 'pointer', height: '100%' }}>
                  <div style={{ fontSize: '28px', marginBottom: '12px' }}>{item.icon}</div>
                  <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '20px', color: item.color, marginBottom: '6px' }}>{item.label}</div>
                  <div style={{ fontSize: '12px', color: '#5A6A7A', lineHeight: 1.5 }}>{item.desc}</div>
                </div>
              </Link>
            ))}
          </div>

          {/* ARTICLES + VIDEOS */}
          <div className="mob-1col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div style={{ background: '#0E1318', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px 12px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                <span style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '1.5px', color: '#5A6A7A' }}>Latest Articles</span>
                <Link href="/articles" style={{ fontSize: '12px', color: '#E8002D', textDecoration: 'none', fontWeight: 500 }}>View all →</Link>
              </div>
              <div style={{ padding: '8px 20px' }}>
                {latestArticles.map((a, i) => (
                  <Link key={a.slug} href={`/articles/${a.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div style={{ display: 'flex', gap: '14px', padding: '12px 0', borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.05)' : 'none', alignItems: 'center' }}>
                      <div style={{ width: '4px', height: '48px', borderRadius: '2px', background: a.premium ? '#FFB800' : '#00D47E', flexShrink: 0 }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginBottom: '4px' }}>
                          <span style={{ fontSize: '9px', fontWeight: 700, padding: '2px 6px', borderRadius: '3px', background: a.premium ? 'rgba(255,184,0,0.15)' : 'rgba(0,212,126,0.12)', color: a.premium ? '#FFB800' : '#00D47E', textTransform: 'uppercase' as const }}>{a.tag}</span>
                          {a.premium && <span style={{ fontSize: '9px', fontWeight: 700, padding: '2px 6px', borderRadius: '3px', background: 'rgba(232,0,45,0.15)', color: '#E8002D', textTransform: 'uppercase' as const }}>Premium</span>}
                        </div>
                        <div style={{ fontSize: '13px', fontWeight: 600, lineHeight: 1.4, marginBottom: '2px' }}>{a.title}</div>
                        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#3A4A5A' }}>{a.date}</div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div style={{ background: '#0E1318', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px 12px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                <span style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '1.5px', color: '#5A6A7A' }}>Latest Videos</span>
                <Link href="/videos" style={{ fontSize: '12px', color: '#E8002D', textDecoration: 'none', fontWeight: 500 }}>View all →</Link>
              </div>
              <div style={{ padding: '20px', display: 'flex', flexDirection: 'column' as const, gap: '12px' }}>
                <div style={{ position: 'relative', paddingBottom: '56.25%', background: '#080C10', borderRadius: '8px', overflow: 'hidden' }}>
                  <iframe src="https://www.youtube.com/embed?listType=user_uploads&list=formulafantasyhub&index=0" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
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
