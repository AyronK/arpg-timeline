import { cache } from "react";

import { showUnreleasedArticles } from "@/lib/articles/visibility";
import { type ArticleListItem, dashboardArticlesQuery } from "@/lib/cms/queries/articleQuery";
import { sanityClient } from "@/lib/sanity/sanityClient";

// Matches getArticleListData: the `game` tag heals renames in the dereferenced game.
const FETCH_OPTS = { next: { revalidate: false as const, tags: ["article", "game"] } };

export const DASHBOARD_ARTICLE_POOL_SIZE = 24;

export const getDashboardArticles = cache(async (): Promise<ArticleListItem[]> => {
    const res = await sanityClient.fetch<ArticleListItem[] | null>(
        dashboardArticlesQuery,
        { limit: DASHBOARD_ARTICLE_POOL_SIZE, showUnreleased: showUnreleasedArticles },
        FETCH_OPTS,
    );

    return res ?? [];
});
