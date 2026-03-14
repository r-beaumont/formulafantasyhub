export interface DriverStanding {
  pos: number
  id: string
  name: string
  shortName: string
  team: string
  teamColor: string
  nationality: string
  points: number
  wins: number
}

export interface ConstructorStanding {
  pos: number
  name: string
  color: string
  points: number
  wins: number
}

// ✏️ Update after each race
export const DRIVER_STANDINGS: DriverStanding[] = [
  { pos: 1, id: 'russell', name: 'George Russell', shortName: 'G. Russell', team: 'Mercedes', teamColor: '#27F4D2', nationality: '🇬🇧', points: 25, wins: 1 },
  { pos: 2, id: 'antonelli', name: 'Kimi Antonelli', shortName: 'K. Antonelli', team: 'Mercedes', teamColor: '#27F4D2', nationality: '🇮🇹', points: 18, wins: 0 },
  { pos: 3, id: 'leclerc', name: 'Charles Leclerc', shortName: 'C. Leclerc', team: 'Ferrari', teamColor: '#E8002D', nationality: '🇲🇨', points: 15, wins: 0 },
  { pos: 4, id: 'hamilton', name: 'Lewis Hamilton', shortName: 'L. Hamilton', team: 'Ferrari', teamColor: '#E8002D', nationality: '🇬🇧', points: 12, wins: 0 },
  { pos: 5, id: 'norris', name: 'Lando Norris', shortName: 'L. Norris', team: 'McLaren', teamColor: '#FF8000', nationality: '🇬🇧', points: 10, wins: 0 },
  { pos: 6, id: 'verstappen', name: 'Max Verstappen', shortName: 'M. Verstappen', team: 'Red Bull', teamColor: '#3671C6', nationality: '🇳🇱', points: 8, wins: 0 },
  { pos: 7, id: 'bearman', name: 'Oliver Bearman', shortName: 'O. Bearman', team: 'Haas', teamColor: '#B6BABD', nationality: '🇬🇧', points: 6, wins: 0 },
  { pos: 8, id: 'lindblad', name: 'Arvid Lindblad', shortName: 'A. Lindblad', team: 'Racing Bulls', teamColor: '#6692FF', nationality: '🇬🇧', points: 4, wins: 0 },
  { pos: 9, id: 'bortoleto', name: 'Gabriel Bortoleto', shortName: 'G. Bortoleto', team: 'Audi', teamColor: '#C0C0C0', nationality: '🇧🇷', points: 2, wins: 0 },
  { pos: 10, id: 'gasly', name: 'Pierre Gasly', shortName: 'P. Gasly', team: 'Alpine', teamColor: '#FF69B4', nationality: '🇫🇷', points: 1, wins: 0 },
  { pos: 11, id: 'piastri', name: 'Oscar Piastri', shortName: 'O. Piastri', team: 'McLaren', teamColor: '#FF8000', nationality: '🇦🇺', points: 0, wins: 0 },
  { pos: 12, id: 'hadjar', name: 'Isack Hadjar', shortName: 'I. Hadjar', team: 'Red Bull', teamColor: '#3671C6', nationality: '🇫🇷', points: 0, wins: 0 },
  { pos: 13, id: 'sainz', name: 'Carlos Sainz', shortName: 'C. Sainz', team: 'Williams', teamColor: '#64C4FF', nationality: '🇪🇸', points: 0, wins: 0 },
  { pos: 14, id: 'albon', name: 'Alex Albon', shortName: 'A. Albon', team: 'Williams', teamColor: '#64C4FF', nationality: '🇹🇭', points: 0, wins: 0 },
  { pos: 15, id: 'lawson', name: 'Liam Lawson', shortName: 'L. Lawson', team: 'Racing Bulls', teamColor: '#6692FF', nationality: '🇳🇿', points: 0, wins: 0 },
  { pos: 16, id: 'alonso', name: 'Fernando Alonso', shortName: 'F. Alonso', team: 'Aston Martin', teamColor: '#358C75', nationality: '🇪🇸', points: 0, wins: 0 },
  { pos: 17, id: 'stroll', name: 'Lance Stroll', shortName: 'L. Stroll', team: 'Aston Martin', teamColor: '#358C75', nationality: '🇨🇦', points: 0, wins: 0 },
  { pos: 18, id: 'ocon', name: 'Esteban Ocon', shortName: 'E. Ocon', team: 'Haas', teamColor: '#B6BABD', nationality: '🇫🇷', points: 0, wins: 0 },
  { pos: 19, id: 'hulkenberg', name: 'Nico Hülkenberg', shortName: 'N. Hülkenberg', team: 'Audi', teamColor: '#C0C0C0', nationality: '🇩🇪', points: 0, wins: 0 },
  { pos: 20, id: 'colapinto', name: 'Franco Colapinto', shortName: 'F. Colapinto', team: 'Alpine', teamColor: '#FF69B4', nationality: '🇦🇷', points: 0, wins: 0 },
  { pos: 21, id: 'perez', name: 'Sergio Pérez', shortName: 'S. Pérez', team: 'Cadillac', teamColor: '#CC0000', nationality: '🇲🇽', points: 0, wins: 0 },
  { pos: 22, id: 'bottas', name: 'Valtteri Bottas', shortName: 'V. Bottas', team: 'Cadillac', teamColor: '#CC0000', nationality: '🇫🇮', points: 0, wins: 0 },
]

export const CONSTRUCTOR_STANDINGS: ConstructorStanding[] = [
  { pos: 1, name: 'Mercedes', color: '#27F4D2', points: 43, wins: 1 },
  { pos: 2, name: 'Ferrari', color: '#E8002D', points: 27, wins: 0 },
  { pos: 3, name: 'McLaren', color: '#FF8000', points: 10, wins: 0 },
  { pos: 4, name: 'Red Bull Racing', color: '#3671C6', points: 8, wins: 0 },
  { pos: 5, name: 'Haas', color: '#B6BABD', points: 6, wins: 0 },
  { pos: 6, name: 'Racing Bulls', color: '#6692FF', points: 4, wins: 0 },
  { pos: 7, name: 'Audi', color: '#C0C0C0', points: 2, wins: 0 },
  { pos: 8, name: 'Alpine', color: '#FF69B4', points: 1, wins: 0 },
  { pos: 9, name: 'Williams', color: '#64C4FF', points: 0, wins: 0 },
  { pos: 10, name: 'Aston Martin', color: '#358C75', points: 0, wins: 0 },
  { pos: 11, name: 'Cadillac', color: '#CC0000', points: 0, wins: 0 },
]
