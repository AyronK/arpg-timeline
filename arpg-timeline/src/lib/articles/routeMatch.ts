import type { Article, ArticleCategory } from "@/lib/cms/queries/articleQuery";

/**
 * True when a fetched article legitimately belongs to the route it was reached
 * through. The GROQ queries already filter on this, but the guard makes a
 * projection regression fail closed (404) instead of cross-resolving (plan G1).
 */
export function articleMatchesRoute(
    article: Pick<Article, "category" | "game">,
    route: { category: ArticleCategory; gameSlug?: string },
): boolean {
    if (article.category !== route.category) return false;
    if (route.gameSlug) return article.game?.slug === route.gameSlug;
    return !article.game;
}
