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
import { Game, Source, Notification, RssFeed } from "./types";

// Resolve directory paths for the current file
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const discordWebhookUrl = process.env.DISCORD_WEBHOOK_URL as string;
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

// Function to load game data from markdown files
const loadGames = async (directoryPath: string): Promise<Game[]> => {
  const gameFileNames = await fsPromises.readdir(directoryPath);
  const games: Game[] = [];

  for (const gameFileName of gameFileNames) {
    const gameFilePath = path.join(directoryPath, gameFileName);
    const file = await unified()
      .use(remarkParse)
      .use(remarkStringify)
      .use(remarkFrontmatter)
      .use(() => (_, file) => matter(file))
      .process(await read(gameFilePath));
    games.push(file.data.matter as Game);
  }

  return games;
};

// Function to check if a date is within the last 2 days
const isAtMostTwoDaysAgo = (date: Date): boolean => {
  const today = new Date();
  const twoDaysInMillis = 2 * 24 * 60 * 60 * 1000;
  return today.getTime() - date.getTime() <= twoDaysInMillis;
};

// Function to match keywords or RSS feed content
const matchKeywordOrRss = async (
  source: Source,
  keywords: string[],
  result: Response,
): Promise<[string | undefined] | [null, string]> => {
  const text = await result.text();

  if (!source.options.rss) {
    const normalized = text.toLowerCase();
    return [keywords.find((k) => normalized.includes(k.toLowerCase()))];
  }

  const parser = new XMLParser();
  const rssFeed: RssFeed = parser.parse(text);
  const items = rssFeed.rss.channel.item;
  const titles = items.map((item) => item.title);
  const descriptions = items.map((item) => item.description);

  if (source.options.notifyAboutNews) {
    const news = items
      .filter((item) => isAtMostTwoDaysAgo(new Date(item.pubDate)))
      .map((item) => ` - ${item.title}`);
    if (news.length > 0) {
      return [null, news.join("\n")];
    }
  }

  const keywordMatch = keywords.find((k) =>
    titles.some((title) => title.toLowerCase().includes(k.toLowerCase())),
  );

  if (!keywordMatch && source.options.crawlDescriptions) {
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

// Function to get notifications based on the source and keywords
const getSourceNotification = async (
  game: Game,
  source: Source,
  keywords: string[],
): Promise<Notification> => {
  try {
    const result = await withTimeout(fetch(source.url), 5000);

    if (!result.ok) {
      return {
        type: "error",
        game: game.title,
        text: `❌ **${game.title}**: Failed to fetch data from \`${source.url}\`: ${result.status} - ${result.statusText}`,
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
        game: game.title,
        text: `📡 **${game.title}**: New RSS messages:\n${notes}`,
      };
    } else if (keywordMatch) {
      return {
        type: "warn",
        game: game.title,
        text: `🔍 **${game.title}**: \`${keywordMatch}\` keyword match on \`${source.url}\``,
      };
    } else {
      return {
        type: "trace",
        game: game.title,
        text: `🔇 **${game.title}**: Nothing found on \`${source.url}\``,
      };
    }
  } catch (error) {
    return {
      type: "error",
      game: game.title,
      text: `❌ **${game.title}**: Error fetching data from \`${source.url}\`: ${(error as Error).message}`,
    };
  }
};

// Function to crawl sources for notifications
const crawlForNotifications = async (
  game: Game,
  notifications: Notification[],
) => {
  const { sources = [], keywords = [] } = game.crawlerSettings || {};
  const mappedSources: Source[] = sources.map((s) => ({
    url: s,
    options: {},
  }));

  if (game.crawlerSettings?.steamId) {
    mappedSources.push({
      url: `https://store.steampowered.com/feeds/news/app/${game.crawlerSettings.steamId}`,
      options: {
        rss: true,
        crawlDescriptions:
          game.crawlerSettings.steamRss?.crawlDescriptions || false,
      },
    });

    if (game.crawlerSettings.steamRss?.notifyAboutNews) {
      mappedSources.push({
        url: `https://store.steampowered.com/feeds/news/app/${game.crawlerSettings.steamId}`,
        options: {
          rss: true,
          notifyAboutNews: true,
        },
      });
    }
  }

  if (
    mappedSources.length === 0 ||
    (keywords.length === 0 && !game.crawlerSettings?.steamRss?.notifyAboutNews)
  ) {
    return;
  }

  const fetchPromises = mappedSources.map(async (source) => {
    try {
      const notification = await getSourceNotification(game, source, keywords);
      notifications.push(notification);
    } catch (error) {
      notifications.push({
        type: "error",
        game: game.title,
        text: `❌ **${game.title}**: Error fetching data from \`${source.url}\`: ${(error as Error).message}`,
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
const getGameNotifications = async (games: Game[]): Promise<Notification[]> => {
  const notifications: Notification[] = [];

  await Promise.all(
    games.map((game) => crawlForNotifications(game, notifications)),
  );

  return notifications.sort((a, b) => a.game.localeCompare(b.game));
};

// Execute the script
(async () => {
  const games = await loadGames(gamesMarkdownDirectoryPath);
  const notifications = await getGameNotifications(games);
  console.log(notifications);

  if (notifications.length > 0) {
    await sendDiscordNotification(notifications);
  }
})();
