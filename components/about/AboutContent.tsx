'use client'
import Image from 'next/image'
import Link from 'next/link'
import QuickLinkCards from '@/components/home/QuickLinkCards'
import SubscribeBox from '@/components/ui/SubscribeBox'

const TrophyIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0 }}>
    <path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0z" /><path d="M17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3" />
  </svg>
)
const EnvelopeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" style={{ flexShrink: 0 }}>
    <rect x="2" y="5" width="20" height="14" rx="2" /><path d="m2 7 10 7 10-7" />
  </svg>
)
const PlayIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
    <path d="M8 5v14l11-7z" />
  </svg>
)
const XIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
    <path d="M18.9 2H22l-7.3 8.3L23 22h-6.6l-5.1-6.7L5.4 22H2.3l7.8-8.9L2 2h6.7l4.6 6.1zM17.7 20h1.8L7.4 4H5.5z" />
  </svg>
)

const cardStyle: React.CSSProperties = { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '14px', padding: '28px 30px', marginBottom: '28px' }
const cardHeading: React.CSSProperties = { fontFamily: "'Bebas Neue', sans-serif", fontWeight: 400, fontSize: '34px', letterSpacing: '0.5px', color: 'var(--text)', marginBottom: '18px' }
const para: React.CSSProperties = { fontSize: '15px', lineHeight: 1.8, color: 'var(--muted)', marginBottom: '14px' }

const STATS = [
  { value: '2008', label: 'First fantasy game: NRL Fantasy' },
  { value: '2016', label: 'Started watching F1' },
  { value: '2022', label: 'Founded Formula Fantasy Hub' },
  { value: 'Every', label: 'Race week covered since launch' },
]

const TIMELINE = [
  { year: '2008', text: 'Starts playing NRL Fantasy, learning to identify value and track form' },
  { year: '2016', text: 'Starts watching F1, studying lap times and tyre strategies after each race' },
  { year: '2021', text: 'Moves overseas from Sydney' },
  { year: '2022', text: 'Founds Formula Fantasy Hub' },
  { year: 'Now', text: 'Lead F1 Fantasy columnist for formula1.com' },
]

const PUBLISHED_IN = ['formula1.com', 'Motorsport.com', 'Motorsport Magazine']
const INTERVIEWED = ['Laura Winter', 'Lawrence Barretto', 'Alex Brundle', 'Nate Saunders']

const CONTACT_CARDS = [
  { acc: '#E8002D', icon: <EnvelopeIcon />, label: 'Email', sub: 'connect.f1fantasyhub@gmail.com', href: 'mailto:connect.f1fantasyhub@gmail.com', external: false },
  { acc: '#FF0033', icon: <PlayIcon />, label: 'YouTube', sub: '@formulafantasyhub', href: 'https://www.youtube.com/@formulafantasyhub', external: true },
  { acc: '#8A9AB0', icon: <XIcon />, label: 'X / Twitter', sub: '@F_FantasyHub', href: 'https://x.com/F_FantasyHub', external: true },
]

export default function AboutContent() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .a-hero { display: grid; grid-template-columns: 1.2fr 1fr; gap: 32px; align-items: center; padding: 40px 0 28px; }
        .a-photo { position: relative; border-radius: 22px; overflow: hidden; border: 1px solid var(--border2, rgba(255,255,255,0.14)); box-shadow: 0 30px 60px -30px rgba(232,0,45,0.45); }
        .a-photo img { transition: transform .6s; }
        .a-photo:hover img { transform: scale(1.04); }
        .a-photo::after { content: ''; position: absolute; inset: 0; background: linear-gradient(180deg, transparent 55%, rgba(8,12,16,0.75)); pointer-events: none; }
        .a-photo figcaption { position: absolute; left: 16px; bottom: 14px; z-index: 1; font-size: 12px; color: #fff; opacity: 0.85; }
        .a-btn-outline:hover { border-color: rgba(255,255,255,0.3); }
        .a-btn-red:hover { background: #c90027; }
        .a-stats { display: grid; grid-template-columns: repeat(4,1fr); gap: 12px; margin-bottom: 28px; }
        .a-stat { background: var(--surface); border: 1px solid var(--border); border-radius: 16px; padding: 20px; transition: transform .25s, border-color .25s; }
        .a-stat:hover { transform: translateY(-3px); border-color: rgba(232,0,45,0.4); }
        .a-split { display: grid; grid-template-columns: 1fr 1fr; gap: 28px; align-items: center; margin-bottom: 28px; }
        .a-split.a-rev > :first-child { order: 2; }
        .a-split .a-photo img { aspect-ratio: 4/3; object-fit: cover; width: 100%; display: block; }
        .a-tline { position: relative; padding-left: 26px; margin-top: 12px; }
        .a-tline::before { content: ''; position: absolute; left: 7px; top: 6px; bottom: 6px; width: 2px; background: linear-gradient(180deg, #E8002D, var(--surface3)); }
        .a-tl-item { position: relative; padding: 0 0 18px; }
        .a-tl-item::before { content: ''; position: absolute; left: -26px; top: 5px; width: 12px; height: 12px; border-radius: 50%; background: var(--bg); border: 2px solid #E8002D; }
        .a-tl-item b { font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: 13px; color: #E8002D; }
        .a-tl-item p { margin: 2px 0 0; font-size: 14px; color: var(--muted); }
        .a-chip { padding: 7px 14px; border-radius: 999px; background: var(--surface2); border: 1px solid var(--border); font-size: 13px; font-weight: 600; transition: border-color .2s, background .2s; display: inline-block; }
        .a-chip:hover { border-color: rgba(232,0,45,0.45); background: rgba(232,0,45,0.08); }
        .a-ccard { display: flex; align-items: center; gap: 12px; padding: 16px; border-radius: 14px; background: var(--surface2); border: 1px solid var(--border); transition: all .25s; text-decoration: none; }
        .a-ccard:hover { border-color: color-mix(in srgb, var(--acc) 50%, transparent); transform: translateY(-2px); }
        .a-ccard-ico { width: 40px; height: 40px; border-radius: 10px; display: grid; place-items: center; background: color-mix(in srgb, var(--acc) 16%, transparent); color: var(--acc); transition: all .25s; }
        .a-ccard:hover .a-ccard-ico { background: var(--acc); color: #fff; }
        @media (max-width: 900px) {
          .a-hero, .a-split { grid-template-columns: 1fr !important; }
          .a-split.a-rev > :first-child { order: 0 !important; }
          .a-stats { grid-template-columns: 1fr 1fr !important; }
          .a-contact3 { grid-template-columns: 1fr !important; }
        }
      ` }} />
      <div className="mob-pad-page" style={{ maxWidth: '1180px', margin: '0 auto', padding: '0 32px 60px' }}>

        {/* Hero */}
        <section className="a-hero">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <div style={{ width: '3px', height: '24px', background: '#E8002D', borderRadius: '2px' }} />
              <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '2px', color: '#E8002D', textTransform: 'uppercase' }}>About</span>
            </div>
            <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontWeight: 400, fontSize: 'clamp(56px,8vw,104px)', lineHeight: 0.88, letterSpacing: '0.5px', margin: 0 }}>
              Rob Beaumont<br />&amp; Formula Hub
            </h1>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', margin: '14px 0 18px', padding: '6px 14px', borderRadius: '999px', background: 'rgba(232,0,45,0.12)', color: '#E8002D', fontWeight: 600, fontSize: '13px' }}>
              <TrophyIcon /> Lead F1 Fantasy columnist, formula1.com
            </span>
            <p style={{ fontSize: '15px', color: 'var(--muted)', lineHeight: 1.7, margin: 0 }}>
              Data-led F1 Fantasy strategy from the writer behind formula1.com&apos;s weekly Strategist Selection column and the founder of Formula Fantasy Hub.
            </p>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '22px' }}>
              <Link href="/news" className="a-btn-red" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 22px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, border: '1px solid #E8002D', background: '#E8002D', color: '#fff', textDecoration: 'none', transition: 'background .15s' }}>
                Read the latest
              </Link>
              <button
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                className="a-btn-outline"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 22px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, border: '1px solid var(--border2, rgba(255,255,255,0.12))', background: 'transparent', color: 'var(--text)', cursor: 'pointer', transition: 'border-color .15s' }}
              >
                Get in touch
              </button>
            </div>
          </div>
          <figure className="a-photo" style={{ margin: 0 }}>
            <Image src="/rob1.png" alt="Rob Beaumont" width={520} height={400} style={{ width: '100%', display: 'block' }} priority />
            <figcaption>Rob Beaumont</figcaption>
          </figure>
        </section>

        {/* Stat tiles */}
        <div className="a-stats">
          {STATS.map(s => (
            <div key={s.label} className="a-stat">
              <b style={{ display: 'block', fontFamily: "'Bebas Neue', sans-serif", fontWeight: 400, fontSize: '46px', lineHeight: 1, color: 'var(--text)' }}>{s.value}</b>
              <span style={{ fontSize: '13px', color: 'var(--muted)' }}>{s.label}</span>
            </div>
          ))}
        </div>

        {/* The journey */}
        <section className="a-split">
          <div>
            <div style={cardHeading}>The journey</div>
            <p style={para}>
              Rob Beaumont grew up in Sydney, Australia, where he played and followed a wide range of sports from a young age. In late 2021, he moved overseas, and his career has since led him into Formula 1.
            </p>
            <div className="a-tline">
              {TIMELINE.map(t => (
                <div key={t.year} className="a-tl-item">
                  <b>{t.year}</b>
                  <p>{t.text}</p>
                </div>
              ))}
            </div>
          </div>
          <figure className="a-photo" style={{ margin: 0 }}>
            <Image src="/rob3.png" alt="Rob Beaumont" width={520} height={390} style={{ width: '100%', display: 'block' }} />
          </figure>
        </section>

        {/* About Formula Hub */}
        <div style={cardStyle}>
          <div style={cardHeading}>About Formula Hub</div>
          <p style={para}>
            Formula Hub is built for F1 fans of every level, from those who follow every session to those who watch the occasional race. The site brings together race data, championship standings and F1 Fantasy strategy, and is designed to be easy to navigate.
          </p>
          <p style={{ ...para, marginBottom: '18px' }}>
            New content is added regularly, covering both the racing and F1 Fantasy. This includes race week previews, technical upgrade analysis and circuit data such as overtaking and retirement trends, with further features planned for future seasons.
          </p>
          <QuickLinkCards />
        </div>

        {/* The community — reversed: photo left, text right */}
        <section className="a-split a-rev">
          <div>
            <div style={cardHeading}>The community</div>
            <p style={para}>
              Rob founded Formula Fantasy Hub in 2022, when very little content focused solely on F1 Fantasy. Few creators were covering the game in any depth, so he decided to start producing that content himself, with a focus on data-led team selection and strategy.
            </p>
            <p style={para}>
              Formula Fantasy Hub is now the most followed dedicated F1 Fantasy community on YouTube and X, and he has published content every race week since its launch.
            </p>
            <p style={para}>
              The community plays a large part in this. Members regularly share tips, discuss their teams and compare chip strategies throughout the season. New players receive plenty of support, and experienced players are just as willing to learn from others.
            </p>
            <p style={{ ...para, marginBottom: 0 }}>
              F1 Fantasy has also grown considerably since 2022. The player base continues to expand each season, more creators now cover the game, and discussion around team selection and strategy has become far more detailed.
            </p>
          </div>
          <figure className="a-photo" style={{ margin: 0 }}>
            <Image src="/rob2.png" alt="Rob Beaumont with the Formula Hub community" width={520} height={390} style={{ width: '100%', display: 'block' }} />
          </figure>
        </section>

        {/* The writing */}
        <div style={cardStyle}>
          <div style={cardHeading}>The writing</div>
          <p style={para}>
            Rob has written about sport since childhood. He recorded scores and match reports in notebooks, read the statistics in the newspaper&apos;s sports section, and commentated games at home.
          </p>
          <p style={para}>
            He enjoys analysing data and presenting it clearly, particularly for fans making decisions about their F1 Fantasy teams. His approach centres on turning statistics such as recent form, price changes and ownership levels into practical advice that players can use each race week.
          </p>
          <p style={{ ...para, marginBottom: '20px' }}>
            He is now the lead F1 Fantasy columnist for formula1.com, where he writes the weekly Strategist Selection column on who to pick, who to sell and when to use chips. His work has also appeared in Motorsport.com, Motorsport Magazine and other publications, and he has interviewed Laura Winter, Lawrence Barretto, Alex Brundle and Nate Saunders.
          </p>
          <div className="mob-1col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '8px' }}>Published in</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {PUBLISHED_IN.map(p => <span key={p} className="a-chip">{p}</span>)}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '8px' }}>Has interviewed</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {INTERVIEWED.map(p => <span key={p} className="a-chip">{p}</span>)}
              </div>
            </div>
          </div>
        </div>

        {/* Get in touch */}
        <div style={cardStyle} id="contact">
          <div style={cardHeading}>Get in touch</div>
          <p style={{ ...para, marginBottom: '20px' }}>
            Rob welcomes fantasy questions, collaboration ideas and feedback on the site, as well as general discussion about the latest race. He can be contacted by email, or through Formula Fantasy Hub on YouTube and X, using the links below.
          </p>
          <div className="a-contact3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '12px' }}>
            {CONTACT_CARDS.map(c => (
              <a
                key={c.label}
                href={c.href}
                target={c.external ? '_blank' : undefined}
                rel={c.external ? 'noopener noreferrer' : undefined}
                className="a-ccard"
                style={{ '--acc': c.acc, color: 'inherit' } as React.CSSProperties}
              >
                <span className="a-ccard-ico">{c.icon}</span>
                <span>
                  <b style={{ display: 'block', fontSize: '14px', color: 'var(--text)' }}>{c.label}</b>
                  <small style={{ fontSize: '12px', color: 'var(--muted)' }}>{c.sub}</small>
                </span>
              </a>
            ))}
          </div>
        </div>

        <SubscribeBox />

      </div>
    </>
  )
}
