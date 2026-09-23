// F1 Fantasy-local presentational helpers. Reuses components/home/shared.tsx
// and components/racehub/shared.tsx for generic tokens (Flag, card styles,
// risk colours, PillToggle, CardHeader title) rather than redefining them.
import type { CSSProperties } from 'react'
import { cardHeaderTitleStyle } from '@/components/ui/CardHeader'
import { DRIVER_STANDINGS } from '@/lib/standings'

export const ffCardTitleStyle: CSSProperties = cardHeaderTitleStyle

// Historic team name -> colour, matched by substring (order matters — more
// specific/longer names first where prefixes could collide).
export const HIST_TEAM_COLORS: [string, string][] = [
  ['McLaren', '#FF8000'], ['Mercedes', '#27F4D2'], ['Ferrari', '#E8002D'], ['Red Bull', '#3671C6'],
  ['Williams', '#64C4FF'], ['Aston', '#358C75'], ['Alpine', '#FF69B4'], ['Haas', '#B6BABD'],
  ['Kick Sauber', '#52E252'], ['Sauber', '#52E252'], ['Alfa Romeo', '#C92D4B'], ['AlphaTauri', '#5E8FAA'],
  ['RB ', '#6692FF'], ['Racing Bulls', '#6692FF'], ['Toro Rosso', '#469BFF'], ['Racing Point', '#F596C8'],
  ['Force India', '#F596C8'], ['Renault', '#FFF500'], ['Lotus', '#FFB800'], ['Audi', '#C0C0C0'],
  ['Cadillac', '#CC0000'],
]

export function histCol(team: string): string {
  const match = HIST_TEAM_COLORS.find(([key]) => (team + ' ').includes(key))
  return match?.[1] ?? '#5A6A7A'
}

// Driver History dropdown data — driver list sorted alphabetically per spec.
export const DH_DRIVERS: string[] = [
  'Alexander Albon', 'Andrea Kimi Antonelli', 'Arvid Lindblad', 'Carlos Sainz', 'Charles Leclerc',
  'Esteban Ocon', 'Fernando Alonso', 'Franco Colapinto', 'Gabriel Bortoleto', 'George Russell',
  'Isack Hadjar', 'Lance Stroll', 'Lando Norris', 'Lewis Hamilton', 'Liam Lawson', 'Max Verstappen',
  'Nico Hulkenberg', 'Oliver Bearman', 'Oscar Piastri', 'Pierre Gasly', 'Sergio Perez', 'Valtteri Bottas',
].sort((a, b) => a.localeCompare(b))

// Name in DH_DRIVERS -> name in lib/standings.ts, where they differ.
export const DH_ALIAS: Record<string, string> = {
  'Alexander Albon': 'Alex Albon',
  'Andrea Kimi Antonelli': 'Kimi Antonelli',
  'Nico Hulkenberg': 'Nico Hülkenberg',
  'Sergio Perez': 'Sergio Pérez',
}

export function driverFlag(dhName: string): string | undefined {
  const standingsName = DH_ALIAS[dhName] ?? dhName
  return DRIVER_STANDINGS.find(d => d.name === standingsName)?.flag
}

export function driverTeam(dhName: string): { team: string; teamColor: string } | undefined {
  const standingsName = DH_ALIAS[dhName] ?? dhName
  const d = DRIVER_STANDINGS.find(d => d.name === standingsName)
  return d ? { team: d.team, teamColor: d.teamColor } : undefined
}

export const CIRCUIT_LIST: { value: string; display: string; flag: string; cancelled?: boolean }[] = [
  { value: 'Albert Park (Australia)',                display: 'Albert Park (Australia)',                flag: 'au' },
  { value: 'Shanghai International Circuit (China)', display: 'Shanghai International Circuit (China)', flag: 'cn' },
  { value: 'Suzuka Circuit (Japan)',                 display: 'Suzuka Circuit (Japan)',                 flag: 'jp' },
  { value: 'Miami International Autodrome',          display: 'Miami International Autodrome',          flag: 'us' },
  { value: 'Circuit Gilles Villeneuve (Canada)',     display: 'Circuit Gilles Villeneuve (Canada)',     flag: 'ca' },
  { value: 'Circuit de Monaco',                     display: 'Circuit de Monaco',                     flag: 'mc' },
  { value: 'Circuit de Barcelona-Catalunya',        display: 'Circuit de Barcelona-Catalunya',        flag: 'es' },
  { value: 'Red Bull Ring (Austria)',                display: 'Red Bull Ring (Austria)',                flag: 'at' },
  { value: 'Silverstone Circuit',                   display: 'Silverstone Circuit',                   flag: 'gb' },
  { value: 'Circuit de Spa-Francorchamps',          display: 'Circuit de Spa-Francorchamps',          flag: 'be' },
  { value: 'Hungaroring',                           display: 'Hungaroring',                           flag: 'hu' },
  { value: 'Circuit Zandvoort',                     display: 'Circuit Zandvoort',                     flag: 'nl' },
  { value: 'Autodromo Nazionale di Monza',          display: 'Autodromo Nazionale di Monza',          flag: 'it' },
  { value: 'Madrid Street Circuit',                 display: 'Madrid Street Circuit',                 flag: 'es' },
  { value: 'Baku City Circuit',                     display: 'Baku City Circuit',                     flag: 'az' },
  { value: 'Marina Bay Street Circuit (Singapore)', display: 'Marina Bay Street Circuit (Singapore)', flag: 'sg' },
  { value: 'Circuit of the Americas (Austin)',      display: 'Circuit of the Americas (Austin)',      flag: 'us' },
  { value: 'Autodromo Hermanos Rodriguez (Mexico)', display: 'Autodromo Hermanos Rodriguez (Mexico)', flag: 'mx' },
  { value: 'Autodromo Jose Carlos Pace (Interlagos)', display: 'Autodromo Jose Carlos Pace (Interlagos)', flag: 'br' },
  { value: 'Las Vegas Strip Circuit',               display: 'Las Vegas Strip Circuit',               flag: 'us' },
  { value: 'Lusail International Circuit (Qatar)',  display: 'Lusail International Circuit (Qatar)',  flag: 'qa' },
  { value: 'Yas Marina Circuit (Abu Dhabi)',        display: 'Yas Marina Circuit (Abu Dhabi)',        flag: 'ae' },
  { value: 'Bahrain International Circuit',         display: 'Bahrain International Circuit (Cancelled 2026)', flag: 'bh', cancelled: true },
  { value: 'Jeddah Corniche Circuit (Saudi Arabia)', display: 'Jeddah Corniche Circuit (Saudi Arabia) (Cancelled 2026)', flag: 'sa', cancelled: true },
]

// 2026 round -> CIRCUIT_LIST value, for rounds that have driver-history data.
// Round 16 (Bahrain GP relocated to Sepang) is deliberately absent — it has
// no historical entry, matching the wireframe's DH_ROUND map.
export const ROUND_TO_CIRCUIT: Record<number, string> = {
  1: 'Albert Park (Australia)',
  2: 'Shanghai International Circuit (China)',
  3: 'Suzuka Circuit (Japan)',
  4: 'Miami International Autodrome',
  5: 'Circuit Gilles Villeneuve (Canada)',
  6: 'Circuit de Monaco',
  7: 'Circuit de Barcelona-Catalunya',
  8: 'Red Bull Ring (Austria)',
  9: 'Silverstone Circuit',
  10: 'Circuit de Spa-Francorchamps',
  11: 'Hungaroring',
  12: 'Circuit Zandvoort',
  13: 'Autodromo Nazionale di Monza',
  14: 'Madrid Street Circuit',
  15: 'Baku City Circuit',
  17: 'Marina Bay Street Circuit (Singapore)',
  18: 'Circuit of the Americas (Austin)',
  19: 'Autodromo Hermanos Rodriguez (Mexico)',
  20: 'Autodromo Jose Carlos Pace (Interlagos)',
  21: 'Las Vegas Strip Circuit',
  22: 'Lusail International Circuit (Qatar)',
  23: 'Yas Marina Circuit (Abu Dhabi)',
}

// Team-colour gradient row background, shared by any driver/team row on this
// page. Apply the `.ff-team-row` class + `--tc` custom property.
export const teamRowStyleTag = `
  .ff-team-row { background: linear-gradient(90deg, color-mix(in srgb, var(--tc) 10%, transparent), transparent 45%); transition: background .25s; }
  .ff-team-row:hover { background: linear-gradient(90deg, color-mix(in srgb, var(--tc) 26%, transparent), transparent 70%); }
  .ff-team-row:hover .ff-team-tl { box-shadow: 0 0 10px var(--tc); }
`

export const cardStyle: CSSProperties = {
  background: 'var(--surface)',
  border: '1px solid var(--border)',
  borderRadius: '14px',
  overflow: 'hidden',
}
