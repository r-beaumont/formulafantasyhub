import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import AboutContent from '@/components/about/AboutContent'

export const metadata: Metadata = {
  title: 'About | Formula Hub',
  description: 'Rob Beaumont is the lead F1 Fantasy columnist for formula1.com. Learn about Formula Hub — your home for F1 race data, standings and fantasy strategy.',
  alternates: { canonical: 'https://formulahub.live/about' },
  openGraph: {
    title: 'About | Formula Hub',
    description: 'Rob Beaumont is the lead F1 Fantasy columnist for formula1.com. Learn about Formula Hub — your home for F1 race data, standings and fantasy strategy.',
    url: 'https://formulahub.live/about',
    siteName: 'Formula Hub',
    type: 'website',
    images: [{ url: 'https://formulahub.live/rob1.png', width: 1200, height: 630, alt: 'Rob Beaumont' }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@F_FantasyHub',
    creator: '@F_FantasyHub',
    title: 'About | Formula Hub',
    description: 'Rob Beaumont is the lead F1 Fantasy columnist for formula1.com. Learn about Formula Hub.',
    images: ['https://formulahub.live/rob1.png'],
  },
}

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main style={{ position: 'relative', zIndex: 1 }}>
        <AboutContent />
      </main>
      <Footer />
    </>
  )
}
