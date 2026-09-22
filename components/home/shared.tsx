// Shared presentational helpers for the Home page's snapshot layout.
// Kept tiny and dependency-free so importing it never pulls heavy data
// (articles/raceResults/standings/circuitOverview) into client bundles.
import type { CSSProperties } from 'react'

export const cardStyle: CSSProperties = {
  background: 'var(--surface)',
  border: '1px solid var(--border)',
  borderRadius: '14px',
  overflow: 'hidden',
}

export const cardHeaderStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '16px 20px 12px',
  borderBottom: '1px solid var(--border)',
  gap: '12px',
}

export const cardTitleStyle: CSSProperties = {
  fontSize: '12px',
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '1.5px',
  color: 'var(--muted)',
}

export const cardLinkStyle: CSSProperties = {
  fontSize: '12px',
  color: '#E8002D',
  fontWeight: 500,
  textDecoration: 'none',
  whiteSpace: 'nowrap',
}

export const monoFont = "'JetBrains Mono', monospace"

export function Flag({ code, size = '1.3em' }: { code: string; size?: string }) {
  return (
    <span
      className={`fi fi-${code}`}
      style={{ width: size, height: '1em', borderRadius: '3px', display: 'inline-block', flexShrink: 0, verticalAlign: 'middle' }}
    />
  )
}

export function riskColors(level: 'LOW' | 'MEDIUM' | 'HIGH' | 'TBC') {
  const map = {
    HIGH:   { color: '#E8002D', bg: 'rgba(232,0,45,.12)',  border: 'rgba(232,0,45,.4)' },
    MEDIUM: { color: '#FF8700', bg: 'rgba(255,135,0,.12)', border: 'rgba(255,135,0,.4)' },
    LOW:    { color: '#00C851', bg: 'rgba(0,200,81,.12)',  border: 'rgba(0,200,81,.4)' },
    TBC:    { color: 'var(--muted)', bg: 'rgba(90,106,122,.15)', border: 'rgba(90,106,122,.4)' },
  } as const
  return map[level]
}

export function RiskBadge({ level }: { level: 'LOW' | 'MEDIUM' | 'HIGH' | 'TBC' }) {
  const c = riskColors(level)
  return (
    <span style={{
      display: 'inline-block', padding: '2px 10px', borderRadius: '4px',
      fontFamily: monoFont, fontWeight: 600, fontSize: '11px', letterSpacing: '0.05em',
      border: `0.5px solid ${c.border}`, color: c.color, background: c.bg,
    }}>{level}</span>
  )
}

export const btnRedStyle: CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: '8px',
  background: '#E8002D', color: '#fff', padding: '10px 22px', borderRadius: '8px',
  textDecoration: 'none', fontSize: '13px', fontWeight: 600, border: '1px solid #E8002D',
}

export const btnOutlineStyle: CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: '8px',
  background: 'transparent', color: 'var(--text)', padding: '10px 22px', borderRadius: '8px',
  textDecoration: 'none', fontSize: '13px', fontWeight: 600, border: '1px solid var(--border2, rgba(255,255,255,0.12))',
}
