"use client";

import { useState } from "react";

import { GameFilters } from "@/components/GameFilters";
import { useGameCategories } from "@/hooks/useGameCategories";
import { useGameFilters } from "@/hooks/useGameFilters";
import { useTimelineEvents } from "@/hooks/useTimelineEvents";
import { Game, GameStatistics } from "@/lib/cms/games.types";
import { DashboardTag } from "@/lib/cms/gameTags";
import { cn } from "@/lib/utils";

import { CantFindGame } from "./CantFindGame";
import { DashboardSelector } from "./DashboardSelector";
import { Events } from "./Events";
import { GameCountDisplay } from "./GameCountDisplay";
import { Games } from "./Games";
import { MobileBottomMenu } from "./MobileBottomMenu";

export const GamesAndEventsGrid = ({
    games,
    statistics,
    dashboard = "default-when-next-confirmed",
}: {
    games: Game[];
    statistics: Record<string, GameStatistics>;
    dashboard?: DashboardTag;
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const { filteredGames, totalGames, shownGames, ...filtersProps } = useGameFilters(
        games,
        dashboard,
    );
    const events = useTimelineEvents(filteredGames);
    const { allGames } = useGameCategories(filteredGames);

    const handleLoadingChange = (loading: boolean) => {
        setIsLoading(loading);
    };

    return (
        <>
            <article className="mt-2 flex flex-col gap-4 lg:mt-0 2xl:gap-5">
                <h2 className="sr-only">Seasons</h2>
                <div className="relative -mt-4 flex flex-col gap-1 lg:mt-0">
                    <div className="hidden lg:block">
                        <GameCountDisplay
                            shownGames={shownGames}
                            totalGames={totalGames}
                            dashboard={dashboard}
                        />
                    </div>
                    <div className="hidden lg:flex lg:flex-row lg:items-end lg:gap-4">
                        <DashboardSelector
                            key={dashboard}
                            dashboard={dashboard}
                            onLoadingChange={handleLoadingChange}
                        />
                        <GameFilters {...filtersProps} disabled={dashboard === "everything"} />
                    </div>
                </div>
                <div
                    className={cn(
                        "3xl:grid-cols-4 4xl:grid-cols-5 transition- relative grid grid-cols-1 gap-4 transition-all ease-in-out ease-out md:grid-cols-2 md:gap-5 lg:grid-cols-2 xl:grid-cols-3 [&>*]:min-h-52 md:[&>*]:min-h-80",
                        { "opacity-0": isLoading },
                    )}
                >
                    <Games games={allGames} statistics={statistics} />
                    <CantFindGame />
                    {filteredGames.length > 1 && <Events events={events} />}
                </div>
            </article>
            <MobileBottomMenu
                dashboard={dashboard}
                onLoadingChange={handleLoadingChange}
                filtersProps={filtersProps}
                shownGames={shownGames}
                totalGames={totalGames}
                isFiltersDisabled={dashboard === "everything"}
            />
        </>
    );
};

export const GamesAndEventsGridFallback = ({ games }: { games: Game[] }) => {
    const events = useTimelineEvents(games);
    return (
        <article className="3xl:grid-cols-4 4xl:grid-cols-5 relative grid grid-cols-1 gap-4 opacity-0 md:grid-cols-2 md:gap-5 lg:grid-cols-2 xl:grid-cols-3">
            <h2 className="sr-only">Seasons</h2>
            <Games games={games} />
            <Events events={events} />
            <CantFindGame />
        </article>
    );
};
