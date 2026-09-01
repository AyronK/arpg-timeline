import type { Article, ArticleCategory } from "@/lib/cms/queries/articleQuery";

/** Rejects a slug that resolved from another category/game namespace. */
export function articleMatchesRoute(
    article: Pick<Article, "category" | "game">,
    route: { category: ArticleCategory; gameSlug?: string },
): boolean {
    if (article.category !== route.category) return false;
    if (route.gameSlug) return article.game?.slug === route.gameSlug;
    return !article.game;
}
