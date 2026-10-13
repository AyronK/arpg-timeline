# 01: Take the prototype out of the running app

Context: [SPEC](../SPEC.md) → Implementation Decisions → Prototype.

**What to build:** the dashboard renders the normal games grid again in dev. The dev-only variant switcher (pink bar) and the variant G prototype no longer run, so later tickets can be checked against real behaviour. The extraction of a single game tile and the grid-order helper out of the games grid stays, because peek (ticket 06) renders individual cards in their slots.

**Blocked by:** None (can start immediately).

**Status:** ready-for-agent

- [ ] The dashboard grid shows no prototype strip, popover or variant bar in dev or production, with or without `?variant=`.
- [ ] The prototype component and the variant switcher component are deleted.
- [ ] The filter context no longer exposes fields that existed only for the prototype (`categoryGames`, `excludedSlugs`), unless a later ticket in this spec needs them, in which case keep them and note it.
- [ ] The games grid still uses the extracted single game tile and grid-order helper, and the card order is unchanged from `main`.
- [ ] The prototype header slot in the dashboard grid is removed.
- [ ] `npm run typecheck`, `npm run lint` and `npm test` pass.
- [ ] The variant G reference stays recoverable from commit `deb5a2d` (nothing to do; just don't rewrite history).
