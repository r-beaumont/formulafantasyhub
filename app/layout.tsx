import type { Metadata, Viewport } from 'next'
import './globals.css'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  title: 'Formula Hub — F1 Fantasy Strategy & Race Center',
  description: 'Formula 1 data, analysis and strategy — all in one place. Race results, championship standings, and F1 Fantasy tools from Rob Beaumont.',
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
