import type { PortableTextBlock } from "@portabletext/react";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { ArticleBody } from "./ArticleBody";

const paragraphWithLink = (key: string, href: string): PortableTextBlock => ({
    _type: "block",
    _key: key,
    style: "normal",
    markDefs: [{ _type: "link", _key: `${key}-link`, href }],
    children: [{ _type: "span", _key: `${key}-span`, text: "source", marks: [`${key}-link`] }],
});

const render = (body: PortableTextBlock[]) =>
    renderToStaticMarkup(createElement(ArticleBody, { body }));

const anchors = (html: string) => html.match(/<a [^>]*>/g) ?? [];

describe("ArticleBody links", () => {
    it("renders external links as followed with UTM params", () => {
        const [a] = anchors(render([paragraphWithLink("p1", "https://pathofexile.com/news")]));
        expect(a).toContain('rel="noopener noreferrer"');
        expect(a).not.toContain("nofollow");
        expect(a).toContain('target="_blank"');
        expect(a).toContain("utm_source=arpg-timeline");
        expect(a).toContain("utm_medium=link");
        expect(a).toContain("utm_campaign=article_body");
    });

    it("renders own-domain links as internal", () => {
        const [a] = anchors(
            render([
                paragraphWithLink("p1", "https://www.arpg-timeline.com/game/poe2#next-season"),
            ]),
        );
        expect(a).toContain('href="/game/poe2#next-season"');
        expect(a).not.toContain("rel=");
        expect(a).not.toContain("target=");
        expect(a).not.toContain("utm_");
    });

    it("renders external links in callouts as followed", () => {
        const callout = {
            _type: "callout",
            _key: "c1",
            tone: "info",
            body: [paragraphWithLink("c1p", "https://lastepoch.com/patch-notes")],
        } as unknown as PortableTextBlock;
        const [a] = anchors(render([callout]));
        expect(a).toContain('rel="noopener noreferrer"');
        expect(a).not.toContain("nofollow");
        expect(a).toContain("utm_campaign=article_body");
    });
});
