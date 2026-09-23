// Shared card header used across Home, Race Hub and Calendar cards.
// Exports its underlying style tokens too, so components/home/shared.tsx and
// components/racehub/shared.tsx can re-export them under their existing
// names (cardHeaderStyle/cardTitleStyle, rhCardTitleStyle) without every
// existing card consumer having to switch to rendering <CardHeader> itself.
import type { CSSProperties, ReactNode } from 'react'

export const cardHeaderContainerStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '18px 20px 14px',
  borderBottom: '1px solid var(--border)',
  gap: '12px',
}

export const cardHeaderTitleStyle: CSSProperties = {
  fontFamily: "'Bebas Neue', sans-serif",
  fontWeight: 400,
  fontSize: '22px',
  lineHeight: 1,
  letterSpacing: '0.6px',
  color: 'var(--text)',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
}

export default function CardHeader({ title, right }: { title: ReactNode; right?: ReactNode }) {
  return (
    <div style={cardHeaderContainerStyle}>
      <span style={cardHeaderTitleStyle}>{title}</span>
      {right}
    </div>
  )
}
