"use client";

import { useEffect, useMemo } from "react";

import { useGameFilterContext } from "@/contexts/GameFilterContext";
import { toSearchGame } from "@/lib/search/buildSearchIndex";
import { getDashboardStatus } from "@/lib/search/dashboardStatus";
import { DashboardSearch } from "@/lib/search/types";

import { useOptionalSearch } from "./SearchProvider";

export const SearchDashboardBridge = () => {
    const registerDashboard = useOptionalSearch()?.registerDashboard;
    const { games, filteredGames, category, setFiltersOpen } = useGameFilterContext();

    const searchGames = useMemo(() => games.map(toSearchGame), [games]);

    const dashboard = useMemo<DashboardSearch>(() => {
        const visibleSlugs = new Set(filteredGames.map((game) => game.slug));
        return {
            category,
            games: searchGames,
            details: new Map(
                games.map((game) => [
                    game.slug,
                    {
                        game,
                        status: getDashboardStatus({
                            slug: game.slug,
                            categories: game.categories ?? [],
                            category,
                            visibleSlugs,
                        }),
                    },
                ]),
            ),
            openFilters: () => setFiltersOpen(true),
        };
    }, [games, searchGames, filteredGames, category, setFiltersOpen]);

    useEffect(() => {
        if (!registerDashboard) {
            return;
        }
        registerDashboard(dashboard);
        return () => registerDashboard(null);
    }, [registerDashboard, dashboard]);

    return null;
};
