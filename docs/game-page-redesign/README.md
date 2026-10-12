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
- `/stats` is indexed, with its own metadata, and listed in `sitemap.ts`.
- Tab visibility (`hub.ts`, `timeline.ts`): Timeline for released games that are seasonal or have 2+ entries
  (confirmed in the pre-merge review); Stats for released games with 3+ tracked entries (full stats, seasonal or not) or released
  Steam games (players only); Guides only when the game has guide articles. Sitemap follows the same rules
  and leaves out all `resources` URLs for now.

Notify actions:
- Header offers "Add to calendar" ("Free · no sign-up") and an icon Share button on every tab.
  No Discord bot here: the site header already has that CTA. (Revised: "Get notified" read
  like a newsletter sign-up.)
- Next card keeps "Add to calendar" and "Get the Discord bot" as an equal-weight strip
  (`NextSeasonCtas`) while the next season is unannounced.
- Dormant games get no calendar/bot prompts anywhere (header, Next card, Timeline).
  (Superseded 2026-10-12: dormant games get the calendar button and CTAs like any other game.)

News:
- News tab: our article cards plus a compact "Official announcements" list (5 newest feed
  items, label + date + title + excerpt clamped to two lines, link to all Steam announcements).
  Side by side on wide screens (articles ~60%, feed ~40%), stacked below that with articles
  first. Feed on page 1 only; `/news/page/[n]` stays articles-only. Hide empty blocks; one
  "No news yet" message if both are empty.
- Source label derived, no schema change: `steam_app_id` set -> "Steam", null -> "Official";
  Sanity articles -> "aRPG Timeline". No store-sale filtering.
- Overview "Latest": 3 newest across both sources, mixed by date; our newest article is pinned
  first while it is under 60 days old.

Stats:
- Players: live count + `SteamDBEmbed` 7-day chart only (no 24h/all-time peak numbers, no new
  data source).
- Rhythm "All / Last 3": both sets computed server-side, small client toggle, default All.

Overview (as built):
- Now/Next cards use dashboard date rules (`Content`), larger season title, progress text
  shown under the bar (no tooltip), patch notes in the chip row.
- Unannounced next season: soft cadence hint from median length ("expect it around early
  November"); "Likely later than usual" once the estimate is under 21 days away. Editor-written
  CMS text wins over the hint.
- Sidebar (independent column, wider gap): support card (Patreon + Buy Me a Coffee compact
  rows), links grouped "Useful links" / "Official", "For creators" card (OBS, HTML widget).

States:
| Game | Overview | Hidden tabs |
|---|---|---|
| Dormant | Now card ("No recent updates", last update month) + Next card with CTAs; header calendar button; no cadence hint | - |
| Coming soon | Pre-launch Now card + Release card (superseded the single Release card); no Rhythm/Recent | Timeline, Stats |
| Non-seasonal | Same as seasonal once it has a timeline (2+ entries): Now/Next, Rhythm (3+ tracked), Recent | Timeline <2 entries; Stats without Steam and <3 tracked |
| No Steam | No player chip; Stats tab without players section | - |

Delivery: five phases, stopping after each for review/commit:
1. Hub layout, shared header, tab bar on existing pages
2. Overview rebuild
3. News blocks
4. Stats route
5. Guides empty state + delete unused page components (shared ones only if unused elsewhere)

Add unit tests for new pure helpers (Now/Next state, rhythm tiles, news source labels, tab
visibility per game type).

## Progress (2026-10-12)

All five phases shipped on branch `claude/gifted-ritchie-keypwh`:
`334dc41` hub header/tabs, `98c3aa7` Overview, `3d750eb` News, `791b5a0` Timeline layout +
sidebar, `24f7a04` Stats, `3b7035e` Guides empty state + cleanup, `3dde506` header calendar CTA
and Guides hidden, `af9605c` review fixes + dormant/non-seasonal rules.

Open items:
- Audit done 2026-10-12 (Playwright, production build, 1440x900 + 390x844, all games). Fixes
  and decisions are in "Audit follow-up" below. A visual re-check of the follow-up is still open.
- Sanity data issues found by the audit, left as is on purpose (owner decision):
  - `isDormant` / `isComingSoon` are hand-set flags. Grim Dawn, Hell Clock, Pale Coins and Cult
    of Shadows are dormant despite Jul-Aug 2026 updates (so "No recent updates" sits above
    October patch notes). GDCL is not dormant though its last season ended Jan 2025.
    Emberville is not coming soon though Early Access starts Oct 27.
  - Path of Diablo Season 14 has `additionalText` "No info", shown on the Next card and in the
    FAQ text ("It is likely starting No info").
  - Slash Diablo starts are stored as CET midnight (`23:00Z` the day before).
- Code review leftovers: resolved in the pre-merge review (see below).
- Header calendar analytics name changed to `{slug}-hub-calendar-subscribe` (old quick link was
  `{slug}-calendar-subscribe-quick-link`).
- Pre-existing lint error in `components/TopCarousel.tsx` (`react-hooks/purity`) makes
  `npm run lint` / `format:all` fail; unrelated to this work.

## Audit follow-up (2026-10-12)

- Hydration: relative "Started N days ago" / "N days left" / progress text in `Content` render
  after mount (stale ISR HTML caused React #418).
- Stats footnote counts the same seasons as the "All N" toggle.
- Plurals: "~1 week", keyword plurals ("patches"), "1 {keyword} tracked". `buildSeasonTerms`
  lowercases the keyword (CMS has "Content update").
- Header status uses editor-written start text ("Q4 2026") instead of "date not announced".
- Players-only Stats page without players shows a note instead of the empty SteamDB embed.
- No news (no articles, no feed): no Latest card, no News tab; `/news` renders with noindex.
- Under 3 tracked seasons: no Rhythm on Overview; Stats tab only for Steam games (players only).
- Non-seasonal games with an announced upcoming entry show the Next card on Overview.
- Timeline: an open-ended side event that started last is Now (matches the header); dormant
  games' newest card reads "Latest" without "Ongoing".
- Recent list: all past entries incl. events, local dates like Timeline; main seasons end at
  the next main season (events don't cut them short).
- News tab without articles: feed in the main column, support card in the sidebar.
- Sidebar: support card is always first and starts level with the content on every tab
  (Timeline's "On this page" sits below it; News puts its heading inside the main column).
- Rhythm tile values in the body font; dormant header keeps Share on the title row.
- Header on mobile: logo + title on one row, status full width below with current and next on
  separate lines (`buildHubStatusLines`); one "·" line from md up. Steam chip sits beside the
  title; on mobile the calendar caption sits beside the button and Share at the row's end.
- Parser: a latest season only becomes current once its start is confirmed and passed; a passed
  unconfirmed estimate stays next and restarts from now + 10% of the offset (Path of Diablo
  Season 14). Next card never shows the dormant "Play" chip; empty start text falls back to
  "To be announced".
- Timeline cards follow the Overview Now/Next layout (`components/SeasonCardParts.tsx`): badge
  row (status, side event, patch notes) across the top, title links out, then date and the
  Content widget with progress text below. Text is always left-aligned; only the logo mirrors.
  Every running card gets progress, patch notes and the title link, not only the parsed current
  season (a league running alongside a current side event ends at the confirmed next start).
- Audit round 2 (2026-10-12): Timeline Next card built like the Overview one (date only in the
  countdown/Content, cadence hint and "We'll add it..." while unannounced, placeholder titled
  "Not announced yet"); ended current season reads "{name} · ended {date}" in the header and gets
  an "Over" badge on Timeline; dormant games' newest started card is "Latest" even when past, with
  no Content repeat; News, paged News and Guides always use the main column | sidebar grid with
  the support card (articles, then the official feed, at full column width). Overview keeps one
  Now card (latest entry, like the dashboard).
- Steam excerpts drop Markdown escapes. Next card hides "We'll add it..." when editor text exists.
- Kept on purpose: Next-card button wording,
  dashboard side-event behaviour.

## Feedback round (2026-10-12)

- Non-seasonal games (e.g. Ravenswatch) are no longer cut down: Overview Now/Next, Recent and
  cadence hint follow `hasTimeline` (released, seasonal or 2+ entries); Rhythm and full Stats
  need 3+ tracked entries regardless of category. `hasSeasonHistory` removed.
- Timeline card logos are 16:9; logo size and stacking follow the card width (container queries).
- Sidebar column (support card etc.) starts at `xl` instead of `lg` on every hub tab; below
  that it stacks under the main column.
- Header badges (one wrapping group): community (dashboard `CommunityLabel`), Early Access or
  Coming soon (neutral, links to `/dashboard/early-access`), Steam. Side event chip is neutral
  with a tooltip.
- A game whose only entry is upcoming (e.g. Emberville) gets a pre-launch Now card ("Not
  released yet" + calendar / Discord bot strip) beside the Next card. Coming-soon games use the
  same pair; the strip shows on only one card (Next while its date is unconfirmed).

## Season length chart (Stats, grilled 2026-10-12)

- Seasonal games with 5+ finished main seasons; own card after the statistics.
- One bar per finished season, oldest first, neutral grey (`foreground/35`), 4px rounded top,
  capped at 24px, 1px gaps on phones; all seasons always shown.
- Running season: last bar as a 2px sky outline at its length so far, plus a key under the
  chart ("Running: {name} · N days so far"); none for dormant games or between seasons.
- Median (finished seasons only) as a 2px dashed foreground line; its label and the running
  season live in a key under the chart, not in the plot. Caption carries the unit ("in days").
- Far outliers (over Q3 + 3*IQR and over 2x the median, e.g. PoE's ~318-day league) don't set
  the scale; they're drawn clipped with a break mark and their value on top.
- Year ticks + labels under the first season of each year; first and newest always kept, the
  newest flips left of its tick at the right edge, others dropped when they'd collide.
- 192px tall on phones, 256px from md.
- A season counts as finished once its confirmed end has passed or the next season started
  (applies to all stats, not just the chart).
- Desktop hover/focus tooltip only; no tap details, no bar labels, no list.

## Pre-merge review (2026-10-12)

- Fixed: `data-sa-click` on the Overview season title, `CtaPlacement` union, one
  `addGameLinkUTM` helper in `@/lib/utm`, shared sidebar parts in `components/hub/SidebarParts`,
  dead side-by-side layout and `compact` flag removed from `ArticleIndex`, `pickStatusLayout`
  and `getRunningSeason` tested.
- Kept on purpose: the unrelated `859955d lock` commit (swagger-ui-react / dompurify lockfile
  bump), mention it in the PR description.
- Backlog: one card-rules helper shared by Overview and Timeline cards; one computed game phase.

## Repo rules

Follow `CLAUDE.md`: run `npm run format:all`, `npm run lint` and `npm run typecheck` in
`arpg-timeline/`, no dependency changes, shadcn/ui-based components, keep existing tests
passing (`metadata.test.ts`, `nextSeasonHeading.test.ts`, timeline tests).
