import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'

export default function RaceCenterPage() {
  return (
    <>
      <Navbar />
      <main className="mob-pad-page" style={{ position: 'relative', zIndex: 1, maxWidth: '1400px', margin: '0 auto', padding: '28px 32px 60px' }}>
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <div style={{ width: '3px', height: '24px', background: '#E8002D', borderRadius: '2px' }} />
            <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '2px', color: '#E8002D', textTransform: 'uppercase' as const }}>Premium</span>
          </div>
          <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '56px', letterSpacing: '1px', lineHeight: 1 }}>Race Center</div>
          <p style={{ color: '#5A6A7A', fontSize: '14px', marginTop: '8px', maxWidth: '500px', lineHeight: 1.7 }}>
            Interactive dashboards and tools for serious F1 Fantasy managers. Live data, lineup optimisers and strategy simulators.
          </p>
        </div>

        <div className="mob-1col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '32px' }}>
          {[
            { name: 'Lineup Optimizer', description: 'Automatically build the highest-scoring team within your budget, factoring in form, price, and fixture difficulty.', icon: '⚙️' },
            { name: 'Price Tracker', description: 'Track driver price movements over the season. See who\'s rising, who\'s falling, and get ahead of the changes.', icon: '📈' },
            { name: 'Points Simulator', description: 'Simulate different race outcomes and see how your fantasy score changes. Plan your captain pick with confidence.', icon: '🎯' },
            { name: 'Chip Planner', description: 'Map out your chip strategy for the whole season. See the optimal windows for Limitless, 3x Boost and Wildcard.', icon: '🗓️' },
          ].map(tool => (
            <div key={tool.name} style={{ background: '#0E1318', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <span style={{ fontSize: '32px' }}>{tool.icon}</span>
                <span style={{ fontSize: '10px', fontWeight: 700, padding: '3px 8px', borderRadius: '4px', background: 'rgba(232,0,45,0.15)', color: '#E8002D', textTransform: 'uppercase' as const }}>Coming Soon</span>
              </div>
              <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '22px', marginBottom: '8px' }}>{tool.name}</div>
              <p style={{ fontSize: '13px', color: '#5A6A7A', lineHeight: 1.6 }}>{tool.description}</p>
              <div style={{ marginTop: '16px', height: '2px', background: '#141B22', borderRadius: '1px', overflow: 'hidden' }}>
                <div style={{ width: '33%', height: '100%', background: '#E8002D', opacity: 0.4 }} />
              </div>
              <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#3A4A5A', marginTop: '6px' }}>In development</p>
            </div>
          ))}
        </div>

        <div style={{ background: 'rgba(232,0,45,0.06)', border: '1px solid rgba(232,0,45,0.2)', borderRadius: '14px', padding: '40px', textAlign: 'center' as const }}>
          <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '36px', marginBottom: '12px' }}>Get early access with Premium</div>
          <p style={{ color: '#5A6A7A', fontSize: '14px', lineHeight: 1.7, maxWidth: '480px', margin: '0 auto 24px' }}>
            Race Center tools will be available to Premium subscribers first. Join for €5/month and get full access when they launch.
          </p>
          <Link href="/subscribe" style={{ background: '#E8002D', color: 'white', padding: '12px 32px', borderRadius: '8px', textDecoration: 'none', fontWeight: 700, fontSize: '14px', boxShadow: '0 0 24px rgba(232,0,45,0.3)' }}>
            Subscribe for €5/month →
          </Link>
        </div>
      </main>
      <Footer />
    </>
  )
}
