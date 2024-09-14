import { CrawlerSourceSteam, FetchSource } from "../types";

export const crawlSteamForNotifications = (
  source: CrawlerSourceSteam,
): FetchSource[] => {
  const mappedSources: FetchSource[] = [];
  mappedSources.push({
    type: source.type,
    url: `https://store.steampowered.com/feeds/news/app/${source.steamId}/`,
    options: {
      rss: true,
      crawlDescriptions: source.crawlDescriptions || false,
    },
  });

  if (source.notifyAboutNews) {
    mappedSources.push({
      type: source.type,
      url: `https://store.steampowered.com/feeds/news/app/${source.steamId}/`,
      options: {
        rss: true,
        notifyAboutNews: true,
      },
    });
  }

  return mappedSources;
};

