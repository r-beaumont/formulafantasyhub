import type { Metadata, Viewport } from 'next'
import './globals.css'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  metadataBase: new URL('https://formulahub.live'),
  title: 'Formula Hub — F1 Fantasy Strategy & Race Center',
  description: 'Formula 1 data, analysis and strategy — all in one place. Race results, championship standings, and tools to succeed in F1 Fantasy from Rob Beaumont.',
  alternates: { canonical: 'https://formulahub.live' },
  openGraph: {
    title: 'Formula Hub',
    description: 'Formula 1 data, analysis and strategy — all in one place.',
    url: 'https://formulahub.live',
    siteName: 'Formula Hub',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@F_FantasyHub',
    creator: '@F_FantasyHub',
    description: 'Formula 1 data, analysis and strategy — all in one place.',
  },
  verification: {
    google: 'SYADByLJyBhRA4RfYWdOW3ntNwDjkPEFPSQD1T2Hnys',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Formula Hub',
  url: 'https://formulahub.live',
  description: 'F1 race data, championship standings and fantasy strategy from Rob Beaumont',
  author: {
    '@type': 'Person',
    name: 'Rob Beaumont',
    url: 'https://formulahub.live',
  },
  publisher: {
    '@type': 'Organization',
    name: 'Formula Hub',
    url: 'https://formulahub.live',
  },
  potentialAction: {
    '@type': 'SearchAction',
    target: 'https://formulahub.live/race-hub',
    'query-input': 'required name=search_term_string',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600;800&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet" />
        <link rel="icon" href="/logo.png" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        {/* Flag emoji polyfill for Chrome/Edge on Windows */}
        <script type="module" dangerouslySetInnerHTML={{ __html: `
          import { polyfillCountryFlagEmojis } from "https://cdn.skypack.dev/country-flag-emoji-polyfill";
          polyfillCountryFlagEmojis();
        `}} />
        {children}
      </body>
    </html>
  )
}
