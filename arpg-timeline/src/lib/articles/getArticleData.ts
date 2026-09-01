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
    gameSlug?: string;
}

// Both queries dereference the linked `game` (slug/name in the body, slug in the params),
// so they carry the `game` tag too: a game rename or a newly created game heals the page
// / static params via `revalidateTag("game")`, not just on the next article publish.
const FETCH_OPTS = { next: { revalidate: false as const, tags: ["article", "game"] } };

// `cache()` so generateMetadata, the page and the structured data share one fetch.
export const getArticle = cache(
    async ({ category, slug, gameSlug }: GetArticleArgs): Promise<Article | null> => {
        const query = gameSlug ? articleByGameAndSlugQuery : articleBySlugQuery;
        const params = gameSlug ? { slug, category, gameSlug } : { slug, category };

        const article = await sanityClient.fetch<Article | null>(query, params, FETCH_OPTS);

        if (!article) return null;
        if (!articleMatchesRoute(article, { category, gameSlug })) return null;

        return article;
    },
);

export const getArticleStaticParams = cache(async (): Promise<ArticleStaticParam[]> => {
    return sanityClient.fetch<ArticleStaticParam[]>(articleStaticParamsQuery, {}, FETCH_OPTS);
});
