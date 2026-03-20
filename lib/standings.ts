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

// Auto-updated via OpenF1 API on every page load
// This file is the FALLBACK only if API fails
// After R2 China GP
export const DRIVER_STANDINGS: DriverStanding[] = [
  { pos: 1,  id: 'russell',    name: 'George Russell',    shortName: 'RUS', team: 'Mercedes',       teamColor: '#27F4D2', flag: '🇬🇧', points: 51, wins: 1 },
  { pos: 2,  id: 'antonelli',  name: 'Kimi Antonelli',    shortName: 'ANT', team: 'Mercedes',       teamColor: '#27F4D2', flag: '🇮🇹', points: 47, wins: 1 },
  { pos: 3,  id: 'leclerc',    name: 'Charles Leclerc',   shortName: 'LEC', team: 'Ferrari',        teamColor: '#E8002D', flag: '🇲🇨', points: 34, wins: 0 },
  { pos: 4,  id: 'hamilton',   name: 'Lewis Hamilton',    shortName: 'HAM', team: 'Ferrari',        teamColor: '#E8002D', flag: '🇬🇧', points: 33, wins: 0 },
  { pos: 5,  id: 'bearman',    name: 'Oliver Bearman',    shortName: 'BEA', team: 'Haas',           teamColor: '#B6BABD', flag: '🇬🇧', points: 17, wins: 0 },
  { pos: 6,  id: 'norris',     name: 'Lando Norris',      shortName: 'NOR', team: 'McLaren',        teamColor: '#FF8000', flag: '🇬🇧', points: 15, wins: 0 },
  { pos: 7,  id: 'gasly',      name: 'Pierre Gasly',      shortName: 'GAS', team: 'Alpine',         teamColor: '#FF69B4', flag: '🇫🇷', points: 9,  wins: 0 },
  { pos: 8,  id: 'verstappen', name: 'Max Verstappen',    shortName: 'VER', team: 'Red Bull Racing', teamColor: '#3671C6', flag: '🇳🇱', points: 8,  wins: 0 },
  { pos: 9,  id: 'lawson',     name: 'Liam Lawson',       shortName: 'LAW', team: 'Racing Bulls',   teamColor: '#6692FF', flag: '🇳🇿', points: 8,  wins: 0 },
  { pos: 10, id: 'lindblad',   name: 'Arvid Lindblad',    shortName: 'LIN', team: 'Racing Bulls',   teamColor: '#6692FF', flag: '🇬🇧', points: 4,  wins: 0 },
  { pos: 11, id: 'hadjar',     name: 'Isack Hadjar',      shortName: 'HAD', team: 'Red Bull Racing', teamColor: '#3671C6', flag: '🇫🇷', points: 4,  wins: 0 },
  { pos: 12, id: 'piastri',    name: 'Oscar Piastri',     shortName: 'PIA', team: 'McLaren',        teamColor: '#FF8000', flag: '🇦🇺', points: 3,  wins: 0 },
  { pos: 13, id: 'sainz',      name: 'Carlos Sainz',      shortName: 'SAI', team: 'Williams',       teamColor: '#64C4FF', flag: '🇪🇸', points: 2,  wins: 0 },
  { pos: 14, id: 'bortoleto',  name: 'Gabriel Bortoleto', shortName: 'BOR', team: 'Audi',           teamColor: '#C0C0C0', flag: '🇧🇷', points: 2,  wins: 0 },
  { pos: 15, id: 'colapinto',  name: 'Franco Colapinto',  shortName: 'COL', team: 'Alpine',         teamColor: '#FF69B4', flag: '🇦🇷', points: 1,  wins: 0 },
  { pos: 16, id: 'ocon',       name: 'Esteban Ocon',      shortName: 'OCO', team: 'Haas',           teamColor: '#B6BABD', flag: '🇫🇷', points: 0,  wins: 0 },
  { pos: 17, id: 'hulkenberg', name: 'Nico Hülkenberg',   shortName: 'HUL', team: 'Audi',           teamColor: '#C0C0C0', flag: '🇩🇪', points: 0,  wins: 0 },
  { pos: 18, id: 'albon',      name: 'Alex Albon',        shortName: 'ALB', team: 'Williams',       teamColor: '#64C4FF', flag: '🇹🇭', points: 0,  wins: 0 },
  { pos: 19, id: 'bottas',     name: 'Valtteri Bottas',   shortName: 'BOT', team: 'Cadillac',       teamColor: '#CC0000', flag: '🇫🇮', points: 0,  wins: 0 },
  { pos: 20, id: 'perez',      name: 'Sergio Pérez',      shortName: 'PER', team: 'Cadillac',       teamColor: '#CC0000', flag: '🇲🇽', points: 0,  wins: 0 },
  { pos: 21, id: 'alonso',     name: 'Fernando Alonso',   shortName: 'ALO', team: 'Aston Martin',   teamColor: '#358C75', flag: '🇪🇸', points: 0,  wins: 0 },
  { pos: 22, id: 'stroll',     name: 'Lance Stroll',      shortName: 'STR', team: 'Aston Martin',   teamColor: '#358C75', flag: '🇨🇦', points: 0,  wins: 0 },
]

export const CONSTRUCTOR_STANDINGS: ConstructorStanding[] = [
  { pos: 1,  name: 'Mercedes',        color: '#27F4D2', flag: '🇩🇪', points: 98, wins: 2, price: 34.5 },
  { pos: 2,  name: 'Ferrari',         color: '#E8002D', flag: '🇮🇹', points: 67, wins: 0, price: 23.9 },
  { pos: 3,  name: 'Haas',            color: '#B6BABD', flag: '🇺🇸', points: 17, wins: 0, price: 8.6  },
  { pos: 4,  name: 'McLaren',         color: '#FF8000', flag: '🇬🇧', points: 18, wins: 0, price: 22.0 },
  { pos: 5,  name: 'Alpine',          color: '#FF69B4', flag: '🇫🇷', points: 10, wins: 0, price: 13.5 },
  { pos: 6,  name: 'Racing Bulls',    color: '#6692FF', flag: '🇮🇹', points: 12, wins: 0, price: 12.0 },
  { pos: 7,  name: 'Red Bull Racing', color: '#3671C6', flag: '🇦🇹', points: 12, wins: 0, price: 18.0 },
  { pos: 8,  name: 'Williams',        color: '#64C4FF', flag: '🇬🇧', points: 2,  wins: 0, price: 11.5 },
  { pos: 9,  name: 'Audi',            color: '#C0C0C0', flag: '🇩🇪', points: 2,  wins: 0, price: 9.5  },
  { pos: 10, name: 'Aston Martin',    color: '#358C75', flag: '🇬🇧', points: 0,  wins: 0, price: 10.5 },
  { pos: 11, name: 'Cadillac',        color: '#CC0000', flag: '🇺🇸', points: 0,  wins: 0, price: 8.0  },
]
