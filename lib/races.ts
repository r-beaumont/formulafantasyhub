export interface Session {
  name: string
  date: string
  timeUTC: string
  timeLocal: string
  completed: boolean
}

export interface Race {
  round: number
  name: string
  shortName: string
  circuit: string
  country: string
  flag: string
  isSprint: boolean
  sessions: Session[]
}

// ✏️ UPDATE THIS each race week — just change the sessions and set completed: true for done sessions
export const CURRENT_RACE: Race = {
  round: 2,
  name: 'Chinese Grand Prix',
  shortName: 'China',
  circuit: 'Shanghai International Circuit',
  country: 'China',
  flag: '🇨🇳',
  isSprint: true,
  sessions: [
    { name: 'Practice 1', date: 'Fri 13 Mar', timeUTC: '03:30 UTC', timeLocal: '11:30 CST', completed: true },
    { name: 'Sprint Qualifying', date: 'Fri 13 Mar', timeUTC: '07:30 UTC', timeLocal: '15:30 CST', completed: true },
    { name: 'Sprint Race', date: 'Sat 14 Mar', timeUTC: '03:00 UTC', timeLocal: '11:00 CST', completed: false },
    { name: 'Qualifying', date: 'Sat 14 Mar', timeUTC: '07:00 UTC', timeLocal: '15:00 CST', completed: false },
    { name: 'Race', date: 'Sun 15 Mar', timeUTC: '07:00 UTC', timeLocal: '15:00 CST', completed: false },
  ],
}

export const SEASON_CALENDAR: { round: number; name: string; flag: string; date: string; sprint: boolean }[] = [
  { round: 1, name: 'Australia', flag: '🇦🇺', date: '16 Mar', sprint: false },
  { round: 2, name: 'China', flag: '🇨🇳', date: '23 Mar', sprint: true },
  { round: 3, name: 'Japan', flag: '🇯🇵', date: '6 Apr', sprint: false },
  { round: 4, name: 'Bahrain', flag: '🇧🇭', date: '13 Apr', sprint: false },
  { round: 5, name: 'Saudi Arabia', flag: '🇸🇦', date: '20 Apr', sprint: false },
  { round: 6, name: 'Miami', flag: '🇺🇸', date: '4 May', sprint: true },
  { round: 7, name: 'Emilia Romagna', flag: '🇮🇹', date: '18 May', sprint: false },
  { round: 8, name: 'Monaco', flag: '🇲🇨', date: '25 May', sprint: false },
  { round: 9, name: 'Spain', flag: '🇪🇸', date: '1 Jun', sprint: false },
  { round: 10, name: 'Canada', flag: '🇨🇦', date: '15 Jun', sprint: false },
  { round: 11, name: 'Austria', flag: '🇦🇹', date: '29 Jun', sprint: true },
  { round: 12, name: 'Britain', flag: '🇬🇧', date: '6 Jul', sprint: true },
  { round: 13, name: 'Belgium', flag: '🇧🇪', date: '27 Jul', sprint: false },
  { round: 14, name: 'Hungary', flag: '🇭🇺', date: '3 Aug', sprint: false },
  { round: 15, name: 'Netherlands', flag: '🇳🇱', date: '31 Aug', sprint: false },
  { round: 16, name: 'Italy', flag: '🇮🇹', date: '7 Sep', sprint: false },
  { round: 17, name: 'Azerbaijan', flag: '🇦🇿', date: '21 Sep', sprint: false },
  { round: 18, name: 'Singapore', flag: '🇸🇬', date: '5 Oct', sprint: false },
  { round: 19, name: 'United States', flag: '🇺🇸', date: '19 Oct', sprint: true },
  { round: 20, name: 'Mexico', flag: '🇲🇽', date: '26 Oct', sprint: false },
  { round: 21, name: 'Brazil', flag: '🇧🇷', date: '9 Nov', sprint: true },
  { round: 22, name: 'Las Vegas', flag: '🇺🇸', date: '22 Nov', sprint: false },
  { round: 23, name: 'Qatar', flag: '🇶🇦', date: '30 Nov', sprint: true },
  { round: 24, name: 'Abu Dhabi', flag: '🇦🇪', date: '7 Dec', sprint: false },
]
