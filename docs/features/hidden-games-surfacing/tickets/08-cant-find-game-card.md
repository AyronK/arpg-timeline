# 08: "Can't find a game?" card rewrite

Context: [SPEC](../SPEC.md) → Can't-find card. User stories 41–43.

**What to build:** on Featured, the grid's "Can't find a game?" card reads "Can't find a game? **N games are hidden by filters**". That text opens the Filters dialog or drawer, followed by **Full Catalog · Request on Discord** (README decision 29). On tabs with nothing hidden, it falls back to Full Catalog and Discord.

**Blocked by:** 05.

**Status:** done

- [x] The count comes from `hiddenCount` in the summary.
- [x] "N games are hidden by filters" opens the Filters dialog or drawer.
- [x] Full Catalog navigates to the Full Catalog tab; Discord keeps the existing link attributes.
- [x] On non-Featured tabs or with 0 hidden, the hidden line isn't shown.
- [x] The card keeps its existing grid position behaviour at every breakpoint.
- [x] Copy follows the plain-label style (describes what things are or do).
- [ ] Manual check on desktop and mobile, on Featured and on another tab.
