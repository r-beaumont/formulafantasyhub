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

export default function ArticlesPage() {
  const featured = articles[articles.length - 1] // most recent
  const rest = articles.slice(0, -1).reverse()
  const free = rest.filter(a => !a.premium)
  const premium = rest.filter(a => a.premium)

  return (
    <>
      <Navbar />
      <main style={{ position: 'relative', zIndex: 1, maxWidth: '1400px', margin: '0 auto', padding: '28px 32px 60px' }}>

        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <div style={{ width: '3px', height: '24px', background: '#E8002D', borderRadius: '2px' }} />
            <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '2px', color: '#E8002D', textTransform: 'uppercase' as const }}>Articles</span>
          </div>
          <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '56px', letterSpacing: '1px', lineHeight: 1 }}>Latest News</div>
          <p style={{ color: '#5A6A7A', fontSize: '13px', marginTop: '8px' }}>Expert F1 Fantasy analysis from Rob Beaumont — official columnist for formula1.com</p>
        </div>

        {/* FEATURED */}
        <Link href={`/articles/${featured.slug}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block', marginBottom: '28px' }}>
          <div style={{
            background: '#0E1318', border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: '16px', overflow: 'hidden', display: 'grid',
            gridTemplateColumns: '1fr 1fr', cursor: 'pointer',
            transition: 'border-color 0.2s',
          }}>
            {/* Left — big thumbnail */}
            <div style={{ height: '340px', background: featured.thumbnail, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ position: 'absolute', inset: 0, background: featured.thumbnailBg }} />
              <span style={{ fontSize: '100px', position: 'relative', zIndex: 1, filter: 'drop-shadow(0 4px 24px rgba(0,0,0,0.5))' }}>{featured.thumbnailIcon}</span>
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '100px', background: 'linear-gradient(transparent,rgba(14,19,24,0.95))', zIndex: 2 }} />
              {/* Latest badge */}
              <div style={{ position: 'absolute', top: '16px', left: '16px', zIndex: 3 }}>
                <span style={{ fontSize: '10px', fontWeight: 700, padding: '4px 10px', borderRadius: '20px', background: '#E8002D', color: 'white', textTransform: 'uppercase' as const, letterSpacing: '1px' }}>Latest</span>
              </div>
            </div>
            {/* Right — content */}
            <div style={{ padding: '40px', display: 'flex', flexDirection: 'column' as const, justifyContent: 'center' }}>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '16px' }}>
                <span style={{ fontSize: '10px', fontWeight: 700, padding: '3px 10px', borderRadius: '20px', background: categoryColors[featured.category]?.bg || 'rgba(255,255,255,0.1)', color: categoryColors[featured.category]?.color || '#F0F4F8', textTransform: 'uppercase' as const, letterSpacing: '0.5px' }}>{featured.tag}</span>
                {featured.premium && <span style={{ fontSize: '10px', fontWeight: 700, padding: '3px 10px', borderRadius: '20px', background: 'rgba(232,0,45,0.15)', color: '#E8002D', textTransform: 'uppercase' as const }}>Premium</span>}
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

        {/* FREE ARTICLES */}
        {free.length > 0 && (
          <section style={{ marginBottom: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '24px', letterSpacing: '1px' }}>Free Articles</span>
                <span style={{ fontSize: '10px', fontWeight: 700, padding: '3px 10px', borderRadius: '20px', background: 'rgba(0,212,126,0.12)', color: '#00D47E' }}>No subscription needed</span>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px' }}>
              {free.map(a => <ArticleCard key={a.slug} article={a} />)}
            </div>
          </section>
        )}

        {/* PREMIUM ARTICLES */}
        {premium.length > 0 && (
          <section>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '24px', letterSpacing: '1px' }}>Premium Articles</span>
                <span style={{ fontSize: '10px', fontWeight: 700, padding: '3px 10px', borderRadius: '20px', background: 'rgba(232,0,45,0.12)', color: '#E8002D' }}>€5/month</span>
              </div>
              <Link href="/subscribe" style={{ fontSize: '12px', color: '#E8002D', textDecoration: 'none', fontWeight: 600 }}>Unlock all →</Link>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px' }}>
              {premium.map(a => <ArticleCard key={a.slug} article={a} />)}
            </div>
          </section>
        )}

      </main>
      <Footer />
    </>
  )
}

function ArticleCard({ article }: { article: any }) {
  const cat = categoryColors[article.category] || { color: '#5A6A7A', bg: 'rgba(255,255,255,0.08)' }
  return (
    <Link href={`/articles/${article.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div style={{
        background: '#0E1318', border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: '14px', overflow: 'hidden', cursor: 'pointer', height: '100%',
        display: 'flex', flexDirection: 'column' as const,
        transition: 'border-color 0.2s, transform 0.2s',
      }}>
        {/* Thumbnail */}
        <div style={{ height: '160px', background: article.thumbnail, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <div style={{ position: 'absolute', inset: 0, background: article.thumbnailBg, opacity: 0.7 }} />
          <span style={{ fontSize: '56px', position: 'relative', zIndex: 1, filter: 'drop-shadow(0 2px 12px rgba(0,0,0,0.5))' }}>{article.thumbnailIcon}</span>
          {article.premium && (
            <div style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 2 }}>
              <span style={{ fontSize: '9px', fontWeight: 700, padding: '3px 8px', borderRadius: '4px', background: '#E8002D', color: 'white', textTransform: 'uppercase' as const }}>Premium</span>
            </div>
          )}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '60px', background: 'linear-gradient(transparent,rgba(14,19,24,0.95))', zIndex: 1 }} />
        </div>
        {/* Content */}
        <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column' as const }}>
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '9px', fontWeight: 700, padding: '2px 8px', borderRadius: '20px', background: cat.bg, color: cat.color, textTransform: 'uppercase' as const, letterSpacing: '0.5px' }}>{article.tag}</span>
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
