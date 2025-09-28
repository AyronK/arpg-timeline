"use client";

import { useSearchParams } from "next/navigation";
import { SanityImageAssetDocument } from "next-sanity";
import { createContext, ReactNode, Suspense, useContext } from "react";
import { useMemo } from "react";

import { useGameFiltersAnalytics } from "@/hooks/useGameFiltersAnalytics";
import { useGameFiltersData } from "@/hooks/useGameFiltersData";
import { useGameFilterState } from "@/hooks/useGameFilterState";
import { Game } from "@/lib/cms/games.types";
import { GameFilterCategory } from "@/lib/cms/gameTags";

interface GameFilterContextType {
    gameFilters: {
        label: string;
        value: string;
        group: string;
        groupPriority: number;
        logo?: SanityImageAssetDocument;
    }[];
    toggleGameFilter: (slug: string, value: boolean) => void;
    toggleGroupFilter: (group: string, value: boolean) => void;
    activeFilters: string[];
    filteredGames: Game[];
    totalGames: number;
    shownGames: number;
    category: GameFilterCategory;
}

const GameFilterContext = createContext<GameFilterContextType | undefined>(undefined);

interface GameFilterProviderProps {
    children: ReactNode;
    games: Game[];
    category: GameFilterCategory;
}

export const GameFilterProvider = ({ children, games, category }: GameFilterProviderProps) => {
    const searchParams = useSearchParams();
    const searchParam = searchParams.getAll("exclude");

    const { excludedSlugs, toggleGameFilter, toggleGroupFilter } = useGameFilterState(
        games,
        category,
        searchParams,
    );
    const { gameFilters, getFilteredGames } = useGameFiltersData(games);

    const filteredGames = useMemo(() => {
        return getFilteredGames(excludedSlugs, category);
    }, [getFilteredGames, excludedSlugs, category]);

    useGameFiltersAnalytics(excludedSlugs, filteredGames, searchParam);

    const activeFilters = useMemo(() => {
        return games.map((g) => g!.slug!).filter((s) => !excludedSlugs.includes(s!));
    }, [games, excludedSlugs]);

    const value: GameFilterContextType = {
        gameFilters,
        toggleGameFilter,
        toggleGroupFilter,
        filteredGames,
        activeFilters,
        shownGames: filteredGames.length,
        totalGames: games.length,
        category,
    };

    return (
        <Suspense
            fallback={
                <div className="after:bg-background relative animate-pulse after:absolute after:inset-0 after:rounded-md">
                    {children}
                </div>
            }
        >
            <GameFilterContext.Provider value={value}>{children}</GameFilterContext.Provider>
        </Suspense>
    );
};

export const useGameFilterContext = () => {
    const context = useContext(GameFilterContext);
    if (context === undefined) {
        throw new Error("useGameFilterContext must be used within a GameFilterProvider");
    }
    return context;
};
