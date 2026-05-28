'use client'

import { useState } from 'react'

interface ShareBarProps {
  title: string
  slug: string
  showLabel?: boolean
}

const XIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
    <path d="M10.9 1H12.9L8.64 5.95L13.67 13H9.72L6.67 9.05L3.17 13H1.16L5.72 7.68L0.89 1H4.95L7.71 4.6L10.9 1ZM10.2 11.77H11.31L4.4 2.13H3.21L10.2 11.77Z" fill="currentColor"/>
  </svg>
)

const LinkIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
    <path d="M5.5 7.5C5.83 7.96 6.25 8.34 6.74 8.63C7.23 8.92 7.77 9.1 8.33 9.15C8.89 9.2 9.46 9.11 9.98 8.9C10.5 8.69 10.97 8.36 11.35 7.94L13.35 5.94C14.02 5.25 14.39 4.32 14.38 3.36C14.37 2.4 13.98 1.48 13.3 0.8C12.62 0.12 11.7 -0.27 10.74 -0.28C9.78 -0.29 8.85 0.08 8.16 0.75L6.84 2.06M8.5 6.5C8.17 6.04 7.75 5.66 7.26 5.37C6.77 5.08 6.23 4.9 5.67 4.85C5.11 4.8 4.54 4.89 4.02 5.1C3.5 5.31 3.03 5.64 2.65 6.06L0.65 8.06C-0.02 8.75 -0.39 9.68 -0.38 10.64C-0.37 11.6 0.02 12.52 0.7 13.2C1.38 13.88 2.3 14.27 3.26 14.28C4.22 14.29 5.15 13.92 5.84 13.25L7.15 11.94" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)


export default function ShareBar({ title, slug, showLabel = false }: ShareBarProps) {
  const [copied, setCopied] = useState(false)

  const articleUrl = `https://formulahub.live/news/${slug}`
  const tweetUrl   = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(articleUrl)}&via=F_FantasyHub`

  const handleCopy = () => {
    navigator.clipboard.writeText(articleUrl).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const btn: React.CSSProperties = {
    background: 'var(--surface)',
    border: '0.5px solid rgba(255,255,255,0.1)',
    borderRadius: '8px',
    padding: '8px 16px',
    fontFamily: 'DM Sans, sans-serif',
    fontSize: '13px',
    fontWeight: 500,
    color: '#8A9BB0',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    textDecoration: 'none',
    transition: 'border-color 0.15s, color 0.15s',
  }

  return (
    <div style={{ margin: '24px 0' }}>
      {showLabel && (
        <div style={{
          fontFamily: 'DM Sans, sans-serif',
          fontSize: '11px',
          color: 'var(--muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          marginBottom: '8px',
        }}>
          Share this article
        </div>
      )}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' as const }}>
        {/* X / Twitter */}
        <a
          href={tweetUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={btn}
          onMouseEnter={e => {
            const el = e.currentTarget as HTMLElement
            el.style.color = '#FFFFFF'
            el.style.borderColor = 'rgba(255,255,255,0.25)'
          }}
          onMouseLeave={e => {
            const el = e.currentTarget as HTMLElement
            el.style.color = '#8A9BB0'
            el.style.borderColor = 'rgba(255,255,255,0.1)'
          }}
        >
          <XIcon />
          Share on X
        </a>

        {/* Copy Link */}
        <button
          onClick={handleCopy}
          style={{
            ...btn,
            ...(copied ? { color: '#00C851', borderColor: 'rgba(0,200,81,0.4)' } : {}),
          }}
          onMouseEnter={e => {
            if (!copied) {
              const el = e.currentTarget as HTMLElement
              el.style.color = 'var(--text)'
              el.style.borderColor = 'rgba(255,255,255,0.25)'
            }
          }}
          onMouseLeave={e => {
            if (!copied) {
              const el = e.currentTarget as HTMLElement
              el.style.color = '#8A9BB0'
              el.style.borderColor = 'rgba(255,255,255,0.1)'
            }
          }}
        >
          <LinkIcon />
          {copied ? 'Copied!' : 'Copy Link'}
        </button>

      </div>
    </div>
  )
}
