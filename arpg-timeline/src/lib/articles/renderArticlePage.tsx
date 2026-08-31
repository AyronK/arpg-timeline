import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { BreadcrumbSchema } from "@/components/BreadcrumbSchema";
import { buildArticleCrumbs } from "@/lib/articles/breadcrumbs";
import { getArticle, getArticleStaticParams } from "@/lib/articles/getArticleData";
import { getStructuredDataForArticle } from "@/lib/articles/getStructuredDataForArticle";
import type { ArticleCategory, ArticleStaticParam } from "@/lib/cms/queries/articleQuery";
import { generateArticleMetadata } from "@/lib/metadata/articleMetadata";

interface RouteArgs {
    category: ArticleCategory;
    slug: string;
    gameSlug?: string;
}

export async function renderArticlePage({ category, slug, gameSlug }: RouteArgs) {
    const article = await getArticle({ category, slug, gameSlug });

    if (!article) notFound();

    const structuredData = getStructuredDataForArticle(article);
    const crumbs = buildArticleCrumbs(article);

    return (
        <>
            <BreadcrumbSchema crumbs={crumbs} />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
            />
            <ArticleLayout article={article} />
        </>
    );
}

export async function resolveArticleMetadata({
    category,
    slug,
    gameSlug,
}: RouteArgs): Promise<Metadata> {
    const article = await getArticle({ category, slug, gameSlug });
    if (!article) return { title: "Article not found | aRPG Timeline" };
    return generateArticleMetadata(article);
}

export async function articleStaticParams(
    category: ArticleCategory,
    scope: "root" | "game",
): Promise<Record<string, string>[]> {
    const all: ArticleStaticParam[] = await getArticleStaticParams();
    const matching = all.filter(
        (a) =>
            a.category === category &&
            Boolean(a.slug) &&
            Boolean(a.gameSlug) === (scope === "game"),
    );

    if (scope === "game") {
        return matching.map((a) => ({ gameSlug: a.gameSlug as string, articleSlug: a.slug }));
    }
    return matching.map((a) => ({ slug: a.slug }));
}
