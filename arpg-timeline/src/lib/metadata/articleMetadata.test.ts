import { describe, expect, it } from "vitest";

import type { Article } from "@/lib/cms/queries/articleQuery";

import { generateArticleMetadata } from "./articleMetadata";

const baseArticle: Article = {
    _id: "1",
    slug: "hello-world",
    category: "news",
    title: "Hello World",
    excerpt: "A short excerpt.",
    aiDisclosure: "none",
    publishedAt: "2026-08-01T00:00:00Z",
    _updatedAt: "2026-08-10T00:00:00Z",
    game: null,
    coverImage: {
        alt: "cover",
        asset: { _id: "img-1", url: "https://cdn.sanity.io/images/p/d/abc-1600x900.jpg" },
    },
    body: [],
};

describe("generateArticleMetadata", () => {
    it("uses title/excerpt when SEO fields are absent", () => {
        const meta = generateArticleMetadata(baseArticle);
        expect(meta.title).toBe("Hello World | aRPG Timeline");
        expect(meta.description).toBe("A short excerpt.");
        expect(meta.alternates?.canonical).toBe("/news/hello-world");
    });

    it("prefers seoTitle / seoDescription", () => {
        const meta = generateArticleMetadata({
            ...baseArticle,
            seoTitle: "SEO Title",
            seoDescription: "SEO description.",
        });
        expect(meta.title).toBe("SEO Title | aRPG Timeline");
        expect(meta.description).toBe("SEO description.");
    });

    it("builds a game-scoped canonical + og url", () => {
        const meta = generateArticleMetadata({
            ...baseArticle,
            game: { slug: "poe", name: "Path of Exile" },
        });
        expect(meta.alternates?.canonical).toBe("/game/poe/news/hello-world");
        expect(meta.openGraph?.url).toBe("https://www.arpg-timeline.com/game/poe/news/hello-world");
    });

    it("crops the cover image to the OG frame", () => {
        const meta = generateArticleMetadata(baseArticle);
        const images = meta.openGraph?.images;
        const first = Array.isArray(images) ? images[0] : images;
        expect(String((first as { url: string }).url)).toContain(
            "w=1200&h=630&fit=crop&auto=format",
        );
    });

    it("falls back to the site default image when no cover", () => {
        const meta = generateArticleMetadata({
            ...baseArticle,
            coverImage: { alt: "", asset: null },
            ogImage: null,
        });
        const images = meta.openGraph?.images;
        const first = Array.isArray(images) ? images[0] : images;
        expect(String((first as { url: string }).url)).toBe(
            "https://www.arpg-timeline.com/assets/seoimage.png",
        );
    });
});
