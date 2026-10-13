# 07: Dialog controls, reset and strip switch

Context: [SPEC](../SPEC.md) → Filter state wiring (reset); Strip off switch. User stories 27, 28, 32–34.

**What to build:** the Filters dialog (desktop) and drawer (mobile) gain:
- A **Reset to Featured preset** button. It clears the stored record and `?exclude=`, so the control returns to `Featured preset`. It is disabled when you're already on the preset.
- A **Show hidden games starting soon** switch, on by default and remembered on this device. The popover's **Hide this strip** sets the same preference. The preset control and mobile tab are never hidden by it.

**Blocked by:** 05.

**Status:** ready-for-agent

- [ ] Reset clears the stored filters and the `?exclude=` parameter, and the summary `state` becomes `preset`.
- [ ] The reset button is disabled when `state` is `preset`.
- [ ] Reset fires `filters_reset_to_featured`.
- [ ] The switch's preference is stored using the existing onboarding-storage helper pattern (localStorage, wrapped in try/catch).
- [ ] When storage is unavailable, the strip is shown.
- [ ] **Hide this strip** in the popover sets the same preference; the dialog switch shows it.
- [ ] Turning the strip off from either place fires `hidden_markers_disabled`.
- [ ] Both controls appear in the desktop dialog and the mobile drawer.
- [ ] Manual check: customize → reset → label is back to preset. Hide from the popover → reload → still hidden → turn back on from the dialog.
