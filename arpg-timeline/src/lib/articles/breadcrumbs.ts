import { getArticleIndexPath, getArticlePath } from "@/lib/articles/articleUrl";
import type { Article } from "@/lib/cms/queries/articleQuery";

export interface Crumb {
    name: string;
    href: string;
}

const CATEGORY_LABEL: Record<Article["category"], string> = {
    news: "News",
    resources: "Resources",
};

/**
 * Explicit crumb trail for an article page — real game name + article title
 * instead of title-cased slug segments (plan G2).
 */
export function buildArticleCrumbs(article: Article): Crumb[] {
    const crumbs: Crumb[] = [{ name: "Home", href: "/" }];

    if (article.game) {
        crumbs.push({ name: article.game.name, href: `/game/${article.game.slug}` });
    }

    crumbs.push({
        name: CATEGORY_LABEL[article.category],
        href: getArticleIndexPath({ category: article.category, gameSlug: article.game?.slug }),
    });

    crumbs.push({
        name: article.title,
        href: getArticlePath({
            category: article.category,
            slug: article.slug,
            gameSlug: article.game?.slug,
        }),
    });

    return crumbs;
}
