import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { LocalSeason } from "./types";
import { calculateSeasonDurations } from "./utils";

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
