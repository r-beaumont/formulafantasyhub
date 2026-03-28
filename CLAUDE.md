# FORMULAHUB.LIVE — CLAUDE CODE STANDING INSTRUCTIONS

This file is read automatically by Claude Code at the start of every session.
All rules below apply to every task unless explicitly overridden in the prompt.

---

## PROJECT CONTEXT

Rob Beaumont is the official F1 Fantasy columnist for formula1.com and a leading F1 Fantasy content creator (YouTube: @formulafantasyhub, X: @F_FantasyHub). He is building formulahub.live — a freemium F1 data, analysis and fantasy strategy platform.

- **Repo:** github.com/r-beaumont/formulafantasyhub (master branch, Vercel watches main)
- **Local path:** C:\Users\rober\OneDrive\Documents\formulafantasyhub
- **Live site:** formulahub.live

---

## TECH STACK

- Framework: Next.js 14 with TypeScript
- Styling: Inline styles only — no Tailwind classes anywhere
- Hosting: Vercel (watches main branch)
- Version control: GitHub

---

## DESIGN SYSTEM

- Background: #080C10
- Card surface: #0E1318
- Red accent: #E8002D
- Fonts: Bebas Neue (headings), DM Sans (body), JetBrains Mono (numbers and data)
- Chip colours: 3x Boost #00C851 | Limitless #00A8FF | No Negative #9B59B6 | Wildcard #E8002D | Autopilot #00E5CC | Final Fix #FFD700

---

## DEPLOYMENT RULES

- Always push to both branches: `git push origin master && git push origin main`
- Every task must end with: `npx tsc --noEmit` → `npm run build` → `git add -A` → `git commit` → `git push origin master && git push origin main`
- A task is not complete until Vercel shows green and changes are confirmed live
- Never report a task as done after only editing files — it must be built and deployed

---

## TERMINOLOGY — NEVER USE THESE

| Never use | Always use instead |
|---|---|
| tools (re: F1 Fantasy) | features / options |
| captain / captaincy | 2x Boost driver / 2x Boost |
| Turbo Driver | 2x Boost Driver |
| DRS Boost | 2x Boost |
| Fantasy Guide | Chip Overview |
| Statistics | Standings |
| Strategy Hub / Latest Articles | Latest News |
| Paddock Briefing | Insider Briefing |
| Paddock Access | Exclusive Insights |

---

## 2026 DRIVER GRID (22 DRIVERS — 11 TEAMS)

| Driver | Team |
|---|---|
| Max Verstappen | Red Bull |
| Isack Hadjar | Red Bull |
| Charles Leclerc | Ferrari |
| Lewis Hamilton | Ferrari |
| George Russell | Mercedes |
| Kimi Antonelli | Mercedes |
| Lando Norris | McLaren |
| Oscar Piastri | McLaren |
| Fernando Alonso | Aston Martin |
| Lance Stroll | Aston Martin |
| Pierre Gasly | Alpine |
| Franco Colapinto | Alpine |
| Alexander Albon | Williams |
| Carlos Sainz | Williams |
| Esteban Ocon | Haas |
| Oliver Bearman | Haas |
| Liam Lawson | Racing Bulls |
| Isack Lindblad | Racing Bulls |
| Nico Hulkenberg | Audi |
| Gabriel Bortoleto | Audi |
| Sergio Perez | Cadillac |
| Valtteri Bottas | Cadillac |

There are always exactly 22 drivers. Never show 20, 24 or any other number.

Price floor: $3.0m. Price ceiling: $34.0m. Prices are dynamic — always verify before content creation.

---

## 2026 CALENDAR

22 active rounds. Bahrain (R4) and Saudi Arabia (R5) are CANCELLED — never show as active.

**Sprint weekends:** China, Miami, Canada, Britain, Netherlands, Singapore

Sprint weekend session order: FP1, Sprint Qualifying, Sprint Race, Qualifying, Race. No FP2 or FP3 on sprint weekends.

**Team lock deadlines:**
- Standard weekends: Qualifying start
- Sprint weekends: Sprint Race start (NOT Sprint Qualifying)

**Lock deadline label on homepage widget must be dynamic:**
- Standard weekend: "Lineups Lock at Qualifying"
- Sprint weekend: "Lineups Lock at Sprint Race"

---

## QUALIFYING FORMAT (22-DRIVER GRID)

| Segment | Drivers | Eliminated | Remaining |
|---|---|---|---|
| Q1 | All 22 | 6 eliminated | 16 remain |
| Q2 | 16 | 6 eliminated | 10 remain |
| Q3 | 10 | Final classification | 10 drivers |

**Race Hub qualifying display rules:**
- Q1 column: all 22 drivers
- Q2 column: 16 drivers only
- Q3 column: 10 drivers only
- Any driver who progresses to Q2 must have their Q1 time shown
- Any driver who progresses to Q3 must have Q1 and Q2 times shown
- A driver knocked out in Q1 has only a Q1 time
- A driver knocked out in Q2 has Q1 and Q2 times
- Sprint Qualifying follows the same logic: SQ1 (22), SQ2 (16), SQ3 (10)

---

## DATA RULES

- All session data must come from `lib/raceResults.ts` as the single source of truth — never hardcode stats in page components
- All season stats must be calculated dynamically from `calculateSeasonStats()` in `lib/seasonStats.ts`
- Stats must reconcile across all tabs and pages — standings, F1 Fantasy leaderboard, performance leaderboard and season overview must always show identical values
- Every practice session must show all 22 drivers — use "NO TIME SET" for any driver without a time, never omit them
- Before adding any F1 results data, verify against official FIA classification documents — never estimate or approximate
- Never fabricate lap times or race data under any circumstances

---

## OPENF1 API

- Base URL: https://api.openf1.org/v1
- All fetch calls must use `cache: 'no-store'` to prevent Next.js caching stale responses
- Poll every 15 seconds during active or recently concluded sessions (within 2 hours of session end)
- Clear setInterval on component unmount to prevent memory leaks
- 10–30 second delay on free tier is acceptable

**2026 Meeting Keys:**
- Australia R1: 1279
- China R2: 1280
- Japan R3: 1281
- Subsequent races R4+: 1284 through 1302 in round order

**Other APIs:**
- Open-Meteo (weather)
- YouTube Data API (channel: @formulafantasyhub)

---

## LIVE TIMING RULES

- LIVE indicator: pulsing red dot + text "LIVE" using #E8002D when polling is active
- FINAL indicator: static text label when session has concluded
- FP1/FP2/FP3: show fastest lap per driver — minimum lap_duration across all laps, never average
- Qualifying: Q1 shows 22 drivers, Q2 shows 16, Q3 shows 10 — drivers progressing must have all earlier segment times populated
- Race/Sprint: fetch position and interval data — show final classified position, driver name, team and gap to leader

---

## FORMATTING & DISPLAY RULES

- Driver names: always sentence case full first and last name — "Kimi Antonelli" not "ANTONELLI" or "K. Antonelli"
- Team names in results tables: "Red Bull" not "Red Bull Racing", "Haas" not "Haas F1 Team"
- All session result tables: fixed column widths, `whiteSpace: 'nowrap'` on driver and team name cells
- Tables wrapped in `overflowX: 'auto'` containers for mobile scrolling
- Inline styles only — no Tailwind classes anywhere

---

## NAVIGATION ORDER

Desktop and hamburger nav must always be:
**Home → Race Hub → Calendar → F1 Fantasy → Standings → News → Videos**

---

## FLAG DISPLAY

- Never use flag emojis anywhere on the site — they render as two-letter codes on Windows
- All flags must use the flag-icons CSS library: class `fi fi-[country code]`
- Import flag-icons CSS globally in the root layout file
- Flag span style: `width: 1.2em; border-radius: 2px`

---

## F1 FANTASY PAGE RULES

- Chips cannot be used simultaneously
- "Once activated, cannot be reversed" belongs ONLY in the chip overview intro paragraph — never inside individual chip cards
- 3x Boost assigns to TWO drivers — one scores 3x, one scores 2x. Never describe as applying to one driver only
- Autopilot reassigns the 2x Boost to the highest-scoring driver — it does not pick the team
- Sprint DNF/NC penalty: -10 points (2026 rule — changed from -20 in 2025)
- Race DNF/NC penalty: -20 points
- Transfers calculated on a net basis between Grands Prix

---

## CALENDAR PAGE RULES

- Collapsed accordion — each race collapsed by default
- Japan R3 auto-expanded on load as next upcoming race, smooth scroll to it
- Opening one row closes the previously open row
- Sprint weekend rows show a small "Sprint" badge when collapsed
- Status badges: completed races show winner (e.g. "Russell WIN"), upcoming show "Upcoming", cancelled show "Cancelled"
- Race name uses Bebas Neue in both collapsed and expanded states
- Expanded state uses #0E1318 background and #E8002D accent
- CSS transition for open/close — no JS animation library

---

## HOMEPAGE WIDGET RULES

- Session times show the corresponding day of the week underneath each time
- Day label updates when switching between Track and Local time
- All three tile headers (Current Race Weekend, F1 Fantasy Team Lock Deadline, Weather) must be exactly the same height
- "Race Hub →", "More F1 Fantasy →" and "Full Forecast →" must be identical in font, size, weight and colour, aligned at the same vertical position across all three tiles
- Fantasy Performance Tracker tile emoji: 🎯
- Weather tile has a blue (#00BFFF) band along the top edge, matching the red band on Current Race Weekend and yellow on Lock Deadline
- "Full Forecast →" link colour: #00BFFF

---

## ARTICLE & CONTENT RULES

- All content tagged as either "F1 Fantasy" or "F1" — never "Articles"
- Section page is called "News" not "Articles" everywhere
- Weekly watchlist format: 2 buys, 2 holds, 2 sells — driver name on its own line as a heading, paragraph of reasoning underneath
- Chip section in articles: "The Chips" (not "Chip Watch")
- Watchlist section: "The Weekly Watchlist" (not "Weekly Watchlist")
- Never include driver prices in articles — prices change weekly
- Three live articles only: Australia preview (5 Mar 2026), China preview (20 Mar 2026), Japan preview (27 Mar 2026)

---

## 2026 OFFICIAL F1 FANTASY SCORING

### Qualifying — Driver
| Result | Points |
|---|---|
| Pole position | 10 |
| 2nd | 9 |
| 3rd | 8 |
| 4th | 7 |
| 5th | 6 |
| 6th | 5 |
| 7th | 4 |
| 8th | 3 |
| 9th | 2 |
| 10th | 1 |
| 11th–22nd | 0 |
| NC / DSQ / No time set | -5 |

### Qualifying — Constructor Bonuses
| Outcome | Points |
|---|---|
| Neither driver reaches Q2 | -1 |
| One driver reaches Q2 | 1 |
| Both drivers reach Q2 | 3 |
| One driver reaches Q3 | 5 |
| Both drivers reach Q3 | 10 |
| Disqualified driver | -5 per driver |

### Sprint — Driver
| Result | Points |
|---|---|
| 1st | 8 |
| 2nd | 7 |
| 3rd | 6 |
| 4th | 5 |
| 5th | 4 |
| 6th | 3 |
| 7th | 2 |
| 8th | 1 |
| 9th–22nd | 0 |
| DNF / DSQ / NC | -10 |
| Fastest Lap | 5 |
| Positions gained | +1 per position |
| Positions lost | -1 per position |
| Overtakes made | +1 per overtake |

Constructor sprint: combined driver total. Disqualified driver: -10 per driver.

### Race — Driver
| Result | Points |
|---|---|
| 1st | 25 |
| 2nd | 18 |
| 3rd | 15 |
| 4th | 12 |
| 5th | 10 |
| 6th | 8 |
| 7th | 6 |
| 8th | 4 |
| 9th | 2 |
| 10th | 1 |
| 11th–22nd | 0 |
| DNF / DSQ / NC | -20 |
| Fastest Lap | 10 |
| Driver of the Day | 10 (driver only) |
| Positions gained | +1 per position |
| Positions lost | -1 per position |
| Overtakes made | +1 per overtake |

### Race — Constructor Pit Stop Points
| Pit stop time | Points |
|---|---|
| Over 3.0s | 0 |
| 2.50–2.99s | 2 |
| 2.20–2.49s | 5 |
| 2.00–2.19s | 10 |
| Under 2.0s | 20 |
| Fastest pit stop bonus | 5 |
| New world record (current 1.8s, McLaren Qatar 2023) | 15 bonus |
| Disqualified driver | -20 per driver |

Team management: exceeding free transfer allowance = -10 per additional transfer.

---

## COMPLETED 2026 RESULTS

### Australia R1 — 7 March 2026 (Standard Weekend)
- **Race:** Russell P1, Antonelli P2, Leclerc P3, Hamilton P4, Norris P5, Verstappen P6, Bearman P7, Lindblad P8, Bortoleto P9, Gasly P10 — Stroll NC, Alonso DNF, Bottas DNF, Hadjar DNF, Piastri DNS, Hulkenberg DNS
- **Qualifying:** Russell P1 — 1:18.518 (only verified time — all others are approximate placeholders)

### China R2 — 23 March 2026 (Sprint Weekend)
- **Sprint Race:** Russell P1, Leclerc P2, Hamilton P3, Norris P4, Antonelli P5, Piastri P6
- **Race:** Antonelli P1 (1:33:15.607), Russell P2, Hamilton P3, Leclerc P4, Bearman P5, Gasly P6, Lawson P7, Hadjar P8, Sainz P9, Colapinto P10 — Verstappen DNF, Alonso DNF, Stroll DNF, Piastri DNS, Norris DNS, Bortoleto DNS, Albon DNS
- **Qualifying:** Antonelli P1 — 1:32.064 (only verified time — all others are approximate placeholders)

### Championship Standings After Round 2
- **Drivers:** Russell 51pts, Antonelli 47pts, Leclerc 34pts, Hamilton 33pts
- **Constructors:** Mercedes 98pts, Ferrari 67pts

---

## CIRCUIT OVERTAKING DATA (2023–2025)

| Circuit | 2023 | 2024 | 2025 |
|---|---|---|---|
| Monaco | 36 | 17 | 4 |
| Australia | 74 | 35 | 45 |
| Japan | 81 | 85 | 28 |
| Silverstone | 50 | 55 | 58 |
| Hungary | 51 | 65 | 69 |
| Zandvoort | 240* | 73 | 70 |
| Belgium | 95 | 58 | 49 |
| Singapore | 85 | 62 | 58 |
| Qatar | 108 | 81 | 41 |
| Las Vegas | 181 | 109 | 34 |
| Abu Dhabi | 113 | 96 | 125 |
| Monza | 49 | 71 | 47 |
| Baku | 50 | 66 | 55 |
| Canada | 46 | 83 | 75 |
| Spain/Barcelona | 107 | 86 | 78 |
| Austria | 105 | 85 | 81 |
| Miami | 94 | 93 | 80 |
| China | — | 102 | 72 |
| Mexico | 121 | 87 | 97 |
| Brazil | 69 | 70 | 96 |
| Austin (COTA) | 78 | 86 | 71 |
| Bahrain | 80 | 66 | 130 |

*2023 Zandvoort was affected by wet conditions — outlier, not representative.

**Overtaking classification:**
- Very High: Las Vegas, Spa, Monza, Baku, COTA, Interlagos, Abu Dhabi, Bahrain, Mexico
- Medium: Shanghai, Suzuka, Silverstone, Singapore, Mexico City, Lusail, Austria, Miami, Barcelona
- Low (qualifying-dependent): Hungaroring, Zandvoort (dry conditions), Monaco, Australia, Qatar, Belgium

Note: 2026 regulations are expected to increase on-track overtaking across all circuits.

---

*End of CLAUDE.md — updated March 2026*
