import { CrawlerSourceReddit, FetchSource } from "../types";

export const crawlRedditForNotifications = (
  source: CrawlerSourceReddit,
): FetchSource[] => {
  return [
    {
      type: source.type,
      url: `https://www.reddit.com/r/${source.subreddit}/hot.rss`,
      options: {
        rss: true,
        crawlDescriptions: source.crawlDescriptions || false,
      },
    },
  ];
};
