export interface Video {
  id: string
  title: string
  description: string
  publishedAt: string
  thumbnail: string
}

export function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const days = Math.floor(diff / 86400000)
  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days} days ago`
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`
  if (days < 365) return `${Math.floor(days / 30)} months ago`
  return `${Math.floor(days / 365)} years ago`
}

export default function VideoCard({ video }: { video: Video }) {
  return (
    <a
      href={`https://www.youtube.com/watch?v=${video.id}`}
      target="_blank"
      rel="noopener noreferrer"
      className="vid-card"
      style={{
        display: 'block', background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: '14px', overflow: 'hidden', textDecoration: 'none', color: 'inherit',
        transition: 'transform .18s, border-color .18s',
      }}
    >
      <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', overflow: 'hidden', background: 'var(--bg)' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={video.thumbnail} alt="" className="vid-thumb-img" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform .5s' }} />
      </div>
      <div style={{ padding: '14px 16px' }}>
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '15px', fontWeight: 700, lineHeight: 1.4, color: 'var(--text)', marginBottom: '8px' }}>{video.title}</div>
        <div style={{ fontSize: '12px', color: 'var(--muted)' }}>{timeAgo(video.publishedAt)}</div>
      </div>
    </a>
  )
}
