import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import VideosClient from './VideosClient'

export const metadata: Metadata = {
  title: 'F1 Fantasy Videos & Analysis 2026 | Formula Hub',
  description: 'F1 Fantasy video analysis, race breakdowns and strategy guides for the 2026 season from Rob Beaumont, official F1 Fantasy columnist for formula1.com.',
  alternates: { canonical: 'https://formulahub.live/videos' },
  openGraph: {
    title: 'F1 Fantasy Videos & Analysis 2026',
    description: 'F1 Fantasy video analysis, race breakdowns and strategy guides for the 2026 season.',
    url: 'https://formulahub.live/videos',
    siteName: 'Formula Hub',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@F_FantasyHub',
    creator: '@F_FantasyHub',
    description: 'F1 Fantasy video analysis, race breakdowns and strategy guides for the 2026 season.',
  },
}

export default function VideosPage() {
  return (
    <>
      <Navbar />
      <VideosClient />
      <Footer />
    </>
  )
}
