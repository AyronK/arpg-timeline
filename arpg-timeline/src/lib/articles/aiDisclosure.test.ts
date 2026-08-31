import { describe, expect, it } from "vitest";

import { AI_DISCLOSURE_MAX, AI_DISCLOSURE_META, getAiDisclosureMeta } from "./aiDisclosure";

describe("AI_DISCLOSURE_META", () => {
    it("covers all five disclosure values", () => {
        expect(Object.keys(AI_DISCLOSURE_META).sort()).toEqual(
            ["assisted", "fully-generated", "none", "redacted", "styling"].sort(),
        );
    });

    it("maps values onto the 0..MAX scale in order", () => {
        expect(AI_DISCLOSURE_META.none.degree).toBe(0);
        expect(AI_DISCLOSURE_META.styling.degree).toBe(1);
        expect(AI_DISCLOSURE_META.assisted.degree).toBe(2);
        expect(AI_DISCLOSURE_META.redacted.degree).toBe(3);
        expect(AI_DISCLOSURE_META["fully-generated"].degree).toBe(AI_DISCLOSURE_MAX);
    });

    it("every entry has label / description / tone", () => {
        for (const meta of Object.values(AI_DISCLOSURE_META)) {
            expect(meta.label).toBeTruthy();
            expect(meta.description).toBeTruthy();
            expect(["neutral", "info", "caution"]).toContain(meta.tone);
        }
    });
});

describe("getAiDisclosureMeta", () => {
    it("returns the matching entry", () => {
        expect(getAiDisclosureMeta("fully-generated").tone).toBe("caution");
    });

    it("falls back to `none` for undefined / unknown", () => {
        expect(getAiDisclosureMeta(undefined)).toBe(AI_DISCLOSURE_META.none);
        expect(getAiDisclosureMeta(null)).toBe(AI_DISCLOSURE_META.none);
    });
});
