import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { DashboardConfig } from "@/components/Dashboard/DashboardConfig";
import { DashboardPage as SharedDashboardPage } from "@/components/Pages/DashboardPage";
import { isDashboardTag } from "@/lib/cms/gameTags";
import { generateDashboardMetadata } from "@/lib/metadata/dashboardMetadata";

interface DashboardPageProps {
    params: Promise<{ dashboard: string }>;
}

const DashboardPage = async ({ params }: DashboardPageProps) => {
    const { dashboard } = await params;

    if (dashboard === "default-when-next-confirmed") {
        redirect("/");
    }

    if (!isDashboardTag(dashboard)) {
        notFound();
    }

    return <SharedDashboardPage dashboard={dashboard} />;
};

export const revalidate = 3600;

export async function generateStaticParams() {
    return Object.keys(DashboardConfig)
        .filter((dashboard) => dashboard !== "default-when-next-confirmed")
        .map((dashboard) => ({
            dashboard,
        }));
}

export default DashboardPage;

export async function generateMetadata({ params }: DashboardPageProps): Promise<Metadata> {
    const { dashboard } = await params;

    if (!isDashboardTag(dashboard)) {
        return {
            title: "Not Found",
        };
    }

    return generateDashboardMetadata(dashboard, `/dashboard/${dashboard}`);
}

export const experimental_ppr = true;
