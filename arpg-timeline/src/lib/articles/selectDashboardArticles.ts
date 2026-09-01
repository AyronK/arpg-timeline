import { rankArticles, type RankedArticle } from "@/lib/articles/rankArticles";
import type { Game } from "@/lib/cms/games.types";
import type { ArticleListItem } from "@/lib/cms/queries/articleQuery";

const DAY_MS = 24 * 60 * 60 * 1000;

export const DEFAULT_MAX_ARTICLE_AGE_DAYS = 30;

export interface DashboardArticlesOptions {
    /** Applies to game-specific articles only. */
    maxAgeDays?: number;
}

/** `now` is a parameter so callers stay pure and tests stay deterministic. */
export const selectDashboardArticles = (
    pool: ArticleListItem[],
    games: Game[],
    { maxAgeDays = DEFAULT_MAX_ARTICLE_AGE_DAYS }: DashboardArticlesOptions = {},
    now: number = Date.now(),
): RankedArticle[] => {
    const cutoff = now - maxAgeDays * DAY_MS;
    const visibleSlugs = new Set(games.map((g) => g.slug));

    // rankArticles already sorts by score, so filtering preserves the order.
    return rankArticles(pool, games, now).filter(({ article }) => {
        // Age retires game articles only; generic ones never go stale.
        if (!article.game) return true;
        return (
            visibleSlugs.has(article.game.slug) && new Date(article.publishedAt).getTime() >= cutoff
        );
    });
};
