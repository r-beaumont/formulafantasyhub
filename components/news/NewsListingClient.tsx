'use client'
import { useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import FeaturedCard from './FeaturedCard'
import NewsCard from './NewsCard'
import type { ArticleSummary } from './shared'

type Filter = 'All' | 'F1 Fantasy' | 'F1'

// Mirrors components/racehub/shared.tsx's PillToggle (same sliding-thumb
// behaviour), but accepts a ReactNode label — needed here for the muted,
// JetBrains-Mono article counts next to each option, which a plain string
// label can't carry. racehub/shared.tsx isn't in this task's allowed-file
// list, so it's kept local rather than widening that shared type.
function FilterToggle({ options, value, onChange }: { options: { id: Filter; label: ReactNode }[]; value: Filter; onChange: (v: Filter) => void }) {
  const btnRefs = useRef<Record<string, HTMLButtonElement | null>>({})
  const [thumb, setThumb] = useState({ left: 0, width: 0 })

  useLayoutEffect(() => {
    const btn = btnRefs.current[value]
    if (btn) setThumb({ left: btn.offsetLeft, width: btn.offsetWidth })
  }, [value])

  return (
    <div style={{ position: 'relative', display: 'inline-flex', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '999px', padding: '4px', maxWidth: '100%', overflowX: 'auto' }}>
      <span style={{ position: 'absolute', top: '4px', bottom: '4px', left: thumb.left, width: thumb.width, borderRadius: '999px', background: 'var(--surface3)', boxShadow: '0 2px 10px rgba(0,0,0,0.25)', transition: 'left .32s cubic-bezier(.3,.8,.2,1), width .32s cubic-bezier(.3,.8,.2,1)' }} />
      {options.map(o => (
        <button
          key={o.id}
          ref={el => { btnRefs.current[o.id] = el }}
          onClick={() => onChange(o.id)}
          style={{ position: 'relative', zIndex: 1, background: 'transparent', border: 'none', color: value === o.id ? 'var(--text)' : 'var(--muted)', padding: '7px 16px', borderRadius: '999px', fontSize: '13px', fontWeight: 600, whiteSpace: 'nowrap', cursor: 'pointer', transition: 'color .25s', display: 'flex', alignItems: 'center', gap: '6px' }}
        >{o.label}</button>
      ))}
    </div>
  )
}

export default function NewsListingClient({ articles }: { articles: ArticleSummary[] }) {
  const [filter, setFilter] = useState<Filter>('All')

  const counts: Record<Filter, number> = {
    All: articles.length,
    'F1 Fantasy': articles.filter(a => a.articleType === 'F1 Fantasy').length,
    F1: articles.filter(a => a.articleType === 'F1').length,
  }

  const filtered = filter === 'All' ? articles : articles.filter(a => a.articleType === filter)
  const featured = filtered[0]
  const rest = filtered.slice(1)

  return (
    <div>
      <style dangerouslySetInnerHTML={{ __html: `
        .news-card:hover { transform: translateY(-2px); border-color: var(--border2, rgba(255,255,255,0.14)); }
        .news-card .news-thumb-img { transition: transform .5s; }
        .news-card:hover .news-thumb-img { transform: scale(1.04); }
        .news-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 16px; }
        @media (max-width: 1000px) { .news-grid { grid-template-columns: repeat(2,1fr); } }
        @media (max-width: 620px) { .news-grid { grid-template-columns: 1fr; } }
      ` }} />

      <div style={{ marginBottom: '28px' }}>
        <FilterToggle
          options={(['All', 'F1 Fantasy', 'F1'] as Filter[]).map(id => ({
            id,
            label: <>{id}<span style={{ fontFamily: "'JetBrains Mono', monospace", opacity: 0.6 }}>{counts[id]}</span></>,
          }))}
          value={filter}
          onChange={setFilter}
        />
      </div>

      {featured && <FeaturedCard article={featured} />}

      {rest.length > 0 && (
        <div className="news-grid">
          {rest.map(a => <NewsCard key={a.slug} article={a} />)}
        </div>
      )}
    </div>
  )
}
