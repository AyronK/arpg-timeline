# Game page redesign - implementation brief

Reference for implementing the redesign of `/game/[gameSlug]` (example: `/game/path-of-exile`).
The visual reference is `direction-b.dc.html` in this folder. It is a static design mockup,
not production code. Read its markup for layout, hierarchy and copy (it uses the design tool's template syntax, so it will not render correctly as a plain page; each tab's content sits in its own `<sc-if>` block).
Do not copy its inline styles. Build with the app's existing Tailwind tokens and `ui/` components.

## Why

An audit of the current page found it has no single job. It is ten same-weight cards in a grid:

- The main question ("when is the next league / how long is this one?") is answered by the
  reused dashboard `GameCard` at one-third width.
- Calendar subscribe appears twice and the Discord bot three times (header, banner, card),
  as full-width promo banners between the answer and the data.
- Quick Links scrolls inside a 256px box, hiding Builds and Guides.
- "Archival seasons" is a nested-scroll copy of the Timeline page.
- Steam news ("Game news") and the site's own articles ("News") are two separate things
  with the same name.
- The live SteamDB player count is the most "alive" data on the page and sits at the very bottom.

## Decisions (agreed with the owner)

1. **Direction B: game hub with tabs.** One shared game header plus a tab bar across the
   game's sub-pages. Tabs are real routes (links), not client-side tabs:
   | Tab | Route | Notes |
   |---|---|---|
   | Overview | `/game/[gameSlug]` | the redesigned page |
   | Timeline | `/game/[gameSlug]/timeline` | existing page, now under the shared header. Seasonal games only (`isSeasonalGame`) |
   | News | `/game/[gameSlug]/news` | Steam/official feed plus site articles in one list |
   | Guides | `/game/[gameSlug]/resources` | existing resources index. Needs a useful empty state (most games have no articles) |
   | Stats | `/game/[gameSlug]/stats` | **new route**: full statistics + Steam players |
2. **Same date rules as the dashboard.** Now/Next cards and the header status line follow
   exactly the dashboard `GameCard` rules for progress, end dates and unconfirmed seasons
   (superseded the earlier "no estimates anywhere" rule).
3. **Keep the official news feed** (Steam / Blizzard via `GameNewsService`, the `game_news`
   table). There are few editorial articles, so the feed is the main news source. Label each
   item with its source.
4. **League rhythm section** (three plain-language tiles: average length, leagues per year,
   usual launch day/time) replaces the analyst-style stats card on Overview. Phrase it as
   history ("is when most past leagues launched"), not as a prediction. The full numbers move
   to the Stats tab.
5. **No timeline chart widget on Overview.** Use a simple "Recent leagues" list (last 3
   leagues: name, dates, length) that links to the Timeline tab.
6. **Patreon stays visible**, as a card in the Overview sidebar, not a top-of-page banner.
7. Audience: both search visitors (need the answer fast) and returning dashboard users
   (want depth).

## Overview page structure (desktop)

Shared header (all tabs):
- Visible breadcrumb Home / {Game} (use `components/articles/Breadcrumbs`, keep `BreadcrumbSchema`).
- Logo, `h1` game name, one status line ("{current season} - N days left - next {seasonKeyword}
  not announced yet"), Steam player chip (`SteamPlayersChip` exists, used on the dashboard).
- "Get notified" primary button, Share button (`ShareMenu` exists).
- Tab bar (nav of links, `aria-current="page"` on the active one). Hide tabs that have no
  route for the game (e.g. Timeline for non-seasonal games).

Main column:
1. Status: two cards side by side. "Now" (current season, progress bar, day X of Y, end date)
   and "Next" ("Not announced yet", "We'll add it the moment it's announced.", buttons
   Add to calendar (opens `CalendarSubscribeDialog`) and Discord bot (`/discord-bot`)).
   When the next season IS announced, show its name and confirmed start date/countdown instead.
2. League rhythm: three tiles, "All / Last 3" toggle (existing `calculateGameStatistics` with
   `recentCount`), link to the Stats tab.
3. Latest: 3 newest feed items with a source label, link to the News tab.
4. Recent leagues: last 3 seasons, link to the Timeline tab.

Sidebar:
1. Patreon card ("Keep aRPG Timeline free").
2. Links: Builds, Guides, Official website, Steam, Twitch (only those that exist for the game).
3. Small "For creators" line: OBS overlay (`/docs/obs/[gameSlug]`), HTML widget (`/docs/html/[gameSlug]`).

Remove from Overview: `CalendarSubscriptionAlert` banner, `DiscordBotBanner`,
`PatreonFunding` banner, the "Tools & Features" card, the Quick Links scroll card,
`ArchivalSeasonsSection`, `SteamEmbed`, the "Other games" and Twitch header buttons.
`SteamDBEmbed` moves to the Stats tab.

## Code map (current state)

- `arpg-timeline/src/app/(site)/game/[gameSlug]/page.tsx` - Overview page, data fetching, metadata, JSON-LD (structured data + FAQ schema). Keep all SEO output.
- `.../[gameSlug]/components/` - `GameHeaderSection`, `QuickLinksSection`, `StatisticsSection`, `ArchivalSeasonsSection`, `GameArticlesSection`, `PlatformIntegrationSection`.
- `.../[gameSlug]/timeline/` - Timeline page (`TimelineView`, `NextSeasonCtas`, `TimelineAside`).
- `.../[gameSlug]/news/` and `.../resources/` - article indexes via `renderArticleIndex`. They also contain `[articleSlug]` detail pages.
- `.../[gameSlug]/utils.ts` - `calculateGameStatistics`, `getArchivalSeasons`, `getOldestSeasonInfo`.
- `src/lib/gameNewsService.ts` - `getGameNewsByGame` (Supabase `game_news`).
- `src/hoc/GameToSeasonWidget/` - current/next season widget used today.

Implementation notes:
- Put the shared header in a layout that wraps only the tab routes, not the article detail
  pages (`news/[articleSlug]`, `resources/[articleSlug]`). A route group such as
  `[gameSlug]/(hub)/layout.tsx` is one way to do it. Confirm the approach before moving files.
- Keep `data-sa-click` analytics attributes on every interactive element, reusing existing
  event names where the element is the same.
- Use the season keyword per game (`game.seasonKeyword`, `buildSeasonTerms`), not the word "league".
- Responsive: header actions wrap, sidebar stacks under the main column on mobile, tab bar
  scrolls horizontally if it overflows. No mobile mockup exists yet.

## Resolved decisions (grilling session, 2026-10-11)

Structure:
- Tab routes move into `[gameSlug]/(hub)/` (route group, URLs unchanged), including
  `news/page/[page]` and `resources/page/[page]`. `[articleSlug]` detail pages stay outside.
- h1: game name on Overview; on sub-pages the tab title is the h1 and the header game name
  is a styled non-heading element.
- `/stats` is indexed, with its own metadata, and added to `sitemap.ts` for seasonal games.

Notify actions:
- Header "Get notified" opens a menu (Add to calendar / Discord bot) on every tab.
- Next card keeps "Add to calendar" and "Discord bot" as equal-weight buttons while the next
  season is unannounced.

News:
- News tab: our article cards first, then a compact "Official announcements" list (5 newest
  feed items, label + date + title + one-line clamped excerpt, link to all Steam announcements). Feed on
  page 1 only; `/news/page/[n]` stays articles-only. Hide empty blocks; one "No news yet"
  message if both are empty. (Revised after review: feed-first read as a wall of text.)
- Source label derived, no schema change: `steam_app_id` set -> "Steam", null -> "Official";
  Sanity articles -> "aRPG Timeline". No store-sale filtering.
- Overview "Latest": 3 newest across both sources, mixed by date, titles only.

Stats:
- Players: live count + `SteamDBEmbed` 7-day chart only (no 24h/all-time peak numbers, no new
  data source).
- Rhythm "All / Last 3": both sets computed server-side, small client toggle, default All.

States:
| Game | Overview | Hidden tabs |
|---|---|---|
| Dormant | Now card "No active {season}"; Next, Rhythm, Recent stay | - |
| Coming soon | One Release card replaces Now/Next; no Rhythm/Recent | Timeline, Stats |
| Non-seasonal | Latest + sidebar only | Timeline, Stats |
| No Steam | No player chip; Stats tab without players section | - |

Delivery: five phases, stopping after each for review/commit:
1. Hub layout, shared header, tab bar on existing pages
2. Overview rebuild
3. News blocks
4. Stats route
5. Guides empty state + delete unused page components (shared ones only if unused elsewhere)

Add unit tests for new pure helpers (Now/Next state, rhythm tiles, news source labels, tab
visibility per game type).

## Repo rules

Follow `CLAUDE.md`: run `npm run format:all`, `npm run lint` and `npm run typecheck` in
`arpg-timeline/`, no dependency changes, shadcn/ui-based components, keep existing tests
passing (`metadata.test.ts`, `nextSeasonHeading.test.ts`, timeline tests).
