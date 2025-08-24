"use client";

import { DashboardTag } from "@/lib/cms/gameTags";

import { DesktopDashboardSelector } from "./DesktopDashboardSelector";
import { MobileDashboardSelector } from "./MobileDashboardSelector";

interface DashboardSelectorProps {
    dashboard: DashboardTag;
    onLoadingChange: (loading: boolean) => void;
    isMobile?: boolean;
}

export const DashboardSelector = ({
    dashboard,
    onLoadingChange,
    isMobile = false,
}: DashboardSelectorProps) => {
    if (isMobile) {
        return <MobileDashboardSelector dashboard={dashboard} onLoadingChange={onLoadingChange} />;
    }

    return <DesktopDashboardSelector dashboard={dashboard} onLoadingChange={onLoadingChange} />;
};
