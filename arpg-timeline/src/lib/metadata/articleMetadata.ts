import type { Metadata } from "next";

import { getArticleModified } from "@/lib/articles/articleDates";
import { getArticleAbsoluteUrl, getArticlePath } from "@/lib/articles/articleUrl";
import type { Article } from "@/lib/cms/queries/articleQuery";
import { DEFAULT_OG_IMAGE } from "@/lib/siteUrl";

/** Sanity CDN URL cropped to the 1200x630 OG frame. */
function toOgImageUrl(assetUrl: string | undefined): string {
    if (!assetUrl) return DEFAULT_OG_IMAGE;
    const sep = assetUrl.includes("?") ? "&" : "?";
    return `${assetUrl}${sep}w=1200&h=630&fit=crop&auto=format`;
}

export function generateArticleMetadata(article: Article): Metadata {
    const path = getArticlePath({
        category: article.category,
        slug: article.slug,
        gameSlug: article.game?.slug,
    });
    const url = getArticleAbsoluteUrl({
        category: article.category,
        slug: article.slug,
        gameSlug: article.game?.slug,
    });

    const title = article.seoTitle?.trim() || article.title;
    const description = (article.seoDescription?.trim() || article.excerpt).slice(0, 300);
    const imageUrl = toOgImageUrl(
        article.ogImage?.asset?.url ?? article.coverImage?.asset?.url ?? undefined,
    );

    return {
        title: `${title} | aRPG Timeline`,
        description,
        alternates: { canonical: path },
        openGraph: {
            type: "article",
            title,
            description,
            url,
            siteName: "aRPG Timeline",
            locale: "en_US",
            publishedTime: article.publishedAt,
            modifiedTime: getArticleModified(article),
            images: [{ url: imageUrl, width: 1200, height: 630, alt: article.title }],
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: [imageUrl],
        },
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                "max-image-preview": "large",
                "max-snippet": -1,
            },
        },
    };
}
