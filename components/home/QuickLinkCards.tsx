import Link from 'next/link'

const ICONS: Record<string, JSX.Element> = {
  hub: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 17h2l2-5h10l2 5h2" /><circle cx="7.5" cy="17.5" r="2" /><circle cx="16.5" cy="17.5" r="2" /><path d="M9 12l1-4h4l1 4" />
    </svg>
  ),
  trophy: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0z" /><path d="M17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3" />
    </svg>
  ),
  chart: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />
    </svg>
  ),
  play: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
      <path d="M8 5v14l11-7z" />
    </svg>
  ),
}

const items = [
  { href: '/race-hub',   icon: 'hub',    label: 'Race Hub',   desc: 'Live timing, results & circuit info', acc: '#E8002D' },
  { href: '/f1-fantasy', icon: 'trophy', label: 'F1 Fantasy', desc: 'Data-driven F1 Fantasy analysis',      acc: '#FFB800' },
  { href: '/standings',  icon: 'chart',  label: 'Standings',  desc: 'Full championship standings & data',   acc: '#00A8FF' },
  { href: '/videos',     icon: 'play',   label: 'Videos',     desc: 'Your go-to F1 Fantasy content',        acc: '#00D47E' },
]

export default function QuickLinkCards() {
  return (
    <div className="mob-2col" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '12px' }}>
      <style dangerouslySetInnerHTML={{ __html: `
        /* Base styles for the card/icon live here (not inline) so the :hover
           rules below — which target the same background/border/color
           properties — aren't silently overridden by higher-precedence
           inline declarations. */
        .qlink-card { background: var(--surface); border: 1px solid var(--border); transition: transform .25s, border-color .25s, background .35s, box-shadow .35s; }
        .qlink-card:hover { transform: translateY(-3px); border-color: color-mix(in srgb, var(--acc) 55%, transparent); background: radial-gradient(120% 90% at 0% 0%, color-mix(in srgb, var(--acc) 20%, var(--surface)) 0%, var(--surface) 65%); box-shadow: 0 12px 32px -12px color-mix(in srgb, var(--acc) 55%, transparent); }
        .qlink-card:hover .qlink-title { color: var(--acc); }
        .qlink-ico { background: color-mix(in srgb, var(--acc) 15%, transparent); color: var(--acc); transition: transform .3s, background .3s, color .3s; }
        .qlink-card:hover .qlink-ico { transform: rotate(-6deg) scale(1.08); background: var(--acc); color: color-mix(in srgb, var(--acc) 25%, #0E1318); }
      ` }} />
      {items.map(item => (
        <Link
          key={item.href}
          href={item.href}
          className="qlink-card"
          style={{
            '--acc': item.acc,
            textDecoration: 'none', color: 'inherit', borderRadius: '14px',
            padding: '22px', display: 'flex', flexDirection: 'column', gap: '10px',
          } as React.CSSProperties}
        >
          <span className="qlink-ico" style={{
            width: '42px', height: '42px', borderRadius: '12px', display: 'grid', placeItems: 'center',
          }}>
            {ICONS[item.icon]}
          </span>
          <h3 className="qlink-title" style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '24px', lineHeight: 1, color: 'var(--text)', transition: 'color .25s', margin: 0 }}>{item.label}</h3>
          <p style={{ fontSize: '12px', color: 'var(--muted)', lineHeight: 1.5, margin: 0 }}>{item.desc}</p>
        </Link>
      ))}
    </div>
  )
}
