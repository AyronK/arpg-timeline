import { describe, expect, it } from "vitest";

import { buildSeasonTerms } from "./seasonTerms";

describe("buildSeasonTerms", () => {
    it("derives every variant from a simple keyword", () => {
        expect(buildSeasonTerms("league")).toEqual({
            one: "league",
            many: "leagues",
            One: "League",
            Many: "Leagues",
        });
    });

    it("keeps the default 'season' keyword working", () => {
        expect(buildSeasonTerms("season")).toEqual({
            one: "season",
            many: "seasons",
            One: "Season",
            Many: "Seasons",
        });
    });

    it("naively pluralizes by appending 's' (no linguistic rules)", () => {
        expect(buildSeasonTerms("cycle").many).toBe("cycles");
        expect(buildSeasonTerms("chapter").many).toBe("chapters");
        // Known limitation: words ending in "s"/"y" are not special-cased.
        expect(buildSeasonTerms("series").many).toBe("seriess");
    });

    it.each([undefined, null, "", "   "])("falls back to 'season' for %j", (value) => {
        expect(buildSeasonTerms(value)).toEqual({
            one: "season",
            many: "seasons",
            One: "Season",
            Many: "Seasons",
        });
    });

    it("trims surrounding whitespace", () => {
        expect(buildSeasonTerms("  league  ")).toEqual({
            one: "league",
            many: "leagues",
            One: "League",
            Many: "Leagues",
        });
    });

    it("capitalizes only the first character, preserving the rest", () => {
        expect(buildSeasonTerms("mapDrop").One).toBe("MapDrop");
        expect(buildSeasonTerms("ARPG cycle").One).toBe("ARPG cycle");
    });
});
