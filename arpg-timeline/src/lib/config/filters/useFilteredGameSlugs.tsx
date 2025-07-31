"use client";
import { useMemo } from "react";

import { Game } from "@/lib/cms/games.types";
import { NewGameStrategy } from "@/lib/config/DashboardConfig";
import { useDashboardConfiguration } from "@/lib/config/DashboardConfigurationProvider";
import { inGracePeriod } from "@/lib/games/sortBySeasons";

export const useFilteredGameSlugs = (games: Game[]): string[] => {
    const [dashboardConfig] = useDashboardConfiguration();

    return useMemo(() => {
        const { hidden = [], visible = [] } = dashboardConfig.games ?? {};
        const { newGamesStrategy = NewGameStrategy.Show } = dashboardConfig.preferences ?? {};

        const hiddenSet = new Set(hidden);
        const visibleSet = new Set(visible);

        const isVisible = (game: Game) => visibleSet.has(game.slug);
        const isHidden = (game: Game) => hiddenSet.has(game.slug);
        const isUnspecified = (game: Game) => !isVisible(game) && !isHidden(game);

        const shouldIncludeUnspecified = (game: Game) => {
            if (newGamesStrategy === NewGameStrategy.Show) return true;
            if (newGamesStrategy === NewGameStrategy.ShowOnEvent) {
                return (
                    game.nextSeason?.start?.confirmed ||
                    inGracePeriod(game.currentSeason?.start?.startDate)
                );
            }
            return false;
        };

        return games
            .filter((game) => {
                if (isVisible(game)) return true;
                if (isUnspecified(game)) return shouldIncludeUnspecified(game);
                return false;
            })
            .map((game) => game.slug);
    }, [dashboardConfig.games, dashboardConfig.preferences, games]);
};
