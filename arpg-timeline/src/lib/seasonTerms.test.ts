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

    it("pluralizes common keyword endings", () => {
        expect(buildSeasonTerms("cycle").many).toBe("cycles");
        expect(buildSeasonTerms("chapter").many).toBe("chapters");
        expect(buildSeasonTerms("patch").many).toBe("patches");
        expect(buildSeasonTerms("series").many).toBe("series");
        expect(buildSeasonTerms("story").many).toBe("stories");
        expect(buildSeasonTerms("Content update").many).toBe("content updates");
        expect(buildSeasonTerms("Content update").Many).toBe("Content updates");
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

    it("lowercases the keyword and capitalizes only the first character", () => {
        expect(buildSeasonTerms("Ladder Reset").one).toBe("ladder reset");
        expect(buildSeasonTerms("Ladder Reset").One).toBe("Ladder reset");
    });
});
