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
  { href: '/statistics', label: 'Statistics' },
]

const HelmetLogo = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 3C10.5 3 6 7.5 6 13v8c0 1.1.9 2 2 2h1v1.5C9 25.3 9.7 26 10.5 26h11c.8 0 1.5-.7 1.5-1.5V23h1c1.1 0 2-.9 2-2v-8c0-5.5-4.5-10-10-10z" fill="#E8002D"/>
    <path d="M6 15h20v4H6z" fill="rgba(0,0,0,0.3)"/>
    <path d="M8 15h16v2.5c0 .3-.2.5-.5.5H8.5c-.3 0-.5-.2-.5-.5V15z" fill="rgba(255,255,255,0.15)"/>
    <path d="M10.5 26h11l-.5-3h-10l-.5 3z" fill="#C0001F"/>
    <path d="M6 13.5c0-1.2.2-2.3.6-3.3L24 17H6v-3.5z" fill="rgba(255,255,255,0.05)"/>
  </svg>
)

export default function Navbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.3); }
        }
        .nav-link-item:hover {
          color: #F0F4F8 !important;
          background: #141B22 !important;
        }
      `}</style>
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 32px', height: '60px',
        background: 'rgba(8,12,16,0.97)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(232,0,45,0.2)',
        boxShadow: '0 1px 0 rgba(232,0,45,0.1)',
      }}>
        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', flexShrink: 0 }}>
          <HelmetLogo />
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
                <Link href={link.href} className="nav-link-item" style={{
                  color: active ? '#E8002D' : '#5A6A7A',
                  textDecoration: 'none', fontSize: '13px', fontWeight: 500,
                  padding: '6px 14px', borderRadius: '6px',
                  background: active ? 'rgba(232,0,45,0.1)' : 'transparent',
                  border: active ? '1px solid rgba(232,0,45,0.2)' : '1px solid transparent',
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
            background: 'rgba(232,0,45,0.08)', border: '1px solid rgba(232,0,45,0.2)',
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
            boxShadow: '0 0 20px rgba(232,0,45,0.3)',
          }}>
            Premium
          </Link>
        </div>
      </nav>
    </>
  )
}
