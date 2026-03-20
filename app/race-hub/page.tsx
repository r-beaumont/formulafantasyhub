import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import RaceHubClient from './RaceHubClient'

export const metadata: Metadata = {
  title: 'F1 Race Hub 2026 — Session Times, Results & Circuit Info | Formula Hub',
  description: 'Live F1 session times, race results, qualifying data and circuit information for every round of the 2026 Formula 1 season.',
  alternates: { canonical: 'https://formulahub.live/race-hub' },
  openGraph: {
    title: 'F1 Race Hub 2026 — Session Times, Results & Circuit Info',
    description: 'Live F1 session times, race results, qualifying data and circuit information for every round of the 2026 season.',
    url: 'https://formulahub.live/race-hub',
    siteName: 'Formula Hub',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@F_FantasyHub',
    creator: '@F_FantasyHub',
    description: 'Live F1 session times, race results, qualifying data and circuit information for every round of the 2026 season.',
  },
}

export default function RaceHubPage() {
  return (
    <>
      <Navbar />
      <RaceHubClient />
      <Footer />
    </>
  )
}
