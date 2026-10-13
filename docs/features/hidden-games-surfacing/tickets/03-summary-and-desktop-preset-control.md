# 03: Hidden-games summary and the desktop preset control

**Desktop control reverted after implementation** (README decision 30): the button is plain `Filters` again and `getPresetControlLabel` was removed. The summary part stands.

Context: [SPEC](../SPEC.md) → Filter state module; Desktop header; Analytics. User stories 1–8.

**What to build:** on desktop, the Filters button becomes the preset control. It says what is applied and how many games it hides, and it's the only place the hidden count appears in the header.

| State | Label | At `lg` |
|---|---|---|
| Preset untouched | `Filters · Featured preset · N hidden` | `Filters · N hidden` |
| Customized, some hidden | `Filters · Custom · N hidden` | `Filters · N hidden` |
| Customized, none hidden | `Filters · All games shown` | `Filters · All games shown` |

The labels come from `getHiddenGamesSummary`, exposed through the filter context.

**Blocked by:** 02.

**Status:** done (`f4e3f87`); the manual desktop check below is pending a human.

- [x] The filter-state module exports `getHiddenGamesSummary({ games, excludedSlugs, isPreset, now })` with this shape (refined from the prototype):

  ```ts
  type HiddenReason = "Dormant" | "Community" | "Non-seasonal" | "Hidden by your filters";
  type HiddenGame = { game: Game; reason: HiddenReason; startsInDays: number | null; confirmed: boolean };
  type HiddenGamesSummary = {
      state: "preset" | "custom" | "all-shown";
      hiddenCount: number;
      hidden: HiddenGame[];
      startingSoon: HiddenGame[]; // within 30 days, sorted by start ascending
      others: HiddenGame[];
  };
  ```

- [x] The summary follows these rules:
  - Reasons are checked in order: Dormant, then Community, then Non-seasonal, else Hidden by your filters.
  - Dormant games are never in `startingSoon`.
  - `others` = `hidden` minus `startingSoon`.
  - `state`: `preset` when there's no stored Featured record, `all-shown` when nothing is excluded, otherwise `custom`.
  - The 30-day window is a named constant.
- [x] Unit tests cover:
  - each `state` value
  - the reason order
  - the 30-day boundary (day 30 included, day 31 and past dates excluded)
  - date sorting
  - dormant games excluded from `startingSoon`
  - the complement rule
  - `confirmed` and `startsInDays` values
- [x] The filter context exposes the summary.
- [x] The desktop Filters button shows the labels above, switching to the shortened form at the `lg` breakpoint.
- [x] Removed: the yellow count badge, its ping, the "N of M games shown" display and the wide-screen "Some games are hidden by default" hint.
- [x] The Filters dialog can be opened from code, so ticket 05 can open it.
- [x] Clicking the control fires `preset_chip_clicked` via `sa_event`. The existing `filters_opened` event still fires.
- [ ] Manual check on desktop: all three label states, and the `lg` shortened form.
