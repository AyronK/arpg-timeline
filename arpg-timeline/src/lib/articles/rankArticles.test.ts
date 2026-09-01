import { describe, expect, it } from "vitest";

import type { Game } from "@/lib/cms/games.types";
import type { ArticleCategory, ArticleListItem } from "@/lib/cms/queries/articleQuery";

import {
    CATEGORY_WEIGHT,
    HALF_LIFE_DAYS,
    MAX_SEASON_BOOST,
    rankArticles,
    scoreArticle,
    SEASON_PROXIMITY_WINDOW_DAYS,
} from "./rankArticles";

const NOW = new Date("2026-06-01T12:00:00.000Z").getTime();
const DAY_MS = 24 * 60 * 60 * 1000;

const daysAgo = (n: number) => new Date(NOW - n * DAY_MS).toISOString();
const daysAhead = (n: number) => new Date(NOW + n * DAY_MS).toISOString();

const article = (
    overrides: Partial<ArticleListItem> & { category?: ArticleCategory } = {},
): ArticleListItem =>
    ({
        _id: overrides._id ?? "a1",
        slug: "slug",
        category: overrides.category ?? "news",
        title: "Title",
        excerpt: "Excerpt",
        aiDisclosure: "none",
        publishedAt: overrides.publishedAt ?? daysAgo(0),
        updatedAt: null,
        _updatedAt: daysAgo(0),
        game: overrides.game ?? null,
        gameId: null,
        coverImage: { alt: "", asset: null },
        ...overrides,
    }) as ArticleListItem;

const gameRef = (slug: string) => ({ slug, name: slug, logo: null });

const game = (slug: string, overrides: Partial<Game> = {}): Game =>
    ({ slug, name: slug, ...overrides }) as Game;

describe("scoreArticle", () => {
    it("halves the score after one half-life", () => {
        const fresh = scoreArticle(article({ publishedAt: daysAgo(0) }), undefined, NOW);
        const aged = scoreArticle(
            article({ publishedAt: daysAgo(HALF_LIFE_DAYS.news) }),
            undefined,
            NOW,
        );

        expect(aged).toBeCloseTo(fresh / 2, 6);
    });

    it("decays resources far slower than news", () => {
        const oldNews = scoreArticle(
            article({ category: "news", publishedAt: daysAgo(30) }),
            undefined,
            NOW,
        );
        const oldResource = scoreArticle(
            article({ category: "resources", publishedAt: daysAgo(30) }),
            undefined,
            NOW,
        );

        expect(oldResource).toBeGreaterThan(oldNews);
    });

    it("ranks a fresh news post above a fresh guide", () => {
        const news = scoreArticle(article({ category: "news" }), undefined, NOW);
        const resource = scoreArticle(article({ category: "resources" }), undefined, NOW);

        expect(news).toBeGreaterThan(resource);
        expect(resource).toBeCloseTo(news * CATEGORY_WEIGHT.resources, 6);
    });

    it("does not reward articles published in the future", () => {
        const scheduled = scoreArticle(article({ publishedAt: daysAhead(3) }), undefined, NOW);
        const justLive = scoreArticle(article({ publishedAt: daysAgo(0) }), undefined, NOW);

        expect(scheduled).toBeCloseTo(justLive, 6);
    });

    it("returns zero for an unparseable date", () => {
        expect(scoreArticle(article({ publishedAt: "not-a-date" }), undefined, NOW)).toBe(0);
    });
});

describe("season proximity boost", () => {
    const subject = article({ game: gameRef("poe") });

    it("applies the full boost at the season boundary", () => {
        const boosted = scoreArticle(
            subject,
            game("poe", { nextSeason: { start: { startDate: daysAhead(0) } } } as Partial<Game>),
            NOW,
        );
        const plain = scoreArticle(subject, game("poe"), NOW);

        expect(boosted).toBeCloseTo(plain * MAX_SEASON_BOOST, 6);
    });

    it("boosts an imminent season end too", () => {
        const boosted = scoreArticle(
            subject,
            game("poe", { currentSeason: { end: { endDate: daysAhead(2) } } } as Partial<Game>),
            NOW,
        );

        expect(boosted).toBeGreaterThan(scoreArticle(subject, game("poe"), NOW));
    });

    it("fades to nothing at the edge of the window", () => {
        const atEdge = scoreArticle(
            subject,
            game("poe", {
                nextSeason: { start: { startDate: daysAhead(SEASON_PROXIMITY_WINDOW_DAYS) } },
            } as Partial<Game>),
            NOW,
        );

        expect(atEdge).toBeCloseTo(scoreArticle(subject, game("poe"), NOW), 6);
    });

    it("leaves generic articles unboosted even mid season change", () => {
        const generic = article({ game: null, publishedAt: daysAgo(0) });
        const launching = game("poe", {
            nextSeason: { start: { startDate: daysAhead(0) } },
        } as Partial<Game>);

        // No game ref means no game is passed in, so the boost never applies.
        expect(scoreArticle(generic, undefined, NOW)).toBeCloseTo(CATEGORY_WEIGHT.news, 6);
        expect(scoreArticle(generic, undefined, NOW)).toBeLessThan(
            scoreArticle(article({ game: gameRef("poe") }), launching, NOW),
        );
    });
});

describe("rankArticles", () => {
    it("sorts by score, highest first", () => {
        const ranked = rankArticles(
            [
                article({ _id: "old", publishedAt: daysAgo(20) }),
                article({ _id: "new", publishedAt: daysAgo(1) }),
                article({ _id: "mid", publishedAt: daysAgo(6) }),
            ],
            [],
            NOW,
        );

        expect(ranked.map((r) => r.article._id)).toEqual(["new", "mid", "old"]);
    });

    it("lets a season boundary lift an older article above a newer one", () => {
        const ranked = rankArticles(
            [
                article({ _id: "newer-other-game", publishedAt: daysAgo(2), game: gameRef("d4") }),
                article({ _id: "older-launching", publishedAt: daysAgo(6), game: gameRef("poe") }),
            ],
            [
                game("d4"),
                game("poe", {
                    nextSeason: { start: { startDate: daysAhead(1) } },
                } as Partial<Game>),
            ],
            NOW,
        );

        expect(ranked[0].article._id).toBe("older-launching");
    });

    it("ignores an article whose game is not in the list", () => {
        const ranked = rankArticles([article({ game: gameRef("unknown") })], [game("poe")], NOW);

        expect(ranked).toHaveLength(1);
        expect(ranked[0].score).toBeGreaterThan(0);
    });

    it("returns an empty list unchanged", () => {
        expect(rankArticles([], [], NOW)).toEqual([]);
    });
});
