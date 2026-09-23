import { NextResponse } from 'next/server'

const CHANNEL_ID = 'UC8vDGmYVis-6zsmAMoVoPDA'

export async function GET() {
  const key = process.env.YOUTUBE_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_API_KEY
  if (!key) {
    console.error('No YouTube API key configured')
    return NextResponse.json({ error: 'API key not configured' }, { status: 500 })
  }

  try {
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/search?key=${key}&channelId=${CHANNEL_ID}&part=snippet&order=date&maxResults=12&type=video`,
      { next: { revalidate: 300 } }
    )

    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      // Log only the status + YouTube's own error message — never the
      // request URL (it contains the key as a query param).
      console.error('YouTube API error', res.status, err?.error?.message ?? err?.error ?? 'unknown error')
      return NextResponse.json({ error: 'YouTube API error', details: err }, { status: res.status })
    }

    const videos = await res.json()
    return NextResponse.json({ videos })
  } catch (e) {
    console.error('Failed to fetch from YouTube', e instanceof Error ? e.message : String(e))
    return NextResponse.json({ error: 'Failed to fetch from YouTube' }, { status: 500 })
  }
}
