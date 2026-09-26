import { BlizzardNewsFeed } from "@/lib/cms/queries/indexQuery";
import { GameNewsItem } from "@/types/game-news";

function cleanPlainText(html: string): string {
    return html
        .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
        .replace(/<[^>]*>/g, " ")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&nbsp;/g, " ")
        .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
        .replace(/&amp;/g, "&")
        .replace(/\s+/g, " ")
        .trim();
}

export async function getBlizzardNews(feed: BlizzardNewsFeed): Promise<GameNewsItem[]> {
    try {
        const rssUrl = `https://us.forums.blizzard.com/en/${feed}/groups/blizzard-tracker/posts.rss`;

        const response = await fetch(rssUrl, {
            next: { revalidate: 3600 },
        });

        if (!response.ok) {
            console.error(`Failed to fetch Blizzard RSS: ${response.status}`);
            return [];
        }

        const xmlText = await response.text();
        return parseBlizzardRss(xmlText);
    } catch (error) {
        console.error("Error fetching Game news:", error);
        return [];
    }
}

export function parseBlizzardRss(xmlText: string): GameNewsItem[] {
    try {
        const items: GameNewsItem[] = [];
        const seenTitles = new Set<string>();

        const itemMatches = xmlText.match(/<item>[\s\S]*?<\/item>/g);

        if (itemMatches) {
            for (const itemXml of itemMatches) {
                const titleMatch = itemXml.match(/<title>([\s\S]*?)<\/title>/);
                const linkMatch = itemXml.match(/<link>([\s\S]*?)<\/link>/);
                const descriptionMatch = itemXml.match(/<description>([\s\S]*?)<\/description>/);
                const pubDateMatch = itemXml.match(/<pubDate>([\s\S]*?)<\/pubDate>/);

                if (!titleMatch || !linkMatch || !descriptionMatch || !pubDateMatch) continue;

                const title = cleanPlainText(titleMatch[1]);
                const link = cleanPlainText(linkMatch[1]);
                const description = cleanPlainText(descriptionMatch[1]);
                const pubDate = pubDateMatch[1].trim();

                // Staff replies in player threads end in /<n>; keep only topic-opening posts
                if (!/\/1$/.test(link)) continue;
                // Announcements are often cross-posted to several categories
                if (seenTitles.has(title)) continue;

                if (title && link && description && pubDate) {
                    seenTitles.add(title);
                    items.push({ title, link, description, pubDate });
                }
            }
        }

        return items.slice(0, 10);
    } catch (error) {
        console.error("Error parsing Blizzard RSS:", error);
        return [];
    }
}
