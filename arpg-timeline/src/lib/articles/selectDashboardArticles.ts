import { rankArticles, type RankedArticle } from "@/lib/articles/rankArticles";
import type { Game } from "@/lib/cms/games.types";
import type { ArticleListItem } from "@/lib/cms/queries/articleQuery";

const DAY_MS = 24 * 60 * 60 * 1000;

/** Nothing older than this reaches a dashboard slot, however well it scores. */
export const DEFAULT_MAX_ARTICLE_AGE_DAYS = 30;

const DEFAULT_GENERIC_SHARE = 0.5;

export interface DashboardArticlesOptions {
    /**
     * How many articles the slot can show. Omit for no cap - for slots that scroll
     * and would rather show everything recent.
     */
    limit?: number;
    /**
     * Minimum score an article needs to be shown at all. Slots that intrude on the
     * game grid set this so they stay empty unless something is genuinely worth it;
     * slots with reserved space leave it at 0.
     */
    minScore?: number;
    /**
     * Ceiling on how much of the slot generic (gameless) articles may claim while
     * game-specific ones are still available. They still backfill leftover space.
     * Only meaningful alongside `limit`.
     */
    genericShare?: number;
    /** Hard age cutoff in days. */
    maxAgeDays?: number;
}

const byScore = (a: RankedArticle, b: RankedArticle) => b.score - a.score;

/**
 * Picks the articles one dashboard slot should show.
 *
 * - anything older than `maxAgeDays` is dropped outright
 * - game-scoped article -> kept only while its game is in `games`
 * - generic article     -> never dropped by game filters, but capped by
 *   `genericShare` so a heavily filtered dashboard doesn't turn all-generic
 *
 * `now` is a parameter so callers stay pure and tests stay deterministic.
 */
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

    const ranked = rankArticles(pool, games, now).filter(
        (r) => r.score >= minScore && new Date(r.article.publishedAt).getTime() >= cutoff,
    );

    const scoped: RankedArticle[] = [];
    const generic: RankedArticle[] = [];

    for (const entry of ranked) {
        const gameSlug = entry.article.game?.slug;
        if (!gameSlug) generic.push(entry);
        else if (visibleSlugs.has(gameSlug)) scoped.push(entry);
    }

    // Uncapped slot: everything recent that survives the filters.
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
