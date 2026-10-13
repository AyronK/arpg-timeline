# Spec: Surfacing filter-hidden games

Status: `ready-for-agent` · Branch: `feature/filters-onboarding` · Decision log: [README.md](./README.md)

## Problem Statement

Visitors to the dashboard regularly report that a game is "missing" when it is actually hidden by the Featured tab's default filter preset. The preset hides dormant games, community games, and games that are neither seasonal nor early access and have no confirmed next season. Labels, the Filters badge and an onboarding modal already exist, yet users still don't understand that a preset is applied by default or that they can change it. Only about 40% of users ever change the preset; most of the rest probably don't know it exists, so they miss content without realising it, including hidden games that are about to start.

The existing hints don't reach the right people:
- The "Some games are hidden" text only shows on very wide screens.
- The onboarding modal only appears on the third visit.
- The "Can't find a game?" card points to tabs, not filters.
- The hidden count appears up to three times on a screen in different forms.

Filters also behave oddly outside Featured:
- On the other tabs, the dialog lists every game, so most toggles change nothing visible.
- The badge counts games that aren't on that tab.
- Filters are stored as a single record tagged with one tab, so customizing another tab silently wipes a user's Featured customization.

## Solution

Make the preset visible state, and show what it hides without blocking the page or taking grid space.

- **Filters exist only on Featured.** Other tabs are fixed lists with Filters disabled, as Full Catalog already is.
- **The Filters button becomes the preset control.** It says what is applied and how many games it hides: `Filters · Featured preset · 23 hidden`, `Filters · Custom · 12 hidden`, or `Filters · All games shown`. It replaces the separate count, the yellow badge, the ping and the wide-screen hint.
- **A one-line starting-soon strip** sits in the header. It lists hidden games whose next season starts within 30 days, each as a chip with the full game name and "in Nd", then "+N more", which opens the Filters dialog. Each chip opens a popover with the game's date and why it's hidden, plus **Edit filters**.
- **On mobile**, the bottom menu's counter tab becomes the preset label and opens the filters drawer. The strip sits under the page title and scrolls sideways.
- **The Filters dialog** gains a "Reset to Featured preset" button and a "Show filtered-out games starting soon" switch.
- **The "Can't find a game?" card** points straight at the filters, Full Catalog and Discord.

## User Stories

### Understanding the preset

1. As a first-time visitor, I want to see that a preset is applied by default, so that I know the dashboard isn't showing every game.
2. As a first-time visitor, I want the Filters control to tell me how many games are hidden, so that I understand the scale of what I'm not seeing.
3. As a visitor who never touched filters, I want the control to name the preset ("Featured preset"), so that I understand the hidden games are a default choice, not missing data.
4. As a visitor who customized filters, I want the control to say "Custom", so that I know my own choices are in effect.
5. As a visitor who un-hid everything, I want the control to say "All games shown", so that I know nothing is filtered.
6. As a desktop visitor on a narrower screen, I want a shortened control label, so that the header still fits on one line.
7. As a visitor, I want the preset label to be the same thing I click to change it, so that the cause and the fix are in one place.
8. As a visitor, I want the hidden count shown once, so that I'm not confused by several numbers that mean the same thing.

### Discovering hidden games

9. As a fan of a hidden game, I want to see that it's starting within the next 30 days, so that I don't miss its launch because of a default filter.
10. As a visitor, I want each starting-soon hidden game shown with its full name and days until start, so that I can recognise it at a glance.
11. As a visitor, I want only confirmed starts treated as starting soon, so that I don't mistake a guess for an announcement.
12. As a visitor, I want starting-soon games ordered by date, so that the most urgent appears first.
13. As a visitor, I want a "+N more" entry that opens Filters, so that I can see and change every hidden game without the strip growing.
14. As a visitor, when no hidden game starts within 30 days, I want an "N games hidden" entry that opens Filters, so that I can still see what's hidden.
15. As a visitor, I want the strip to stay on one line, so that it doesn't push the grid down or crowd the header.
16. As a mobile visitor, I want the strip to scroll sideways under the title, so that it fits a narrow screen.

### Understanding why a game is hidden

17. As a visitor, I want to open a hidden game's details by tapping or clicking it, so that I learn about it without leaving the page.
18. As a visitor, I want to see why each game is hidden (No recent updates, Community, No confirmed season, or Hidden by your filters), so that I learn how the preset works.
19. As a visitor, I want to see the game's next season date in the popover, so that I can decide whether I care.
20. As a touch-screen visitor, I want every popover to work on tap, so that I'm not locked out of hover-only features.
21. As a visitor, I want the popover to close when I tap elsewhere or scroll, so that it never blocks the page.

### Peeking

Stories 22–25 (a "Show here" peek) were dropped after implementation; see README decision 27.

### Changing filters

26. As a visitor, I want an "Edit filters" action in the popover, so that I can go from discovering a game to keeping it shown.
27. As a visitor who customized filters, I want a "Reset to Featured preset" button in the dialog, so that I can get back to the default.
28. As a visitor, I want the reset button disabled when I'm already on the preset, so that it's clear there's nothing to reset.
29. As a returning visitor, I want my Featured customization kept even after I browse other tabs, so that my choices aren't silently lost.
30. As someone opening a shared link with `?exclude=`, I want Featured to show that selection, so that shared views keep working.

### Turning it off

31. Dropped (dismissing from the popover); see README decision 27.
32. As a visitor, I want a "Show filtered-out games starting soon" switch in the Filters dialog, so that I can turn the strip off and back on in one place.
33. As a visitor, I want my strip preference remembered on this device, so that I don't have to dismiss it again.
34. As a visitor, I want the preset control to stay visible even with the strip off, so that I always know filters are applied.

### Other tabs

35. As a visitor on Early Access, Non-Seasonal or Community, I want to see the tab's full list, so that the tab means what its name says.
36. As a visitor on those tabs, I want Filters disabled, as on Full Catalog, so that I don't toggle games that aren't on the tab.
37. As a returning visitor who had saved filters on another tab, I want that tab to simply show everything, so that nothing is unexpectedly hidden.

### Mobile

38. As a mobile visitor, I want the bottom menu's counter tab to show the preset label and hidden count, so that I have a persistent reminder after the strip scrolls away.
39. As a mobile visitor, I want to tap that tab to open the filters drawer, so that the reminder is also the way in.
40. As a mobile visitor, I want the Filters button without a duplicate count badge or ping, so that the menu isn't noisy.

### Can't find a game

41. As a visitor looking for a specific game, I want the "Can't find a game?" card to tell me how many games are hidden by filters, so that I check filters first.
42. As a visitor, I want that card to open Filters, so that I can find and show my game in one tap.
43. As a visitor, I want the card to also link to Edit filters, Full Catalog and Discord requests, so that every way to find a game is in one place.

### Maintainer

44. As the maintainer, I want events for opening a hidden game's popover, turning the strip off, resetting to the preset and clicking the preset control, so that I can tell discovery apart from preset changes.
45. As the maintainer, I want the onboarding modal left unchanged for now, so that I can compare 4 weeks of data before deciding to remove it.
46. As the maintainer, I want existing stored filters and `?exclude=` links to keep working on Featured, so that the change is backward compatible.

## Implementation Decisions

### Filter state module (the single test seam)

- One new pure module owns all Featured filter rules. Hooks and components consume it and keep no filter logic of their own.
- **`resolveExcludedSlugs({ category, games, stored, urlExcludes })`** returns the excluded slugs:
  - Non-Featured category → empty.
  - Stored record tagged with another tab → ignored.
  - Otherwise: the stored Featured record, else the `?exclude=` list, else the Featured preset.
  - The preset rule moves here unchanged from the current filter-state hook: dormant, or community, or (not seasonal, not early access, and no confirmed next season).
- **`getHiddenGamesSummary({ games, excludedSlugs, isPreset, now })`** returns everything the UI shows. `now` is injected so tests are deterministic. Shape, refined from the prototype:

  ```ts
  type HiddenReason = "No recent updates" | "Community" | "No confirmed season" | "Hidden by your filters";
  type HiddenGame = { game: Game; reason: HiddenReason; startsInDays: number | null; confirmed: boolean };
  type HiddenGamesSummary = {
      state: "preset" | "custom" | "all-shown";
      hiddenCount: number;
      hidden: HiddenGame[];
      startingSoon: HiddenGame[]; // starts within 30 days, sorted by start ascending
      others: HiddenGame[];       // hidden minus startingSoon
  };
  ```

  - Reasons are checked in order: No recent updates (dormant games; "dormant" is internal and never shown), then Community, then No confirmed season, else Hidden by your filters.
  - Dormant games have no upcoming date, so they never appear in `startingSoon`. They go last in `hidden` and `others`.
  - Only confirmed starts count as starting soon; unconfirmed games go into `others`.
  - `state` is `preset` when there is no stored Featured record, `all-shown` when nothing is excluded, otherwise `custom`.
  - The 30-day window is a named constant.

### Filter state wiring

- The filter-state hook delegates to `resolveExcludedSlugs` and stops computing its own defaults.
- Writes stay a single storage record tagged `featured`. The storage format is unchanged, for backward compatibility.
- Non-Featured tabs: Filters is disabled the same way as Full Catalog, and their grids are no longer reduced by exclusions.
- The filter context exposes the summary, so the control, mobile tab, strip and Can't-find card all read one source.
- "Reset to Featured preset" clears the stored record and the `?exclude=` parameter, returning `state` to `preset`.

### Desktop header

- **Row 2:** the Filters button becomes the preset control.
  - Labels: `Filters · Featured preset · N hidden` / `Filters · Custom · N hidden` / `Filters · All games shown`. At the `lg` breakpoint it shortens to `Filters · N hidden`.
  - Removed: the yellow count badge and its ping.
- **Row 1, right side:** the strip replaces the wide-screen hint and the game count display, which are both removed.
- **Strip chip caps:** lg 2, xl 3, 2xl and up 4. Caps are applied by breakpoint, presentation only; the summary returns the full list.

### Strip and popover

- The chips follow a muted `Filtered out:` label. Each chip shows the full game name, never truncated, and `in Nd`. No logo.
- **"+N more"** (or "N games hidden" when nothing starts soon) opens the Filters dialog or drawer; there is no full-list popover. It fires `hidden_marker_opened` with `entry: "more" | "all"`.
- The popover:
  - Opens on tap/click only, with no hover-open.
  - Closes on outside tap or scroll, and is rendered outside the grid so it is never clipped.
  - Each row shows the name, the same start text as the grid (confirmed date, else the CMS override text, else "To be announced"; nothing for dormant games), and the reason.
  - Footer: **Edit filters** only (opens the Filters dialog or drawer properly, not by finding the button in the DOM as the prototype did).
- The strip is not shown when there are no hidden games or when the switch is off.

### Strip off switch

- "Show filtered-out games starting soon" in the Filters dialog (desktop) and drawer (mobile). It is the only way to turn the strip off or back on. It is on by default and saved in browser storage, following the existing onboarding-storage helpers.
- The preset control and mobile tab are never hidden.

### Mobile

- The bottom menu's counter tab shows `N games hidden` / `N hidden by you` / `All games shown` (short, so it clears the dashboard selector, which already names Featured), and opens the filters drawer on tap.
- The mobile Filters button loses its count badge and ping.
- The strip renders under the page title on one line, capped at 1 chip so "+N more" stays visible. If a long name still overflows, it scrolls sideways and the right edge fades.

### Can't-find card

- Copy: "Can't find a game? **N games are hidden by filters**" (opens the Filters dialog or drawer, firing `hidden_marker_opened` with `entry: "cant-find"`), then "Full Catalog · Request on Discord".
- On non-Featured tabs, where nothing is hidden, it falls back to the Full Catalog and Discord links.

### Analytics

- New events, using the existing `sa_event` convention: `preset_chip_clicked`, `hidden_marker_opened`, `hidden_markers_disabled`, `filters_reset_to_featured`.
- The existing filter-adoption analytics keep working. Adoption still means "changed the default preset".

### Unchanged

- The onboarding modal (it still shows on the third visit on Featured). It is reconsidered after 4 weeks of data.

### Prototype

- The variant G prototype in the working tree is a reference only. Rebuild properly: no dev variant switcher, no DOM lookup to open Filters.

## Testing Decisions

- **Good tests** check external behaviour only: given games, a category, stored and URL inputs and a fixed `now`, assert the returned slugs or summary. No React rendering, no mocking internals.
- **Tested module:** the filter state module, both functions:
  - `resolveExcludedSlugs`:
    - Featured with no inputs gives the preset.
    - A stored Featured record wins over the URL.
    - The URL is used when nothing is stored.
    - A stored record for another tab is ignored, falling back to the URL, then the preset.
    - Every non-Featured category gives an empty list.
    - The preset includes dormant, community and unconfirmed non-seasonal games, and excludes seasonal, early access and confirmed games.
  - `getHiddenGamesSummary`:
    - Each `state` value.
    - Reason order: dormant and community gives No recent updates; community gives Community; non-seasonal unconfirmed gives No confirmed season; otherwise Hidden by your filters.
    - The 30-day boundary: inclusive at day 30, excluded at day 31 and for past dates.
    - Sorting by start date.
    - Dormant games never in `startingSoon`, and last in `hidden` and `others`.
    - Unconfirmed starts never in `startingSoon`.
    - `others` is the complement of `startingSoon`.
    - `confirmed` and `startsInDays` are passed through correctly.
- **Prior art:** existing node-environment Vitest unit tests on pure functions with an injected `now` and small fixture builders (the dashboard article selection tests, the season sorting tests).
- **Not unit-tested** (checked by hand by the user in their own dev server): chip caps per breakpoint, popover behaviour, dialog switch, mobile tab, analytics wiring.

## Out of Scope

- Game search (planned separately).
- Removing or changing the onboarding modal.
- Per-tab filters, or filters on Early Access, Non-Seasonal, Community or Full Catalog.
- Markers inside the grid (variants A–D, F and H from the decision log were rejected).
- Showing a hidden game in the grid without changing filters (peek; dropped, README decision 27).
- Any change to the stored filter format, Sanity content or dependencies.

## Further Notes

- **Mockup history and every decision with its rationale:** [README.md](./README.md). All explored variants are in `all-variants.patch`.
- **Delivery:** one branch, tickets as files in `tickets/` next to this spec, implemented one per fresh session, blockers first.
- **Cleanup at the end of the branch:** delete the prototype code and this whole folder, so only the implementation is merged. The decision log and mockups stay recoverable from commit `deb5a2d`; cite it in the PR description.
- **Success measure:** filter adoption (changed the default preset) as the headline, plus the new reveal events. Watch whether "can't find game X" reports drop.
