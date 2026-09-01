import { Metadata } from "next";
import Image from "next/image";

import { LayoutCarousel } from "@/components/LayoutCarousel";
import { DashboardPage } from "@/components/Pages/DashboardPage";
import { DashboardArticlesProvider } from "@/contexts/DashboardArticlesContext";
import { GameFilterProvider } from "@/contexts/GameFilterContext";
import { getDashboardArticles } from "@/lib/articles/getDashboardArticles";
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
    const articles = await getDashboardArticles();

    sanityGames.forEach((game) => {
        game.averageSeasonDuration = getAverageSeasonDuration(
            data.seasons.filter((s) => s.game === game.slug),
        );
    });

    return (
        <GameFilterProvider games={sanityGames} category={"featured"}>
            <div className="sr-only absolute h-px w-px overflow-hidden p-0 [-webkit-clip-path:inset(50%)] [clip-path:inset(50%)]">
                <Image
                    unoptimized
                    src="/assets/logo.png"
                    alt="aRPG Timeline - Every Season Just On Time"
                    width={1200}
                    height={630}
                    fetchPriority="high"
                    priority
                />
            </div>
            <LayoutCarousel />
            <DashboardArticlesProvider articles={articles}>
                <DashboardPage />
            </DashboardArticlesProvider>
        </GameFilterProvider>
    );
};

export const revalidate = 3600;

export default Home;
export async function generateMetadata(): Promise<Metadata> {
    return generateDashboardMetadata("featured", "/");
}
