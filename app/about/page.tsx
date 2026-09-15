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
              Rob Beaumont grew up in Sydney, Australia, and played and watched a lot of sport as a kid. He moved overseas in late 2021, and his career has since taken him into Formula 1.
            </p>
            <p style={para}>
              He started watching F1 in 2016. Before long he was looking up lap times and tyre strategies after races and working out what each result meant for the championship. When he found F1 Fantasy, he started playing straight away.
            </p>
            <p style={{ ...para, marginBottom: 0 }}>
              He'd been playing fantasy sport for years before that. His first game was NRL Fantasy in 2008, and that's where he learned how to find value and follow form.
            </p>
            <div style={{ clear: 'both' }} />
          </div>

          {/* Section 2 — About Formula Hub */}
          <div style={card}>
            <div style={sectionLabel}>About Formula Hub</div>
            <p style={para}>
              Formula Hub is for any F1 fan, whether you follow every session or only catch the odd race. Race data, standings and F1 Fantasy strategy are all on the site, and it's set up to be easy to find your way around.
            </p>
            <p style={{ ...para, marginBottom: 0 }}>
              More is being added over time, for both the racing and F1 Fantasy.
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
              Rob started Formula Fantasy Hub in 2022. Not many people were making content just about F1 Fantasy at the time, so he decided to have a go.
            </p>
            <p style={para}>
              It's now the most followed dedicated F1 Fantasy community on YouTube and X, and he has put out content every race week since it began.
            </p>
            <p style={para}>
              The people in the community are a big part of it. Members share tips and talk through their teams, and new players get plenty of help.
            </p>
            <p style={{ ...para, marginBottom: 0 }}>
              The game has also grown a lot since 2022, with more players and more people making content about it.
            </p>
            <div style={{ clear: 'both' }} />
          </div>

          {/* Section 4 — The Writing */}
          <div style={card}>
            <div style={sectionLabel}>The Writing</div>
            <p style={para}>
              Rob has been writing about sport since he was a kid. He used to write down scores and match reports in notebooks, read the stats in the newspaper's sports section, and commentate games at home.
            </p>
            <p style={para}>
              He likes working with data and explaining it in a way that's easy to follow, especially for people deciding on their fantasy team.
            </p>
            <p style={{ ...para, marginBottom: 0 }}>
              He is now the lead F1 Fantasy columnist for formula1.com and writes the weekly Strategist Selection column, which covers who to pick, who to sell and when to use chips. He has also written for Motorsport.com, Motorsport Magazine and other publications, and has interviewed Laura Winter, Lawrence Barretto, Alex Brundle and Nate Saunders.
            </p>
          </div>

          {/* Section 5 — Get in Touch */}
          <div style={{ ...card, marginBottom: 0 }}>
            <div style={sectionLabel}>Get in Touch</div>
            <p style={{ ...para, marginBottom: '24px' }}>
              If you have a fantasy question, an idea for a collaboration, feedback on the site, or just want to talk about the race, you can reach Rob through any of the links below.
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
