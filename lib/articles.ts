export interface Article {
  slug: string
  title: string
  excerpt: string
  content: string
  date: string
  tag: string
  category: 'Race Preview' | 'Race Review' | 'Strategy' | 'Price Changes' | 'Data Analysis' | 'News' | 'Technical'
  articleType: 'F1 Fantasy' | 'F1'
  premium: boolean
  thumbnail: string
  thumbnailBg: string
  thumbnailIcon: string
  readTime: number
}

export const articles: Article[] = [
  {
    slug: 'miami-gp-2026-technical-upgrades',
    title: "Miami GP 2026: Who's Brought What — and What It Actually Means",
    excerpt: "Formula 1 lands in Miami with the first proper development race of the season. Here's how the grid stacks up across all eleven teams.",
    readTime: 5,
    date: 'May 2, 2026',
    tag: 'Technical',
    category: 'Technical',
    articleType: 'F1',
    premium: false,
    thumbnail: 'linear-gradient(135deg, #FF6B9D, #FF1493)',
    thumbnailBg: 'rgba(255,20,147,0.2)',
    thumbnailIcon: 'us',
    content: `After a strangely quiet gap in the calendar, Formula 1 lands in Miami with the first proper development race of the season. Some teams have arrived with solutions, others with questions; and a few with something closer to a gamble. Here's how the grid stacks up heading into the weekend.

**Mercedes**

Mercedes come into Miami resisting the temptation to throw parts at the car. There's no headline upgrade here, which in itself says quite a bit. The focus has instead been on extracting more from what is already a fundamentally strong package: refining balance, sharpening deployment, and leaning into a car that already looks well-behaved across conditions. It's a conservative play, but one that suggests confidence.

_Headline Upgrades: No major new components. Development focus on balance optimisation and energy deployment refinement._

---

**Ferrari**

Ferrari's update is a more classic Maranello evolution — subtle on paper, but potentially meaningful on track. The revised front wing is the centrepiece, with changes focused on the endplate and footplate geometry rather than the main structure. It's all about airflow management, specifically increasing outwash to clean up the air around the front tyres; something that becomes particularly valuable at a circuit like Miami. Fred Vasseur has hinted there's more tucked into the package aerodynamically, and the team will be hoping these combined gains bring them closer to Mercedes at the front, with consistent podium and race-winning fights the target from here.

_Headline Upgrades: Revised front wing endplate and footplate geometry. Enhanced outwash for improved front tyre airflow management. Additional undisclosed aerodynamic refinements._

---

**McLaren**

McLaren have gone for a reset. What arrives in Miami is, in effect, a B-spec car, with major changes to the floor, sidepods and overall aerodynamic philosophy. There was promise in Japan, where Oscar Piastri delivered a P2 podium, and the team will be hoping the worst of their reliability difficulties is now behind them. The priority is converting that underlying pace into consistent podium challenges across the remainder of the season, and this package is central to that ambition.

_Headline Upgrades: Heavily revised floor and floor edge. Redesigned sidepod concept. Wholesale aerodynamic philosophy shift; effectively a B-spec car._

---

**Red Bull**

Red Bull's approach is targeted rather than transformative. The raw speed has been there in flashes, but the car hasn't always been easy to live with. Their Miami updates are aimed at addressing that — particularly rear-end stability and straight-line efficiency. There's also been ongoing work around rear wing behaviour, with the team continuing to search for the right balance between drag and drivability.

_Headline Upgrades: Rear-end stability improvements. Revised rear wing package targeting drag reduction. Updates to overall drivability balance._

---

**Haas**

Haas arrive without a headline upgrade, very much in keeping with their usual approach. Instead, they continue to build on a solid baseline, focusing on smaller refinements rather than chasing big gains. It's a strategy that has served them well before — particularly when it comes to race pace and tyre management.

_Headline Upgrades: No major new components. Continued incremental refinements to existing package with emphasis on race pace and tyre behaviour._

---

**Racing Bulls**

For Racing Bulls, Miami marks the first real step forward of the season. This is their initial upgrade package, part of a broader development plan that will roll into the coming races, with the aim of making the car more predictable and more consistent across a full race weekend. Alongside the technical changes, the team also arrive in South Beach with their striking all-yellow livery — a Miami-specific look that has become something of a fixture for the team at this race and one that never fails to turn heads in the paddock.

_Headline Upgrades: First meaningful upgrade package of 2026. Targeted improvements to aerodynamic predictability and mechanical consistency. Special Miami yellow livery._

---

**Alpine**

Alpine's weekend is likely to pass without much noise in terms of upgrades. There's nothing major on the car; just minor tweaks aimed at improving balance and coping with Miami's specific demands, particularly around cooling. It's a continuation of a season that, so far, has been more about understanding than outright performance.

_Headline Upgrades: Minor balance adjustments. Cooling system optimisation for Miami's high-temperature conditions._

---

**Audi**

Audi are taking a low-key approach: no major parts, no dramatic changes, just continued work on integration and execution. Reliability will be under close scrutiny after both drivers were forced to withdraw before the start in Australia and China, and Miami represents an important opportunity to demonstrate the team has those issues under control. At this stage, it's about building a platform they can develop from rather than chasing immediate gains.

_Headline Upgrades: No significant new components. Focus on system integration, reliability resolution and development correlation._

---

**Williams**

Williams remain in recovery mode after their disrupted start to the year. There's no significant upgrade package this weekend, with the focus instead on correlation and ironing out fundamental limitations — weight, efficiency, and overall consistency. Miami is less about results and more about getting the car into a place where results become possible.

_Headline Upgrades: No major upgrades. Internal focus on weight reduction, aerodynamic correlation and resolving fundamental performance limitations._

---

**Cadillac**

Cadillac arrive with one of the more tangible upgrade packages on the grid. There are clear changes to the front wing, a revised floor and floor edges, and updates to the rear brake assembly; all aimed at improving both aerodynamic efficiency and mechanical stability. For a new team, this is a meaningful step that should move them closer to the midfield fight.

_Headline Upgrades: Revised front wing. Updated floor and floor edge. Rear brake assembly changes. Broad aerodynamic and mechanical stability improvements._

---

**Aston Martin**

Aston Martin's situation is more complicated. The updates brought to Miami are largely corrective — aimed at addressing reliability issues and improving the integration between the chassis and power unit. There are also smaller mechanical tweaks, including changes to the steering system. A more substantial development push is expected later in the season, with the immediate priority being to make the car more coherent and more usable across a race weekend.

_Headline Upgrades: Corrective reliability updates. Improved chassis-to-power unit integration. Revised steering system components._

---

**Final Thought**

Miami often flatters efficiency and exposes weakness, which makes it a useful early-season checkpoint. Some teams have arrived looking to redefine their trajectory; others are simply trying to stabilise it. By Sunday evening, we should have a much clearer sense of who's moving forward — and who's already playing catch-up.`,
  },
  {
    slug: 'race-week-preview-miami-gp-2026',
    title: 'Race Week Preview: Miami Grand Prix',
    excerpt: 'Kimi Antonelli leads the championship after back-to-back victories in China and Japan. Here is your F1 Fantasy watchlist for Miami.',
    readTime: 4,
    date: 'Apr 22, 2026',
    tag: 'Race Preview',
    category: 'Race Preview',
    articleType: 'F1 Fantasy',
    premium: false,
    thumbnail: 'linear-gradient(135deg, #001a2a 0%, #003d5c 50%, #001a2a 100%)',
    thumbnailBg: 'rgba(0,168,255,0.2)',
    thumbnailIcon: 'us',
    content: `**THE SETUP**

Three races in, the story is simple. Mercedes are dominant, Kimi Antonelli leads the championship, and everyone else is managing damage. Russell sits nine points back in second. Ferrari are best of the rest at 90 constructors' points. Red Bull's 16-point tally after three rounds tells you everything. Japan was the exclamation mark — Antonelli moved from sixth to first on a safety car restart that caught the paddock flat-footed. For Fantasy managers, the message is the same it has been all season: the Silver Arrows are the foundation of any competitive team right now.

**THE CIRCUIT**

The Miami International Autodrome doesn't reward pole sitters — it punishes them. In four editions of this race, not one pole-sitter has won. A McLaren or Red Bull driver has won each of the last four races in South Beach — can Mercedes or Ferrari buck that trend this time?

**THE WEATHER**

Miami in May means heat, humidity, and afternoon thunderstorms. Average highs sit around 30°C and tyre degradation will be severe across every session. Changeable conditions in 2025 saw many strategists deploy a timely No Negative chip, so keep an eye on the forecast closer to the deadline if we see rain on the radar.

**THE WEEKLY WATCHLIST**

🟢 BUY

**Nico Hulkenberg**

At $5m and needing just one point for a maximum price rise of $0.6m, this is the easiest call on the watchlist. Score at Miami, bank the rise, strengthen your budget. Hulk in a race that rewards consistent finishers is exactly the setup you want.

**Kimi Antonelli**

Averaging 50 Fantasy points per race with two wins already this season. The most in-form Fantasy asset on the grid, and it isn't close. Get him in.

🟡 HOLD

**Ollie Bearman**

Strong overtaking and positions gained potential makes Bearman worth holding through this weekend. One flag: he is expected to take a price drop heading into Canada following his Japan DNF. Hold through Miami, then reassess at the deadline.

**Esteban Ocon**

42 points in three races and exceptional consistency throughout. A fine hold. He needs more performances like what we saw in China to keep him firmly on the watchlist going forward.

🔴 SELL

**Charles Leclerc**

A very good start to 2026, no question. But Leclerc is the obvious candidate to make way — freeing up the budget to accommodate the Mercedes and Ferrari constructors in your lineup. The budget he releases unlocks the picks that actually win leagues.

**Arvid Lindblad**

Needs 13 points for a max price rise and is not keeping pace with teammate Liam Lawson, who is priced $0.1m higher. VCARB are a circuit-dependent car and Miami is no guarantee — the rookie inconsistencies are still showing up at the wrong moments. Worth looking elsewhere this weekend.

**THE CHIPS**

Miami is the first Sprint weekend of 2026 and chip selection matters. No Negative is your best play — safety cars are near-guaranteed at this circuit, Sprint DNF exposure is live on a temporary street layout, and the storm threat adds genuine unpredictability. Sprint DNFs cost -10 in 2026, not -20 like previous seasons, but with just one Free Practice before Sprint Qualifying locks your team in, that downside protection is worth deploying.`,
  },
  {
    slug: 'race-week-preview-japanese-gp-2026',
    title: 'Race Week Preview: Japanese Grand Prix',
    excerpt: 'Mercedes lead the championship after back-to-back one-twos. Here is your F1 Fantasy watchlist for Suzuka.',
    readTime: 4,
    date: 'Mar 27, 2026',
    tag: 'Race Preview',
    category: 'Race Preview',
    articleType: 'F1 Fantasy',
    premium: false,
    thumbnail: 'linear-gradient(135deg, #1a1400 0%, #3d3000 50%, #1a1400 100%)',
    thumbnailBg: 'rgba(255,215,0,0.25)',
    thumbnailIcon: 'jp',
    content: `**THE SETUP**

Two races in, Mercedes are running away with this. George Russell leads the championship, Kimi Antonelli is the reigning race winner, and Ferrari are the only team consistently sharing the podium. For F1 Fantasy managers, the message from the first two rounds is clear — the Silver Arrows are the spine of any competitive team right now. Japan is where we find out if that holds on one of the most technically demanding circuits in the world.

**THE CIRCUIT**

Suzuka is a flowing, high-downforce layout where overtaking is notoriously difficult. Tyre management through the Esses and Sector 2 is critical, with one-stop strategies common. Safety car deployments are reasonably frequent, particularly in wet conditions, which could shake up scoring unpredictably.

**THE WEATHER**

Rain is forecast across all three days with temperatures expected around 15-17°C. Wet Suzuka is a different race entirely — it introduces safety cars, variable strategies and the kind of chaos that can either spike or sink your week. If qualifying runs in the wet, grid positions become unpredictable and that changes the positions gained calculation for Sunday entirely.

**THE WEEKLY WATCHLIST**

🟢 BUY

**Oliver Bearman**

Best PPM in the game after two rounds. Haas have been genuinely competitive in 2026's new regulations and Oliver Bearman is driving with real confidence. At his price he gives you flexibility to load up on premium picks elsewhere — he is the standout budget buy of the season so far.

**Kimi Antonelli**

Still underpriced relative to what he's delivering. Race winner in China, two podiums in two rounds, and he's your strongest 2x Boost candidate not named George Russell. If you don't have him, get him before the price ceiling catches up with his points total.

🟡 HOLD

**George Russell**

Pole and win in Australia, sprint win and P2 in China. You already know the answer. Hold him through Suzuka — Max Verstappen's four-race winning streak here came in a different era with a very different car.

**Arvid Lindblad**

Scored on debut in Australia and the DNS in China was a mechanical issue, not a performance problem. Racing Bulls should suit Suzuka better than Shanghai's high-speed straights. Hold and see what Friday brings.

🔴 SELL

**Max Verstappen**

Four straight wins at Suzuka sounds compelling — it isn't, not in this car. He called the Red Bull undriveable in China and nothing suggests a rapid fix before Japan. His price tag is impossible to justify against the points he's realistically delivering right now.

**Gabriel Bortoleto**

DNS in China wiped out the momentum he built with a points finish in Australia. Audi are still finding their feet with the new regulations and Gabriel Bortoleto's price doesn't yet reflect the uncertainty around his weekend-to-weekend reliability.

**THE CHIPS**

Suzuka's unpredictability in wet conditions makes Limitless a risk this week — you want clean, predictable scoring to maximise that chip. However, if weather conditions improve, there could be an opportunity to use it here given the limited overtaking opportunities at Suzuka. If rain is expected during the Grand Prix, consider deploying No Negative — Suzuka is a technically challenging circuit across three demanding sessions and wet conditions historically produce higher than expected retirements, making this one of the strongest use cases for that chip.`,
  },
  {
    slug: 'race-week-preview-chinese-gp-2026',
    title: 'Race Week Preview: Chinese Grand Prix',
    excerpt: 'Mercedes are flying after Australia. Here is your F1 Fantasy watchlist for the sprint weekend in Shanghai.',
    readTime: 4,
    date: 'Mar 20, 2026',
    tag: 'Race Preview',
    category: 'Race Preview',
    articleType: 'F1 Fantasy',
    premium: false,
    thumbnail: 'linear-gradient(135deg, #1a0000 0%, #3d0000 50%, #1a0000 100%)',
    thumbnailBg: 'rgba(232,0,45,0.2)',
    thumbnailIcon: 'cn',
    content: `**THE SETUP**

One race in, Mercedes have answered the preseason question emphatically. George Russell won the Australian Grand Prix from pole position, Kimi Antonelli was second, Charles Leclerc recovered brilliantly for third, and Lewis Hamilton took a composed fourth. The Silver Arrows are the team to beat heading into Shanghai. China is a sprint weekend — with extra points on the table and overtakes aplenty, that changes the calculus entirely. Chip usage is going to be as important as ever.

**THE CIRCUIT**

Shanghai International Circuit is a long, flowing layout with a mix of high-speed corners in the opening sector and a technical second sector that features the famous double-right hairpin. The back straight is one of the longest on the calendar and produces genuine DRS overtaking opportunities. Tyre degradation is moderate, with two-stop strategies possible in warmer conditions. As a sprint weekend, you will have two separate scoring events — the Sprint on Saturday morning and the Grand Prix on Sunday. That means more points on the table and a higher premium on picking the right drivers.

**THE WEATHER**

Shanghai in late March tends to be cool and overcast, with temperatures in the mid-to-high teens. Rain is possible across the weekend — Chinese GP weekends have a history of variable conditions, and even a brief shower during the sprint qualifying session can scramble grid positions significantly.

**THE WEEKLY WATCHLIST**

🟢 BUY

**Oliver Bearman**

The standout budget pick of the season. Bearman delivered points on debut in Australia and is driving Haas with real maturity. Shanghai's long straight suits a competitive mid-field car, and he remains one of the most underowned drivers in the game. In a sprint weekend where every scoring session counts, getting him into your squad ahead of a potential price rise is the smart move.

**George Russell**

Australia's race winner is the form driver in the game. Pole, fastest lap, race win — Russell delivered a clean sweep in Melbourne and arrives in Shanghai as the overwhelming favourite to lead the championship after round two. He is the obvious 2x Boost candidate this week and the core asset in any competitive squad.

🟡 HOLD

**Liam Lawson**

Lawson returned only five fantasy points in Australia but Racing Bulls showed competitive race pace in the final stint. The team also demonstrated strong single-lap pace at Albert Park, which should carry over to Shanghai. A hold for now.

**Esteban Ocon**

Ocon has quietly been building points in the background and Haas showed enough in Australia to suggest both their drivers have a scoring floor this season. Sprint weekends can favour midfield drivers for overtakes in Saturday's racing fixture and Ocon is capable of making the most of those opportunities.

🔴 SELL

**Nico Hulkenberg**

Audi reliability was the demise of Hulkenberg at Albert Park, failing to start the first race of the year. With plenty of options in the same price range, the German is an early transfer casualty after taking an early -20 penalty. Selling ahead of a potential price drop makes sense here.

**Oscar Piastri**

McLaren showed genuine race pace in Australia but the result was not there for Piastri, who did not complete a single lap after crashing on the reconnaissance lap. With McLaren's pace still unproven in race conditions and cheaper options scoring higher up the grid, Piastri is one to avoid for now.

**THE CHIPS**

Limitless and 3x Boost are the standout chips this sprint weekend. A clearly defined top two in the pecking order makes building a Limitless lineup straightforward, with triple Mercedes and triple Ferrari the obvious cornerstones. Russell and Antonelli are firmly in the crosshairs for the 3x Boost given the sizable pace advantage Mercedes demonstrated in Australia. For differential options, Leclerc and Hamilton should also be considered but will rely on overtakes and Driver of the Day favouritism to maximise their fantasy upside.`,
  },
  {
    slug: 'race-week-preview-australian-gp-2026',
    title: 'Race Week Preview: Australian Grand Prix',
    excerpt: 'The 2026 season begins at Albert Park. Here is your F1 Fantasy watchlist for the season opener in Melbourne.',
    readTime: 4,
    date: 'Mar 5, 2026',
    tag: 'Race Preview',
    category: 'Race Preview',
    articleType: 'F1 Fantasy',
    premium: false,
    thumbnail: 'linear-gradient(135deg, #0a1a00 0%, #1a3d00 50%, #0a1a00 100%)',
    thumbnailBg: 'rgba(0,212,126,0.2)',
    thumbnailIcon: 'au',
    content: `**THE SETUP**

The 2026 season begins here. New regulations, new cars, and — for the first time in years — genuine uncertainty about who the front-runners will be. Preseason testing at Bahrain gave us clues rather than answers. Mercedes looked composed across long runs, Ferrari showed strong one-lap pace, and McLaren's tyre management appeared to be a step forward over 2025. Red Bull arrived with questions still unanswered about their power unit partnership. For F1 Fantasy managers, the season opener is the hardest week to call — and the most important not to get wrong.

**THE CIRCUIT**

Albert Park is a street-circuit-style layout built around a park lake in Melbourne's south. It rewards outright pace over tyre management, with most races settling into a one-stop strategy when the safety car stays away. The circuit is quick and flows well in sectors one and two, but the final sector is tight and technical, which produces overtaking opportunities — particularly into Turn 13. Safety car probability is higher than most permanent circuits, so keep that in mind when assessing value-for-money picks.

**THE WEATHER**

Melbourne in early March typically brings warm, dry conditions — temperatures in the low-to-mid 20s are expected across the race weekend. There is a small chance of an afternoon shower on Saturday, but the forecast currently favours a dry race. A clean race weekend at Albert Park tends to reward the fastest car cleanly, so pick accordingly.

**THE CHIPS**

The Autopilot chip is the standout option for Round 1. With so much uncertainty heading into the season opener, nobody truly knows how the pecking order will shake out in race conditions at Albert Park. Autopilot removes the guesswork entirely — it automatically reassigns your 2x Boost to the highest-scoring driver in your team across the weekend, meaning you cannot pick the wrong driver. Testing pointed to Mercedes and Ferrari leading the way, with Russell, Antonelli and Leclerc all standout options, but Albert Park has a long history of producing surprises. Let Autopilot do the work.`,
  },
]

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug)
}
