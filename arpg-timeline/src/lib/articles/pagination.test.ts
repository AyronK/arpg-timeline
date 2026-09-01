import { describe, expect, it } from "vitest";

import { buildPageHref, getPageTokens, parsePageParam } from "./pagination";

describe("parsePageParam", () => {
    it("defaults to 1 when absent, empty, or invalid", () => {
        expect(parsePageParam(undefined)).toBe(1);
        expect(parsePageParam("")).toBe(1);
        expect(parsePageParam("abc")).toBe(1);
        expect(parsePageParam("0")).toBe(1);
        expect(parsePageParam("-3")).toBe(1);
        expect(parsePageParam("2.5")).toBe(1);
    });

    it("parses a valid positive integer", () => {
        expect(parsePageParam("2")).toBe(2);
        expect(parsePageParam("47")).toBe(47);
    });

    it("takes the first value when given an array", () => {
        expect(parsePageParam(["3", "9"])).toBe(3);
    });
});

describe("buildPageHref", () => {
    it("returns the bare index for page 1", () => {
        expect(buildPageHref("/news", 1)).toBe("/news");
        expect(buildPageHref("/news", 0)).toBe("/news");
    });

    it("uses a /page/N segment for later pages", () => {
        expect(buildPageHref("/news", 2)).toBe("/news/page/2");
        expect(buildPageHref("/game/poe/resources", 5)).toBe("/game/poe/resources/page/5");
    });
});

describe("getPageTokens", () => {
    it("lists every page when there are 7 or fewer", () => {
        expect(getPageTokens(1, 1)).toEqual([1]);
        expect(getPageTokens(3, 7)).toEqual([1, 2, 3, 4, 5, 6, 7]);
    });

    it("windows around the current page with ellipses", () => {
        expect(getPageTokens(1, 20)).toEqual([1, 2, "ellipsis", 20]);
        expect(getPageTokens(10, 20)).toEqual([1, "ellipsis", 9, 10, 11, "ellipsis", 20]);
        expect(getPageTokens(20, 20)).toEqual([1, "ellipsis", 19, 20]);
    });

    it("does not emit an ellipsis for a single hidden page", () => {
        expect(getPageTokens(3, 8)).toEqual([1, 2, 3, 4, "ellipsis", 8]);
    });
});
