export interface CrawlerSourceHttp {
  type: "crawlerSources_http";
  game: string;
  source: string;
}

export interface CrawlerSourceSteam {
  type: "crawlerSources_steam";
  game: string;
  steamId: string;
  crawlDescriptions?: boolean;
  notifyAboutNews?: boolean;
}

export interface CrawlerSourceReddit {
  type: "crawlerSources_reddit";
  game: string;
  subreddit: string;
  crawlDescriptions?: boolean;
  notifyAboutNews?: boolean;
}

export type CrawlerSource =
  | CrawlerSourceHttp
  | CrawlerSourceSteam
  | CrawlerSourceReddit;

export type Game = {
  name: string;
  crawlerSettings?:
    | {
        keywords: string[];
      }
    | undefined;
};

export interface FetchSource {
  type:
    | "crawlerSources_reddit"
    | "crawlerSources_http"
    | "crawlerSources_steam";
  url: string;
  options?:
    | {
        rss?: boolean;
        crawlDescriptions?: boolean;
        notifyAboutNews?: boolean;
      }
    | undefined;
}

export interface Notification {
  type: "trace" | "warn" | "error";
  game: string;
  text: string;
}

export interface SteamRssFeed {
  rss: {
    version: string;
    channel: SteamRssChannel;
  };
}

export interface SteamRssChannel {
  title: string;
  description: string;
  link: string;
  item: SteamRssItem[];
}

export interface RedditRssFeed {
  feed: {
    entry: RedditRssEntry[];
  };
}

export interface RedditRssEntry {
  content: Content;
  title: string;
  published: string;
}

export interface SteamRssItem {
  title: string;
  link: string;
  description: string;
  pubDate: string;
}
