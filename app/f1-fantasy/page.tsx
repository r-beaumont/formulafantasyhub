import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'

export default function F1FantasyPage() {
  const card = { background: '#0E1318', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', overflow: 'hidden' as const }

  return (
    <>
      <Navbar />
      <div style={{ position: 'relative', zIndex: 1, maxWidth: '1400px', margin: '0 auto', padding: '28px 32px 60px' }}>
        <div style={{ marginBottom: '28px' }}>
          <div style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '2px', color: '#E8002D', textTransform: 'uppercase' as const, marginBottom: '8px' }}>F1 Fantasy</div>
          <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '56px', letterSpacing: '1px', lineHeight: 1, marginBottom: '8px' }}>Strategy Centre</div>
          <div style={{ color: '#5A6A7A', fontSize: '13px' }}>Everything you need to dominate your mini-league in 2026</div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '24px' }}>
          {[
            { icon: '📖', title: 'Beginner\'s Guide', desc: 'New to F1 Fantasy? Start here. Learn the rules, scoring system, and basic strategy in under 10 minutes.', tag: 'Guide', tagC: '#00D47E', tagBg: 'rgba(0,212,126,0.12)', href: '/articles' },
            { icon: '💡', title: 'Chip Strategy 2026', desc: 'When to use Limitless, No Negative, Wildcard, and Extra DRS. Data-driven timing based on the 2026 calendar.', tag: 'Premium', tagC: '#FFB800', tagBg: 'rgba(255,184,0,0.12)', href: '/subscribe' },
            { icon: '💰', title: 'Price Change Guide', desc: 'How price changes work, when they apply, and how to position your squad to benefit from rising assets.', tag: 'Free', tagC: '#00D47E', tagBg: 'rgba(0,212,126,0.12)', href: '/articles' },
          ].map((item) => (
            <Link key={item.title} href={item.href} style={{ textDecoration: 'none' }}>
              <div style={{ ...card, padding: '24px', cursor: 'pointer', height: '100%' }}>
                <div style={{ fontSize: '32px', marginBottom: '16px' }}>{item.icon}</div>
                <div style={{ display: 'inline-block', fontSize: '10px', fontWeight: 600, padding: '3px 8px', borderRadius: '4px', background: item.tagBg, color: item.tagC, marginBottom: '12px', textTransform: 'uppercase' as const, letterSpacing: '0.5px' }}>{item.tag}</div>
                <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '22px', letterSpacing: '0.5px', marginBottom: '8px', color: '#F0F4F8' }}>{item.title}</div>
                <div style={{ color: '#5A6A7A', fontSize: '13px', lineHeight: 1.6 }}>{item.desc}</div>
              </div>
            </Link>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
          <div style={card}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px 12px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '1.5px', color: '#5A6A7A' }}>Season 2026 Value Rankings</span>
              <span style={{ fontSize: '10px', fontWeight: 600, padding: '3px 8px', borderRadius: '4px', background: 'rgba(255,184,0,0.12)', color: '#FFB800' }}>PPM</span>
            </div>
            <div style={{ padding: '16px 20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto auto auto', gap: '0 16px', fontSize: '10px', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '1px', color: '#5A6A7A', paddingBottom: '10px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                <span>#</span><span>Driver</span><span>Price</span><span>Pts</span><span>PPM</span>
              </div>
              {[
                { rank: 1, color: '#3671C6', name: 'M. Verstappen', team: 'Red Bull', price: '$30.5M', pts: 87, ppm: '1.43', highlight: true },
                { rank: 2, color: '#FF8000', name: 'L. Norris', team: 'McLaren', price: '$29.0M', pts: 74, ppm: '1.28', highlight: false },
                { rank: 3, color: '#E8002D', name: 'C. Sainz', team: 'Ferrari', price: '$22.0M', pts: 48, ppm: '1.09', highlight: false },
                { rank: 4, color: '#FF8000', name: 'O. Piastri', team: 'McLaren', price: '$26.0M', pts: 61, ppm: '1.17', highlight: false },
                { rank: 5, color: '#00C4B4', name: 'O. Bearman', team: 'Haas', price: '$14.2M', pts: 34, ppm: '1.06', highlight: false },
                { rank: 6, color: '#E8002D', name: 'C. Leclerc', team: 'Ferrari', price: '$25.5M', pts: 52, ppm: '1.02', highlight: false },
              ].map((d) => (
                <div key={d.name} style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto auto auto', gap: '0 16px', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: '#5A6A7A' }}>{d.rank}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: d.color }} />
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 500 }}>{d.name}</div>
                      <div style={{ fontSize: '11px', color: '#5A6A7A' }}>{d.team}</div>
                    </div>
                  </div>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', color: '#5A6A7A' }}>{d.price}</span>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', color: '#5A6A7A' }}>{d.pts}</span>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', fontWeight: 600, color: d.highlight ? '#FFB800' : '#5A6A7A' }}>{d.ppm}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ ...card, padding: '24px', background: '#E8002D', border: 'none' }}>
              <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '28px', color: 'white', marginBottom: '8px' }}>Go Premium</div>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '13px', lineHeight: 1.6, marginBottom: '20px' }}>Full strategy guides, lineup tools, and price change tracker for €5/month.</p>
              <Link href="/subscribe" style={{ display: 'block', textAlign: 'center', background: 'white', color: '#E8002D', padding: '10px', borderRadius: '8px', textDecoration: 'none', fontWeight: 700, fontSize: '13px' }}>
                Subscribe Now
              </Link>
            </div>
            <div style={{ ...card, padding: '24px' }}>
              <div style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '1.5px', color: '#5A6A7A', marginBottom: '16px' }}>Rob on F1.com</div>
              <p style={{ color: '#5A6A7A', fontSize: '13px', lineHeight: 1.6, marginBottom: '16px' }}>Read Rob's official F1 Fantasy column published every race week on formula1.com</p>
              <a href="https://www.formula1.com" target="_blank" rel="noopener noreferrer" style={{ color: '#E8002D', fontSize: '13px', fontWeight: 600, textDecoration: 'none' }}>Read on F1.com →</a>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
