import { Gamepad2 } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
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
import { Button } from "@/ui/Button";

import {
    ArchivalSeasonsSection,
    GameHeaderSection,
    PlatformIntegrationSection,
    StatisticsSection,
} from "./components";
import {
    buildGamePageDescription,
    buildGamePageOgDescription,
    buildGamePageOgTitle,
    buildGamePageTitle,
} from "./metadata";
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
    const oldestSeasonInfo = getOldestSeasonInfo(data, game);
    const archivalSeasons = getArchivalSeasons(data, game);
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
                <div className="mb-4 flex flex-col items-center justify-between gap-4 md:flex-row">
                    <h1 className="font-heading text-3xl md:text-4xl">{game.name}</h1>
                    <Button variant="default" size="sm" asChild className="w-full md:w-auto">
                        <Link href="/" data-sa-click="back-to-homepage">
                            <Gamepad2 className="mr-2 h-4 w-4" />
                            Browse all games
                        </Link>
                    </Button>
                </div>

                <GameHeaderSection game={game} gameSlug={gameSlug} steamAppId={steamAppId} />

                {game.categories?.includes("seasonal") && archivalSeasons.length > 0 && (
                    <StatisticsSection
                        game={game}
                        statistics={statistics}
                        oldestSeasonInfo={oldestSeasonInfo}
                    />
                )}

                <div className="mb-6 md:mb-8">
                    <PlatformIntegrationSection
                        steamAppId={steamAppId}
                        gameNews={gameNews.slice(0, 5)}
                        gameSlug={gameSlug}
                        gameName={game.name}
                    />
                </div>

                {archivalSeasons.length > 0 && (
                    <ArchivalSeasonsSection
                        seasons={archivalSeasons}
                        gameLogo={game.logo}
                        seasonKeyword={game.seasonKeyword}
                    />
                )}
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
        title: buildGamePageTitle(game),
        description: buildGamePageDescription(game),
        keywords: [
            `${game.name} ${game.seasonKeyword}s`,
            `${game.name} seasons`,
            `${game.name} countdown`,
            `${game.name} updates`,
            `${game.name} ${game.seasonKeyword}`,
            `${game.name} next ${game.seasonKeyword}`,
            `${game.name} next ${game.seasonKeyword} start`,
            `${game.name} next ${game.seasonKeyword} release`,
            `${game.name} ${game.seasonKeyword} start date`,
            `when does ${game.name} ${game.seasonKeyword} start`,
            ...(game.shortName
                ? [
                      `${game.shortName} ${game.seasonKeyword}`,
                      `${game.shortName} next ${game.seasonKeyword}`,
                      `${game.shortName} ${game.seasonKeyword} start`,
                      `${game.shortName} ${game.seasonKeyword} release`,
                      `${game.shortName} ${game.seasonKeyword} countdown`,
                      `${game.shortName} seasons`,
                      `when is ${game.shortName} next ${game.seasonKeyword}`,
                  ]
                : []),
            "arpg timeline",
            "season tracker",
        ],
        openGraph: {
            title: buildGamePageOgTitle(game),
            description: buildGamePageOgDescription(game),
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
            title: buildGamePageOgTitle(game),
            description: buildGamePageOgDescription(game),
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
