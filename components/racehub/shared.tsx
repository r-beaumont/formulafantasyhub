'use client'
// Race Hub-local presentational helpers. Reuses components/home/shared.tsx for
// generic tokens (Flag, card styles, risk colours, buttons) rather than
// redefining them — only the sliding pill toggle is duplicated here since the
// Home page's version is a local, unexported function.
import { useLayoutEffect, useRef, useState } from 'react'
import { cardHeaderTitleStyle } from '@/components/ui/CardHeader'

export interface PillOption {
  id: string
  label: string
}

// Re-exported under its old name for the tab components that already import
// it (OverviewTab, PitwallTab, RaceInfoTab, WeatherTab) — now backed by the
// single shared CardHeader definition instead of a hand-copied duplicate.
export const rhCardTitleStyle = cardHeaderTitleStyle

export function PillToggle({ options, value, onChange }: { options: PillOption[]; value: string; onChange: (v: string) => void }) {
  const btnRefs = useRef<Record<string, HTMLButtonElement | null>>({})
  const [thumb, setThumb] = useState({ left: 0, width: 0 })

  useLayoutEffect(() => {
    const btn = btnRefs.current[value]
    if (btn) setThumb({ left: btn.offsetLeft, width: btn.offsetWidth })
  }, [value, options])

  return (
    <div style={{ position: 'relative', display: 'inline-flex', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '999px', padding: '4px', maxWidth: '100%', overflowX: 'auto' }}>
      <span style={{ position: 'absolute', top: '4px', bottom: '4px', left: thumb.left, width: thumb.width, borderRadius: '999px', background: 'var(--surface3)', boxShadow: '0 2px 10px rgba(0,0,0,0.25)', transition: 'left .32s cubic-bezier(.3,.8,.2,1), width .32s cubic-bezier(.3,.8,.2,1)' }} />
      {options.map(o => (
        <button
          key={o.id}
          ref={el => { btnRefs.current[o.id] = el }}
          onClick={() => onChange(o.id)}
          style={{ position: 'relative', zIndex: 1, background: 'transparent', border: 'none', color: value === o.id ? 'var(--text)' : 'var(--muted)', padding: '7px 16px', borderRadius: '999px', fontSize: '13px', fontWeight: 600, whiteSpace: 'nowrap', cursor: 'pointer', transition: 'color .25s' }}
        >{o.label}</button>
      ))}
    </div>
  )
}

// Team-colour gradient row background, shared by any driver/team row on this
// page (circuit snapshot winner row, pole position row, etc). Inject once per
// page and apply the `.rh-team-row` class + `--tc` custom property.
export const teamRowStyleTag = `
  .rh-team-row { background: linear-gradient(90deg, color-mix(in srgb, var(--tc) 10%, transparent), transparent 45%); transition: background .25s; }
  .rh-team-row:hover { background: linear-gradient(90deg, color-mix(in srgb, var(--tc) 26%, transparent), transparent 70%); }
  .rh-team-row:hover .rh-team-tl { box-shadow: 0 0 10px var(--tc); }
  .rh-team-row:hover .rh-team-flag { transform: scale(1.14); }
`

// Abbreviated winner names (e.g. "L. Norris") from lib/circuitOverview.ts,
// resolved to a full display name + team. Falls back to the raw string.
export const WINNER_DISPLAY_MAP: Record<string, string> = {
  'L. Norris': 'Lando Norris (McLaren)',
  'O. Piastri': 'Oscar Piastri (McLaren)',
  'G. Russell': 'George Russell (Mercedes)',
  'M. Verstappen': 'Max Verstappen (Red Bull)',
}

// Surname -> flag, for the abbreviated winner strings above.
export const WINNER_FLAG_MAP: Record<string, string> = {
  Norris: 'gb',
  Piastri: 'au',
  Russell: 'gb',
  Verstappen: 'nl',
}

export function winnerFlag(abbrev: string | null): string | null {
  if (!abbrev) return null
  const surname = abbrev.split('. ').pop() ?? abbrev
  return WINNER_FLAG_MAP[surname] ?? null
}
