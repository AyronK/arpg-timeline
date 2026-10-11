# Game page redesign - implementation brief

Reference for implementing the redesign of `/game/[gameSlug]` (example: `/game/path-of-exile`).
The visual reference is `direction-b.dc.html` in this folder. It is a static design mockup,
not production code: open it in a browser or read the markup for layout, hierarchy and copy.
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
2. **No estimates, anywhere.** If the next season is not announced, say "Not announced yet".
   Never show a predicted or simulated date. Note: `parseGamesFromSanity` fills in simulated
   dates (`calculateSimulatedDate`) for an unconfirmed next season. The new UI must only
   render confirmed dates.
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

## Open questions (ask the owner before deciding)

- Calendar vs Discord bot weight: equal buttons (as mocked) or calendar primary, bot secondary?
- News feed items: titles only or with a one-line excerpt? Filter out store sales?
- Header "Get notified" and the Next-card buttons both appear on Overview. Keep both or one?
- States not mocked: announced next season with a date, non-seasonal/dormant games, games without Steam.

## Repo rules

Follow `CLAUDE.md`: run `npm run format:all`, `npm run lint` and `npm run typecheck` in
`arpg-timeline/`, no dependency changes, shadcn/ui-based components, keep existing tests
passing (`metadata.test.ts`, `nextSeasonHeading.test.ts`, timeline tests).
