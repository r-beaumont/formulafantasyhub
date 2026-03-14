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
  name: 'Shanghai International Circuit',
  location: 'Shanghai, China',
  country: 'China',
  flag: '🇨🇳',
  laps: 56,
  distance: '5.451 km',
  lapRecord: '1:32.238',
  lapRecordHolder: 'M. Schumacher',
  lapRecordYear: 2004,
  firstGP: 2004,
  description: 'One of F1\'s most unique circuits, shaped after the Chinese character "shang" (above). Features an extremely long back straight of 1.2km and high-speed corners in sectors 2 and 3. The tightening Turn 1-2 complex is one of the most distinctive in the sport.',
  drsZones: 2,
  turns: 16,
}
