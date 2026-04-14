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
  name: 'Miami International Autodrome',
  location: 'Miami Gardens, Florida',
  country: 'United States',
  flag: 'us',
  laps: 57,
  distance: '5.412 km',
  lapRecord: '1:29.708',
  lapRecordHolder: 'M. Verstappen',
  lapRecordYear: 2023,
  firstGP: 2022,
  description: 'A purpose-built street-style circuit around the Hard Rock Stadium complex. Long straights, heavy braking zones and a mix of slow and medium-speed corners. Safety cars are common and pit stop strategy is critical. High kerb usage and track limits are a recurring factor.',
  drsZones: 3,
  turns: 19,
}
