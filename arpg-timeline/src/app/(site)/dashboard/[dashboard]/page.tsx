import { Metadata } from "next";

import { DashboardConfig } from "@/components/Dashboard/DashboardConfig";
import { DashboardPage as SharedDashboardPage } from "@/components/Pages/DashboardPage";
import { isGameFilterCategory } from "@/lib/cms/gameTags";
import { generateDashboardMetadata } from "@/lib/metadata/dashboardMetadata";

interface DashboardPageProps {
    params: Promise<{ dashboard: string }>;
}

const DashboardPage = async () => {
    return <SharedDashboardPage />;
};

export const revalidate = 3600;

export async function generateStaticParams() {
    return Object.keys(DashboardConfig)
        .filter((dashboard) => dashboard !== "featured")
        .map((dashboard) => ({
            dashboard,
        }));
}

export default DashboardPage;

export async function generateMetadata({ params }: DashboardPageProps): Promise<Metadata> {
    const { dashboard } = await params;

    if (!isGameFilterCategory(dashboard)) {
        return {
            title: "Not Found",
        };
    }

    return generateDashboardMetadata(dashboard, `/dashboard/${dashboard}`);
}
