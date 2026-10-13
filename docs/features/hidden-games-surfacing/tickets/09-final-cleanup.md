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
