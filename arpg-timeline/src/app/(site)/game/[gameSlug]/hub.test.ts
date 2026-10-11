import { describe, expect, it } from "vitest";

import { buildHubStatus, getActiveHubTab, getHubTabs } from "./hub";

const now = new Date("2026-10-11T12:00:00Z");
const fmt = (iso: string) => iso.slice(0, 10);

describe("getHubTabs", () => {
    it("includes Timeline and Stats for seasonal games", () => {
        const tabs = getHubTabs({ slug: "poe", categories: ["seasonal"] }, { hasGuides: true });
        expect(tabs.map((t) => t.id)).toEqual(["overview", "timeline", "news", "guides", "stats"]);
        expect(tabs.map((t) => t.href)).toEqual([
            "/game/poe",
            "/game/poe/timeline",
            "/game/poe/news",
            "/game/poe/resources",
            "/game/poe/stats",
        ]);
    });

    it("hides Timeline and Stats for non-seasonal and coming-soon games", () => {
        expect(getHubTabs({ slug: "x" }).map((t) => t.id)).toEqual(["overview", "news"]);
        expect(
            getHubTabs({ slug: "x", categories: ["seasonal"], isComingSoon: true }).map(
                (t) => t.id,
            ),
        ).toEqual(["overview", "news"]);
    });
});

describe("getHubTabs guides", () => {
    it("hides Guides without guide articles", () => {
        expect(getHubTabs({ slug: "poe", categories: ["seasonal"] }).map((t) => t.id)).toEqual([
            "overview",
            "timeline",
            "news",
            "stats",
        ]);
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
        ).toEqual(["No active season", "next season not announced yet"]);
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
