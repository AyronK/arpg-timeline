import { describe, expect, it } from "vitest";

import { buildDayTicks, fitYearLabels, scaleCeiling, yearStarts } from "./lengthChart";

describe("buildDayTicks", () => {
    it("uses round steps up to the longest season", () => {
        expect(buildDayTicks(140)).toEqual([0, 50, 100, 150]);
        expect(buildDayTicks(70)).toEqual([0, 20, 40, 60, 80]);
        expect(buildDayTicks(365)).toEqual([0, 100, 200, 300, 400]);
    });

    it("keeps at least one step", () => {
        expect(buildDayTicks(0)).toEqual([0, 10]);
    });
});

describe("yearStarts", () => {
    it("marks the first season of each year", () => {
        expect(
            yearStarts([
                "2024-01-05T00:00:00Z",
                "2024-05-01T00:00:00Z",
                "2025-02-01T00:00:00Z",
                "2026-03-01T00:00:00Z",
            ]),
        ).toEqual([
            { index: 0, year: 2024 },
            { index: 2, year: 2025 },
            { index: 3, year: 2026 },
        ]);
    });
});

describe("fitYearLabels", () => {
    const years = [
        { index: 0, year: 2016 },
        { index: 3, year: 2017 },
        { index: 7, year: 2018 },
        { index: 10, year: 2019 },
    ];
    const pick = (labels: { year: number }[]) => labels.map((l) => l.year);

    it("keeps every year when there is room", () => {
        expect(pick(fitYearLabels(years, 20, 400, 32))).toEqual([2016, 2017, 2018, 2019]);
    });

    it("skips years whose labels would collide", () => {
        expect(pick(fitYearLabels(years, 8, 88, 32))).toEqual([2016, 2019]);
    });

    it("flips a label at the right edge and drops a newer one it would hit", () => {
        const labels = fitYearLabels(
            [
                { index: 0, year: 2024 },
                { index: 8, year: 2025 },
                { index: 9, year: 2026 },
            ],
            10,
            100,
            32,
        );
        expect(labels).toEqual([
            { index: 0, year: 2024, flip: false },
            { index: 8, year: 2025, flip: true },
        ]);
    });
});

describe("scaleCeiling", () => {
    it("ignores a far outlier", () => {
        expect(scaleCeiling([85, 90, 95, 100, 110, 120, 150, 318])).toBe(150);
    });

    it("keeps the max when nothing stands out", () => {
        expect(scaleCeiling([85, 90, 95, 100, 150])).toBe(150);
    });
});
