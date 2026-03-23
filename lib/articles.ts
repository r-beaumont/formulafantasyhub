export interface Article {
  slug: string
  title: string
  excerpt: string
  content: string
  date: string
  tag: string
  category: 'Race Preview' | 'Race Review' | 'Strategy' | 'Price Changes' | 'Data Analysis' | 'News'
  articleType: 'F1 Fantasy' | 'F1'
  premium: boolean
  thumbnail: string
  thumbnailBg: string
  thumbnailIcon: string
  readTime: number
}

export const articles: Article[] = [
  {
    slug: 'japan-gp-race-week-preview-2026',
    title: 'Japanese GP Race Week Preview: Can anyone stop Mercedes in Suzuka?',
    excerpt: 'Suzuka is a true test of car performance. With Mercedes dominant in Australia and China, this race week preview covers the key fantasy decisions heading into Round 3.',
    readTime: 5,
    date: 'Mar 25, 2026',
    tag: 'Race Preview',
    category: 'Race Preview',
    articleType: 'F1 Fantasy',
    premium: false,
    thumbnail: 'linear-gradient(135deg, #001a0a 0%, #003d1a 50%, #001a0a 100%)',
    thumbnailBg: 'rgba(0,212,126,0.2)',
    thumbnailIcon: '🇯🇵',
    content: `Suzuka returns to the calendar after its traditional slot and all signs point to another Mercedes-dominated weekend. But circuit characteristics here can throw up surprises — and that's where the fantasy opportunities lie.

The tight, technical nature of Suzuka's first sector rewards aerodynamic efficiency. Ferrari have shown strong sector 1 pace in practice data, and with Hamilton finally settled at Maranello, don't be surprised if the red cars are closer this weekend.

**The captain call for Japan**

Russell and Antonelli are the obvious choices, but their combined ownership is north of 70%. If you want to differentiate, look at the Ferrari pairing. Hamilton has three podiums at Suzuka and knows this circuit as well as anyone.

**Value picks to consider**

Ollie Bearman continues to outperform expectations. Haas have been quick through the fast corners this year and Suzuka plays to their strengths. At his price point, he remains the best differential on the grid.

**Constructor strategy**

Mercedes are the must-have constructor. Anyone not holding them heading into Japan is already at a points disadvantage. The only question is whether you should double up on Ferrari or diversify into Williams, who have shown surprising pace in the middle sector.

**Chip deployment**

If you haven't used your Wildcard yet, Japan is not the race for it. Save the big chips for Monaco or the British GP, where track position is everything and qualifying performance gets magnified.`,
  },
  {
    slug: 'chinese-gp-fantasy-preview-2026',
    title: 'Chinese GP: The differential picks that could win your mini-league',
    excerpt: 'Shanghai brings a Sprint weekend and a unique two-race planning challenge. Here\'s how to structure your squad for maximum points.',
    readTime: 5,
    date: 'Mar 13, 2026',
    tag: 'Race Preview',
    category: 'Race Preview',
    articleType: 'F1 Fantasy',
    premium: false,
    thumbnail: 'linear-gradient(135deg, #1a0000 0%, #3d0000 50%, #1a0a00 100%)',
    thumbnailBg: 'rgba(232,0,45,0.2)',
    thumbnailIcon: '🇨🇳',
    content: `Shanghai brings one of the most complex planning challenges of the season. A Sprint format means an extra scoring session — but it also means your Limitless chip is at its most powerful here.

The key this weekend is identifying differentials: drivers that most managers won't own, but who could deliver outsized returns. With the Sprint on Saturday morning, pace from Friday practice is your only real data point.

**Why Bearman is the differential pick**

Ollie Bearman delivered 20 points in Australia and has quietly become one of the best value options on the grid. At his current price, he's owned by fewer than 15% of managers globally — which means picking him correctly is a mini-league winner.

**The Bortoleto case**

Gabriel Bortoleto has now recorded four double-digit returns in his last seven race weekends. Audi's pace is real and improving. At his price point, the Brazilian offers exceptional expected-points-per-dollar value.

**Constructor call: why Mercedes over McLaren this week**

McLaren are the obvious pick but their ownership is sky-high. Mercedes are priced attractively and have shown strong one-lap pace in 2026. Getting ahead of the price rise here could be worth 5-10 budget units by mid-season.`,
  },
  {
    slug: 'limitless-chip-guide-2026',
    title: 'When to use Limitless in 2026 — the complete chip strategy guide',
    excerpt: 'Limitless is the most powerful chip in F1 Fantasy. Use it wrong and you\'ve wasted your biggest weapon. Here\'s the definitive guide to timing it correctly.',
    readTime: 8,
    date: 'Mar 10, 2026',
    tag: 'Strategy',
    category: 'Strategy',
    articleType: 'F1 Fantasy',
    premium: true,
    thumbnail: 'linear-gradient(135deg, #000a1a 0%, #001a3d 50%, #000a1a 100%)',
    thumbnailBg: 'rgba(0,168,255,0.2)',
    thumbnailIcon: '♾️',
    content: `[Premium content — subscribe to read full article]`,
  },
  {
    slug: 'price-changes-to-watch-china',
    title: 'Five price changes to get ahead of before the China deadline',
    excerpt: 'Price changes happen fast. These five drivers are most likely to move based on Australia results — and getting ahead of them is free money.',
    readTime: 4,
    date: 'Mar 12, 2026',
    tag: 'Price Changes',
    category: 'Price Changes',
    articleType: 'F1 Fantasy',
    premium: true,
    thumbnail: 'linear-gradient(135deg, #001a00 0%, #003d00 50%, #001a00 100%)',
    thumbnailBg: 'rgba(0,212,126,0.2)',
    thumbnailIcon: '💰',
    content: `[Premium content — subscribe to read full article]`,
  },
  {
    slug: 'australia-gp-review-2026',
    title: 'Australian GP review: Winners, losers and what it means for your season',
    excerpt: 'Russell dominated. Mercedes delivered. Here\'s what the Australia result tells us about the 2026 pecking order and how to position your squad going forward.',
    readTime: 6,
    date: 'Mar 9, 2026',
    tag: 'Race Review',
    category: 'Race Review',
    articleType: 'F1 Fantasy',
    premium: false,
    thumbnail: 'linear-gradient(135deg, #0a0a1a 0%, #1a1a3d 50%, #0a0a1a 100%)',
    thumbnailBg: 'rgba(255,184,0,0.2)',
    thumbnailIcon: '🇦🇺',
    content: `The 2026 season opener delivered more clarity than most expected. Mercedes showed dominant pace in both qualifying and the race, with Russell taking a commanding victory ahead of teammate Antonelli.

Ferrari showed genuine race pace — Leclerc and Hamilton both delivered strong results. This team is going to be a key F1 Fantasy asset throughout the season.

**What the result means for your squad**

Mercedes are the must-have constructor. Their pace advantage is real and the prices haven't fully reflected it yet. Get them in before the price rise hits.

Russell is the standout 2x Boost driver option heading into China. His form, the car's pace, and the circuit characteristics all point to another strong weekend.

**The Bearman factor**

Nobody predicted Ollie Bearman would score points in the season opener, but he delivered a mature drive that underlined his growing reputation. At his price point, he represents one of the best value picks on the grid right now.

**McLaren concern**

Piastri's pre-race incident was a red flag. McLaren clearly have a fast car, but reliability concerns mean you should think carefully before committing significant budget to either driver.`,
  },
  {
    slug: 'china-gp-review-2026',
    title: 'Chinese GP review: Antonelli wins, McLaren disaster, and what it means',
    excerpt: 'Kimi Antonelli claimed his maiden victory as McLaren suffered a catastrophic double DNS. The title picture is already getting clear after just two rounds.',
    readTime: 7,
    date: 'Mar 16, 2026',
    tag: 'Race Review',
    category: 'Race Review',
    articleType: 'F1 Fantasy',
    premium: false,
    thumbnail: 'linear-gradient(135deg, #1a0a00 0%, #3d1a00 50%, #1a0000 100%)',
    thumbnailBg: 'rgba(232,0,45,0.25)',
    thumbnailIcon: '🏆',
    content: `Kimi Antonelli is a Formula 1 race winner. The 19-year-old Italian delivered a masterclass in Shanghai, converting pole position into victory and becoming the second youngest race winner in the sport's history.

Mercedes now hold a commanding 98-67 lead over Ferrari in the constructors' championship after just two rounds. This is not a coincidence — it is a pattern.

**The McLaren disaster**

Both Norris and Piastri failed to start due to separate electrical failures. This is catastrophic for anyone who loaded up on McLaren assets heading into China. The double DNS means Norris remains on just 15 points from a single race, and Piastri has just 3 sprint points.

**Fantasy implications going forward**

The gap between Mercedes and everyone else is now significant. Russell and Antonelli are both must-starts for most managers. The question is which one you pick as your 2x Boost driver — and on current form, Antonelli's win puts him slightly ahead.

**Hamilton's redemption arc**

Lewis Hamilton took his first Ferrari podium in only his second race for the team. P3 in China is a statement. Hamilton-Ferrari is going to be one of the defining storylines of 2026 — and both of them will score heavily throughout the season.`,
  },
]

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug)
}
