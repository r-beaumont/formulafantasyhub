'use client'
import { useEffect, useState } from 'react'

// Loop-mode track rendering for CircuitMap (components/racehub/CircuitMap.tsx).
// Race Hub's draw-once mode is untouched and stays inline in CircuitMap —
// this only covers the continuously-animating variant used on Home.
export default function CircuitTrace({ d }: { d: string }) {
  const [hidden, setHidden] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updateMotion = () => setReducedMotion(mq.matches)
    updateMotion()
    mq.addEventListener('change', updateMotion)

    const updateVisibility = () => setHidden(document.hidden)
    updateVisibility()
    document.addEventListener('visibilitychange', updateVisibility)

    return () => {
      mq.removeEventListener('change', updateMotion)
      document.removeEventListener('visibilitychange', updateVisibility)
    }
  }, [])

  if (reducedMotion) {
    return (
      <path
        d={d} fill="none" stroke="#E8002D" strokeWidth={3.2} strokeLinejoin="round" strokeLinecap="round"
        style={{ filter: 'drop-shadow(0 0 6px rgba(232,0,45,.55))' }}
      />
    )
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes ct-loop { to { stroke-dashoffset: -1000; } }
        .ct-loop-trk { animation: ct-loop 5s linear infinite; }
      ` }} />
      <path d={d} fill="none" stroke="rgba(232,0,45,.28)" strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />
      <path
        className="ct-loop-trk"
        d={d} pathLength={1000} fill="none" stroke="#E8002D" strokeWidth={3.2} strokeLinejoin="round" strokeLinecap="round"
        strokeDasharray="180 820"
        style={{ filter: 'drop-shadow(0 0 6px rgba(232,0,45,.55))', animationPlayState: hidden ? 'paused' : 'running' }}
      />
    </>
  )
}
