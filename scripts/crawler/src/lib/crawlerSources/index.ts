import { Notification } from "../types";

import { fetchSourceNotifications } from "./fetch";
import { crawlRedditForNotifications } from "./redditRss";
import { crawlHttpForNotifications } from "./rawHtmlText";
import { crawlSteamForNotifications } from "./steamRss";
import {
  CrawlerSource,
  Game,
  FetchSource,
  CrawlerSourceHttp,
  CrawlerSourceSteam,
  CrawlerSourceReddit,
} from "../types";

export const crawlForNotifications = async (
  source: CrawlerSource,
  game: Game,
  notifications: Notification[],
) => {
  let mappedSources: FetchSource[] = [];
  const keywords = game.crawlerSettings?.keywords ?? [];
  switch (source.type) {
    case "crawlerSources_http":
      mappedSources = crawlHttpForNotifications(source as CrawlerSourceHttp);
      break;
    case "crawlerSources_steam":
      mappedSources = crawlSteamForNotifications(source as CrawlerSourceSteam);
      break;
    case "crawlerSources_reddit":
      mappedSources = crawlRedditForNotifications(
        source as CrawlerSourceReddit,
      );
      break;
  }

  const fetchPromises = mappedSources.map(async (s) => {
    try {
      const notification = await fetchSourceNotifications(game, s, keywords);
      notifications.push(notification);
    } catch (error) {
      notifications.push({
        type: "error",
        game: game.name,
        text: `❌ **${game.name}**: Error fetching data from \`${s.url}\`: ${(error as Error).message}`,
      });
    }
  });

  await Promise.all(fetchPromises);
};
