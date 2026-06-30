'use client'
import { useState, useEffect } from 'react'
import { computeCurrentRace, CURRENT_RACE } from '@/lib/races'
import type { Race } from '@/lib/races'

/**
 * Returns the current race, auto-advancing 12 hours after each Race session ends.
 * Initialises with the statically-set CURRENT_RACE (SSR-safe), then updates
 * client-side via computeCurrentRace() so no deployment is needed to switch races.
 * Re-evaluates every 60 seconds while the page is open.
 */
export function useCurrentRace(): Race {
  const [race, setRace] = useState<Race>(CURRENT_RACE)

  useEffect(() => {
    function update() {
      setRace(computeCurrentRace(new Date()))
    }
    update()
    const id = setInterval(update, 60_000)
    return () => clearInterval(id)
  }, [])

  return race
}
