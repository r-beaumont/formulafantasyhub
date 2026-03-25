import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import StandingsWidget from '@/components/StandingsWidget'
import RaceWeekendCard from '@/components/RaceWeekendCard'
import FantasyDeadlineCard from '@/components/FantasyDeadlineCard'
import WeatherCard from '@/components/WeatherCard'
import { articles } from '@/lib/articles'

export const metadata: Metadata = {
  title: 'Formula Hub — F1 Race Data, Standings & Fantasy Strategy 2026',
  description: 'Live F1 race results, championship standings, session times and fantasy strategy from Rob Beaumont — official F1 Fantasy columnist for formula1.com.',
  alternates: { canonical: 'https://formulahub.live' },
  openGraph: {
    title: 'Formula Hub — F1 Race Data, Standings & Fantasy Strategy 2026',
    description: 'Live F1 race results, championship standings, session times and fantasy strategy from Rob Beaumont — official F1 Fantasy columnist for formula1.com.',
    url: 'https://formulahub.live',
    siteName: 'Formula Hub',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@F_FantasyHub',
    creator: '@F_FantasyHub',
    title: 'Formula Hub — F1 Race Data, Standings & Fantasy Strategy 2026',
    description: 'Live F1 race results, championship standings, session times and fantasy strategy from Rob Beaumont — official F1 Fantasy columnist for formula1.com.',
  },
}

export default function Home() {
  const latestArticles = articles.slice(0, 3)

  const lastRaceResults = [
    { pos: 1, posC: '#FFD700', bar: '#27F4D2', driver: 'Kimi Antonelli',   flag: 'it', team: 'Mercedes', gap: 'Winner' },
    { pos: 2, posC: '#C0C0C0', bar: '#27F4D2', driver: 'George Russell',  flag: 'gb', team: 'Mercedes', gap: '+5.5s' },
    { pos: 3, posC: '#CD7F32', bar: '#E8002D', driver: 'Lewis Hamilton',  flag: 'gb', team: 'Ferrari',  gap: '+25.3s' },
    { pos: 4, posC: '#5A6A7A', bar: '#E8002D', driver: 'Charles Leclerc', flag: 'mc', team: 'Ferrari',  gap: '+28.9s' },
    { pos: 5, posC: '#5A6A7A', bar: '#B6BABD', driver: 'Oliver Bearman',  flag: 'gb', team: 'Haas',     gap: '+57.3s' },
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
            <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(3rem,8vw,6rem)', lineHeight: 0.95, marginBottom: '16px', fontWeight: 400 }}>
              Everything F1.<br />One place.
            </h1>
            <p style={{ color: '#5A6A7A', fontSize: '14px', maxWidth: '500px', lineHeight: 1.7, marginBottom: '28px' }}>
              Live race data, championship standings, expert analysis and F1 Fantasy strategy from Rob Beaumont — official Formula 1 Fantasy columnist for formula1.com.
            </p>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' as const }}>
              <Link href="/race-hub" style={{ background: '#E8002D', color: 'white', padding: '10px 24px', borderRadius: '8px', textDecoration: 'none', fontSize: '13px', fontWeight: 600 }}>Race Hub →</Link>
              <Link href="/f1-fantasy" style={{ background: 'transparent', color: '#F0F4F8', padding: '10px 24px', borderRadius: '8px', textDecoration: 'none', fontSize: '13px', fontWeight: 600, border: '1px solid rgba(255,255,255,0.15)' }}>F1 Fantasy →</Link>
            </div>
          </div>
        </div>

        <div className="mob-pad-page" style={{ maxWidth: '1400px', margin: '0 auto', padding: '28px 32px 60px' }}>

          {/* RACE WEEKEND + FANTASY DEADLINE + WEATHER */}
          <div className="mob-1col" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <RaceWeekendCard />

            <FantasyDeadlineCard />

            <WeatherCard />
          </div>

          {/* LAST RACE RESULTS */}
          <div style={{ background: '#0E1318', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', overflow: 'hidden', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px 12px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '1.5px', color: '#5A6A7A' }}>
                <span className="fi fi-cn" style={{ width: '1.2em', borderRadius: '2px', display: 'inline-block' }}></span> Chinese GP — Race Result · Round 2
              </span>
              <Link href="/race-hub" style={{ fontSize: '12px', color: '#E8002D', textDecoration: 'none', fontWeight: 500 }}>Full →</Link>
            </div>
            <div style={{ padding: '8px 20px' }}>
              {lastRaceResults.map((r) => (
                <div key={r.driver} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '14px', fontWeight: r.pos <= 3 ? 600 : 400, color: r.posC, width: '24px' }}>{r.pos}</span>
                  <div style={{ width: '3px', height: '28px', borderRadius: '2px', background: r.bar }} />
                  <span className={`fi fi-${r.flag}`} style={{ width: '1.2em', borderRadius: '2px', display: 'inline-block' }}></span>
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
              { href: '/f1-fantasy', icon: '🏆', label: 'F1 Fantasy', desc: 'Data-driven F1 Fantasy analysis',        color: '#FFB800' },
              { href: '/standings', icon: '📊', label: 'Standings',   desc: 'Full championship standings & data',    color: '#00A8FF' },
              { href: '/videos',     icon: '▶️', label: 'Videos',      desc: 'Your go-to F1 Fantasy content',        color: '#00D47E' },
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

          {/* WHAT'S COMING */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <div style={{ width: '3px', height: '20px', background: '#E8002D', borderRadius: '2px' }} />
              <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '2px', color: '#E8002D', textTransform: 'uppercase' as const }}>What&apos;s Coming to Formula Hub</span>
            </div>
            <div className="mob-2col" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '12px' }}>
              {[
                { icon: '🎯', title: 'Fantasy Performance Tracker', desc: 'Track your F1 Fantasy squad performance across every race weekend with in-depth analytics.', status: 'IN DEVELOPMENT', statusColor: '#FFB800', statusBg: 'rgba(255,184,0,0.12)' },
                { icon: '🤖', title: 'AI Race Recommendations', desc: 'Get AI-powered driver and constructor picks based on circuit data, form and price trends.', status: 'IN DEVELOPMENT', statusColor: '#FFB800', statusBg: 'rgba(255,184,0,0.12)' },
                { icon: '📰', title: 'F1 Fantasy News', desc: 'Breaking news, price change alerts and strategy updates delivered in real time.', status: 'COMING SOON', statusColor: '#E8002D', statusBg: 'rgba(232,0,45,0.12)' },
              ].map((item) => (
                <div key={item.title} style={{ background: '#0E1318', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '20px' }}>
                  <div style={{ fontSize: '28px', marginBottom: '12px' }}>{item.icon}</div>
                  <span style={{ fontSize: '9px', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', background: item.statusBg, color: item.statusColor, textTransform: 'uppercase' as const, letterSpacing: '0.5px' }}>{item.status}</span>
                  <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '18px', color: '#F0F4F8', marginTop: '10px', marginBottom: '6px' }}>{item.title}</div>
                  <div style={{ fontSize: '12px', color: '#5A6A7A', lineHeight: 1.5 }}>{item.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* NEWS + VIDEOS */}
          <div className="mob-1col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div style={{ background: '#0E1318', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px 12px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                <span style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '1.5px', color: '#5A6A7A' }}>Latest News</span>
                <Link href="/news" style={{ fontSize: '12px', color: '#E8002D', textDecoration: 'none', fontWeight: 500 }}>View all →</Link>
              </div>
              <div style={{ padding: '8px 20px' }}>
                {latestArticles.map((a, i) => (
                  <Link key={a.slug} href={`/news/${a.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div style={{ display: 'flex', gap: '14px', padding: '12px 0', borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.05)' : 'none', alignItems: 'center' }}>
                      <div style={{ width: '4px', height: '48px', borderRadius: '2px', background: a.premium ? '#FFB800' : '#00D47E', flexShrink: 0 }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginBottom: '4px' }}>
                          <span style={{ fontSize: '9px', fontWeight: 700, padding: '2px 6px', borderRadius: '3px', background: a.articleType === 'F1 Fantasy' ? 'rgba(232,0,45,0.15)' : 'rgba(0,168,255,0.15)', color: a.articleType === 'F1 Fantasy' ? '#E8002D' : '#00A8FF', textTransform: 'uppercase' as const }}>{a.articleType}</span>
                          {a.premium && <span style={{ fontSize: '9px', fontWeight: 700, padding: '2px 6px', borderRadius: '3px', background: 'rgba(255,184,0,0.15)', color: '#FFB800', textTransform: 'uppercase' as const }}>Premium</span>}
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
                <a href="https://www.youtube.com/@formulafantasyhub" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', display: 'block' }}>
                  <div style={{ position: 'relative', paddingBottom: '56.25%', background: '#080C10', borderRadius: '8px', overflow: 'hidden', cursor: 'pointer' }}>
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column' as const, alignItems: 'center', justifyContent: 'center', gap: '14px' }}>
                      <div style={{ width: '64px', height: '64px', background: '#E8002D', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 28px rgba(232,0,45,0.5)' }}>
                        <div style={{ width: 0, height: 0, borderStyle: 'solid', borderWidth: '12px 0 12px 22px', borderColor: 'transparent transparent transparent white', marginLeft: '5px' }} />
                      </div>
                      <div style={{ textAlign: 'center' as const }}>
                        <div style={{ fontSize: '15px', fontWeight: 700, color: '#F0F4F8' }}>Watch Latest Videos</div>
                        <div style={{ fontSize: '12px', color: '#5A6A7A', marginTop: '4px' }}>@formulafantasyhub</div>
                      </div>
                    </div>
                  </div>
                </a>
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
