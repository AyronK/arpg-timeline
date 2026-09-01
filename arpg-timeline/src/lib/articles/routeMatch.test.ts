import { describe, expect, it } from "vitest";

import { articleMatchesRoute } from "./routeMatch";

const root = { category: "news" as const, game: null };
const gameScoped = {
    category: "news" as const,
    game: { slug: "poe", name: "Path of Exile", logo: null },
};

describe("articleMatchesRoute", () => {
    it("root article matches its root route", () => {
        expect(articleMatchesRoute(root, { category: "news" })).toBe(true);
    });

    it("rejects a category mismatch (slug reused across categories)", () => {
        expect(articleMatchesRoute(root, { category: "resources" })).toBe(false);
    });

    it("rejects a root article reached via a game route", () => {
        expect(articleMatchesRoute(root, { category: "news", gameSlug: "poe" })).toBe(false);
    });

    it("rejects a game article reached via the root route", () => {
        expect(articleMatchesRoute(gameScoped, { category: "news" })).toBe(false);
    });

    it("rejects a game article reached via the wrong game", () => {
        expect(articleMatchesRoute(gameScoped, { category: "news", gameSlug: "last-epoch" })).toBe(
            false,
        );
    });

    it("accepts a game article on its own game route", () => {
        expect(articleMatchesRoute(gameScoped, { category: "news", gameSlug: "poe" })).toBe(true);
    });
});
