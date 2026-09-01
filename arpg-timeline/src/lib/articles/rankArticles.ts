import type { Game } from "@/lib/cms/games.types";
import type { ArticleCategory, ArticleListItem } from "@/lib/cms/queries/articleQuery";

const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Half-life in days. News is only interesting while it is new; a league-start guide
 * stays useful for a whole season, so resources decay roughly nine times slower.
 */
export const HALF_LIFE_DAYS: Record<ArticleCategory, number> = {
    news: 5,
    resources: 45,
};

/** Applied after decay, so a fresh news post still outranks a fresh guide. */
export const CATEGORY_WEIGHT: Record<ArticleCategory, number> = {
    news: 1,
    resources: 0.85,
};

/** How close a season boundary has to be before it lifts that game's articles. */
export const SEASON_PROXIMITY_WINDOW_DAYS = 14;

/** Boost applied to a game's articles at the exact moment of a season boundary. */
export const MAX_SEASON_BOOST = 2;

export interface RankedArticle {
    article: ArticleListItem;
    score: number;
}

const recencyDecay = (publishedAt: string, category: ArticleCategory, now: number): number => {
    const published = new Date(publishedAt).getTime();
    if (Number.isNaN(published)) return 0;

    // Scheduled-ahead articles rank as if they had just gone live, never higher.
    const ageDays = Math.max(0, (now - published) / DAY_MS);
    return 2 ** (-ageDays / HALF_LIFE_DAYS[category]);
};

/**
 * Scales from MAX_SEASON_BOOST at the boundary down to 1 at the edge of the window.
 * Both an imminent season start and an imminent season end count - each is a moment
 * when players go looking for that game's guides.
 */
const seasonProximityBoost = (game: Game | undefined, now: number): number => {
    if (!game) return 1;

    const boundaries = [game.nextSeason?.start?.startDate, game.currentSeason?.end?.endDate]
        .filter((d): d is string => !!d)
        .map((d) => new Date(d).getTime())
        .filter((t) => !Number.isNaN(t));

    if (boundaries.length === 0) return 1;

    const nearestDays = Math.min(...boundaries.map((t) => Math.abs(t - now) / DAY_MS));
    if (nearestDays >= SEASON_PROXIMITY_WINDOW_DAYS) return 1;

    const closeness = 1 - nearestDays / SEASON_PROXIMITY_WINDOW_DAYS;
    return 1 + closeness * (MAX_SEASON_BOOST - 1);
};

export const scoreArticle = (
    article: ArticleListItem,
    game: Game | undefined,
    now: number,
): number =>
    recencyDecay(article.publishedAt, article.category, now) *
    seasonProximityBoost(game, now) *
    CATEGORY_WEIGHT[article.category];

/**
 * Highest score first. `games` supplies season timing; an article whose game is absent
 * from the list (generic articles included) simply gets no season boost.
 */
export const rankArticles = (
    articles: ArticleListItem[],
    games: Game[],
    now: number = Date.now(),
): RankedArticle[] => {
    const gamesBySlug = new Map(games.map((g) => [g.slug, g]));

    return articles
        .map((article) => ({
            article,
            score: scoreArticle(
                article,
                article.game ? gamesBySlug.get(article.game.slug) : undefined,
                now,
            ),
        }))
        .sort((a, b) => b.score - a.score);
};
