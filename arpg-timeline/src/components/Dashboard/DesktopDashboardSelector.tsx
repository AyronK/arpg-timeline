"use client";

import { usePathname } from "next/navigation";

import { GameFilterCategory } from "@/lib/cms/gameTags";
import { ToggleGroup, ToggleGroupItem } from "@/ui/ToggleGroup";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/ui/Tooltip";

import { DashboardConfig, DashboardOption } from "./DashboardConfig";
import { useDashboardNavigation } from "./useDashboardNavigation";

interface DesktopDashboardSelectorProps {
    category: GameFilterCategory;
    onLoadingChange: (loading: boolean) => void;
}

export const DesktopDashboardSelector = ({
    category: dashboard,
    onLoadingChange,
}: DesktopDashboardSelectorProps) => {
    const { handleDashboardChange } = useDashboardNavigation(onLoadingChange);
    const pathname = usePathname();
    const currentValue = pathname === "/news" ? "news" : dashboard;

    return (
        <ToggleGroup
            type="single"
            variant="outline"
            className="hidden md:flex"
            value={currentValue}
            onValueChange={handleDashboardChange}
        >
            {(Object.keys(DashboardConfig) as DashboardOption[])
                .filter((tag) => DashboardConfig[tag])
                .map((tag, idx, items) => {
                    const config = DashboardConfig[tag]!;
                    const IconComponent = config.icon;
                    return (
                        <ToggleGroupItem
                            className="relative"
                            value={tag}
                            key={tag}
                            aria-label={tag}
                            data-sa-click={`dashboard-${tag}`}
                        >
                            <Tooltip delayDuration={500}>
                                <TooltipTrigger asChild>
                                    <div className="inline-flex min-w-0 flex-1 shrink-0 items-center justify-center gap-2 whitespace-nowrap after:absolute after:inset-0">
                                        <IconComponent />
                                        <span className="text-center whitespace-nowrap">
                                            {config.description}
                                        </span>
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent
                                    side="bottom"
                                    sideOffset={8}
                                    alignOffset={-8}
                                    align={
                                        idx === 0
                                            ? "start"
                                            : idx === items.length - 1
                                              ? "end"
                                              : "center"
                                    }
                                >
                                    {config.tooltip}
                                </TooltipContent>
                            </Tooltip>
                        </ToggleGroupItem>
                    );
                })}
        </ToggleGroup>
    );
};
