import Link from 'next/link'
import { cardStyle, cardHeaderStyle, cardTitleStyle, cardLinkStyle } from './shared'

const YT_URL = 'https://www.youtube.com/@formulafantasyhub'

export default function LatestVideosCard() {
  return (
    <div style={cardStyle}>
      <div style={cardHeaderStyle}>
        <span style={cardTitleStyle}>Latest Videos</span>
        <Link href="/videos" style={cardLinkStyle}>View all →</Link>
      </div>
      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <a href={YT_URL} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', display: 'block' }}>
          <div style={{ position: 'relative', paddingBottom: '56.25%', background: 'var(--bg)', borderRadius: '8px', overflow: 'hidden', cursor: 'pointer' }}>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '14px' }}>
              <div style={{ width: '64px', height: '64px', background: '#E8002D', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 28px rgba(232,0,45,0.5)' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z" /></svg>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text)' }}>Watch Latest Videos</div>
                <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '4px' }}>@formulafantasyhub</div>
              </div>
            </div>
          </div>
        </a>
        <a href={YT_URL} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: '#E8002D', color: '#fff', padding: '10px', borderRadius: '8px', textDecoration: 'none', fontSize: '13px', fontWeight: 600 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M23 7.2a3 3 0 0 0-2.1-2.1C19 4.6 12 4.6 12 4.6s-7 0-8.9.5A3 3 0 0 0 1 7.2 31 31 0 0 0 .6 12 31 31 0 0 0 1 16.8a3 3 0 0 0 2.1 2.1c1.9.5 8.9.5 8.9.5s7 0 8.9-.5a3 3 0 0 0 2.1-2.1 31 31 0 0 0 .4-4.8 31 31 0 0 0-.4-4.8zM9.7 15.1V8.9l5.8 3.1z" /></svg>
          Subscribe on YouTube
        </a>
      </div>
    </div>
  )
}
