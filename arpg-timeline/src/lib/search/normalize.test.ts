import { describe, expect, it } from "vitest";

import { digitsToRoman, normalize, normalizeWithMap, romanToDigits, squash } from "./normalize";

describe("normalize", () => {
    it("lowercases, strips diacritics and punctuation, collapses spaces", () => {
        expect(normalize("  Diablo II:  Resurrected ")).toBe("diablo ii resurrected");
        expect(normalize("Pokémon — Ñu & Co.")).toBe("pokemon nu co");
        expect(normalize("Zizaran's Path")).toBe("zizaran s path");
        expect(normalize("!!!")).toBe("");
    });

    it("squashes spaces away", () => {
        expect(squash(normalize("Grim Dawn"))).toBe("grimdawn");
    });
});

describe("roman numerals", () => {
    it("converts whole words only", () => {
        expect(romanToDigits("diablo iv")).toBe("diablo 4");
        expect(romanToDigits("titan quest ii")).toBe("titan quest 2");
        expect(romanToDigits("median xl")).toBe("median xl");
        expect(romanToDigits("vivid")).toBe("vivid");
    });

    it("converts digits back", () => {
        expect(digitsToRoman("path of exile 2")).toBe("path of exile ii");
        expect(digitsToRoman("wolcen 2")).toBe("wolcen ii");
        expect(digitsToRoman("game 2077")).toBe("game 2077");
    });
});

describe("normalizeWithMap", () => {
    it("maps each normalized character back to the original index", () => {
        const { normalized, map } = normalizeWithMap(" Diablo II: Résurrected");

        expect(normalized).toBe("diablo ii resurrected");
        expect(map).toHaveLength(normalized.length);
        expect(map[0]).toBe(1);
        expect(map[normalized.indexOf("resurrected")]).toBe(12);
        expect(map[normalized.length - 1]).toBe(22);
    });
});
