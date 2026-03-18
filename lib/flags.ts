// Maps country codes and country names from OpenF1 API to emoji flags
// Used everywhere we display driver/team/circuit nationality

export const COUNTRY_CODE_TO_FLAG: Record<string, string> = {
  // Driver nationalities (2-letter ISO codes)
  GB: '🇬🇧', IT: '🇮🇹', MC: '🇲🇨', NL: '🇳🇱', ES: '🇪🇸',
  AU: '🇦🇺', FR: '🇫🇷', DE: '🇩🇪', BR: '🇧🇷', MX: '🇲🇽',
  CA: '🇨🇦', FI: '🇫🇮', TH: '🇹🇭', NZ: '🇳🇿', AR: '🇦🇷',
  CN: '🇨🇳', JP: '🇯🇵', US: '🇺🇸', AT: '🇦🇹', BE: '🇧🇪',
  BH: '🇧🇭', SA: '🇸🇦', AZ: '🇦🇿', SG: '🇸🇬', HU: '🇭🇺',
  QA: '🇶🇦', AE: '🇦🇪', MO: '🇲🇴',
}

export const COUNTRY_NAME_TO_FLAG: Record<string, string> = {
  // Circuit/meeting countries from OpenF1
  'Australia': '🇦🇺', 'China': '🇨🇳', 'Japan': '🇯🇵', 'Bahrain': '🇧🇭',
  'Saudi Arabia': '🇸🇦', 'United States': '🇺🇸', 'Italy': '🇮🇹',
  'Monaco': '🇲🇨', 'Spain': '🇪🇸', 'Canada': '🇨🇦', 'Austria': '🇦🇹',
  'Great Britain': '🇬🇧', 'Belgium': '🇧🇪', 'Hungary': '🇭🇺',
  'Netherlands': '🇳🇱', 'Azerbaijan': '🇦🇿', 'Singapore': '🇸🇬',
  'Mexico': '🇲🇽', 'Brazil': '🇧🇷', 'Las Vegas': '🇺🇸',
  'Qatar': '🇶🇦', 'Abu Dhabi': '🇦🇪', 'United Arab Emirates': '🇦🇪',
  'Germany': '🇩🇪', 'France': '🇫🇷',
}

export const TEAM_NAME_TO_FLAG: Record<string, string> = {
  'Mercedes': '🇩🇪', 'Ferrari': '🇮🇹', 'McLaren': '🇬🇧',
  'Red Bull Racing': '🇦🇹', 'Racing Bulls': '🇮🇹', 'Williams': '🇬🇧',
  'Aston Martin': '🇬🇧', 'Alpine': '🇫🇷', 'Haas': '🇺🇸',
  'Audi': '🇩🇪', 'Cadillac': '🇺🇸',
}

export function countryCodeToFlag(code: string): string {
  if (!code) return '🏁'
  return COUNTRY_CODE_TO_FLAG[code.toUpperCase()] || '🏁'
}

export function countryNameToFlag(name: string): string {
  if (!name) return '🏁'
  return COUNTRY_NAME_TO_FLAG[name] || '🏁'
}

export function teamToFlag(team: string): string {
  if (!team) return '🏁'
  return TEAM_NAME_TO_FLAG[team] || '🏁'
}
