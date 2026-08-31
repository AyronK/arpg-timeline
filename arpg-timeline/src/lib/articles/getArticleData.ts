import { cache } from "react";

import { articleMatchesRoute } from "@/lib/articles/routeMatch";
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
    /** Present for game-scoped routes; the fetched article must match it. */
    gameSlug?: string;
}

/**
 * Fetch a single article for a route. Returns null when nothing matches the
 * (slug, category, game) triple — the route then calls notFound(). Wrapped in
 * React `cache()` so generateMetadata + the page body + structured data share
 * one network call per request.
 */
export const getArticle = cache(
    async ({ category, slug, gameSlug }: GetArticleArgs): Promise<Article | null> => {
        const query = gameSlug ? articleByGameAndSlugQuery : articleBySlugQuery;
        const params = gameSlug ? { slug, category, gameSlug } : { slug, category };

        const article = await sanityClient.fetch<Article | null>(query, params, {
            next: { revalidate: false, tags: ["article"] },
        });

        if (!article) return null;

        // Defensive: the queries already filter on category + game, but keep the
        // guard so a projection change can't silently cross-resolve routes.
        if (!articleMatchesRoute(article, { category, gameSlug })) return null;

        return article;
    },
);

/** Every article's route coordinates — feeds generateStaticParams + the sitemap. */
export const getArticleStaticParams = cache(async (): Promise<ArticleStaticParam[]> => {
    return sanityClient.fetch<ArticleStaticParam[]>(
        articleStaticParamsQuery,
        {},
        { next: { revalidate: false, tags: ["article"] } },
    );
});
