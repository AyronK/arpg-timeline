"use client";
import { useHasMounted } from "@react-hooks-library/core";
import { useEffect } from "react";

import { GameFiltersProps } from "@/components/GameFilters";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import { useScrollVisibility } from "@/hooks/useScrollVisibility";
import { GameFilterCategory } from "@/lib/cms/gameTags";
import { getMobilePresetTabLabel } from "@/lib/filters/filterState";
import { sa_event } from "@/lib/sa_event";
import { cn } from "@/lib/utils";

import { MobileBottomMenuActions } from "./MobileBottomMenuActions";
import { MobileBottomMenuCenter } from "./MobileBottomMenuCenter";
import { MobileBottomMenuCounter } from "./MobileBottomMenuCounter";
import { MobileBottomMenuFilters } from "./MobileBottomMenuFilters";

type MobileBottomMenuProps = {
    filtersProps: GameFiltersProps;
    category: GameFilterCategory;
    onLoadingChange: (loading: boolean) => void;
    isFiltersDisabled?: boolean;
};

export function MobileBottomMenu({
    filtersProps,
    category,
    onLoadingChange,
    isFiltersDisabled = false,
}: MobileBottomMenuProps) {
    const { isLg } = useBreakpoint("lg");
    const { isFiltersOpen, setFiltersOpen } = filtersProps;
    // Stored filters are only known in the browser
    const hiddenGamesSummary = useHasMounted() ? filtersProps.hiddenGamesSummary : null;
    // The desktop dialog owns the shared open state at lg and up
    const isDrawerOpen = isFiltersOpen && !isLg;

    const { isVisible, forceVisible } = useScrollVisibility({
        threshold: 100,
        hideThreshold: 150,
        isDrawerOpen,
    });

    useEffect(() => {
        if (isDrawerOpen) forceVisible();
    }, [isDrawerOpen, forceVisible]);

    // Crossing lg would otherwise hand the open state to the other surface
    useEffect(() => {
        setFiltersOpen(false);
    }, [isLg, setFiltersOpen]);

    const isLoadingFilters = category === "featured" && !hiddenGamesSummary;
    const counterLabel = hiddenGamesSummary
        ? getMobilePresetTabLabel(hiddenGamesSummary)
        : isLoadingFilters
          ? null
          : "All games shown";

    const handleCounterClick = () => {
        if (hiddenGamesSummary) {
            sa_event("preset_chip_clicked", { state: hiddenGamesSummary.state });
        }
        setFiltersOpen(true);
    };

    return (
        <>
            <div className="fixed right-0 bottom-0 left-0 z-[60] select-none lg:hidden">
                <div
                    className={cn(
                        "origin-bottom transition-all duration-300 ease-in-out",
                        isVisible ? "translate-none" : "pointer-events-none translate-y-[96px]",
                    )}
                >
                    <div className="relative">
                        <div className="bg-background relative border-t border-slate-500">
                            <MobileBottomMenuCounter
                                label={counterLabel}
                                onClick={
                                    isFiltersDisabled || isLoadingFilters
                                        ? undefined
                                        : handleCounterClick
                                }
                            />
                            <div className="z-20 flex items-center justify-between p-2">
                                <MobileBottomMenuActions />

                                <div className="w-20" />

                                <MobileBottomMenuFilters
                                    filtersProps={filtersProps}
                                    category={category}
                                    isFiltersDisabled={isFiltersDisabled}
                                    isDrawerOpen={isDrawerOpen}
                                    onDrawerOpenChange={setFiltersOpen}
                                />
                            </div>
                        </div>

                        <MobileBottomMenuCenter
                            category={category}
                            onLoadingChange={onLoadingChange}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}
