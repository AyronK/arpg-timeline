import { Metadata } from "next";

import { DashboardPage } from "@/components/Pages/DashboardPage";
import { generateDashboardMetadata } from "@/lib/metadata/dashboardMetadata";

const Home = async () => {
    return <DashboardPage category="featured" />;
};

export const revalidate = 3600;

export default Home;

export async function generateMetadata(): Promise<Metadata> {
    return generateDashboardMetadata("featured", "/");
}

export const experimental_ppr = true;
