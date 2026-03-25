'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { DRIVER_STANDINGS, CONSTRUCTOR_STANDINGS } from '@/lib/standings'

interface Props {
  limit?: number
  showLink?: boolean
  type?: 'both' | 'drivers' | 'constructors'
}

export default function StandingsWidget({ limit = 5, showLink = true, type = 'both' }: Props) {
  const [drivers, setDrivers] = useState(DRIVER_STANDINGS.slice(0, limit).map(d => ({
    position: d.pos, name: d.name, acronym: d.shortName, team: d.team,
    team_colour: d.teamColor, flag: d.flag, points: d.points, wins: d.wins,
  })))
  const [constructors, setConstructors] = useState(CONSTRUCTOR_STANDINGS.slice(0, limit).map(c => ({
    position: c.pos, team: c.name, team_colour: c.color, flag: c.flag, points: c.points, wins: c.wins,
  })))

  useEffect(() => {
    fetch('/api/f1/standings')
      .then(r => r.json())
      .then(data => {
        if (data.drivers?.length) setDrivers(data.drivers.slice(0, limit))
        if (data.constructors?.length) setConstructors(data.constructors.slice(0, limit))
      })
      .catch(() => {})
  }, [limit])

  const posColor = (pos: number) => ({ 1: '#FFD700', 2: '#C0C0C0', 3: '#CD7F32' }[pos] || '#3A4A5A')
  const card = { background: '#0E1318', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', overflow: 'hidden' as const }
  const header = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px 12px', borderBottom: '1px solid rgba(255,255,255,0.07)' }
  const title = { fontSize: '12px', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '1.5px', color: '#5A6A7A' }

  return (
    <>
      {(type === 'both' || type === 'drivers') && (
        <div style={card}>
          <div style={header}>
            <span style={title}>Drivers Championship</span>
            {showLink && <Link href="/standings" style={{ fontSize: '12px', color: '#E8002D', textDecoration: 'none', fontWeight: 500 }}>Full →</Link>}
          </div>
          <div style={{ padding: '8px 20px' }}>
            {drivers.map((d) => (
              <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', color: posColor(d.position), width: '20px', fontWeight: d.position <= 3 ? 600 : 400 }}>{d.position}</span>
                <div style={{ width: '3px', height: '26px', borderRadius: '2px', background: d.team_colour, flexShrink: 0 }} />
                <span className={`fi fi-${d.flag}`} style={{ width: '1.2em', borderRadius: '2px', display: 'inline-block' }}></span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '13px', fontWeight: 500 }}>{d.name}</div>
                  <div style={{ fontSize: '11px', color: '#5A6A7A' }}>{d.team}</div>
                </div>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '14px', fontWeight: 600 }}>{d.points}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      {(type === 'both' || type === 'constructors') && (
        <div style={card}>
          <div style={header}>
            <span style={title}>Constructors Championship</span>
            {showLink && <Link href="/standings" style={{ fontSize: '12px', color: '#E8002D', textDecoration: 'none', fontWeight: 500 }}>Full →</Link>}
          </div>
          <div style={{ padding: '8px 20px' }}>
            {constructors.map((c) => {
              const maxPts = constructors[0]?.points || 1
              return (
                <div key={c.team} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', color: posColor(c.position), width: '20px', fontWeight: c.position <= 3 ? 600 : 400 }}>{c.position}</span>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: c.team_colour, flexShrink: 0 }} />
                  <span className={`fi fi-${c.flag}`} style={{ width: '1.2em', borderRadius: '2px', display: 'inline-block' }}></span>
                  <span style={{ flex: 1, fontSize: '13px', fontWeight: 500 }}>{c.team}</span>
                  <div style={{ width: '60px', height: '3px', background: '#1C2630', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ width: `${(c.points / maxPts) * 100}%`, height: '100%', background: c.team_colour, opacity: 0.8 }} />
                  </div>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '14px', fontWeight: 600, width: '32px', textAlign: 'right' as const }}>{c.points}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </>
  )
}
