import { NextResponse } from 'next/server'
const BASE = 'https://api.openf1.org/v1'
export async function GET() {
  try {
    const res = await fetch(`${BASE}/meetings?year=2026`, { next: { revalidate: 3600 } })
    const data = await res.json()
    return NextResponse.json(data)
  } catch (e) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
