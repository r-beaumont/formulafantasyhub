import Link from 'next/link'
import Image from 'next/image'
import Flag from '@/components/ui/Flag'
import { categoryTagStyle, typeTagStyle, FALLBACK_THUMBNAIL, type ArticleSummary } from './shared'

function fmtDate(d: string) {
  const x = new Date(d)
  return isNaN(x.getTime()) ? d : x.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function NewsCard({ article }: { article: ArticleSummary }) {
  const isFlag = /^[a-z]{2}$/.test(article.thumbnailIcon)
  return (
    <Link
      href={`/news/${article.slug}`}
      className="news-card"
      style={{
        display: 'flex', flexDirection: 'column', height: '100%',
        background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '14px',
        overflow: 'hidden', textDecoration: 'none', color: 'inherit', cursor: 'pointer',
        transition: 'transform .18s, border-color .18s',
      }}
    >
      <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', overflow: 'hidden', flexShrink: 0 }}>
        <Image
          src={article.thumbnailImage ?? FALLBACK_THUMBNAIL}
          alt=""
          fill
          loading="lazy"
          className="news-thumb-img"
          style={{ objectFit: 'cover' }}
        />
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', zIndex: 1 }}>
          {isFlag
            ? <Flag code={article.thumbnailIcon} size={44} />
            : <span style={{ fontSize: '44px', filter: 'drop-shadow(0 4px 16px rgba(0,0,0,.5))' }}>{article.thumbnailIcon}</span>}
        </div>
      </div>
      <div style={{ padding: '14px 16px 16px', display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={typeTagStyle(article.articleType)}>{article.articleType}</span>
          <span style={categoryTagStyle(article.category)}>{article.tag}</span>
        </div>
        <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '15px', fontWeight: 700, lineHeight: 1.35, color: 'var(--text)' }}>{article.title}</h3>
        <p style={{
          fontSize: '12px', color: 'var(--muted)', lineHeight: 1.6, margin: 0,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const, overflow: 'hidden',
        }}>{article.excerpt}</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: 'var(--muted)', marginTop: 'auto', flexWrap: 'wrap' }}>
          <span>{fmtDate(article.date)}</span>
          <span>· {article.readTime} min read</span>
        </div>
      </div>
    </Link>
  )
}
