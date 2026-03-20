import type { Metadata, Viewport } from 'next'
import './globals.css'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  title: 'Formula Hub — F1 Fantasy Strategy & Race Center',
  description: 'Expert F1 Fantasy picks, strategy guides, and race-week tools from Rob Beaumont — official F1 Fantasy columnist for formula1.com.',
  openGraph: {
    title: 'Formula Hub',
    description: 'Expert F1 Fantasy strategy from the world\'s leading F1 Fantasy creator.',
    url: 'https://formulahub.live',
    siteName: 'Formula Hub',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@F_FantasyHub',
    creator: '@F_FantasyHub',
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
