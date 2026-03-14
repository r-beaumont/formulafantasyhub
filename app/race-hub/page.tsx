import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { CURRENT_RACE, SEASON_CALENDAR } from '@/lib/races'
import { DRIVER_STANDINGS, CONSTRUCTOR_STANDINGS } from '@/lib/standings'
import { CURRENT_CIRCUIT } from '@/lib/circuit'

const card = { background: '#0E1318', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', overflow: 'hidden' as const }
const cardHeader = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px 12px', borderBottom: '1px solid rgba(255,255,255,0.07)' }
const cardTitle = { fontSize: '12px', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '1.5px', color: '#5A6A7A' }

const Badge = ({ type, label }: { type: 'live'|'new'|'race'|'blue'|'sprint', label: string }) => {
  const map = {
    live: { bg: 'rgba(232,0,45,0.15)', color: '#E8002D' },
    new:  { bg: 'rgba(0,212,126,0.12)', color: '#00D47E' },
    race: { bg: 'rgba(255,184,0,0.12)',  color: '#FFB800' },
    blue: { bg: 'rgba(0,168,255,0.12)',  color: '#00A8FF' },
    sprint: { bg: 'rgba(232,0,45,0.15)', color: '#E8002D' },
  }
  const st = map[type]
  return <span style={{ fontSize: '10px', fontWeight: 600, padding: '3px 8px', borderRadius: '4px', letterSpacing: '0.5px', textTransform: 'uppercase' as const, background: st.bg, color: st.color }}>{label}</span>
}

export default function RaceHubPage() {
  const completedSessions = CURRENT_RACE.sessions.filter(s => s.completed).length
  const nextSession = CURRENT_RACE.sessions.find(s => !s.completed)

  return (
    <>
      <Navbar />
      <div style={{ position: 'relative', zIndex: 1, maxWidth: '1400px', margin: '0 auto', padding: '28px 32px 60px' }}>

        {/* Page header */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '2px', color: '#E8002D', textTransform: 'uppercase' as const, marginBottom: '6px' }}>
            Race Hub · Round {CURRENT_RACE.round} of 24
          </div>
          <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '56px', letterSpacing: '1px', lineHeight: 1, marginBottom: '6px' }}>
            {CURRENT_RACE.flag} {CURRENT_RACE.name}
          </div>
          <div style={{ color: '#5A6A7A', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span>{CURRENT_CIRCUIT.name}</span>
            <span style={{ color: '#3A4A5A' }}>·</span>
            <span>{CURRENT_CIRCUIT.laps} laps · {CURRENT_CIRCUIT.distance}</span>
            <span style={{ color: '#3A4A5A' }}>·</span>
            {CURRENT_RACE.isSprint
              ? <span style={{ color: '#E8002D', fontWeight: 600 }}>⚡ Sprint Weekend</span>
              : <span>Standard Weekend</span>}
          </div>
        </div>

        {/* Session schedule */}
        <div style={{ ...card, marginBottom: '20px' }}>
          <div style={cardHeader}>
            <span style={cardTitle}>Weekend Schedule</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {nextSession && <span style={{ fontSize: '12px', color: '#5A6A7A' }}>Next: <strong style={{ color: '#F0F4F8' }}>{nextSession.name}</strong> — {nextSession.timeUTC}</span>}
              <Badge type="live" label="Live Weekend" />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${CURRENT_RACE.sessions.length}, 1fr)` }}>
            {CURRENT_RACE.sessions.map((session, i) => {
              const isNext = session === nextSession
              return (
                <div key={session.name} style={{
                  padding: '20px',
                  borderRight: i < CURRENT_RACE.sessions.length - 1 ? '1px solid rgba(255,255,255,0.07)' : 'none',
                  background: isNext ? 'rgba(232,0,45,0.05)' : session.completed ? 'transparent' : 'transparent',
                  borderTop: isNext ? '2px solid #E8002D' : '2px solid transparent',
                }}>
                  <div style={{ fontSize: '10px', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '1.5px', marginBottom: '10px', color: session.completed ? '#3A4A5A' : isNext ? '#E8002D' : '#5A6A7A' }}>
                    {session.completed ? '✓ Complete' : isNext ? '● Next' : 'Upcoming'}
                  </div>
                  <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '20px', marginBottom: '8px', color: session.completed ? '#3A4A5A' : '#F0F4F8', lineHeight: 1 }}>
                    {session.name}
                  </div>
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '14px', fontWeight: 600, color: session.completed ? '#3A4A5A' : '#FFB800', marginBottom: '4px' }}>
                    {session.timeUTC}
                  </div>
                  <div style={{ fontSize: '11px', color: '#3A4A5A', marginBottom: '2px' }}>{session.date}</div>
                  <div style={{ fontSize: '11px', color: '#3A4A5A' }}>Local: {session.timeLocal}</div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Weather + circuit row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px', marginBottom: '20px' }}>

          {/* Weather */}
          <div style={card}>
            <div style={cardHeader}>
              <span style={cardTitle}>Weekend Weather</span>
              <Badge type="new" label="Forecast" />
            </div>
            <div style={{ padding: '20px' }}>
              {[
                { day: 'Friday', date: 'Mar 13', icon: '🌤️', temp: '16°C', condition: 'Partly cloudy', rain: '10%' },
                { day: 'Saturday', date: 'Mar 14', icon: '⛅', temp: '15°C', condition: 'Mostly cloudy', rain: '20%' },
                { day: 'Sunday', date: 'Mar 15', icon: '🌧️', temp: '13°C', condition: 'Light rain possible', rain: '45%' },
              ].map((w, i) => (
                <div key={w.day} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '10px 0', borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                  <span style={{ fontSize: '24px', flexShrink: 0 }}>{w.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '13px', fontWeight: 600 }}>{w.day} <span style={{ color: '#5A6A7A', fontWeight: 400, fontSize: '11px' }}>{w.date}</span></div>
                    <div style={{ fontSize: '11px', color: '#5A6A7A', marginTop: '2px' }}>{w.condition}</div>
                  </div>
                  <div style={{ textAlign: 'right' as const }}>
                    <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '16px', fontWeight: 600 }}>{w.temp}</div>
                    <div style={{ fontSize: '11px', color: parseInt(w.rain) > 30 ? '#00A8FF' : '#5A6A7A' }}>💧 {w.rain}</div>
                  </div>
                </div>
              ))}
              <div style={{ marginTop: '12px', padding: '10px', background: '#141B22', borderRadius: '8px', fontSize: '11px', color: '#5A6A7A' }}>
                ⚠️ Weather forecast — verify closer to race day
              </div>
            </div>
          </div>

          {/* Circuit info */}
          <div style={card}>
            <div style={cardHeader}>
              <span style={cardTitle}>Circuit Information</span>
              <Badge type="blue" label={CURRENT_CIRCUIT.flag + ' ' + CURRENT_CIRCUIT.location} />
            </div>
            <div style={{ padding: '20px' }}>
              <p style={{ color: '#5A6A7A', fontSize: '13px', lineHeight: 1.7, marginBottom: '20px' }}>
                {CURRENT_CIRCUIT.description}
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '12px' }}>
                {[
                  { label: 'Circuit Length', value: CURRENT_CIRCUIT.distance },
                  { label: 'Race Laps', value: String(CURRENT_CIRCUIT.laps) },
                  { label: 'Turns', value: String(CURRENT_CIRCUIT.turns) },
                  { label: 'DRS Zones', value: String(CURRENT_CIRCUIT.drsZones) },
                  { label: 'Lap Record', value: CURRENT_CIRCUIT.lapRecord },
                  { label: 'Record Holder', value: CURRENT_CIRCUIT.lapRecordHolder },
                  { label: 'Record Year', value: String(CURRENT_CIRCUIT.lapRecordYear) },
                  { label: 'First GP', value: String(CURRENT_CIRCUIT.firstGP) },
                ].map((stat) => (
                  <div key={stat.label} style={{ background: '#141B22', borderRadius: '8px', padding: '12px' }}>
                    <div style={{ fontSize: '10px', color: '#5A6A7A', textTransform: 'uppercase' as const, letterSpacing: '1px', marginBottom: '4px' }}>{stat.label}</div>
                    <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '14px', fontWeight: 600 }}>{stat.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Standings row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>

          {/* Driver standings */}
          <div style={card}>
            <div style={cardHeader}>
              <span style={cardTitle}>Drivers Championship</span>
              <Badge type="race" label="After R1" />
            </div>
            <div style={{ padding: '8px 20px', maxHeight: '420px', overflowY: 'auto' as const }}>
              {DRIVER_STANDINGS.map((d) => {
                const posColors: Record<number,string> = { 1: '#FFD700', 2: '#C0C0C0', 3: '#CD7F32' }
                const posColor = posColors[d.pos] || '#3A4A5A'
                return (
                  <div key={d.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', color: posColor, width: '20px', fontWeight: d.pos <= 3 ? 600 : 400 }}>{d.pos}</span>
                    <div style={{ width: '3px', height: '28px', borderRadius: '2px', background: d.teamColor, flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '13px', fontWeight: 500 }}>{d.nationality} {d.name}</div>
                      <div style={{ fontSize: '11px', color: '#5A6A7A' }}>{d.team}</div>
                    </div>
                    {d.wins > 0 && <span style={{ fontSize: '10px', fontWeight: 600, padding: '2px 6px', borderRadius: '4px', background: 'rgba(255,184,0,0.12)', color: '#FFB800' }}>{d.wins}W</span>}
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '15px', fontWeight: 600, color: d.points > 0 ? '#F0F4F8' : '#3A4A5A', width: '32px', textAlign: 'right' as const }}>{d.points}</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Constructor standings */}
          <div style={card}>
            <div style={cardHeader}>
              <span style={cardTitle}>Constructors Championship</span>
              <Badge type="race" label="After R1" />
            </div>
            <div style={{ padding: '20px' }}>
              {CONSTRUCTOR_STANDINGS.map((c) => {
                const posColors: Record<number,string> = { 1: '#FFD700', 2: '#C0C0C0', 3: '#CD7F32' }
                const posColor = posColors[c.pos] || '#3A4A5A'
                const maxPts = CONSTRUCTOR_STANDINGS[0].points
                return (
                  <div key={c.name} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '9px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', color: posColor, width: '20px', fontWeight: c.pos <= 3 ? 600 : 400 }}>{c.pos}</span>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: c.color, flexShrink: 0 }} />
                    <span style={{ flex: 1, fontSize: '13px', fontWeight: 500 }}>{c.name}</span>
                    <div style={{ width: '100px', height: '4px', background: '#1C2630', borderRadius: '2px', overflow: 'hidden' }}>
                      <div style={{ width: maxPts > 0 ? `${(c.points / maxPts) * 100}%` : '0%', height: '100%', background: c.color, borderRadius: '2px', opacity: 0.8 }} />
                    </div>
                    {c.wins > 0 && <span style={{ fontSize: '10px', fontWeight: 600, padding: '2px 6px', borderRadius: '4px', background: 'rgba(255,184,0,0.12)', color: '#FFB800' }}>{c.wins}W</span>}
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '15px', fontWeight: 600, color: c.points > 0 ? '#F0F4F8' : '#3A4A5A', width: '32px', textAlign: 'right' as const }}>{c.points}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Season calendar */}
        <div style={card}>
          <div style={cardHeader}>
            <span style={cardTitle}>2026 Season Calendar</span>
            <Badge type="blue" label="24 Rounds" />
          </div>
          <div style={{ padding: '16px 20px', display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: '8px' }}>
            {SEASON_CALENDAR.map((race) => {
              const isPast = race.round < CURRENT_RACE.round
              const isCurrent = race.round === CURRENT_RACE.round
              return (
                <div key={race.round} style={{
                  background: isCurrent ? 'rgba(232,0,45,0.08)' : '#141B22',
                  border: isCurrent ? '1px solid rgba(232,0,45,0.3)' : '1px solid rgba(255,255,255,0.04)',
                  borderRadius: '8px', padding: '10px 12px',
                  opacity: isPast ? 0.4 : 1,
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#3A4A5A' }}>R{race.round}</span>
                    {race.sprint && <span style={{ fontSize: '8px', fontWeight: 700, padding: '1px 4px', borderRadius: '3px', background: 'rgba(232,0,45,0.15)', color: '#E8002D' }}>S</span>}
                  </div>
                  <div style={{ fontSize: '14px', marginBottom: '2px' }}>{race.flag}</div>
                  <div style={{ fontSize: '11px', fontWeight: isCurrent ? 600 : 400, color: isCurrent ? '#F0F4F8' : '#5A6A7A' }}>{race.name}</div>
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#3A4A5A', marginTop: '2px' }}>{race.date}</div>
                </div>
              )
            })}
          </div>
        </div>

      </div>
      <Footer />
    </>
  )
}
