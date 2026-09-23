'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useCurrentRace } from '@/lib/useCurrentRace'
import RaceTicker, { useTickerData } from './RaceTicker'

const links = [
  { href: '/',           label: 'Home' },
  { href: '/race-hub',   label: 'Race Hub' },
  { href: '/calendar',   label: 'Calendar' },
  { href: '/f1-fantasy', label: 'F1 Fantasy' },
  { href: '/standings',  label: 'Standings' },
  { href: '/news',       label: 'News' },
  { href: '/videos',     label: 'Videos' },
  { href: '/about',      label: 'About' },
]

export default function Navbar() {
  const pathname = usePathname()
  const race = useCurrentRace()
  const [menuOpen, setMenuOpen] = useState(false)
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  const [hoveredLink, setHoveredLink] = useState<string | null>(null)
  const tickerData = useTickerData()

  useEffect(() => {
    if (document.documentElement.getAttribute('data-theme') === 'light') setTheme('light')
  }, [])

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    if (next === 'light') {
      document.documentElement.setAttribute('data-theme', 'light')
    } else {
      document.documentElement.removeAttribute('data-theme')
    }
    try { localStorage.setItem('theme', next) } catch (_) {}
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(1.3)} }
        .theme-toggle:hover { background: var(--border) !important; }
        [data-theme="light"] .theme-toggle:hover { background: rgba(0,0,0,0.06) !important; }
        [data-theme="light"] nav.fh-navbar { background: rgba(240,242,245,0.8) !important; border-bottom-color: var(--border) !important; }
        /* Mobile dropdown must clear both the 54px nav and the 32px ticker beneath it. */
        .nav-links.mob-open { top: 86px !important; }
      ` }} />
      <nav className="fh-navbar" style={{
        position: 'sticky', top: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 16px', height: '54px',
        background: 'rgba(8,12,16,0.72)',
        backdropFilter: 'blur(18px) saturate(160%)',
        WebkitBackdropFilter: 'blur(18px) saturate(160%)',
        borderBottom: '1px solid var(--border)',
      }}>
        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', flexShrink: 0 }}>
          <Image src="/logo.png" alt="Formula Hub" width={30} height={30} style={{ borderRadius: '50%' }} />
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 800, fontSize: '19px', letterSpacing: '1px', color: 'var(--text)' }}>
            FORMULA <span style={{ color: '#E8002D' }}>HUB</span>
          </span>
        </Link>

        {/* Nav links — hidden on mobile, shown via hamburger */}
        <ul className={`nav-links${menuOpen ? ' mob-open' : ''}`} style={{ display: 'flex', gap: 0, listStyle: 'none', alignItems: 'center', margin: '0 16px' }}>
          {links.map((link) => {
            const active = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href))
            const hovered = hoveredLink === link.href
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="nav-link"
                  onClick={() => setMenuOpen(false)}
                  onMouseEnter={() => setHoveredLink(link.href)}
                  onMouseLeave={() => setHoveredLink(null)}
                  style={{
                    position: 'relative', display: 'block',
                    color: active ? 'var(--text)' : 'var(--muted)',
                    textDecoration: 'none', fontSize: '13px', fontWeight: 500,
                    padding: '17px 13px', letterSpacing: '0.3px',
                  }}
                >
                  {link.label}
                  <span style={{
                    position: 'absolute', left: '13px', right: '13px', bottom: 0, height: '2px',
                    borderRadius: '2px',
                    background: active ? '#E8002D' : 'var(--muted)',
                    transform: active ? 'scaleX(1)' : hovered ? 'scaleX(0.5)' : 'scaleX(0)',
                    transformOrigin: 'center',
                    transition: 'transform 0.25s, background 0.25s',
                  }} />
                </Link>
              </li>
            )
          })}
          {/* Theme toggle at bottom of mobile dropdown */}
          <li className="nav-theme-mobile" style={{ marginTop: '4px', paddingTop: '8px', borderTop: '1px solid var(--border)' }}>
            <button
              onClick={toggleTheme}
              className="theme-toggle"
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                width: '100%', height: '38px', borderRadius: '6px',
                display: 'flex', alignItems: 'center',
                gap: '10px', padding: '0 14px',
                fontSize: '13px', fontWeight: 500, color: 'var(--muted)',
                letterSpacing: '0.3px',
              }}
            >
              <span style={{ fontSize: '16px' }}>{theme === 'dark' ? '🌙' : '☀️'}</span>
              <span>{theme === 'dark' ? 'Light mode' : 'Dark mode'}</span>
            </button>
          </li>
        </ul>

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          {/* Theme toggle — desktop only; also in mobile dropdown below */}
          <button
            onClick={toggleTheme}
            className="theme-toggle nav-theme-desktop"
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              width: '34px', height: '34px', borderRadius: '8px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '16px', flexShrink: 0,
            }}
          >
            {theme === 'dark' ? '🌙' : '☀️'}
          </button>
          {/* Race badge — hidden on mobile */}
          <div className="nav-race-badge" style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'transparent', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '20px', padding: '6px 14px', fontSize: '12px', fontWeight: 500, color: 'var(--text)' }}>
            <div style={{ width: '7px', height: '7px', background: '#E8002D', borderRadius: '50%', animation: 'pulse 2s infinite', flexShrink: 0 }} />
            <span className={`fi fi-${race.flag}`} style={{ width: '1.2em', borderRadius: '2px', display: 'inline-block' }}></span> {race.shortName} · R{race.round}
          </div>
          {/* Hamburger — only visible on mobile via CSS */}
          <button
            className="nav-hamburger"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px', color: 'var(--text)' }}
          >
            <div style={{ width: '22px', height: '2px', background: menuOpen ? '#E8002D' : 'var(--text)', borderRadius: '1px', transition: 'all 0.2s', transform: menuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none' }} />
            <div style={{ width: '22px', height: '2px', background: 'var(--text)', borderRadius: '1px', opacity: menuOpen ? 0 : 1, transition: 'all 0.2s' }} />
            <div style={{ width: '22px', height: '2px', background: menuOpen ? '#E8002D' : 'var(--text)', borderRadius: '1px', transition: 'all 0.2s', transform: menuOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none' }} />
          </button>
        </div>
      </nav>
      <RaceTicker data={tickerData} theme={theme} />
    </>
  )
}
