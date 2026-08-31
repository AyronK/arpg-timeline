import { getArticleAbsoluteUrl } from "@/lib/articles/articleUrl";
import type { Article } from "@/lib/cms/queries/articleQuery";

const SITE_URL = "https://www.arpg-timeline.com";

type ArticleNode = {
    "@type": "Article";
    "@id": string;
    headline: string;
    description: string;
    url: string;
    datePublished: string;
    dateModified: string;
    mainEntityOfPage: { "@type": "WebPage"; "@id": string };
    author: { "@type": "Organization"; name: string; url: string };
    publisher: {
        "@type": "Organization";
        name: string;
        logo: { "@type": "ImageObject"; url: string };
    };
    image?: { "@type": "ImageObject"; url: string };
    about?: { "@type": "VideoGame"; name: string };
};

export interface ArticleStructuredData {
    "@context": "https://schema.org";
    "@graph": ArticleNode[];
}

/**
 * Plain schema.org `Article` for both categories (plan decision 17 — `NewsArticle`
 * carries Google-News publisher expectations we don't want to claim).
 */
export function getStructuredDataForArticle(article: Article): ArticleStructuredData {
    const url = getArticleAbsoluteUrl({
        category: article.category,
        slug: article.slug,
        gameSlug: article.game?.slug,
    });

    const node: ArticleNode = {
        "@type": "Article",
        "@id": `${url}#article`,
        headline: article.title,
        description: article.excerpt,
        url,
        datePublished: article.publishedAt,
        dateModified: article._updatedAt,
        mainEntityOfPage: { "@type": "WebPage", "@id": url },
        author: {
            "@type": "Organization",
            name: "aRPG Timeline",
            url: SITE_URL,
        },
        publisher: {
            "@type": "Organization",
            name: "aRPG Timeline",
            logo: { "@type": "ImageObject", url: `${SITE_URL}/assets/seoimage.png` },
        },
    };

    if (article.coverImage?.asset?.url) {
        node.image = { "@type": "ImageObject", url: article.coverImage.asset.url };
    }

    if (article.game) {
        node.about = { "@type": "VideoGame", name: article.game.name };
    }

    return { "@context": "https://schema.org", "@graph": [node] };
}
