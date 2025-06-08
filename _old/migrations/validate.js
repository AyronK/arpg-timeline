// migration/validate.js - Validation and cleanup script
import { createClient } from "@sanity/client";
import fs from "fs";
import 'dotenv/config';

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET,
  useCdn: false,
  token: process.env.SANITY_WRITE_TOKEN,
  apiVersion: "2023-01-01",
});

// Validation functions
async function validateMigration() {
  console.log("🔍 Starting migration validation...");

  try {
    // Count documents by type
    const documentCounts = await Promise.all([
      client.fetch(`count(*[_type == "game"])`),
      client.fetch(`count(*[_type == "season"])`),
      client.fetch(`count(*[_type == "crawlerSourceHttp"])`),
      client.fetch(`count(*[_type == "crawlerSourceSteam"])`),
      client.fetch(`count(*[_type == "crawlerSourceReddit"])`),
      client.fetch(`count(*[_type == "faq"])`),
      client.fetch(`count(*[_type == "toast"])`),
      client.fetch(`count(*[_type == "liveStreamTwitch"])`),
      client.fetch(`count(*[_type == "liveStreamPlatformTwitch"])`),
    ]);

    console.log("📊 Document counts:");
    console.log(`  Games: ${documentCounts[0]}`);
    console.log(`  Seasons: ${documentCounts[1]}`);
    console.log(`  HTTP Crawler Sources: ${documentCounts[2]}`);
    console.log(`  Steam Crawler Sources: ${documentCounts[3]}`);
    console.log(`  Reddit Crawler Sources: ${documentCounts[4]}`);
    console.log(`  FAQ: ${documentCounts[5]}`);
    console.log(`  Toasts: ${documentCounts[6]}`);
    console.log(`  Twitch Live Streams: ${documentCounts[7]}`);
    console.log(`  Twitch Platforms: ${documentCounts[8]}`);

    // Check for broken references
    console.log("\n🔗 Checking references...");

    const brokenReferences = await client.fetch(`
      *[_type in ["season", "crawlerSourceHttp", "crawlerSourceSteam", "crawlerSourceReddit", "liveStreamTwitch", "liveStreamPlatformTwitch"]] {
        _id,
        _type,
        game,
        "gameExists": defined(game->_id)
      }[gameExists == false]
    `);

    if (brokenReferences.length > 0) {
      console.log("❌ Found broken game references:");
      brokenReferences.forEach((doc) => {
        console.log(`  - ${doc._type}: ${doc._id}`);
      });
    } else {
      console.log("✅ All game references are valid");
    }

    // Check for missing required fields
    console.log("\n📋 Checking required fields...");

    const missingFields = await client.fetch(`
      *[_type == "game" && (!defined(name) || !defined(slug.current) || !defined(seasonKeyword))] {
        _id,
        name,
        slug,
        seasonKeyword
      }
    `);

    if (missingFields.length > 0) {
      console.log("❌ Games missing required fields:");
      missingFields.forEach((game) => {
        console.log(
          `  - ${game._id}: missing ${!game.name ? "name " : ""}${
            !game.slug?.current ? "slug " : ""
          }${!game.seasonKeyword ? "seasonKeyword" : ""}`
        );
      });
    } else {
      console.log("✅ All games have required fields");
    }

    // Check for duplicate slugs
    const duplicateSlugs = await client.fetch(`
      *[_type == "game"] {
        "slug": slug.current,
        "count": count(*[_type == "game" && slug.current == ^.slug.current])
      }[count > 1]
    `);

    if (duplicateSlugs.length > 0) {
      console.log("❌ Found duplicate slugs:");
      duplicateSlugs.forEach((item) => {
        console.log(`  - Slug "${item.slug}" appears ${item.count} times`);
      });
    } else {
      console.log("✅ All game slugs are unique");
    }

    console.log("\n✅ Validation completed!");
  } catch (error) {
    console.error("❌ Validation failed:", error);
  }
}

// Generate migration report
async function generateReport() {
  console.log("📄 Generating migration report...");

  try {
    const report = {
      timestamp: new Date().toISOString(),
      migration: {
        games: await client.fetch(
          `*[_type == "game"] | order(name asc) { _id, name, slug, official }`
        ),
        seasons: await client.fetch(
          `*[_type == "season"] | order(name asc) { _id, name, "game":game->name }`
        ),
        crawlerSources: {
          http: await client.fetch(
            `*[_type == "crawlerSourceHttp"] { _id, source, "game":game->name }`
          ),
          steam: await client.fetch(
            `*[_type == "crawlerSourceSteam"] { _id, steamId, "game":game->name }`
          ),
          reddit: await client.fetch(
            `*[_type == "crawlerSourceReddit"] { _id, subreddit, "game":game->name }`
          ),
        },
        faq: await client.fetch(
          `*[_type == "faq"] | order(order asc) { _id, title, order }`
        ),
        toasts: await client.fetch(`*[_type == "toast"] { _id, title }`),
        liveStreams: await client.fetch(
          `*[_type == "liveStreamTwitch"] { _id, name, "game":game->name, date }`
        ),
        platforms: await client.fetch(
          `*[_type == "liveStreamPlatformTwitch"] { _id, "game":game->name, category }`
        ),
      },
    };

    const reportPath = `migration-report-${Date.now()}.json`;
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`✅ Report saved to: ${reportPath}`);
  } catch (error) {
    console.error("❌ Report generation failed:", error);
  }
}

// Cleanup function for failed migrations
async function cleanup() {
  console.log("🧹 Starting cleanup...");

  try {
    const allDocs = await client.fetch(`*[_type in [
      "game", "season", "crawlerSourceHttp", "crawlerSourceSteam", 
      "crawlerSourceReddit", "faq", "toast", "liveStreamTwitch", 
      "liveStreamPlatformTwitch"
    ]]._id`);

    console.log(`Found ${allDocs.length} documents to delete`);

    if (allDocs.length > 0) {
      const transaction = client.transaction();
      allDocs.forEach((id) => transaction.delete(id));
      await transaction.commit();
      console.log("✅ Cleanup completed");
    } else {
      console.log("ℹ️ No documents to clean up");
    }
  } catch (error) {
    console.error("❌ Cleanup failed:", error);
  }
}

// CLI interface
const command = process.argv[2];

switch (command) {
  case "validate":
    validateMigration();
    break;
  case "report":
    generateReport();
    break;
  case "cleanup":
    cleanup();
    break;
  default:
    console.log("Usage: node validate.js [validate|report|cleanup]");
    console.log("  validate - Check migration integrity");
    console.log("  report   - Generate detailed migration report");
    console.log(
      "  cleanup  - Delete all migrated documents (use with caution!)"
    );
}
