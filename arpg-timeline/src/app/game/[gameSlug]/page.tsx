import { Metadata } from "next";
import { notFound } from "next/navigation";

import { BreadcrumbSchema } from "@/components/BreadcrumbSchema";
import { parseGamesFromSanity } from "@/lib/cms/parseGamesFromSanity";
import { indexQuery, IndexQueryResult } from "@/lib/cms/queries/indexQuery";
import { sanityFetch } from "@/lib/sanity/sanityClient";
import { getSteamNews } from "@/lib/steam/getSteamNews";

import {
    ArchivalSeasonsSection,
    GameHeaderSection,
    StatisticsSection,
    SteamIntegrationSection,
} from "./components";
import { GamePageProps } from "./types";
import { calculateGameStatistics, getArchivalSeasons, getOldestSeasonInfo } from "./utils";

const GamePage = async ({ params }: GamePageProps) => {
    const { gameSlug } = await params;

    const data: IndexQueryResult = await sanityFetch({
        query: indexQuery,
        revalidate: 24 * 60 * 60,
        tags: ["season", "game"],
    });

    const games = parseGamesFromSanity(data);
    const game = games.find((g) => g.slug === gameSlug);

    if (!game) {
        notFound();
    }

    const steamAppId = data.games.find((g) => g.slug === gameSlug)?.steam?.appId;
    const steamNews = steamAppId ? await getSteamNews(steamAppId) : [];
    const statistics = calculateGameStatistics(data, gameSlug);
    const oldestSeasonInfo = getOldestSeasonInfo(data, gameSlug);
    const archivalSeasons = getArchivalSeasons(data, gameSlug);

    return (
        <>
            <BreadcrumbSchema path={`game/${gameSlug}`} />
            <div className="relative container mx-auto py-6 md:py-8">
                <h1 className="font-heading mb-6 text-3xl md:mb-8 md:text-4xl">{game.name}</h1>

                <GameHeaderSection game={game} gameSlug={gameSlug} steamAppId={steamAppId} />

                <StatisticsSection
                    game={game}
                    statistics={statistics}
                    oldestSeasonInfo={oldestSeasonInfo}
                />

                <div className="mb-6 md:mb-8">
                    {steamAppId && (
                        <SteamIntegrationSection steamAppId={steamAppId} steamNews={steamNews} />
                    )}
                </div>

                <ArchivalSeasonsSection seasons={archivalSeasons} />
            </div>
        </>
    );
};

export default GamePage;

export async function generateMetadata({ params }: GamePageProps): Promise<Metadata> {
    const { gameSlug: slug } = await params;

    const data: IndexQueryResult = await sanityFetch({
        query: indexQuery,
        revalidate: 24 * 60 * 60,
        tags: ["season", "game"],
    });

    const games = parseGamesFromSanity(data);
    const game = games.find((g) => g.slug === slug);

    if (!game) {
        return {
            title: "Game Not Found",
        };
    }

    return {
        title: `${game.name} Seasons & Updates | aRPG Timeline`,
        description: `Track ${game.name} seasons, league starts, and updates. Get countdowns, start dates, and never miss a ${game.name} season launch.`,
        keywords: [
            `${game.name} seasons`,
            `${game.name} league start`,
            `${game.name} countdown`,
            `${game.name} updates`,
            "arpg timeline",
            "season tracker",
        ],
        openGraph: {
            title: `${game.name} Season Tracker`,
            description: `Track ${game.name} seasons and get countdowns for upcoming content.`,
            images: ["/assets/seoimage.png"],
            type: "website",
            url: `https://www.arpg-timeline.com/game/${slug}`,
        },
        alternates: { canonical: `/game/${slug}` },
    };
}

export async function generateStaticParams() {
    const data: IndexQueryResult = await sanityFetch({
        query: indexQuery,
        revalidate: 24 * 60 * 60,
        tags: ["season", "game"],
    });

    const games = parseGamesFromSanity(data);

    return games.map((g) => ({
        gameSlug: g.slug,
    }));
}

export const revalidate = 3600;
