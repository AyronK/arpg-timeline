import { notFound } from "next/navigation";
import { PropsWithChildren } from "react";

import { LayoutCarousel } from "@/components/LayoutCarousel";
import { isGameFilterCategory } from "@/lib/cms/gameTags";
interface DashboardPageProps {
    params: Promise<{ dashboard: string }>;
}

const DashboardLayout = async ({ children, params }: PropsWithChildren<DashboardPageProps>) => {
    const { dashboard } = await params;

    if (!isGameFilterCategory(dashboard)) {
        notFound();
    }

    return (
        <>
            <LayoutCarousel category={dashboard} />
            {children}
        </>
    );
};

export default DashboardLayout;
