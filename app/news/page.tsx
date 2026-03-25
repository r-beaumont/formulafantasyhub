'use client'

import { useState } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { articles } from '@/lib/articles'

const categoryColors: Record<string, { color: string; bg: string }> = {
  'Race Preview':  { color: '#E8002D', bg: 'rgba(232,0,45,0.12)' },
  'Race Review':   { color: '#FFB800', bg: 'rgba(255,184,0,0.12)' },
  'Strategy':      { color: '#00A8FF', bg: 'rgba(0,168,255,0.12)' },
  'Price Changes': { color: '#00D47E', bg: 'rgba(0,212,126,0.12)' },
  'Data Analysis': { color: '#FF69B4', bg: 'rgba(255,105,180,0.12)' },
  'News':          { color: '#C0C0C0', bg: 'rgba(192,192,192,0.12)' },
}

type TagFilter = 'All' | 'F1 Fantasy' | 'F1'

function ThumbnailIcon({ icon, size }: { icon: string; size: number }) {
  const isFlag = /^[a-z]{2}$/.test(icon)
  if (isFlag) {
    return <span className={`fi fi-${icon}`} style={{ width: `${size * 0.9}px`, height: `${size * 0.65}px`, display: 'inline-block', borderRadius: '4px', position: 'relative', zIndex: 1 }} />
  }
  return <span style={{ fontSize: `${size}px`, position: 'relative', zIndex: 1, filter: 'drop-shadow(0 4px 24px rgba(0,0,0,0.5))' }}>{icon}</span>
}

export default function NewsPage() {
  const [activeTag, setActiveTag] = useState<TagFilter>('All')

  const featured = articles[0]
  const rest = articles.slice(1)

  const filtered = activeTag === 'All' ? rest : rest.filter(a => a.articleType === activeTag)
  const free = filtered.filter(a => !a.premium)

  return (
    <>
      <Navbar />
      <main className="mob-pad-page" style={{ position: 'relative', zIndex: 1, maxWidth: '1400px', margin: '0 auto', padding: '28px 32px 60px' }}>

        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <div style={{ width: '3px', height: '24px', background: '#E8002D', borderRadius: '2px' }} />
            <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '2px', color: '#E8002D', textTransform: 'uppercase' }}>News</span>
          </div>
          <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '56px', letterSpacing: '1px', lineHeight: 1 }}>Latest News</div>
          <p style={{ color: '#5A6A7A', fontSize: '13px', marginTop: '8px' }}>F1 Fantasy strategy, news and analysis from Rob Beaumont — official columnist for formula1.com</p>
        </div>

        {/* Tag filter */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '28px', flexWrap: 'wrap' }}>
          {(['All', 'F1 Fantasy', 'F1'] as TagFilter[]).map(tag => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              style={{
                background: activeTag === tag
                  ? (tag === 'F1 Fantasy' ? '#E8002D' : tag === 'F1' ? '#00A8FF' : '#E8002D')
                  : '#141B22',
                color: activeTag === tag ? 'white' : '#5A6A7A',
                border: '1px solid',
                borderColor: activeTag === tag
                  ? (tag === 'F1 Fantasy' ? '#E8002D' : tag === 'F1' ? '#00A8FF' : '#E8002D')
                  : 'rgba(255,255,255,0.1)',
                padding: '6px 16px',
                borderRadius: '20px',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: 700,
                letterSpacing: '0.3px',
              }}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* FEATURED */}
        {(activeTag === 'All' || featured.articleType === activeTag) && (
          <Link href={`/news/${featured.slug}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block', marginBottom: '28px' }}>
            <div className="mob-1col" style={{
              background: '#0E1318', border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: '16px', overflow: 'hidden', display: 'grid',
              gridTemplateColumns: '1fr 1fr', cursor: 'pointer',
              transition: 'border-color 0.2s',
            }}>
              {/* Left — big thumbnail */}
              <div className="mob-featured-thumb" style={{ height: '340px', background: featured.thumbnail, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ position: 'absolute', inset: 0, background: featured.thumbnailBg }} />
                <ThumbnailIcon icon={featured.thumbnailIcon} size={100} />
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '100px', background: 'linear-gradient(transparent,rgba(14,19,24,0.95))', zIndex: 2 }} />
                {/* Latest badge */}
                <div style={{ position: 'absolute', top: '16px', left: '16px', zIndex: 3 }}>
                  <span style={{ fontSize: '10px', fontWeight: 700, padding: '4px 10px', borderRadius: '20px', background: '#E8002D', color: 'white', textTransform: 'uppercase', letterSpacing: '1px' }}>Latest</span>
                </div>
              </div>
              {/* Right — content */}
              <div style={{ padding: '40px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '16px' }}>
                  <span style={{ fontSize: '10px', fontWeight: 700, padding: '3px 10px', borderRadius: '20px', background: featured.articleType === 'F1 Fantasy' ? 'rgba(232,0,45,0.15)' : 'rgba(0,168,255,0.15)', color: featured.articleType === 'F1 Fantasy' ? '#E8002D' : '#00A8FF', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{featured.articleType}</span>
                  <span style={{ fontSize: '10px', fontWeight: 700, padding: '3px 10px', borderRadius: '20px', background: categoryColors[featured.category]?.bg || 'rgba(255,255,255,0.1)', color: categoryColors[featured.category]?.color || '#F0F4F8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{featured.tag}</span>
                  {featured.premium && <span style={{ fontSize: '10px', fontWeight: 700, padding: '3px 10px', borderRadius: '20px', background: 'rgba(232,0,45,0.15)', color: '#E8002D', textTransform: 'uppercase' }}>Premium</span>}
                  <span style={{ fontSize: '11px', color: '#3A4A5A', marginLeft: 'auto', fontFamily: 'JetBrains Mono, monospace' }}>⏱ {featured.readTime} min read</span>
                </div>
                <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '36px', lineHeight: 1.1, marginBottom: '16px', color: '#F0F4F8', letterSpacing: '0.5px' }}>
                  {featured.title}
                </h2>
                <p style={{ color: '#5A6A7A', fontSize: '14px', lineHeight: 1.7, marginBottom: '24px' }}>{featured.excerpt}</p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg,#E8002D,#FF6B6B)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 700, color: 'white' }}>R</div>
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: 600 }}>Rob Beaumont</div>
                      <div style={{ fontSize: '11px', color: '#3A4A5A' }}>{featured.date}</div>
                    </div>
                  </div>
                  <span style={{ fontSize: '13px', color: '#E8002D', fontWeight: 600 }}>Read article →</span>
                </div>
              </div>
            </div>
          </Link>
        )}

        {/* FREE NEWS */}
        {free.length > 0 && (
          <section style={{ marginBottom: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '24px', letterSpacing: '1px' }}>Free Articles</span>
                <span style={{ fontSize: '10px', fontWeight: 700, padding: '3px 10px', borderRadius: '20px', background: 'rgba(0,212,126,0.12)', color: '#00D47E' }}>No subscription needed</span>
              </div>
            </div>
            <div className="mob-1col" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px' }}>
              {free.map(a => <NewsCard key={a.slug} article={a} />)}
            </div>
          </section>
        )}

        {/* UPGRADE PACKAGE INCOMING — replaces premium section */}
        {(activeTag === 'All' || activeTag === 'F1 Fantasy') && (
          <section>
            <div style={{ background: 'linear-gradient(135deg, rgba(232,0,45,0.08) 0%, rgba(14,19,24,1) 100%)', border: '1px solid rgba(232,0,45,0.25)', borderRadius: '16px', padding: '48px 40px', textAlign: 'center' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🚀</div>
              <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '48px', letterSpacing: '2px', color: '#F0F4F8', marginBottom: '8px', lineHeight: 1 }}>UPGRADE PACKAGE INCOMING</div>
              <p style={{ color: '#5A6A7A', fontSize: '14px', lineHeight: 1.7, maxWidth: '480px', margin: '0 auto 32px' }}>
                Premium analysis, price change alerts, chip timing guides and race week strategies. Full access from €5/month — launching soon.
              </p>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '32px' }}>
                <Link href="/subscribe" style={{ background: '#E8002D', color: 'white', padding: '12px 28px', borderRadius: '8px', textDecoration: 'none', fontWeight: 700, fontSize: '14px', boxShadow: '0 0 24px rgba(232,0,45,0.3)' }}>
                  Get Early Access →
                </Link>
              </div>
              <div className="mob-2col" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '12px', textAlign: 'left' }}>
                {[
                  { icon: '📊', title: 'Price Change Alerts', desc: 'Get ahead of price movements before the deadline closes.' },
                  { icon: '🎯', title: 'Chip Timing Guides', desc: 'Exactly when to play each chip for maximum return.' },
                  { icon: '🏆', title: 'Race Week Previews', desc: 'Full strategy breakdown before every race weekend.' },
                ].map(f => (
                  <div key={f.title} style={{ background: '#0E1318', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', padding: '20px' }}>
                    <div style={{ fontSize: '24px', marginBottom: '10px' }}>{f.icon}</div>
                    <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '18px', color: '#F0F4F8', marginBottom: '6px' }}>{f.title}</div>
                    <div style={{ fontSize: '12px', color: '#5A6A7A', lineHeight: 1.5 }}>{f.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

      </main>
      <Footer />
    </>
  )
}

function NewsCard({ article }: { article: any }) {
  const cat = categoryColors[article.category] || { color: '#5A6A7A', bg: 'rgba(255,255,255,0.08)' }
  return (
    <Link href={`/news/${article.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div style={{
        background: '#0E1318', border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: '14px', overflow: 'hidden', cursor: 'pointer', height: '100%',
        display: 'flex', flexDirection: 'column',
        transition: 'border-color 0.2s, transform 0.2s',
      }}>
        {/* Thumbnail */}
        <div style={{ height: '160px', background: article.thumbnail, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <div style={{ position: 'absolute', inset: 0, background: article.thumbnailBg, opacity: 0.7 }} />
          <ThumbnailIcon icon={article.thumbnailIcon} size={56} />
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '60px', background: 'linear-gradient(transparent,rgba(14,19,24,0.95))', zIndex: 1 }} />
        </div>
        {/* Content */}
        <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '9px', fontWeight: 700, padding: '2px 8px', borderRadius: '20px', background: article.articleType === 'F1 Fantasy' ? 'rgba(232,0,45,0.15)' : 'rgba(0,168,255,0.15)', color: article.articleType === 'F1 Fantasy' ? '#E8002D' : '#00A8FF', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{article.articleType}</span>
            <span style={{ fontSize: '9px', fontWeight: 700, padding: '2px 8px', borderRadius: '20px', background: cat.bg, color: cat.color, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{article.tag}</span>
            <span style={{ fontSize: '10px', color: '#3A4A5A', marginLeft: 'auto', fontFamily: 'JetBrains Mono, monospace' }}>⏱ {article.readTime}m</span>
          </div>
          <h3 style={{ fontSize: '14px', fontWeight: 700, lineHeight: 1.4, marginBottom: '8px', flex: 1, color: '#F0F4F8' }}>{article.title}</h3>
          <p style={{ fontSize: '12px', color: '#5A6A7A', lineHeight: 1.6, marginBottom: '12px' }}>{article.excerpt.slice(0, 80)}...</p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#3A4A5A' }}>{article.date}</span>
            <span style={{ fontSize: '12px', color: '#E8002D', fontWeight: 600 }}>Read →</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
