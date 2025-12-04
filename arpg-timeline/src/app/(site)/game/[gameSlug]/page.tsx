import { Metadata } from "next";
import { notFound } from "next/navigation";

import { BreadcrumbSchema } from "@/components/BreadcrumbSchema";
import { getAverageSeasonDuration, parseGamesFromSanity } from "@/lib/cms/parseGamesFromSanity";
import {
    gameDetailsQuery,
    GameDetailsQueryResult,
    indexQuery,
    IndexQueryResult,
} from "@/lib/cms/queries/indexQuery";
import { GameNewsService } from "@/lib/gameNewsService";
import { getStructuredDataForGame } from "@/lib/games/getStructuredDataForGame";
import { sanityFetch } from "@/lib/sanity/sanityClient";

import {
    ArchivalSeasonsSection,
    GameHeaderSection,
    PlatformIntegrationSection,
    StatisticsSection,
} from "./components";
import { GamePageProps } from "./types";
import { calculateGameStatistics, getArchivalSeasons, getOldestSeasonInfo } from "./utils";

async function getSteamNewsFromDb(gameSlug: string, limit = 4) {
    try {
        const steamNewsService = new GameNewsService();
        const dbNews = await steamNewsService.getGameNewsByGame(gameSlug, limit);

        return dbNews.map((news) => ({
            title: news.title,
            link: news.link,
            description: news.description,
            pubDate: news.pub_date,
        }));
    } catch (error) {
        console.error("Error fetching Game news from database:", error);
        return [];
    }
}

const GamePage = async ({ params }: GamePageProps) => {
    const { gameSlug } = await params;

    const data: GameDetailsQueryResult = await sanityFetch({
        query: gameDetailsQuery,
        revalidate: 24 * 60 * 60,
        tags: ["season", "game"],
    });

    const games = parseGamesFromSanity(data);
    const game = games.find((g) => g.slug === gameSlug);

    if (!game) {
        notFound();
    }

    game.averageSeasonDuration = getAverageSeasonDuration(
        data.seasons.filter((s) => s.game === game.slug),
    );

    const steamAppId = data.games.find((g) => g.slug === gameSlug)?.steam?.appId;
    const gameNews = await getSteamNewsFromDb(gameSlug);
    const statistics = calculateGameStatistics(data, gameSlug);
    const oldestSeasonInfo = getOldestSeasonInfo(data, gameSlug);
    const archivalSeasons = getArchivalSeasons(data, gameSlug).filter(
        (s) => s.name !== game.currentSeason?.name,
    );
    const structuredData = getStructuredDataForGame(game);
    const faqSchema =
        structuredData?.faqQuestions && structuredData.faqQuestions.length > 0
            ? {
                  "@context": "https://schema.org",
                  "@type": "FAQPage",
                  "@id": `https://www.arpg-timeline.com/game/${gameSlug}#faq`,
                  mainEntity: structuredData.faqQuestions,
              }
            : null;

    return (
        <>
            <BreadcrumbSchema path={`game/${gameSlug}`} />
            {structuredData && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(structuredData.structuredData, null, 2),
                    }}
                />
            )}
            {faqSchema && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(faqSchema, null, 2),
                    }}
                />
            )}
            <div className="relative container mx-auto py-6 md:py-8">
                <h1 className="font-heading mb-6 text-3xl md:mb-8 md:text-4xl">{game.name}</h1>

                <GameHeaderSection game={game} gameSlug={gameSlug} steamAppId={steamAppId} />

                <StatisticsSection
                    game={game}
                    statistics={statistics}
                    oldestSeasonInfo={oldestSeasonInfo}
                />

                <div className="mb-6 md:mb-8">
                    <PlatformIntegrationSection
                        steamAppId={steamAppId}
                        gameNews={gameNews.slice(0, 4)}
                    />
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

    const buildDescription = () => {
        const base = `Track ${game.name} ${game.seasonKeyword}s and updates. Get countdowns, start dates, and never miss a ${game.name} ${game.seasonKeyword} launch.`;

        if (
            game.nextSeason?.name &&
            game.nextSeason?.start?.startDate &&
            game.nextSeason?.start?.confirmed &&
            new Date(game.nextSeason.start.startDate) > new Date()
        ) {
            return `Track ${game.name} ${game.seasonKeyword}s and updates. Next ${game.seasonKeyword}: ${game.nextSeason.name} (starts ${game.nextSeason.start.startDate}). Get countdowns, start dates, and never miss a ${game.name} ${game.seasonKeyword} launch.`;
        }

        if (
            game.currentSeason?.name &&
            game.currentSeason?.start?.startDate &&
            game.currentSeason?.start?.confirmed
        ) {
            return `Track ${game.name} ${game.seasonKeyword}s and updates. Current ${game.seasonKeyword}: ${game.currentSeason.name} (started ${game.currentSeason.start.startDate}). Get countdowns, start dates, and never miss a ${game.name} ${game.seasonKeyword} launch.`;
        }

        return base;
    };

    const ogDescription =
        game.nextSeason?.name &&
        game.nextSeason?.start?.startDate &&
        game.nextSeason?.start?.confirmed &&
        new Date(game.nextSeason.start.startDate) > new Date()
            ? `Track ${game.name} seasons and get countdowns for upcoming content. Next ${game.seasonKeyword}: ${game.nextSeason.name}.`
            : game.currentSeason?.name
              ? `Track ${game.name} seasons and get countdowns for upcoming content. Current ${game.seasonKeyword}: ${game.currentSeason.name}.`
              : `Track ${game.name} seasons and get countdowns for upcoming content.`;

    return {
        title: `${game.name} Updates | aRPG Timeline`,
        description: buildDescription(),
        keywords: [
            `${game.name} ${game.seasonKeyword}s`,
            `${game.name} seasons`,
            `${game.name} countdown`,
            `${game.name} updates`,
            `${game.name} ${game.seasonKeyword}`,
            `${game.name} next ${game.seasonKeyword}`,
            `${game.name} next ${game.seasonKeyword} start`,
            `${game.name} next ${game.seasonKeyword} release`,
            "arpg timeline",
            "season tracker",
        ],
        openGraph: {
            title: `${game.name} Season Tracker`,
            description: ogDescription,
            siteName: "aRPG Timeline",
            type: "website",
            url: `https://www.arpg-timeline.com/game/${slug}`,
            locale: "en_US",
            images: [
                {
                    url: "/assets/seoimage.png",
                    width: 1200,
                    height: 630,
                    alt: `${game.name} Season Tracker - Track ${game.name} ${game.seasonKeyword}s and updates`,
                    type: "image/png",
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: `${game.name} Season Tracker`,
            description: ogDescription,
            images: ["/assets/seoimage.png"],
        },
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                "max-image-preview": "large",
                "max-snippet": -1,
            },
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
