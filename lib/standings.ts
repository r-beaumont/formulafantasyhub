import { DRIVER_STATS_MAP, CON_STATS_MAP } from './seasonStats'

export interface DriverStanding {
  pos: number
  id: string
  name: string
  shortName: string
  team: string
  teamColor: string
  flag: string
  points: number
  wins: number
}

export interface ConstructorStanding {
  pos: number
  name: string
  color: string
  flag: string
  points: number
  wins: number
  price?: number
}

// Identity metadata — no hardcoded points or wins (derived from SEASON_STATS below)
const _driverMeta: Omit<DriverStanding, 'pos' | 'points' | 'wins'>[] = [
  { id: 'russell',    name: 'George Russell',    shortName: 'RUS', team: 'Mercedes',        teamColor: '#27F4D2', flag: '🇬🇧' },
  { id: 'antonelli',  name: 'Kimi Antonelli',    shortName: 'ANT', team: 'Mercedes',        teamColor: '#27F4D2', flag: '🇮🇹' },
  { id: 'leclerc',    name: 'Charles Leclerc',   shortName: 'LEC', team: 'Ferrari',         teamColor: '#E8002D', flag: '🇲🇨' },
  { id: 'hamilton',   name: 'Lewis Hamilton',    shortName: 'HAM', team: 'Ferrari',         teamColor: '#E8002D', flag: '🇬🇧' },
  { id: 'bearman',    name: 'Oliver Bearman',    shortName: 'BEA', team: 'Haas',            teamColor: '#B6BABD', flag: '🇬🇧' },
  { id: 'norris',     name: 'Lando Norris',      shortName: 'NOR', team: 'McLaren',         teamColor: '#FF8000', flag: '🇬🇧' },
  { id: 'gasly',      name: 'Pierre Gasly',      shortName: 'GAS', team: 'Alpine',          teamColor: '#FF69B4', flag: '🇫🇷' },
  { id: 'verstappen', name: 'Max Verstappen',    shortName: 'VER', team: 'Red Bull Racing', teamColor: '#3671C6', flag: '🇳🇱' },
  { id: 'lawson',     name: 'Liam Lawson',       shortName: 'LAW', team: 'Racing Bulls',    teamColor: '#6692FF', flag: '🇳🇿' },
  { id: 'lindblad',   name: 'Arvid Lindblad',    shortName: 'LIN', team: 'Racing Bulls',    teamColor: '#6692FF', flag: '🇬🇧' },
  { id: 'hadjar',     name: 'Isack Hadjar',      shortName: 'HAD', team: 'Red Bull Racing', teamColor: '#3671C6', flag: '🇫🇷' },
  { id: 'piastri',    name: 'Oscar Piastri',     shortName: 'PIA', team: 'McLaren',         teamColor: '#FF8000', flag: '🇦🇺' },
  { id: 'sainz',      name: 'Carlos Sainz',      shortName: 'SAI', team: 'Williams',        teamColor: '#64C4FF', flag: '🇪🇸' },
  { id: 'bortoleto',  name: 'Gabriel Bortoleto', shortName: 'BOR', team: 'Audi',            teamColor: '#C0C0C0', flag: '🇧🇷' },
  { id: 'colapinto',  name: 'Franco Colapinto',  shortName: 'COL', team: 'Alpine',          teamColor: '#FF69B4', flag: '🇦🇷' },
  { id: 'ocon',       name: 'Esteban Ocon',      shortName: 'OCO', team: 'Haas',            teamColor: '#B6BABD', flag: '🇫🇷' },
  { id: 'hulkenberg', name: 'Nico Hülkenberg',   shortName: 'HUL', team: 'Audi',            teamColor: '#C0C0C0', flag: '🇩🇪' },
  { id: 'albon',      name: 'Alex Albon',        shortName: 'ALB', team: 'Williams',        teamColor: '#64C4FF', flag: '🇹🇭' },
  { id: 'bottas',     name: 'Valtteri Bottas',   shortName: 'BOT', team: 'Cadillac',        teamColor: '#CC0000', flag: '🇫🇮' },
  { id: 'perez',      name: 'Sergio Pérez',      shortName: 'PER', team: 'Cadillac',        teamColor: '#CC0000', flag: '🇲🇽' },
  { id: 'alonso',     name: 'Fernando Alonso',   shortName: 'ALO', team: 'Aston Martin',    teamColor: '#358C75', flag: '🇪🇸' },
  { id: 'stroll',     name: 'Lance Stroll',      shortName: 'STR', team: 'Aston Martin',    teamColor: '#358C75', flag: '🇨🇦' },
]

export const DRIVER_STANDINGS: DriverStanding[] = _driverMeta
  .map(d => ({
    ...d,
    points: DRIVER_STATS_MAP[d.name]?.points ?? 0,
    wins:   DRIVER_STATS_MAP[d.name]?.wins   ?? 0,
    pos:    0,
  }))
  .sort((a, b) => b.points - a.points)
  .map((d, i) => ({ ...d, pos: i + 1 }))

const _conMeta: Omit<ConstructorStanding, 'pos' | 'points' | 'wins'>[] = [
  { name: 'Mercedes',        color: '#27F4D2', flag: '🇩🇪', price: 34.5 },
  { name: 'Ferrari',         color: '#E8002D', flag: '🇮🇹', price: 23.9 },
  { name: 'Haas',            color: '#B6BABD', flag: '🇺🇸', price: 8.6  },
  { name: 'McLaren',         color: '#FF8000', flag: '🇬🇧', price: 22.0 },
  { name: 'Alpine',          color: '#FF69B4', flag: '🇫🇷', price: 13.5 },
  { name: 'Racing Bulls',    color: '#6692FF', flag: '🇮🇹', price: 12.0 },
  { name: 'Red Bull Racing', color: '#3671C6', flag: '🇦🇹', price: 18.0 },
  { name: 'Williams',        color: '#64C4FF', flag: '🇬🇧', price: 11.5 },
  { name: 'Audi',            color: '#C0C0C0', flag: '🇩🇪', price: 9.5  },
  { name: 'Aston Martin',    color: '#358C75', flag: '🇬🇧', price: 10.5 },
  { name: 'Cadillac',        color: '#CC0000', flag: '🇺🇸', price: 8.0  },
]

export const CONSTRUCTOR_STANDINGS: ConstructorStanding[] = _conMeta
  .map(c => ({
    ...c,
    points: CON_STATS_MAP[c.name]?.points ?? 0,
    wins:   CON_STATS_MAP[c.name]?.wins   ?? 0,
    pos:    0,
  }))
  .sort((a, b) => b.points - a.points)
  .map((c, i) => ({ ...c, pos: i + 1 }))
