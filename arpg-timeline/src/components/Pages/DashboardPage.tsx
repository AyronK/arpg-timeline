import { Faq } from "@/components/Faq";
import { Main } from "@/components/Home/HomePage";
import { SingleToast } from "@/components/SingleToast";
import { StructuredDataScripts } from "@/components/StructuredDataScripts";
import { GameStatistics } from "@/lib/cms/games.types";
import { DashboardTag } from "@/lib/cms/gameTags";
import { parseGamesFromSanity } from "@/lib/cms/parseGamesFromSanity";
import { parseGameStreamsFromSanity } from "@/lib/cms/parseGameStreamsFromSanity";
import { indexQuery, IndexQueryResult } from "@/lib/cms/queries/indexQuery";
import { sanityFetch } from "@/lib/sanity/sanityClient";
import { getMultipleSteamCurrentPlayers } from "@/lib/steam/getMultipleSteamCurrentPlayers";

interface DashboardPageProps {
    dashboard: DashboardTag;
}

export const DashboardPage = async ({ dashboard }: DashboardPageProps) => {
    const data: IndexQueryResult = await sanityFetch({
        query: indexQuery,
        revalidate: 24 * 60 * 60,
        tags: ["season", "liveStreamTwitch", "game", "toast"],
    });
    const games = parseGamesFromSanity(data);
    const streams = parseGameStreamsFromSanity(data);

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
            <div className="relative container mx-auto mb-8">
                <Kicker />
                <Main
                    games={games}
                    streams={streams}
                    statistics={statistics}
                    dashboard={dashboard}
                />
            </div>
            <StructuredDataScripts games={games} />
            <Faq patreonUrl={process.env.PATREON_URL!} faq={data.faq} />
        </>
    );
};

const Kicker = () => (
    <p className="font-heading mx-auto hidden max-w-prose text-center text-lg md:mt-8 md:block md:text-xl">
        Stay ahead in your favorite ARPGs with the season tracker.
        <br />
        Never miss a season start or end again!
    </p>
);
