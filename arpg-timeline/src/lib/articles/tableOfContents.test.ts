import type { PortableTextBlock } from "next-sanity";
import { describe, expect, it } from "vitest";

import { extractToc, slugifyHeading } from "./tableOfContents";

const heading = (style: string, text: string, key: string): PortableTextBlock =>
    ({
        _type: "block",
        _key: key,
        style,
        children: [{ _type: "span", _key: `${key}s`, text, marks: [] }],
        markDefs: [],
    }) as unknown as PortableTextBlock;

const para = (text: string, key: string): PortableTextBlock =>
    ({
        _type: "block",
        _key: key,
        style: "normal",
        children: [{ _type: "span", _key: `${key}s`, text, marks: [] }],
        markDefs: [],
    }) as unknown as PortableTextBlock;

describe("slugifyHeading", () => {
    it("lowercases, strips punctuation, hyphenates", () => {
        expect(slugifyHeading("The Fragment Tab & Stash Basics!")).toBe(
            "the-fragment-tab-stash-basics",
        );
        expect(slugifyHeading("  spaced   out  ")).toBe("spaced-out");
    });
});

describe("extractToc", () => {
    it("collects h2 and h3, ignores other blocks", () => {
        const body = [
            heading("h2", "Intro", "a"),
            para("hello", "b"),
            heading("h3", "Details", "c"),
            heading("h4", "Too deep", "d"),
        ];
        expect(extractToc(body)).toEqual([
            { id: "intro", text: "Intro", level: 2 },
            { id: "details", text: "Details", level: 3 },
        ]);
    });

    it("disambiguates duplicate heading slugs", () => {
        const body = [
            heading("h2", "Setup", "a"),
            heading("h2", "Setup", "b"),
            heading("h2", "Setup", "c"),
        ];
        expect(extractToc(body).map((h) => h.id)).toEqual(["setup", "setup-2", "setup-3"]);
    });

    it("handles empty / missing input", () => {
        expect(extractToc([])).toEqual([]);
        expect(extractToc(undefined)).toEqual([]);
        expect(extractToc(null)).toEqual([]);
    });
});
