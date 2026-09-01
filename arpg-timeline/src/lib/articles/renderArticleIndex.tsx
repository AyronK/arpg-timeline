import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ArticleIndex } from "@/components/articles/ArticleIndex";
import { BreadcrumbSchema } from "@/components/BreadcrumbSchema";
import { getArticleIndexPath } from "@/lib/articles/articleUrl";
import type { Crumb } from "@/lib/articles/breadcrumbs";
import { getArticleStaticParams } from "@/lib/articles/getArticleData";
import {
    getArticleIndexGame,
    getArticlesPage,
    getArticlesPageCount,
} from "@/lib/articles/getArticleListData";
import { buildPageHref, parsePageParam } from "@/lib/articles/pagination";
import type { ArticleCategory } from "@/lib/cms/queries/articleQuery";
import { DEFAULT_OG_IMAGE } from "@/lib/siteUrl";

interface IndexArgs {
    category: ArticleCategory;
    gameSlug?: string;
    page?: string;
}

const CATEGORY_LABEL: Record<ArticleCategory, string> = {
    news: "News",
    resources: "Resources",
};

const rootCopy = (category: ArticleCategory) =>
    category === "news"
        ? {
              title: "News",
              intro: "Announcements, coverage, and updates from aRPG Timeline and the games we track.",
          }
        : {
              title: "Resources",
              intro: "Guides, reference material, and deep dives for the action RPGs on aRPG Timeline.",
          };

const gameCopy = (category: ArticleCategory, gameName: string) =>
    category === "news"
        ? { title: `${gameName} news`, intro: `News and announcements for ${gameName}.` }
        : {
              title: `${gameName} guides & resources`,
              intro: `Guides and reference material for ${gameName}.`,
          };

async function resolveIndex({ category, gameSlug, page: pageParam }: IndexArgs) {
    const page = parsePageParam(pageParam);

    const game = gameSlug ? await getArticleIndexGame(gameSlug) : null;
    if (gameSlug && !game) notFound();

    const { items, pageCount } = await getArticlesPage({ category, gameSlug, page });
    if (page > 1 && items.length === 0) notFound();

    const basePath = getArticleIndexPath({ category, gameSlug: game?.slug });
    const { title, intro } = game ? gameCopy(category, game.name) : rootCopy(category);

    const crumbs: Crumb[] = [{ name: "Home", href: "/" }];
    if (game) crumbs.push({ name: game.name, href: `/game/${game.slug}` });
    crumbs.push({ name: CATEGORY_LABEL[category], href: basePath });

    return { page, items, pageCount, basePath, title, intro, crumbs, showGame: !game };
}

export async function renderArticleIndex(args: IndexArgs) {
    const { page, items, pageCount, basePath, title, intro, crumbs, showGame } =
        await resolveIndex(args);

    return (
        <>
            <BreadcrumbSchema crumbs={crumbs} />
            {page > 1 && <link rel="prev" href={buildPageHref(basePath, page - 1)} />}
            {page < pageCount && <link rel="next" href={buildPageHref(basePath, page + 1)} />}
            <ArticleIndex
                title={title}
                intro={intro}
                crumbs={crumbs}
                articles={items}
                basePath={basePath}
                page={page}
                pageCount={pageCount}
                showGame={showGame}
            />
        </>
    );
}

export async function resolveArticleIndexMetadata(args: IndexArgs): Promise<Metadata> {
    const { page, basePath, title, intro, pageCount } = await resolveIndex(args);

    const canonical = buildPageHref(basePath, page);
    const suffix = page > 1 ? ` - Page ${page}` : "";

    return {
        title: `${title}${suffix} | aRPG Timeline`,
        description: intro,
        alternates: { canonical },
        openGraph: {
            title: `${title}${suffix} | aRPG Timeline`,
            description: intro,
            type: "website",
            url: canonical,
            siteName: "aRPG Timeline",
            images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: "aRPG Timeline" }],
        },
        twitter: {
            card: "summary_large_image",
            title: `${title}${suffix} | aRPG Timeline`,
            description: intro,
            images: [DEFAULT_OG_IMAGE],
        },
        robots: {
            index: page <= pageCount,
            follow: true,
            googleBot: { index: page <= pageCount, follow: true, "max-image-preview": "large" },
        },
    };
}

const pagesFrom2 = (pageCount: number): string[] =>
    Array.from({ length: Math.max(0, pageCount - 1) }, (_, i) => String(i + 2));

const gameSlugsForCategory = async (category: ArticleCategory): Promise<string[]> => {
    const all = await getArticleStaticParams();
    return [
        ...new Set(
            all
                .filter((a) => a.category === category && a.gameSlug)
                .map((a) => a.gameSlug as string),
        ),
    ];
};

/** `/page/[page]` params for a root index: pages 2..N only (page 1 is the bare route). */
export async function articleIndexPageParams(
    category: ArticleCategory,
): Promise<{ page: string }[]> {
    const pageCount = await getArticlesPageCount({ category });
    return pagesFrom2(pageCount).map((page) => ({ page }));
}

/** Game slugs with at least one article in this category (for the base game index). */
export async function articleIndexGameParams(
    category: ArticleCategory,
): Promise<{ gameSlug: string }[]> {
    return (await gameSlugsForCategory(category)).map((gameSlug) => ({ gameSlug }));
}

/** `{ gameSlug, page }` params for a game-scoped `/page/[page]` index: pages 2..N. */
export async function gameArticleIndexPageParams(
    category: ArticleCategory,
): Promise<{ gameSlug: string; page: string }[]> {
    const gameSlugs = await gameSlugsForCategory(category);
    const out: { gameSlug: string; page: string }[] = [];
    for (const gameSlug of gameSlugs) {
        const pageCount = await getArticlesPageCount({ category, gameSlug });
        for (const page of pagesFrom2(pageCount)) out.push({ gameSlug, page });
    }
    return out;
}
