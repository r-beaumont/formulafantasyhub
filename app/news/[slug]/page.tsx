import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ShareBar from '@/components/ShareBar'
import Flag from '@/components/ui/Flag'
import SubscribeBox from '@/components/ui/SubscribeBox'
import { categoryTagStyle, typeTagStyle, FALLBACK_THUMBNAIL } from '@/components/news/shared'
import { articles, getArticleBySlug } from '@/lib/articles'

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }))
}

export async function generateMetadata(
  { params }: { params: { slug: string } }
): Promise<Metadata> {
  const article = getArticleBySlug(params.slug)
  if (!article) return {}

  const ogImage = article.ogImage ?? `https://formulahub.live/og/${article.slug}`

  return {
    title: `${article.title} | Formula Hub`,
    description: article.excerpt,
    alternates: { canonical: `https://formulahub.live/news/${article.slug}` },
    openGraph: {
      title: article.title,
      description: article.excerpt,
      url: `https://formulahub.live/news/${article.slug}`,
      siteName: 'Formula Hub',
      type: 'article',
      images: [{ url: ogImage, width: 1200, height: 630, alt: article.title }],
    },
    twitter: {
      card: 'summary_large_image',
      site: '@F_FantasyHub',
      creator: '@F_FantasyHub',
      title: article.title,
      description: article.excerpt,
      images: [ogImage],
    },
  }
}

function fmtDate(d: string) {
  const x = new Date(d)
  return isNaN(x.getTime()) ? d : x.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function NewsArticlePage({ params }: { params: { slug: string } }) {
  const article = getArticleBySlug(params.slug)
  if (!article) notFound()

  const otherArticles = article.relatedSlugs
    ? article.relatedSlugs.map(s => articles.find(a => a.slug === s)).filter((a): a is typeof articles[number] => !!a)
    : articles.filter(a => a.slug !== article.slug).slice(0, 3)

  // Content parsing logic is unchanged from before this restyle — only the
  // JSX style props below differ.
  const renderInline = (text: string): React.ReactNode => {
    const inlineRegex = /\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*/g
    if (!inlineRegex.test(text)) return text
    inlineRegex.lastIndex = 0
    const parts: React.ReactNode[] = []
    let lastIndex = 0
    let match
    while ((match = inlineRegex.exec(text)) !== null) {
      if (match.index > lastIndex) parts.push(text.slice(lastIndex, match.index))
      if (match[1] !== undefined) {
        parts.push(
          <a key={match.index} href={match[2]} target="_blank" rel="noopener noreferrer"
             style={{ color: '#E8002D', textDecoration: 'underline' }}>
            {match[1]}
          </a>
        )
      } else {
        parts.push(
          <strong key={match.index} style={{ color: 'var(--text)', fontWeight: 700 }}>
            {match[3]}
          </strong>
        )
      }
      lastIndex = match.index + match[0].length
    }
    if (lastIndex < text.length) parts.push(text.slice(lastIndex))
    return parts
  }

  const renderContent = (content: string) => {
    return content.split('\n\n').map((block, i) => {
      if (block.startsWith('**') && block.endsWith('**')) {
        return (
          <h2 key={i} style={{ fontFamily: "'Bebas Neue', sans-serif", fontWeight: 400, fontSize: '26px', letterSpacing: '1px', color: '#E8002D', marginTop: '30px', marginBottom: '10px' }}>
            {block.replace(/\*\*/g, '')}
          </h2>
        )
      }
      if (block.trim() === '---') {
        return <hr key={i} style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.08)', margin: '32px 0' }} />
      }
      if (block.startsWith('_') && block.endsWith('_')) {
        return (
          <p key={i} style={{ fontSize: '14px', color: '#6A7A8A', lineHeight: 1.7, marginBottom: '20px', fontStyle: 'italic', borderLeft: '3px solid rgba(255,255,255,0.1)', paddingLeft: '16px' }}>
            {block.slice(1, -1)}
          </p>
        )
      }
      if (block.trim() === '') return null
      return (
        <p key={i} style={{ fontSize: '16px', color: 'var(--text)', lineHeight: 1.8, marginBottom: '18px' }}>
          {renderInline(block)}
        </p>
      )
    })
  }

  const isHeroFlag = /^[a-z]{2}$/.test(article.thumbnailIcon)

  return (
    <>
      <Navbar />
      <main style={{ position: 'relative', zIndex: 1 }}>
        <div className="mob-pad-article" style={{ maxWidth: '760px', margin: '0 auto', padding: '40px 32px 80px' }}>

          <Link href="/news" style={{ fontSize: '12px', color: '#E8002D', fontWeight: 500, textDecoration: 'none' }}>← Latest News</Link>

          {/* Tags */}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '18px', marginBottom: '14px', flexWrap: 'wrap' }}>
            <span style={typeTagStyle(article.articleType)}>{article.articleType}</span>
            <span style={categoryTagStyle(article.category)}>{article.tag}</span>
            <span style={{ fontSize: '11px', color: 'var(--muted)' }}>{fmtDate(article.date)}</span>
            <span style={{ fontSize: '11px', color: 'var(--muted)' }}>· {article.readTime} min read</span>
          </div>

          {/* Title */}
          <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontWeight: 400, fontSize: 'clamp(44px,6vw,72px)', lineHeight: 0.95, margin: '14px 0', color: 'var(--text)' }}>
            {article.title}
          </h1>

          {/* Byline */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <Image src="/logo.png" alt="" width={28} height={28} style={{ borderRadius: '50%' }} />
            <b style={{ color: 'var(--text)', fontSize: '13px' }}>Rob Beaumont</b>
          </div>

          {/* Share bar — top */}
          <ShareBar title={article.title} slug={article.slug} showLabel={true} />

          {/* Hero image */}
          <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', borderRadius: '14px', overflow: 'hidden', marginBottom: '24px' }}>
            <Image src={article.thumbnailImage ?? FALLBACK_THUMBNAIL} alt="" fill style={{ objectFit: 'cover' }} priority />
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', zIndex: 1 }}>
              {isHeroFlag
                ? <Flag code={article.thumbnailIcon} size={64} />
                : <span style={{ fontSize: '64px', filter: 'drop-shadow(0 6px 20px rgba(0,0,0,.55))' }}>{article.thumbnailIcon}</span>}
            </div>
          </div>

          {/* Excerpt callout */}
          <div style={{ background: 'rgba(232,0,45,0.06)', border: '1px solid rgba(232,0,45,0.2)', borderLeft: '3px solid #E8002D', borderRadius: '8px', padding: '16px 20px', marginBottom: '32px' }}>
            <p style={{ fontSize: '15px', color: '#8A9AB0', lineHeight: 1.7, margin: 0, fontStyle: 'italic' }}>{article.excerpt}</p>
          </div>

          {/* Content */}
          <div className="body">{renderContent(article.content)}</div>

          {/* Share bar — bottom */}
          <ShareBar title={article.title} slug={article.slug} />

          {/* Related articles */}
          {otherArticles.length > 0 && (
            <div style={{ marginTop: '48px' }}>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontWeight: 400, fontSize: '28px', letterSpacing: '1px', marginBottom: '16px' }}>More News</div>
              <div className="mob-1col" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '12px' }}>
                {otherArticles.map(a => {
                  const isFlag = /^[a-z]{2}$/.test(a.thumbnailIcon)
                  return (
                    <Link key={a.slug} href={`/news/${a.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden' }}>
                        <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9' }}>
                          <Image src={a.thumbnailImage ?? FALLBACK_THUMBNAIL} alt="" fill loading="lazy" style={{ objectFit: 'cover' }} />
                          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', zIndex: 1 }}>
                            {isFlag
                              ? <Flag code={a.thumbnailIcon} size={22} />
                              : <span style={{ fontSize: '22px' }}>{a.thumbnailIcon}</span>}
                          </div>
                        </div>
                        <div style={{ padding: '12px' }}>
                          <div style={{ display: 'flex', gap: '4px', marginBottom: '6px', flexWrap: 'wrap' }}>
                            <span style={typeTagStyle(a.articleType)}>{a.articleType}</span>
                            <span style={categoryTagStyle(a.category)}>{a.tag}</span>
                          </div>
                          <p style={{ fontSize: '12px', fontWeight: 600, lineHeight: 1.4, marginTop: '4px', color: 'var(--text)' }}>{a.title}</p>
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          )}

          <div style={{ marginTop: '48px' }}>
            <SubscribeBox />
          </div>

        </div>
      </main>
      <Footer />
    </>
  )
}
