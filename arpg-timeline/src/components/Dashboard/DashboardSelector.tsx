"use client";

import { useRouter, useSearchParams } from "next/navigation";

import { DashboardTag } from "@/lib/cms/gameTags";
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
        if (value) {
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
            <div className="flex flex-col gap-3">
                {(Object.keys(DashboardConfig) as DashboardTag[])
                    .filter((tag) => DashboardConfig[tag])
                    .map((tag) => {
                        const config = DashboardConfig[tag]!;
                        const IconComponent = config.icon;
                        const isActive = tag === dashboard;
                        return (
                            <Button
                                key={tag}
                                variant={isActive ? "default" : "outline"}
                                className="justify-start gap-3"
                                onClick={() => handleDashboardChange(tag)}
                            >
                                <IconComponent className="h-4 w-4" />
                                <span>{config.description}</span>
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
