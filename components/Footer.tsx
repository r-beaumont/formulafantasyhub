import Link from 'next/link'

export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid var(--border)',
      padding: '24px 16px',
      fontSize: '12px', color: 'var(--muted)',
      position: 'relative', zIndex: 1,
    }}>
      <div className="footer-inner" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
        <div style={{ lineHeight: 1.6 }}>
          © 2026 Formula Hub · Formula Hub is an independent website and is not affiliated with, endorsed by, or connected to Formula 1, the FIA, or any F1 team or driver.
          {' '}Formula 1, F1, and related marks are trademarks of Formula One Licensing B.V. F1 Fantasy is operated by Formula One Digital Media Limited.
          {' '}All race data is provided for informational purposes only.
        </div>
        <div style={{ display: 'flex', gap: '20px', flexShrink: 0 }}>
          <Link href="https://www.youtube.com/@formulafantasyhub" target="_blank" style={{ color: 'var(--muted)', textDecoration: 'none' }}>YouTube</Link>
          <Link href="https://x.com/F_FantasyHub" target="_blank" style={{ color: 'var(--muted)', textDecoration: 'none' }}>X / Twitter</Link>
        </div>
      </div>
    </footer>
  )
}
