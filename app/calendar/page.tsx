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
        <CalendarClient />
      </div>
      <Footer />
    </>
  )
}
