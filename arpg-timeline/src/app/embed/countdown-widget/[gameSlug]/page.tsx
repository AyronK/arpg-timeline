import { notFound } from "next/navigation";

import ErrorBoundary from "@/components/ErrorBoundary";
import { CountdownWidget } from "@/components/GameCard/CountdownWidget";
import { SanityImage } from "@/components/SanityImage";
import { WidgetDiedFallback } from "@/components/WidgetDiedFallback";
import { parseGamesFromSanity } from "@/lib/cms/parseGamesFromSanity";
import { indexQuery, IndexQueryResult } from "@/lib/cms/queries/indexQuery";
import { sanityFetch } from "@/lib/sanity/sanityClient";

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

    return (
        <div className="min-h-[300px] min-w-[360px] overflow-hidden">
            <ErrorBoundary fallback={<WidgetDiedFallback />}>
                <CountdownWidget
                    game={game}
                    gameLogo={
                        <SanityImage
                            loading="lazy"
                            src={game.nextSeason?.logo ?? game.currentSeason?.logo ?? game.logo!}
                            alt={`${game.name} logo`}
                            className="my-auto drop-shadow-[0_1px_1px_rgba(0,0,0,0.4)]"
                            width={340}
                            height={140}
                            objectFit="contain"
                        />
                    }
                />
            </ErrorBoundary>
        </div>
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
