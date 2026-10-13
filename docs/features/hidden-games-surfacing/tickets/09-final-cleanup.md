# 09: Final cleanup

Context: [SPEC](../SPEC.md) → Further Notes.

**What to build:** the branch contains only the implementation. The temporary feature docs (decision log, mockup patch, spec, tickets) are deleted, and the PR description records where they can be recovered.

**Blocked by:** 01, 02, 03, 04, 05, 06, 07, 08.

**Status:** ready-for-agent

- [ ] All earlier tickets are marked done.
- [ ] No prototype code, dev variant switcher or `PROTOTYPE` comments remain in the app.
- [ ] Unused exports left behind by the removed hint, badge, ping or count display are deleted. Keep storage helpers that the onboarding modal still uses.
- [ ] The `docs/features/hidden-games-surfacing/` folder is deleted (and `docs/features/` too, if empty).
- [ ] `npm run format:all`, `npm run typecheck`, `npm run lint` and `npm test` pass.
- [ ] A PR description draft for the user, summarising the change. It cites commit `deb5a2d` (decision log and mockups) and the last commit that still has the spec and tickets.

## Known follow-ups

Raised in reviews of tickets 04–08 and deliberately not fixed. Decide on each during feedback or cleanup; carry any still open into the PR description, since this folder gets deleted.

- [ ] `getFilterPingSeen` has no callers; `OnboardingModal` still calls `setFilterPingSeen`, but nothing reads the flag. Delete both, or keep them if the modal should keep writing the flag.
- [ ] The Can't-find card's Full Catalog link is a plain `<Link href="/dashboard/all">`. Unlike the tab buttons (`useDashboardNavigation`), the grid doesn't fade while loading and URL params aren't kept. The hook uses `useSearchParams`, which is risky in `GamesAndEventsGridFallback`.
- [ ] On the news page, the mobile drawer shows the "Show filtered-out games starting soon" switch even though that page has no strip.
- [ ] The strip, mobile tab label and Can't-find hidden line now render only after mount, which avoids hydration mismatches (breakpoint cap, strip switch, stored filters). The grid itself still reads stored filters on its first render (pre-existing), so a visitor with custom filters may still get a hydration mismatch in the grid.
- [ ] `HiddenGamesPopover` is hand-built (no Radix popover dependency), so it has no focus management. Consider `@radix-ui/react-popover` if adding a dependency is OK.
