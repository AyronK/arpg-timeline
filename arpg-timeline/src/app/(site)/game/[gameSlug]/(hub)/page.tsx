import { Metadata } from "next";
import { notFound } from "next/navigation";

import { BreadcrumbSchema } from "@/components/BreadcrumbSchema";
import { getGameArticlesPreview } from "@/lib/articles/getArticleListData";
import { getAverageSeasonDuration, parseGamesFromSanity } from "@/lib/cms/parseGamesFromSanity";
import {
    gameDetailsQuery,
    GameDetailsQueryResult,
    indexQuery,
    IndexQueryResult,
} from "@/lib/cms/queries/indexQuery";
import { getStructuredDataForGame } from "@/lib/games/getStructuredDataForGame";
import { sanityFetch } from "@/lib/sanity/sanityClient";
import { buildSeasonTerms } from "@/lib/seasonTerms";

import { LatestList } from "../components/overview/LatestList";
import { LeagueRhythm, RhythmData } from "../components/overview/LeagueRhythm";
import { CardLink, OverviewCard } from "../components/overview/OverviewCard";
import { OverviewSidebar } from "../components/overview/OverviewSidebar";
import { RecentSeasonsList } from "../components/overview/RecentSeasonsList";
import { NextCard, NowCard } from "../components/overview/StatusCards";
import { getGameFeed } from "../feed";
import { getStatsPath } from "../hub";
import {
    buildGamePageDescription,
    buildGamePageOgDescription,
    buildGamePageOgTitle,
    buildGamePageTitle,
} from "../metadata";
import { buildCadenceHint, buildLengthTile, buildPerYearTile, mergeLatest } from "../overview";
import { GamePageProps, GameStatistics } from "../types";
import { calculateGameStatistics, countTrackedSeasons, getArchivalSeasons } from "../utils";
import { getTimelinePath, isSeasonalGame } from "./timeline/timeline";

const RECENT_SEASON_COUNT = 3;
const LATEST_COUNT = 3;

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

    const terms = buildSeasonTerms(game.seasonKeyword);
    const hasSeasons = isSeasonalGame(game) && !game.isComingSoon;
    const steamAppId = data.games.find((g) => g.slug === gameSlug)?.steam?.appId;

    const [feed, gameArticles] = await Promise.all([
        getGameFeed(gameSlug, LATEST_COUNT),
        getGameArticlesPreview(gameSlug),
    ]);
    const latest = mergeLatest(feed, gameArticles.news, gameSlug, LATEST_COUNT, new Date());

    const toRhythm = (stats: GameStatistics): RhythmData => ({
        length: buildLengthTile(stats, terms),
        perYear: buildPerYearTile(stats, terms),
        confirmedStartDates: stats.confirmedStartDates,
        usualStartTime: stats.usualStartTime,
    });
    const trackedCount = countTrackedSeasons(data, gameSlug);
    const allStatistics = calculateGameStatistics(data, gameSlug);
    const rhythm = toRhythm(allStatistics);
    const recentRhythm =
        trackedCount > RECENT_SEASON_COUNT
            ? toRhythm(
                  calculateGameStatistics(data, gameSlug, { recentCount: RECENT_SEASON_COUNT }),
              )
            : undefined;
    const hasRhythm = hasSeasons && !!(rhythm.length || rhythm.perYear);
    const recentSeasons = hasSeasons ? getArchivalSeasons(data, game).slice(0, 3) : [];

    const cadenceHint = hasSeasons
        ? buildCadenceHint({
              currentStart: game.currentSeason?.start?.startDate,
              medianDays: allStatistics.medianDuration,
              trackedCount,
              terms,
              now: new Date(),
          })
        : null;

    const status = game.isComingSoon ? (
        <NextCard game={game} />
    ) : hasSeasons ? (
        <div className="grid gap-4 md:grid-cols-2 md:gap-6">
            <NowCard game={game} />
            <NextCard game={game} cadenceHint={cadenceHint} />
        </div>
    ) : null;

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
            <div className="relative container mx-auto grid items-start gap-4 py-6 md:gap-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-x-12">
                <div className="flex min-w-0 flex-col gap-4 md:gap-6">
                    {status}
                    {hasRhythm && (
                        <LeagueRhythm
                            all={rhythm}
                            recent={recentRhythm}
                            allCount={trackedCount}
                            recentCount={RECENT_SEASON_COUNT}
                            terms={terms}
                            gameSlug={gameSlug}
                            footer={
                                <CardLink
                                    href={getStatsPath(gameSlug)}
                                    saClick={`${gameSlug}-rhythm-all-stats`}
                                >
                                    All statistics
                                </CardLink>
                            }
                        />
                    )}

                    <OverviewCard
                        title="Latest"
                        action={
                            <CardLink
                                href={`/game/${gameSlug}/news`}
                                saClick={`${gameSlug}-latest-all-news`}
                            >
                                All news
                            </CardLink>
                        }
                    >
                        <LatestList items={latest} gameSlug={gameSlug} />
                    </OverviewCard>

                    {recentSeasons.length > 0 && (
                        <OverviewCard
                            title={`Recent ${terms.many}`}
                            action={
                                <CardLink
                                    href={getTimelinePath(gameSlug)}
                                    saClick={`${gameSlug}-recent-full-timeline`}
                                >
                                    Full timeline
                                </CardLink>
                            }
                        >
                            <RecentSeasonsList seasons={recentSeasons} />
                        </OverviewCard>
                    )}
                </div>

                <OverviewSidebar game={game} steamAppId={steamAppId} />
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
                    url: `/api/og?game=${slug}`,
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
            images: [`/api/og?game=${slug}`],
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
