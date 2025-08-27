import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { SanityImageAssetDocument } from "next-sanity";

import { Game } from "@/lib/cms/games.types";
import { GameFilterCategory } from "@/lib/cms/gameTags";

import { useGameFilterState } from "./useGameFilterState";
import { useGameFiltersData } from "./useGameFiltersData";
import { useGameFiltersAnalytics } from "./useGameFiltersAnalytics";

export const useGameFilters = (
    games: Game[],
    category: GameFilterCategory = "all",
): {
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
} => {
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

    return {
        gameFilters,
        toggleGameFilter,
        toggleGroupFilter,
        filteredGames,
        activeFilters,
        shownGames: filteredGames.length,
        totalGames: games.length,
    };
};
