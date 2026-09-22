// Standings-local presentational helpers. Reuses components/home/shared.tsx
// for generic tokens (cardStyle, monoFont, Flag) rather than redefining them.
export { cardStyle, monoFont } from '@/components/home/shared'

// Team-colour gradient row background, shared by every row on this page
// (driver table, constructor table, points-per-race table). Apply the
// `.st-team-row` class + `--tc` custom property.
export const teamRowStyleTag = `
  .st-team-row { background: linear-gradient(90deg, color-mix(in srgb, var(--tc) 10%, transparent), transparent 45%); transition: background .25s; }
  .st-team-row:hover { background: linear-gradient(90deg, color-mix(in srgb, var(--tc) 26%, transparent), transparent 70%); }
  .st-team-row:hover .st-team-tl { box-shadow: 0 0 10px var(--tc); }
  .st-team-row:hover .st-team-flag { transform: scale(1.14); }
  .st-ppr-nm.st-team-row { background: linear-gradient(90deg, color-mix(in srgb, var(--tc) 10%, transparent), transparent 45%); }
`

export function posColor(pos: number): string {
  if (pos === 1) return '#FFD700'
  if (pos === 2) return '#C0C0C0'
  if (pos === 3) return '#CD7F32'
  return 'var(--muted)'
}
