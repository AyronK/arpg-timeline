import { Metadata } from "next";

import { Faq } from "@/components/Faq";
import { Main } from "@/components/Home/HomePage";
import { SingleToast } from "@/components/SingleToast";
import { StructuredDataScripts } from "@/components/StructuredDataScripts";
import { GameStatistics } from "@/lib/cms/games.types";
import { parseGamesFromSanity } from "@/lib/cms/parseGamesFromSanity";
import { parseGameStreamsFromSanity } from "@/lib/cms/parseGameStreamsFromSanity";
import { sanityClient, sanityFetch } from "@/lib/sanity/sanityClient";
import { getMultipleSteamCurrentPlayers } from "@/lib/steam/getMultipleSteamCurrentPlayers";
import { indexQuery, IndexQueryResult } from "@/queries/indexQuery";

const Home = async () => {
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

        if (!steamPlayersResult?.success) {
            return acc;
        }

        return {
            ...acc,
            [game.slug]: {
                steam: {
                    currentPlayers: steamPlayersResult.currentPlayers,
                    appId: steamPlayersResult.appId,
                },
            } as GameStatistics,
        };
    }, {});

    return (
        <>
            {data.toast && <SingleToast data={data.toast} />}
            <div className="relative container mx-auto mb-8">
                <Kicker />
                <Main games={games} streams={streams} statistics={statistics} />
            </div>
            <StructuredDataScripts games={games} />
            <Faq patreonUrl={process.env.PATREON_URL!} faq={data.faq} />
        </>
    );
};

export const revalidate = 900;

export default Home;

const Kicker = () => (
    <p className="font-heading mx-auto hidden max-w-prose text-center text-lg md:mt-8 md:block md:text-xl">
        Stay ahead in your favorite ARPGs with the season tracker.
        <br />
        Never miss a season start or end again!
    </p>
);

function parseMetadataKeywords(input: string) {
    return input
        .toLowerCase()
        .replace(/[^a-z0-9,\s-]/g, "")
        .trim();
}

export async function generateMetadata(): Promise<Metadata> {
    const data: IndexQueryResult = await sanityClient.fetch(indexQuery, { revalidate: 3600 });
    const gameNames = data.games.map((g) => parseMetadataKeywords(g.name));

    return {
        title: "aRPG Timeline | Season Tracker",
        description: "Stay ahead in your favorite aRPGs with our season tracker",
        openGraph: {
            title: "aRPG Timeline",
            description: "Track aRPG seasons for Path of Exile, Diablo, and more",
            siteName: "aRPG Timeline",
            type: "website",
            url: "https://arpg-timeline.com",
            images: [
                {
                    url: "/assets/seoimage.png",
                    width: 1200,
                    height: 630,
                    alt: "aRPG Timeline | Season Tracker",
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            images: ["/assets/seoimage.png"],
        },
        keywords: [
            ...gameNames,
            "arpg seasons",
            "arpg tracker",
            "action rpg",
            "new season release date",
            "league start",
            "arpg, best arpgs",
            "diablo alternative",
            "poe alternativ",
            "upcoming arpg",
            "countdown",
            "poe",
            "d2",
            "d3",
            "d4",
        ],
        alternates: { canonical: "/" },
    };
}

export const experimental_ppr = true;
