import { describe, expect, it } from "vitest";

import { buildSeasonTerms } from "@/lib/seasonTerms";

import {
    buildTimelineDescription,
    buildTimelineKeywords,
    buildTimelineTitle,
    TimelineMetaInput,
} from "./metadata";

const input = (overrides: Partial<TimelineMetaInput> = {}): TimelineMetaInput => ({
    gameName: "Test Game",
    shortName: "TG",
    terms: buildSeasonTerms("season"),
    currentName: "Season 32",
    next: { name: "Season 33", label: "Oct 17, 2026" },
    count: 32,
    firstYear: 2016,
    ...overrides,
});

describe("buildTimelineTitle", () => {
    it("targets history and dates keywords", () => {
        expect(buildTimelineTitle(input())).toBe(
            "Test Game Seasons: History, Dates & Timeline | aRPG Timeline",
        );
    });

    it("falls back to a shorter title for long game names", () => {
        const title = buildTimelineTitle(input({ gameName: "A Very Long Game Name Indeed Here" }));
        expect(title).toBe("A Very Long Game Name Indeed Here Season Timeline | aRPG Timeline");
    });
});

describe("buildTimelineDescription", () => {
    it("mentions current, next and archive", () => {
        const description = buildTimelineDescription(input());
        expect(description).toContain("current season (Season 32)");
        expect(description).toContain("next season start date (Oct 17, 2026)");
        expect(description).toContain("32 seasons since 2016");
        expect(description.length).toBeLessThanOrEqual(160);
    });

    it("omits missing parts", () => {
        const description = buildTimelineDescription(input({ currentName: null, next: null }));
        expect(description).not.toContain("current");
        expect(description).not.toContain("next");
        expect(description).toContain("32 seasons since 2016");
    });

    it("stays within 160 characters for long names", () => {
        const description = buildTimelineDescription(
            input({ gameName: "A Really Quite Long Game Name Of Great Length" }),
        );
        expect(description.length).toBeLessThanOrEqual(160);
    });

    it("uses the game's season keyword", () => {
        const description = buildTimelineDescription(
            input({ terms: buildSeasonTerms("league"), count: 5 }),
        );
        expect(description).toContain("5 leagues since 2016");
    });
});

describe("buildTimelineKeywords", () => {
    it("covers current and archival searches for name and short name", () => {
        const keywords = buildTimelineKeywords(input());
        expect(keywords).toContain("Test Game seasons");
        expect(keywords).toContain("Test Game past seasons");
        expect(keywords).toContain("Test Game current season");
        expect(keywords).toContain("TG season history");
    });

    it("skips a short name identical to the name", () => {
        const keywords = buildTimelineKeywords(input({ shortName: "Test Game" }));
        expect(new Set(keywords).size).toBe(keywords.length);
    });
});
