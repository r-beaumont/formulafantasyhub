import { NextResponse } from 'next/server'
const BASE = 'https://api.openf1.org/v1'

function toProperCase(name: string): string {
  return name.toLowerCase().replace(/\b\w/g, c => c.toUpperCase())
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const session_key = searchParams.get('session_key') || 'latest'
    const session_type = searchParams.get('session_type') || 'race'

    // Fetch drivers for this session
    const driverRes = await fetch(`${BASE}/drivers?session_key=${session_key}`, { next: { revalidate: 3600 } })
    const drivers = await driverRes.json()
    const driverMap: Record<number, any> = {}
    for (const d of drivers) { driverMap[d.driver_number] = d }

    // Use session_result endpoint which works for all session types
    const resultRes = await fetch(`${BASE}/session_result?session_key=${session_key}`, { next: { revalidate: 60 } })
    const resultData = await resultRes.json()

    if (resultData && resultData.length > 0) {
      const results = resultData
        .sort((a: any, b: any) => (a.position || 99) - (b.position || 99))
        .map((r: any) => {
          const driver = driverMap[r.driver_number] || {}
          const isQuali = session_type.includes('qualifying') || session_type.includes('quali')
          let timeDisplay = null
          if (isQuali && r.duration) {
            const t = Array.isArray(r.duration) ? r.duration[r.duration.length - 1] : r.duration
            if (t) timeDisplay = typeof t === 'number' ? t.toFixed(3) + 's' : t
          } else if (r.duration) {
            timeDisplay = typeof r.duration === 'number' ? r.duration.toFixed(3) + 's' : r.duration
          }
          return {
            position: r.position,
            driver_number: r.driver_number,
            name: toProperCase(driver.full_name || `#${r.driver_number}`),
            acronym: driver.name_acronym || '',
            team: driver.team_name || '',
            team_colour: driver.team_colour ? `#${driver.team_colour}` : '#666666',
            time: timeDisplay,
            gap: r.gap_to_leader || null,
            dnf: r.dnf || false,
            dns: r.dns || false,
            dsq: r.dsq || false,
          }
        })
      return NextResponse.json(results)
    }

    // Fallback to position endpoint for race
    const posRes = await fetch(`${BASE}/position?session_key=${session_key}`, { next: { revalidate: 60 } })
    const positions = await posRes.json()
    const lastPositions: Record<number, any> = {}
    for (const pos of positions) {
      if (!lastPositions[pos.driver_number] || new Date(pos.date) > new Date(lastPositions[pos.driver_number].date)) {
        lastPositions[pos.driver_number] = pos
      }
    }
    const results = Object.values(lastPositions)
      .sort((a: any, b: any) => a.position - b.position)
      .map((pos: any) => {
        const driver = driverMap[pos.driver_number] || {}
        return {
          position: pos.position,
          driver_number: pos.driver_number,
          name: toProperCase(driver.full_name || `#${pos.driver_number}`),
          acronym: driver.name_acronym || '',
          team: driver.team_name || '',
          team_colour: driver.team_colour ? `#${driver.team_colour}` : '#666666',
          time: null, gap: null, dnf: false, dns: false, dsq: false,
        }
      })
    return NextResponse.json(results)
  } catch (e) {
    return NextResponse.json({ error: 'Failed to fetch results' }, { status: 500 })
  }
}
