import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Formula Hub Premium — F1 Fantasy Insider & Exclusive Insights',
  description: 'Premium F1 Fantasy strategy content and exclusive race analysis. Expert transfer tips, chip timing guides and in-depth race reviews. €5/month, cancel anytime.',
  alternates: { canonical: 'https://formulahub.live/subscribe' },
  openGraph: {
    title: 'Formula Hub Premium — F1 Fantasy Insider & Exclusive Insights',
    description: 'Premium F1 Fantasy strategy content and exclusive race analysis. Expert transfer tips, chip timing guides and in-depth race reviews. €5/month, cancel anytime.',
    url: 'https://formulahub.live/subscribe',
    siteName: 'Formula Hub',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@F_FantasyHub',
    creator: '@F_FantasyHub',
    description: 'Premium F1 Fantasy strategy content and exclusive race analysis. Expert transfer tips, chip timing guides and in-depth race reviews. €5/month, cancel anytime.',
  },
}

const freeItems = [
  { label: 'Race results & standings',        free: true  },
  { label: 'Racing calendar & session times', free: true  },
  { label: 'Public articles',                 free: true  },
  { label: 'Race Hub data',                   free: true  },
  { label: 'Fantasy Insider content',          free: false },
  { label: 'Exclusive Insights content',      free: false },
  { label: 'AI predictions & model showdown', free: false },
]

const groups = [
  {
    label: 'Fantasy Insider',
    color: '#FFB800',
    coming: false,
    items: [
      'Expert transfer analysis — weekly breakdown of the best value picks, price risers and differential options for every race',
      'Chip timing guide — data-driven breakdown of when to deploy each chip across the season based on circuit data',
      'Fantasy strategy articles — in-depth weekly content covering team selection, 2x Boost and scoring opportunities',
    ],
  },
  {
    label: 'Exclusive Insights',
    color: '#00A8FF',
    coming: false,
    items: [
      'Exclusive race reviews — in-depth post-race analysis beyond what\'s published publicly',
      'Insider Briefing — weekly premium newsletter covering the stories and strategy behind the headlines',
      'Live race dashboard — enhanced race-day view with live gaps, tyre age and pit window analysis',
      'Constructor strategy breakdown — detailed post-race analysis of team strategy decisions',
    ],
  },
  {
    label: 'Coming Soon',
    color: '#5A6A7A',
    coming: true,
    items: [
      'AI model showdown — GPT, Gemini and Claude each independently predict the top 5 qualifying and race results every weekend. Scores are tracked across the season to find the most accurate AI predictor of 2026.',
      'AI-recommended transfers — personalised weekly fantasy transfer suggestions powered by AI, based on your current team, budget and upcoming circuit',
    ],
  },
]

const faqs = [
  {
    q: 'How does billing work?',
    a: 'You are billed €5 per month. Cancel at any time — no questions asked, no hidden fees.',
  },
  {
    q: 'When does new content go live?',
    a: 'Race reviews go live on Sunday evenings after each Grand Prix. The Insider Briefing lands every Thursday. Tools to succeed in F1 Fantasy update after each race weekend deadline.',
  },
  {
    q: 'Who creates the content?',
    a: 'All content and analysis is produced by Rob Beaumont, the official F1 Fantasy columnist for formula1.com.',
  },
  {
    q: 'What tools are included?',
    a: 'Fantasy Insider content includes expert transfer analysis, chip timing guides and weekly fantasy strategy articles. Exclusive Insights includes in-depth race reviews, the Insider Briefing newsletter, live race dashboard, and constructor strategy breakdowns.',
  },
  {
    q: 'What is the AI model showdown?',
    a: 'Each race weekend, GPT, Gemini and Claude independently predict the top 5 qualifying and race results. After the session, their predictions are scored against the real results and the totals accumulate across the season — crowning the most accurate AI predictor of 2026. This feature is currently in development.',
  },
  {
    q: 'Will there be a Formula Hub app?',
    a: 'Yes — a Formula Hub app is planned. Members will get early access and push notifications for session times, results and fantasy deadlines.',
  },
]

export default function SubscribePage() {
  const card = { background: '#0E1318', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px' }

  return (
    <>
      <Navbar />
      <div className="mob-pad-sub" style={{ position: 'relative', zIndex: 1, maxWidth: '1000px', margin: '0 auto', padding: '60px 32px' }}>

        {/* Hero */}
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <div style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '2px', color: '#E8002D', textTransform: 'uppercase', marginBottom: '16px' }}>Premium Membership</div>
          <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(3rem,8vw,6rem)', lineHeight: 0.95, marginBottom: '24px' }}>
            The pitwall<br />in your pocket.
          </div>
          <p style={{ color: '#5A6A7A', maxWidth: '520px', margin: '0 auto', lineHeight: 1.7 }}>
            In-depth F1 analysis, exclusive race coverage, and smarter tools to succeed in F1 Fantasy — all in one place. From Rob Beaumont, official F1 Fantasy columnist for formula1.com.
          </p>
        </div>

        {/* Pricing cards */}
        <div className="mob-1col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '40px' }}>

          {/* Free card */}
          <div style={{ ...card, padding: '32px' }}>
            <div style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '2px', color: '#5A6A7A', textTransform: 'uppercase', marginBottom: '8px' }}>Free</div>
            <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '56px', lineHeight: 1 }}>€0</div>
            <div style={{ color: '#5A6A7A', fontSize: '13px', marginBottom: '32px' }}>per month, forever</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
              {freeItems.map((f) => (
                <div key={f.label} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', color: f.free ? '#00D47E' : '#3A4A5A', flexShrink: 0 }}>
                    {f.free ? '✓' : '🔒'}
                  </span>
                  <span style={{ fontSize: '13px', color: f.free ? '#F0F4F8' : '#3A4A5A' }}>{f.label}</span>
                </div>
              ))}
            </div>
            <Link href="/articles" style={{ display: 'block', textAlign: 'center', padding: '12px', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '8px', color: '#F0F4F8', textDecoration: 'none', fontSize: '13px', fontWeight: 600 }}>
              Read free articles
            </Link>
          </div>

          {/* Premium card */}
          <div style={{ background: '#E8002D', borderRadius: '14px', padding: '32px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '160px', height: '160px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }} />
            <div style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '2px', color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', marginBottom: '8px' }}>Premium</div>
            <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '56px', lineHeight: 1, color: 'white' }}>€5</div>
            <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px', marginBottom: '32px' }}>per month · cancel anytime</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
              {freeItems.map((f) => (
                <div key={f.label} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', color: 'white', flexShrink: 0 }}>✓</span>
                  <span style={{ fontSize: '13px', color: 'white', fontWeight: 500 }}>{f.label}</span>
                </div>
              ))}
            </div>
            <button style={{ width: '100%', background: 'white', color: '#E8002D', border: 'none', borderRadius: '8px', padding: '14px', fontSize: '14px', fontWeight: 700, cursor: 'pointer', letterSpacing: '0.3px' }}>
              Subscribe now — €5/month
            </button>
            <div style={{ textAlign: 'center', marginTop: '12px', fontSize: '11px', color: 'rgba(255,255,255,0.6)' }}>Stripe · Secure payment · Cancel anytime</div>
          </div>
        </div>

        {/* Detailed feature groups */}
        <div style={{ ...card, padding: '32px', marginBottom: '60px' }}>
          <div style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '2px', color: '#5A6A7A', textTransform: 'uppercase', marginBottom: '24px' }}>What's included in Premium</div>
          {groups.map((group, gi) => (
            <div key={group.label} style={{ borderTop: gi === 0 ? 'none' : '1px solid rgba(255,255,255,0.07)', paddingTop: gi === 0 ? '0' : '24px', marginTop: gi === 0 ? '0' : '24px' }}>
              <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: group.color, borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '16px', marginBottom: '16px' }}>{group.label}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {group.items.map((item) => (
                  <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <span style={{ fontSize: '13px', flexShrink: 0, marginTop: '1px' }}>{group.coming ? '⏳' : '✓'}</span>
                    <span style={{ fontSize: '13px', color: group.coming ? '#5A6A7A' : '#F0F4F8', lineHeight: 1.6 }}>
                      {item}
                      {group.coming && (
                        <span style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)', fontSize: '9px', padding: '2px 6px', borderRadius: '4px', marginLeft: '6px', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase', display: 'inline-block', verticalAlign: 'middle' }}>Soon</span>
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div style={{ marginBottom: '60px' }} id="faq">
          <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '28px', letterSpacing: '1px', marginBottom: '24px' }}>FAQ</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {faqs.map((f) => (
              <div key={f.q} style={{ ...card, padding: '20px 24px' }}>
                <div style={{ fontWeight: 600, marginBottom: '8px' }}>{f.q}</div>
                <div style={{ color: '#5A6A7A', fontSize: '14px', lineHeight: 1.6 }}>{f.a}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
      <Footer />
    </>
  )
}
