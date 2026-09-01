import { describe, expect, it } from "vitest";

import * as Q from "./articleQuery";

const ARTICLE_QUERIES = [
    "articleBySlugQuery",
    "articleByGameAndSlugQuery",
    "articleStaticParamsQuery",
    "articlesByCategoryPageQuery",
    "gameArticlesByCategoryPageQuery",
    "gameArticlesPreviewQuery",
    "articlesCountQuery",
    "gameArticlesCountQuery",
    "relatedArticlesQuery",
] as const;

describe("article visibility gating", () => {
    it.each(ARTICLE_QUERIES)("%s references the productionReady guard", (name) => {
        const query = Q[name] as string;
        expect(query).toContain("productionReady == true || $showUnreleased");
    });

    it("count queries gate every count(...) they contain", () => {
        for (const name of [
            "articlesByCategoryPageQuery",
            "gameArticlesByCategoryPageQuery",
        ] as const) {
            const counts = (Q[name].match(/count\(/g) ?? []).length;
            const guards = (Q[name].match(/\$showUnreleased/g) ?? []).length;
            expect(guards).toBeGreaterThanOrEqual(counts);
        }
    });

    it("the game lookup is not gated (it selects a game, not an article)", () => {
        expect(Q.articleIndexGameQuery).not.toContain("$showUnreleased");
    });
});
