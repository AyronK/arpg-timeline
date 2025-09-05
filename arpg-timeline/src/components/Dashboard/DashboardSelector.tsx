"use client";

import { GameFilterCategory } from "@/lib/cms/gameTags";

import { DesktopDashboardSelector } from "./DesktopDashboardSelector";
import { MobileDashboardSelector } from "./MobileDashboardSelector";

interface DashboardSelectorProps {
    category: GameFilterCategory;
    onLoadingChange: (loading: boolean) => void;
    isMobile?: boolean;
}

export const DashboardSelector = ({
    category,
    onLoadingChange,
    isMobile = false,
}: DashboardSelectorProps) => {
    if (isMobile) {
        return <MobileDashboardSelector category={category} onLoadingChange={onLoadingChange} />;
    }

    return <DesktopDashboardSelector category={category} onLoadingChange={onLoadingChange} />;
};
