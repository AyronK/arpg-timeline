import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { LocalSeason } from "./types";
import { calculateSeasonDurations, getRunningSeason } from "./utils";

const season = (name: string, start: string, end: string, endConfirmed = true) =>
    ({
        name,
        start: { startDate: start, confirmed: true },
        end: { endDate: end, confirmed: endConfirmed },
    }) as LocalSeason;

describe("calculateSeasonDurations", () => {
    beforeEach(() => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date("2026-10-12T00:00:00Z"));
    });
    afterEach(() => vi.useRealTimers());

    it("counts a season whose confirmed end has passed, with nothing after it yet", () => {
        expect(
            calculateSeasonDurations([
                season("Rapture", "2026-04-08T22:00:00Z", "2026-04-15T22:00:00Z"),
            ]),
        ).toEqual([{ name: "Rapture", duration: 7, startDate: "2026-04-08T22:00:00Z" }]);
    });

    it("counts a season once the next one has started", () => {
        const durations = calculateSeasonDurations([
            season("A", "2026-06-01T00:00:00Z", "2026-11-01T00:00:00Z"),
            season("B", "2026-09-01T00:00:00Z", "2026-12-01T00:00:00Z"),
        ]);
        expect(durations.map((d) => d.name)).toEqual(["A"]);
    });

    it("skips a running season", () => {
        expect(
            calculateSeasonDurations([season("A", "2026-09-01T00:00:00Z", "2026-12-01T00:00:00Z")]),
        ).toEqual([]);
    });
});

describe("getRunningSeason", () => {
    const now = new Date("2026-10-12T00:00:00Z");
    const data = (seasons: object[]) =>
        ({ seasons: seasons.map((x) => ({ game: "poe", ...x })) }) as Parameters<
            typeof getRunningSeason
        >[0];
    const entry = (name: string, start: string, end?: string, extra: object = {}) => ({
        name,
        start: { startDate: start, confirmed: true },
        end: end ? { endDate: end, confirmed: true } : null,
        ...extra,
    });

    it("returns the newest main season with its days so far", () => {
        expect(
            getRunningSeason(
                data([
                    entry("Old", "2026-05-01T00:00:00Z"),
                    entry("Current", "2026-09-12T00:00:00Z"),
                ]),
                "poe",
                now,
            ),
        ).toEqual({ name: "Current", daysSoFar: 30 });
    });

    it("ignores side events", () => {
        const result = getRunningSeason(
            data([
                entry("League", "2026-09-01T00:00:00Z"),
                entry("Event", "2026-10-01T00:00:00Z", undefined, { isSideEvent: true }),
            ]),
            "poe",
            now,
        );
        expect(result?.name).toBe("League");
    });

    it("returns null between seasons, once the newest has a confirmed past end", () => {
        expect(
            getRunningSeason(
                data([entry("Rapture", "2026-04-08T22:00:00Z", "2026-04-15T22:00:00Z")]),
                "poe",
                now,
            ),
        ).toBeNull();
    });
});
