import type { ArticleCategory } from "@/lib/cms/queries/articleQuery";

export interface ArticleUrlParts {
    category: ArticleCategory;
    slug: string;
    /** Game slug when the article is game-scoped, otherwise null/undefined. */
    gameSlug?: string | null;
}

/**
 * Canonical path for an article. `category` + `game` map 1:1 onto the prefix:
 *   root  → /news/{slug}            /resources/{slug}
 *   game  → /game/{g}/news/{slug}   /game/{g}/resources/{slug}
 */
export const getArticlePath = ({ category, slug, gameSlug }: ArticleUrlParts): string =>
    gameSlug ? `/game/${gameSlug}/${category}/${slug}` : `/${category}/${slug}`;

/** Path of the index that lists this article's siblings. */
export const getArticleIndexPath = ({
    category,
    gameSlug,
}: Pick<ArticleUrlParts, "category" | "gameSlug">): string =>
    gameSlug ? `/game/${gameSlug}/${category}` : `/${category}`;

const SITE_URL = "https://www.arpg-timeline.com";

export const getArticleAbsoluteUrl = (parts: ArticleUrlParts): string =>
    `${SITE_URL}${getArticlePath(parts)}`;
