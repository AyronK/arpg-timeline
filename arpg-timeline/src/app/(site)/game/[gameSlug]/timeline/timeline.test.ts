import { describe, expect, it } from "vitest";

import { SanitySeason } from "@/lib/cms/queries/indexQuery";

import { buildTimelineEntries, formatApproxMonths, groupByYear } from "./timeline";

const NOW = new Date("2026-03-01T00:00:00.000Z");
const GAME = "test-game";

const season = (
    id: string,
    start: string | null,
    extra: Partial<SanitySeason> = {},
): SanitySeason => ({
    _id: id,
    _updatedAt: "2026-01-01T00:00:00Z",
    _createdAt: "2026-01-01T00:00:00Z",
    name: `Season ${id}`,
    game: GAME,
    start: start ? { startDate: start, confirmed: true } : { confirmed: false },
    ...extra,
});

describe("formatApproxMonths", () => {
    it.each([
        [5, "<1 month"],
        [19, "<1 month"],
        [20, "~1 month"],
        [91, "~3 months"],
        [180, "~6 months"],
    ])("%i days -> %s", (days, expected) => {
        expect(formatApproxMonths(days)).toBe(expected);
    });
});

describe("buildTimelineEntries", () => {
    it("sorts newest first and ignores other games", () => {
        const entries = buildTimelineEntries(
            [
                season("a", "2025-01-01T00:00:00Z"),
                season("b", "2025-06-01T00:00:00Z"),
                { ...season("c", "2025-09-01T00:00:00Z"), game: "other" },
            ],
            GAME,
            NOW,
        );
        expect(entries.map((e) => e.id)).toEqual(["b", "a"]);
    });

    it("marks the newest started season live and computes past durations from next start", () => {
        const entries = buildTimelineEntries(
            [
                season("a", "2025-01-01T00:00:00Z"),
                season("b", "2025-04-01T00:00:00Z"),
                season("c", "2026-02-01T00:00:00Z"),
            ],
            GAME,
            NOW,
        );
        expect(entries.map((e) => e.status)).toEqual(["live", "past", "past"]);
        expect(entries[0]!.durationDays).toBeNull();
        expect(entries[2]!.durationDays).toBe(90);
    });

    it("prefers confirmed end date for duration", () => {
        const entries = buildTimelineEntries(
            [
                season("a", "2025-01-01T00:00:00Z", {
                    end: { endDate: "2025-01-31T00:00:00Z", confirmed: true },
                }),
                season("b", "2026-02-01T00:00:00Z"),
            ],
            GAME,
            NOW,
        );
        expect(entries[1]!.durationDays).toBe(30);
    });

    it("treats future and unconfirmed seasons as upcoming, with TBA / override labels", () => {
        const entries = buildTimelineEntries(
            [
                season("a", "2026-02-01T00:00:00Z"),
                season("b", "2026-06-01T00:00:00Z"),
                season("c", null),
                season("d", null, { start: { confirmed: false, overrideText: "Summer 2026" } }),
            ],
            GAME,
            NOW,
        );
        expect(entries.filter((e) => e.status === "upcoming").map((e) => e.startLabel)).toEqual([
            "TBA",
            "Summer 2026",
            "Jun 2026",
        ]);
        expect(entries.at(-1)!.status).toBe("live");
    });

    it("places unconfirmed seasons by their estimated date, labelled as estimates", () => {
        const entries = buildTimelineEntries(
            [
                season("a", "2026-06-01T00:00:00Z", {
                    start: { startDate: "2026-06-01T00:00:00Z", confirmed: false },
                }),
                season("b", "2026-09-01T00:00:00Z", {
                    start: { startDate: "2026-09-01T00:00:00Z", confirmed: false },
                }),
                season("c", "2026-02-01T00:00:00Z"),
            ],
            GAME,
            NOW,
        );
        expect(entries.map((e) => e.id)).toEqual(["b", "a", "c"]);
        expect(entries.map((e) => e.status)).toEqual(["upcoming", "upcoming", "live"]);
        expect(entries[0]!.startLabel).toBe("Sep 2026 (est.)");
    });

    it("treats an unconfirmed old season as past, placed by its date", () => {
        const entries = buildTimelineEntries(
            [
                season("old", "2018-01-01T00:00:00Z", {
                    start: { startDate: "2018-01-01T00:00:00Z", confirmed: false },
                }),
                season("a", "2025-01-01T00:00:00Z"),
                season("b", "2026-02-01T00:00:00Z"),
            ],
            GAME,
            NOW,
        );
        expect(entries.map((e) => e.id)).toEqual(["b", "a", "old"]);
        expect(entries[2]!.status).toBe("past");
        expect(entries[2]!.startLabel).toBe("Jan 2018 (est.)");
        expect(groupByYear(entries).map((g) => g.label)).toEqual(["2026", "2025", "2018"]);
    });

    it("keeps side events out of the live/duration chain", () => {
        const entries = buildTimelineEntries(
            [
                season("a", "2025-01-01T00:00:00Z"),
                season("side", "2025-02-01T00:00:00Z", {
                    isSideEvent: true,
                    end: { endDate: "2025-02-15T00:00:00Z", confirmed: true },
                }),
                season("b", "2025-04-01T00:00:00Z"),
            ],
            GAME,
            NOW,
        );
        const byId = Object.fromEntries(entries.map((e) => [e.id, e]));
        expect(byId.b!.status).toBe("live");
        expect(byId.a!.durationDays).toBe(90);
        expect(byId.side!.status).toBe("past");
        expect(byId.side!.isSideEvent).toBe(true);
        expect(byId.side!.durationDays).toBe(14);
    });

    it("leaves a side event without an end date with no duration", () => {
        const entries = buildTimelineEntries(
            [season("side", "2025-02-01T00:00:00Z", { isSideEvent: true })],
            GAME,
            NOW,
        );
        expect(entries[0]!.status).toBe("past");
        expect(entries[0]!.durationDays).toBeNull();
    });

    it("formats start as short month + year in UTC", () => {
        const entries = buildTimelineEntries([season("a", "2025-12-31T23:00:00Z")], GAME, NOW);
        expect(entries[0]!.startLabel).toBe("Dec 2025");
    });
});

describe("groupByYear", () => {
    it("puts upcoming first, then groups by UTC year", () => {
        const entries = buildTimelineEntries(
            [
                season("a", "2024-05-01T00:00:00Z"),
                season("b", "2025-01-10T00:00:00Z"),
                season("c", "2025-08-01T00:00:00Z"),
                season("d", "2026-06-01T00:00:00Z"),
                season("e", null),
            ],
            GAME,
            NOW,
        );
        const groups = groupByYear(entries);
        expect(groups.map((g) => g.label)).toEqual(["Next", "2025", "2024"]);
        expect(groups[0]!.entries.map((e) => e.id)).toEqual(["e", "d"]);
        expect(groups[1]!.entries.map((e) => e.id)).toEqual(["c", "b"]);
    });

    it("returns no groups for no entries", () => {
        expect(groupByYear([])).toEqual([]);
    });
});
