import { describe, expect, it } from "vitest";

import type { Game } from "@/lib/cms/games.types";
import type { ArticleListItem } from "@/lib/cms/queries/articleQuery";

import { DEFAULT_MAX_ARTICLE_AGE_DAYS, selectDashboardArticles } from "./selectDashboardArticles";

const NOW = new Date("2026-06-01T12:00:00.000Z").getTime();
const DAY_MS = 24 * 60 * 60 * 1000;
const daysAgo = (n: number) => new Date(NOW - n * DAY_MS).toISOString();

const article = (id: string, overrides: Partial<ArticleListItem> = {}): ArticleListItem =>
    ({
        _id: id,
        slug: id,
        category: "news",
        title: id,
        excerpt: "",
        aiDisclosure: "none",
        publishedAt: daysAgo(1),
        updatedAt: null,
        _updatedAt: daysAgo(1),
        game: null,
        gameId: null,
        coverImage: { alt: "", asset: null },
        ...overrides,
    }) as ArticleListItem;

const gameRef = (slug: string) => ({ slug, name: slug, logo: null });
const game = (slug: string): Game => ({ slug, name: slug }) as Game;

const ids = (result: ReturnType<typeof selectDashboardArticles>) =>
    result.map((r) => r.article._id);

describe("age cutoff", () => {
    const poe = [game("poe")];

    it("drops game-specific articles past the default window", () => {
        const pool = [
            article("fresh", { game: gameRef("poe"), publishedAt: daysAgo(2) }),
            article("stale", {
                game: gameRef("poe"),
                publishedAt: daysAgo(DEFAULT_MAX_ARTICLE_AGE_DAYS + 1),
            }),
        ];

        expect(ids(selectDashboardArticles(pool, poe, {}, NOW))).toEqual(["fresh"]);
    });

    it("drops stale game resources too, despite their slower decay", () => {
        const pool = [
            article("guide", {
                game: gameRef("poe"),
                category: "resources",
                publishedAt: daysAgo(40),
            }),
        ];

        expect(selectDashboardArticles(pool, poe, {}, NOW)).toEqual([]);
    });

    it("keeps a game article sitting exactly on the boundary", () => {
        const pool = [
            article("edge", {
                game: gameRef("poe"),
                publishedAt: daysAgo(DEFAULT_MAX_ARTICLE_AGE_DAYS),
            }),
        ];

        expect(ids(selectDashboardArticles(pool, poe, {}, NOW))).toEqual(["edge"]);
    });

    it("honours a custom window", () => {
        const pool = [article("week-old", { game: gameRef("poe"), publishedAt: daysAgo(7) })];

        expect(selectDashboardArticles(pool, poe, { maxAgeDays: 3 }, NOW)).toEqual([]);
        expect(ids(selectDashboardArticles(pool, poe, { maxAgeDays: 14 }, NOW))).toEqual([
            "week-old",
        ]);
    });

    it("never expires generic articles", () => {
        const pool = [article("evergreen", { publishedAt: daysAgo(400) })];

        expect(ids(selectDashboardArticles(pool, poe, {}, NOW))).toEqual(["evergreen"]);
    });

    it("keeps the slot populated when every game article has gone stale", () => {
        const pool = [
            article("stale-poe", { game: gameRef("poe"), publishedAt: daysAgo(90) }),
            article("old-generic", { publishedAt: daysAgo(200) }),
        ];

        expect(ids(selectDashboardArticles(pool, poe, {}, NOW))).toEqual(["old-generic"]);
    });

    it("still ranks a stale generic article below fresh game news", () => {
        const pool = [
            article("old-generic", { publishedAt: daysAgo(200) }),
            article("fresh-poe", { game: gameRef("poe"), publishedAt: daysAgo(1) }),
        ];

        expect(ids(selectDashboardArticles(pool, poe, {}, NOW))).toEqual([
            "fresh-poe",
            "old-generic",
        ]);
    });
});

describe("game filtering", () => {
    const pool = [
        article("poe", { game: gameRef("poe") }),
        article("d4", { game: gameRef("d4") }),
        article("generic"),
    ];

    it("hides articles whose game is filtered out", () => {
        const result = ids(selectDashboardArticles(pool, [game("poe")], {}, NOW));

        expect(result).toContain("poe");
        expect(result).not.toContain("d4");
    });

    it("keeps generic articles even when every game is filtered out", () => {
        expect(ids(selectDashboardArticles(pool, [], {}, NOW))).toEqual(["generic"]);
    });
});

describe("ordering", () => {
    it("returns everything recent that survives the filters, best first", () => {
        const pool = [
            article("a", { game: gameRef("poe"), publishedAt: daysAgo(1) }),
            article("b", { game: gameRef("poe"), publishedAt: daysAgo(2) }),
            article("c", { game: gameRef("poe"), publishedAt: daysAgo(3) }),
            article("d", { publishedAt: daysAgo(4) }),
            article("old", { game: gameRef("poe"), publishedAt: daysAgo(90) }),
        ];

        expect(ids(selectDashboardArticles(pool, [game("poe")], {}, NOW))).toEqual([
            "a",
            "b",
            "c",
            "d",
        ]);
    });

    it("is sorted by score throughout", () => {
        const pool = [
            article("old-generic", { publishedAt: daysAgo(200) }),
            article("fresh-poe", { game: gameRef("poe"), publishedAt: daysAgo(1) }),
            article("mid-generic", { publishedAt: daysAgo(3) }),
        ];

        const scores = selectDashboardArticles(pool, [game("poe")], {}, NOW).map((r) => r.score);

        expect(scores).toEqual([...scores].sort((a, b) => b - a));
    });

    it("returns an empty list when nothing survives", () => {
        const pool = [article("stale", { game: gameRef("poe"), publishedAt: daysAgo(90) })];

        expect(selectDashboardArticles(pool, [game("poe")], {}, NOW)).toEqual([]);
    });
});
