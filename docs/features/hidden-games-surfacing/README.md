# Surfacing filter-hidden games

Feature folder: decision log and mockup history here, `SPEC.md` and `tickets/` alongside. Decision log for making the Featured filter preset understandable without blocking modals. Newest entries at the bottom of each section; superseded decisions stay, marked as such.

## Problem

- Users report "missing" games that are actually hidden by the Featured tab's default preset (`useGameFilterState.ts`, `getDefaultExcludedSlugs`).
- Filter adoption (users who changed the default preset) is ~40%; the other ~60% likely don't know the preset exists.
- Existing hints don't reach the people who need them: the "Some games are hidden" text is `xl+` only, the onboarding modal fires on the 3rd visit, and `CantFindGame` points at tabs, not filters.
- Mobile is ~23% of traffic.

## Constraints

- Don't show all games by default; the Full Catalog tab already covers that.
- No blocking windows for onboarding.
- Hidden games are hidden for a reason: whatever surfaces them must not take much space.
- Search is out of scope (planned separately).

## Decisions

| # | Decision | Why |
|---|---|---|
| 1 | Fix both intent misses ("where is game X?") and discovery misses ("didn't know X was tracked"). | Reports are intent misses; the 60% non-adopters are discovery misses. |
| 2 | Keep Featured as "full catalog minus an editable preset" and make the preset **visible state** (a chip). | Backward-compatible with stored filters; a visible chip is the familiar way to say "something is filtered". |
| 3 | Headline metric stays filter adoption (changed the default preset); also track reveals. | Reveals show engagement that adoption can't, since peeks don't change the preset. |
| 4 | Every interaction works on tap first; hover is a bonus. | ~23% mobile. |
| 5 | Replace the `xl`-only hint and rewrite `CantFindGame`; keep the onboarding modal for now. | Dropping the modal is a separate call, made after the passive approach is proven. |
| 6 | ~~Superseded by 18.~~ The preset chip opens Filters; it has no ✕. Filters dialog gets a full "Reset to Featured" button. | ✕ would duplicate the Full Catalog tab; reset gives an easy way back. |
| 7 | Revealing a hidden game is a **peek** (in memory, until reload), not a persisted filter change. | No easy rollback today, and users may not understand a silent filter change. |
| 8 | Dormant hidden games are grouped into one bucket, not marked individually. | They have no upcoming date, so their position carries no information. |
| 9 | The popover shows name, next season date ("Est." if unconfirmed), and the hidden reason, with **Show here**, **Edit filters**, and **Hide** actions. | Teaches why the preset hides each game, without a modal. |
| 10 | ~~Narrowed by 22.~~ Users can turn the surfacing off: a switch in the Filters dialog (on by default, stored locally), plus a link in the popover. | Users who don't need it shouldn't keep seeing it. |
| 11 | Surfacing applies to custom filters too, not only the Featured preset. | One rule; the off switch covers users who don't want it. With 16, this means custom Featured filters. |
| 12 | Analytics events: `hidden_marker_opened`, `hidden_peek_shown`, `hidden_markers_disabled`, `filters_reset_to_featured`, `preset_chip_clicked`. | Separates "revealed without adopting" from adoption. |
| 13 | **Variant G wins:** the preset chip leads a strip under the tabs listing hidden games that start within 30 days (24px logos, "in Nd", `~` for estimates), then "+N more". Nothing is added to the grid. | Explains *why* (chip) and *what you're missing* (strip) in one line; zero grid space; covers the "my game launches next week" case directly. |
| 14 | Desktop placement: the strip goes in header row 1 (where the `xl`-only hint and the game count were); the chip sits in row 2 next to Filters (see 18). | Adds no height to the sticky header. |
| 15 | ~~Mobile cap changed by 25.~~ Strip window is 30 days; chips capped at lg 2 / xl 3 / 2xl+ 4 and mobile 2 (one line, scrolls sideways); the rest go into "+N more". If nothing starts within 30 days, the strip shows "N games hidden", which opens the full list. | Keeps the strip to one line at every width while still offering a way to peek. |
| 16 | **Filters exist only on Featured.** Other tabs are fixed lists with Filters disabled, like Full Catalog. Stored filters and `?exclude=` links for other tabs are ignored. | Other tabs are already small subsets. Their dialog listed every game, and the badge counted games that weren't on the tab. Stored filters are a single record, so customizing another tab silently wiped Featured customizations. |
| 17 | The only reset is "Reset to Featured preset" in the Filters dialog. | Follows from 16. |
| 18 | ~~Desktop control superseded by 30.~~ **The Filters button becomes the preset control:** `Filters · Featured preset · 23 hidden` / `Filters · Custom · 12 hidden` / `Filters · All games shown`. At `lg` it shortens to `Filters · 23 hidden`. The yellow count badge, the ping, `GameCountDisplay` and the `xl` hint are removed. | Two side-by-side controls opening the same dialog was the ambiguity we were removing; the state lives on the control that changes it. |
| 19 | Mobile: the bottom menu's "Showing X of Y" tab becomes `23 games hidden` / `12 hidden by you` / `All games shown` (shortened after implementation: the longer labels repeated the selector's "Featured" and overlapped the centre button) and opens the filters drawer on tap. The count badge and ping are removed from the mobile Filters button. The strip sits under the title, with the chip first. | The bottom menu is the persistent reminder on mobile, since the strip scrolls away. |
| 20 | Peeking does not change the hidden count. | A peek isn't a filter change; a dropping count would suggest the preset changed. |
| 21 | `CantFindGame` becomes "Can't find a game? **N games are hidden by filters**" (opens the full list), then "Edit filters · Full Catalog · Request on Discord". | One card links to all three ways to find a game. |
| 22 | ~~"The control always stays" superseded by 30.~~ The off switch ("Show hidden games starting soon" in the dialog, "Hide this strip" in the popover) only hides the strip. The preset control always stays. | The control is the minimum signal that filters are applied. |
| 23 | The onboarding modal ships unchanged; it is reconsidered after 4 weeks of adoption and reveal data compared with the current baseline. | Remove it only once the passive approach is proven. |
| 24 | Delivery: one branch, with the spec and tickets kept as docs in this folder (not GitHub Issues), so each ticket can be picked up by a fresh session. Pure logic (hidden list, hidden reason, starting-soon selection, control label state) is unit-tested; the user checks the UI. | User preference; fresh sessions per ticket keep context clean. |
| 25 | After implementation: chips show the full game name and no logo, after a muted `Filtered out:` label. Popovers open on click/tap only. Mobile cap drops to 1, with a right-edge fade only while the row overflows. Placement and caps (14, 15) are unchanged; moving the strip above the grid or into the tabs row was tried and reverted. | Short names and 24px grayscale logos were hard to read. "Hidden"/"Starting soon" read as missing data or as describing the grid; "Filtered out" names the cause. Hover opened the popover before the click landed, so clicks did nothing. With 2 chips on mobile the second ended at the screen edge and "+N more" was off-screen, so the row did not read as scrollable. |
| 26 | Popover polish: no logos in rows, "Show here" uses the chips' pill style, and "Hide this strip" becomes "Don't show again" (supersedes the wording in 9 and 22). | The 32px grayscale logo was too small to mean anything, the outline button was the heaviest thing in the popover, and "strip" read as technical. |
| 27 | Peek ("Show here") is dropped and its code removed. The popover's dismiss action is dropped too: the footer is just **Edit filters**, and the dialog switch, renamed "Show filtered-out games starting soon", is the only on/off. Supersedes 7, 20 and the popover parts of 9, 10, 22 and 26. | Explaining why a game is filtered out and linking to Filters is enough. "Don't show again" read as hiding one chip, and users wouldn't know how to bring the strip back; one switch in Filters covers both. |
| 28 | Only confirmed starts count as starting soon, so the `~` estimate marker is gone. Popover rows show the grid's start text (confirmed date, else override text, else "To be announced") instead of `Est.` dates. Dormant games show "No recent updates" (the game page's wording; "dormant" is internal) and go last in lists. Supersedes the estimate parts of 9 and 13. | The grid never shows unconfirmed dates; they are placeholders, so surfacing them here contradicted it. |
| 29 | No full-list popover: "+N more" / "N games hidden" in the strip and the Can't-find card's hidden line open the Filters dialog or drawer, and the card drops its separate "Edit filters" link. Chip popovers stay (single game, confirmed start). `hidden_marker_opened` keeps firing from these entries with the same `entry` values. Supersedes 21's "opens the full list". | With peek gone, the list only repeated what Filters shows, and its grid-order sorting produced misleading text for games in a grace period. |
| 30 | The desktop Filters button goes back to plain `Filters` (filled, as on `main`); the preset name and count leave it, and `getPresetControlLabel` is removed. The Featured tab tooltip now says what the preset hides. With the strip switched off, desktop shows no hidden count. The mobile tab label stays. | The long label made the button heavy, the strip right above already shows what is filtered out, and the "Featured" tab already names the preset. Turning the strip off is an informed choice made in Filters. |
| 31 | Hidden games in the grid's grace period (72 h after a start) stay as chips, first, labelled `just started` / `started Nh ago`; their popover says "Started <date>". Starts under a day read `in Nh`. The filter context's clock ticks every minute so labels count down and chips expire. | Previously a hidden game's chip vanished the moment its season launched, and showed `in 1d` hours before; the grid already lifts just-started games, so the strip now agrees. |
| 32 | The hidden reason "No confirmed season" becomes "Non-seasonal". | Next to "Started Oct 12th" it read as a contradiction; the preset hides non-seasonal games unless their next start is confirmed, so "Non-seasonal" is the real reason and matches the tab name. |

## Mockups explored

All eight variants live in [`all-variants.patch`](./all-variants.patch), switchable via `?variant=A..H`.

| Variant | Form | Verdict |
|---|---|---|
| A, Gap marker | Thin line with a count bubble in the gap between cards, at the hidden game's sort position. | Rejected: too subtle, you can't tell what it is. |
| B, Docked pill | `+N HIDDEN` pill on the next visible card's top edge. | Rejected (worst): visually ties hidden games to an unrelated visible card. |
| C, Compact cell | Short dashed grid cell with greyed logos. | Rejected: takes a grid slot and leaves a lot of whitespace in a tall row. |
| D, Gap rail with logos | A's gap placement with 14px greyed logos; flips to the row gap on first-column cards and mobile. | Rejected: logos too small to recognise. |
| E, Soon strip | Strip under the tabs: hidden games starting within 30 days as chips, then "+N more". | Liked: the direction that led to G. |
| F, 30-day timeline | Date axis with hidden games as logo pins and shown games as dots. | Not chosen. |
| G, Preset chip + strip | E with the preset chip leading and 24px logos. | **Chosen.** |
| H, Ghost cards + strip | Hidden games starting within 7 days get a dashed full grid card; the rest go in E's strip. | Not chosen. |

### Guidelines learned

- Anything in the grid must not look attached to a visible card (B).
- A marker must be readable on its own; a bare count in a gap isn't (A).
- Logos need to be about 24px to be recognisable; 14px isn't (D).
- Grid cells have a fixed tall height, so a small cell still wastes a whole slot (C).
- "Where it would be" can mean position in time (strip, timeline) rather than position in the grid (E, F).

## Restoring the mockups

The patch was taken against commit `97a9504`. To browse all variants again:

```bash
git stash                     # or commit current work first
git apply docs/features/hidden-games-surfacing/all-variants.patch
npm run dev                   # in arpg-timeline/, then open /?variant=A … /?variant=H
```

The patch touches `Games.tsx` (extracts `GameTile` and `gridOrderClass`), `GameFilterContext.tsx` (exposes `categoryGames` and `excludedSlugs`), and `GamesAndEventsGrid.tsx` (variant switch and header slot), and adds `HiddenGamesPrototype.tsx` and `PrototypeSwitcher.tsx`. The variant bar is hidden in production builds.

## Delivery

Next steps, run by the user:

1. ~~`/to-spec`~~ done: [SPEC.md](./SPEC.md).
2. ~~`/to-tickets`~~ done: [tickets/](./tickets/).
3. `/implement` per ticket in a fresh session, blockers first.

Tickets: [`tickets/`](./tickets/), numbered blockers first. Ticket 01 takes the prototype out of the running app; 09 deletes this folder.

The working tree currently holds the variant G prototype (`HiddenGamesPrototype.tsx`, `PrototypeSwitcher.tsx`, plus the `Games.tsx` / `GameFilterContext.tsx` / `GamesAndEventsGrid.tsx` changes). It is a reference to be rewritten properly, not shipped; ticket 01 removes it from the runtime.
