export const categoryColors: Record<string, { color: string; bg: string }> = {
  'Race Preview':    { color: '#E8002D', bg: 'rgba(232,0,45,.14)' },
  'Race Review':     { color: '#FFB800', bg: 'rgba(255,184,0,.14)' },
  'Race Recap':      { color: '#FFB800', bg: 'rgba(255,184,0,.14)' },
  'Strategy':        { color: '#00A8FF', bg: 'rgba(0,168,255,.14)' },
  'Price Changes':   { color: '#00D47E', bg: 'rgba(0,212,126,.14)' },
  'Data Analysis':   { color: '#FF69B4', bg: 'rgba(255,105,180,.14)' },
  'News':            { color: '#C0C0C0', bg: 'rgba(192,192,192,.14)' },
  'Guest Interview': { color: '#9B59B6', bg: 'rgba(155,89,182,.14)' },
  'Technical':       { color: '#00A8FF', bg: 'rgba(0,168,255,.14)' },
}

export function categoryTagStyle(category: string): React.CSSProperties {
  const c = categoryColors[category] ?? { color: 'var(--muted)', bg: 'rgba(255,255,255,.08)' }
  return { display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '10px', fontWeight: 700, padding: '3px 9px', borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '0.6px', whiteSpace: 'nowrap', color: c.color, background: c.bg }
}

// F1 Fantasy = red tag; F1 = neutral grey — never blue, per the wireframe's typeTag().
export function typeTagStyle(articleType: string): React.CSSProperties {
  const base: React.CSSProperties = { display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '10px', fontWeight: 700, padding: '3px 9px', borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '0.6px', whiteSpace: 'nowrap' }
  if (articleType === 'F1 Fantasy') return { ...base, color: '#E8002D', background: 'rgba(232,0,45,.12)' }
  return { ...base, color: 'var(--muted)', background: 'var(--surface2)' }
}

export const FALLBACK_THUMBNAIL = '/thumbnail-other-articles.png'

export interface ArticleSummary {
  slug: string
  title: string
  excerpt: string
  date: string
  tag: string
  category: string
  articleType: 'F1 Fantasy' | 'F1'
  thumbnailImage?: string
  thumbnailIcon: string
  readTime: number
}
