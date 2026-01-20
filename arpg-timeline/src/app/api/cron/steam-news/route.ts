import { NextRequest, NextResponse } from "next/server";

import { indexQuery, IndexQueryResult } from "@/lib/cms/queries/indexQuery";
import { GameNewsService } from "@/lib/gameNewsService";
import { sanityFetch } from "@/lib/sanity/sanityClient";
import { getSteamNews } from "@/lib/steam/getSteamNews";
import { GameNewsInsert } from "@/types/game-news";

export async function GET(request: NextRequest) {
    const authHeader = request.headers.get("authorization");

    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        console.log("Starting Game news cron job...");

        const data: IndexQueryResult = await sanityFetch({
            query: indexQuery,
            revalidate: false,
        });

        const gamesWithSteam = data.games.filter((game) => game.steam?.appId);

        if (gamesWithSteam.length === 0) {
            console.log("No games with Steam App IDs found");
            return NextResponse.json({
                message: "No games with Steam App IDs found",
                processed: 0,
                errors: [],
            });
        }

        const steamNewsService = new GameNewsService();
        const results = {
            processed: 0,
            errors: [] as string[],
            totalNewsItems: 0,
        };

        const allNewsEntries: GameNewsInsert[] = [];

        for (const game of gamesWithSteam) {
            const steamAppId = game.steam?.appId;
            if (!steamAppId) continue;

            try {
                console.log(`Fetching Game news for ${game.name} (App ID: ${steamAppId})`);

                const steamNews = await getSteamNews(steamAppId);

                if (steamNews.length > 0) {
                    const dbEntries = steamNews.map((newsItem) =>
                        steamNewsService.convertToDbEntry(game.slug, steamAppId, newsItem),
                    );
                    allNewsEntries.push(...dbEntries);
                    results.totalNewsItems += steamNews.length;
                    console.log(`Collected ${steamNews.length} news items for ${game.name}`);
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
            await steamNewsService.insertGameNewsBatch(allNewsEntries);
            console.log(`Successfully processed all news entries`);
        }

        await steamNewsService.deleteOldNews(30);

        console.log(
            `Game news cron job completed. Processed: ${results.processed}, Total news items: ${results.totalNewsItems}, Errors: ${results.errors.length}`,
        );

        return NextResponse.json({
            message: "Game news cron job completed",
            ...results,
        });
    } catch (error) {
        console.error("Game news cron job failed:", error);
        return NextResponse.json(
            {
                error: "Game news cron job failed",
                message: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 },
        );
    }
}

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
