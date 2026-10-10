import { describe, expect, it } from "vitest";

import { compareDates, inGracePeriod, isOver } from "./sortBySeasons";

// The parser guards these; covered here so the arms are pinned before refactoring
describe("inGracePeriod", () => {
    it("is false without a start date", () => {
        expect(inGracePeriod(null)).toBe(false);
        expect(inGracePeriod(undefined, "2026-10-10T00:00:00.000Z")).toBe(false);
    });
});

describe("isOver", () => {
    it("is false without an end date", () => {
        expect(isOver(null)).toBe(false);
        expect(isOver(undefined)).toBe(false);
    });
});

describe("compareDates", () => {
    it("orders dated before undated", () => {
        expect(compareDates("2026-10-10T00:00:00.000Z", null)).toBe(-1);
        expect(compareDates(undefined, "2026-10-10T00:00:00.000Z")).toBe(1);
        expect(compareDates(null, undefined)).toBe(0);
    });
});
