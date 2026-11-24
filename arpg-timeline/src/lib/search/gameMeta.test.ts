import { describe, expect, it } from "vitest";

import { formatGameMeta, getDatelessDescription, getSeasonDescription } from "./gameMeta";
import { SearchGame } from "./types";

const game = (overrides: Partial<SearchGame> = {}): SearchGame => ({
    slug: "path-of-exile2",
    name: "Path of Exile 2",
    shortName: "PoE2",
    group: "Path of Exile",
    logoSrc: null,
    categories: [],
    isDormant: false,
    isComingSoon: false,
    ...overrides,
});

describe("getDatelessDescription", () => {
    it("prefers coming soon, then dormant, and never shows the group", () => {
        expect(getDatelessDescription(game({ isComingSoon: true, isDormant: true }))).toBe(
            "Official • Coming soon",
        );
        expect(getDatelessDescription(game({ isDormant: true }))).toBe(
            "Official • No recent updates",
        );
        expect(getDatelessDescription(game())).toBe("Official");
    });

    it("marks community and official games in plain text", () => {
        expect(getDatelessDescription(game({ categories: ["community"] }))).toBe("Community");
        expect(getDatelessDescription(game({ categories: ["community"], isDormant: true }))).toBe(
            "Community • No recent updates",
        );
    });
});

describe("formatGameMeta", () => {
    it("appends the alias that drove the match", () => {
        expect(formatGameMeta(game(), "Coming soon", "PoE2")).toBe('Coming soon • matches "PoE2"');
        expect(formatGameMeta(game(), "", "PoE2")).toBe('matches "PoE2"');
    });

    it("hides a group alias and handles missing parts", () => {
        expect(formatGameMeta(game(), "", "Path of Exile")).toBe("");
        expect(formatGameMeta(game(), "Coming soon", null)).toBe("Coming soon");
        expect(formatGameMeta(game(), "", null)).toBe("");
    });
});

describe("getSeasonDescription", () => {
    it("keeps the origin label in front of the season text", () => {
        expect(getSeasonDescription(game(), "Season ends in 12 days")).toBe(
            "Official • Season ends in 12 days",
        );
        expect(getSeasonDescription(game({ categories: ["community"] }), "No seasons")).toBe(
            "Community • No seasons",
        );
    });
});
