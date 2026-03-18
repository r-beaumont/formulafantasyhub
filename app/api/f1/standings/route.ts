import { NextResponse } from 'next/server'
import { DRIVER_STANDINGS, CONSTRUCTOR_STANDINGS } from '@/lib/standings'

const BASE = 'https://api.openf1.org/v1'

export async function GET() {
  try {
    // Get latest race session
    const sessRes = await fetch(`${BASE}/sessions?year=2026&session_name=Race`, { next: { revalidate: 1800 } })
    const sessions = await sessRes.json()

    if (!sessions?.length) throw new Error('No sessions')

    const session_key = sessions[sessions.length - 1].session_key

    const [driverRes, constructorRes, driverInfoRes] = await Promise.all([
      fetch(`${BASE}/championship_drivers?session_key=${session_key}`, { next: { revalidate: 1800 } }),
      fetch(`${BASE}/championship_teams?session_key=${session_key}`, { next: { revalidate: 1800 } }),
      fetch(`${BASE}/drivers?session_key=${session_key}`, { next: { revalidate: 3600 } }),
    ])

    const driverData = await driverRes.json()
    const constructorData = await constructorRes.json()
    const driverInfoData = await driverInfoRes.json()

    if (!Array.isArray(driverData) || !driverData.length) throw new Error('No driver data')

    const infoMap: Record<number, any> = {}
    for (const d of driverInfoData) { infoMap[d.driver_number] = d }

    const drivers = driverData
      .sort((a: any, b: any) => a.position_current - b.position_current)
      .map((d: any) => {
        const info = infoMap[d.driver_number] || {}
        // Match to our standings file to get flag
        const fallback = DRIVER_STANDINGS.find(s => s.shortName === info.name_acronym)
        return {
          position: d.position_current,
          driver_number: d.driver_number,
          name: info.full_name || fallback?.name || `#${d.driver_number}`,
          acronym: info.name_acronym || '',
          team: info.team_name || fallback?.team || '',
          team_colour: info.team_colour ? `#${info.team_colour}` : fallback?.teamColor || '#666',
          flag: fallback?.flag || '🏁',
          points: d.points_current,
          wins: 0,
        }
      })

    const constructors = Array.isArray(constructorData) ? constructorData
      .sort((a: any, b: any) => a.position_current - b.position_current)
      .map((c: any) => {
        const fallback = CONSTRUCTOR_STANDINGS.find(s => s.name === c.team_name)
        return {
          position: c.position_current,
          team: c.team_name,
          team_colour: c.team_colour ? `#${c.team_colour}` : fallback?.color || '#666',
          flag: fallback?.flag || '🏁',
          points: c.points_current,
          wins: fallback?.wins || 0,
        }
      }) : []

    return NextResponse.json({ drivers, constructors, source: 'openf1' })
  } catch (e) {
    // Fallback to static file data
    const drivers = DRIVER_STANDINGS.map(d => ({
      position: d.pos,
      name: d.name,
      acronym: d.shortName,
      team: d.team,
      team_colour: d.teamColor,
      flag: d.flag,
      points: d.points,
      wins: d.wins,
    }))
    const constructors = CONSTRUCTOR_STANDINGS.map(c => ({
      position: c.pos,
      team: c.name,
      team_colour: c.color,
      flag: c.flag,
      points: c.points,
      wins: c.wins,
    }))
    return NextResponse.json({ drivers, constructors, source: 'fallback' })
  }
}
