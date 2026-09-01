import { describe, expect, it } from "vitest";

import type { ArticleListItem } from "@/lib/cms/queries/articleQuery";

import { pickRelated } from "./related";

const make = (id: string): ArticleListItem =>
    ({ _id: id, slug: id, title: id }) as unknown as ArticleListItem;

describe("pickRelated", () => {
    it("takes same-game items first", () => {
        const result = pickRelated([make("g1"), make("g2")], [make("c1")]);
        expect(result.map((a) => a._id)).toEqual(["g1", "g2", "c1"]);
    });

    it("tops up from same-category when same-game is short", () => {
        const result = pickRelated([make("g1")], [make("c1"), make("c2"), make("c3")]);
        expect(result.map((a) => a._id)).toEqual(["g1", "c1", "c2"]);
    });

    it("dedupes items present in both lists", () => {
        const result = pickRelated([make("a"), make("b")], [make("b"), make("c"), make("d")]);
        expect(result.map((a) => a._id)).toEqual(["a", "b", "c"]);
    });

    it("caps at the limit", () => {
        const result = pickRelated([], [make("c1"), make("c2"), make("c3"), make("c4")], 3);
        expect(result).toHaveLength(3);
    });

    it("returns an empty array when there is nothing", () => {
        expect(pickRelated([], [])).toEqual([]);
    });
});
