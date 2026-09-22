import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import NewsListingClient from '@/components/news/NewsListingClient'
import type { ArticleSummary } from '@/components/news/shared'
import { articles } from '@/lib/articles'

export const metadata: Metadata = {
  title: 'Latest News — F1 & F1 Fantasy Analysis | Formula Hub',
  description: 'F1 and F1 Fantasy news, analysis and insights from Rob Beaumont — official F1 Fantasy columnist for formula1.com.',
  alternates: { canonical: 'https://formulahub.live/news' },
  openGraph: {
    title: 'Latest News — F1 & F1 Fantasy Analysis',
    description: 'F1 and F1 Fantasy news, analysis and insights from Rob Beaumont.',
    url: 'https://formulahub.live/news',
    siteName: 'Formula Hub',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@F_FantasyHub',
    creator: '@F_FantasyHub',
    description: 'F1 and F1 Fantasy news, analysis and insights from Rob Beaumont.',
  },
}

export default function NewsPage() {
  // Strip the (large) `content` field — the listing only needs summaries,
  // and this keeps the full article bodies out of the client bundle.
  const summaries: ArticleSummary[] = articles.map(a => ({
    slug: a.slug,
    title: a.title,
    excerpt: a.excerpt,
    date: a.date,
    tag: a.tag,
    category: a.category,
    articleType: a.articleType,
    thumbnailImage: a.thumbnailImage,
    thumbnailIcon: a.thumbnailIcon,
    readTime: a.readTime,
  }))

  return (
    <>
      <Navbar />
      <main className="mob-pad-page" style={{ position: 'relative', zIndex: 1, maxWidth: '1400px', margin: '0 auto', padding: '28px 32px 60px' }}>

        {/* Header */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <div style={{ width: '3px', height: '24px', background: '#E8002D', borderRadius: '2px' }} />
            <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '2px', color: '#E8002D', textTransform: 'uppercase' }}>News</span>
          </div>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(2.5rem,5vw,3.5rem)', lineHeight: 1, marginBottom: '8px' }}>Latest News</div>
          <p style={{ color: 'var(--muted)', fontSize: '14px', maxWidth: '600px', lineHeight: 1.6 }}>F1 and F1 Fantasy news, analysis and insights.</p>
        </div>

        <NewsListingClient articles={summaries} />

      </main>
      <Footer />
    </>
  )
}
