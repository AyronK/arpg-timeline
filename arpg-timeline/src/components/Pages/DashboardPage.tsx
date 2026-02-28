import { Main } from "@/components/Dashboard/Main";
import { SideNotes } from "@/components/SideNotes";
import { SingleToast } from "@/components/SingleToast";
import { StructuredDataScripts } from "@/components/StructuredDataScripts";
import { GameStatistics } from "@/lib/cms/games.types";
import { getAverageSeasonDuration, parseGamesFromSanity } from "@/lib/cms/parseGamesFromSanity";
import { indexQuery, IndexQueryResult } from "@/lib/cms/queries/indexQuery";
import { sanityFetch } from "@/lib/sanity/sanityClient";
import { getMultipleSteamCurrentPlayers } from "@/lib/steam/getMultipleSteamCurrentPlayers";

export const DashboardPage = async () => {
    const data: IndexQueryResult = await sanityFetch({
        query: indexQuery,
        revalidate: 24 * 60 * 60,
        tags: ["season", "liveStreamTwitch", "game", "toast"],
    });

    const sanityGames = data.games;

    sanityGames.forEach((game) => {
        game.averageSeasonDuration = getAverageSeasonDuration(
            data.seasons.filter((s) => s.game === game.slug),
        );
    });

    const games = parseGamesFromSanity({ games: sanityGames });

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

    return (
        <>
            {data.toast && <SingleToast data={data.toast} />}
            <div className="relative container mx-auto">
                <Main games={games} statistics={statistics} />
            </div>
            <StructuredDataScripts games={games} />
            <SideNotes />
        </>
    );
};
