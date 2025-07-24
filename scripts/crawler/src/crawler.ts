import { fileURLToPath } from "url";
import path, { dirname } from "path";
import { Notification, CrawlerSource, Game } from "./lib/types";
import { sendDiscordNotification } from "./lib/discord";
import { loadFromMarkdown } from "./lib/markdown";
import { fetchNotifications } from "./lib/crawlerSources";
import { withTimeout } from "./lib/withTimeout";
import { NewsExtractor } from "./lib/extractor";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const sourcesMarkdownDirectoryPath = path.resolve(
  __dirname,
  "../../../_old/migrations/documents/crawlerSources"
);
const gamesMarkdownDirectoryPath = path.resolve(
  __dirname,
  "../../../_old/migrations/documents/games"
);

const getGameNotificationsGroupedByGame = async (
  source: CrawlerSource[],
  games: Game[]
): Promise<Notification[]> => {
  const notifications: Notification[] = [];

  await Promise.all(
    source.map((source) =>
      fetchNotifications(
        source,
        games.find((g) => g.name === source.game) ?? { name: "Unknown game" },
        notifications
      )
    )
  );

  return notifications.sort((a, b) => a.game.localeCompare(b.game));
};

const crawler = async () => {
  //await scrapeSource("https://www.pathofexile.com/forum/view-forum/news"); // poe ok
  await scrapeSource("https://www.pathofexile.com/forum/view-forum/2211"); // poe 2 ok
  //await scrapeSource("https://ud.floor.line.games/us/bbs/notice/timetable_us/1"); //ok
  //await scrapeSource("https://forum.lastepoch.com/c/announcements/37"); // ok

  // await scrapeSource("https://forum.median-xl.com/viewforum.php?f=25");// not ok

  return;
};

const extractor = new NewsExtractor();

async function scrapeSource(sourceUrl: string) {
  // Fetch the page

  const response = await withTimeout(fetch(sourceUrl), 5000);

  // Extract news data
  const extraction = await extractor.extractAllEntries({
    sourceUrl,
    html: await response.text(),
  });

  // Save to Sanity
  console.log(extraction);
}

export default crawler;
