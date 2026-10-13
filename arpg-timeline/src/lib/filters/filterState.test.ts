import { describe, expect, it } from "vitest";

import type { Game } from "@/lib/cms/games.types";
import type { GameFilterCategory } from "@/lib/cms/gameTags";

import {
    getHiddenGamesSummary,
    getMobilePresetTabLabel,
    getPresetControlLabel,
    getUrlExcludesToPersist,
    resolveExcludedSlugs,
} from "./filterState";

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

const NOW = new Date("2026-06-01T12:00:00.000Z").getTime();
const DAY_MS = 24 * 60 * 60 * 1000;
const startingIn = (days: number, confirmed = true) =>
    ({
        start: { startDate: new Date(NOW + days * DAY_MS).toISOString(), confirmed },
    }) as Game["nextSeason"];

const summarize = (
    hiddenGames: Game[],
    { isPreset = false, shown = [game("shown")] }: { isPreset?: boolean; shown?: Game[] } = {},
) =>
    getHiddenGamesSummary({
        games: [...shown, ...hiddenGames],
        excludedSlugs: hiddenGames.map((g) => g.slug),
        isPreset,
        now: NOW,
    });

const slugs = (list: { game: Game }[]) => list.map((h) => h.game.slug);

describe("getHiddenGamesSummary state", () => {
    it("is preset when there is no stored Featured record", () => {
        expect(summarize([game("a")], { isPreset: true }).state).toBe("preset");
    });

    it("is custom when a stored record hides games", () => {
        expect(summarize([game("a")]).state).toBe("custom");
    });

    it("is all-shown when nothing is excluded", () => {
        expect(summarize([]).state).toBe("all-shown");
    });

    it("counts only excluded games that exist", () => {
        const summary = getHiddenGamesSummary({
            games: [game("a")],
            excludedSlugs: ["a", "gone"],
            isPreset: false,
            now: NOW,
        });
        expect(summary.hiddenCount).toBe(1);
        expect(slugs(summary.hidden)).toEqual(["a"]);
    });
});

describe("getHiddenGamesSummary reasons", () => {
    const reasonOf = (g: Game) => summarize([g]).hidden[0].reason;

    it("puts Dormant before Community", () => {
        expect(reasonOf(game("a", { isDormant: true, categories: ["community"] }))).toBe("Dormant");
    });

    it("gives Community for community games", () => {
        expect(reasonOf(game("a", { categories: ["community"] }))).toBe("Community");
    });

    it("gives No confirmed season for unconfirmed non-seasonal games", () => {
        expect(reasonOf(game("a", { categories: [] }))).toBe("No confirmed season");
    });

    it("gives Hidden by your filters otherwise", () => {
        expect(reasonOf(game("a"))).toBe("Hidden by your filters");
        expect(reasonOf(game("b", { categories: [], nextSeason: confirmedNext }))).toBe(
            "Hidden by your filters",
        );
    });
});

describe("getHiddenGamesSummary starting soon", () => {
    it("includes day 30 and excludes day 31 and past dates", () => {
        const summary = summarize([
            game("day30", { nextSeason: startingIn(30) }),
            game("day31", { nextSeason: startingIn(31) }),
            game("past", { nextSeason: startingIn(-2) }),
        ]);
        expect(slugs(summary.startingSoon)).toEqual(["day30"]);
    });

    it("excludes a season that started a few hours ago", () => {
        const summary = summarize([game("started", { nextSeason: startingIn(-0.1) })]);
        expect(summary.startingSoon).toEqual([]);
        expect(summary.hidden[0].startsInDays).toBe(-1);
    });

    it("includes a season starting today", () => {
        expect(
            slugs(summarize([game("today", { nextSeason: startingIn(0) })]).startingSoon),
        ).toEqual(["today"]);
    });

    it("sorts by start date ascending", () => {
        const summary = summarize([
            game("late", { nextSeason: startingIn(20) }),
            game("early", { nextSeason: startingIn(3) }),
            game("mid", { nextSeason: startingIn(10) }),
        ]);
        expect(slugs(summary.startingSoon)).toEqual(["early", "mid", "late"]);
    });

    it("never includes dormant games", () => {
        const summary = summarize([game("old", { isDormant: true, nextSeason: startingIn(5) })]);
        expect(summary.startingSoon).toEqual([]);
        expect(summary.hidden[0].startsInDays).toBeNull();
    });

    it("puts every other hidden game in others", () => {
        const summary = summarize([
            game("soon", { nextSeason: startingIn(5) }),
            game("later", { nextSeason: startingIn(40) }),
            game("undated"),
        ]);
        expect(slugs(summary.others)).toEqual(["later", "undated"]);
        expect(summary.others.length + summary.startingSoon.length).toBe(summary.hiddenCount);
    });

    it("passes through confirmed and startsInDays", () => {
        const [estimated, confirmed, undated] = summarize([
            game("estimated", { nextSeason: startingIn(7, false) }),
            game("confirmed", { nextSeason: startingIn(12) }),
            game("undated"),
        ]).hidden;
        expect(estimated).toMatchObject({ startsInDays: 7, confirmed: false });
        expect(confirmed).toMatchObject({ startsInDays: 12, confirmed: true });
        expect(undated).toMatchObject({ startsInDays: null, confirmed: false });
    });
});

describe("getPresetControlLabel", () => {
    it("names the preset and count", () => {
        expect(
            getPresetControlLabel(summarize([game("a"), game("b")], { isPreset: true })),
        ).toEqual({
            full: "Filters · Featured preset · 2 hidden",
            short: "Filters · 2 hidden",
        });
    });

    it("names a custom selection", () => {
        expect(getPresetControlLabel(summarize([game("a")]))).toEqual({
            full: "Filters · Custom · 1 hidden",
            short: "Filters · 1 hidden",
        });
    });

    it("says when all games are shown", () => {
        expect(getPresetControlLabel(summarize([]))).toEqual({
            full: "Filters · All games shown",
            short: "Filters · All games shown",
        });
    });
});

describe("getMobilePresetTabLabel", () => {
    it("names the preset and count", () => {
        expect(getMobilePresetTabLabel(summarize([game("a"), game("b")], { isPreset: true }))).toBe(
            "Featured preset · 2 hidden",
        );
    });

    it("names a custom selection", () => {
        expect(getMobilePresetTabLabel(summarize([game("a")]))).toBe("Custom filters · 1 hidden");
    });

    it("says when all games are shown", () => {
        expect(getMobilePresetTabLabel(summarize([]))).toBe("All games shown");
    });
});
