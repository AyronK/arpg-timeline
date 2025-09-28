import { GameNewsSection } from "@/components/Dashboard/GameNewsSection";
import { Main } from "@/components/Dashboard/Main";
import { SingleToast } from "@/components/SingleToast";
import { StructuredDataScripts } from "@/components/StructuredDataScripts";
import { SupportButtons } from "@/components/SupportButtons";
import { GameStatistics } from "@/lib/cms/games.types";
import { GameFilterCategory } from "@/lib/cms/gameTags";
import { parseGamesFromSanity } from "@/lib/cms/parseGamesFromSanity";
import { indexQuery, IndexQueryResult } from "@/lib/cms/queries/indexQuery";
import { GameNewsService } from "@/lib/gameNewsService";
import { sanityFetch } from "@/lib/sanity/sanityClient";
import { getMultipleSteamCurrentPlayers } from "@/lib/steam/getMultipleSteamCurrentPlayers";
import { SteamNewsItem } from "@/lib/steam/getSteamNews";

import ClientOnlyVisibleWrapper from "../ClientOnlyVisibleWrapper";

interface DashboardPageProps {
    category: GameFilterCategory;
}

export const DashboardPage = async ({ category }: DashboardPageProps) => {
    const data: IndexQueryResult = await sanityFetch({
        query: indexQuery,
        revalidate: 24 * 60 * 60,
        tags: ["season", "liveStreamTwitch", "game", "toast"],
    });
    const games = parseGamesFromSanity(data);

    const steamApps = data.games
        .map((g) => g.steam?.appId)
        .filter((i) => !!i)
        .map((i) => Number(i));

    const steamStats = await getMultipleSteamCurrentPlayers(steamApps);

    const statistics: Record<string, GameStatistics> = data.games.reduce((acc, game) => {
        if (!game.steam?.appId) return acc;

        const steamPlayersResult = steamStats.find((s) => s.appId === game.steam?.appId);

        if (!steamPlayersResult) {
            return acc;
        }

        return {
            ...acc,
            [game.slug]: {
                steam: {
                    currentPlayers: steamPlayersResult.currentPlayers,
                    appId: steamPlayersResult.appId,
                    isComingSoon: steamPlayersResult.currentPlayers <= 0 && game.isComingSoon,
                },
            } as GameStatistics,
        };
    }, {});

    const gamesForNews = data.games;
    const gameSlugs = data.games.map((game) => game.slug);

    let gamesNews: Array<{
        gameSlug: string;
        gameName: string;
        steamAppId: number;
        news: SteamNewsItem;
    }> = [];

    if (gameSlugs.length > 0) {
        try {
            const steamNewsService = new GameNewsService();
            const latestNews = (await steamNewsService.getLatestNewsForGames(gameSlugs)).sort(
                (a, b) =>
                    new Date(b.news?.pub_date ?? "").getTime() -
                    new Date(a.news?.pub_date ?? "").getTime(),
            );

            gamesNews = latestNews.map((item) => {
                const game = gamesForNews.find((g) => g.slug === item.gameSlug);
                return {
                    gameSlug: item.gameSlug,
                    gameName: game?.name || item.gameSlug,
                    steamAppId: game?.steam?.appId || 0,
                    gameLogo: game?.logo,
                    news: {
                        title: item.news!.title,
                        link: item.news!.link,
                        description: item.news!.description,
                        pubDate: item.news!.pub_date,
                    } as SteamNewsItem,
                };
            });
        } catch (error) {
            console.error("Error fetching Game news for dashboard:", error);
        }
    }

    return (
        <>
            {data.toast && <SingleToast data={data.toast} />}
            <div className="relative container mx-auto mb-8">
                <Main games={games} statistics={statistics} category={category} />
            </div>
            {gamesNews.length > 0 && (
                <div className="container mx-auto mb-8">
                    <ClientOnlyVisibleWrapper>
                        <GameNewsSection gamesNews={gamesNews} games={games} category={category} />
                    </ClientOnlyVisibleWrapper>
                </div>
            )}
            <StructuredDataScripts games={games} />
            <SupportButtons />
        </>
    );
};
