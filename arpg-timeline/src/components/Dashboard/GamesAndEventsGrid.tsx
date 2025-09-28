"use client";

import { useState } from "react";

import { GameFilters } from "@/components/GameFilters";
import { useGameFilterContext } from "@/contexts/GameFilterContext";
import { useGameCategories } from "@/hooks/useGameCategories";
import { useTimelineEvents } from "@/hooks/useTimelineEvents";
import { Game, GameStatistics } from "@/lib/cms/games.types";
import { cn } from "@/lib/utils";

import { CantFindGame } from "./CantFindGame";
import { DashboardSelector } from "./DashboardSelector";
import { Events } from "./Events";
import { GameCountDisplay } from "./GameCountDisplay";
import { Games } from "./Games";
import { MobileBottomMenu } from "./MobileBottomMenu";

export const GamesAndEventsGrid = ({
    statistics,
}: {
    statistics: Record<string, GameStatistics>;
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const { filteredGames, totalGames, shownGames, category, ...filtersProps } =
        useGameFilterContext();
    const events = useTimelineEvents(filteredGames);
    const { allGames } = useGameCategories(filteredGames);

    const handleLoadingChange = (loading: boolean) => {
        setIsLoading(loading);
    };

    return (
        <>
            <article className="relative mt-2 flex flex-col gap-4 lg:mt-0 lg:gap-0">
                <h2 className="sr-only">Seasons</h2>
                <div className="lg:bg-background relative -mt-4 flex flex-col gap-1 lg:sticky lg:top-0 lg:z-10 lg:-mt-4 lg:py-4">
                    <div className="hidden lg:block">
                        <GameCountDisplay shownGames={shownGames} totalGames={totalGames} />
                    </div>
                    <div className="hidden lg:flex lg:flex-row lg:items-end lg:gap-4">
                        <DashboardSelector
                            key={category}
                            category={category}
                            onLoadingChange={handleLoadingChange}
                        />
                        <GameFilters {...filtersProps} disabled={category === "all"} />
                    </div>
                </div>
                <div
                    className={cn(
                        "3xl:grid-cols-4 4xl:grid-cols-5 transition- relative z-0 grid grid-cols-1 gap-4 transition-all ease-in-out ease-out md:grid-cols-2 md:gap-5 lg:grid-cols-2 xl:grid-cols-3 [&>*]:min-h-52 md:[&>*]:min-h-80",
                        { "opacity-0": isLoading },
                    )}
                >
                    <Games games={allGames} statistics={statistics} />
                    <CantFindGame />
                    {filteredGames.length > 1 && <Events events={events} />}
                </div>
            </article>
            <MobileBottomMenu
                category={category}
                isFiltersDisabled={category === "all"}
                onLoadingChange={handleLoadingChange}
                filtersProps={filtersProps}
                shownGames={shownGames}
                totalGames={totalGames}
            />
        </>
    );
};

export const GamesAndEventsGridFallback = ({ games }: { games: Game[] }) => {
    return (
        <article className="opacity-0">
            <h2 className="sr-only">Seasons</h2>
            <div className="relative -mt-4 flex flex-col gap-1 lg:mt-0">
                <div className="hidden lg:block">
                    <GameCountDisplay shownGames={games.length} totalGames={games.length} />
                </div>
            </div>
            <div>
                <Games games={games} />
                <CantFindGame />
            </div>
        </article>
    );
};
