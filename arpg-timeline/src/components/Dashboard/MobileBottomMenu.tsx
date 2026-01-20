"use client";
import { useState } from "react";

import { GameFiltersProps } from "@/components/GameFilters";
import { useScrollVisibility } from "@/hooks/useScrollVisibility";
import { GameFilterCategory } from "@/lib/cms/gameTags";
import { cn } from "@/lib/utils";

import { MobileBottomMenuActions } from "./MobileBottomMenuActions";
import { MobileBottomMenuCenter } from "./MobileBottomMenuCenter";
import { MobileBottomMenuCounter } from "./MobileBottomMenuCounter";
import { MobileBottomMenuFilters } from "./MobileBottomMenuFilters";

type MobileBottomMenuProps = {
    filtersProps: GameFiltersProps;
    category: GameFilterCategory;
    onLoadingChange: (loading: boolean) => void;
    shownGames: number;
    totalGames: number;
    isFiltersDisabled?: boolean;
};

export function MobileBottomMenu({
    filtersProps,
    category,
    onLoadingChange,
    shownGames,
    totalGames,
    isFiltersDisabled = false,
}: MobileBottomMenuProps) {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const { isVisible, forceVisible } = useScrollVisibility({
        threshold: 100,
        hideThreshold: 150,
        isDrawerOpen,
    });

    const handleDrawerOpenChange = (open: boolean) => {
        setIsDrawerOpen(open);
        if (open) {
            forceVisible();
        }
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
                                shownGames={shownGames}
                                totalGames={totalGames}
                            />
                            <div className="z-20 flex items-center justify-between p-2">
                                <MobileBottomMenuActions />

                                <div className="w-20" />

                                <MobileBottomMenuFilters
                                    filtersProps={filtersProps}
                                    category={category}
                                    isFiltersDisabled={isFiltersDisabled}
                                    onDrawerOpenChange={handleDrawerOpenChange}
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
