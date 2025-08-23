"use client";

import { useRouter, useSearchParams } from "next/navigation";

import { DashboardTag } from "@/lib/cms/gameTags";
import { cn } from "@/lib/utils";
import { Button } from "@/ui/Button";
import { ToggleGroup, ToggleGroupItem } from "@/ui/ToggleGroup";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/ui/Tooltip";

import { DashboardConfig } from "./DashboardConfig";

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
    const router = useRouter();
    const searchParams = useSearchParams();

    const handleDashboardChange = (value: string) => {
        if (value === "default-when-next-confirmed") {
            onLoadingChange(true);
            const currentParams = searchParams.toString();
            const newUrl = currentParams ? `/?${currentParams}` : "/";
            router.push(newUrl);
        } else if (value === "everything") {
            onLoadingChange(true);
            const currentParams = searchParams.toString();
            const newUrl = currentParams
                ? `/dashboard/everything?${currentParams}`
                : `/dashboard/everything`;
            router.push(newUrl);
        } else if (value) {
            onLoadingChange(true);
            const currentParams = searchParams.toString();
            const newUrl = currentParams
                ? `/dashboard/${value}?${currentParams}`
                : `/dashboard/${value}`;
            router.push(newUrl);
        }
    };

    if (isMobile) {
        return (
            <div className="flex flex-col">
                {(Object.keys(DashboardConfig) as DashboardTag[])
                    .filter((tag) => DashboardConfig[tag])
                    .map((tag) => {
                        const config = DashboardConfig[tag]!;
                        const IconComponent = config.icon;
                        const isActive = tag === dashboard;
                        return (
                            <Button
                                key={tag}
                                variant={isActive ? "default" : "ghost"}
                                className="h-auto min-h-[60px] justify-start gap-3 py-2 text-left"
                                onClick={() => handleDashboardChange(tag)}
                                data-sa-click={`dashboard-${tag}`}
                            >
                                <div className="flex w-full flex-col items-start text-left">
                                    <div className="flex items-start gap-3">
                                        <IconComponent className="h-8 w-8 flex-shrink-0 py-1" />
                                        <div className="flex flex-col">
                                            <span className="font-medium">
                                                {config.description}
                                            </span>
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
    }

    return (
        <ToggleGroup
            type="single"
            variant="outline"
            className="hidden md:flex"
            value={dashboard}
            onValueChange={handleDashboardChange}
        >
            {(Object.keys(DashboardConfig) as DashboardTag[])
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
