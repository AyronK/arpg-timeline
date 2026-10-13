import { describe, expect, it } from "vitest";

import type { Game } from "@/lib/cms/games.types";
import type { GameFilterCategory } from "@/lib/cms/gameTags";

import { getUrlExcludesToPersist, resolveExcludedSlugs } from "./filterState";

const game = (slug: string, overrides: Partial<Game> = {}): Game =>
    ({ slug, name: slug, isDormant: false, categories: ["seasonal"], ...overrides }) as Game;

const confirmedNext = { start: { confirmed: true } } as Game["nextSeason"];

const games = [
    game("poe"),
    game("dormant", { isDormant: true }),
    game("community", { categories: ["community"] }),
    game("unconfirmed-non-seasonal", { categories: [] }),
    game("confirmed-non-seasonal", { categories: [], nextSeason: confirmedNext }),
    game("early-access", { categories: ["early-access"] }),
];

const PRESET = ["dormant", "community", "unconfirmed-non-seasonal"];

const resolve = (input: Partial<Parameters<typeof resolveExcludedSlugs>[0]> = {}) =>
    resolveExcludedSlugs({
        category: "featured",
        games,
        stored: null,
        urlExcludes: [],
        ...input,
    });

describe("resolveExcludedSlugs on Featured", () => {
    it("gives the preset with no inputs", () => {
        expect(resolve()).toEqual(PRESET);
    });

    it("prefers the stored Featured record over the URL", () => {
        expect(
            resolve({
                stored: { category: "featured", excludedSlugs: ["poe"] },
                urlExcludes: ["early-access"],
            }),
        ).toEqual(["poe"]);
    });

    it("keeps an empty stored record instead of falling back", () => {
        expect(resolve({ stored: { category: "featured", excludedSlugs: [] } })).toEqual([]);
    });

    it("uses the URL when nothing is stored", () => {
        expect(resolve({ urlExcludes: ["early-access"] })).toEqual(["early-access"]);
    });

    it("ignores a record stored for another tab, falling back to the URL", () => {
        expect(
            resolve({
                stored: { category: "community", excludedSlugs: ["poe"] },
                urlExcludes: ["early-access"],
            }),
        ).toEqual(["early-access"]);
    });

    it("ignores a record stored for another tab, falling back to the preset", () => {
        expect(resolve({ stored: { category: "community", excludedSlugs: ["poe"] } })).toEqual(
            PRESET,
        );
    });
});

describe("resolveExcludedSlugs on other tabs", () => {
    const others: GameFilterCategory[] = ["non-seasonal", "community", "early-access", "all"];

    it.each(others)("gives an empty list on %s", (category) => {
        expect(
            resolve({
                category,
                stored: { category, excludedSlugs: ["poe"] },
                urlExcludes: ["early-access"],
            }),
        ).toEqual([]);
    });
});

describe("Featured preset", () => {
    it("includes dormant, community and unconfirmed non-seasonal games", () => {
        expect(resolve()).toEqual(
            expect.arrayContaining(["dormant", "community", "unconfirmed-non-seasonal"]),
        );
    });

    it("excludes seasonal, early access and confirmed games", () => {
        const preset = resolve();
        expect(preset).not.toContain("poe");
        expect(preset).not.toContain("early-access");
        expect(preset).not.toContain("confirmed-non-seasonal");
    });

    it("hides a dormant game even when it is seasonal", () => {
        expect(resolve({ games: [game("old", { isDormant: true })] })).toEqual(["old"]);
    });
});

describe("getUrlExcludesToPersist", () => {
    it("persists a shared Featured link when nothing is stored", () => {
        expect(
            getUrlExcludesToPersist({ category: "featured", stored: null, urlExcludes: ["poe"] }),
        ).toEqual(["poe"]);
    });

    it("persists over a record stored for another tab", () => {
        expect(
            getUrlExcludesToPersist({
                category: "featured",
                stored: { category: "community", excludedSlugs: [] },
                urlExcludes: ["poe"],
            }),
        ).toEqual(["poe"]);
    });

    it("never overwrites a stored Featured record", () => {
        expect(
            getUrlExcludesToPersist({
                category: "featured",
                stored: { category: "featured", excludedSlugs: [] },
                urlExcludes: ["poe"],
            }),
        ).toBeNull();
    });

    it("skips an empty URL", () => {
        expect(
            getUrlExcludesToPersist({ category: "featured", stored: null, urlExcludes: [] }),
        ).toBeNull();
    });

    it("skips other tabs", () => {
        expect(
            getUrlExcludesToPersist({ category: "community", stored: null, urlExcludes: ["poe"] }),
        ).toBeNull();
    });
});
