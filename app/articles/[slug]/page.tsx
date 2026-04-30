import { notFound } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { articles, getArticleBySlug } from '@/lib/articles'

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }))
}

const categoryColors: Record<string, { color: string; bg: string }> = {
  'Race Preview':  { color: '#E8002D', bg: 'rgba(232,0,45,0.12)' },
  'Race Review':   { color: '#FFB800', bg: 'rgba(255,184,0,0.12)' },
  'Strategy':      { color: '#00A8FF', bg: 'rgba(0,168,255,0.12)' },
  'Price Changes': { color: '#00D47E', bg: 'rgba(0,212,126,0.12)' },
  'Data Analysis': { color: '#FF69B4', bg: 'rgba(255,105,180,0.12)' },
  'News':          { color: '#C0C0C0', bg: 'rgba(192,192,192,0.12)' },
  'Technical':     { color: '#38BDF8', bg: 'rgba(56,189,248,0.12)' },
}

export default function ArticlePage({ params }: { params: { slug: string } }) {
  const article = getArticleBySlug(params.slug)
  if (!article) notFound()

  const userIsPremium = false
  const showGate = article.premium && !userIsPremium
  const cat = categoryColors[article.category] || { color: '#5A6A7A', bg: 'rgba(255,255,255,0.08)' }
  const related = articles.filter(a => a.slug !== article.slug && a.category === article.category).slice(0, 2)
  const otherArticles = articles.filter(a => a.slug !== article.slug).slice(0, 3)

  // Parse content into sections
  const renderContent = (content: string) => {
    return content.split('\n\n').map((block, i) => {
      if (block.startsWith('**') && block.endsWith('**')) {
        return (
          <h2 key={i} style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '28px', letterSpacing: '0.5px', color: '#F0F4F8', marginTop: '40px', marginBottom: '16px', paddingBottom: '10px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
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
        <p key={i} style={{ fontSize: '16px', color: '#8A9AB0', lineHeight: 1.85, marginBottom: '20px' }}>
          {block}
        </p>
      )
    })
  }

  return (
    <>
      <Navbar />
      <main style={{ position: 'relative', zIndex: 1 }}>

        {/* Hero thumbnail */}
        <div style={{ height: '320px', background: article.thumbnail, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ position: 'absolute', inset: 0, background: article.thumbnailBg, opacity: 0.6 }} />
          {/^[a-z]{2}$/.test(article.thumbnailIcon)
            ? <span className={`fi fi-${article.thumbnailIcon}`} style={{ width: '180px', height: '120px', display: 'inline-block', borderRadius: '8px', position: 'relative', zIndex: 1, boxShadow: '0 8px 32px rgba(0,0,0,0.6)' }} />
            : <span style={{ fontSize: '120px', position: 'relative', zIndex: 1, filter: 'drop-shadow(0 8px 32px rgba(0,0,0,0.6))' }}>{article.thumbnailIcon}</span>
          }
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '160px', background: 'linear-gradient(transparent, #080C10)', zIndex: 2 }} />
        </div>

        {/* Article content */}
        <div className="mob-pad-article" style={{ maxWidth: '760px', margin: '0 auto', padding: '0 32px 80px', position: 'relative', zIndex: 3, marginTop: '-40px' }}>

          {/* Tags */}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap' as const }}>
            <span style={{ fontSize: '10px', fontWeight: 700, padding: '4px 12px', borderRadius: '20px', background: cat.bg, color: cat.color, textTransform: 'uppercase' as const, letterSpacing: '0.5px' }}>{article.tag}</span>
            {article.premium
              ? <span style={{ fontSize: '10px', fontWeight: 700, padding: '4px 12px', borderRadius: '20px', background: 'rgba(232,0,45,0.15)', color: '#E8002D', textTransform: 'uppercase' as const }}>Premium</span>
              : <span style={{ fontSize: '10px', fontWeight: 700, padding: '4px 12px', borderRadius: '20px', background: 'rgba(0,212,126,0.12)', color: '#00D47E', textTransform: 'uppercase' as const }}>Free</span>
            }
            <span style={{ fontSize: '11px', color: '#3A4A5A', marginLeft: 'auto', fontFamily: 'JetBrains Mono, monospace' }}>⏱ {article.readTime} min read</span>
          </div>

          {/* Title */}
          <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(2rem,5vw,3.2rem)', lineHeight: 1.05, letterSpacing: '0.5px', marginBottom: '24px', color: '#F0F4F8' }}>
            {article.title}
          </h1>

          {/* Byline */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 0', marginBottom: '32px', borderTop: '1px solid rgba(255,255,255,0.07)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg,#E8002D,#FF6B6B)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: 700, color: 'white', flexShrink: 0 }}>R</div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: '#F0F4F8' }}>Rob Beaumont</div>
              <div style={{ fontSize: '12px', color: '#5A6A7A' }}>{article.date}</div>
            </div>
          </div>

          {/* Excerpt callout */}
          <div style={{ background: 'rgba(232,0,45,0.06)', border: '1px solid rgba(232,0,45,0.2)', borderLeft: '3px solid #E8002D', borderRadius: '8px', padding: '16px 20px', marginBottom: '32px' }}>
            <p style={{ fontSize: '15px', color: '#8A9AB0', lineHeight: 1.7, margin: 0, fontStyle: 'italic' }}>{article.excerpt}</p>
          </div>

          {/* Content */}
          {showGate ? (
            <div>
              {renderContent(article.content.split('\n\n').slice(0, 2).join('\n\n'))}
              {/* Premium gate */}
              <div style={{ background: 'linear-gradient(180deg, rgba(8,12,16,0) 0%, #080C10 60%)', position: 'relative', marginTop: '-40px', paddingTop: '40px' }}>
                <div style={{ background: '#0E1318', border: '1px solid rgba(232,0,45,0.3)', borderRadius: '16px', padding: '40px', textAlign: 'center' as const }}>
                  <div style={{ fontSize: '40px', marginBottom: '16px' }}>🔒</div>
                  <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '32px', marginBottom: '8px' }}>Premium Article</div>
                  <p style={{ color: '#5A6A7A', fontSize: '14px', lineHeight: 1.7, maxWidth: '400px', margin: '0 auto 24px' }}>
                    Full strategy breakdown, price change analysis, lineup recommendations and chip timing — all for €5/month.
                  </p>
                  <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' as const }}>
                    <Link href="/subscribe" style={{ background: '#E8002D', color: 'white', padding: '12px 28px', borderRadius: '8px', textDecoration: 'none', fontWeight: 700, fontSize: '14px', boxShadow: '0 0 24px rgba(232,0,45,0.3)' }}>
                      Subscribe for €5/month →
                    </Link>
                    <Link href="/articles" style={{ background: 'transparent', color: '#5A6A7A', padding: '12px 24px', borderRadius: '8px', textDecoration: 'none', fontWeight: 600, fontSize: '14px', border: '1px solid rgba(255,255,255,0.1)' }}>
                      Browse free articles
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div>{renderContent(article.content)}</div>
          )}

          {/* Related articles */}
          {otherArticles.length > 0 && (
            <div style={{ marginTop: '48px' }}>
              <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '28px', letterSpacing: '1px', marginBottom: '16px' }}>More Articles</div>
              <div className="mob-1col" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '12px' }}>
                {otherArticles.map(a => {
                  const c = categoryColors[a.category] || { color: '#5A6A7A', bg: 'rgba(255,255,255,0.08)' }
                  return (
                    <Link key={a.slug} href={`/articles/${a.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                      <div style={{ background: '#0E1318', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', overflow: 'hidden' }}>
                        <div style={{ height: '80px', background: a.thumbnail, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                          <div style={{ position: 'absolute', inset: 0, background: a.thumbnailBg, opacity: 0.6 }} />
                          {/^[a-z]{2}$/.test(a.thumbnailIcon)
                            ? <span className={`fi fi-${a.thumbnailIcon}`} style={{ width: '48px', height: '32px', display: 'inline-block', borderRadius: '4px', position: 'relative', zIndex: 1 }} />
                            : <span style={{ fontSize: '32px', position: 'relative', zIndex: 1 }}>{a.thumbnailIcon}</span>
                          }
                        </div>
                        <div style={{ padding: '12px' }}>
                          <span style={{ fontSize: '9px', fontWeight: 700, padding: '2px 6px', borderRadius: '4px', background: c.bg, color: c.color, textTransform: 'uppercase' as const }}>{a.tag}</span>
                          <p style={{ fontSize: '12px', fontWeight: 600, lineHeight: 1.4, marginTop: '6px', color: '#F0F4F8' }}>{a.title.slice(0, 60)}...</p>
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          )}

        </div>
      </main>
      <Footer />
    </>
  )
}
