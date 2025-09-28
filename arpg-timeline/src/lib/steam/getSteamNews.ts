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
        console.error("Error fetching Steam news:", error);
        return [];
    }
}

function parseSteamRss(xmlText: string): SteamNewsItem[] {
    try {
        const items: SteamNewsItem[] = [];

        const titleMatch = xmlText.match(/<title>(.*?)<\/title>/g);
        const linkMatch = xmlText.match(/<link>(.*?)<\/link>/g);
        const descriptionMatch = xmlText.match(/<description>(.*?)<\/description>/g);
        const pubDateMatch = xmlText.match(/<pubDate>(.*?)<\/pubDate>/g);

        if (titleMatch && linkMatch && descriptionMatch && pubDateMatch) {
            const maxItems = Math.min(
                titleMatch.length,
                linkMatch.length,
                descriptionMatch.length,
                pubDateMatch.length,
            );

            for (let i = 1; i < maxItems; i++) {
                const title = titleMatch[i].replace(/<\/?title>/g, "").trim();
                const link = linkMatch[i]
                    .replace(/<\/?link>/g, "")
                    .replace(/<!\[CDATA\[(.*?)\]\]>/, "$1")
                    .trim();
                const description = descriptionMatch[i].replace(/<\/?description>/g, "").trim();
                const pubDate = pubDateMatch[i].replace(/<\/?pubDate>/g, "").trim();

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

        return items.slice(0, 10);
    } catch (error) {
        console.error("Error parsing Steam RSS:", error);
        return [];
    }
}
