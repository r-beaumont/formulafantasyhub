import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import StandingsClient from './StandingsClient'

export const metadata: Metadata = {
  title: 'F1 Championship Standings 2026 — Drivers & Constructors | Formula Hub',
  description: 'Up-to-date F1 driver and constructor championship standings for the 2026 Formula 1 season. Points, wins, podiums and more.',
  alternates: { canonical: 'https://formulahub.live/standings' },
  openGraph: {
    title: 'F1 Championship Standings 2026 — Drivers & Constructors',
    description: 'Up-to-date F1 driver and constructor championship standings for the 2026 Formula 1 season.',
    url: 'https://formulahub.live/standings',
    siteName: 'Formula Hub',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@F_FantasyHub',
    creator: '@F_FantasyHub',
    description: 'Up-to-date F1 driver and constructor championship standings for the 2026 Formula 1 season.',
  },
}

export default function StandingsPage() {
  return (
    <>
      <Navbar />
      <StandingsClient />
      <Footer />
    </>
  )
}
