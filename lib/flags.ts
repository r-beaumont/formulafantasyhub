// Maps country codes and country names from OpenF1 API to flag-icons ISO codes
// Used everywhere we display driver/team/circuit nationality

export const COUNTRY_CODE_TO_FLAG: Record<string, string> = {
  // Driver nationalities (2-letter ISO codes) — values are lowercase ISO codes for flag-icons
  GB: 'gb', IT: 'it', MC: 'mc', NL: 'nl', ES: 'es',
  AU: 'au', FR: 'fr', DE: 'de', BR: 'br', MX: 'mx',
  CA: 'ca', FI: 'fi', TH: 'th', NZ: 'nz', AR: 'ar',
  CN: 'cn', JP: 'jp', US: 'us', AT: 'at', BE: 'be',
  BH: 'bh', SA: 'sa', AZ: 'az', SG: 'sg', HU: 'hu',
  QA: 'qa', AE: 'ae', MO: 'mo',
}

export const COUNTRY_NAME_TO_FLAG: Record<string, string> = {
  // Circuit/meeting countries from OpenF1
  'Australia': 'au', 'China': 'cn', 'Japan': 'jp', 'Bahrain': 'bh',
  'Saudi Arabia': 'sa', 'United States': 'us', 'Italy': 'it',
  'Monaco': 'mc', 'Spain': 'es', 'Canada': 'ca', 'Austria': 'at',
  'Great Britain': 'gb', 'Belgium': 'be', 'Hungary': 'hu',
  'Netherlands': 'nl', 'Azerbaijan': 'az', 'Singapore': 'sg',
  'Mexico': 'mx', 'Brazil': 'br', 'Las Vegas': 'us',
  'Qatar': 'qa', 'Abu Dhabi': 'ae', 'United Arab Emirates': 'ae',
  'Germany': 'de', 'France': 'fr',
}

export const TEAM_NAME_TO_FLAG: Record<string, string> = {
  'Mercedes': 'de', 'Ferrari': 'it', 'McLaren': 'gb',
  'Red Bull Racing': 'at', 'Racing Bulls': 'it', 'Williams': 'gb',
  'Aston Martin': 'gb', 'Alpine': 'fr', 'Haas': 'us',
  'Audi': 'de', 'Cadillac': 'us',
}

export function countryCodeToFlag(code: string): string {
  if (!code) return ''
  return COUNTRY_CODE_TO_FLAG[code.toUpperCase()] || ''
}

export function countryNameToFlag(name: string): string {
  if (!name) return ''
  return COUNTRY_NAME_TO_FLAG[name] || ''
}

export function teamToFlag(team: string): string {
  if (!team) return ''
  return TEAM_NAME_TO_FLAG[team] || ''
}
