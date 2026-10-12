import { describe, expect, it } from "vitest";

import { buildSeasonTerms } from "@/lib/seasonTerms";

import {
    buildCadenceHint,
    buildLengthTile,
    buildPerYearTile,
    feedSource,
    formatApproxLength,
    formatDateRange,
    formatSeasonRow,
    mergeLatest,
    pickStatusLayout,
} from "./overview";
import type { GameStatistics } from "./types";

const terms = buildSeasonTerms("league");

const stats: GameStatistics = {
    averagePerYear: "3.40",
    usualStartTime: "2026-01-01T20:00:00.000Z",
    confirmedStartDates: [],
    averageDurationDays: 108,
    maxDuration: { days: 319, name: "Long" },
    minDuration: { days: 81, name: "Short" },
    medianDuration: 96,
    durationStdDev: 36,
};

describe("rhythm tiles", () => {
    it("formats approximate lengths", () => {
        expect(formatApproxLength(108)).toBe("~3.5 months");
        expect(formatApproxLength(21)).toBe("~3 weeks");
        expect(formatApproxLength(10)).toBe("~1 week");
        expect(formatApproxLength(2)).toBe("~1 week");
    });

    it("builds the length tile with a clamped typical range", () => {
        expect(buildLengthTile(stats, terms)).toEqual({
            value: "~3.5 months",
            text: "per league on average (108 days). Most ran between 81 and 144 days.",
        });
        expect(buildLengthTile({ ...stats, averageDurationDays: null }, terms)).toBeNull();
    });

    it("names the count instead of 'most' for recent seasons", () => {
        expect(buildLengthTile(stats, terms, 3)?.text).toBe(
            "per league on average (108 days). The last 3 ran 81 to 319 days.",
        );
        const flat = {
            ...stats,
            minDuration: { days: 90, name: "A" },
            maxDuration: { days: 90, name: "B" },
        };
        expect(buildLengthTile(flat, terms, 3)?.text).toBe("per league on average (108 days).");
    });

    it("builds the per-year tile", () => {
        expect(buildPerYearTile(stats, terms)).toEqual({
            value: "3-4 a year",
            text: "new leagues on average.",
        });
        expect(buildPerYearTile({ ...stats, averagePerYear: "N/A" }, terms)).toBeNull();
    });
});

describe("mergeLatest", () => {
    it("merges feed and articles by date with source labels", () => {
        const items = mergeLatest(
            [
                {
                    id: "f1",
                    title: "Steam post",
                    link: "https://s/1",
                    pub_date: "2026-10-01T00:00:00Z",
                    steam_app_id: 238960,
                },
                {
                    id: "f2",
                    title: "Blizzard post",
                    link: "https://b/2",
                    pub_date: "2026-09-20T00:00:00Z",
                    steam_app_id: null,
                },
            ],
            [
                {
                    _id: "a1",
                    title: "Our guide",
                    slug: "guide",
                    category: "news",
                    publishedAt: "2026-09-25T00:00:00Z",
                },
            ],
            "poe",
            2,
            new Date("2026-12-01T00:00:00Z"),
        );
        expect(items.map((i) => [i.title, i.source, i.href, i.external])).toEqual([
            ["Steam post", "Steam", "https://s/1", true],
            ["Our guide", "aRPG Timeline", "/game/poe/news/guide", false],
        ]);
    });
});

describe("mergeLatest pinning", () => {
    const feed = [
        {
            id: "f1",
            title: "Steam post",
            link: "https://s/1",
            pub_date: "2026-10-10T00:00:00Z",
            steam_app_id: 1,
        },
        {
            id: "f2",
            title: "Older post",
            link: "https://s/2",
            pub_date: "2026-10-05T00:00:00Z",
            steam_app_id: 1,
        },
    ];
    const articles = [
        {
            _id: "a1",
            title: "Our guide",
            slug: "guide",
            category: "news" as const,
            publishedAt: "2026-09-25T00:00:00Z",
        },
    ];

    it("pins our newest article while it is under 60 days old", () => {
        const items = mergeLatest(feed, articles, "poe", 2, new Date("2026-10-12T00:00:00Z"));
        expect(items.map((i) => i.title)).toEqual(["Our guide", "Steam post"]);
    });

    it("falls back to date order once the article is older", () => {
        const items = mergeLatest(feed, articles, "poe", 2, new Date("2026-12-01T00:00:00Z"));
        expect(items.map((i) => i.title)).toEqual(["Steam post", "Older post"]);
    });
});

describe("season rows", () => {
    it("formats date ranges within and across years", () => {
        expect(
            formatDateRange(new Date("2026-03-06T20:00:00Z"), new Date("2026-07-20T20:00:00Z")),
        ).toBe("Mar 6 - Jul 20, 2026");
        expect(
            formatDateRange(new Date("2025-10-31T20:00:00Z"), new Date("2026-03-02T20:00:00Z")),
        ).toBe("Oct 31, 2025 - Mar 2, 2026");
    });

    it("adds the length when known", () => {
        expect(
            formatSeasonRow({
                startDate: new Date("2026-03-06T20:00:00Z"),
                endDate: new Date("2026-07-20T20:00:00Z"),
                duration: 137,
            }),
        ).toBe("Mar 6 - Jul 20, 2026 · 137 days");
        expect(
            formatSeasonRow({
                startDate: new Date("2026-03-06T20:00:00Z"),
                endDate: null,
                duration: null,
            }),
        ).toBe("Mar 6, 2026");
    });
});

describe("buildCadenceHint", () => {
    const base = {
        currentStart: "2026-07-24T20:00:00Z",
        medianDays: 108,
        trackedCount: 40,
        terms,
    };

    it("gives a part-of-month hint from the median length", () => {
        expect(buildCadenceHint({ ...base, now: new Date("2026-10-01T00:00:00Z") })).toBe(
            "If it follows past leagues, expect it around early November.",
        );
    });

    it("adds the year when it differs", () => {
        expect(
            buildCadenceHint({
                ...base,
                currentStart: "2026-11-20T00:00:00Z",
                now: new Date("2026-12-01T00:00:00Z"),
            }),
        ).toBe("If it follows past leagues, expect it around early March 2027.");
    });

    it("switches to longer than usual inside the announcement lead time", () => {
        // Estimate Nov 9 is under three weeks away with nothing announced
        expect(buildCadenceHint({ ...base, now: new Date("2026-10-20T00:00:00Z") })).toBe(
            "Likely later than usual. Past leagues were usually announced by now.",
        );
        expect(buildCadenceHint({ ...base, now: new Date("2026-11-20T00:00:00Z") })).toBe(
            "Likely later than usual. Past leagues were usually announced by now.",
        );
    });

    it("needs enough history", () => {
        expect(
            buildCadenceHint({ ...base, trackedCount: 2, now: new Date("2026-10-12T00:00:00Z") }),
        ).toBeNull();
        expect(
            buildCadenceHint({ ...base, medianDays: null, now: new Date("2026-10-12T00:00:00Z") }),
        ).toBeNull();
    });
});

describe("feedSource", () => {
    it("labels Steam items and falls back to Official", () => {
        expect(feedSource(238960)).toBe("Steam");
        expect(feedSource(null)).toBe("Official");
    });
});

describe("pickStatusLayout", () => {
    const current = { _id: "s1" };
    const announced = { _id: "s2" };
    const placeholder = { _id: "s1" };

    it("gives seasonal and timeline games Now + Next", () => {
        expect(pickStatusLayout({ currentSeason: current, nextSeason: placeholder }, true)).toBe(
            "now-next",
        );
    });

    it("gives dormant games Now + Next even without history", () => {
        expect(pickStatusLayout({ isDormant: true, currentSeason: current }, false)).toBe(
            "now-next",
        );
    });

    it("uses the pre-launch pair for coming-soon games", () => {
        expect(pickStatusLayout({ isComingSoon: true, nextSeason: announced }, false)).toBe(
            "prelaunch",
        );
    });

    it("uses the pre-launch pair when the only entry is an announced upcoming one", () => {
        expect(pickStatusLayout({ nextSeason: announced }, false)).toBe("prelaunch");
    });

    it("shows nothing for a game with too little history and nothing announced", () => {
        expect(pickStatusLayout({ currentSeason: current, nextSeason: placeholder }, false)).toBe(
            null,
        );
    });
});
