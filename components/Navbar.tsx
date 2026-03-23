'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import Image from 'next/image'
import { CURRENT_RACE } from '@/lib/races'

const links = [
  { href: '/',           label: 'Home' },
  { href: '/race-hub',   label: 'Race Hub' },
  { href: '/calendar',   label: 'Calendar' },
  { href: '/f1-fantasy', label: 'F1 Fantasy' },
  { href: '/standings',  label: 'Standings' },
  { href: '/news',       label: 'News' },
  { href: '/videos',     label: 'Videos' },
]

export default function Navbar() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      <style>{`
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(1.3)} }
        .nav-link:hover { color: #F0F4F8 !important; background: #141B22 !important; }
      `}</style>
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 16px', height: '60px',
        background: 'rgba(8,12,16,0.97)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(232,0,45,0.2)',
        boxShadow: '0 1px 0 rgba(232,0,45,0.1)',
      }}>
        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', flexShrink: 0 }}>
          <Image src="/logo.png" alt="Formula Hub" width={36} height={36} style={{ borderRadius: '50%' }} />
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 800, fontSize: '22px', letterSpacing: '1px', color: '#F0F4F8' }}>
            FORMULA <span style={{ color: '#E8002D' }}>HUB</span>
          </span>
        </Link>

        {/* Nav links — hidden on mobile, shown via hamburger */}
        <ul className={`nav-links${menuOpen ? ' mob-open' : ''}`} style={{ display: 'flex', gap: '2px', listStyle: 'none', alignItems: 'center', margin: '0 24px' }}>
          {links.map((link) => {
            const active = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href))
            return (
              <li key={link.href}>
                <Link href={link.href} className="nav-link" onClick={() => setMenuOpen(false)} style={{
                  color: active ? '#E8002D' : '#5A6A7A',
                  textDecoration: 'none', fontSize: '13px', fontWeight: 500,
                  padding: '8px 14px', borderRadius: '6px', display: 'block',
                  background: active ? 'rgba(232,0,45,0.1)' : 'transparent',
                  border: active ? '1px solid rgba(232,0,45,0.2)' : '1px solid transparent',
                  transition: 'all 0.2s', letterSpacing: '0.3px',
                }}>{link.label}</Link>
              </li>
            )
          })}
        </ul>

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          {/* Race badge — hidden on mobile */}
          <div className="nav-race-badge" style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(232,0,45,0.08)', border: '1px solid rgba(232,0,45,0.2)', borderRadius: '20px', padding: '6px 14px', fontSize: '12px', fontWeight: 500, color: '#F0F4F8' }}>
            <div style={{ width: '7px', height: '7px', background: '#E8002D', borderRadius: '50%', animation: 'pulse 2s infinite', flexShrink: 0 }} />
            <span style={{ fontFamily: 'Twemoji Country Flags, DM Sans, sans-serif' }}>{CURRENT_RACE.flag}</span> {CURRENT_RACE.shortName} · R{CURRENT_RACE.round}
          </div>
          <Link href="/subscribe" style={{ background: '#E8002D', color: 'white', fontSize: '13px', fontWeight: 600, padding: '7px 18px', borderRadius: '8px', textDecoration: 'none', boxShadow: '0 0 20px rgba(232,0,45,0.3)', letterSpacing: '0.3px', whiteSpace: 'nowrap' }}>
            Premium
          </Link>
          {/* Hamburger — only visible on mobile via CSS */}
          <button
            className="nav-hamburger"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px', color: '#F0F4F8' }}
          >
            <div style={{ width: '22px', height: '2px', background: menuOpen ? '#E8002D' : '#F0F4F8', borderRadius: '1px', transition: 'all 0.2s', transform: menuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none' }} />
            <div style={{ width: '22px', height: '2px', background: '#F0F4F8', borderRadius: '1px', opacity: menuOpen ? 0 : 1, transition: 'all 0.2s' }} />
            <div style={{ width: '22px', height: '2px', background: menuOpen ? '#E8002D' : '#F0F4F8', borderRadius: '1px', transition: 'all 0.2s', transform: menuOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none' }} />
          </button>
        </div>
      </nav>
    </>
  )
}
