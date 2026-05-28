import { ImageResponse } from 'next/og'
import { getArticleBySlug } from '@/lib/articles'

export const runtime = 'edge'

const categoryLabels: Record<string, string> = {
  'Race Preview':  'F1 FANTASY · RACE PREVIEW',
  'Race Review':   'F1 · RACE REVIEW',
  'Strategy':      'F1 FANTASY · STRATEGY',
  'Price Changes': 'F1 FANTASY · PRICE CHANGES',
  'Data Analysis': 'F1 · DATA ANALYSIS',
  'News':          'F1 · NEWS',
  'Technical':     'F1 · TECHNICAL',
}

export async function GET(
  _req: Request,
  { params }: { params: { slug: string } }
) {
  const article = getArticleBySlug(params.slug)

  const title   = article?.title    ?? 'Formula Hub'
  const catLine = article ? (categoryLabels[article.category] ?? 'F1') : 'F1 DATA & STRATEGY'

  return new ImageResponse(
    (
      <div
        style={{
          width:  1200,
          height: 630,
          display: 'flex',
          flexDirection: 'column',
          background: '#080C10',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        {/* Top-left wordmark */}
        <div
          style={{
            position: 'absolute',
            top: 40,
            left: 56,
            display: 'flex',
            alignItems: 'center',
            gap: 0,
          }}
        >
          <span style={{ fontSize: 22, fontWeight: 700, color: '#FFFFFF', letterSpacing: 3, textTransform: 'uppercase' }}>
            FORMULA
          </span>
          <span style={{ fontSize: 22, fontWeight: 700, color: '#E8002D', letterSpacing: 3, textTransform: 'uppercase', marginLeft: 6 }}>
            HUB
          </span>
        </div>

        {/* Top-right red accent dot */}
        <div
          style={{
            position: 'absolute',
            top: 40,
            right: 56,
            width: 12,
            height: 12,
            borderRadius: '50%',
            background: '#E8002D',
          }}
        />

        {/* Centre content */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '80px 80px 100px',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              fontSize: title.length > 50 ? 52 : 64,
              fontWeight: 800,
              color: '#F0F4F8',
              lineHeight: 1.1,
              letterSpacing: -0.5,
              marginBottom: 28,
              maxWidth: 960,
            }}
          >
            {title}
          </div>

          <div
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: '#E8002D',
              letterSpacing: 3,
              textTransform: 'uppercase',
            }}
          >
            {catLine}
          </div>
        </div>

        {/* Bottom red band */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 8,
            background: '#E8002D',
          }}
        />

        {/* Subtle grid lines */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)',
            backgroundSize: '80px 80px',
          }}
        />
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
