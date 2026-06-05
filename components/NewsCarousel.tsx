'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import type { Article } from '@/lib/articles'

export default function NewsCarousel({ articles }: { articles: Article[] }) {
  const [current, setCurrent] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const [heroHovered, setHeroHovered] = useState(false)
  const [side0Hovered, setSide0Hovered] = useState(false)
  const [side1Hovered, setSide1Hovered] = useState(false)

  const isPaused = useRef(false)
  const desktopBarRef = useRef<HTMLDivElement>(null)
  const mobileBarRef = useRef<HTMLDivElement>(null)

  // Update both bars together so they stay in sync regardless of layout
  const applyToBars = (fn: (bar: HTMLDivElement) => void) => {
    for (const ref of [desktopBarRef, mobileBarRef]) {
      if (ref.current) fn(ref.current)
    }
  }

  const resetProgress = () => {
    applyToBars(bar => {
      bar.style.transition = 'none'
      bar.style.width = '0%'
      setTimeout(() => {
        bar.style.transition = 'width 5000ms linear'
        bar.style.width = '100%'
      }, 30)
    })
  }

  const goTo = (index: number) => {
    setCurrent(index)
    resetProgress()
  }

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 700)
    check()
    window.addEventListener('resize', check)

    resetProgress()
    const interval = setInterval(() => {
      if (!isPaused.current) {
        setCurrent(prev => (prev + 1) % 3)
        resetProgress()
      }
    }, 5000)

    return () => {
      window.removeEventListener('resize', check)
      clearInterval(interval)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleMouseEnter = () => {
    isPaused.current = true
    applyToBars(bar => {
      if (!bar.parentElement) return
      const barW = bar.getBoundingClientRect().width
      const conW = bar.parentElement.getBoundingClientRect().width
      const pct = conW > 0 ? (barW / conW) * 100 : 0
      bar.style.transition = 'none'
      bar.style.width = `${pct}%`
    })
  }

  const handleMouseLeave = () => {
    isPaused.current = false
    applyToBars(bar => {
      if (!bar.parentElement) return
      const barW = bar.getBoundingClientRect().width
      const conW = bar.parentElement.getBoundingClientRect().width
      const ratio = conW > 0 ? barW / conW : 0
      const remainingMs = (1 - ratio) * 5000
      bar.style.transition = `width ${remainingMs}ms linear`
      bar.style.width = '100%'
    })
  }

  const renderBadge = (articleType: string) => (
    <span style={{
      fontSize: '9px',
      fontWeight: 700,
      textTransform: 'uppercase' as const,
      padding: '3px 7px',
      borderRadius: '3px',
      display: 'inline-block',
      letterSpacing: '0.5px',
      background: articleType === 'F1 Fantasy' ? 'rgba(232,0,45,0.15)' : 'rgba(0,168,255,0.15)',
      color: articleType === 'F1 Fantasy' ? '#E8002D' : '#00A8FF',
    }}>
      {articleType}
    </span>
  )

  const renderThumb = (article: Article) => (
    article.thumbnailImage
      ? <img src={article.thumbnailImage} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} alt={article.title} />
      : <div style={{ width: '100%', height: '100%', background: article.thumbnail }} />
  )

  const clamp2 = {
    overflow: 'hidden',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
  } as React.CSSProperties

  const renderDots = () => (
    <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginTop: '12px' }}>
      {[0, 1, 2].map(i => (
        <button
          key={i}
          onClick={() => goTo(i)}
          style={{
            height: '8px',
            width: current === i ? '20px' : '8px',
            borderRadius: '4px',
            background: current === i ? '#E8002D' : 'rgba(255,255,255,0.2)',
            transition: 'width 0.3s ease, background 0.3s ease',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
          }}
        />
      ))}
    </div>
  )

  const a  = articles[current]
  const a1 = articles[(current + 1) % 3]
  const a2 = articles[(current + 2) % 3]

  return (
    <>
      {/* ─── DESKTOP ─── */}
      <div style={{ display: !isMobile ? 'block' : 'none' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '12px', alignItems: 'stretch' }}>

          {/* Hero card */}
          <Link href={`/news/${a.slug}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
            <div
              onMouseEnter={() => { setHeroHovered(true); handleMouseEnter() }}
              onMouseLeave={() => { setHeroHovered(false); handleMouseLeave() }}
              style={{
                background: '#0E1318',
                border: `1px solid ${heroHovered ? 'rgba(232,0,45,0.4)' : 'var(--border)'}`,
                borderRadius: '14px',
                overflow: 'hidden',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                transition: 'border-color 0.2s',
              }}
            >
              <div style={{ height: '220px', width: '100%', overflow: 'hidden', flexShrink: 0, position: 'relative' }}>
                {renderThumb(a)}
              </div>
              <div style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
                {renderBadge(a.articleType)}
                <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '22px', lineHeight: 1.15, color: '#fff' }}>
                  {a.title}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--muted)', lineHeight: 1.6, ...clamp2 }}>
                  {a.excerpt}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: 'var(--muted)' }}>{a.date}</span>
                  <span style={{ fontSize: '12px', color: '#E8002D', fontWeight: 600 }}>Read article →</span>
                </div>
              </div>
            </div>
          </Link>

          {/* Side stack */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {([a1, a2] as Article[]).map((sa, idx) => {
              const hovered = idx === 0 ? side0Hovered : side1Hovered
              const setHov = idx === 0 ? setSide0Hovered : setSide1Hovered
              return (
                <Link
                  key={sa.slug}
                  href={`/news/${sa.slug}`}
                  style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flex: 1 }}
                  onClick={e => { e.preventDefault(); goTo((current + 1 + idx) % 3) }}
                >
                  <div
                    onMouseEnter={() => setHov(true)}
                    onMouseLeave={() => setHov(false)}
                    style={{
                      background: '#0E1318',
                      border: `1px solid ${hovered ? 'rgba(232,0,45,0.4)' : 'var(--border)'}`,
                      borderRadius: '12px',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      flex: 1,
                      opacity: idx === 1 && !hovered ? 0.65 : 1,
                      transition: 'opacity 0.2s, border-color 0.2s',
                    }}
                  >
                    <div style={{ height: '100px', overflow: 'hidden', position: 'relative', flexShrink: 0 }}>
                      {renderThumb(sa)}
                    </div>
                    <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
                      {renderBadge(sa.articleType)}
                      <div style={{ fontSize: '12px', fontWeight: 600, lineHeight: 1.4, color: '#fff', ...clamp2 }}>
                        {sa.title}
                      </div>
                      <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: 'var(--muted)' }}>
                        {sa.date}
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Desktop progress bar */}
        <div style={{ height: '2px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px', marginTop: '14px', overflow: 'hidden' }}>
          <div ref={desktopBarRef} style={{ height: '100%', background: '#E8002D', borderRadius: '2px', width: '0%' }} />
        </div>
        {renderDots()}
      </div>

      {/* ─── MOBILE ─── */}
      <div style={{ display: isMobile ? 'block' : 'none' }}>
        <div
          style={{ overflow: 'hidden', borderRadius: '12px' }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div style={{ display: 'flex', transition: 'transform 0.4s cubic-bezier(0.4,0,0.2,1)', transform: `translateX(-${current * 100}%)` }}>
            {articles.map(ma => (
              <div key={ma.slug} style={{ minWidth: '100%', flexShrink: 0 }}>
                <Link href={`/news/${ma.slug}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                  <div style={{ background: '#0E1318', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden' }}>
                    <div style={{ height: '150px', position: 'relative' }}>
                      {renderThumb(ma)}
                    </div>
                    <div style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {renderBadge(ma.articleType)}
                      <div style={{ fontSize: '13px', fontWeight: 600, lineHeight: 1.45, color: '#fff', ...clamp2 }}>
                        {ma.title}
                      </div>
                      <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: 'var(--muted)' }}>
                        {ma.date}
                      </div>
                      <span style={{ fontSize: '12px', color: '#E8002D', fontWeight: 500 }}>Read article →</span>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile progress bar */}
        <div style={{ height: '2px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px', marginTop: '14px', overflow: 'hidden' }}>
          <div ref={mobileBarRef} style={{ height: '100%', background: '#E8002D', borderRadius: '2px', width: '0%' }} />
        </div>

        {/* Arrow + dots row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '14px' }}>
          <button
            onClick={() => goTo(current - 1)}
            style={{
              width: '34px', height: '34px', borderRadius: '50%',
              background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
              color: '#fff', fontSize: '18px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              opacity: current === 0 ? 0.2 : 1,
              pointerEvents: current === 0 ? 'none' : 'auto',
            } as React.CSSProperties}
          >‹</button>

          {renderDots()}

          <button
            onClick={() => goTo(current + 1)}
            style={{
              width: '34px', height: '34px', borderRadius: '50%',
              background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
              color: '#fff', fontSize: '18px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              opacity: current === 2 ? 0.2 : 1,
              pointerEvents: current === 2 ? 'none' : 'auto',
            } as React.CSSProperties}
          >›</button>
        </div>
      </div>
    </>
  )
}
