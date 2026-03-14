import Link from 'next/link'

interface ArticleCardProps {
  title: string
  excerpt: string
  slug: string
  date: string
  tag: string
  premium?: boolean
  featured?: boolean
}

export default function ArticleCard({
  title,
  excerpt,
  slug,
  date,
  tag,
  premium = false,
  featured = false,
}: ArticleCardProps) {
  return (
    <Link href={`/articles/${slug}`} className="group block">
      <article className={`card p-6 h-full flex flex-col gap-4 ${featured ? 'p-8' : ''}`}>

        {/* Top row */}
        <div className="flex items-center justify-between">
          <span className="tag">{tag}</span>
          {premium ? (
            <span className="premium-badge">Premium</span>
          ) : (
            <span className="free-badge">Free</span>
          )}
        </div>

        {/* Title */}
        <h2 className={`font-body font-semibold text-white leading-snug group-hover:opacity-80 transition-opacity ${
          featured ? 'text-2xl md:text-3xl' : 'text-lg'
        }`}>
          {title}
        </h2>

        {/* Excerpt */}
        <p className="text-subtle text-sm leading-relaxed flex-1">
          {premium
            ? excerpt.slice(0, 80) + '... [Premium]'
            : excerpt}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <span className="font-mono text-xs text-muted">{date}</span>
          <span className="font-mono text-xs text-white group-hover:translate-x-1 transition-transform">→</span>
        </div>
      </article>
    </Link>
  )
}
