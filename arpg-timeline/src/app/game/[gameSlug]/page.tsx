import { Metadata } from "next";
import { notFound } from "next/navigation";

import { BreadcrumbSchema } from "@/components/BreadcrumbSchema";
import { GameCard } from "@/components/GameCard/GameCard";
import { MaybeLinkWrapper } from "@/components/MaybeLinkWrapper";
import { SanityImage } from "@/components/SanityImage";
import { SteamDBEmbed } from "@/components/SteamDBEmbed";
import { SteamEmbed } from "@/components/SteamEmbed";
import { GameToSeasonWidget } from "@/hoc/GameToSeasonWidget/GameToSeasonWidget";
import { parseGamesFromSanity } from "@/lib/cms/parseGamesFromSanity";
import { indexQuery, IndexQueryResult } from "@/lib/cms/queries/indexQuery";
import { inGracePeriod } from "@/lib/games/sortBySeasons";
import { sanityFetch } from "@/lib/sanity/sanityClient";

interface GamePageProps {
    params: Promise<{ gameSlug: string }>;
}

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

    return (
        <>
            <BreadcrumbSchema path={`game/${gameSlug}`} />
            <div className="container mx-auto px-4 py-6 md:py-8">
                <h1 className="font-heading mb-6 text-3xl font-bold md:mb-8 md:text-4xl">
                    {game.name}
                </h1>

                <div className="mb-6 flex flex-col gap-4 md:mb-8 md:gap-6 lg:flex-row">
                    <GameCard
                        name={game.name}
                        gameLogo={
                            <SanityImage
                                loading="lazy"
                                src={game.logo!}
                                alt={`${game.name} logo`}
                                className="my-auto"
                                width={160}
                                height={140}
                                objectFit="contain"
                            />
                        }
                        slug={game.slug}
                        shortName={game.shortName!}
                        url={game.url!}
                        official={game.official}
                        stats={{}}
                    >
                        <GameToSeasonWidget game={game} selector="current" />
                        {inGracePeriod(game.currentSeason?.start?.startDate) ? (
                            game.currentSeason?.patchNotesUrl && (
                                <div className="mt-auto flex flex-col gap-2">
                                    <MaybeLinkWrapper
                                        href={game.currentSeason.patchNotesUrl}
                                        target="_blank"
                                        className="ml-auto text-sm text-nowrap hover:underline"
                                        data-sa-click={`${game.currentSeason.name}-patch-notes`}
                                    >
                                        Patch notes
                                    </MaybeLinkWrapper>
                                </div>
                            )
                        ) : (
                            <GameToSeasonWidget game={game} selector="next" />
                        )}
                    </GameCard>

                    <div className="flex-1 rounded-lg border p-4 md:p-6">
                        <h2 className="mb-3 text-lg font-semibold md:mb-4 md:text-xl">
                            Quick Links
                        </h2>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:gap-4">
                            {game.url && (
                                <MaybeLinkWrapper
                                    href={game.url}
                                    target="_blank"
                                    rel="noopener"
                                    data-sa-click={`${gameSlug}-official-website`}
                                >
                                    Official Game Website
                                </MaybeLinkWrapper>
                            )}
                            {steamAppId && (
                                <MaybeLinkWrapper
                                    href={`https://store.steampowered.com/app/${steamAppId}`}
                                    target="_blank"
                                    rel="noopener"
                                    data-sa-click={`${gameSlug}-steam-page`}
                                >
                                    Steam Page
                                </MaybeLinkWrapper>
                            )}
                            {game.currentSeason?.url && (
                                <MaybeLinkWrapper
                                    href={game.currentSeason.url}
                                    target="_blank"
                                    rel="noopener"
                                    data-sa-click={`${gameSlug}-current-season-details`}
                                >
                                    Current Season Details
                                </MaybeLinkWrapper>
                            )}
                            {game.nextSeason?.url && (
                                <MaybeLinkWrapper
                                    href={game.nextSeason.url}
                                    target="_blank"
                                    rel="noopener"
                                    data-sa-click={`${gameSlug}-next-season-details`}
                                >
                                    Next Season Details
                                </MaybeLinkWrapper>
                            )}
                            <MaybeLinkWrapper
                                href={`/docs/html/${gameSlug}`}
                                data-sa-click={`${gameSlug}-html-docs`}
                            >
                                HTML Documentation
                            </MaybeLinkWrapper>
                            <MaybeLinkWrapper
                                href={`/docs/obs/${gameSlug}`}
                                data-sa-click={`${gameSlug}-obs-docs`}
                            >
                                OBS Integration
                            </MaybeLinkWrapper>
                            <MaybeLinkWrapper
                                href={`/embed/season-widget/${gameSlug}`}
                                data-sa-click={`${gameSlug}-embed-widget`}
                            >
                                Embed Widget
                            </MaybeLinkWrapper>
                        </div>
                    </div>
                </div>

                <div className="mb-6 md:mb-8">
                    <div className="rounded-lg border p-4 md:p-6">
                        <h2 className="mb-3 text-lg font-semibold md:mb-4 md:text-xl">
                            Statistics
                        </h2>
                        <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-5">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-slate-400">
                                    {game.averageSeasonDuration || "N/A"} days
                                </div>
                                <div className="text-muted-foreground text-sm">
                                    Average Duration
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-slate-400">
                                    {(() => {
                                        const gameSeasons = data.seasons.filter(
                                            (s) => s?.game === gameSlug,
                                        );
                                        if (gameSeasons.length < 2) return "N/A";

                                        const seasonsWithDates = gameSeasons.filter(
                                            (s) => s?.start?.startDate,
                                        );
                                        if (seasonsWithDates.length < 2) return "N/A";

                                        const sortedSeasons = seasonsWithDates.sort((a, b) => {
                                            const aDate = a?.start?.startDate
                                                ? new Date(a.start.startDate).getTime()
                                                : 0;
                                            const bDate = b?.start?.startDate
                                                ? new Date(b.start.startDate).getTime()
                                                : 0;
                                            return aDate - bDate;
                                        });

                                        let totalDays = 0;
                                        let count = 0;

                                        for (let i = 0; i < sortedSeasons.length - 1; i++) {
                                            const currentStartDate =
                                                sortedSeasons[i]!.start!.startDate;
                                            const nextStartDate =
                                                sortedSeasons[i + 1]!.start!.startDate;
                                            if (!currentStartDate || !nextStartDate) continue;
                                            const current = new Date(currentStartDate);
                                            const next = new Date(nextStartDate);
                                            const daysBetween = Math.ceil(
                                                (next.getTime() - current.getTime()) /
                                                    (1000 * 60 * 60 * 24),
                                            );
                                            totalDays += daysBetween;
                                            count++;
                                        }

                                        if (count === 0) return "N/A";

                                        const avgDaysBetweenSeasons = totalDays / count;
                                        const seasonsPerYear = (
                                            365 / avgDaysBetweenSeasons
                                        ).toFixed(2);

                                        return seasonsPerYear;
                                    })()}
                                </div>
                                <div className="text-muted-foreground text-sm">
                                    Average Per Year
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-slate-400">
                                    {(() => {
                                        const gameSeasons = data.seasons.filter(
                                            (s) => s?.game === gameSlug,
                                        );
                                        if (gameSeasons.length === 0) return "N/A";

                                        const seasonsWithStartTimes = gameSeasons.filter(
                                            (s) => s?.start?.startDate,
                                        );
                                        if (seasonsWithStartTimes.length === 0) return "N/A";

                                        const startHours = seasonsWithStartTimes
                                            .map((s) => s?.start?.startDate)
                                            .filter((d): d is string => typeof d === "string")
                                            .map((d) => {
                                                const date = new Date(d);
                                                return date.getHours();
                                            });

                                        const hourCounts = startHours.reduce(
                                            (acc, hour) => {
                                                acc[hour] = (acc[hour] || 0) + 1;
                                                return acc;
                                            },
                                            {} as Record<number, number>,
                                        );

                                        const mostCommonHour = Object.entries(hourCounts).sort(
                                            ([, a], [, b]) => b - a,
                                        )[0];

                                        if (!mostCommonHour) return "N/A";

                                        const hour = parseInt(mostCommonHour[0]);
                                        const ampm = hour >= 12 ? "PM" : "AM";
                                        const displayHour =
                                            hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;

                                        return `${displayHour} ${ampm}`;
                                    })()}
                                </div>
                                <div className="text-muted-foreground text-sm">
                                    Usual Start Time
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-slate-400">
                                    {(() => {
                                        const gameSeasons = data.seasons.filter(
                                            (s) => s?.game === gameSlug,
                                        );
                                        if (gameSeasons.length === 0) return "N/A";

                                        const completedSeasons = gameSeasons.filter(
                                            (s) => s?.start?.startDate && s?.end?.endDate,
                                        );
                                        if (completedSeasons.length === 0) return "N/A";

                                        const seasonDurations = completedSeasons
                                            .map((s) => {
                                                if (!s?.start?.startDate || !s?.end?.endDate)
                                                    return null;
                                                const start = new Date(s.start.startDate);
                                                const end = new Date(s.end.endDate);
                                                return {
                                                    duration: Math.ceil(
                                                        (end.getTime() - start.getTime()) /
                                                            (1000 * 60 * 60 * 24),
                                                    ),
                                                    name: s.name,
                                                };
                                            })
                                            .filter((s): s is NonNullable<typeof s> => s !== null);

                                        const maxSeason = seasonDurations.reduce((max, season) =>
                                            season.duration > max.duration ? season : max,
                                        );
                                        return `${maxSeason.duration} days`;
                                    })()}
                                </div>
                                <div className="text-muted-foreground text-sm">Max Duration</div>
                                <div className="text-muted-foreground mt-1 text-xs">
                                    {(() => {
                                        const gameSeasons = data.seasons.filter(
                                            (s) => s?.game === gameSlug,
                                        );
                                        if (gameSeasons.length === 0) return "";

                                        const completedSeasons = gameSeasons.filter(
                                            (s) => s?.start?.startDate && s?.end?.endDate,
                                        );
                                        if (completedSeasons.length === 0) return "";

                                        const seasonDurations = completedSeasons
                                            .map((s) => {
                                                if (!s?.start?.startDate || !s?.end?.endDate)
                                                    return null;
                                                const start = new Date(s.start.startDate);
                                                const end = new Date(s.end.endDate);
                                                return {
                                                    duration: Math.ceil(
                                                        (end.getTime() - start.getTime()) /
                                                            (1000 * 60 * 60 * 24),
                                                    ),
                                                    name: s.name,
                                                };
                                            })
                                            .filter((s): s is NonNullable<typeof s> => s !== null);

                                        const maxSeason = seasonDurations.reduce((max, season) =>
                                            season.duration > max.duration ? season : max,
                                        );
                                        return maxSeason.name;
                                    })()}
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-slate-400">
                                    {(() => {
                                        const gameSeasons = data.seasons.filter(
                                            (s) => s?.game === gameSlug,
                                        );
                                        if (gameSeasons.length === 0) return "N/A";

                                        const completedSeasons = gameSeasons.filter(
                                            (s) => s?.start?.startDate && s?.end?.endDate,
                                        );
                                        if (completedSeasons.length === 0) return "N/A";

                                        const seasonDurations = completedSeasons
                                            .map((s) => {
                                                if (!s?.start?.startDate || !s?.end?.endDate)
                                                    return null;
                                                const start = new Date(s.start.startDate);
                                                const end = new Date(s.end.endDate);
                                                return {
                                                    duration: Math.ceil(
                                                        (end.getTime() - start.getTime()) /
                                                            (1000 * 60 * 60 * 24),
                                                    ),
                                                    name: s.name,
                                                };
                                            })
                                            .filter((s): s is NonNullable<typeof s> => s !== null);

                                        const minSeason = seasonDurations.reduce((min, season) =>
                                            season.duration < min.duration ? season : min,
                                        );
                                        return `${minSeason.duration} days`;
                                    })()}
                                </div>
                                <div className="text-muted-foreground text-sm">Min Duration</div>
                                <div className="text-muted-foreground mt-1 text-xs">
                                    {(() => {
                                        const gameSeasons = data.seasons.filter(
                                            (s) => s?.game === gameSlug,
                                        );
                                        if (gameSeasons.length === 0) return "";

                                        const completedSeasons = gameSeasons.filter(
                                            (s) => s?.start?.startDate && s?.end?.endDate,
                                        );
                                        if (completedSeasons.length === 0) return "";

                                        const seasonDurations = completedSeasons
                                            .map((s) => {
                                                if (!s?.start?.startDate || !s?.end?.endDate)
                                                    return null;
                                                const start = new Date(s.start.startDate);
                                                const end = new Date(s.end.endDate);
                                                return {
                                                    duration: Math.ceil(
                                                        (end.getTime() - start.getTime()) /
                                                            (1000 * 60 * 60 * 24),
                                                    ),
                                                    name: s.name,
                                                };
                                            })
                                            .filter((s): s is NonNullable<typeof s> => s !== null);

                                        const minSeason = seasonDurations.reduce((min, season) =>
                                            season.duration < min.duration ? season : min,
                                        );
                                        return minSeason.name;
                                    })()}
                                </div>
                            </div>
                        </div>
                        <div className="text-muted-foreground mt-4 text-center text-xs">
                            {(() => {
                                const gameSeasons = data.seasons.filter(
                                    (s) => s?.game === gameSlug,
                                );
                                if (gameSeasons.length === 0) return "No season data available";

                                const seasonsWithStartDates = gameSeasons.filter(
                                    (s) => s?.start?.startDate,
                                );
                                if (seasonsWithStartDates.length === 0)
                                    return "No season start dates available";

                                const oldestSeason = seasonsWithStartDates.reduce(
                                    (oldest, season) => {
                                        if (!season?.start?.startDate || !oldest?.start?.startDate)
                                            return oldest || season;
                                        const currentDate = new Date(season.start.startDate);
                                        const oldestDate = new Date(oldest.start.startDate);
                                        return currentDate < oldestDate ? season : oldest;
                                    },
                                );

                                if (!oldestSeason?.start?.startDate)
                                    return "No valid season data available";
                                const oldestDate = new Date(oldestSeason.start.startDate);
                                const formattedOldestDate = oldestDate.toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                });

                                return `Calculations based on ${seasonsWithStartDates.length} historical entries. Oldest season in aRPG Timeline's archive started ${formattedOldestDate}.`;
                            })()}
                        </div>
                    </div>
                </div>

                {steamAppId && (
                    <div className="space-y-6 md:space-y-8">
                        <h2 className="text-2xl font-bold md:text-3xl">Steam Integration</h2>
                        <div className="grid gap-4 md:gap-6 lg:grid-cols-2">
                            <div>
                                <h3 className="mb-3 text-lg font-semibold">Steam Store</h3>
                                <SteamEmbed appId={steamAppId} />
                            </div>
                            <div>
                                <h3 className="mb-3 text-lg font-semibold">SteamDB Stats</h3>
                                <SteamDBEmbed appId={steamAppId} />
                            </div>
                        </div>
                    </div>
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
            images: [game.logo?.url || "/assets/seoimage.png"],
            type: "website",
            url: `https://arpg-timeline.com/game/${slug}`,
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
        slug: g.slug,
    }));
}
