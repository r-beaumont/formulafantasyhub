'use client'

import { useEffect, useState } from 'react'
import VideoCard, { type Video } from '@/components/videos/VideoCard'

const PlayIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
)

export default function VideosClient() {
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchVideos() {
      try {
        const res = await fetch('/api/youtube')
        if (!res.ok) throw new Error('Failed to fetch videos')
        const { videos: data } = await res.json()
        const mapped: Video[] = (data.items || [])
          .map((item: any) => ({
            id: item.id.videoId,
            title: item.snippet.title,
            description: item.snippet.description,
            publishedAt: item.snippet.publishedAt,
            thumbnail: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.default?.url,
          }))
        setVideos(mapped)
      } catch {
        setError('Could not load videos — visit the YouTube channel directly.')
      } finally {
        setLoading(false)
      }
    }
    fetchVideos()
  }, [])

  return (
    <div className="mob-pad-page" style={{ position: 'relative', zIndex: 1, maxWidth: '1400px', margin: '0 auto', padding: '28px 32px 60px' }}>
      <style dangerouslySetInnerHTML={{ __html: `
        .vid-card:hover { transform: translateY(-3px); border-color: var(--border2, rgba(255,255,255,0.14)); }
        .vid-card:hover .vid-thumb-img { transform: scale(1.04); }
        .vid-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 16px; }
        @media (max-width: 900px) { .vid-grid { grid-template-columns: repeat(2,1fr); } .vid-top { grid-template-columns: 1fr !important; } }
        @media (max-width: 560px) { .vid-grid { grid-template-columns: 1fr; } }
      ` }} />

      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <div style={{ width: '3px', height: '24px', background: '#00D47E', borderRadius: '2px' }} />
          <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '2px', color: '#00D47E', textTransform: 'uppercase' }}>Videos</span>
        </div>
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(2.5rem,5vw,3.5rem)', lineHeight: 1, marginBottom: '8px' }}>Latest Videos</div>
        <p style={{ color: 'var(--muted)', fontSize: '14px', maxWidth: '640px', lineHeight: 1.6 }}>
          Your go-to F1 Fantasy content from @formulafantasyhub — previews, chip calls and team reveals every race week.
        </p>
      </div>

      {/* Top row: player + subscribe CTA */}
      <div className="vid-top" style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '28px', alignItems: 'center', marginBottom: '28px' }}>
        <div style={{ position: 'relative', aspectRatio: '16/9', borderRadius: '14px', overflow: 'hidden', border: '1px solid var(--border)', background: '#000' }}>
          <iframe
            src="https://www.youtube.com/embed/videoseries?list=UU8vDGmYVis-6zsmAMoVoPDA"
            title="Formula Fantasy Hub latest uploads"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
          />
        </div>
        <div>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '10px', fontWeight: 700, padding: '3px 9px', borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '0.6px', color: '#E8002D', background: 'rgba(232,0,45,0.12)' }}>
            <span style={{ width: '7px', height: '7px', background: '#E8002D', borderRadius: '50%', animation: 'pulse 2s infinite', flexShrink: 0 }} />
            Latest uploads
          </span>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '44px', lineHeight: 1, margin: '12px 0 8px' }}>Formula Fantasy Hub</div>
          <p style={{ color: 'var(--muted)', fontSize: '14px', marginBottom: '16px' }}>The most followed dedicated F1 Fantasy community on YouTube and X.</p>
          <a
            href="https://www.youtube.com/@formulafantasyhub?sub_confirmation=1"
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#E8002D', color: '#fff', padding: '10px 22px', borderRadius: '8px', textDecoration: 'none', fontSize: '13px', fontWeight: 600, border: '1px solid #E8002D' }}
          >
            <PlayIcon /> Subscribe on YouTube
          </a>
        </div>
      </div>

      {/* Video grid */}
      {loading ? (
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '14px', padding: '60px', textAlign: 'center' }}>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '24px', color: 'var(--muted)', marginBottom: '8px' }}>Loading videos...</div>
          <div style={{ fontSize: '13px', color: 'var(--muted2)' }}>Fetching latest from YouTube</div>
        </div>
      ) : error || videos.length === 0 ? (
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '14px', padding: '32px', textAlign: 'center' }}>
          <p style={{ fontSize: '13px', color: 'var(--muted)', margin: 0 }}>{error || 'No recent uploads to show right now — check the player above for the latest content.'}</p>
        </div>
      ) : (
        <div className="vid-grid">
          {videos.map(video => <VideoCard key={video.id} video={video} />)}
        </div>
      )}
    </div>
  )
}
