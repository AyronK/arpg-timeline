import { cache } from "react";

import { articleMatchesRoute } from "@/lib/articles/routeMatch";
import { showUnreleasedArticles } from "@/lib/articles/visibility";
import {
    Article,
    articleByGameAndSlugQuery,
    articleBySlugQuery,
    ArticleCategory,
    ArticleStaticParam,
    articleStaticParamsQuery,
} from "@/lib/cms/queries/articleQuery";
import { sanityClient } from "@/lib/sanity/sanityClient";

interface GetArticleArgs {
    category: ArticleCategory;
    slug: string;
    gameSlug?: string;
}

// `game` tag: both queries deref the linked game, so `revalidateTag("game")` (rename,
// or a slug that becomes a real game) heals the route, not just an article publish.
const FETCH_OPTS = { next: { revalidate: false as const, tags: ["article", "game"] } };
const showUnreleased = showUnreleasedArticles;

// cache(): metadata, page body and structured data share one fetch.
export const getArticle = cache(
    async ({ category, slug, gameSlug }: GetArticleArgs): Promise<Article | null> => {
        const query = gameSlug ? articleByGameAndSlugQuery : articleBySlugQuery;
        const params = gameSlug
            ? { slug, category, gameSlug, showUnreleased }
            : { slug, category, showUnreleased };

        const article = await sanityClient.fetch<Article | null>(query, params, FETCH_OPTS);

        if (!article) return null;
        if (!articleMatchesRoute(article, { category, gameSlug })) return null;

        return article;
    },
);

export const getArticleStaticParams = cache(async (): Promise<ArticleStaticParam[]> => {
    return sanityClient.fetch<ArticleStaticParam[]>(
        articleStaticParamsQuery,
        { showUnreleased },
        FETCH_OPTS,
    );
});
