# 04: Mobile preset tab

Context: [SPEC](../SPEC.md) → Mobile. User stories 38–40.

**What to build:** on mobile, the bottom menu's "Showing X of Y" tab becomes the persistent preset reminder: `Featured preset · N hidden` / `Custom filters · N hidden` / `All games shown`. Tapping it opens the filters drawer. The mobile Filters button keeps working, but loses its duplicate count badge and ping.

**Blocked by:** 03.

**Status:** ready-for-agent

- [ ] The counter tab reads its label from the hidden-games summary in the filter context.
- [ ] Tapping the tab opens the filters drawer; the drawer can now be opened from code, which ticket 05 relies on.
- [ ] The tab still hides and shows with the bottom menu exactly as it does today.
- [ ] The mobile Filters button has no count badge and no ping.
- [ ] Tapping the tab fires `preset_chip_clicked`.
- [ ] On non-Featured tabs (no filters), the tab shows `All games shown` or is hidden, whichever reads better. Record the choice in the PR.
- [ ] Manual check on a narrow viewport: label states, tap to open, menu hide/show on scroll.
