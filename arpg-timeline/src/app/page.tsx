import { Metadata } from "next";

import { DashboardPage } from "@/components/Pages/DashboardPage";
import { generateDashboardMetadata } from "@/lib/metadata/dashboardMetadata";

const Home = async () => {
    return <DashboardPage dashboard="default-when-next-confirmed" />;
};

export const revalidate = 3600;

export default Home;

export async function generateMetadata(): Promise<Metadata> {
    return generateDashboardMetadata("default-when-next-confirmed", "/");
}

export const experimental_ppr = true;
