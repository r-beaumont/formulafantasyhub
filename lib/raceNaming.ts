import { SEASON_CALENDAR, RACE_FULL_NAMES } from '@/lib/races'

// The only place race names are formatted for display. Never build a race
// name by hand (no `${name} Grand Prix`, no " GP") — call these instead.
//
// - raceFullName:     "Bahrain Grand Prix" — all page content, headings, cards, tables
// - raceShortName:    "Bahrain" — only the ticker, nav race badge and Race Hub round chips
// - raceCircuitLabel: "Sepang International Circuit, Malaysia" — the venue, never the race name

function calendarEntry(round: number) {
  return SEASON_CALENDAR.find(r => r.round === round)
}

export function raceShortName(round: number): string {
  return calendarEntry(round)?.name ?? ''
}

export function raceFullName(round: number): string {
  const short = raceShortName(round)
  return RACE_FULL_NAMES[short] ?? short
}

export function raceCircuitLabel(round: number): string {
  const cal = calendarEntry(round)
  return cal ? `${cal.circuit}, ${cal.country}` : ''
}
