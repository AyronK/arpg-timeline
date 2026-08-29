import { describe, expect, it } from "vitest";

import { sanitizeNewsDescription } from "./sanitizeNewsDescription";

describe("sanitizeNewsDescription", () => {
    it("returns plain text unchanged", () => {
        expect(sanitizeNewsDescription("A new season has begun.")).toBe(
            "A new season has begun.",
        );
    });

    it("strips emoji pictographs", () => {
        expect(sanitizeNewsDescription("Patch notes 🎉 are live 🚀")).toBe(
            "Patch notes are live",
        );
    });

    it("strips flag (regional indicator) emojis", () => {
        expect(sanitizeNewsDescription("Servers up 🇺🇸🇪🇺 now")).toBe("Servers up now");
    });

    it("strips emojis with skin-tone modifiers and ZWJ sequences", () => {
        expect(sanitizeNewsDescription("Thanks 👍🏽 from the team 👨‍👩‍👧")).toBe(
            "Thanks from the team",
        );
    });

    it("strips keycap emojis", () => {
        expect(sanitizeNewsDescription("Tip #1️⃣ read the notes")).toBe("Tip #1 read the notes");
    });

    it("removes http and https URLs", () => {
        expect(
            sanitizeNewsDescription("Read more at https://example.com/news?id=1 today"),
        ).toBe("Read more at today");
    });

    it("removes bare www URLs", () => {
        expect(sanitizeNewsDescription("Visit www.example.com for details")).toBe(
            "Visit for details",
        );
    });

    it("collapses whitespace left behind by removals", () => {
        expect(sanitizeNewsDescription("Start   🎮   https://a.co    end")).toBe("Start end");
    });

    it("trims leading and trailing whitespace", () => {
        expect(sanitizeNewsDescription("   hello   ")).toBe("hello");
    });

    it("handles an empty string", () => {
        expect(sanitizeNewsDescription("")).toBe("");
    });

    it("preserves non-ASCII text that is not emoji", () => {
        expect(sanitizeNewsDescription("Nouvelle saison — détails à venir")).toBe(
            "Nouvelle saison — détails à venir",
        );
    });
});
