export interface CircuitInfo {
  name: string
  location: string
  country: string
  flag: string
  laps: number
  distance: string
  lapRecord: string
  lapRecordHolder: string
  lapRecordYear: number
  firstGP: number
  description: string
  drsZones: number
  turns: number
}

// ✏️ Update each race week
export const CURRENT_CIRCUIT: CircuitInfo = {
  name: 'Hungaroring',
  location: 'Mogyoród, Hungary',
  country: 'Hungary',
  flag: 'hu',
  laps: 70,
  distance: '4.381 km',
  lapRecord: '1:16.627',
  lapRecordHolder: 'L. Hamilton',
  lapRecordYear: 2020,
  firstGP: 1986,
  description: 'Often described as Monaco without the walls — a tight, twisty circuit in the hills outside Budapest where track position is everything and overtaking opportunities are scarce. Qualifying performance is critical, and the dusty surface rubbers-in progressively across the weekend, rewarding those who improve setup quickly.',
  drsZones: 1,
  turns: 14,
}
