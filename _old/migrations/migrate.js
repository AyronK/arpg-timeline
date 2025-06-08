// migration/migrate.js - Main migration script
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { createClient } from "@sanity/client";
import "dotenv/config";

// Sanity client configuration
const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID, // Replace with your project ID
  dataset: process.env.SANITY_DATASET,
  useCdn: false,
  token: process.env.SANITY_WRITE_TOKEN, // Get from sanity.io/manage
  apiVersion: "2023-01-01",
});

function parseFrontmatter(content) {
  try {
    const parsed = matter(content);
    return {
      frontmatter: parsed.data,
      content: parsed.content.trim(),
    };
  } catch (error) {
    console.error("Error parsing frontmatter:", error);
    return {
      frontmatter: {},
      content: content.trim(),
    };
  }
}

// Read all files from a directory
function readDirectory(dirPath) {
  if (!fs.existsSync(dirPath)) {
    console.log(`Directory ${dirPath} does not exist`);
    return [];
  }

  return fs
    .readdirSync(dirPath)
    .filter(
      (file) =>
        file.endsWith(".md") || file.endsWith(".yml") || file.endsWith(".yaml")
    )
    .map((file) => {
      const filePath = path.join(dirPath, file);
      const content = fs.readFileSync(filePath, "utf8");
      const { frontmatter, content: body } = parseFrontmatter(content);

      return {
        filename: file,
        path: filePath,
        frontmatter,
        body,
        slug: path.basename(file, path.extname(file)),
      };
    });
}

// Generate Sanity document ID
function generateId(type, slug) {
  return `${type}-${slug.replace(" ", "-").replace("’", "").replace("'", "")}`;
}

// Transform games
function transformGame(data) {
  return {
    _id: generateId("game", data.frontmatter.slug || data.slug),
    _type: "game",
    name: data.frontmatter.name,
    shortName: data.frontmatter.shortName || null,
    slug: {
      _type: "slug",
      current: data.frontmatter.slug,
    },
    seasonKeyword: data.frontmatter.seasonKeyword,
    official: data.frontmatter.official ?? true,
    group: data.frontmatter.group || null,
    url: data.frontmatter.url || null,
    // Note: Logo will need separate handling for image upload
    crawlerSettings: data.frontmatter.crawlerSettings
      ? {
          keywords: data.frontmatter.crawlerSettings.keywords || [],
        }
      : null,
  };
}

// Transform seasons
function transformSeason(data, gameReferences) {
  const gameRef = gameReferences[data.frontmatter.game];

  return {
    _id: generateId("season", data.slug),
    _type: "season",
    game: gameRef
      ? {
          _type: "reference",
          _ref: gameRef,
        }
      : null,
    name: data.frontmatter.name,
    url: data.frontmatter.url || null,
    start: data.frontmatter.start
      ? {
          startDate: data.frontmatter.start.startDate || null,
          confirmed: data.frontmatter.start.confirmed || false,
          overrideText: data.frontmatter.start.overrideText || "",
          additionalText: data.frontmatter.start.additionalText || "",
        }
      : null,
    end: data.frontmatter.end
      ? {
          endDate: data.frontmatter.end.endDate || null,
          confirmed: data.frontmatter.end.confirmed || false,
          overrideText: data.frontmatter.end.overrideText || "",
          additionalText: data.frontmatter.end.additionalText || "",
        }
      : null,
  };
}

// Transform crawler sources
function transformCrawlerSource(data, gameReferences, type) {
  const gameRef = gameReferences[data.frontmatter.game];
  const baseDoc = {
    _id: generateId(type, data.slug),
    _type: type,
    game: gameRef
      ? {
          _type: "reference",
          _ref: gameRef,
        }
      : null,
  };

  switch (type) {
    case "crawlerSourceHttp":
      return {
        ...baseDoc,
        source: data.frontmatter.source,
      };

    case "crawlerSourceSteam":
      return {
        ...baseDoc,
        steamId: data.frontmatter.steamId,
        crawlDescriptions: data.frontmatter.crawlDescriptions || false,
        notifyAboutNews: data.frontmatter.notifyAboutNews || false,
      };

    case "crawlerSourceReddit":
      return {
        ...baseDoc,
        subreddit: data.frontmatter.subreddit,
        crawlDescriptions: data.frontmatter.crawlDescriptions || false,
        notifyAboutNews: data.frontmatter.notifyAboutNews || false,
      };

    default:
      return baseDoc;
  }
}

// Transform FAQ
function transformFaq(data) {
  return {
    _id: generateId("faq", data.slug),
    _type: "faq",
    title: data.frontmatter.title,
    content: data.body || data.frontmatter.content,
    order: data.frontmatter.order || 100,
  };
}

// Transform toasts
function transformToast(data) {
  return {
    _id: generateId("toast", data.slug),
    _type: "toast",
    title: data.frontmatter.title,
    description: data.body || data.frontmatter.description,
    withLogo: data.frontmatter.withLogo ?? true,
    duration: data.frontmatter.duration || null,
  };
}

// Transform live streams
function transformLiveStream(data, gameReferences, platformReferences) {
  const gameRef = gameReferences[data.frontmatter.game];
  const platformRef = platformReferences[data.frontmatter.platform];

  return {
    _id: generateId(
      "liveStreamTwitch",
      data.slug
    ),
    _type: "liveStreamTwitch",
    game: gameRef
      ? {
          _type: "reference",
          _ref: gameRef,
        }
      : null,
    platform: platformRef
      ? {
          _type: "reference",
          _ref: platformRef,
        }
      : null,
    date: data.frontmatter.date,
    name: data.frontmatter.name,
  };
}

// Transform platform
function transformPlatform(data, gameReferences) {
  const gameRef = gameReferences[data.frontmatter.game];

  return {
    _id: generateId(
      "liveStreamPlatformTwitch",
      data.slug
    ),
    _type: "liveStreamPlatformTwitch",
    game: gameRef
      ? {
          _type: "reference",
          _ref: gameRef,
        }
      : null,
    category: data.frontmatter.category,
    channel: data.frontmatter.channel || null,
  };
}

// Main migration function
async function migrateToSanity() {
  console.log("Starting migration to Sanity...");

  try {
    // Step 1: Read all content files
    const games = readDirectory("./documents/games");
    const seasons = readDirectory("./documents/seasons");
    const crawlerSources = readDirectory("./documents/crawlerSources");
    const faq = readDirectory("./documents/faq");
    const toasts = readDirectory("./documents/toasts");
    const liveStreams = readDirectory("./documents/live-streams/twitch");
    const platforms = readDirectory("./documents/live-streams/platforms");

    // Step 2: Transform games first (needed for references)
    console.log("Migrating games...");
    const transformedGames = games.map(transformGame);
    const gameReferences = {};

    for (const game of transformedGames) {
      gameReferences[game.name] = game._id;
      await client.createOrReplace(game);
      console.log(`✓ Migrated game: ${game.name}`);
    }

    // Step 3: Transform platforms (needed for live stream references)
    console.log("Migrating platforms...");
    const transformedPlatforms = platforms.map((data) =>
      transformPlatform(data, gameReferences)
    );
    const platformReferences = {};

    for (const platform of transformedPlatforms) {
      platformReferences[`${platform.game?.name}-twitch`] = platform._id;
      await client.createOrReplace(platform);
      console.log(`✓ Migrated platform: ${platform._id}`);
    }

    // Step 4: Transform and upload other content types
    console.log("Migrating seasons...");
    const transformedSeasons = seasons.map((data) =>
      transformSeason(data, gameReferences)
    );
    for (const season of transformedSeasons) {
      await client.createOrReplace(season);
      console.log(`✓ Migrated season: ${season.name}`);
    }

    console.log("Migrating crawler sources...");
    for (const source of crawlerSources) {
      let transformedSource;
      const type = source.frontmatter.type;

      if (type === "crawlerSources_http") {
        transformedSource = transformCrawlerSource(
          source,
          gameReferences,
          "crawlerSourceHttp"
        );
      } else if (type === "crawlerSources_steam") {
        transformedSource = transformCrawlerSource(
          source,
          gameReferences,
          "crawlerSourceSteam"
        );
      } else if (type === "crawlerSources_reddit") {
        transformedSource = transformCrawlerSource(
          source,
          gameReferences,
          "crawlerSourceReddit"
        );
      }

      if (transformedSource) {
        await client.createOrReplace(transformedSource);
        console.log(`✓ Migrated crawler source: ${transformedSource._id}`);
      }
    }

    // console.log("Migrating FAQ...");
    // const transformedFaq = faq.map(transformFaq);
    // for (const faqItem of transformedFaq) {
    //   await client.createOrReplace(faqItem);
    //   console.log(`✓ Migrated FAQ: ${faqItem.title}`);
    // }

    // console.log("Migrating toasts...");
    // const transformedToasts = toasts.map(transformToast);
    // for (const toast of transformedToasts) {
    //   await client.createOrReplace(toast);
    //   console.log(`✓ Migrated toast: ${toast.title}`);
    // }

    console.log("Migrating live streams...");
    const transformedStreams = liveStreams.map((data) =>
      transformLiveStream(data, gameReferences, platformReferences)
    );
    for (const stream of transformedStreams) {
      await client.createOrReplace(stream);
      console.log(`✓ Migrated live stream: ${stream.name}`);
    }

    console.log("✅ Migration completed successfully!");
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
}

// Run migration
migrateToSanity();
