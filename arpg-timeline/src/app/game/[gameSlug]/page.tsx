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
                    <div className="flex-1">
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
                    </div>

                    <div className="flex-1">
                        <div className="h-full rounded-lg border p-4 md:p-6">
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
