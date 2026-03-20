import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'F1 Dashboard 2026 — Live Race Data | Formula Hub',
  description: 'F1 Fantasy dashboard with live race data, driver standings and strategy tools for the 2026 Formula 1 season.',
  alternates: { canonical: 'https://formulahub.live/f1-fantasy' },
}

export default function DashboardPage() {
  redirect('/f1-fantasy')
}
