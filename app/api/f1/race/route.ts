import { NextResponse } from 'next/server'

const BASE = 'https://api.openf1.org/v1'

const TEAM_COLOURS: Record<string, string> = {
  'mercedes':    '#27F4D2',
  'ferrari':     '#E8002D',
  'mclaren':     '#FF8000',
  'red bull':    '#3671C6',
  'alpine':      '#FF69B4',
  'haas':        '#B6BABD',
  'audi':        '#C0C0C0',
  'racing bulls':'#6692FF',
  'williams':    '#64C4FF',
  'aston martin':'#358C75',
  'cadillac':    '#CC0000',
}

function toProperCase(name: string): string {
  return name.toLowerCase().replace(/\b\w/g, c => c.toUpperCase())
}

function resolveTeamColour(teamName: string): string {
  const tl = teamName.toLowerCase()
  for (const [k, v] of Object.entries(TEAM_COLOURS)) {
    if (tl.includes(k)) return v
  }
  return '#5A6A7A'
}

function shortTeam(t: string): string {
  return t
    .replace(/Red Bull Racing/i, 'Red Bull')
    .replace(/Haas F1 Team/i, 'Haas')
    .replace(/BWT Alpine.*$/i, 'Alpine')
    .replace(/Visa Cash App RB.*/i, 'Racing Bulls')
    .replace(/Aston Martin Aramco.*/i, 'Aston Martin')
}

function formatGap(gap: any): string {
  if (gap == null) return 'NO TIME SET'
  if (gap === 0 || gap === '0') return '—'
  const n = parseFloat(String(gap))
  if (isNaN(n)) return String(gap)
  return n > 0 ? `+${n.toFixed(3)}s` : String(gap)
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionKey = searchParams.get('session_key')
    if (!sessionKey) return NextResponse.json([], { status: 400 })

    const [posRes, intRes, drvRes] = await Promise.all([
      fetch(`${BASE}/position?session_key=${sessionKey}`, { cache: 'no-store' }),
      fetch(`${BASE}/intervals?session_key=${sessionKey}`, { cache: 'no-store' }),
      fetch(`${BASE}/drivers?session_key=${sessionKey}`, { cache: 'no-store' }),
    ])

    const positions: any[] = posRes.ok ? await posRes.json() : []
    const intervals: any[] = intRes.ok ? await intRes.json() : []
    const drivers: any[] = drvRes.ok ? await drvRes.json() : []

    if (!drivers.length && !positions.length) return NextResponse.json([])

    // Driver info map
    const driverMap: Record<number, any> = {}
    for (const d of drivers) driverMap[d.driver_number] = d

    // Latest position per driver
    const latestPos: Record<number, any> = {}
    for (const p of positions) {
      const n: number = p.driver_number
      if (!latestPos[n] || new Date(p.date).getTime() > new Date(latestPos[n].date).getTime()) {
        latestPos[n] = p
      }
    }

    // Latest interval per driver
    const latestInt: Record<number, any> = {}
    for (const iv of intervals) {
      const n: number = iv.driver_number
      if (!latestInt[n] || new Date(iv.date).getTime() > new Date(latestInt[n].date).getTime()) {
        latestInt[n] = iv
      }
    }

    // Collect all driver numbers
    const allNums = new Set<number>([
      ...Object.keys(latestPos).map(Number),
      ...Object.keys(driverMap).map(Number),
    ])

    const results = Array.from(allNums).map(num => {
      const d = driverMap[num] || {}
      const team = shortTeam(d.team_name || 'Unknown')
      const pos = latestPos[num]
      const iv = latestInt[num]
      const position = pos?.position ?? 99
      const gap = iv ? formatGap(iv.gap_to_leader) : 'NO TIME SET'
      return {
        position,
        driver_number: num,
        name: toProperCase(d.full_name || d.broadcast_name || `Driver #${num}`),
        team,
        team_colour: resolveTeamColour(team),
        gap,
      }
    })

    results.sort((a, b) => a.position - b.position)
    return NextResponse.json(results)
  } catch {
    return NextResponse.json([])
  }
}
