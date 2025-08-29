import { useMemo } from "react";

import { Game } from "@/lib/cms/games.types";
import { GameFilterCategory } from "@/lib/cms/gameTags";

export const useGameFiltersData = (games: Game[]) => {
    const gameFilters = useMemo(() => {
        return games
            .map((g) => ({
                label: g!.name!,
                value: g!.slug!,
                group: g.categories?.includes("early-access")
                    ? "Early Access"
                    : g.categories?.includes("community")
                      ? "Community"
                      : g.categories?.includes("seasonal")
                        ? "Seasonal"
                        : "Non-Seasonal",
                groupPriority: g.categories?.includes("early-access")
                    ? 2
                    : g.categories?.includes("community")
                      ? 3
                      : g.categories?.includes("seasonal")
                        ? 1
                        : 4,
                logo: g!.logo,
            }))
            .sort((a, b) => (a.label > b.label ? 1 : -1));
    }, [games]);

    const getFilteredGames = useMemo(() => {
        return (excludedSlugs: string[], category: GameFilterCategory) => {
            if (category === "all") {
                return games;
            }

            let filteredGames = games.filter((g) => !excludedSlugs.includes(g!.slug!));

            if (category === "non-seasonal") {
                filteredGames = filteredGames.filter((g) => !g.categories?.includes("seasonal"));
            } else if (category === "community") {
                filteredGames = filteredGames.filter((g) => g.categories?.includes("community"));
            } else if (category === "early-access") {
                filteredGames = filteredGames.filter((g) => g.categories?.includes("early-access"));
            }

            return filteredGames;
        };
    }, [games]);

    return {
        gameFilters,
        getFilteredGames,
    };
};
