import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import F1FantasyClient from './F1FantasyClient'

export const metadata: Metadata = {
  title: 'F1 Fantasy Strategy 2026 — Tips, Chip Guide & Scoring | Formula Hub',
  description: 'F1 Fantasy strategy, news and analysis for the 2026 season. Driver prices, chip timing, scoring breakdowns and expert transfer tips from Rob Beaumont.',
  alternates: { canonical: 'https://formulahub.live/f1-fantasy' },
  openGraph: {
    title: 'F1 Fantasy Strategy 2026 — Tips, Chip Guide & Scoring',
    description: 'F1 Fantasy strategy and analysis for the 2026 season. Driver prices, chip timing and expert tips from Rob Beaumont.',
    url: 'https://formulahub.live/f1-fantasy',
    siteName: 'Formula Hub',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@F_FantasyHub',
    creator: '@F_FantasyHub',
    description: 'F1 Fantasy strategy and analysis for the 2026 season. Driver prices, chip timing and expert tips from Rob Beaumont.',
  },
}

export default function F1FantasyPage() {
  return (
    <>
      <Navbar />
      <F1FantasyClient />
      <Footer />
    </>
  )
}
