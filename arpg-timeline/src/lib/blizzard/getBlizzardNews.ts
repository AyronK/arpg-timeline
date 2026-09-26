import { BlizzardNewsFeed } from "@/lib/cms/queries/indexQuery";
import { GameNewsItem } from "@/types/game-news";

const FULL_ARTICLE_LINK =
    /<a[^>]*href="(https:\/\/news\.blizzard\.com\/[^"]+)"[^>]*>\s*View Full Article\s*<\/a>/i;

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
        const seenLinks = new Set<string>();

        const itemMatches = xmlText.match(/<item>[\s\S]*?<\/item>/g);

        if (itemMatches) {
            for (const itemXml of itemMatches) {
                const titleMatch = itemXml.match(/<title>([\s\S]*?)<\/title>/);
                const linkMatch = itemXml.match(/<link>([\s\S]*?)<\/link>/);
                const descriptionMatch = itemXml.match(/<description>([\s\S]*?)<\/description>/);
                const pubDateMatch = itemXml.match(/<pubDate>([\s\S]*?)<\/pubDate>/);

                if (!titleMatch || !linkMatch || !descriptionMatch || !pubDateMatch) continue;

                const title = cleanPlainText(titleMatch[1]);
                const forumLink = cleanPlainText(linkMatch[1]);
                const fullArticleMatch = descriptionMatch[1].match(FULL_ARTICLE_LINK);
                const link = fullArticleMatch ? fullArticleMatch[1] : forumLink;
                const description = cleanPlainText(
                    descriptionMatch[1].replace(FULL_ARTICLE_LINK, ""),
                );
                const pubDate = pubDateMatch[1].trim();

                // Staff replies in player threads end in /<n>; keep only topic-opening posts
                if (!/\/1$/.test(forumLink)) continue;
                // Announcements are often cross-posted to several categories
                if (seenTitles.has(title) || seenLinks.has(link)) continue;

                if (title && link && pubDate) {
                    seenTitles.add(title);
                    seenLinks.add(link);
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
