import { NextResponse } from 'next/server'
const BASE = 'https://api.openf1.org/v1'
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const session_key = searchParams.get('session_key') || 'latest'
    const res = await fetch(`${BASE}/weather?session_key=${session_key}`, { cache: 'no-store' })
    const data = await res.json()
    const latest = data[data.length - 1] || null
    return NextResponse.json(latest)
  } catch (e) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
