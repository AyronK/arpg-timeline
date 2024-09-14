import { CrawlerSourceHttp, FetchSource } from "../types";

export const crawlHttpForNotifications = (
  source: CrawlerSourceHttp,
): FetchSource[] => {
  return [
    {
      type: source.type,
      url: source.source,
    },
  ];
};
