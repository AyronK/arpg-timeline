import { notFound } from "next/navigation";

import ErrorBoundary from "@/components/ErrorBoundary";
import { EmbedGameCard } from "@/components/GameCard/EmbedGameCard";
import { MaybeLinkWrapper } from "@/components/MaybeLinkWrapper";
import { SanityImage } from "@/components/SanityImage";
import { WidgetDiedFallback } from "@/components/WidgetDiedFallback";
import { EmbedGameToSeasonWidget } from "@/hoc/GameToSeasonWidget/EmbedGameToSeasonWidget";
import { parseGamesFromSanity } from "@/lib/cms/parseGamesFromSanity";
import { indexQuery, IndexQueryResult } from "@/lib/cms/queries/indexQuery";
import { inGracePeriod } from "@/lib/games/sortBySeasons";
import { sanityFetch } from "@/lib/sanity/sanityClient";
import { getSteamCurrentPlayers } from "@/lib/steam/getMultipleSteamCurrentPlayers";

const Home = async ({ params }: { params: Promise<{ gameSlug: string }> }) => {
    const { gameSlug } = await params;
    const data: IndexQueryResult = await sanityFetch({
        query: indexQuery,
        revalidate: 24 * 60 * 60,
        tags: ["season", "game"],
    });
    const game = parseGamesFromSanity(data).find((g) => g.slug === gameSlug);

    if (!game) {
        return notFound();
    }

    const steamAppId = data.games.find((g) => g.slug === gameSlug)?.steam?.appId;
    const steamStats = steamAppId ? await getSteamCurrentPlayers(steamAppId) : null;

    return (
        <ErrorBoundary fallback={<WidgetDiedFallback />}>
            <EmbedGameCard
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
                official={!game.categories?.includes("community")}
                stats={{ steam: steamStats }}
            >
                <EmbedGameToSeasonWidget game={game} selector="current" />
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
                    <EmbedGameToSeasonWidget game={game} selector="next" />
                )}
            </EmbedGameCard>
        </ErrorBoundary>
    );
};

export async function generateStaticParams() {
    const data: IndexQueryResult = await sanityFetch({
        revalidate: 3600,
        tags: ["game", "season"],
        query: indexQuery,
    });

    return data.games.map((g) => ({
        gameSlug: g.slug,
    }));
}

export const revalidate = 43200;
export const dynamic = "force-static";

export default Home;
