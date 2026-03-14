import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'

const tools = [
  {
    name: 'Driver Price Tracker',
    description: 'Track price changes in real time. Know who\'s rising before the deadline.',
    status: 'coming-soon',
    premium: true,
  },
  {
    name: 'Lineup Optimiser',
    description: 'Build the highest expected-points team within your budget cap.',
    status: 'coming-soon',
    premium: true,
  },
  {
    name: 'Points Simulator',
    description: 'Simulate race outcomes and see how your team scores in each scenario.',
    status: 'coming-soon',
    premium: true,
  },
  {
    name: 'Race Weekend Dashboard',
    description: 'Live race-week stats, qualifying results, and fantasy scoring.',
    status: 'coming-soon',
    premium: true,
  },
]

export default function RaceCenterPage() {
  return (
    <>
      <Navbar />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-6 py-16">

          {/* Header */}
          <div className="border-b border-border pb-12 mb-12">
            <div className="tag mb-4">Race Center</div>
            <div className="display text-6xl md:text-8xl mb-6">Race<br />Center</div>
            <p className="text-subtle max-w-lg leading-relaxed">
              Interactive tools and dashboards for serious F1 Fantasy managers.
              Built to give you an edge every race weekend.
            </p>
          </div>

          {/* Tools grid */}
          <div className="grid md:grid-cols-2 gap-4 mb-16">
            {tools.map((tool) => (
              <div key={tool.name} className="card p-8 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span className="premium-badge">Premium</span>
                  <span className="font-mono text-xs text-muted uppercase tracking-widest">
                    Coming Soon
                  </span>
                </div>
                <h2 className="font-body font-semibold text-xl text-white">{tool.name}</h2>
                <p className="text-subtle text-sm leading-relaxed flex-1">{tool.description}</p>
                <div className="pt-4 border-t border-border">
                  <div className="w-full bg-border h-px relative">
                    <div className="absolute inset-y-0 left-0 bg-white w-1/3 animate-pulse" />
                  </div>
                  <p className="font-mono text-xs text-muted mt-2">In development</p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="border border-border p-10 md:p-16 text-center">
            <div className="display text-5xl md:text-7xl mb-6">
              Get early access
            </div>
            <p className="text-subtle max-w-md mx-auto mb-8 leading-relaxed text-sm">
              Premium members get first access to every tool as it launches.
              Subscribe now and never miss a race-week edge.
            </p>
            <Link href="/subscribe" className="btn-primary text-lg px-10 py-4">
              Subscribe — €5/month
            </Link>
          </div>

        </div>
      </main>
      <Footer />
    </>
  )
}
