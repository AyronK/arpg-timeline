import { describe, expect, it } from "vitest";

import { SEARCH_GAMES } from "./__fixtures__/searchGames";
import { toGameCandidate } from "./aliases";
import { getHighlight, prepareCandidates, searchCandidates } from "./match";

const games = prepareCandidates(SEARCH_GAMES.map(toGameCandidate));

const slugsFor = (query: string) => searchCandidates(games, query).map((m) => m.item.slug);
const topSlug = (query: string) => slugsFor(query)[0];

const named = (...names: string[]) =>
    prepareCandidates(names.map((name) => ({ item: name, name, aliases: [] })));

describe("searchCandidates on real games", () => {
    it.each([
        ["poe2", "path-of-exile2"],
        ["poe 2", "path-of-exile2"],
        ["PoE", "path-of-exile"],
        ["poe1", "path-of-exile"],
        ["d4", "diablo-iv"],
        ["diablo 4", "diablo-iv"],
        ["diablo iv", "diablo-iv"],
        ["d2r", "diablo-ii-resurrected"],
        ["grimdawn", "grim-dawn"],
        ["grim dawn", "grim-dawn"],
        ["grimdwn", "grim-dawn"],
        ["lastepoch", "last-epoch"],
        ["le", "last-epoch"],
        ["tli", "torchlite-infinite"],
        ["torchlight", "torchlite-infinite"],
        ["slorm", "the-slormancer"],
        ["epo", "last-epoch"],
        ["lsst epoch", "last-epoch"],
        ["diablp iv", "diablo-iv"],
        ["pd2", "pd2"],
    ])("%s finds %s first", (query, slug) => {
        expect(topSlug(query)).toBe(slug);
    });

    it("finds games by a word inside the name", () => {
        expect(slugsFor("exile")).toEqual(
            expect.arrayContaining([
                "path-of-exile",
                "path-of-exile2",
                "zizaran-s-path-of-exile-gauntlet",
            ]),
        );
    });

    it("reports the alias that drove the match", () => {
        const [match] = searchCandidates(games, "poe2");

        expect(match!.matchedAlias).toBe("PoE2");
        expect(searchCandidates(games, "grim")[0]!.matchedAlias).toBeNull();
    });

    it("treats numeral spellings as the name, not an alias", () => {
        expect(searchCandidates(games, "titan quest 2")[0]!.matchedAlias).toBeNull();
        expect(searchCandidates(games, "diablo 4")[0]!.matchedAlias).toBeNull();
    });

    it("does not reach unrelated games through scattered letters", () => {
        expect(slugsFor("poe2")).not.toContain("pd2");
        expect(slugsFor("poe")).not.toContain("pd2");
    });

    it("keeps one and two letter queries to name prefixes and abbreviations", () => {
        expect(slugsFor("le")).toEqual(["last-epoch"]);
        expect(slugsFor("po")).toEqual([
            "path-of-diablo",
            "path-of-exile",
            "path-of-exile2",
            "path-of-terraria",
        ]);
    });

    it("returns nothing for an empty or punctuation-only query", () => {
        expect(searchCandidates(games, "")).toEqual([]);
        expect(searchCandidates(games, " :: ")).toEqual([]);
    });

    it("returns nothing for gibberish", () => {
        expect(slugsFor("qqzzx")).toEqual([]);
    });
});

describe("ranking", () => {
    it("orders exact, prefix, word prefix, substring, subsequence, typo", () => {
        const candidates = named("Xdawnx", "Dxaxwxn", "Dawnfall", "Dawm", "Grim Dawn", "Dawn");

        expect(searchCandidates(candidates, "dawn").map((m) => m.item)).toEqual([
            "Dawn",
            "Dawnfall",
            "Grim Dawn",
            "Xdawnx",
            "Dxaxwxn",
            "Dawm",
        ]);
    });

    it("ranks a name match above the same match on an alias", () => {
        const candidates = prepareCandidates([
            { item: "alias", name: "Zeta", aliases: ["Hero"] },
            { item: "name", name: "Hero", aliases: [] },
        ]);

        expect(searchCandidates(candidates, "hero").map((m) => m.item)).toEqual(["name", "alias"]);
    });

    it("breaks ties by priority, then alphabetically", () => {
        const candidates = named("Dawn B", "Dawn C", "Dawn A");

        expect(
            searchCandidates(candidates, "dawn", (item) => (item === "Dawn C" ? 1 : 0)).map(
                (m) => m.item,
            ),
        ).toEqual(["Dawn C", "Dawn A", "Dawn B"]);
    });

    it("skips subsequence for short queries and typos for queries under 4 chars", () => {
        expect(searchCandidates(named("Dxaxwxn"), "dw")).toEqual([]);
        expect(searchCandidates(named("Dwa"), "daw")).toEqual([]);
        expect(searchCandidates(named("Xdawn", "Grim Dawn"), "da")).toEqual([]);
    });
});

describe("getHighlight", () => {
    it("highlights the contiguous match in the original name", () => {
        expect(getHighlight("Diablo II: Resurrected", "resur")).toEqual([11, 16]);
        expect(getHighlight("Path of Exile 2", "of ex")).toEqual([5, 10]);
    });

    it("prefers a word start over an earlier inner match", () => {
        expect(getHighlight("Ravenswatch Watch", "watch")).toEqual([12, 17]);
    });

    it("highlights across punctuation when the query is squashed", () => {
        expect(getHighlight("Grim Dawn", "grimdawn")).toEqual([0, 9]);
        expect(getHighlight("Diablo II: Resurrected", "iiresur")).toEqual([7, 16]);
    });

    it("returns null without a contiguous match", () => {
        expect(getHighlight("Diablo IV", "d4")).toBeNull();
        expect(getHighlight("Diablo IV", "")).toBeNull();
    });
});
