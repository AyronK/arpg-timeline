import { describe, expect, it } from "vitest";

import { AI_DISCLOSURE_META, getAiDisclosureMeta } from "./aiDisclosure";

describe("AI_DISCLOSURE_META", () => {
    it("covers all five disclosure values", () => {
        expect(Object.keys(AI_DISCLOSURE_META).sort()).toEqual(
            ["assisted", "fully-generated", "none", "redacted", "styling"].sort(),
        );
    });

    it("every entry has a label, description and tone", () => {
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
    });
});
