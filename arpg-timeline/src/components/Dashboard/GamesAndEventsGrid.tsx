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
                <div className="lg:bg-background relative sticky -mt-4 pt-2 flex flex-col gap-1.5 lg:top-0 lg:z-10 lg:mb-3 lg:pb-1">
                    <p className="sr-only">
                        {totalGames} games tracked, from Path of Exile and Diablo to the community
                        servers most trackers skip - every league start, content update, and
                        expansion counted down in one place.
                    </p>
                    <div className="flex flex-col justify-between gap-1 lg:flex-row lg:gap-2">
                        <h1 className="font-heading text-foreground sm:text-md text-base leading-4 text-pretty">
                            The most complete aRPG season tracker
                        </h1>
                        <div className="hidden flex-row items-end gap-1 lg:flex">
                            {category === "featured" && !hintDismissed && (
                                <p className="text-warning/70 flex hidden items-center gap-1.5 text-center text-xs xl:flex">
                                    <Filter className="h-4 w-4 shrink-0 opacity-60" />
                                    <span>
                                        Some games are hidden by default - use{" "}
                                        <span className="text-warning tracking-[0.11rem]">
                                            &quot;Filters&quot;
                                        </span>{" "}
                                        to customize your view -
                                    </span>
                                </p>
                            )}
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
                <h2 className="sr-only">Seasons</h2>
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
                <h1 className="font-heading text-foreground text-base text-pretty sm:text-lg">
                    The most complete aRPG season tracker
                </h1>
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
