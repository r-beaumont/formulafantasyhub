export interface Article {
  slug: string
  title: string
  excerpt: string
  content: string
  date: string
  tag: string
  premium: boolean
}

export const articles: Article[] = [
  {
    slug: 'chinese-gp-fantasy-preview-2026',
    title: 'Chinese GP: The differential picks that could win your mini-league',
    excerpt: 'Shanghai brings a Sprint weekend and a unique two-race planning challenge. Here\'s how to structure your squad across China and Japan for maximum points.',
    content: `Shanghai brings one of the most complex planning challenges of the season. A Sprint format means an extra scoring session — but it also means your Limitless chip is at its most powerful here.

The key this weekend is identifying differentials: drivers that most managers won't own, but who could deliver outsized returns. With the Sprint on Saturday morning, pace from Friday practice is your only real data point.

**Why Bearman is the differential pick**

Ollie Bearman delivered 20 points in Australia and has quietly become one of the best value options on the grid. At his current price, he's owned by fewer than 15% of managers globally — which means picking him correctly is a mini-league winner.

His circuit history is limited, but Haas have shown genuine pace in 2026 and Shanghai suits their downforce setup.

**The Bortoleto case**

Gabriel Bortoleto has now recorded four double-digit returns in his last seven race weekends. Audi's pace is real and improving. At his price point, the Brazilian offers exceptional expected-points-per-dollar value.

**Constructor call: why Mercedes over McLaren this week**

McLaren are the obvious pick but their ownership is sky-high. Mercedes are priced attractively and have shown strong one-lap pace in 2026. A top-four qualifying result from either car means significant qualifying bonus points — and in a Sprint weekend, qualifying matters twice.`,
    date: 'Mar 13, 2026',
    tag: 'Race Preview',
    premium: false,
  },
  {
    slug: 'limitless-chip-guide-2026',
    title: 'When to use Limitless in 2026 — the complete chip strategy guide',
    excerpt: 'Limitless is the most powerful chip in F1 Fantasy. Use it wrong and you\'ve wasted your biggest weapon. Here\'s the definitive guide to timing it correctly.',
    content: `[Premium content — subscribe to read]`,
    date: 'Mar 10, 2026',
    tag: 'Strategy',
    premium: true,
  },
  {
    slug: 'price-changes-to-watch-china',
    title: 'Five price changes to get ahead of before the China deadline',
    excerpt: 'Price changes happen fast. These five drivers are most likely to move based on Australia results — and getting ahead of them is free money.',
    content: `[Premium content — subscribe to read]`,
    date: 'Mar 12, 2026',
    tag: 'Price Changes',
    premium: true,
  },
  {
    slug: 'australia-gp-review-2026',
    title: 'Australian GP review: Winners, losers and what it means for your season',
    excerpt: 'Bearman delivered. Verstappen dominated. Here\'s what the Australia result tells us about the 2026 pecking order and how to position your squad going forward.',
    content: `The 2026 season opener delivered more clarity than most expected. The new regulations didn\'t produce a complete reset — McLaren and Red Bull remain at the sharp end — but the midfield is genuinely competitive in a way it hasn\'t been for years.

Here\'s what matters for your F1 Fantasy squad going forward.

**Haas are for real**

Ollie Bearman\'s P7 finish wasn\'t a fluke. Haas showed genuine race pace throughout the weekend and their points-per-dollar ratio is among the best on the grid at current prices. Both Bearman and his teammate are worth considering in most squads.

**The McLaren question**

McLaren scored big in Australia but their prices will rise. At elevated prices, their points-per-dollar value drops. The question for the next few rounds is whether the premium is worth paying versus loading up on value picks in the midfield.

**Verstappen is still Verstappen**

Max Verstappen dominated qualifying and the race. At his price, he\'s expensive — but consistent. If you\'re looking for a safe captain option, he remains the benchmark.`,
    date: 'Mar 9, 2026',
    tag: 'Race Review',
    premium: false,
  },
]

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug)
}
