# Simple Analytics export – what the data means

Reference for working with the raw Simple Analytics (SA) CSV exports in this folder. Each entry is marked as one of:

- **[docs]**: stated in the SA documentation (read 2026-10-19).
- **[verified]**: checked against our own export (`2026-10-19_arpg-timeline_com_events.csv`, Sep 18 – Oct 19 2026, 49,483 rows).
- **[ours]**: a definition or assumption we chose for our dashboards.

Sources:

- https://docs.simpleanalytics.com/metrics
- https://docs.simpleanalytics.com/explained/time-on-page
- https://docs.simpleanalytics.com/explained/unique-visits

## Core SA concepts

| Concept | Meaning |
| --- | --- |
| Pageview | One row with `datapoint = pageview`. **[docs]** |
| Visitor / unique visit | A pageview with `is_unique = true`. SA counts unique pageviews and calls them "visitors"; it does **not** recognize people. **[docs]** |
| Unique rule | Unique if there is no referrer (direct) or the referrer's hostname differs from ours. Not unique on internal referrers, reloads and back/forward navigation. In an SPA, every navigation after the first load is non-unique. **[docs]** |
| Returning visitors | Not available. SA uses no cookies, storage or fingerprinting, so a returning person counts as a new visitor. **[docs]** |
| `session_id` | Actually a **page-load ID**: a random in-memory ID for one document load. It **survives SPA (History API) route changes** and ends on reload, new tab or close. It is unrelated to SA's "sessions". **[docs]** |
| SA "session" | Starts with a unique pageview and continues through internal navigation with no timeout. It has **no identifier** in the export. **[docs]** |
| Time on page (`duration_seconds`) | Measured for every pageview and paused while the tab is in the background. SA **reports the median**, not the mean, and **excludes pageviews under 5s**, which it treats as bounces. There is **no cap**: tabs left open produce huge values. **[docs]** |
| Scroll (`scrolled_percentage`) | How far the visitor scrolled on that pageview. **[docs]** |
| Bots | Excluded by SA (`is_robot` is always `false` in the export). **[docs] [verified]** |

## Column notes (verified against the export)

- `datapoint`: `pageview` or the event name. **Event names are normalized**: we send `filter-customization` and the export shows `filter_customization`. Capitalization is kept (for example `Season_33_patch_notes_click`).
- `added_iso` / `added_unix`: timestamps in UTC. `added_date` is the UTC date.
- `duration_seconds`: only on pageviews. **Missing on about 40% of them** (no end-of-page beacon), and the gap is larger on mobile. The raw export **still includes values under 5s**, so apply the 5s rule yourself. The maximum seen is about 125k s (35 h).
- `scrolled_percentage`: only on pageviews, and missing on about 33%. Values are multiples of 5.
- `is_unique`: present on pageviews **and** events. On events it reflects the page load the event fired in.
- `session_id`: shared by pageviews and events in the same page load, so events can be joined to their page load. A few event-only loads (about 15) have no pageview.
- `path`: on an event, this is the page the event fired on.
- `referrer_hostname`: normalized (`google`, `yandex`, `bing.com`, `arpg-timeline.com` for internal). `referrer_path` is usually just `/`.
- `metadata.<key>_<type>`: our custom event metadata, suffixed with its type (`_text`, `_bool`, `_int`).
- `hostname_original`, `utm_medium`: effectively empty for us.

## Site-specific event semantics (our code)

- **`filter_customization`** fires **once per browser, ever** (localStorage flag in `arpg-timeline/src/hooks/useGameFiltersAnalytics.ts`), and only on the featured dashboard. That makes it the only available **"new browser" proxy**. **[verified in code]**
- `metadata.isDefault_bool` on `filter_customization` is `true` when no custom filters are stored.
- **`outbound_<host>` events** carry `metadata.url_text`, the full outbound URL with our UTM tags. They **co-fire** with game-specific click events (`<game>_official_website_click`, `<game>_builds_click`, and so on), so don't add the two together. **[verified]**
  - `utm_content=<game slug>` together with `utm_campaign` (`official-website`, `builds`, `guides`, `steam-store`, `patch-notes`, `season-details`, `twitch-category`) identifies the game and the link type.
  - `utm_content=season_link` with `utm_term=<season name>` marks season and patch-notes links. The game comes from the page path or a co-fired game event.
- Game-specific events are named `<game_slug_with_underscores>_<action>`. Match the slug **by longest prefix**, because `path_of_exile` is a prefix of `path_of_exile2`.
- **Dynamic event names**:
  - `<Season_name>_patch_notes_click` and `<Season_name>_season_link_click`
  - `Calendar_<Google|Apple|iCal>_<event title>`
  - `Share_<Platform>_<text>`
- **`/embed/*` pageviews are iframe loads on other sites.** Their referrer is the host site (for example `bigbes.github.io`), so they **are not real visitors**. Exclude them from site traffic. `*_embed_view` events carry `metadata.hostname_text`, the embedding host.
- `/game/<x>` paths include junk and typo slugs (`diablo4`, `path-of-exilepath`, `hero-siege](https:`). These are probably bad external links leading to 404s.

## Our derived definitions **[ours]**

| Term | Definition |
| --- | --- |
| Page load | One `session_id` |
| Visit | A page load whose first pageview has `is_unique = true` (matches SA's visitor count) |
| Reload / return load | A page load whose first pageview is non-unique and whose referrer is external or empty. These are reloads and back/forward navigation, a sign of habitual use |
| Internal load | A page load whose first pageview has referrer `arpg-timeline.com` (a link opened in a new tab or a full navigation) |
| Time on page | The median of `duration_seconds >= 5` |
| Bounce rate | Pageviews with `duration_seconds < 5` ÷ pageviews that have a duration |
| Interaction | A page load with any custom event other than `filter_customization`, `onboarding_shown` and `*_embed_view` |
| New-browser proxy | `filter_customization` events ÷ visits landing on `/` |
| Feature availability | The page types (dashboard, game, news, other) where a feature's events actually fire. Usage rate = page loads using the feature ÷ page loads that viewed one of those page types |
| Canonical game slugs | The union of `metadata.visible_text` and `metadata.hidden_text` from `filter_customization` |
| Time zone | The dashboard uses the viewer's browser local time. Raw data is UTC |
