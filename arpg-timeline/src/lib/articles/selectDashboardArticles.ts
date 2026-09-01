import { rankArticles, type RankedArticle } from "@/lib/articles/rankArticles";
import type { Game } from "@/lib/cms/games.types";
import type { ArticleListItem } from "@/lib/cms/queries/articleQuery";

const DAY_MS = 24 * 60 * 60 * 1000;

export const DEFAULT_MAX_ARTICLE_AGE_DAYS = 30;

const DEFAULT_GENERIC_SHARE = 0.5;

export interface DashboardArticlesOptions {
    /** Omit for no cap - for slots that scroll. */
    limit?: number;
    minScore?: number;
    /** Share of `limit` generic articles may claim while scoped ones are available. */
    genericShare?: number;
    /** Applies to game-specific articles only. */
    maxAgeDays?: number;
}

const byScore = (a: RankedArticle, b: RankedArticle) => b.score - a.score;

/** `now` is a parameter so callers stay pure and tests stay deterministic. */
export const selectDashboardArticles = (
    pool: ArticleListItem[],
    games: Game[],
    {
        limit,
        minScore = 0,
        genericShare = DEFAULT_GENERIC_SHARE,
        maxAgeDays = DEFAULT_MAX_ARTICLE_AGE_DAYS,
    }: DashboardArticlesOptions = {},
    now: number = Date.now(),
): RankedArticle[] => {
    if (limit !== undefined && limit <= 0) return [];

    const cutoff = now - maxAgeDays * DAY_MS;
    const visibleSlugs = new Set(games.map((g) => g.slug));

    // Age retires game articles only; generic ones never go stale.
    const isFresh = (r: RankedArticle) =>
        !r.article.game || new Date(r.article.publishedAt).getTime() >= cutoff;

    const ranked = rankArticles(pool, games, now).filter((r) => r.score >= minScore && isFresh(r));

    const scoped: RankedArticle[] = [];
    const generic: RankedArticle[] = [];

    for (const entry of ranked) {
        const gameSlug = entry.article.game?.slug;
        if (!gameSlug) generic.push(entry);
        else if (visibleSlugs.has(gameSlug)) scoped.push(entry);
    }

    if (limit === undefined) return [...scoped, ...generic].sort(byScore);

    const genericCap = Math.max(1, Math.ceil(limit * genericShare));
    const selected = [...scoped, ...generic.slice(0, genericCap)].sort(byScore).slice(0, limit);

    // Backfill rather than leave a reserved slot half empty.
    if (selected.length < limit) {
        const taken = new Set(selected.map((r) => r.article._id));
        for (const entry of generic) {
            if (selected.length === limit) break;
            if (!taken.has(entry.article._id)) selected.push(entry);
        }
    }

    return selected;
};
