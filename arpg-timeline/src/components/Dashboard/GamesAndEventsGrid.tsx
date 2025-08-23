"use client";

import { useState } from "react";

import { GameFilters } from "@/components/GameFilters";
import { useGameCategories } from "@/hooks/useGameCategories";
import { useGameFilters } from "@/hooks/useGameFilters";
import { useTimelineEvents } from "@/hooks/useTimelineEvents";
import { Game, GameStatistics } from "@/lib/cms/games.types";
import { DashboardTag } from "@/lib/cms/gameTags";

import { CantFindGame } from "./CantFindGame";
import { DashboardSelector } from "./DashboardSelector";
import { Events } from "./Events";
import { GameCountDisplay } from "./GameCountDisplay";
import { Games } from "./Games";

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
            <article className="flex flex-col gap-4 md:gap-5">
                <h2 className="sr-only">Seasons</h2>
                <div className="relative flex flex-col gap-1">
                    <GameCountDisplay
                        shownGames={shownGames}
                        totalGames={totalGames}
                        dashboard={dashboard}
                    />
                    <div className="flex flex-row items-end gap-4">
                        <DashboardSelector
                            key={dashboard}
                            dashboard={dashboard}
                            onLoadingChange={handleLoadingChange}
                        />
                        <GameFilters {...filtersProps} />
                    </div>
                </div>
                <div
                    className={`3xl:grid-cols-4 4xl:grid-cols-5 transition- relative grid grid-cols-1 gap-4 transition-all ease-in-out ease-out md:grid-cols-2 md:gap-5 lg:grid-cols-2 xl:grid-cols-3 [&>*]:min-h-52 md:[&>*]:min-h-80 ${
                        isLoading ? "opacity-0" : ""
                    }`}
                >
                    <Games games={allGames} statistics={statistics} />
                    <CantFindGame />
                    {filteredGames.length > 1 && <Events events={events} />}
                </div>
            </article>
        </>
    );
};

export const GamesAndEventsGridFallback = ({ games }: { games: Game[] }) => {
    const events = useTimelineEvents(games);
    return (
        <article className="3xl:grid-cols-4 4xl:grid-cols-5 relative grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 lg:grid-cols-2 xl:grid-cols-3">
            <h2 className="sr-only">Seasons</h2>
            <Games games={games} />
            <Events events={events} />
            <CantFindGame />
        </article>
    );
};
