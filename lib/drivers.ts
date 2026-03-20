export interface Driver {
  id: string
  name: string
  shortName: string
  number: number
  team: string
  teamColor: string
  nationality: string
  price: number
}

export interface Team {
  id: string
  name: string
  shortName: string
  color: string
  engine: string
  drivers: [string, string]
}

export const TEAMS: Team[] = [
  { id: 'mclaren', name: 'McLaren', shortName: 'MCL', color: '#FF8000', engine: 'Mercedes', drivers: ['norris', 'piastri'] },
  { id: 'mercedes', name: 'Mercedes', shortName: 'MER', color: '#27F4D2', engine: 'Mercedes', drivers: ['russell', 'antonelli'] },
  { id: 'redbull', name: 'Red Bull Racing', shortName: 'RBR', color: '#3671C6', engine: 'Red Bull', drivers: ['verstappen', 'hadjar'] },
  { id: 'ferrari', name: 'Ferrari', shortName: 'FER', color: '#E8002D', engine: 'Ferrari', drivers: ['leclerc', 'hamilton'] },
  { id: 'williams', name: 'Williams', shortName: 'WIL', color: '#64C4FF', engine: 'Mercedes', drivers: ['albon', 'sainz'] },
  { id: 'racingbulls', name: 'Racing Bulls', shortName: 'RB', color: '#6692FF', engine: 'Red Bull', drivers: ['lawson', 'lindblad'] },
  { id: 'astonmartin', name: 'Aston Martin', shortName: 'AMR', color: '#358C75', engine: 'Honda', drivers: ['alonso', 'stroll'] },
  { id: 'haas', name: 'Haas', shortName: 'HAS', color: '#B6BABD', engine: 'Ferrari', drivers: ['ocon', 'bearman'] },
  { id: 'audi', name: 'Audi', shortName: 'AUD', color: '#C0C0C0', engine: 'Audi', drivers: ['hulkenberg', 'bortoleto'] },
  { id: 'alpine', name: 'Alpine', shortName: 'ALP', color: '#FF69B4', engine: 'Renault', drivers: ['gasly', 'colapinto'] },
  { id: 'cadillac', name: 'Cadillac', shortName: 'CAD', color: '#CC0000', engine: 'Ferrari', drivers: ['perez', 'bottas'] },
]

// Prices current as of after Round 2 — China GP
export const DRIVERS: Driver[] = [
  // McLaren
  { id: 'norris', name: 'Lando Norris', shortName: 'L. Norris', number: 4, team: 'mclaren', teamColor: '#FF8000', nationality: '🇬🇧', price: 27.5 },
  { id: 'piastri', name: 'Oscar Piastri', shortName: 'O. Piastri', number: 81, team: 'mclaren', teamColor: '#FF8000', nationality: '🇦🇺', price: 23.5 },
  // Mercedes
  { id: 'russell', name: 'George Russell', shortName: 'G. Russell', number: 63, team: 'mercedes', teamColor: '#27F4D2', nationality: '🇬🇧', price: 28.0 },
  { id: 'antonelli', name: 'Kimi Antonelli', shortName: 'K. Antonelli', number: 12, team: 'mercedes', teamColor: '#27F4D2', nationality: '🇮🇹', price: 23.8 },
  // Red Bull
  { id: 'verstappen', name: 'Max Verstappen', shortName: 'M. Verstappen', number: 1, team: 'redbull', teamColor: '#3671C6', nationality: '🇳🇱', price: 26.5 },
  { id: 'hadjar', name: 'Isack Hadjar', shortName: 'I. Hadjar', number: 6, team: 'redbull', teamColor: '#3671C6', nationality: '🇫🇷', price: 7.8 },
  // Ferrari
  { id: 'leclerc', name: 'Charles Leclerc', shortName: 'C. Leclerc', number: 16, team: 'ferrari', teamColor: '#E8002D', nationality: '🇲🇨', price: 23.4 },
  { id: 'hamilton', name: 'Lewis Hamilton', shortName: 'L. Hamilton', number: 44, team: 'ferrari', teamColor: '#E8002D', nationality: '🇬🇧', price: 22.0 },
  // Williams
  { id: 'albon', name: 'Alex Albon', shortName: 'A. Albon', number: 23, team: 'williams', teamColor: '#64C4FF', nationality: '🇹🇭', price: 10.5 },
  { id: 'sainz', name: 'Carlos Sainz', shortName: 'C. Sainz', number: 55, team: 'williams', teamColor: '#64C4FF', nationality: '🇪🇸', price: 12.0 },
  // Racing Bulls
  { id: 'lawson', name: 'Liam Lawson', shortName: 'L. Lawson', number: 30, team: 'racingbulls', teamColor: '#6692FF', nationality: '🇳🇿', price: 6.9 },
  { id: 'lindblad', name: 'Arvid Lindblad', shortName: 'A. Lindblad', number: 7, team: 'racingbulls', teamColor: '#6692FF', nationality: '🇬🇧', price: 7.4 },
  // Aston Martin
  { id: 'alonso', name: 'Fernando Alonso', shortName: 'F. Alonso', number: 14, team: 'astonmartin', teamColor: '#358C75', nationality: '🇪🇸', price: 10.0 },
  { id: 'stroll', name: 'Lance Stroll', shortName: 'L. Stroll', number: 18, team: 'astonmartin', teamColor: '#358C75', nationality: '🇨🇦', price: 6.5 },
  // Haas
  { id: 'ocon', name: 'Esteban Ocon', shortName: 'E. Ocon', number: 31, team: 'haas', teamColor: '#B6BABD', nationality: '🇫🇷', price: 12.7 },
  { id: 'bearman', name: 'Oliver Bearman', shortName: 'O. Bearman', number: 87, team: 'haas', teamColor: '#B6BABD', nationality: '🇬🇧', price: 8.6 },
  // Audi
  { id: 'hulkenberg', name: 'Nico Hülkenberg', shortName: 'N. Hülkenberg', number: 27, team: 'audi', teamColor: '#C0C0C0', nationality: '🇩🇪', price: 9.0 },
  { id: 'bortoleto', name: 'Gabriel Bortoleto', shortName: 'G. Bortoleto', number: 5, team: 'audi', teamColor: '#C0C0C0', nationality: '🇧🇷', price: 6.4 },
  // Alpine
  { id: 'gasly', name: 'Pierre Gasly', shortName: 'P. Gasly', number: 10, team: 'alpine', teamColor: '#FF69B4', nationality: '🇫🇷', price: 13.8 },
  { id: 'colapinto', name: 'Franco Colapinto', shortName: 'F. Colapinto', number: 43, team: 'alpine', teamColor: '#FF69B4', nationality: '🇦🇷', price: 7.0 },
  // Cadillac
  { id: 'perez', name: 'Sergio Pérez', shortName: 'S. Pérez', number: 11, team: 'cadillac', teamColor: '#CC0000', nationality: '🇲🇽', price: 7.5 },
  { id: 'bottas', name: 'Valtteri Bottas', shortName: 'V. Bottas', number: 77, team: 'cadillac', teamColor: '#CC0000', nationality: '🇫🇮', price: 6.5 },
]

export function getDriverById(id: string) {
  return DRIVERS.find(d => d.id === id)
}

export function getTeamById(id: string) {
  return TEAMS.find(t => t.id === id)
}

export function getDriversByTeam(teamId: string) {
  return DRIVERS.filter(d => d.team === teamId)
}
