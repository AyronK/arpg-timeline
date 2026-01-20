import { Metadata } from "next";

import { LayoutCarousel } from "@/components/LayoutCarousel";
import { DashboardPage } from "@/components/Pages/DashboardPage";
import { GameFilterProvider } from "@/contexts/GameFilterContext";
import { getAverageSeasonDuration } from "@/lib/cms/parseGamesFromSanity";
import { indexQuery, IndexQueryResult } from "@/lib/cms/queries/indexQuery";
import { generateDashboardMetadata } from "@/lib/metadata/dashboardMetadata";
import { sanityFetch } from "@/lib/sanity/sanityClient";

const Home = async () => {
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
        <GameFilterProvider games={sanityGames} category={"featured"}>
            <LayoutCarousel />
            <DashboardPage />
        </GameFilterProvider>
    );
};

export const revalidate = 3600;

export default Home;
export async function generateMetadata(): Promise<Metadata> {
    return generateDashboardMetadata("featured", "/");
}
