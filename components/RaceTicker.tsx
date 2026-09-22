'use client'
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { useCurrentRace } from '@/lib/useCurrentRace'
import type { TickerStaticData } from '@/lib/tickerData'

// Context bridges the server-computed static ticker data (leaders, last race,
// latest article — see lib/tickerData.ts) down to RaceTicker, which is
// mounted inside Navbar and so cannot receive a prop directly from the
// server component tree in app/layout.tsx. RaceTicker itself still takes a
// plain `data` prop — Navbar reads the context and passes it through.
const TickerDataContext = createContext<TickerStaticData | null>(null)

export function TickerDataProvider({ data, children }: { data: TickerStaticData; children: ReactNode }) {
  return <TickerDataContext.Provider value={data}>{children}</TickerDataContext.Provider>
}

export function useTickerData(): TickerStaticData | null {
  return useContext(TickerDataContext)
}

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
  return (
    <span
      className={`fi fi-${code}`}
      style={{ width: '1.34em', height: '1em', borderRadius: '3px', display: 'inline-block', flexShrink: 0, alignSelf: 'center' }}
    />
  )
}

const boldStyle = { color: 'var(--text)', fontWeight: 600 }
const monoStyle = { fontFamily: "'JetBrains Mono', monospace", color: '#FFB800', fontWeight: 400 }

function buildItems(race: ReturnType<typeof useCurrentRace>, data: TickerStaticData, mutedColor: string, group: string) {
  const nextSession = race.sessions.find(s => !s.completed)
  const deadlineSession = race.isSprint
    ? race.sessions.find(s => s.name === 'Sprint')
    : race.sessions.find(s => s.name === 'Qualifying')

  const itemStyle = {
    display: 'inline-flex' as const, alignItems: 'center' as const, gap: '8px', padding: '0 22px',
    color: mutedColor, borderRight: '1px solid var(--border)', fontSize: '12px', whiteSpace: 'nowrap' as const,
  }

  const items: JSX.Element[] = []

  items.push(
    <span style={itemStyle} key={`${group}-round`}>
      <Flag code={race.flag} /> <span style={boldStyle}>R{race.round} {race.name}</span> {race.dateRange}
    </span>
  )

  if (nextSession?.dateISO) {
    items.push(
      <span style={itemStyle} key={`${group}-next`}>
        <span style={boldStyle}>{nextSession.name}</span> in <span style={monoStyle}>{formatCountdown(nextSession.dateISO)}</span>
      </span>
    )
  }

  if (deadlineSession?.dateISO) {
    items.push(
      <span style={itemStyle} key={`${group}-lock`}>
        F1 Fantasy lock in <span style={monoStyle}>{formatCountdown(deadlineSession.dateISO)}</span>
      </span>
    )
  }

  if (data.driverLeaderName) {
    items.push(
      <span style={itemStyle} key={`${group}-driver-leader`}>
        Leader <Flag code={data.driverLeaderFlag} /> <span style={boldStyle}>{data.driverLeaderName}</span> {data.driverLeaderPoints} pts (+{data.driverGap})
      </span>
    )
  }

  if (data.conLeaderName) {
    items.push(
      <span style={itemStyle} key={`${group}-con-leader`}>
        Constructors <Flag code={data.conLeaderFlag} /> <span style={boldStyle}>{data.conLeaderName}</span> {data.conLeaderPoints} pts
      </span>
    )
  }

  if (data.lastRaceName && data.lastRaceWinner) {
    items.push(
      <span style={itemStyle} key={`${group}-last-race`}>
        Last race <Flag code={data.lastRaceFlag} /> {data.lastRaceName}: <span style={boldStyle}>{data.lastRaceWinner}</span> wins
      </span>
    )
  }

  if (data.latestArticleTitle) {
    items.push(
      <span style={itemStyle} key={`${group}-article`}>
        Latest: <span style={boldStyle}>{data.latestArticleTitle}</span>
      </span>
    )
  }

  return items
}

export default function RaceTicker({ data, theme = 'dark' }: { data: TickerStaticData | null; theme?: 'dark' | 'light' }) {
  const race = useCurrentRace()
  const [, setTick] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 30_000)
    return () => clearInterval(id)
  }, [])

  if (!data) return null

  const mutedColor = theme === 'light' ? '#46566A' : '#8A9AB0'

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes rt-scroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }
      ` }} />
      <div style={{
        position: 'sticky', top: '54px', zIndex: 90,
        height: '32px', display: 'flex', alignItems: 'center',
        background: 'var(--surface)', borderBottom: '1px solid var(--border)',
        overflow: 'hidden', fontFamily: "'DM Sans', sans-serif", fontSize: '12px', fontWeight: 400,
      }}>
        <span style={{
          position: 'relative', zIndex: 2, flexShrink: 0, height: '100%',
          display: 'flex', alignItems: 'center', gap: '7px',
          padding: '0 14px', background: '#E8002D', color: '#fff',
          fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', fontWeight: 700, letterSpacing: '1px',
          boxShadow: '8px 0 14px -4px var(--surface)',
        }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#fff', animation: 'pulse 1.6s infinite', flexShrink: 0 }} />
          RACE WEEK
        </span>
        <div
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          style={{
            flex: 1, minWidth: 0, height: '100%', overflow: 'hidden', display: 'flex', alignItems: 'center',
            WebkitMaskImage: 'linear-gradient(90deg, transparent 0, #000 28px, #000 calc(100% - 28px), transparent)',
            maskImage: 'linear-gradient(90deg, transparent 0, #000 28px, #000 calc(100% - 28px), transparent)',
          }}
        >
          <div style={{
            display: 'flex', whiteSpace: 'nowrap',
            animation: 'rt-scroll 60s linear infinite',
            animationPlayState: paused ? 'paused' : 'running',
          }}>
            {buildItems(race, data, mutedColor, 'a')}
            {buildItems(race, data, mutedColor, 'b')}
          </div>
        </div>
      </div>
    </>
  )
}
