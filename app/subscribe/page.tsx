import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'

const features = [
  { name: 'Race previews & reviews', free: true },
  { name: 'Full race strategy guides', free: false },
  { name: 'Driver price change tracker', free: false },
  { name: 'Lineup optimiser tool', free: false },
  { name: 'Points simulator', free: false },
  { name: 'Race weekend dashboard', free: false },
  { name: 'Chip timing analysis', free: false },
  { name: 'F1.com column access', free: true },
]

const faqs = [
  { q: 'How does billing work?', a: 'You\'re billed €5 per month. Cancel at any time — no questions asked.' },
  { q: 'When does new content go live?', a: 'Strategy guides every Wednesday before a race weekend. Price change updates Thursday–Saturday. Race review Sunday evening.' },
  { q: 'Who writes the content?', a: 'All content is written by Rob Beaumont, the official F1 Fantasy columnist for formula1.com.' },
  { q: 'What tools are included?', a: 'Price change tracker, lineup optimiser, points simulator, and the live Race Hub dashboard — all built specifically for F1 Fantasy managers.' },
]

export default function SubscribePage() {
  const card = { background: '#0E1318', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px' }

  return (
    <>
      <Navbar />
      <div style={{ position: 'relative', zIndex: 1, maxWidth: '1000px', margin: '0 auto', padding: '60px 32px' }}>

        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <div style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '2px', color: '#E8002D', textTransform: 'uppercase', marginBottom: '16px' }}>Premium Membership</div>
          <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(3rem,8vw,6rem)', lineHeight: 0.95, marginBottom: '24px' }}>
            Win your<br />mini-league.
          </div>
          <p style={{ color: '#5A6A7A', maxWidth: '500px', margin: '0 auto', lineHeight: 1.7 }}>
            Expert strategy, interactive tools, and race-week analysis from the world's
            leading F1 Fantasy creator — Rob Beaumont, official columnist for formula1.com.
          </p>
        </div>

        {/* Pricing cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '60px' }}>
          <div style={{ ...card, padding: '32px' }}>
            <div style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '2px', color: '#5A6A7A', textTransform: 'uppercase', marginBottom: '8px' }}>Free</div>
            <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '56px', lineHeight: 1 }}>€0</div>
            <div style={{ color: '#5A6A7A', fontSize: '13px', marginBottom: '32px' }}>per month, forever</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
              {features.map((f) => (
                <div key={f.name} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', color: f.free ? '#00D47E' : '#3A4A5A' }}>{f.free ? '✓' : '–'}</span>
                  <span style={{ fontSize: '13px', color: f.free ? '#F0F4F8' : '#3A4A5A' }}>{f.name}</span>
                </div>
              ))}
            </div>
            <Link href="/articles" style={{ display: 'block', textAlign: 'center', padding: '12px', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '8px', color: '#F0F4F8', textDecoration: 'none', fontSize: '13px', fontWeight: 600 }}>
              Read free articles
            </Link>
          </div>

          <div style={{ background: '#E8002D', borderRadius: '14px', padding: '32px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '160px', height: '160px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }} />
            <div style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '2px', color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', marginBottom: '8px' }}>Premium</div>
            <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '56px', lineHeight: 1, color: 'white' }}>€5</div>
            <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px', marginBottom: '32px' }}>per month · cancel anytime</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
              {features.map((f) => (
                <div key={f.name} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', color: 'white' }}>✓</span>
                  <span style={{ fontSize: '13px', color: 'white', fontWeight: 500 }}>{f.name}</span>
                </div>
              ))}
            </div>
            <button style={{ width: '100%', background: 'white', color: '#E8002D', border: 'none', borderRadius: '8px', padding: '14px', fontSize: '14px', fontWeight: 700, cursor: 'pointer', letterSpacing: '0.3px' }}>
              Subscribe now — €5/month
            </button>
            <div style={{ textAlign: 'center', marginTop: '12px', fontSize: '11px', color: 'rgba(255,255,255,0.6)' }}>Stripe · Secure payment · Cancel anytime</div>
          </div>
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
