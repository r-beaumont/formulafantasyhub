import type { Metadata, Viewport } from 'next'
import './globals.css'
import 'flag-icons/css/flag-icons.min.css'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  metadataBase: new URL('https://formulahub.live'),
  manifest: '/manifest.json',
  title: 'Formula Hub',
  description: 'F1 race data, championship standings and F1 Fantasy strategy from Rob Beaumont — official Formula 1 Fantasy columnist.',
  alternates: { canonical: 'https://formulahub.live' },
  openGraph: {
    title: 'Formula Hub',
    description: 'F1 race data, championship standings and F1 Fantasy strategy from Rob Beaumont.',
    url: 'https://formulahub.live',
    siteName: 'Formula Hub',
    type: 'website',
    images: [
      {
        url: 'https://formulahub.live/og/default',
        width: 1200,
        height: 630,
        alt: 'Formula Hub',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@F_FantasyHub',
    creator: '@F_FantasyHub',
    title: 'Formula Hub',
    description: 'F1 race data, championship standings and F1 Fantasy strategy from Rob Beaumont.',
    images: ['https://formulahub.live/og/default'],
  },
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/apple-touch-icon.png',
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
        <link rel="icon" type="image/png" href="/favicon.png" />
        <link rel="shortcut icon" href="/favicon.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#080C10" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="Formula Hub" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}
