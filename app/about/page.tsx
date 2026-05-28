import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'About | Formula Hub',
  description: 'Rob Beaumont is the lead F1 Fantasy columnist for formula1.com. Learn about Formula Hub — your home for F1 race data, standings and fantasy strategy.',
  alternates: { canonical: 'https://formulahub.live/about' },
  openGraph: {
    title: 'About | Formula Hub',
    description: 'Rob Beaumont is the lead F1 Fantasy columnist for formula1.com. Learn about Formula Hub — your home for F1 race data, standings and fantasy strategy.',
    url: 'https://formulahub.live/about',
    siteName: 'Formula Hub',
    type: 'website',
    images: [{ url: 'https://formulahub.live/rob1.png', width: 1200, height: 630, alt: 'Rob Beaumont' }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@F_FantasyHub',
    creator: '@F_FantasyHub',
    title: 'About | Formula Hub',
    description: 'Rob Beaumont is the lead F1 Fantasy columnist for formula1.com. Learn about Formula Hub.',
    images: ['https://formulahub.live/rob1.png'],
  },
}

const card: React.CSSProperties = {
  background: 'var(--surface)',
  border: '0.5px solid var(--border)',
  borderRadius: '12px',
  padding: '32px',
  marginBottom: '20px',
}

const sectionLabel: React.CSSProperties = {
  fontFamily: 'DM Sans, sans-serif',
  fontSize: '11px',
  fontWeight: 600,
  color: 'var(--muted)',
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  marginBottom: '20px',
}

const para: React.CSSProperties = {
  fontFamily: 'DM Sans, sans-serif',
  fontSize: '15px',
  color: '#8A9BB0',
  lineHeight: 1.8,
  marginBottom: '18px',
}

const XIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
    <path d="M10.9 1H12.9L8.64 5.95L13.67 13H9.72L6.67 9.05L3.17 13H1.16L5.72 7.68L0.89 1H4.95L7.71 4.6L10.9 1ZM10.2 11.77H11.31L4.4 2.13H3.21L10.2 11.77Z" fill="currentColor" />
  </svg>
)

const PlayIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
    <path d="M2.5 2L11.5 7L2.5 12V2Z" fill="currentColor" />
  </svg>
)

const EnvelopeIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
    <rect x="1" y="3" width="12" height="8" rx="1" stroke="currentColor" strokeWidth="1.2" fill="none" />
    <path d="M1 4L7 8.5L13 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
)

export default function AboutPage() {
  const floatImgStyle: React.CSSProperties = {
    width: '260px',
    borderRadius: '10px',
    float: 'right',
    marginLeft: '28px',
    marginBottom: '16px',
    display: 'block',
  }

  const contactBtn: React.CSSProperties = {
    background: 'var(--surface)',
    border: '0.5px solid rgba(255,255,255,0.12)',
    borderRadius: '8px',
    padding: '10px 20px',
    fontFamily: 'DM Sans, sans-serif',
    fontSize: '14px',
    fontWeight: 500,
    color: '#8A9BB0',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    textDecoration: 'none',
    transition: 'border-color 0.15s, color 0.15s',
  }

  return (
    <>
      <style>{`
        .about-float-img { width: 260px; border-radius: 10px; float: right; margin-left: 28px; margin-bottom: 16px; display: block; }
        @media (max-width: 600px) {
          .about-float-img { float: none !important; width: 100% !important; margin-left: 0 !important; margin-bottom: 20px !important; }
        }
        .contact-btn:hover { border-color: rgba(255,255,255,0.3) !important; color: var(--text) !important; }
      `}</style>
      <Navbar />
      <main style={{ position: 'relative', zIndex: 1 }}>
        <div className="mob-pad-page" style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 32px 80px' }}>

          {/* Page header */}
          <div style={{ marginBottom: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <div style={{ width: '3px', height: '24px', background: '#E8002D', borderRadius: '2px' }} />
              <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '2px', color: '#E8002D', textTransform: 'uppercase' as const }}>About</span>
            </div>
            <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(2.5rem,5vw,3.5rem)', lineHeight: 1, marginBottom: '8px' }}>
              Rob Beaumont &amp; Formula Hub
            </div>
          </div>

          {/* Section 1 — About Rob Beaumont */}
          <div style={card}>
            <div style={sectionLabel}>About Rob Beaumont</div>
            <Image
              src="/rob1.png"
              alt="Rob Beaumont"
              width={260}
              height={340}
              className="about-float-img"
              style={{ borderRadius: '10px' }}
            />
            <p style={para}>
              Rob Beaumont grew up in Sydney, Australia with a love for sport that ran deep from an early age. Five years ago he made the move abroad, chasing new experiences and a career path that has taken him further than he ever imagined, right to the heart of Formula 1.
            </p>
            <p style={para}>
              He came to the sport in 2016 and fell hard for it. What started as watching races on a Sunday quickly turned into studying lap times, tyre strategies, and championship permutations late into the night. When F1 Fantasy entered the picture, the analyst in him had found his arena.
            </p>
            <p style={{ ...para, marginBottom: 0 }}>
              Fantasy sports, though, was never new to Rob. He played his first fantasy game — NRL Fantasy — back in 2008, long before F1 Fantasy existed. That background gave him a foundation built on understanding how to build value, read form, and think several moves ahead. It shows in the work.
            </p>
            <div style={{ clear: 'both' }} />
          </div>

          {/* Section 2 — About Formula Hub */}
          <div style={card}>
            <div style={sectionLabel}>About Formula Hub</div>
            <p style={para}>
              Formula Hub is for every F1 fan, whether you follow the championship religiously, dabble in F1 Fantasy, or just want to understand what's happening on and off the track. The goal has always been simple: bring race data, championship standings, fantasy strategy, and genuine analysis together in one place, presented in a way that actually makes sense.
            </p>
            <p style={{ ...para, marginBottom: 0 }}>
              The site is always growing. More content, more in-depth analysis, and more tools are on the way, covering both the sport itself and the fantasy game that has captured the imagination of millions of fans worldwide.
            </p>
          </div>

          {/* Section 3 — The Community */}
          <div style={card}>
            <div style={sectionLabel}>The Community</div>
            <Image
              src="/rob2.png"
              alt="Rob Beaumont with the Formula Hub community"
              width={260}
              height={340}
              className="about-float-img"
              style={{ borderRadius: '10px' }}
            />
            <p style={para}>
              When Rob launched Formula Fantasy Hub in 2022, dedicated F1 Fantasy content was a largely untapped space. There were very few creators making it their focus, and even fewer doing it well. He saw the gap and went for it.
            </p>
            <p style={para}>
              In the years since, Formula Fantasy Hub has grown into the most followed dedicated F1 Fantasy community on both YouTube and X, built through showing up every race week with content people could genuinely rely on. The demand was clearly there, and the community responded.
            </p>
            <p style={para}>
              What makes it special, though, isn't the numbers. It's the people. It's an incredibly warm and engaged group where members freely share advice, swap strategies, and help each other improve at the game. Everyone is welcome, and everyone is willing to learn.
            </p>
            <p style={{ ...para, marginBottom: 0 }}>
              F1 Fantasy itself has grown enormously over that time too. The number of dedicated content creators has increased, the player base keeps expanding, and the conversation around the game gets richer with every season. It's an exciting time to be involved, and by all accounts it's only going to get bigger.
            </p>
            <div style={{ clear: 'both' }} />
          </div>

          {/* Section 4 — The Writing */}
          <div style={card}>
            <div style={sectionLabel}>The Writing</div>
            <p style={para}>
              Long before Rob was writing professionally, sport was already filling his notebooks. As a kid he would scribble down scores and match reports, pore over the statistics in the sports section of the newspaper, and mock commentate games from his living room. The love of communicating sport, of breaking it down and making sense of it for others, was always there.
            </p>
            <p style={para}>
              That passion found its natural home in writing. Rob has a genuine passion for taking complex data and presenting it in a way that feels clear, accessible, and useful rather than overwhelming. It is analytical at its core, but always written with the reader in mind.
            </p>
            <p style={{ ...para, marginBottom: 0 }}>
              Today, Rob is the lead F1 Fantasy columnist for formula1.com, the official home of the sport, where his weekly Strategist Selection column helps fans decide who to pick, who to sell, and how to deploy their chips. His writing has also appeared in Motorsport.com, Motorsport Magazine, and across other motorsport publications. Along the way, he has had the chance to sit down with some of the sport's most respected voices, including Laura Winter, Lawrence Barretto, Alex Brundle, and Nate Saunders.
            </p>
          </div>

          {/* Section 5 — Get in Touch */}
          <div style={{ ...card, marginBottom: 0 }}>
            <div style={sectionLabel}>Get in Touch</div>
            <p style={{ ...para, marginBottom: '24px' }}>
              Whether it's a fantasy question, a collaboration idea, feedback on the site, or just a chat about the weekend's race, Rob is always happy to hear from the community.
            </p>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' as const }}>
              <a
                href="mailto:connect.f1fantasyhub@gmail.com"
                className="contact-btn"
                style={contactBtn}
              >
                <EnvelopeIcon />
                Email
              </a>
              <a
                href="https://www.youtube.com/@formulafantasyhub"
                target="_blank"
                rel="noopener noreferrer"
                className="contact-btn"
                style={contactBtn}
              >
                <PlayIcon />
                YouTube
              </a>
              <a
                href="https://x.com/F_FantasyHub"
                target="_blank"
                rel="noopener noreferrer"
                className="contact-btn"
                style={contactBtn}
              >
                <XIcon />
                X / Twitter
              </a>
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </>
  )
}
