import { CIRCUIT_MAPS } from '@/lib/circuitMaps'

export default function CircuitMap({ round }: { round: number }) {
  const cm = CIRCUIT_MAPS[round]
  if (!cm) return null

  return (
    <div>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes rh-draw { to { stroke-dashoffset: 0; } }
        .rh-cmap-trk { stroke-dasharray: 1000; stroke-dashoffset: 1000; animation: rh-draw 2.2s cubic-bezier(.5,0,.2,1) forwards; filter: drop-shadow(0 0 6px rgba(232,0,45,.55)); }
      ` }} />
      <div style={{
        position: 'relative', borderRadius: '12px 12px 0 0', overflow: 'hidden',
        background: 'radial-gradient(circle at 50% 50%, rgba(232,0,45,.08), transparent 70%), var(--surface2)',
      }}>
        <svg viewBox="0 0 400 260" aria-label={`${cm.name} layout`} style={{ display: 'block', width: '100%', height: 'auto', maxHeight: '340px', margin: '0 auto' }}>
          <path d={cm.d} fill="none" stroke="var(--surface3)" strokeWidth={9} strokeLinejoin="round" strokeLinecap="round" />
          <path className="rh-cmap-trk" d={cm.d} pathLength={1000} fill="none" stroke="#E8002D" strokeWidth={3.2} strokeLinejoin="round" strokeLinecap="round" />
          <circle cx={cm.start[0]} cy={cm.start[1]} r={5} fill="#fff" stroke="#E8002D" strokeWidth={2} />
        </svg>
      </div>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px', flexWrap: 'wrap',
        background: 'var(--surface2)', borderTop: '1px solid var(--border)', borderRadius: '0 0 12px 12px',
        padding: '10px 14px', marginBottom: '14px', fontSize: '12px',
      }}>
        <b style={{ fontWeight: 600 }}>{cm.name}</b>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', fontWeight: 500, color: 'var(--muted)' }}>Layout © bacinger/f1-circuits (MIT)</span>
      </div>
    </div>
  )
}
