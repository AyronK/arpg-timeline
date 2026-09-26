import { describe, expect, it } from "vitest";

import { parseBlizzardRss } from "./getBlizzardNews";

const item = (title: string, link: string, description: string) => `
      <item>
        <title>${title}</title>
        <description><![CDATA[ ${description} ]]></description>
        <link>${link}</link>
        <pubDate>Fri, 25 Sep 2026 17:00:14 +0000</pubDate>
      </item>`;

const rss = (...items: string[]) => `<rss><channel>${items.join("")}</channel></rss>`;

describe("parseBlizzardRss", () => {
    it("parses multiline CDATA descriptions into plain text", () => {
        const [news] = parseBlizzardRss(
            rss(
                item(
                    "HOTFIX 4 - 3.2.1",
                    "https://us.forums.blizzard.com/en/d4/t/hotfix-4/269299/1",
                    "<p><strong>Bug Fixes</strong></p>\n<ul>\n<li>Fixed Wirt’s coins.</li>\n</ul>",
                ),
            ),
        );
        expect(news).toEqual({
            title: "HOTFIX 4 - 3.2.1",
            link: "https://us.forums.blizzard.com/en/d4/t/hotfix-4/269299/1",
            description: "Bug Fixes Fixed Wirt’s coins.",
            pubDate: "Fri, 25 Sep 2026 17:00:14 +0000",
        });
    });

    it("decodes entities in titles", () => {
        const [news] = parseBlizzardRss(
            rss(item("Hell&#39;s Legacy &amp; &quot;More&quot;", "https://x/t/a/1/1", "<p>a</p>")),
        );
        expect(news.title).toBe(`Hell's Legacy & "More"`);
    });

    it("skips staff replies in player threads", () => {
        const news = parseBlizzardRss(
            rss(item("Tree of Whispers bug", "https://x/t/tree/2/176", "<p>Looking into it</p>")),
        );
        expect(news).toEqual([]);
    });

    it("drops cross-posted duplicates by title", () => {
        const news = parseBlizzardRss(
            rss(
                item("Season 40 Preview", "https://x/t/s40/1/1", "<p>a</p>"),
                item("Season 40 Preview", "https://x/t/s40/2/1", "<p>a</p>"),
            ),
        );
        expect(news).toHaveLength(1);
    });

    it("prefers the news.blizzard.com article over the forum post", () => {
        const [news] = parseBlizzardRss(
            rss(
                item(
                    "Diablo IV Patch Notes",
                    "https://us.forums.blizzard.com/en/d4/t/diablo-iv-patch-notes/269749/1",
                    '<p><img src="https://x/a.png" alt="Diablo IV Patch Notes"></p><p>We will update this article.</p><p><a href="https://news.blizzard.com/en-us/article/24295395">View Full Article</a></p>',
                ),
            ),
        );
        expect(news.link).toBe("https://news.blizzard.com/en-us/article/24295395");
        expect(news.description).toBe("We will update this article.");
    });
});
