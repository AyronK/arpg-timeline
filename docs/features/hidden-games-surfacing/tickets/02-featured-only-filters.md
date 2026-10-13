# 02: Featured-only filters

Context: [SPEC](../SPEC.md) → Filter state module; Filter state wiring. User stories 29, 30, 35–37, 46.

**What to build:** filters exist only on the Featured tab.
- On Early Access, Non-Seasonal and Community, visitors see the tab's full list and Filters is disabled, as on Full Catalog.
- A visitor's Featured customization survives browsing other tabs.
- Shared `?exclude=` links keep working on Featured.

All of this comes from the new pure filter-state module, starting with `resolveExcludedSlugs`.

**Blocked by:** 01.

**Status:** ready-for-agent

- [x] A new pure filter-state module exports `resolveExcludedSlugs({ category, games, stored, urlExcludes })`:
  - Any non-Featured category → `[]`.
  - A stored record tagged with another tab is ignored.
  - Otherwise the stored Featured record wins, then `?exclude=`, then the Featured preset.
- [x] The Featured preset rule moves into the module unchanged: dormant, or community, or (not seasonal, not early access, and no confirmed next season).
- [x] Unit tests (node Vitest, fixture builders) cover:
  - the preset with no inputs
  - stored beats URL
  - URL used when nothing is stored
  - another tab's stored record ignored, falling back to URL, then the preset
  - every non-Featured category returns empty
  - which games the preset includes and excludes
- [x] The filter-state hook delegates to the module and no longer computes its own defaults.
- [x] Writes stay a single storage record tagged `featured`; the stored format is unchanged.
- [x] On non-Featured tabs, the Filters button (desktop) and the Filters drawer button (mobile) are disabled, and the grid isn't reduced by exclusions.
- [ ] Manual check: customize Featured, open Community, return to Featured, and the customization is still there.
- [ ] Existing filter-adoption analytics still fire as before on Featured.
