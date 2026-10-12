import { Metadata } from "next";
import { notFound } from "next/navigation";

import { BreadcrumbSchema } from "@/components/BreadcrumbSchema";
import { SteamDBEmbed } from "@/components/SteamDBEmbed";
import type { Crumb } from "@/lib/articles/breadcrumbs";
import { indexQuery, IndexQueryResult } from "@/lib/cms/queries/indexQuery";
import { sanityFetch } from "@/lib/sanity/sanityClient";
import { buildSeasonTerms } from "@/lib/seasonTerms";
import { SITE_URL } from "@/lib/siteUrl";
import { getSteamCurrentPlayers } from "@/lib/steam/getMultipleSteamCurrentPlayers";

import { OverviewCard } from "../../components/overview/OverviewCard";
import { SupportCard } from "../../components/overview/OverviewSidebar";
import { StatisticsSection } from "../../components/StatisticsSection";
import { getGameDetails } from "../../gameData";
import { getStatsPath, hasSeasonStats, hasStatsTab } from "../../hub";
import { formatPerYear } from "../../overview";
import { GamePageProps } from "../../types";
import { calculateGameStatistics, countTrackedSeasons, getOldestSeasonInfo } from "../../utils";
import {
    buildPlayersDescription,
    buildPlayersTitle,
    buildStatsDescription,
    buildStatsTitle,
} from "./metadata";

const RECENT_SEASON_COUNT = 3;
const fetchOptions = { revalidate: 24 * 60 * 60, tags: ["season", "game"] };

const StatsPage = async ({ params }: GamePageProps) => {
    const { gameSlug } = await params;

    const { data, game, steamAppId: appId } = await getGameDetails(gameSlug);

    const trackedCount = countTrackedSeasons(data, gameSlug);
    if (!game || !hasStatsTab(game, !!appId, trackedCount)) {
        notFound();
    }

    // Short histories only get the Steam players section
    const seasonal = hasSeasonStats(game, trackedCount);
    const terms = buildSeasonTerms(game.seasonKeyword);
    const statistics = calculateGameStatistics(data, gameSlug);
    const recentStatistics =
        trackedCount > RECENT_SEASON_COUNT
            ? calculateGameStatistics(data, gameSlug, { recentCount: RECENT_SEASON_COUNT })
            : undefined;
    const oldestSeasonInfo = getOldestSeasonInfo(data, game);

    const steam = appId ? await getSteamCurrentPlayers(appId) : null;

    const crumbs: Crumb[] = [
        { name: "Home", href: "/" },
        { name: game.name, href: `/game/${gameSlug}` },
        { name: "Stats", href: getStatsPath(gameSlug) },
    ];

    return (
        <>
            <BreadcrumbSchema crumbs={crumbs} />
            <div className="relative container mx-auto grid items-start gap-4 py-6 md:gap-6 xl:grid-cols-[minmax(0,1fr)_20rem] xl:gap-x-12">
                <div className="flex min-w-0 flex-col gap-4 md:gap-6">
                    <header>
                        <h1 className="font-heading text-2xl md:text-3xl">
                            {game.name} {seasonal ? `${terms.One} Statistics` : "Player Statistics"}
                        </h1>
                        <p className="text-muted-foreground mt-2 leading-relaxed">
                            {seasonal
                                ? `How long past ${terms.many} lasted and when they usually launched.`
                                : "Live player count on Steam."}
                        </p>
                    </header>

                    {seasonal && (
                        <StatisticsSection
                            game={game}
                            statistics={statistics}
                            recentStatistics={recentStatistics}
                            recentSeasonCount={RECENT_SEASON_COUNT}
                            totalCount={trackedCount}
                            oldestSeasonInfo={oldestSeasonInfo}
                        />
                    )}

                    {steam && (
                        <OverviewCard title="Players on Steam">
                            {seasonal || steam.currentPlayers > 0 ? (
                                <SteamDBEmbed appId={steam.appId} />
                            ) : (
                                // SteamDB has no chart for apps nobody plays yet (demos, pre-release)
                                <p className="text-muted-foreground text-sm">
                                    No one is playing on Steam right now, so there is no player
                                    chart yet.
                                </p>
                            )}
                        </OverviewCard>
                    )}
                </div>

                <aside className="xl:sticky xl:top-12">
                    <SupportCard />
                </aside>
            </div>
        </>
    );
};

export default StatsPage;

export async function generateMetadata({ params }: GamePageProps): Promise<Metadata> {
    const { gameSlug } = await params;

    const { data, game, steamAppId } = await getGameDetails(gameSlug);

    const trackedCount = countTrackedSeasons(data, gameSlug);
    if (!game || !hasStatsTab(game, !!steamAppId, trackedCount)) {
        return { title: "Game Not Found" };
    }

    const terms = buildSeasonTerms(game.seasonKeyword);
    const statistics = calculateGameStatistics(data, gameSlug);
    const seasonal = hasSeasonStats(game, trackedCount);
    const title = seasonal ? buildStatsTitle(game.name, terms) : buildPlayersTitle(game.name);
    const description = seasonal
        ? buildStatsDescription(game.name, terms, {
              averageDurationDays: statistics.averageDurationDays,
              perYear: formatPerYear(statistics.averagePerYear),
              count: trackedCount,
          })
        : buildPlayersDescription(game.name);
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

    return data.games
        .filter(
            (g) => g.slug && hasStatsTab(g, !!g.steam?.appId, countTrackedSeasons(data, g.slug)),
        )
        .map((g) => ({ gameSlug: g.slug }));
}

export const revalidate = 3600;
