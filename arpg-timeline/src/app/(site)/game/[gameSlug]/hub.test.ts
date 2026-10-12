import { describe, expect, it } from "vitest";

import { hasTimeline } from "./(hub)/timeline/timeline";
import {
    buildHubStatus,
    buildHubStatusLines,
    getActiveHubTab,
    getHubTabs,
    hasStatsTab,
} from "./hub";

const now = new Date("2026-10-11T12:00:00Z");
const fmt = (iso: string) => iso.slice(0, 10);

describe("getHubTabs", () => {
    it("shows optional tabs from flags", () => {
        const tabs = getHubTabs("poe", { hasTimeline: true, hasGuides: true, hasStats: true });
        expect(tabs.map((t) => t.id)).toEqual(["overview", "timeline", "news", "guides", "stats"]);
        expect(tabs.map((t) => t.href)).toEqual([
            "/game/poe",
            "/game/poe/timeline",
            "/game/poe/news",
            "/game/poe/resources",
            "/game/poe/stats",
        ]);
        expect(getHubTabs("x").map((t) => t.id)).toEqual(["overview", "news"]);
        expect(getHubTabs("x", { hasNews: false }).map((t) => t.id)).toEqual(["overview"]);
    });
});

describe("tab rules", () => {
    it("gives released games a timeline once they have two entries", () => {
        expect(hasTimeline({ categories: ["seasonal"] }, 0)).toBe(true);
        expect(hasTimeline({}, 2)).toBe(true);
        expect(hasTimeline({}, 1)).toBe(false);
        expect(hasTimeline({ categories: ["seasonal"], isComingSoon: true }, 5)).toBe(false);
    });

    it("gives Stats to seasonal games with enough history and released Steam games", () => {
        expect(hasStatsTab({ categories: ["seasonal"] }, false, 3)).toBe(true);
        expect(hasStatsTab({ categories: ["seasonal"] }, false, 2)).toBe(false);
        expect(hasStatsTab({ categories: ["seasonal"] }, true, 1)).toBe(true);
        expect(hasStatsTab({}, true, 0)).toBe(true);
        expect(hasStatsTab({}, false, 0)).toBe(false);
        expect(hasStatsTab({ isComingSoon: true }, true, 0)).toBe(false);
    });
});

describe("getActiveHubTab", () => {
    it("maps route segments to tabs", () => {
        expect(getActiveHubTab(null)).toBe("overview");
        expect(getActiveHubTab("__PAGE__")).toBe("overview");
        expect(getActiveHubTab("timeline")).toBe("timeline");
        expect(getActiveHubTab("news")).toBe("news");
        expect(getActiveHubTab("resources")).toBe("guides");
        expect(getActiveHubTab("stats")).toBe("stats");
    });
});

describe("buildHubStatus", () => {
    const current = {
        _id: "s1",
        name: "Curse of the Allflame",
        start: { startDate: "2026-07-24T20:00:00Z", confirmed: true },
        end: { endDate: "2026-11-19T20:00:00Z", confirmed: false },
    };
    const placeholderNext = {
        _id: "s1",
        name: "Next league",
        start: { startDate: "2026-11-19T20:00:00Z", confirmed: false },
    };

    it("hides days left for an unconfirmed end", () => {
        expect(
            buildHubStatus(
                { seasonKeyword: "league", currentSeason: current, nextSeason: placeholderNext },
                now,
                fmt,
            ),
        ).toEqual(["Curse of the Allflame", "next league not announced yet"]);
    });

    it("shows days left for a confirmed end", () => {
        expect(
            buildHubStatus(
                {
                    seasonKeyword: "league",
                    currentSeason: { ...current, end: { ...current.end, confirmed: true } },
                    nextSeason: placeholderNext,
                },
                now,
                fmt,
            ),
        ).toEqual(["Curse of the Allflame", "39 days left", "next league not announced yet"]);
    });

    it("shows a confirmed next start and treats it as the current end", () => {
        expect(
            buildHubStatus(
                {
                    seasonKeyword: "league",
                    currentSeason: current,
                    nextSeason: {
                        _id: "s2",
                        name: "3.30 Fate",
                        start: { startDate: "2026-11-19T20:00:00Z", confirmed: true },
                    },
                },
                now,
                fmt,
            ),
        ).toEqual(["Curse of the Allflame", "39 days left", "3.30 Fate starts 2026-11-19"]);
    });

    it("groups current and next into separate lines", () => {
        expect(
            buildHubStatusLines(
                {
                    seasonKeyword: "league",
                    currentSeason: current,
                    nextSeason: {
                        _id: "s2",
                        name: "3.30 Fate",
                        start: { startDate: "2026-11-19T20:00:00Z", confirmed: true },
                    },
                },
                now,
                fmt,
            ),
        ).toEqual([["Curse of the Allflame", "39 days left"], ["3.30 Fate starts 2026-11-19"]]);
    });

    it("shows an announced next season without a date", () => {
        expect(
            buildHubStatus(
                {
                    seasonKeyword: "season",
                    currentSeason: current,
                    nextSeason: {
                        _id: "s2",
                        name: "Season 12",
                        start: { startDate: "2026-12-01T00:00:00Z", confirmed: false },
                    },
                },
                now,
                fmt,
            ),
        ).toEqual(["Curse of the Allflame", "Season 12: date not announced"]);
    });

    it("uses editor-written start text for an unconfirmed next season", () => {
        const withText = (overrideText: string) =>
            buildHubStatus(
                {
                    seasonKeyword: "season",
                    currentSeason: current,
                    nextSeason: {
                        _id: "s2",
                        name: "Season 12",
                        start: { startDate: null, confirmed: false, overrideText },
                    },
                },
                now,
                fmt,
            );
        expect(withText("Q4 2026")).toEqual(["Curse of the Allflame", "Season 12: Q4 2026"]);
        expect(withText("To be announced")).toEqual([
            "Curse of the Allflame",
            "Season 12: date not announced",
        ]);
    });

    it("handles dormant and coming-soon games", () => {
        expect(
            buildHubStatus(
                {
                    seasonKeyword: "season",
                    isDormant: true,
                    currentSeason: current,
                    nextSeason: placeholderNext,
                },
                now,
                fmt,
            ),
        ).toEqual(["No recent updates", "last update Jul 2026"]);
        expect(
            buildHubStatus(
                {
                    seasonKeyword: "season",
                    isComingSoon: true,
                    nextSeason: {
                        _id: "r",
                        name: "Release",
                        start: { startDate: "2027-02-01T00:00:00Z", confirmed: true },
                    },
                },
                now,
                fmt,
            ),
        ).toEqual(["Release starts 2027-02-01"]);
    });
});
