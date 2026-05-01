import { NextResponse } from 'next/server'

const CHANNEL_ID = 'UC8vDGmYVis-6zsmAMoVoPDA'

export async function GET() {
  const key = process.env.YOUTUBE_API_KEY
  if (!key) {
    return NextResponse.json({ error: 'API key not configured' }, { status: 500 })
  }

  try {
    const [searchRes, liveRes] = await Promise.all([
      fetch(
        `https://www.googleapis.com/youtube/v3/search?key=${key}&channelId=${CHANNEL_ID}&part=snippet&order=date&maxResults=12&type=video`,
        { next: { revalidate: 300 } }
      ),
      fetch(
        `https://www.googleapis.com/youtube/v3/search?key=${key}&channelId=${CHANNEL_ID}&part=snippet&eventType=live&type=video&maxResults=5`,
        { next: { revalidate: 60 } }
      ),
    ])

    if (!searchRes.ok) {
      const err = await searchRes.json().catch(() => ({}))
      return NextResponse.json({ error: 'YouTube API error', details: err }, { status: searchRes.status })
    }

    const videos = await searchRes.json()
    const live = liveRes.ok ? await liveRes.json() : { items: [] }

    return NextResponse.json({ videos, live })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch from YouTube' }, { status: 500 })
  }
}
