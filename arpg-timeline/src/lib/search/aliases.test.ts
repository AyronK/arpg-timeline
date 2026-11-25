import { describe, expect, it } from "vitest";

import { SEARCH_GAMES } from "./__fixtures__/searchGames";
import { deriveGameAliases, HARDCODED_ALIASES } from "./aliases";

const aliasesOf = (slug: string) =>
    deriveGameAliases(SEARCH_GAMES.find((game) => game.slug === slug)!);

describe("deriveGameAliases", () => {
    it("adds short name, slug, group and acronym", () => {
        expect(aliasesOf("path-of-exile2")).toEqual(["PoE2", "Path of Exile"]);
        expect(aliasesOf("torchlite-infinite")).toContain("torchlite-infinite");
        expect(aliasesOf("diablo-ii-resurrected")).toEqual(expect.arrayContaining(["D2", "d2r"]));
        expect(aliasesOf("diablo-iv")).toContain("D4");
    });

    it("leaves numeral variants out, since they count as the name", () => {
        expect(aliasesOf("diablo-iv")).not.toContain("diablo 4");
        expect(aliasesOf("path-of-exile2")).not.toContain("path of exile ii");
    });

    it("drops duplicates of the name and of each other", () => {
        expect(aliasesOf("grim-dawn")).toEqual(["gd"]);
        expect(aliasesOf("crystalfall")).toEqual([]);
    });

    it("includes hardcoded aliases", () => {
        expect(aliasesOf("path-of-exile")).toContain("poe1");
        expect(aliasesOf("torchlite-infinite")).toContain("tli");
    });
});

describe("HARDCODED_ALIASES", () => {
    it("only references real game slugs", () => {
        const slugs = new Set(SEARCH_GAMES.map((game) => game.slug));

        expect(Object.keys(HARDCODED_ALIASES).filter((slug) => !slugs.has(slug))).toEqual([]);
    });
});
