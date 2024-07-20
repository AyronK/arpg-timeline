export interface GameCrawlerSettings {
  steamId?: string;
  steamRss?: {
    crawlDescriptions?: boolean;
    notifyAboutNews?: boolean;
  };
  sources?: string[];
  keywords?: string[];
}

export interface Game {
  title: string;
  crawlerSettings?: GameCrawlerSettings;
}

export interface Source {
  url: string;
  options: {
    rss?: boolean;
    crawlDescriptions?: boolean;
    notifyAboutNews?: boolean;
  };
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
