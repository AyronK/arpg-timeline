# 06: Peek

Context: [SPEC](../SPEC.md) → Peek. User stories 22–25.

**What to build:** each game row in the popover gets **Show here**. It renders that hidden game's full card in its normal sorted position in the grid, labelled "Hidden by filters · until reload". The filters, the hidden count and storage are unchanged, and a reload removes it.

**Blocked by:** 05.

**Status:** done

- [x] Peeked slugs live in memory in the dashboard grid only; they are never written to storage or the URL.
- [x] A peeked game appears at the slot the grid's existing sort would give it, rendered with the shared single game tile.
- [x] The peeked card shows the "Hidden by filters · until reload" label and is visually slightly de-emphasised.
- [x] A peeked game leaves the strip, but `hiddenCount` and the preset control label don't change.
- [x] Changing filters or switching tabs clears peeks. A reload clears them too.
- [x] **Show here** fires `hidden_peek_shown` with the game slug.
- [ ] Manual check: peek a game from a chip and from "+N more", confirm its position, confirm the count is unchanged, reload.
