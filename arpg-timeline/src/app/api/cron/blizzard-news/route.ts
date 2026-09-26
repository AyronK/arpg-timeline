import { NextRequest, NextResponse } from "next/server";

import { getBlizzardNews } from "@/lib/blizzard/getBlizzardNews";
import { indexQuery, IndexQueryResult } from "@/lib/cms/queries/indexQuery";
import { GameNewsService } from "@/lib/gameNewsService";
import { sanityFetch } from "@/lib/sanity/sanityClient";
import { GameNewsInsert } from "@/types/game-news";

export async function GET(request: NextRequest) {
    const authHeader = request.headers.get("authorization");

    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        console.log("Starting Blizzard news cron job...");

        const data: IndexQueryResult = await sanityFetch({
            query: indexQuery,
            revalidate: false,
        });

        const gamesWithBlizzard = data.games.filter((game) => game.blizzard?.newsFeed);

        if (gamesWithBlizzard.length === 0) {
            console.log("No games with Blizzard news feeds found");
            return NextResponse.json({
                message: "No games with Blizzard news feeds found",
                processed: 0,
                errors: [],
            });
        }

        const gameNewsService = new GameNewsService();
        const results = {
            processed: 0,
            errors: [] as string[],
            totalNewsItems: 0,
        };

        const allNewsEntries: GameNewsInsert[] = [];

        for (const game of gamesWithBlizzard) {
            const feed = game.blizzard?.newsFeed;
            if (!feed) continue;

            try {
                console.log(`Fetching Blizzard news for ${game.name} (Feed: ${feed})`);

                const blizzardNews = await getBlizzardNews(feed);

                if (blizzardNews.length > 0) {
                    const dbEntries = blizzardNews.map((newsItem) =>
                        gameNewsService.convertToDbEntry(game.slug, null, newsItem),
                    );
                    allNewsEntries.push(...dbEntries);
                    results.totalNewsItems += blizzardNews.length;
                    console.log(`Collected ${blizzardNews.length} news items for ${game.name}`);
                } else {
                    console.log(`No news items found for ${game.name}`);
                }

                results.processed++;
            } catch (error) {
                const errorMessage = `Failed to process ${game.name}: ${error instanceof Error ? error.message : "Unknown error"}`;
                console.error(errorMessage);
                results.errors.push(errorMessage);
            }
        }

        if (allNewsEntries.length > 0) {
            console.log(`Processing ${allNewsEntries.length} total news entries in batches`);
            await gameNewsService.insertGameNewsBatch(allNewsEntries);
            console.log(`Successfully processed all news entries`);
        }

        console.log(
            `Blizzard news cron job completed. Processed: ${results.processed}, Total news items: ${results.totalNewsItems}, Errors: ${results.errors.length}`,
        );

        return NextResponse.json({
            message: "Blizzard news cron job completed",
            ...results,
        });
    } catch (error) {
        console.error("Blizzard news cron job failed:", error);
        return NextResponse.json(
            {
                error: "Blizzard news cron job failed",
                message: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 },
        );
    }
}

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
