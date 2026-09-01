import { getArticlePath } from "@/lib/articles/articleUrl";
import type { ArticleCategory, ArticleListItem } from "@/lib/cms/queries/articleQuery";

export type FeedItemSource = "article" | "steam";

export const CATEGORY_LABEL: Record<ArticleCategory, string> = {
    news: "News",
    resources: "Resources",
};

/** Shared shape so first-party articles and game news can use one card design. */
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
