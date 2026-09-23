'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { cardStyle, cardHeaderStyle, cardTitleStyle, cardLinkStyle } from './shared'

const YT_URL = 'https://www.youtube.com/@formulafantasyhub'

const PlayIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z" /></svg>
)

interface LatestVideo {
  id: string
  title: string
  thumbnail: string
}

export default function LatestVideosCard() {
  const [video, setVideo] = useState<LatestVideo | null>(null)

  useEffect(() => {
    let cancelled = false
    fetch('/api/youtube')
      .then(res => {
        if (!res.ok) throw new Error('YouTube feed request failed')
        return res.json()
      })
      .then(({ videos: data }) => {
        const first = (data?.items || []).find((item: any) => item?.id?.videoId)
        if (!first) throw new Error('No videos in feed')
        if (cancelled) return
        setVideo({
          id: first.id.videoId,
          title: first.snippet.title,
          thumbnail: first.snippet.thumbnails?.high?.url || first.snippet.thumbnails?.default?.url,
        })
      })
      .catch(() => { /* leave video null — fallback panel renders below */ })
    return () => { cancelled = true }
  }, [])

  return (
    <div style={cardStyle}>
      <div style={cardHeaderStyle}>
        <span style={cardTitleStyle}>Latest Videos</span>
        <Link href="/videos" style={cardLinkStyle}>View all →</Link>
      </div>
      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {video ? (
          <a href={`https://www.youtube.com/watch?v=${video.id}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', display: 'block' }}>
            <div style={{ position: 'relative', paddingBottom: '56.25%', background: 'var(--bg)', borderRadius: '8px', overflow: 'hidden', cursor: 'pointer' }}>
              <img src={video.thumbnail} alt="" loading="lazy" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.28)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: '64px', height: '64px', background: '#E8002D', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 28px rgba(232,0,45,0.5)' }}>
                  <PlayIcon />
                </div>
              </div>
            </div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)', marginTop: '10px', lineHeight: 1.4 }}>{video.title}</div>
          </a>
        ) : (
          <a href={YT_URL} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', display: 'block' }}>
            <div style={{ position: 'relative', paddingBottom: '56.25%', background: 'var(--bg)', borderRadius: '8px', overflow: 'hidden', cursor: 'pointer' }}>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '14px' }}>
                <div style={{ width: '64px', height: '64px', background: '#E8002D', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 28px rgba(232,0,45,0.5)' }}>
                  <PlayIcon />
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text)' }}>Watch Latest Videos</div>
                  <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '4px' }}>@formulafantasyhub</div>
                </div>
              </div>
            </div>
          </a>
        )}
        <a href={YT_URL} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: '#E8002D', color: '#fff', padding: '10px', borderRadius: '8px', textDecoration: 'none', fontSize: '13px', fontWeight: 600 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M23 7.2a3 3 0 0 0-2.1-2.1C19 4.6 12 4.6 12 4.6s-7 0-8.9.5A3 3 0 0 0 1 7.2 31 31 0 0 0 .6 12 31 31 0 0 0 1 16.8a3 3 0 0 0 2.1 2.1c1.9.5 8.9.5 8.9.5s7 0 8.9-.5a3 3 0 0 0 2.1-2.1 31 31 0 0 0 .4-4.8 31 31 0 0 0-.4-4.8zM9.7 15.1V8.9l5.8 3.1z" /></svg>
          Subscribe on YouTube
        </a>
      </div>
    </div>
  )
}
