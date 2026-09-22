'use client'
import { useEffect, useState } from 'react'
import { useCurrentRace } from '@/lib/useCurrentRace'
import { SEASON_CALENDAR } from '@/lib/races'
import { RACE_WEEKENDS } from '@/lib/raceResults'
import { DRIVER_STANDINGS, CONSTRUCTOR_STANDINGS } from '@/lib/standings'
import { articles } from '@/lib/articles'

function formatCountdown(iso: string): string {
  const ms = new Date(iso).getTime() - Date.now()
  if (ms <= 0) return 'now'
  const totalHours = Math.floor(ms / 3_600_000)
  if (totalHours >= 24) {
    const days = Math.floor(totalHours / 24)
    const hours = totalHours % 24
    return `${days}d ${hours}h`
  }
  const minutes = Math.floor((ms % 3_600_000) / 60_000)
  return `${totalHours}h ${minutes}m`
}

function Flag({ code }: { code: string }) {
  return <span className={`fi fi-${code}`} style={{ width: '1.2em', borderRadius: '2px', display: 'inline-block', flexShrink: 0 }} />
}

function buildItems(race: ReturnType<typeof useCurrentRace>, group: string) {
  const nextSession = race.sessions.find(s => !s.completed)
  const deadlineSession = race.isSprint
    ? race.sessions.find(s => s.name === 'Sprint')
    : race.sessions.find(s => s.name === 'Qualifying')

  const driverLeader = DRIVER_STANDINGS[0]
  const driverSecond = DRIVER_STANDINGS[1]
  const conLeader = CONSTRUCTOR_STANDINGS[0]

  const completedRounds = SEASON_CALENDAR.filter(c => c.completed && !c.calledOff)
  const lastRace = completedRounds[completedRounds.length - 1]
  const lastWinner = lastRace ? RACE_WEEKENDS[lastRace.round]?.race?.[0] : undefined

  const latestArticle = articles[0]

  const items: JSX.Element[] = []

  items.push(
    <span className="tk-item" key={`${group}-round`}>
      <Flag code={race.flag} /> <b>R{race.round} {race.shortName}</b> {race.dateRange}
    </span>
  )

  if (nextSession?.dateISO) {
    items.push(
      <span className="tk-item" key={`${group}-next`}>
        <b>{nextSession.name}</b> in <span style={{ fontFamily: "'JetBrains Mono', monospace", color: 'var(--amber)' }}>{formatCountdown(nextSession.dateISO)}</span>
      </span>
    )
  }

  if (deadlineSession?.dateISO) {
    items.push(
      <span className="tk-item" key={`${group}-lock`}>
        F1 Fantasy lock in <span style={{ fontFamily: "'JetBrains Mono', monospace", color: 'var(--amber)' }}>{formatCountdown(deadlineSession.dateISO)}</span>
      </span>
    )
  }

  if (driverLeader && driverSecond) {
    items.push(
      <span className="tk-item" key={`${group}-driver-leader`}>
        Leader <Flag code={driverLeader.flag} /> <b>{driverLeader.name}</b> {driverLeader.points} pts (+{driverLeader.points - driverSecond.points})
      </span>
    )
  }

  if (conLeader) {
    items.push(
      <span className="tk-item" key={`${group}-con-leader`}>
        Constructors <Flag code={conLeader.flag} /> <b>{conLeader.name}</b> {conLeader.points} pts
      </span>
    )
  }

  if (lastRace && lastWinner) {
    items.push(
      <span className="tk-item" key={`${group}-last-race`}>
        Last race <Flag code={lastRace.flag} /> {lastRace.name}: <b>{lastWinner.name}</b> wins
      </span>
    )
  }

  if (latestArticle) {
    items.push(
      <span className="tk-item" key={`${group}-article`}>
        Latest: <b>{latestArticle.title}</b>
      </span>
    )
  }

  return items
}

export default function RaceTicker() {
  const race = useCurrentRace()
  const [, setTick] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 30_000)
    return () => clearInterval(id)
  }, [])

  return (
    <>
      <style>{`
        .rt-view {
          -webkit-mask-image: linear-gradient(to right, transparent, black 24px, black calc(100% - 24px), transparent);
          mask-image: linear-gradient(to right, transparent, black 24px, black calc(100% - 24px), transparent);
        }
        .rt-track { animation: rt-scroll 60s linear infinite; }
        .rt-wrap:hover .rt-track { animation-play-state: paused; }
        .tk-item { display: inline-flex; align-items: center; gap: 8px; padding: 0 22px; color: var(--muted); border-right: 1px solid var(--border); white-space: nowrap; }
        .tk-item b { color: var(--text); font-weight: 600; }
        @keyframes rt-scroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }
      `}</style>
      <div className="rt-wrap" style={{
        position: 'sticky', top: '54px', zIndex: 90,
        height: '32px', display: 'flex', alignItems: 'center',
        background: 'var(--surface)', borderBottom: '1px solid var(--border)',
        overflow: 'hidden',
      }}>
        <span style={{
          position: 'relative', zIndex: 2, flexShrink: 0, height: '100%',
          display: 'flex', alignItems: 'center', gap: '7px',
          padding: '0 14px', background: '#E8002D', color: '#fff',
          fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', fontWeight: 700, letterSpacing: '1px',
        }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#fff', animation: 'pulse 1.6s infinite', flexShrink: 0 }} />
          RACE WEEK
        </span>
        <div className="rt-view" style={{ flex: 1, overflow: 'hidden', height: '100%', display: 'flex', alignItems: 'center' }}>
          <div className="rt-track" style={{ display: 'flex', whiteSpace: 'nowrap' }}>
            {buildItems(race, 'a')}
            {buildItems(race, 'b')}
          </div>
        </div>
      </div>
    </>
  )
}
