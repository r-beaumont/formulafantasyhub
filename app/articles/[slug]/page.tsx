import { notFound } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import PremiumGate from '@/components/PremiumGate'
import { articles, getArticleBySlug } from '@/lib/articles'

export function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }))
}

export default function ArticlePage({ params }: { params: { slug: string } }) {
  const article = getArticleBySlug(params.slug)
  if (!article) notFound()

  // In production: check user session here to determine if premium is unlocked
  const userIsPremium = false

  const showGate = article.premium && !userIsPremium

  return (
    <>
      <Navbar />
      <main className="pt-16">
        <article className="max-w-3xl mx-auto px-6 py-16">

          {/* Meta */}
          <div className="flex items-center gap-4 mb-8">
            <span className="tag">{article.tag}</span>
            {article.premium ? (
              <span className="premium-badge">Premium</span>
            ) : (
              <span className="free-badge">Free</span>
            )}
          </div>

          {/* Title */}
          <h1 className="font-body font-bold text-3xl md:text-4xl leading-tight mb-6">
            {article.title}
          </h1>

          {/* Byline */}
          <div className="flex items-center gap-4 pb-8 mb-8 border-b border-border">
            <div>
              <div className="font-semibold text-sm">Rob Beaumont</div>
              <div className="font-mono text-xs text-subtle">
                Official F1 Fantasy columnist · formula1.com · {article.date}
              </div>
            </div>
          </div>

          {/* Content */}
          {showGate ? (
            <>
              <p className="text-subtle leading-relaxed mb-8">{article.excerpt}</p>
              <PremiumGate preview="Full strategy breakdown, price change analysis, lineup recommendations and chip timing..." />
            </>
          ) : (
            <div className="prose-custom">
              {article.content.split('\n\n').map((para, i) => {
                if (para.startsWith('**') && para.endsWith('**')) {
                  return (
                    <h2 key={i} className="font-body font-bold text-xl mt-10 mb-4 text-white">
                      {para.replace(/\*\*/g, '')}
                    </h2>
                  )
                }
                return (
                  <p key={i} className="text-subtle leading-relaxed mb-6">
                    {para}
                  </p>
                )
              })}
            </div>
          )}

          {/* F1.com plug */}
          {!article.premium && (
            <div className="mt-16 pt-8 border-t border-border">
              <p className="tag mb-2">Also by Rob</p>
              <a
                href="https://www.formula1.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-subtle text-sm hover:text-white transition-colors"
              >
                Read Rob's official F1 Fantasy column on formula1.com →
              </a>
            </div>
          )}

        </article>
      </main>
      <Footer />
    </>
  )
}
