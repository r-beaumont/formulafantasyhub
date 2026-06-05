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
  const [barWidth, setBarWidth] = useState('0%')
  const [barTransition, setBarTransition] = useState('none')

  const isPaused = useRef(false)
  const desktopBarRef = useRef<HTMLDivElement>(null)
  const desktopContainerRef = useRef<HTMLDivElement>(null)

  // Mobile detection
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 700)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  // Reset progress bar on slide change
  const startProgress = () => {
    setBarWidth('0%')
    setBarTransition('none')
    setTimeout(() => {
      setBarWidth('100%')
      setBarTransition('width 5000ms linear')
    }, 30)
  }

  const goTo = (index: number) => {
    setCurrent(index)
    startProgress()
  }

  // Auto-advance interval
  useEffect(() => {
    startProgress()
    const interval = setInterval(() => {
      if (!isPaused.current) {
        setCurrent(prev => (prev + 1) % 3)
        startProgress()
      }
    }, 5000)
    return () => clearInterval(interval)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Freeze progress bar on hover
  const handleMouseEnter = () => {
    isPaused.current = true
    if (desktopBarRef.current && desktopContainerRef.current) {
      const barW = desktopBarRef.current.getBoundingClientRect().width
      const conW = desktopContainerRef.current.getBoundingClientRect().width
      const pct = conW > 0 ? (barW / conW) * 100 : 0
      setBarTransition('none')
      setBarWidth(`${pct}%`)
    }
  }

  // Resume progress bar from current position on mouse leave
  const handleMouseLeave = () => {
    isPaused.current = false
    if (desktopBarRef.current && desktopContainerRef.current) {
      const barW = desktopBarRef.current.getBoundingClientRect().width
      const conW = desktopContainerRef.current.getBoundingClientRect().width
      const ratio = conW > 0 ? barW / conW : 0
      const remainingMs = (1 - ratio) * 5000
      setBarTransition(`width ${remainingMs}ms linear`)
      setBarWidth('100%')
    }
  }

  const badgeStyle = (articleType: string): React.CSSProperties => ({
    fontSize: '9px',
    fontWeight: 700,
    padding: '3px 7px',
    borderRadius: '3px',
    background: articleType === 'F1 Fantasy' ? 'rgba(232,0,45,0.15)' : 'rgba(0,168,255,0.15)',
    color: articleType === 'F1 Fantasy' ? '#E8002D' : '#00A8FF',
    textTransform: 'uppercase',
    letterSpacing: '0.3px',
    display: 'inline-block',
  })

  const clampStyle: React.CSSProperties = {
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  } as React.CSSProperties

  const renderThumb = (a: Article, height: string) => {
    if (a.thumbnailImage) {
      return (
        <div style={{ height, width: '100%', overflow: 'hidden', flexShrink: 0 }}>
          <img
            src={a.thumbnailImage}
            alt=""
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        </div>
      )
    }
    return (
      <div style={{ height, width: '100%', backgroundImage: a.thumbnail, backgroundSize: 'cover', backgroundPosition: 'center', flexShrink: 0 }} />
    )
  }

  const a  = articles[current]
  const a1 = articles[(current + 1) % 3]
  const a2 = articles[(current + 2) % 3]

  const dotRow = (justify: string) => (
    <div style={{ display: 'flex', justifyContent: justify, gap: '6px' }}>
      {[0, 1, 2].map(i => (
        <div
          key={i}
          onClick={() => goTo(i)}
          style={{
            height: '8px',
            width: current === i ? '20px' : '8px',
            borderRadius: '4px',
            background: current === i ? '#E8002D' : 'rgba(255,255,255,0.2)',
            transition: 'width 0.3s ease, background 0.3s ease',
            cursor: 'pointer',
          }}
        />
      ))}
    </div>
  )

  return (
    <>
      {/* ─── DESKTOP ─── */}
      <div
        style={{ display: isMobile ? 'none' : 'block' }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '12px', alignItems: 'stretch' }}>

          {/* Hero card */}
          <Link href={`/news/${a.slug}`} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column' }}>
            <div
              style={{
                background: '#0E1318',
                border: `1px solid ${heroHovered ? 'rgba(232,0,45,0.4)' : 'var(--border)'}`,
                borderRadius: '14px',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'border-color 0.2s',
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
              }}
              onMouseEnter={() => setHeroHovered(true)}
              onMouseLeave={() => setHeroHovered(false)}
            >
              {renderThumb(a, '220px')}
              <div style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
                <span style={badgeStyle(a.articleType)}>{a.articleType}</span>
                <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '22px', lineHeight: 1.15, color: '#fff' }}>
                  {a.title}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--muted)', lineHeight: 1.6, ...clampStyle }}>
                  {a.excerpt}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: 'var(--muted)' }}>
                    {a.date}
                  </span>
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
                  style={{ textDecoration: 'none', color: 'inherit', flex: 1, display: 'flex' }}
                  onClick={e => { e.preventDefault(); goTo((current + 1 + idx) % 3) }}
                >
                  <div
                    style={{
                      background: '#0E1318',
                      border: `1px solid ${hovered ? 'rgba(232,0,45,0.4)' : 'var(--border)'}`,
                      borderRadius: '12px',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      flex: 1,
                      opacity: idx === 1 && !hovered ? 0.65 : 1,
                      transition: 'opacity 0.2s, border-color 0.2s',
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                    onMouseEnter={() => setHov(true)}
                    onMouseLeave={() => setHov(false)}
                  >
                    {renderThumb(sa, '100px')}
                    <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
                      <span style={badgeStyle(sa.articleType)}>{sa.articleType}</span>
                      <div style={{ fontSize: '12px', fontWeight: 600, lineHeight: 1.4, color: '#fff', ...clampStyle }}>
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
        <div
          ref={desktopContainerRef}
          style={{ height: '2px', background: 'rgba(255,255,255,0.08)', borderRadius: '1px', marginTop: '12px', overflow: 'hidden' }}
        >
          <div ref={desktopBarRef} style={{ height: '100%', background: '#E8002D', width: barWidth, transition: barTransition }} />
        </div>

        {/* Desktop dots */}
        <div style={{ marginTop: '10px' }}>{dotRow('center')}</div>
      </div>

      {/* ─── MOBILE ─── */}
      <div style={{ display: isMobile ? 'block' : 'none' }}>
        {/* Sliding strip */}
        <div style={{ overflow: 'hidden', borderRadius: '12px' }}>
          <div style={{ display: 'flex', transition: 'transform 0.4s cubic-bezier(0.4,0,0.2,1)', transform: `translateX(-${current * 100}%)` }}>
            {articles.map(ma => (
              <div key={ma.slug} style={{ minWidth: '100%', flexShrink: 0 }}>
                <Link href={`/news/${ma.slug}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                  <div style={{ background: '#0E1318', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden' }}>
                    {renderThumb(ma, '150px')}
                    <div style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <span style={badgeStyle(ma.articleType)}>{ma.articleType}</span>
                      <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '13px', lineHeight: 1.4, color: '#fff' }}>{ma.title}</div>
                      <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: 'var(--muted)' }}>{ma.date}</div>
                      <span style={{ fontSize: '12px', color: '#E8002D', fontWeight: 600 }}>Read article →</span>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile progress bar */}
        <div style={{ height: '2px', background: 'rgba(255,255,255,0.08)', borderRadius: '1px', marginTop: '12px', overflow: 'hidden' }}>
          <div style={{ height: '100%', background: '#E8002D', width: barWidth, transition: barTransition }} />
        </div>

        {/* Mobile dots + arrow row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px' }}>
          <button
            onClick={() => current > 0 && goTo(current - 1)}
            style={{
              width: '34px', height: '34px', borderRadius: '50%',
              background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
              color: '#fff', fontSize: '18px', lineHeight: 1,
              cursor: current === 0 ? 'default' : 'pointer',
              opacity: current === 0 ? 0.2 : 1,
              pointerEvents: current === 0 ? 'none' : 'auto',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            } as React.CSSProperties}
          >
            ‹
          </button>

          {dotRow('center')}

          <button
            onClick={() => current < 2 && goTo(current + 1)}
            style={{
              width: '34px', height: '34px', borderRadius: '50%',
              background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
              color: '#fff', fontSize: '18px', lineHeight: 1,
              cursor: current === 2 ? 'default' : 'pointer',
              opacity: current === 2 ? 0.2 : 1,
              pointerEvents: current === 2 ? 'none' : 'auto',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            } as React.CSSProperties}
          >
            ›
          </button>
        </div>
      </div>
    </>
  )
}
