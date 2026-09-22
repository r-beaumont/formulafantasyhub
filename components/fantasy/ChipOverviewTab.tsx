import { cardStyle } from './shared'

const CHIPS = [
  {
    accent: '#00C851', name: '3X BOOST', sprintPick: true,
    what: 'Assign to two drivers in your team. One scores 3x points, one scores 2x points for that race weekend.',
    who: 'Two premium drivers you expect to perform — e.g. George Russell and Kimi Antonelli, or whoever is in form that week.',
    when: 'Typically used on sprint weekends for a third scoring session.',
  },
  {
    accent: '#00A8FF', name: 'LIMITLESS', sprintPick: false,
    what: 'Unlimited transfers and unlimited budget for one week only. Price changes apply to your pre-Limitless team after activation, but pre-Limitless transfers do not count.',
    who: 'Build the best possible team at that point of the season with no budget restrictions.',
    when: 'On a weekend early in the season where at least six assets are expected to increase in value and where there is expected to be a significant points delta between Limitless and non-Limitless teams.',
  },
  {
    accent: '#9B59B6', name: 'NO NEGATIVE', sprintPick: true,
    what: 'All negative scoring categories are reset to zero for one race weekend. Any driver with a score below zero — DNF, DSQ, positions lost — scores zero instead.',
    who: 'All drivers and constructors in your team benefit.',
    when: 'Sprint weekends, wet races, high DNF risk tracks.',
  },
  {
    accent: '#E8002D', name: 'WILDCARD', sprintPick: false,
    what: 'Unlimited transfers up to your current team value. All drivers and constructors in your team can be changed.',
    who: 'Your full squad — use it to overhaul your lineup completely.',
    when: "When you've fallen behind the template, need to make multiple changes, or when a major shift in the competitive order demands a full reset.",
  },
  {
    accent: '#00E5CC', name: 'AUTOPILOT', sprintPick: false,
    what: 'Your 2x Boost is automatically reassigned to the highest-scoring driver in your team for that race weekend.',
    who: 'The drivers in your team — whoever performs best gets the multiplier automatically.',
    when: 'Wet races, high DNF risk tracks, sprint weekends, situations where predicting your 2x Boost driver is difficult.',
  },
  {
    accent: '#FFD700', name: 'FINAL FIX', sprintPick: false,
    what: 'One free driver change between the deadline and the race start. Any driver within budget. Can be applied to a driver carrying the 2x Boost. Constructors cannot be changed with this chip.',
    who: 'Any driver in your squad.',
    when: 'Pre-race withdrawals, back-of-the-grid penalties, a driver qualifying unexpectedly out of position. Very hard to plan for — this chip is reactive by nature.',
  },
]

export default function ChipOverviewTab() {
  return (
    <div>
      <style dangerouslySetInnerHTML={{ __html: `
        .ff-chip { transition: transform .25s, box-shadow .3s, border-color .3s; }
        .ff-chip:hover { transform: translateY(-3px); border-color: color-mix(in srgb, var(--acc) 45%, transparent); box-shadow: 0 14px 34px -14px color-mix(in srgb, var(--acc) 60%, transparent); }
      ` }} />

      <div style={{ ...cardStyle, padding: '20px 24px', marginBottom: '16px' }}>
        <p style={{ color: 'var(--muted)', fontSize: '14px', lineHeight: 1.7, margin: 0 }}>
          Each manager receives one of each chip per season. Chips cannot be used simultaneously. Once activated, a chip cannot be reversed — think strategically before you use it.
        </p>
      </div>

      <div className="mob-1col" style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '16px' }}>
        {CHIPS.map(chip => (
          <div
            key={chip.name}
            className="ff-chip"
            style={{
              '--acc': chip.accent,
              background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '14px',
              padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px',
              position: 'relative', overflow: 'hidden',
            } as React.CSSProperties}
          >
            {/* Soft radial glow, top-right corner — a real element rather than a
                ::after pseudo-element, since this is a static decoration, not a
                hover/keyframe rule. */}
            <div style={{
              position: 'absolute', right: '-50px', top: '-50px', width: '160px', height: '160px',
              borderRadius: '50%', pointerEvents: 'none',
              background: `radial-gradient(circle, color-mix(in srgb, ${chip.accent} 18%, transparent), transparent 70%)`,
            }} />

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', position: 'relative', zIndex: 1 }}>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontWeight: 400, fontSize: '28px', lineHeight: 1, letterSpacing: '1px', color: chip.accent }}>{chip.name}</div>
              {chip.sprintPick && (
                <span style={{ fontSize: '9px', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', background: `color-mix(in srgb, ${chip.accent} 14%, transparent)`, color: chip.accent, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Sprint Pick</span>
              )}
            </div>

            {([['WHAT', chip.what], ['WHO', chip.who], ['WHEN', chip.when]] as const).map(([label, text]) => (
              <div key={label} style={{ display: 'flex', gap: '14px', position: 'relative', zIndex: 1 }}>
                <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '1.5px', color: chip.accent, width: '40px', flexShrink: 0, paddingTop: '2px' }}>{label}</span>
                <p style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.65, margin: 0 }}>{text}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
