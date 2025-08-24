import { Metadata } from "next";
import { notFound } from "next/navigation";

import { BreadcrumbSchema } from "@/components/BreadcrumbSchema";
import { GameCard } from "@/components/GameCard/GameCard";
import { MaybeLinkWrapper } from "@/components/MaybeLinkWrapper";
import { SanityImage } from "@/components/SanityImage";
import { SteamDBEmbed } from "@/components/SteamDBEmbed";
import { SteamEmbed } from "@/components/SteamEmbed";
import { SteamNews } from "@/components/SteamNews";
import { GameToSeasonWidget } from "@/hoc/GameToSeasonWidget/GameToSeasonWidget";
import { Game as CMSGame } from "@/lib/cms/games.types";
import { parseGamesFromSanity } from "@/lib/cms/parseGamesFromSanity";
import { indexQuery, IndexQueryResult } from "@/lib/cms/queries/indexQuery";
import { inGracePeriod } from "@/lib/games/sortBySeasons";
import { sanityFetch } from "@/lib/sanity/sanityClient";
import { getSteamNews, SteamNewsItem } from "@/lib/steam/getSteamNews";
import { cn } from "@/lib/utils";

interface GamePageProps {
    params: Promise<{ gameSlug: string }>;
}

interface SeasonDuration {
    duration: number;
    name: string;
}

interface GameStatistics {
    averagePerYear: string;
    usualStartTime: string;
    maxDuration: { days: string; name: string };
    minDuration: { days: string; name: string };
}

interface LocalSeason {
    game?: string;
    start?: { startDate?: string; confirmed?: boolean };
    end?: { endDate?: string; confirmed?: boolean };
    name?: string;
}

const calculateAveragePerYear = (gameSeasons: LocalSeason[]): string => {
    if (gameSeasons.length < 2) return "N/A";

    const seasonsWithConfirmedDates = gameSeasons.filter(
        (s) => s?.start?.startDate && s?.start?.confirmed,
    );
    if (seasonsWithConfirmedDates.length < 2) return "N/A";

    const sortedSeasons = seasonsWithConfirmedDates.sort((a, b) => {
        const aDate = a?.start?.startDate ? new Date(a.start.startDate).getTime() : 0;
        const bDate = b?.start?.startDate ? new Date(b.start.startDate).getTime() : 0;
        return aDate - bDate;
    });

    let totalDays = 0;
    let count = 0;

    for (let i = 0; i < sortedSeasons.length - 1; i++) {
        const currentStartDate = sortedSeasons[i]?.start?.startDate;
        const nextStartDate = sortedSeasons[i + 1]?.start?.startDate;
        if (!currentStartDate || !nextStartDate) continue;

        const current = new Date(currentStartDate);
        const next = new Date(nextStartDate);
        const daysBetween = Math.ceil((next.getTime() - current.getTime()) / (1000 * 60 * 60 * 24));
        totalDays += daysBetween;
        count++;
    }

    if (count === 0) return "N/A";

    const avgDaysBetweenSeasons = totalDays / count;
    return (365 / avgDaysBetweenSeasons).toFixed(2);
};

const calculateUsualStartTime = (gameSeasons: LocalSeason[]): string => {
    if (gameSeasons.length === 0) return "N/A";

    const seasonsWithConfirmedStartTimes = gameSeasons.filter(
        (s) => s?.start?.startDate && s?.start?.confirmed,
    );
    if (seasonsWithConfirmedStartTimes.length === 0) return "N/A";

    const startHours = seasonsWithConfirmedStartTimes
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

    const mostCommonHour = Object.entries(hourCounts).sort(([, a], [, b]) => b - a)[0];

    if (!mostCommonHour) return "N/A";

    const hour = parseInt(mostCommonHour[0]);
    const date = new Date();
    date.setHours(hour, 0, 0, 0);
    return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
};

const calculateSeasonDurations = (gameSeasons: LocalSeason[]): SeasonDuration[] => {
    const completedSeasons = gameSeasons.filter(
        (s) => s?.start?.startDate && s?.start?.confirmed && s?.end?.endDate && s?.end?.confirmed,
    );

    return completedSeasons
        .map((s) => {
            if (!s?.start?.startDate || !s?.end?.endDate) return null;
            const start = new Date(s.start.startDate);
            const end = new Date(s.end.endDate);
            return {
                duration: Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)),
                name: s.name || "Unknown",
            };
        })
        .filter((s): s is NonNullable<typeof s> => s !== null);
};

const calculateGameStatistics = (data: IndexQueryResult, gameSlug: string): GameStatistics => {
    const gameSeasons = data.seasons.filter((s) => s?.game === gameSlug);

    const seasonDurations = calculateSeasonDurations(gameSeasons);

    if (seasonDurations.length === 0) {
        return {
            averagePerYear: "N/A",
            usualStartTime: "N/A",
            maxDuration: { days: "N/A", name: "N/A" },
            minDuration: { days: "N/A", name: "N/A" },
        };
    }

    const maxSeason = seasonDurations.reduce((max, season) =>
        season.duration > max.duration ? season : max,
    );

    const minSeason = seasonDurations.reduce((min, season) =>
        season.duration < min.duration ? season : min,
    );

    return {
        averagePerYear: calculateAveragePerYear(gameSeasons),
        usualStartTime: calculateUsualStartTime(gameSeasons),
        maxDuration: { days: `${maxSeason.duration} days`, name: maxSeason.name },
        minDuration: { days: `${minSeason.duration} days`, name: minSeason.name },
    };
};

const getOldestSeasonInfo = (data: IndexQueryResult, gameSlug: string): string => {
    const gameSeasons = data.seasons.filter((s) => s?.game === gameSlug);
    if (gameSeasons.length === 0) return "No season data available";

    const seasonsWithConfirmedStartDates = gameSeasons.filter(
        (s) => s?.start?.startDate && s?.start?.confirmed,
    );
    if (seasonsWithConfirmedStartDates.length === 0)
        return "No confirmed season start dates available";

    const oldestSeason = seasonsWithConfirmedStartDates.reduce((oldest, season) => {
        if (!season?.start?.startDate || !oldest?.start?.startDate) return oldest || season;
        const currentDate = new Date(season.start.startDate);
        const oldestDate = new Date(oldest.start.startDate);
        return currentDate < oldestDate ? season : oldest;
    });

    if (!oldestSeason?.start?.startDate) return "No valid season data available";

    const oldestDate = new Date(oldestSeason.start.startDate);
    const formattedOldestDate = oldestDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    return `Calculations based on ${seasonsWithConfirmedStartDates.length} confirmed historical entries. Oldest season in aRPG Timeline's archive started ${formattedOldestDate}.`;
};

const StatisticsCard = ({
    value,
    label,
    subValue = null,
    className,
}: {
    value: string;
    label: string;
    subValue?: string | null;
    className?: string;
}) => (
    <div className={cn("text-center", className)}>
        <div className="text-primary text-2xl font-bold">{value}</div>
        <div className="text-foreground text-sm">{label}</div>
        {subValue && <div className="text-foreground mt-1 text-xs">{subValue}</div>}
    </div>
);

// TODO add UTM
const QuickLinksSection = ({
    game,
    gameSlug,
    steamAppId,
}: {
    game: CMSGame;
    gameSlug: string;
    steamAppId?: number | null;
}) => (
    <div className="bg-card text-card-foreground flex-1 rounded-lg border p-4 md:p-6">
        <h2 className="font-heading mb-3 text-lg md:mb-4 md:text-xl">Quick Links</h2>
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
                    href={game.currentSeason?.url}
                    target="_blank"
                    rel="noopener"
                    data-sa-click={`${gameSlug}-current-season-details`}
                >
                    Current Season Details
                </MaybeLinkWrapper>
            )}
            {game.nextSeason?.url && (
                <MaybeLinkWrapper
                    href={game.nextSeason?.url}
                    target="_blank"
                    rel="noopener"
                    data-sa-click={`${gameSlug}-next-season-details`}
                >
                    Next Season Details
                </MaybeLinkWrapper>
            )}

            <div className="border-muted-foreground col-span-full h-px border border-t opacity-50" />

            <MaybeLinkWrapper
                href={`/docs/html/${gameSlug}`}
                data-sa-click={`${gameSlug}-html-docs`}
            >
                HTML Documentation
            </MaybeLinkWrapper>
            <MaybeLinkWrapper href={`/docs/obs/${gameSlug}`} data-sa-click={`${gameSlug}-obs-docs`}>
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
);

const SteamIntegrationSection = ({
    steamAppId,
    steamNews,
}: {
    steamAppId: number;
    steamNews: SteamNewsItem[];
}) => (
    <div className="space-y-6 md:gap-6 md:space-y-8">
        <h2 className="font-heading text-2xl md:text-3xl">Steam Integration</h2>
        <div className="grid gap-4 md:gap-6 lg:grid-cols-2">
            <div className="flex flex-1 flex-col justify-between">
                <div className="md:bg-card md:text-card-foreground md:rounded-lg md:border md:p-4">
                    <h3 className="font-heading mb-3 text-lg">Steam Store</h3>
                    <SteamEmbed appId={steamAppId} />
                </div>
                <div className="md:bg-card md:text-card-foreground md:rounded-lg md:border md:p-4">
                    <h3 className="font-heading mb-3 text-lg">SteamDB Stats</h3>
                    <SteamDBEmbed appId={steamAppId} />
                </div>
            </div>
            <SteamNews steamAppId={steamAppId} news={steamNews} />
        </div>
    </div>
);

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

    return (
        <>
            <BreadcrumbSchema path={`game/${gameSlug}`} />
            <div className="container mx-auto px-4 py-6 md:py-8">
                <h1 className="font-heading mb-6 text-3xl md:mb-8 md:text-4xl">{game.name}</h1>

                <div className="mb-6 flex flex-col gap-4 md:mb-8 md:gap-6 lg:flex-row">
                    <GameCard
                        noMenu
                        name={game.name}
                        gameLogo={
                            game.logo ? (
                                <SanityImage
                                    loading="lazy"
                                    src={game.logo}
                                    alt={`${game.name} logo`}
                                    className="my-auto"
                                    width={160}
                                    height={140}
                                    objectFit="contain"
                                />
                            ) : (
                                <div className="bg-muted text-muted-foreground my-auto flex h-[140px] w-[160px] items-center justify-center">
                                    No Logo
                                </div>
                            )
                        }
                        slug={game.slug}
                        shortName={game.shortName || game.name}
                        url={game.url || "#"}
                        official={game.official}
                        stats={{}}
                    >
                        <GameToSeasonWidget game={game} selector="current" />
                        {inGracePeriod(game.currentSeason?.start?.startDate) ? (
                            game.currentSeason?.patchNotesUrl && (
                                <div className="mt-auto flex flex-col gap-2">
                                    <MaybeLinkWrapper
                                        href={game.currentSeason?.patchNotesUrl}
                                        target="_blank"
                                        className="text-primary hover:text-primary/80 ml-auto text-sm text-nowrap hover:underline"
                                        data-sa-click={`${game.currentSeason?.name}-patch-notes`}
                                    >
                                        Patch notes
                                    </MaybeLinkWrapper>
                                </div>
                            )
                        ) : (
                            <GameToSeasonWidget game={game} selector="next" />
                        )}
                    </GameCard>

                    <QuickLinksSection game={game} gameSlug={gameSlug} steamAppId={steamAppId} />
                </div>

                <div className="mb-6 md:mb-8">
                    <div className="bg-card text-card-foreground rounded-lg border p-4 md:p-6">
                        <h2 className="font-heading mb-3 text-lg md:mb-4 md:text-xl">Statistics</h2>
                        <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-5">
                            <StatisticsCard
                                value={`${game.averageSeasonDuration || "N/A"} days`}
                                label="Average Duration"
                            />
                            <StatisticsCard
                                value={statistics.averagePerYear}
                                label="Average Per Year"
                            />
                            <StatisticsCard
                                className="col-span-full md:col-span-1"
                                value={statistics.usualStartTime}
                                label="Usual Start Time"
                            />
                            <StatisticsCard
                                value={statistics.maxDuration.days}
                                label="Max Duration"
                                subValue={statistics.maxDuration.name}
                            />
                            <StatisticsCard
                                value={statistics.minDuration.days}
                                label="Min Duration"
                                subValue={statistics.minDuration.name}
                            />
                        </div>
                        <div className="text-muted-foreground mt-4 text-center text-xs">
                            {oldestSeasonInfo}
                        </div>
                    </div>
                </div>

                {steamAppId && (
                    <SteamIntegrationSection
                        steamAppId={steamAppId}
                        gameName={game.name}
                        steamNews={steamNews}
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

    // TODO revisit metadata and make code review overall on the PR
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
