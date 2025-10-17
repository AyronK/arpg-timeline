import { Metadata } from "next";

import { LayoutCarousel } from "@/components/LayoutCarousel";
import { DashboardPage } from "@/components/Pages/DashboardPage";
import { GameFilterProvider } from "@/contexts/GameFilterContext";
import { indexQuery, IndexQueryResult } from "@/lib/cms/queries/indexQuery";
import { generateDashboardMetadata } from "@/lib/metadata/dashboardMetadata";
import { sanityFetch } from "@/lib/sanity/sanityClient";

const Home = async () => {
    const data: IndexQueryResult = await sanityFetch({
        query: indexQuery,
        revalidate: 24 * 60 * 60,
        tags: ["season", "liveStreamTwitch", "game", "toast"],
    });

    return (
        <GameFilterProvider games={data.games} category={"featured"}>
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

export const experimental_ppr = true;
