import { cache } from "react";

import { pickRelated } from "@/lib/articles/related";
import {
    ArticleCategory,
    ArticleIndexGame,
    articleIndexGameQuery,
    articlesByCategoryPageQuery,
    articlesCountQuery,
    ArticlesPageResult,
    gameArticlesByCategoryPageQuery,
    gameArticlesCountQuery,
    relatedArticlesQuery,
    RelatedArticlesResult,
} from "@/lib/cms/queries/articleQuery";
import { sanityClient } from "@/lib/sanity/sanityClient";

import { ARTICLES_PER_PAGE } from "./pagination";

const FETCH_OPTS = { next: { revalidate: false as const, tags: ["article"] } };

interface ArticlesPageArgs {
    category: ArticleCategory;
    gameSlug?: string;
    page: number;
}

export interface ArticlesPage {
    items: ArticlesPageResult["items"];
    total: number;
    pageCount: number;
}

export const getArticlesPage = cache(
    async ({ category, gameSlug, page }: ArticlesPageArgs): Promise<ArticlesPage> => {
        const from = (page - 1) * ARTICLES_PER_PAGE;
        const to = from + ARTICLES_PER_PAGE;

        const query = gameSlug ? gameArticlesByCategoryPageQuery : articlesByCategoryPageQuery;
        const params = gameSlug ? { category, gameSlug, from, to } : { category, from, to };

        const res = await sanityClient.fetch<ArticlesPageResult | null>(query, params, FETCH_OPTS);
        const total = res?.total ?? 0;

        return {
            items: res?.items ?? [],
            total,
            pageCount: Math.max(1, Math.ceil(total / ARTICLES_PER_PAGE)),
        };
    },
);

export const getArticlesPageCount = cache(
    async ({
        category,
        gameSlug,
    }: {
        category: ArticleCategory;
        gameSlug?: string;
    }): Promise<number> => {
        const query = gameSlug ? gameArticlesCountQuery : articlesCountQuery;
        const params = gameSlug ? { category, gameSlug } : { category };
        const total = await sanityClient.fetch<number>(query, params, FETCH_OPTS);
        return Math.max(1, Math.ceil((total ?? 0) / ARTICLES_PER_PAGE));
    },
);

export const getArticleIndexGame = cache(
    async (gameSlug: string): Promise<ArticleIndexGame | null> =>
        sanityClient.fetch<ArticleIndexGame | null>(
            articleIndexGameQuery,
            { gameSlug },
            FETCH_OPTS,
        ),
);

interface RelatedArgs {
    excludeId: string;
    gameRef: string | null;
    category: ArticleCategory;
}

export const getRelatedArticles = cache(async ({ excludeId, gameRef, category }: RelatedArgs) => {
    const res = await sanityClient.fetch<RelatedArticlesResult | null>(
        relatedArticlesQuery,
        { excludeId, gameRef, category },
        FETCH_OPTS,
    );

    return pickRelated(res?.sameGame ?? [], res?.sameCategory ?? []);
});
