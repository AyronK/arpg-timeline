import { notFound, redirect } from "next/navigation";
import { PropsWithChildren } from "react";

import { LayoutCarousel } from "@/components/LayoutCarousel";
import { GameFilterProvider } from "@/contexts/GameFilterContext";
import { isGameFilterCategory } from "@/lib/cms/gameTags";
import { getAverageSeasonDuration } from "@/lib/cms/parseGamesFromSanity";
import { indexQuery, IndexQueryResult } from "@/lib/cms/queries/indexQuery";
import { sanityFetch } from "@/lib/sanity/sanityClient";
interface DashboardPageProps {
    params: Promise<{ dashboard: string }>;
}

const DashboardLayout = async ({ children, params }: PropsWithChildren<DashboardPageProps>) => {
    const { dashboard } = await params;

    if (dashboard === "featured") {
        redirect("/");
    }

    if (!isGameFilterCategory(dashboard)) {
        notFound();
    }

    const data: IndexQueryResult = await sanityFetch({
        query: indexQuery,
        revalidate: 24 * 60 * 60,
        tags: ["season", "liveStreamTwitch", "game", "toast"],
    });

    const sanityGames = data.games;

    sanityGames.forEach((game) => {
        game.averageSeasonDuration = getAverageSeasonDuration(
            data.seasons.filter((s) => s.game === game.slug),
        );
    });

    return (
        <GameFilterProvider games={sanityGames} category={dashboard}>
            <LayoutCarousel />
            {children}
        </GameFilterProvider>
    );
};

export default DashboardLayout;
