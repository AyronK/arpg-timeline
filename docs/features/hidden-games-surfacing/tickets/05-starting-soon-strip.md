# 05: Starting-soon strip and popover

Context: [SPEC](../SPEC.md) → Desktop header; Strip and popover. User stories 9–21, 31. Visual reference: variant G in commit `deb5a2d` (rebuild properly; don't copy prototype shortcuts).

**What to build:** a one-line strip that shows hidden games about to start, plus a popover explaining each one.
- **Desktop:** the strip sits in header row 1, where the old hint and count were.
- **Mobile:** it sits under the page title, on one line that scrolls sideways.
- **Chips:** each shows a 24px logo, the short name, and `in Nd`, with `~` before estimated dates. Capped at lg 2 / xl 3 / 2xl+ 4 / mobile 2.
- **After the chips:** "+N more". With nothing starting soon, the strip shows "N games hidden" instead.
- **Popover:** tapping or hovering an entry lists each game with its logo, name, `Est.` or confirmed date and reason, plus **Edit filters** and **Hide this strip**.

**Blocked by:** 03, 04.

**Status:** ready-for-agent

- [ ] The strip reads `startingSoon` and `others` from the summary. Caps are presentation only, and chips past the cap fold into "+N more".
- [ ] The strip is not rendered when `hiddenCount` is 0 or on non-Featured tabs.
- [ ] Popover behaviour:
  - Opens on tap/click and on mouse hover.
  - Closes on outside tap and on scroll.
  - Is rendered outside the grid so it's never clipped.
  - Stays within the viewport.
- [ ] The popover footer:
  - **Edit filters** opens the desktop dialog or the mobile drawer through the controls from 03/04, with no DOM lookup.
  - **Hide this strip** hides it for the session; ticket 07 makes it persist.
- [ ] No in-grid markers; the grid layout is unchanged.
- [ ] Opening a popover fires `hidden_marker_opened`.
- [ ] Manual check on desktop (lg, xl, 2xl) and mobile:
  - caps per width
  - `~` on estimates
  - the "N games hidden" fallback (fake it by temporarily widening exclusions or narrowing the window)
  - the popover on touch
