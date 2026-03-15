import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { DRIVER_STANDINGS, CONSTRUCTOR_STANDINGS } from '@/lib/standings'

const card = { background: '#0E1318', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', overflow: 'hidden' as const }
const cardHeader = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px 12px', borderBottom: '1px solid rgba(255,255,255,0.07)' }
const cardTitle = { fontSize: '12px', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '1.5px', color: '#5A6A7A' }

export default function StatisticsPage() {
  return (
    <>
      <Navbar />
      <div style={{ position: 'relative', zIndex: 1, maxWidth: '1400px', margin: '0 auto', padding: '28px 32px 60px' }}>

        {/* Header */}
        <div style={{ marginBottom: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <div style={{ width: '3px', height: '24px', background: '#E8002D', borderRadius: '2px' }} />
            <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '2px', color: '#E8002D', textTransform: 'uppercase' as const }}>2026 Season</span>
          </div>
          <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '56px', letterSpacing: '1px', lineHeight: 1 }}>Statistics</div>
        </div>

        {/* Full standings */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>

          {/* Drivers */}
          <div style={card}>
            <div style={cardHeader}>
              <span style={cardTitle}>Drivers Championship — Full</span>
              <span style={{ fontSize: '10px', fontWeight: 600, padding: '3px 8px', borderRadius: '4px', background: 'rgba(255,184,0,0.12)', color: '#FFB800' }}>After R1</span>
            </div>
            <div style={{ padding: '8px 20px' }}>
              {DRIVER_STANDINGS.map((d) => {
                const posColors: Record<number,string> = { 1: '#FFD700', 2: '#C0C0C0', 3: '#CD7F32' }
                return (
                  <div key={d.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '7px 0', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', color: posColors[d.pos] || '#3A4A5A', width: '20px', fontWeight: d.pos <= 3 ? 600 : 400 }}>{d.pos}</span>
                    <div style={{ width: '3px', height: '24px', borderRadius: '2px', background: d.teamColor, flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '13px', fontWeight: 500 }}>{d.nationality} {d.name}</div>
                      <div style={{ fontSize: '11px', color: '#5A6A7A' }}>{d.team}</div>
                    </div>
                    {d.wins > 0 && <span style={{ fontSize: '9px', fontWeight: 700, padding: '2px 5px', borderRadius: '3px', background: 'rgba(255,184,0,0.12)', color: '#FFB800' }}>{d.wins}W</span>}
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '14px', fontWeight: 600, color: d.points > 0 ? '#F0F4F8' : '#3A4A5A', width: '32px', textAlign: 'right' as const }}>{d.points}</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Constructors */}
          <div style={card}>
            <div style={cardHeader}>
              <span style={cardTitle}>Constructors Championship — Full</span>
              <span style={{ fontSize: '10px', fontWeight: 600, padding: '3px 8px', borderRadius: '4px', background: 'rgba(255,184,0,0.12)', color: '#FFB800' }}>After R1</span>
            </div>
            <div style={{ padding: '8px 20px' }}>
              {CONSTRUCTOR_STANDINGS.map((c) => {
                const posColors: Record<number,string> = { 1: '#FFD700', 2: '#C0C0C0', 3: '#CD7F32' }
                const maxPts = CONSTRUCTOR_STANDINGS[0].points
                return (
                  <div key={c.name} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '9px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', color: posColors[c.pos] || '#3A4A5A', width: '20px', fontWeight: c.pos <= 3 ? 600 : 400 }}>{c.pos}</span>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: c.color, flexShrink: 0 }} />
                    <span style={{ flex: 1, fontSize: '13px', fontWeight: 500 }}>{c.name}</span>
                    <div style={{ width: '80px', height: '3px', background: '#1C2630', borderRadius: '2px', overflow: 'hidden' }}>
                      <div style={{ width: maxPts > 0 ? `${(c.points/maxPts)*100}%` : '2px', height: '100%', background: c.color, opacity: 0.8 }} />
                    </div>
                    {c.wins > 0 && <span style={{ fontSize: '9px', fontWeight: 700, padding: '2px 5px', borderRadius: '3px', background: 'rgba(255,184,0,0.12)', color: '#FFB800' }}>{c.wins}W</span>}
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '14px', fontWeight: 600, color: c.points > 0 ? '#F0F4F8' : '#3A4A5A', width: '32px', textAlign: 'right' as const }}>{c.points}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Driver stats table */}
        <div style={{ ...card, marginBottom: '24px' }}>
          <div style={cardHeader}>
            <span style={cardTitle}>Driver Statistics — 2026 Season</span>
            <span style={{ fontSize: '10px', fontWeight: 600, padding: '3px 8px', borderRadius: '4px', background: 'rgba(0,212,126,0.12)', color: '#00D47E' }}>1 Race</span>
          </div>
          <div style={{ padding: '16px 20px', overflowX: 'auto' as const }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' as const }}>
              <thead>
                <tr>
                  {['Pos', 'Driver', 'Team', 'Pts', 'Wins', 'Podiums', 'Poles', 'FL', 'DNF'].map((h) => (
                    <th key={h} style={{ fontSize: '10px', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '1px', color: '#5A6A7A', textAlign: h === 'Driver' || h === 'Team' ? 'left' as const : 'center' as const, padding: '0 8px 10px 0', borderBottom: '1px solid rgba(255,255,255,0.07)', whiteSpace: 'nowrap' as const }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {DRIVER_STANDINGS.slice(0, 10).map((d) => (
                  <tr key={d.id}>
                    <td style={{ padding: '8px 8px 8px 0', borderBottom: '1px solid rgba(255,255,255,0.03)', fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', color: '#5A6A7A' }}>{d.pos}</td>
                    <td style={{ padding: '8px 8px 8px 0', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '3px', height: '20px', borderRadius: '2px', background: d.teamColor }} />
                        <span style={{ fontSize: '13px', fontWeight: 500, whiteSpace: 'nowrap' as const }}>{d.nationality} {d.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: '8px 8px 8px 0', borderBottom: '1px solid rgba(255,255,255,0.03)', fontSize: '12px', color: '#5A6A7A', whiteSpace: 'nowrap' as const }}>{d.team}</td>
                    <td style={{ padding: '8px 8px 8px 0', borderBottom: '1px solid rgba(255,255,255,0.03)', fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', fontWeight: 600, color: d.points > 0 ? '#FFB800' : '#3A4A5A', textAlign: 'center' as const }}>{d.points}</td>
                    <td style={{ padding: '8px 8px 8px 0', borderBottom: '1px solid rgba(255,255,255,0.03)', fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', color: d.wins > 0 ? '#00D47E' : '#3A4A5A', textAlign: 'center' as const }}>{d.wins}</td>
                    <td style={{ padding: '8px 8px 8px 0', borderBottom: '1px solid rgba(255,255,255,0.03)', fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', color: '#5A6A7A', textAlign: 'center' as const }}>—</td>
                    <td style={{ padding: '8px 8px 8px 0', borderBottom: '1px solid rgba(255,255,255,0.03)', fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', color: '#5A6A7A', textAlign: 'center' as const }}>—</td>
                    <td style={{ padding: '8px 8px 8px 0', borderBottom: '1px solid rgba(255,255,255,0.03)', fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', color: '#5A6A7A', textAlign: 'center' as const }}>—</td>
                    <td style={{ padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.03)', fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', color: '#5A6A7A', textAlign: 'center' as const }}>—</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
      <Footer />
    </>
  )
}
