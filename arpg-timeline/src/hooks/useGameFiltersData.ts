import { useMemo } from "react";

import { Game } from "@/lib/cms/games.types";
import { GameCategory, GameFilterCategory } from "@/lib/cms/gameTags";
import { processGamesWithGracePeriodAndSort } from "@/lib/cms/processGamesWithGracePeriodAndSort";

export const getGameFilterGroup = (categories?: GameCategory[] | null) =>
    categories?.includes("early-access")
        ? { group: "Early Access", groupPriority: 2 }
        : categories?.includes("community")
          ? { group: "Community", groupPriority: 3 }
          : categories?.includes("seasonal")
            ? { group: "Seasonal", groupPriority: 1 }
            : { group: "Non-Seasonal", groupPriority: 4 };

export const useGameFiltersData = (games: Game[]) => {
    const gameFilters = useMemo(() => {
        return games
            .map((g) => ({
                label: g!.name!,
                value: g!.slug!,
                ...getGameFilterGroup(g.categories),
                logo: g!.logo,
            }))
            .sort((a, b) => (a.label > b.label ? 1 : -1));
    }, [games]);

    const getFilteredGames = useMemo(() => {
        return (excludedSlugs: string[], category: GameFilterCategory) => {
            if (category === "all") {
                return games;
            }

            let filteredGames = [...games];

            if (category === "non-seasonal") {
                filteredGames = filteredGames.filter((g) => !g.categories?.includes("seasonal"));
            } else if (category === "community") {
                filteredGames = filteredGames.filter((g) => g.categories?.includes("community"));
            } else if (category === "early-access") {
                filteredGames = filteredGames.filter((g) => g.categories?.includes("early-access"));
            }

            filteredGames = filteredGames.filter((g) => !excludedSlugs.includes(g!.slug!));

            return processGamesWithGracePeriodAndSort(filteredGames);
        };
    }, [games]);

    return {
        gameFilters,
        getFilteredGames,
    };
};
