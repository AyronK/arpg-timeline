# 08: "Can't find a game?" card rewrite

Context: [SPEC](../SPEC.md) → Can't-find card. User stories 41–43.

**What to build:** on Featured, the grid's "Can't find a game?" card reads "Can't find a game? **N games are hidden by filters**". That text opens the same full hidden-games popover as the strip, followed by **Edit filters · Full Catalog · Request on Discord**. On tabs with nothing hidden, it falls back to Full Catalog and Discord.

**Blocked by:** 05.

**Status:** done

- [x] The count comes from `hiddenCount` in the summary.
- [x] "N games are hidden by filters" opens the hidden-games popover listing all hidden games, reusing the strip's popover component.
- [x] Edit filters opens the dialog or drawer; Full Catalog navigates to the Full Catalog tab; Discord keeps the existing link attributes.
- [x] On non-Featured tabs or with 0 hidden, the hidden line and Edit filters aren't shown.
- [x] The card keeps its existing grid position behaviour at every breakpoint.
- [x] Copy follows the plain-label style (describes what things are or do).
- [ ] Manual check on desktop and mobile, on Featured and on another tab.
