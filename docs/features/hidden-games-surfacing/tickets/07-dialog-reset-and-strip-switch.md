# 07: Dialog controls, reset and strip switch

Context: [SPEC](../SPEC.md) → Filter state wiring (reset); Strip off switch. User stories 27, 28, 32–34.

**What to build:** the Filters dialog (desktop) and drawer (mobile) gain:
- A **Reset to Featured preset** button. It clears the stored record and `?exclude=`, so the control returns to `Featured preset`. It is disabled when you're already on the preset.
- A **Show hidden games starting soon** switch, on by default and remembered on this device. The popover's **Hide this strip** sets the same preference. The preset control and mobile tab are never hidden by it.

**Blocked by:** 05.

**Status:** done

- [x] Reset clears the stored filters and the `?exclude=` parameter, and the summary `state` becomes `preset`.
- [x] The reset button is disabled when `state` is `preset`.
- [x] Reset fires `filters_reset_to_featured`.
- [x] The switch's preference is stored using the existing onboarding-storage helper pattern (localStorage, wrapped in try/catch).
- [x] When storage is unavailable, the strip is shown.
- [x] **Hide this strip** in the popover sets the same preference; the dialog switch shows it.
- [x] Turning the strip off from either place fires `hidden_markers_disabled`.
- [x] Both controls appear in the desktop dialog and the mobile drawer.
- [ ] Manual check: customize → reset → label is back to preset. Hide from the popover → reload → still hidden → turn back on from the dialog.
