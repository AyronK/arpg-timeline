import { Metadata } from "next";
import { notFound } from "next/navigation";

import { BreadcrumbSchema } from "@/components/BreadcrumbSchema";
import { SteamDBEmbed } from "@/components/SteamDBEmbed";
import type { Crumb } from "@/lib/articles/breadcrumbs";
import { parseGamesFromSanity } from "@/lib/cms/parseGamesFromSanity";
import {
    gameDetailsQuery,
    GameDetailsQueryResult,
    indexQuery,
    IndexQueryResult,
} from "@/lib/cms/queries/indexQuery";
import { sanityFetch } from "@/lib/sanity/sanityClient";
import { buildSeasonTerms } from "@/lib/seasonTerms";
import { SITE_URL } from "@/lib/siteUrl";
import { getSteamCurrentPlayers } from "@/lib/steam/getMultipleSteamCurrentPlayers";

import { OverviewCard } from "../../components/overview/OverviewCard";
import { SupportCard } from "../../components/overview/OverviewSidebar";
import { StatisticsSection } from "../../components/StatisticsSection";
import { getStatsPath } from "../../hub";
import { formatPerYear } from "../../overview";
import { GamePageProps } from "../../types";
import { calculateGameStatistics, countTrackedSeasons, getOldestSeasonInfo } from "../../utils";
import { isSeasonalGame } from "../timeline/timeline";
import { buildStatsDescription, buildStatsTitle } from "./metadata";

const RECENT_SEASON_COUNT = 3;
const fetchOptions = { revalidate: 24 * 60 * 60, tags: ["season", "game"] };

const hasStats = (game: { categories?: string[]; isComingSoon?: boolean }) =>
    isSeasonalGame(game) && !game.isComingSoon;

const StatsPage = async ({ params }: GamePageProps) => {
    const { gameSlug } = await params;

    const data: GameDetailsQueryResult = await sanityFetch({
        query: gameDetailsQuery,
        ...fetchOptions,
    });
    const game = parseGamesFromSanity(data).find((g) => g.slug === gameSlug);

    if (!game || !hasStats(game)) {
        notFound();
    }

    const terms = buildSeasonTerms(game.seasonKeyword);
    const statistics = calculateGameStatistics(data, gameSlug);
    const trackedCount = countTrackedSeasons(data, gameSlug);
    const recentStatistics =
        trackedCount > RECENT_SEASON_COUNT
            ? calculateGameStatistics(data, gameSlug, { recentCount: RECENT_SEASON_COUNT })
            : undefined;
    const oldestSeasonInfo = getOldestSeasonInfo(data, game);

    const appId = data.games.find((g) => g.slug === gameSlug)?.steam?.appId;
    const steam = appId ? await getSteamCurrentPlayers(appId) : null;

    const crumbs: Crumb[] = [
        { name: "Home", href: "/" },
        { name: game.name, href: `/game/${gameSlug}` },
        { name: "Stats", href: getStatsPath(gameSlug) },
    ];

    return (
        <>
            <BreadcrumbSchema crumbs={crumbs} />
            <div className="relative container mx-auto grid items-start gap-4 py-6 md:gap-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-x-12">
                <div className="flex min-w-0 flex-col gap-4 md:gap-6">
                    <header>
                        <h1 className="font-heading text-2xl md:text-3xl">
                            {game.name} {terms.One} Statistics
                        </h1>
                        <p className="text-muted-foreground mt-2 leading-relaxed">
                            How long past {terms.many} lasted and when they usually launched.
                        </p>
                    </header>

                    <StatisticsSection
                        game={game}
                        statistics={statistics}
                        recentStatistics={recentStatistics}
                        recentSeasonCount={RECENT_SEASON_COUNT}
                        totalCount={trackedCount}
                        oldestSeasonInfo={oldestSeasonInfo}
                    />

                    {steam && (
                        <OverviewCard title="Players on Steam">
                            {steam.currentPlayers > 0 && (
                                <p className="mb-4">
                                    <span className="font-heading text-2xl">
                                        {steam.currentPlayers.toLocaleString("en-US")}
                                    </span>{" "}
                                    <span className="text-muted-foreground text-sm">
                                        playing right now
                                    </span>
                                </p>
                            )}
                            <SteamDBEmbed appId={steam.appId} />
                        </OverviewCard>
                    )}
                </div>

                <aside className="lg:sticky lg:top-12">
                    <SupportCard />
                </aside>
            </div>
        </>
    );
};

export default StatsPage;

export async function generateMetadata({ params }: GamePageProps): Promise<Metadata> {
    const { gameSlug } = await params;

    const data: GameDetailsQueryResult = await sanityFetch({
        query: gameDetailsQuery,
        ...fetchOptions,
    });
    const game = parseGamesFromSanity(data).find((g) => g.slug === gameSlug);

    if (!game || !hasStats(game)) {
        return { title: "Game Not Found" };
    }

    const terms = buildSeasonTerms(game.seasonKeyword);
    const statistics = calculateGameStatistics(data, gameSlug);
    const title = buildStatsTitle(game.name, terms);
    const description = buildStatsDescription(game.name, terms, {
        averageDurationDays: statistics.averageDurationDays,
        perYear: formatPerYear(statistics.averagePerYear),
        count: countTrackedSeasons(data, gameSlug),
    });
    const path = getStatsPath(gameSlug);

    return {
        title,
        description,
        alternates: { canonical: path },
        openGraph: {
            title,
            description,
            siteName: "aRPG Timeline",
            type: "website",
            url: `${SITE_URL}${path}`,
            locale: "en_US",
            images: [{ url: `/api/og?game=${gameSlug}`, width: 1200, height: 630 }],
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: [`/api/og?game=${gameSlug}`],
        },
        robots: { index: true, follow: true },
    };
}

export async function generateStaticParams() {
    const data: IndexQueryResult = await sanityFetch({ query: indexQuery, ...fetchOptions });

    return parseGamesFromSanity(data)
        .filter(hasStats)
        .map((g) => ({ gameSlug: g.slug }));
}

export const revalidate = 3600;
