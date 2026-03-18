import { NextResponse } from 'next/server'
const BASE = 'https://api.openf1.org/v1'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const year = searchParams.get('year') || '2026'

    const [raceRes, qualiRes] = await Promise.all([
      fetch(`${BASE}/sessions?year=${year}&session_name=Race`, { next: { revalidate: 3600 } }),
      fetch(`${BASE}/sessions?year=${year}&session_name=Qualifying`, { next: { revalidate: 3600 } }),
    ])
    const raceSessions = await raceRes.json()
    const qualiSessions = await qualiRes.json()

    if (!raceSessions.length) return NextResponse.json({ drivers: [] })

    const latestRace = raceSessions[raceSessions.length - 1]
    const driverRes = await fetch(`${BASE}/drivers?session_key=${latestRace.session_key}`, { next: { revalidate: 3600 } })
    const driversData = await driverRes.json()

    const stats: Record<number, any> = {}
    for (const d of driversData) {
      stats[d.driver_number] = {
        driver_number: d.driver_number,
        name: d.full_name || `#${d.driver_number}`,
        acronym: d.name_acronym || '',
        team: d.team_name || '',
        team_colour: d.team_colour ? `#${d.team_colour}` : '#666',
        wins: 0, podiums: 0, poles: 0,
        total_overtakes: 0, total_positions_gained: 0,
        race_count: 0,
      }
    }

    for (const session of raceSessions) {
      try {
        const [posRes, otRes] = await Promise.all([
          fetch(`${BASE}/position?session_key=${session.session_key}`, { next: { revalidate: 3600 } }),
          fetch(`${BASE}/overtakes?session_key=${session.session_key}`, { next: { revalidate: 3600 } }),
        ])
        const positions = await posRes.json()
        const overtakes = await otRes.json()

        const startPos: Record<number, number> = {}
        const endPos: Record<number, number> = {}
        for (const pos of positions) {
          if (!startPos[pos.driver_number]) startPos[pos.driver_number] = pos.position
          endPos[pos.driver_number] = pos.position
        }
        for (const [num, finalPos] of Object.entries(endPos)) {
          const n = Number(num)
          if (!stats[n]) continue
          stats[n].race_count++
          if (finalPos === 1) stats[n].wins++
          if (finalPos <= 3) stats[n].podiums++
          const gained = (startPos[n] || finalPos) - finalPos
          if (gained > 0) stats[n].total_positions_gained += gained
        }
        for (const ot of overtakes) {
          if (stats[ot.overtaking_driver_number]) stats[ot.overtaking_driver_number].total_overtakes++
        }
      } catch (e) {}
    }

    for (const session of qualiSessions) {
      try {
        const posRes = await fetch(`${BASE}/position?session_key=${session.session_key}`, { next: { revalidate: 3600 } })
        const positions = await posRes.json()
        const finalPos: Record<number, number> = {}
        for (const pos of positions) { finalPos[pos.driver_number] = pos.position }
        for (const [num, pos] of Object.entries(finalPos)) {
          const n = Number(num)
          if (stats[n] && pos === 1) stats[n].poles++
        }
      } catch (e) {}
    }

    const drivers = Object.values(stats)
      .filter((d: any) => d.race_count > 0)
      .sort((a: any, b: any) => b.wins - a.wins || b.podiums - a.podiums)

    return NextResponse.json({ drivers })
  } catch (e) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
