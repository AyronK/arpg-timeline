import { getArticlePath } from "@/lib/articles/articleUrl";
import type { ArticleCategory, ArticleListItem } from "@/lib/cms/queries/articleQuery";

export type FeedItemSource = "article" | "steam";

export const CATEGORY_LABEL: Record<ArticleCategory, string> = {
    news: "News",
    resources: "Resources",
};

/**
 * Normalized shape behind every article/news surface on the dashboard, so first-party
 * articles and third-party game news can share one card design instead of drifting apart.
 */
export interface FeedItem {
    id: string;
    href: string;
    title: string;
    /** Steam titles arrive as HTML; article titles never do. */
    titleIsHtml?: boolean;
    excerpt?: string | null;
    publishedAt: string;
    image?: { url: string; lqip?: string; alt: string } | null;
    gameName?: string | null;
    categoryLabel?: string | null;
    source: FeedItemSource;
    /** Off-site links open in a new tab and carry nofollow. */
    external: boolean;
}

export const articleToFeedItem = (article: ArticleListItem): FeedItem => {
    const asset = article.coverImage?.asset;

    return {
        id: article._id,
        href: getArticlePath({
            category: article.category,
            slug: article.slug,
            gameSlug: article.game?.slug,
        }),
        title: article.title,
        excerpt: article.excerpt,
        publishedAt: article.publishedAt,
        image: asset?.url
            ? { url: asset.url, lqip: asset.lqip, alt: article.coverImage.alt ?? "" }
            : null,
        gameName: article.game?.name ?? null,
        categoryLabel: CATEGORY_LABEL[article.category],
        source: "article",
        external: false,
    };
};
