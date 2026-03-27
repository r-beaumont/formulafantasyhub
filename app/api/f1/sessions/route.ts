import { NextResponse } from 'next/server'
const BASE = 'https://api.openf1.org/v1'
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const meeting_key = searchParams.get('meeting_key') || 'latest'
    const res = await fetch(`${BASE}/sessions?meeting_key=${meeting_key}`, { cache: 'no-store' })
    const data = await res.json()
    return NextResponse.json(data)
  } catch (e) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
