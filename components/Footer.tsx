import Link from 'next/link'

export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid rgba(255,255,255,0.07)',
      padding: '24px 32px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      fontSize: '12px', color: '#5A6A7A',
      position: 'relative', zIndex: 1,
    }}>
      <div>© 2026 Formula Hub · Not affiliated with Formula 1 or the FIA</div>
      <div style={{ display: 'flex', gap: '20px' }}>
        <Link href="/subscribe" style={{ color: '#5A6A7A', textDecoration: 'none' }}>Premium</Link>
        <Link href="https://www.youtube.com/@formulafantasyhub" target="_blank" style={{ color: '#5A6A7A', textDecoration: 'none' }}>YouTube</Link>
        <Link href="https://x.com/F_FantasyHub" target="_blank" style={{ color: '#5A6A7A', textDecoration: 'none' }}>X / Twitter</Link>
        <Link href="https://formula1.com" target="_blank" style={{ color: '#5A6A7A', textDecoration: 'none' }}>F1.com Column ↗</Link>
      </div>
    </footer>
  )
}
