import { fileURLToPath } from "url";
import path, { dirname } from "path";
import { Notification, CrawlerSource, Game } from "./lib/types";
import { sendDiscordNotification } from "./lib/discord";
import { loadFromMarkdown } from "./lib/markdown";
import { crawlForNotifications as fetchNotifications } from "./lib/crawlerSources";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const sourcesMarkdownDirectoryPath = path.resolve(
  __dirname,
  "../../../src/documents/crawlerSources",
);
const gamesMarkdownDirectoryPath = path.resolve(
  __dirname,
  "../../../src/documents/games",
);

const getGameNotificationsGroupedByGame = async (
  source: CrawlerSource[],
  games: Game[],
): Promise<Notification[]> => {
  const notifications: Notification[] = [];

  await Promise.all(
    source.map((source) =>
      fetchNotifications(
        source,
        games.find((g) => g.name === source.game) ?? { name: "Unknown game" },
        notifications,
      ),
    ),
  );

  return notifications.sort((a, b) => a.game.localeCompare(b.game));
};

const crawler = async () => {
  const [sources, games] = await Promise.all([
    loadFromMarkdown<CrawlerSource>(sourcesMarkdownDirectoryPath),
    loadFromMarkdown<Game>(gamesMarkdownDirectoryPath),
  ]);

  const notifications = await getGameNotificationsGroupedByGame(sources, games);
  console.log(notifications);

  if (notifications.length > 0) {
    await sendDiscordNotification(notifications);
  }
};

export default crawler;
