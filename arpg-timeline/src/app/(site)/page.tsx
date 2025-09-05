import { Metadata } from "next";

import { LayoutCarousel } from "@/components/LayoutCarousel";
import { DashboardPage } from "@/components/Pages/DashboardPage";
import { generateDashboardMetadata } from "@/lib/metadata/dashboardMetadata";

const Home = async () => {
    return (
        <>
            <LayoutCarousel />
            <DashboardPage category="featured" />
        </>
    );
};

export const revalidate = 3600;

export default Home;
export async function generateMetadata(): Promise<Metadata> {
    return generateDashboardMetadata("featured", "/");
}

export const experimental_ppr = true;
