'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const links = [
  { href: '/', label: 'Home' },
  { href: '/race-hub', label: 'Race Hub' },
  { href: '/f1-fantasy', label: 'F1 Fantasy' },
  { href: '/articles', label: 'Articles' },
  { href: '/videos', label: 'Videos' },
]

export default function Navbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 100,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 32px', height: '60px',
      background: 'rgba(8,12,16,0.95)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(255,255,255,0.07)',
    }}>
      {/* Logo */}
      <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', flexShrink: 0 }}>
        <div style={{
          width: '32px', height: '32px', background: '#E8002D', flexShrink: 0,
          clipPath: 'polygon(0 0, 75% 0, 100% 50%, 75% 100%, 0 100%, 25% 50%)',
        }} />
        <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '22px', letterSpacing: '2px', color: '#F0F4F8' }}>
          FORMULA <span style={{ color: '#E8002D' }}>HUB</span>
        </span>
      </Link>

      {/* Desktop nav */}
      <ul style={{ display: 'flex', gap: '2px', listStyle: 'none', alignItems: 'center', margin: '0 24px' }}>
        {links.map((link) => {
          const active = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href))
          return (
            <li key={link.href}>
              <Link href={link.href} style={{
                color: active ? '#E8002D' : '#5A6A7A',
                textDecoration: 'none', fontSize: '13px', fontWeight: 500,
                padding: '6px 14px', borderRadius: '6px',
                background: active ? '#141B22' : 'transparent',
                transition: 'all 0.2s', letterSpacing: '0.3px', display: 'block',
              }}>
                {link.label}
              </Link>
            </li>
          )
        })}
      </ul>

      {/* Right side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          background: '#141B22', border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: '20px', padding: '6px 14px',
          fontSize: '12px', fontWeight: 500, color: '#F0F4F8',
        }}>
          <div style={{ width: '7px', height: '7px', background: '#E8002D', borderRadius: '50%', animation: 'pulse 2s infinite', flexShrink: 0 }} />
          🇨🇳 China · R2
        </div>
        <Link href="/subscribe" style={{
          background: '#E8002D', color: 'white', fontSize: '13px', fontWeight: 600,
          padding: '7px 18px', borderRadius: '8px', textDecoration: 'none',
          transition: 'opacity 0.2s', letterSpacing: '0.3px',
        }}>
          Premium
        </Link>
      </div>
    </nav>
  )
}
