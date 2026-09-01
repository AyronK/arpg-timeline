import { describe, expect, it } from "vitest";

import { getArticleAbsoluteUrl, getArticleIndexPath, getArticlePath } from "./articleUrl";

describe("getArticlePath", () => {
    it("builds root paths per category", () => {
        expect(getArticlePath({ category: "news", slug: "hello" })).toBe("/news/hello");
        expect(getArticlePath({ category: "resources", slug: "guide" })).toBe("/resources/guide");
    });

    it("nests under the game when game-scoped", () => {
        expect(getArticlePath({ category: "news", slug: "patch", gameSlug: "path-of-exile" })).toBe(
            "/game/path-of-exile/news/patch",
        );
        expect(getArticlePath({ category: "resources", slug: "atlas", gameSlug: "poe" })).toBe(
            "/game/poe/resources/atlas",
        );
    });

    it("treats null/undefined gameSlug as root", () => {
        expect(getArticlePath({ category: "news", slug: "x", gameSlug: null })).toBe("/news/x");
        expect(getArticlePath({ category: "news", slug: "x", gameSlug: undefined })).toBe(
            "/news/x",
        );
    });
});

describe("getArticleIndexPath", () => {
    it("returns the category index for root and game", () => {
        expect(getArticleIndexPath({ category: "news" })).toBe("/news");
        expect(getArticleIndexPath({ category: "resources", gameSlug: "poe" })).toBe(
            "/game/poe/resources",
        );
    });
});

describe("getArticleAbsoluteUrl", () => {
    it("prefixes the site origin", () => {
        expect(getArticleAbsoluteUrl({ category: "news", slug: "hi" })).toBe(
            "https://www.arpg-timeline.com/news/hi",
        );
    });
});
