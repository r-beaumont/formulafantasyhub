import Link from 'next/link'

interface PremiumGateProps {
  preview?: string
}

export default function PremiumGate({ preview }: PremiumGateProps) {
  return (
    <div className="relative">
      {/* Blurred preview text */}
      {preview && (
        <div className="relative overflow-hidden max-h-32">
          <p className="text-subtle leading-relaxed blur-sm select-none">{preview}</p>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background" />
        </div>
      )}

      {/* Gate card */}
      <div className="border border-border bg-surface p-8 md:p-12 text-center mt-6">
        <div className="display text-5xl md:text-7xl mb-4">Premium</div>
        <p className="text-subtle text-sm max-w-md mx-auto mb-8 leading-relaxed">
          Full strategy guides, lineup analysis, price change tools and race-week dashboards.
          From Rob Beaumont — official F1 Fantasy columnist for formula1.com.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/subscribe" className="btn-primary">
            Subscribe — €5/month
          </Link>
          <Link href="/subscribe#faq" className="btn-outline">
            Learn more
          </Link>
        </div>
        <p className="tag mt-6">Cancel anytime · No commitment</p>
      </div>
    </div>
  )
}
