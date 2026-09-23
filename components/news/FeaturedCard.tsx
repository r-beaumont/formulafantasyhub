import Link from 'next/link'
import Image from 'next/image'
import Flag from '@/components/ui/Flag'
import { categoryTagStyle, typeTagStyle, FALLBACK_THUMBNAIL, type ArticleSummary } from './shared'

function fmtDate(d: string) {
  const x = new Date(d)
  return isNaN(x.getTime()) ? d : x.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function FeaturedCard({ article }: { article: ArticleSummary }) {
  const isFlag = /^[a-z]{2}$/.test(article.thumbnailIcon)
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .news-feat:hover { transform: translateY(-2px); border-color: var(--border2, rgba(255,255,255,0.14)); }
        .news-feat .news-thumb-img { transition: transform .5s; }
        .news-feat:hover .news-thumb-img { transform: scale(1.04); }
      ` }} />
      <Link
        href={`/news/${article.slug}`}
        className="mob-1col news-feat"
        style={{
          display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 0,
          background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '16px',
          overflow: 'hidden', textDecoration: 'none', color: 'inherit', cursor: 'pointer',
          transition: 'transform .18s, border-color .18s', marginBottom: '28px',
        }}
      >
        <div className="mob-featured-thumb" style={{ position: 'relative', minHeight: '340px', overflow: 'hidden' }}>
          <Image
            src={article.thumbnailImage ?? FALLBACK_THUMBNAIL}
            alt=""
            fill
            priority
            className="news-thumb-img"
            style={{ objectFit: 'cover' }}
          />
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', zIndex: 1 }}>
            {isFlag
              ? <Flag code={article.thumbnailIcon} size={64} />
              : <span style={{ fontSize: '64px', filter: 'drop-shadow(0 6px 20px rgba(0,0,0,.55))' }}>{article.thumbnailIcon}</span>}
          </div>
        </div>
        <div style={{ padding: '36px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', fontSize: '11px', color: 'var(--muted)' }}>
            <span style={typeTagStyle(article.articleType)}>{article.articleType}</span>
            <span style={categoryTagStyle(article.category)}>{article.tag}</span>
            <span>{fmtDate(article.date)}</span>
            <span>· {article.readTime} min read</span>
          </div>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontWeight: 400, fontSize: 'clamp(40px,3.4vw,56px)', lineHeight: 0.98, color: 'var(--text)' }}>{article.title}</h2>
          <p style={{ color: '#8A9AB0', fontSize: '15px', lineHeight: 1.7 }}>{article.excerpt}</p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: 'var(--muted)' }}>
              <Image src="/logo.png" alt="" width={22} height={22} style={{ borderRadius: '50%' }} />
              Rob Beaumont
            </div>
            <span style={{ fontSize: '13px', color: '#E8002D', fontWeight: 500 }}>Read article →</span>
          </div>
        </div>
      </Link>
    </>
  )
}
