import { describe, expect, it } from "vitest";

import { getGameAlternateNames, getGameNickname } from "./alternateNames";

const game = (slug: string, name: string, shortName: string | null = null) => ({
    slug,
    name,
    shortName,
});

describe("getGameAlternateNames", () => {
    it("lists the short name and the digit spelling of roman numerals", () => {
        expect(getGameAlternateNames(game("diablo-iv", "Diablo IV", "D4"))).toEqual([
            "D4",
            "Diablo 4",
        ]);
        expect(
            getGameAlternateNames(game("diablo-ii-resurrected", "Diablo II: Resurrected")),
        ).toEqual(["Diablo 2 Resurrected"]);
    });

    it("adds hardcoded aliases", () => {
        expect(getGameAlternateNames(game("path-of-exile", "Path of Exile", "PoE"))).toEqual([
            "PoE",
            "POE1",
        ]);
    });

    it("skips names that only differ by case, spacing or punctuation", () => {
        expect(getGameAlternateNames(game("crystalfall", "Crystalfall", "crystalfall"))).toEqual(
            [],
        );
        expect(getGameAlternateNames(game("path-of-exile-2", "Path of Exile 2", "PoE2"))).toEqual([
            "PoE2",
        ]);
    });

    it("leaves names without numerals alone", () => {
        expect(getGameAlternateNames(game("grim-dawn", "Grim Dawn"))).toEqual([]);
        expect(getGameAlternateNames(game("x", "I Am Legion"))).toEqual([]);
    });
});

describe("getGameNickname", () => {
    it("is the short name when it differs from the name", () => {
        expect(getGameNickname(game("last-epoch", "Last Epoch", "LE"))).toBe("LE");
        expect(getGameNickname(game("crystalfall", "Crystalfall", "crystalfall"))).toBeNull();
        expect(getGameNickname(game("grim-dawn", "Grim Dawn"))).toBeNull();
    });
});
