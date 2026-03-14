import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ArticleCard from '@/components/ArticleCard'
import { articles } from '@/lib/articles'

export default function ArticlesPage() {
  const free = articles.filter((a) => !a.premium)
  const premium = articles.filter((a) => a.premium)

  return (
    <>
      <Navbar />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-6 py-16">

          {/* Header */}
          <div className="border-b border-border pb-12 mb-12">
            <div className="tag mb-4">All articles</div>
            <div className="display text-6xl md:text-8xl">Strategy<br />Hub</div>
          </div>

          {/* Free articles */}
          <section className="mb-16">
            <div className="tag mb-6">Free articles</div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {free.map((article) => (
                <ArticleCard key={article.slug} {...article} />
              ))}
            </div>
          </section>

          {/* Premium articles */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <span className="tag">Premium articles</span>
              <span className="premium-badge">Members only</span>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {premium.map((article) => (
                <ArticleCard key={article.slug} {...article} />
              ))}
            </div>
          </section>

        </div>
      </main>
      <Footer />
    </>
  )
}
