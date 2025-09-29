export interface SteamNewsItem {
    title: string;
    link: string;
    description: string;
    pubDate: string;
}

function cleanPlainText(html: string): string {
    return html
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&amp;/g, "&")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&nbsp;/g, " ")
        .replace(/<[^>]*>/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

export async function getSteamNews(appId: number): Promise<SteamNewsItem[]> {
    try {
        const steamRssUrl = `https://store.steampowered.com/feeds/news/app/${appId}/`;

        const response = await fetch(steamRssUrl, {
            next: { revalidate: 3600 },
        });

        if (!response.ok) {
            console.error(`Failed to fetch Steam RSS: ${response.status}`);
            return [];
        }

        const xmlText = await response.text();
        return parseSteamRss(xmlText);
    } catch (error) {
        console.error("Error fetching Game news:", error);
        return [];
    }
}

function parseSteamRss(xmlText: string): SteamNewsItem[] {
    try {
        const items: SteamNewsItem[] = [];

        const itemMatches = xmlText.match(/<item>[\s\S]*?<\/item>/g);

        if (itemMatches) {
            for (const itemXml of itemMatches) {
                const titleMatch = itemXml.match(/<title>(.*?)<\/title>/);
                const linkMatch = itemXml.match(/<link>(.*?)<\/link>/);
                const descriptionMatch = itemXml.match(/<description>(.*?)<\/description>/);
                const pubDateMatch = itemXml.match(/<pubDate>(.*?)<\/pubDate>/);

                if (titleMatch && linkMatch && descriptionMatch && pubDateMatch) {
                    const title = titleMatch[1].trim();
                    const link = linkMatch[1].replace(/<!\[CDATA\[(.*?)\]\]>/, "$1").trim();
                    const description = descriptionMatch[1].trim();
                    const pubDate = pubDateMatch[1].trim();

                    if (title && link && description && pubDate) {
                        items.push({
                            title: cleanPlainText(title),
                            link: cleanPlainText(link),
                            description: cleanPlainText(description),
                            pubDate,
                        });
                    }
                }
            }
        }

        return items.slice(0, 10);
    } catch (error) {
        console.error("Error parsing Steam RSS:", error);
        return [];
    }
}
