"use client";

import { usePathname } from "next/navigation";

import { GameFilterCategory } from "@/lib/cms/gameTags";
import { cn } from "@/lib/utils";
import { Button } from "@/ui/Button";

import { DashboardConfig, DashboardOption } from "./DashboardConfig";
import { useDashboardNavigation } from "./useDashboardNavigation";

interface MobileDashboardSelectorProps {
    category: GameFilterCategory;
    onLoadingChange: (loading: boolean) => void;
}

export const MobileDashboardSelector = ({
    category,
    onLoadingChange,
}: MobileDashboardSelectorProps) => {
    const { handleDashboardChange } = useDashboardNavigation(onLoadingChange);
    const pathname = usePathname();

    return (
        <div className="flex flex-col">
            {(Object.keys(DashboardConfig) as DashboardOption[])
                .filter((tag) => DashboardConfig[tag])
                .map((tag) => {
                    const config = DashboardConfig[tag]!;
                    const IconComponent = config.icon;
                    const isActive = pathname === "/games/news" ? tag === "news" : tag === category;
                    return (
                        <Button
                            key={tag}
                            variant={isActive ? "default" : "ghost"}
                            className={cn(
                                "h-auto min-h-[60px] justify-start gap-3 py-2 text-left",
                                { "pointer-events-none": isActive },
                            )}
                            onClick={() => !isActive && handleDashboardChange(tag)}
                            data-sa-click={`dashboard-${tag}`}
                        >
                            <div className="flex w-full flex-col items-start text-left">
                                <div className="flex items-start gap-3">
                                    <IconComponent className="h-8 w-8 flex-shrink-0 py-1" />
                                    <div className="flex flex-col">
                                        <span className="font-medium">{config.description}</span>
                                        <span
                                            className={cn(
                                                "text-muted-foreground text-xs leading-relaxed text-wrap whitespace-break-spaces",
                                                { "text-primary-foreground/75": isActive },
                                            )}
                                        >
                                            {config.tooltip}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Button>
                    );
                })}
        </div>
    );
};
