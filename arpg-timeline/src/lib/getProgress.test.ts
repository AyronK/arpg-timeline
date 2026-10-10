import { describe, expect, it } from "vitest";

import { getProgressTooltipText } from "./getProgress";

const START = "2026-01-01T00:00:00.000Z";
const at = (iso: string) => new Date(iso);
const daysAfterStart = (days: number) => new Date(Date.parse(START) + days * 24 * 60 * 60 * 1000);

describe("getProgressTooltipText", () => {
    it("returns null without an end date", () => {
        expect(
            getProgressTooltipText(START, null, true, "season", at("2026-01-10T00:00:00Z")),
        ).toBeNull();
    });

    it("returns null without a start date", () => {
        expect(getProgressTooltipText(null, "2026-04-11T00:00:00Z", true, "season")).toBeNull();
    });

    it("shows months left early in a long season", () => {
        // 100-day season, 3 days in
        expect(
            getProgressTooltipText(
                START,
                "2026-04-11T00:00:00.000Z",
                true,
                "season",
                daysAfterStart(3),
            ),
        ).toBe("Just started – about 3 months left");
    });

    it("shows weeks left", () => {
        expect(
            getProgressTooltipText(
                START,
                "2026-04-11T00:00:00.000Z",
                true,
                "season",
                daysAfterStart(79),
            ),
        ).toBe("Late in the season – about 3 weeks left");
    });

    it("shows days left", () => {
        expect(
            getProgressTooltipText(
                START,
                "2026-04-11T00:00:00.000Z",
                true,
                "season",
                daysAfterStart(95),
            ),
        ).toBe("Ending soon – 5 days left");
    });

    it("rounds days down", () => {
        expect(
            getProgressTooltipText(
                START,
                "2026-04-11T00:00:00.000Z",
                true,
                "season",
                at("2026-03-29T04:00:00.000Z"),
            ),
        ).toBe("Ending soon – 12 days left");
    });

    it("uses singular units", () => {
        expect(
            getProgressTooltipText(
                START,
                "2026-04-11T00:00:00.000Z",
                true,
                "season",
                daysAfterStart(99),
            ),
        ).toBe("Ending soon – 1 day left");
    });

    it("shows hours left on the last day", () => {
        expect(
            getProgressTooltipText(
                START,
                "2026-04-11T00:00:00.000Z",
                true,
                "season",
                at("2026-04-10T19:00:00.000Z"),
            ),
        ).toBe("Ending soon – about 5 hours left");
    });

    it("shows less than an hour left", () => {
        expect(
            getProgressTooltipText(
                START,
                "2026-04-11T00:00:00.000Z",
                true,
                "season",
                at("2026-04-10T23:59:00.000Z"),
            ),
        ).toBe("Ending soon – less than an hour left");
    });

    it("omits time left when end is not confirmed", () => {
        expect(
            getProgressTooltipText(
                START,
                "2026-04-11T00:00:00.000Z",
                false,
                "season",
                daysAfterStart(79),
            ),
        ).toBe("Late in the season – end date not announced");
    });

    it("treats null confirmation as estimated", () => {
        expect(
            getProgressTooltipText(
                START,
                "2026-04-11T00:00:00.000Z",
                null,
                "season",
                daysAfterStart(79),
            ),
        ).toBe("Late in the season – end date not announced");
    });

    it("reports a confirmed season that has ended", () => {
        expect(
            getProgressTooltipText(
                START,
                "2026-04-11T00:00:00.000Z",
                true,
                "season",
                daysAfterStart(120),
            ),
        ).toBe("The season has ended");
    });

    it("never says ending soon for an estimated end", () => {
        expect(
            getProgressTooltipText(
                START,
                "2026-04-11T00:00:00.000Z",
                false,
                "season",
                daysAfterStart(95),
            ),
        ).toBe("Late in the season – end date not announced");
    });

    it("stays late, not ending soon, past an estimated end", () => {
        expect(
            getProgressTooltipText(
                START,
                "2026-04-11T00:00:00.000Z",
                false,
                "season",
                daysAfterStart(120),
            ),
        ).toBe("Late in the season – end date not announced");
    });

    it("uses the game's season keyword", () => {
        expect(
            getProgressTooltipText(
                START,
                "2026-04-11T00:00:00.000Z",
                false,
                "league",
                daysAfterStart(79),
            ),
        ).toBe("Late in the league – end date not announced");
        expect(
            getProgressTooltipText(
                START,
                "2026-04-11T00:00:00.000Z",
                true,
                "league",
                daysAfterStart(120),
            ),
        ).toBe("The league has ended");
    });

    it("describes early and midway phases", () => {
        expect(
            getProgressTooltipText(
                START,
                "2026-04-11T00:00:00.000Z",
                true,
                "league",
                daysAfterStart(10),
            ),
        ).toBe("Early in the league – about 3 months left");
        expect(
            getProgressTooltipText(
                START,
                "2026-04-11T00:00:00.000Z",
                true,
                "league",
                daysAfterStart(30),
            ),
        ).toBe("Midway through the league – about 2 months left");
    });

    it("treats a not-yet-started season as just started", () => {
        expect(
            getProgressTooltipText(
                START,
                "2026-04-11T00:00:00.000Z",
                true,
                "season",
                at("2025-12-31T00:00:00.000Z"),
            ),
        ).toBe("Just started – about 3 months left");
    });
});
