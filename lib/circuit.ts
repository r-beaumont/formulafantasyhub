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
  name: 'Circuit de Spa-Francorchamps',
  location: 'Spa-Francorchamps, Belgium',
  country: 'Belgium',
  flag: 'be',
  laps: 44,
  distance: '7.004 km',
  lapRecord: '1:46.286',
  lapRecordHolder: 'M. Verstappen',
  lapRecordYear: 2023,
  firstGP: 1950,
  description: 'One of the greatest circuits on the calendar. The Ardennes layout features extreme elevation change, the iconic Raidillon climb, and long full-throttle sections that expose energy management and power unit capability. Weather can change lap to lap. Two DRS zones on Kemmel Straight and the run to Bus Stop chicane.',
  drsZones: 2,
  turns: 19,
}
