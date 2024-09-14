import * as fsPromises from "fs/promises";
import fetch, { Response } from "node-fetch";
import path from "path";
import remarkFrontmatter from "remark-frontmatter";
import remarkStringify from "remark-stringify";
import remarkParse from "remark-parse";
import { unified } from "unified";
import { read } from "to-vfile";
import { matter } from "vfile-matter";
import { XMLParser } from "fast-xml-parser";
import { fileURLToPath } from "url";
import { dirname } from "path";
import {
  Notification,
  SteamRssFeed,
  CrawlerSource,
  Game,
  CrawlerSourceSteam,
  CrawlerSourceHttp,
  CrawlerSourceReddit,
  FetchSource,
  RedditRssFeed,
} from "./types";

// Resolve directory paths for the current file
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const discordWebhookUrl = process.env.DISCORD_WEBHOOK_URL as string;
const sourcesMarkdownDirectoryPath = path.resolve(
  __dirname,
  "../../../src/documents/crawlerSources",
);
const gamesMarkdownDirectoryPath = path.resolve(
  __dirname,
  "../../../src/documents/games",
);

// Function to handle promises with a timeout
const withTimeout = async <T>(
  promise: Promise<T>,
  timeout: number,
): Promise<T> => {
  const timeoutPromise = new Promise<T>((_, reject) =>
    setTimeout(() => reject(new Error("Operation timed out")), timeout),
  );
  return Promise.race([promise, timeoutPromise]);
};

const loadFromMarkdown = async <T>(directoryPath: string): Promise<T[]> => {
  const fileNames = await fsPromises.readdir(directoryPath);
  const values: T[] = [];

  for (const fileName of fileNames) {
    const filePath = path.join(directoryPath, fileName);
    const file = await unified()
      .use(remarkParse)
      .use(remarkStringify)
      .use(remarkFrontmatter)
      .use(() => (_, file) => matter(file))
      .process(await read(filePath));
    values.push(file.data.matter as T);
  }

  return values;
};

const isAtMost12HoursAgo = (date: Date): boolean => {
  const today = new Date();
  const _12hoursInMillis = 12 * 60 * 60 * 1000;
  return today.getTime() - date.getTime() <= _12hoursInMillis;
};

const matchSteamRss = async (
  source: FetchSource,
  keywords: string[],
  rssFeed: SteamRssFeed,
): Promise<[string | undefined] | [undefined, string]> => {
  if (!rssFeed?.rss) {
    throw new Error("Failed to parse RSS");
  }
  const items = rssFeed.rss.channel.item;
  const titles = items.map((item) => item.title);
  const descriptions = items.map((item) => item.description);

  if (source.options?.notifyAboutNews) {
    const news = items
      .filter((item) => isAtMost12HoursAgo(new Date(item.pubDate)))
      .map((item) => ` - ${item.title}`);
    if (news.length > 0) {
      return [undefined, news.join("\n")];
    }
  }

  const keywordMatch = keywords.find((k) =>
    titles.some((title) => title.toLowerCase().includes(k.toLowerCase())),
  );

  if (!keywordMatch && source.options?.crawlDescriptions) {
    return [
      keywords.find((k) =>
        descriptions.some((desc) =>
          desc.toLowerCase().includes(k.toLowerCase()),
        ),
      ),
    ];
  }

  return [keywordMatch];
};

const matchRedditRss = async (
  source: FetchSource,
  keywords: string[],
  rssFeed: RedditRssFeed,
): Promise<[string | undefined, string | undefined] | [null, string]> => {
  if (!rssFeed?.feed) {
    throw new Error("Failed to parse RSS");
  }
  const items = rssFeed.feed.entry;
  const titles = items.map((item) => item.title);
  const descriptions = items.map((item) => item.content);

  if (source.options?.notifyAboutNews) {
    const news = items
      .filter((item) => isAtMost12HoursAgo(new Date(item.published)))
      .map((item) => ` - ${item.title}`);
    if (news.length > 0) {
      return [null, news.join("\n")];
    }
  }

  for (const keyword of keywords) {
    const titleIndex = titles.findIndex((title) =>
      title.toLowerCase().includes(keyword.toLowerCase()),
    );

    if (titleIndex !== -1) {
      return [keyword, titles[titleIndex]];
    }
  }

  if (source.options?.crawlDescriptions) {
    for (const keyword of keywords) {
      const descIndex = descriptions.findIndex((desc) =>
        desc.toLowerCase().includes(keyword.toLowerCase()),
      );

      if (descIndex !== -1) {
        return [keyword, titles[descIndex]];
      }
    }
  }

  return [undefined, undefined];
};

const matchKeywordOrRss = async (
  source: FetchSource,
  keywords: string[],
  result: Response,
): Promise<(string | null | undefined)[]> => {
  const text = await result.text();

  if (!source.options?.rss) {
    const normalized = text.toLowerCase();
    return [keywords.find((k) => normalized.includes(k.toLowerCase())), null];
  }

  const parser = new XMLParser();

  if (source.type === "crawlerSources_steam") {
    const rssFeed: SteamRssFeed = parser.parse(text);
    return matchSteamRss(source, keywords, rssFeed);
  } else if (source.type === "crawlerSources_reddit") {
    const rssFeed: RedditRssFeed = parser.parse(text);
    return matchRedditRss(source, keywords, rssFeed);
  } else {
    throw new Error("Unsupported RSS");
  }
};

// Function to get notifications based on the source and keywords
const getSourceNotification = async (
  game: Game,
  source: FetchSource,
  keywords: string[],
): Promise<Notification> => {
  try {
    const result = await withTimeout(fetch(source.url), 5000);

    if (!result.ok) {
      return {
        type: "error",
        game: game.name,
        text: `❌ **${game.name}**: Failed to fetch data from \`${source.url}\`: ${result.status} - ${result.statusText}`,
      };
    }

    const [keywordMatch, notes] = await matchKeywordOrRss(
      source,
      keywords,
      result,
    );

    if (notes) {
      return {
        type: "warn",
        game: game.name,
        text: `📡 **${game.name}**: New RSS messages:\n${notes}`,
      };
    } else if (keywordMatch) {
      return {
        type: "warn",
        game: game.name,
        text: `🔍 **${game.name}**: \`${keywordMatch}\` keyword match on \`${source.url}\``,
      };
    } else {
      return {
        type: "trace",
        game: game.name,
        text: `🔇 **${game.name}**: Nothing found on \`${source.url}\``,
      };
    }
  } catch (error) {
    return {
      type: "error",
      game: game.name,
      text: `❌ **${game.name}**: Error fetching data from \`${source.url}\`: ${(error as Error).message}`,
    };
  }
};

const crawlSteamForNotifications = (
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

const crawlHttpForNotifications = (
  source: CrawlerSourceHttp,
): FetchSource[] => {
  return [
    {
      type: source.type,
      url: source.source,
    },
  ];
};

const crawlRedditForNotifications = (
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

const crawlForNotifications = async (
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
      const notification = await getSourceNotification(game, s, keywords);
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

// Function to send notifications to Discord
const sendDiscordNotification = async (notifications: Notification[]) => {
  const importantNotifications = notifications.filter(
    (n) => n.type !== "trace",
  );
  const parsedNotifications = importantNotifications
    .map((n) => `- ${n.text}`)
    .join("\n");

  let content: string;

  if (importantNotifications.length === 0) {
    content = `🔇 *Crawler successfully checked ${notifications.length} sources without any match*`;
  } else {
    content = `⚠️ **Crawler got ${importantNotifications.length} alert(s)** @here\n\n${parsedNotifications}`;
  }

  try {
    await fetch(discordWebhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "aRPG Timeline Crawler",
        content: content,
      }),
    });
    console.log("✅ Posted message to Discord!");
  } catch (e) {
    console.error("❌ Failed to send a message to Discord", e);
    throw e;
  }
};

// Main function to get game notifications and send them to Discord
const getGameNotifications = async (
  source: CrawlerSource[],
  games: Game[],
): Promise<Notification[]> => {
  const notifications: Notification[] = [];

  await Promise.all(
    source.map((source) =>
      crawlForNotifications(
        source,
        games.find((g) => g.name === source.game) ?? { name: "Unknown game" },
        notifications,
      ),
    ),
  );

  return notifications.sort((a, b) => a.game.localeCompare(b.game));
};

// Execute the script
(async () => {
  const [sources, games] = await Promise.all([
    loadFromMarkdown<CrawlerSource>(sourcesMarkdownDirectoryPath),
    loadFromMarkdown<Game>(gamesMarkdownDirectoryPath),
  ]);

  const notifications = await getGameNotifications(sources, games);
  console.log(notifications);

  if (notifications.length > 0) {
    await sendDiscordNotification(notifications);
  }
})();
