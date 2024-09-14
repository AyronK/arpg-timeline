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

export interface RssFeed {
  rss: {
    version: string;
    channel: RssChannel;
  };
}

export interface RssChannel {
  title: string;
  description: string;
  link: string;
  item: RssItem[];
}

export interface RssItem {
  title: string;
  link: string;
  description: string;
  pubDate: string; // Date in RFC 822 format
  [key: string]: any; // Allows additional optional fields
}
