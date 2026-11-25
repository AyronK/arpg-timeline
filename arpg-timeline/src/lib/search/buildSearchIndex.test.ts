import { createHash } from "node:crypto";
import { gzipSync } from "node:zlib";

import { describe, expect, it } from "vitest";

import { SearchIndexQueryResult, SearchIndexSanityGame } from "@/lib/cms/queries/searchIndexQuery";

import { buildSearchIndex } from "./buildSearchIndex";
import { decodeSearchIndex } from "./searchIndexCodec";

const BUDGET_GAME_COUNT = 100;
const PAYLOAD_BUDGET_BYTES = 30 * 1024;

const logo = (seed: string) => {
    const hash = createHash("sha1").update(seed).digest("hex");
    return {
        _id: `image-${hash}-512x512-png`,
        url: `https://cdn.sanity.io/images/s0pirkvm/production/${hash}-512x512.png`,
    } as SearchIndexSanityGame["logo"];
};

const game = (i: number): SearchIndexSanityGame => ({
    slug: `game-slug-number-${i}`,
    name: `Game Title Number ${i}: Resurrected Edition`,
    shortName: `GT${i}`,
    group: `Group ${i % 7}`,
    isDormant: true,
    isComingSoon: true,
    categories: ["seasonal", "early-access"],
    logo: logo(`logo${i}`),
    url: `https://www.game-title-number-${i}.com/news/latest`,
});

describe("buildSearchIndex", () => {
    it("survives a round trip", () => {
        const g = game(1);
        const [decoded] = decodeSearchIndex(buildSearchIndex({ games: [g] })).games;

        expect(decoded).toEqual({
            slug: g.slug,
            name: g.name,
            shortName: g.shortName,
            group: g.group,
            logoSrc: expect.any(String),
            categories: g.categories,
            isDormant: true,
            isComingSoon: true,
            url: g.url,
        });
    });

    it("decodes missing optional fields as null", () => {
        const bare: SearchIndexSanityGame = {
            slug: "bare",
            name: "Bare",
            categories: [],
            logo: null as unknown as SearchIndexSanityGame["logo"],
        };
        const [decoded] = decodeSearchIndex(buildSearchIndex({ games: [bare] })).games;

        expect(decoded).toMatchObject({
            shortName: null,
            group: null,
            logoSrc: null,
            isDormant: false,
            isComingSoon: false,
            url: null,
        });
    });

    it("decodes rows cached before the website field existed", () => {
        const [row] = buildSearchIndex({ games: [game(3)] });
        const [decoded] = decodeSearchIndex([row.slice(0, 7) as typeof row]).games;

        expect(decoded!.url).toBeNull();
    });

    it("serves logos through the Next image optimizer, resized", () => {
        const [row] = buildSearchIndex({ games: [game(2)] });
        const src = new URL(row[4], "https://example.com");

        expect(src.pathname).toBe("/_next/image");
        expect(src.searchParams.get("url")).toMatch(/^https:\/\/cdn\.sanity\.io\/.*\bw=256\b/);
    });

    it("exposes no Sanity ids, seasons or dates", () => {
        const json = JSON.stringify(buildSearchIndex({ games: [game(3)] }));

        expect(json).not.toMatch(/_id|_updatedAt|image-[0-9a-f]+-|\bseasons?\b|\d{4}-\d{2}-\d{2}/i);
    });

    it(`stays under ${PAYLOAD_BUDGET_BYTES / 1024} KB gzipped for ${BUDGET_GAME_COUNT} games`, () => {
        const data: SearchIndexQueryResult = {
            games: Array.from({ length: BUDGET_GAME_COUNT }, (_, i) => game(i)),
        };
        const json = JSON.stringify(buildSearchIndex(data));
        const gzipped = gzipSync(json).length;

        console.info(
            `Search index payload: ${(json.length / 1024).toFixed(1)} KB raw, ${(gzipped / 1024).toFixed(1)} KB gzipped (${BUDGET_GAME_COUNT} games)`,
        );
        expect(gzipped).toBeLessThan(PAYLOAD_BUDGET_BYTES);
    });
});
