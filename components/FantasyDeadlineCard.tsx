'use client'

import { useEffect, useState } from 'react'
import { CURRENT_RACE } from '@/lib/races'

function getDeadline(): Date | null {
  if (CURRENT_RACE.isSprint) {
    const sprint = CURRENT_RACE.sessions.find(s => s.name === 'Sprint')
    return sprint?.dateISO ? new Date(sprint.dateISO) : null
  } else {
    const qual = CURRENT_RACE.sessions.find(s => s.name === 'Qualifying')
    return qual?.dateISO ? new Date(qual.dateISO) : null
  }
}

function calcTimeLeft(deadline: Date) {
  const diff = deadline.getTime() - Date.now()
  if (diff <= 0) return null
  const totalSecs = Math.floor(diff / 1000)
  const days    = Math.floor(totalSecs / 86400)
  const hours   = Math.floor((totalSecs % 86400) / 3600)
  const minutes = Math.floor((totalSecs % 3600) / 60)
  const seconds = totalSecs % 60
  return { days, hours, minutes, seconds }
}

function pad(n: number) { return String(n).padStart(2, '0') }

export default function FantasyDeadlineCard() {
  const deadline = getDeadline()
  const [timeLeft, setTimeLeft] = useState(() => deadline ? calcTimeLeft(deadline) : null)

  useEffect(() => {
    if (!deadline) return
    const id = setInterval(() => setTimeLeft(calcTimeLeft(deadline)), 1000)
    return () => clearInterval(id)
  }, [deadline])

  const deadlineLabel = CURRENT_RACE.isSprint ? 'Sprint Race' : 'Qualifying'

  return (
    <div style={{ background: '#0E1318', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', overflow: 'hidden', position: 'relative' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg,#FFB800,rgba(255,184,0,0.2))' }} />
      <div style={{ padding: '16px 20px 12px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <span style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '1.5px', color: '#5A6A7A' }}>
          F1 Fantasy Deadline
        </span>
      </div>

      <div style={{ padding: '16px 20px 20px' }}>
        {/* Race label */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
          <span style={{ fontFamily: 'Twemoji Country Flags, DM Sans, sans-serif', fontSize: '18px' }}>{CURRENT_RACE.flag}</span>
          <div>
            <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '18px', lineHeight: 1, color: '#F0F4F8' }}>{CURRENT_RACE.name} GP</div>
            <div style={{ fontSize: '10px', color: '#5A6A7A', marginTop: '2px' }}>Locks at {deadlineLabel}</div>
          </div>
        </div>

        {/* Countdown */}
        {timeLeft ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '6px' }}>
            {[
              { value: timeLeft.days,    label: 'DAYS' },
              { value: timeLeft.hours,   label: 'HRS' },
              { value: timeLeft.minutes, label: 'MIN' },
              { value: timeLeft.seconds, label: 'SEC' },
            ].map(({ value, label }) => (
              <div key={label} style={{ background: '#141B22', border: '1px solid rgba(255,184,0,0.15)', borderRadius: '8px', padding: '10px 6px', textAlign: 'center' as const }}>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '22px', fontWeight: 700, color: '#FFB800', lineHeight: 1 }}>
                  {pad(value)}
                </div>
                <div style={{ fontSize: '9px', fontWeight: 600, letterSpacing: '0.8px', color: '#3A4A5A', marginTop: '4px' }}>{label}</div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center' as const, padding: '20px 0' }}>
            <div style={{ fontSize: '13px', color: '#E8002D', fontWeight: 600 }}>Deadline passed</div>
            <div style={{ fontSize: '11px', color: '#3A4A5A', marginTop: '4px' }}>Transfers are locked</div>
          </div>
        )}

        {/* Subtext */}
        {timeLeft && (
          <div style={{ marginTop: '12px', fontSize: '10px', color: '#3A4A5A', textAlign: 'center' as const }}>
            Based on your local time
          </div>
        )}
      </div>
    </div>
  )
}
