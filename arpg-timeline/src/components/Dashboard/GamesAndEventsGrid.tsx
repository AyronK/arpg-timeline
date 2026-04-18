"use client";

import { Filter } from "lucide-react";
import { useState } from "react";

import { GameFilters } from "@/components/GameFilters";
import { OnboardingModal } from "@/components/OnboardingModal";
import { useGameFilterContext } from "@/contexts/GameFilterContext";
import { useGameCategories } from "@/hooks/useGameCategories";
import { useTimelineEvents } from "@/hooks/useTimelineEvents";
import { Game, GameStatistics } from "@/lib/cms/games.types";
import { getFilterHintDismissed } from "@/lib/storage/filterOnboardingStorage";
import { getStoredFilters } from "@/lib/storage/gameFiltersStorage";
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
    const [hintDismissed] = useState(() => getStoredFilters() !== null || getFilterHintDismissed());
    const { filteredGames, totalGames, shownGames, category, ...filtersProps } =
        useGameFilterContext();
    const events = useTimelineEvents(filteredGames);
    const { allGames } = useGameCategories(filteredGames);

    const handleLoadingChange = (loading: boolean) => {
        setIsLoading(loading);
    };

    return (
        <>
            <OnboardingModal />
            <article className="relative mt-2 flex flex-col gap-2 lg:mt-0 lg:gap-0">
                <h2 className="sr-only">Seasons</h2>
                <div className="lg:bg-background relative sticky -mt-2 -mt-4 flex flex-col gap-1.5 lg:top-0 lg:z-10 lg:pb-4">
                    <div className="flex flex-row items-end justify-center gap-2 lg:justify-between">
                        {category === "featured" && !hintDismissed && (
                            <p className="text-muted-foreground flex items-center gap-1.5 text-xs">
                                <Filter className="h-3 w-3 shrink-0 opacity-60" />
                                <span>
                                    Some games are hidden by default -{" "}
                                    <span className="text-foreground/80">Filter</span> to customize
                                    your view
                                </span>
                            </p>
                        )}
                        <div className="ml-auto hidden lg:block">
                            <GameCountDisplay shownGames={shownGames} totalGames={totalGames} />
                        </div>
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
                        "4xl:grid-cols-5 transition- relative z-0 grid grid-cols-1 gap-4 transition-all ease-in-out ease-out md:grid-cols-2 md:gap-5 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 [&>*]:min-h-52 md:[&>*]:min-h-80",
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
