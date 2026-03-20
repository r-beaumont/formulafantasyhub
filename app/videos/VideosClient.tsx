'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

const CHANNEL_ID = 'UC8vDGmYVis-6zsmAMoVoPDA'
const API_KEY = 'AIzaSyBSTj2GNQ1HLAa2WG9UCFxwohcSt2Uj-qA'

interface Video {
  id: string
  title: string
  description: string
  publishedAt: string
  thumbnail: string
}

const UPCOMING = [
  { title: 'Japan GP Fantasy Preview', date: 'Wed Mar 19', time: '18:00 UTC', type: 'Premiere' },
  { title: 'China GP Deadline Livestream', date: 'Sat Mar 15', time: '06:00 UTC', type: 'Live' },
]

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const days = Math.floor(diff / 86400000)
  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days} days ago`
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`
  if (days < 365) return `${Math.floor(days / 30)} months ago`
  return `${Math.floor(days / 365)} years ago`
}

export default function VideosClient() {
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchVideos() {
      try {
        const searchRes = await fetch(
          `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${CHANNEL_ID}&part=snippet&order=date&maxResults=12&type=video`
        )
        if (!searchRes.ok) throw new Error('Failed to fetch videos')
        const data = await searchRes.json()
        const mapped: Video[] = (data.items || []).map((item: any) => ({
          id: item.id.videoId,
          title: item.snippet.title,
          description: item.snippet.description,
          publishedAt: item.snippet.publishedAt,
          thumbnail: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.default?.url,
        }))
        setVideos(mapped)
      } catch (e) {
        setError('Could not load videos — visit the YouTube channel directly.')
      } finally {
        setLoading(false)
      }
    }
    fetchVideos()
  }, [])

  const c = { background: '#0E1318', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', overflow: 'hidden' as const }
  const featured = videos[0]
  const rest = videos.slice(1)

  return (
    <div className="mob-pad-page" style={{ position: 'relative', zIndex: 1, maxWidth: '1400px', margin: '0 auto', padding: '28px 32px 60px' }}>

      {/* Header */}
      <div className="mob-flex-col" style={{ marginBottom: '28px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '2px', color: '#E8002D', textTransform: 'uppercase', marginBottom: '6px' }}>Videos</div>
          <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '56px', letterSpacing: '1px', lineHeight: 1 }}>YouTube Channel</div>
        </div>
        <a href="https://www.youtube.com/@formulafantasyhub" target="_blank" rel="noopener noreferrer" style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          background: '#E8002D', color: 'white', padding: '10px 20px',
          borderRadius: '8px', textDecoration: 'none', fontSize: '13px', fontWeight: 600,
        }}>
          ▶ Subscribe on YouTube
        </a>
      </div>

      {/* Upcoming */}
      {UPCOMING.length > 0 && (
        <div style={{ ...c, marginBottom: '24px', padding: '16px 20px' }}>
          <div style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1.5px', color: '#5A6A7A', marginBottom: '12px' }}>Upcoming</div>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {UPCOMING.map((u) => (
              <div key={u.title} style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#141B22', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '8px', padding: '12px 16px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: u.type === 'Live' ? '#E8002D' : '#FFB800', animation: u.type === 'Live' ? 'pulse 2s infinite' : 'none', flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600 }}>{u.title}</div>
                  <div style={{ fontSize: '11px', color: '#5A6A7A', marginTop: '2px' }}>{u.type} · {u.date} · {u.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div style={{ ...c, padding: '60px', textAlign: 'center' }}>
          <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '24px', color: '#5A6A7A', marginBottom: '8px' }}>Loading videos...</div>
          <div style={{ fontSize: '13px', color: '#3A4A5A' }}>Fetching latest from YouTube</div>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div style={{ ...c, padding: '40px', textAlign: 'center' }}>
          <div style={{ fontSize: '13px', color: '#5A6A7A', marginBottom: '16px' }}>{error}</div>
          <a href="https://www.youtube.com/@formulafantasyhub" target="_blank" rel="noopener noreferrer" style={{ color: '#E8002D', textDecoration: 'none', fontWeight: 600 }}>
            Watch on YouTube →
          </a>
        </div>
      )}

      {/* Featured video */}
      {!loading && !error && featured && (
        <div style={{ ...c, marginBottom: '24px' }}>
          <div className="mob-1col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
            <div style={{ position: 'relative', paddingBottom: '56.25%', background: '#080C10' }}>
              <iframe
                src={`https://www.youtube.com/embed/${featured.id}`}
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ fontSize: '10px', fontWeight: 600, padding: '3px 8px', borderRadius: '4px', background: 'rgba(232,0,45,0.15)', color: '#E8002D', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'inline-block', marginBottom: '16px', width: 'fit-content' }}>
                Latest Upload
              </div>
              <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '26px', lineHeight: 1.1, marginBottom: '12px' }}>
                {featured.title}
              </div>
              <p style={{ color: '#5A6A7A', fontSize: '13px', lineHeight: 1.7, marginBottom: '20px' }}>
                {featured.description.slice(0, 150)}{featured.description.length > 150 ? '...' : ''}
              </p>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: '#3A4A5A' }}>
                {timeAgo(featured.publishedAt)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Video grid */}
      {!loading && !error && rest.length > 0 && (
        <>
          <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '20px', letterSpacing: '1px', marginBottom: '16px' }}>
            More Videos
          </div>
          <div className="mob-1col" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '32px' }}>
            {rest.map((video) => (
              <a key={video.id} href={`https://www.youtube.com/watch?v=${video.id}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
                <div style={{ ...c, cursor: 'pointer', transition: 'border-color 0.2s' }}>
                  <div style={{ position: 'relative', paddingBottom: '56.25%', background: '#080C10' }}>
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.3)', opacity: 0, transition: 'opacity 0.2s' }}
                      onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
                      onMouseLeave={e => (e.currentTarget.style.opacity = '0')}
                    >
                      <div style={{ width: '48px', height: '48px', background: '#E8002D', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>▶</div>
                    </div>
                  </div>
                  <div style={{ padding: '14px 16px' }}>
                    <div style={{ fontSize: '13px', fontWeight: 600, lineHeight: 1.4, marginBottom: '8px' }}>{video.title}</div>
                    <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: '#3A4A5A' }}>{timeAgo(video.publishedAt)}</div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </>
      )}

      {/* CTA */}
      <div style={{ ...c, padding: '48px', textAlign: 'center' }}>
        <div style={{ fontSize: '36px', marginBottom: '12px' }}>▶</div>
        <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '36px', marginBottom: '12px' }}>10,000+ subscribers and growing</div>
        <p style={{ color: '#5A6A7A', maxWidth: '400px', margin: '0 auto 24px', lineHeight: 1.7, fontSize: '14px' }}>
          New videos every race week — previews, reviews, strategy guides and deadline livestreams.
        </p>
        <a href="https://www.youtube.com/@formulafantasyhub" target="_blank" rel="noopener noreferrer" style={{
          display: 'inline-block', background: '#E8002D', color: 'white',
          padding: '12px 32px', borderRadius: '8px', textDecoration: 'none',
          fontWeight: 600, fontSize: '14px',
        }}>
          Subscribe on YouTube
        </a>
      </div>

    </div>
  )
}
