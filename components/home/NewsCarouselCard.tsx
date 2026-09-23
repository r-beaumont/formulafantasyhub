'use client'
import { useState } from 'react'
import Link from 'next/link'
import type { Article } from '@/lib/articles'
import { cardStyle, cardHeaderStyle, cardTitleStyle, cardLinkStyle, Flag } from './shared'

const CATC: Record<string, [string, string]> = {
  'Race Preview':    ['#E8002D', 'rgba(232,0,45,.14)'],
  'Race Review':     ['#FFB800', 'rgba(255,184,0,.14)'],
  'Race Recap':      ['#FFB800', 'rgba(255,184,0,.14)'],
  'Strategy':        ['#00A8FF', 'rgba(0,168,255,.14)'],
  'Price Changes':   ['#00D47E', 'rgba(0,212,126,.14)'],
  'Data Analysis':   ['#FF69B4', 'rgba(255,105,180,.14)'],
  'News':            ['#C0C0C0', 'rgba(192,192,192,.14)'],
  'Guest Interview': ['#9B59B6', 'rgba(155,89,182,.14)'],
  'Technical':       ['#00A8FF', 'rgba(0,168,255,.14)'],
}

function tagStyle(color: string, bg: string): React.CSSProperties {
  return { display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '10px', fontWeight: 700, padding: '3px 9px', borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '0.6px', whiteSpace: 'nowrap', color, background: bg }
}

const navBtnStyle: React.CSSProperties = { width: '34px', height: '34px', borderRadius: '50%', border: '1px solid var(--border)', background: 'var(--surface2)', cursor: 'pointer', fontSize: '16px', color: 'var(--text)', display: 'flex', alignItems: 'center', justifyContent: 'center' }

export default function NewsCarouselCard({ articles }: { articles: Article[] }) {
  const [i, setI] = useState(0)
  const a = articles[i]
  const catColor = CATC[a.category] ?? ['#8A9AB0', 'rgba(138,154,176,.14)']

  return (
    <div style={cardStyle}>
      <div style={cardHeaderStyle}>
        <span style={cardTitleStyle}>Latest News</span>
        <Link href="/news" style={cardLinkStyle}>View all →</Link>
      </div>
      <div style={{ padding: '20px' }}>
        <Link href={`/news/${a.slug}`} style={{ textDecoration: 'none', color: 'inherit', display: 'grid', gap: '14px' }}>
          <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', maxHeight: '230px', borderRadius: '12px', overflow: 'hidden', background: a.thumbnailImage ? 'var(--bg)' : a.thumbnail }}>
            {a.thumbnailImage && <img src={a.thumbnailImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />}
            <div style={{ position: 'absolute', inset: 0, background: a.thumbnailBg }} />
            <span style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }}>
              <Flag code={a.thumbnailIcon} size={52} />
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', fontSize: '11px', color: 'var(--muted)' }}>
            {a.articleType === 'F1 Fantasy'
              ? <span style={tagStyle('#E8002D', 'rgba(232,0,45,.12)')}>F1 Fantasy</span>
              : <span style={tagStyle('var(--muted)', 'var(--surface2)')}>F1</span>}
            <span style={tagStyle(catColor[0], catColor[1])}>{a.category}</span>
            <span>{a.date}</span>
            <span>· {a.readTime} min read</span>
          </div>
          <h3 style={{ fontSize: '18px', fontWeight: 700, lineHeight: 1.3, margin: 0 }}>{a.title}</h3>
          <p style={{ fontSize: '13px', color: 'var(--muted)', margin: 0, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' } as React.CSSProperties}>{a.excerpt}</p>
          <span style={{ fontSize: '12px', color: '#E8002D', fontWeight: 600 }}>Read article →</span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '14px' }}>
          <button onClick={() => setI((i + articles.length - 1) % articles.length)} aria-label="Previous" style={navBtnStyle}>‹</button>
          <div style={{ display: 'flex', gap: '6px' }}>
            {articles.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setI(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                style={{ width: idx === i ? '20px' : '7px', height: '7px', borderRadius: idx === i ? '4px' : '50%', background: idx === i ? '#E8002D' : 'var(--muted2)', border: 'none', cursor: 'pointer', transition: 'width .2s, background .2s', padding: 0 }}
              />
            ))}
          </div>
          <button onClick={() => setI((i + 1) % articles.length)} aria-label="Next" style={navBtnStyle}>›</button>
        </div>
      </div>
    </div>
  )
}
