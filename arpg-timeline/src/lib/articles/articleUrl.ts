import type { ArticleCategory } from "@/lib/cms/queries/articleQuery";
import { SITE_URL } from "@/lib/siteUrl";

export interface ArticleUrlParts {
    category: ArticleCategory;
    slug: string;
    gameSlug?: string | null;
}

export const getArticlePath = ({ category, slug, gameSlug }: ArticleUrlParts): string =>
    gameSlug ? `/game/${gameSlug}/${category}/${slug}` : `/${category}/${slug}`;

export const getArticleIndexPath = ({
    category,
    gameSlug,
}: Pick<ArticleUrlParts, "category" | "gameSlug">): string =>
    gameSlug ? `/game/${gameSlug}/${category}` : `/${category}`;

export const getArticleAbsoluteUrl = (parts: ArticleUrlParts): string =>
    `${SITE_URL}${getArticlePath(parts)}`;
