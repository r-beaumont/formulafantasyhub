import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import CalendarClient from './CalendarClient'

export const metadata: Metadata = {
  title: '2026 F1 Racing Calendar — Session Times & Schedule',
  description: 'Full 2026 Formula 1 race calendar with session times, sprint weekends, and circuit information. All 22 rounds of the 2026 F1 season.',
  alternates: { canonical: 'https://formulahub.live/calendar' },
  openGraph: {
    title: '2026 F1 Racing Calendar — Session Times & Schedule',
    description: 'Full 2026 Formula 1 race calendar with session times, sprint weekends, and circuit information. All 22 rounds of the 2026 F1 season.',
    url: 'https://formulahub.live/calendar',
    siteName: 'Formula Hub',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@F_FantasyHub',
    creator: '@F_FantasyHub',
    description: 'Full 2026 Formula 1 race calendar with session times, sprint weekends, and circuit information. All 22 rounds of the 2026 F1 season.',
  },
}

export default function CalendarPage() {
  return (
    <>
      <Navbar />
      <div className="mob-pad" style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>
        <div style={{ marginBottom: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <div style={{ width: '3px', height: '24px', background: '#E8002D', borderRadius: '2px' }} />
            <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '2px', color: '#E8002D', textTransform: 'uppercase' }}>2026 Season</span>
          </div>
          <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(2.5rem,5vw,3.5rem)', lineHeight: 1, marginBottom: '8px' }}>Race Calendar</div>
          <p style={{ color: '#5A6A7A', fontSize: '14px', maxWidth: '600px', lineHeight: 1.6, margin: 0 }}>
            All 22 rounds of the 2026 Formula 1 season — session times, sprint weekends, and circuit details in one place.
          </p>
        </div>
        <CalendarClient />
      </div>
      <Footer />
    </>
  )
}
