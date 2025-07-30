"use client";
import { createContext, PropsWithChildren, useContext, useMemo } from "react";

import { Game } from "@/lib/cms/games.types";
import { NewGameStrategy } from "@/lib/config/DashboardConfig";
import { useDashboardConfiguration } from "@/lib/config/DashboardConfigurationProvider";
import { inGracePeriod } from "@/lib/games/sortBySeasons";

type GameFiltersContextValue = {
    filteredGames: Game[];
    filters: GameFilter[];
    setGameFilter: (slug: string, value: boolean) => void;
    setGroupFilter: (group: string, value: boolean) => void;
};

const GameFiltersContext = createContext<GameFiltersContextValue | null>(null);

export const useFilteredGames = () => {
    const context = useContext(GameFiltersContext);

    if (!context) {
        throw new Error("useFilteredGames must be used within GameFiltersContextProvider.");
    }

    return context?.filteredGames ?? [];
};

export const useGameFilters = () => {
    const context = useContext(GameFiltersContext);

    if (!context) {
        throw new Error("useGameFilters must be used within GameFiltersContextProvider.");
    }

    return context;
};

export const GameFiltersContextProvider = ({
    children,
    games,
}: PropsWithChildren<{ games: Game[] }>) => {
    const [config, updateConfig] = useDashboardConfiguration();
    const filteredGames = useFilteredGamesMemo(games);

    const filters = useMemo<GameFilter[]>(
        () =>
            games
                .map((g) => ({ label: g!.name!, value: g!.slug!, group: g!.group! }))
                .sort((a, b) => (a.label > b.label ? 1 : -1)),
        [games],
    );

    const setGameFilter = (slug: string, value: boolean) => {
        const { hidden = [], visible = [] } = config.games ?? {};
        const newHidden = hidden.filter((g) => g !== slug);
        const newVisible = visible.filter((g) => g !== slug);

        (value ? newVisible : newHidden).push(slug);

        updateConfig({
            ...config,
            games: {
                ...config.games,
                hidden: newHidden,
                visible: newVisible,
            },
        });
    };

    const setGroupFilter = (group: string, value: boolean) => {
        const slugs = games
            .filter((g) => (group ? g?.group === group : !g?.group))
            .map((g) => g?.slug)
            .filter((g): g is string => !!g);

        const { hidden = [], visible = [] } = config.games ?? {};
        const slugsSet = new Set(slugs);

        const newHidden = hidden.filter((g) => !slugsSet.has(g));
        const newVisible = visible.filter((g) => !slugsSet.has(g));

        (value ? newVisible : newHidden).push(...slugs);

        updateConfig({
            ...config,
            games: {
                ...config.games,
                hidden: newHidden,
                visible: newVisible,
            },
        });
    };

    return (
        <GameFiltersContext.Provider
            value={{ filteredGames, filters, setGameFilter, setGroupFilter }}
        >
            {children}
        </GameFiltersContext.Provider>
    );
};

type GameFilter = {
    label: string;
    value: string;
    group: string;
};

const useFilteredGamesMemo = (games: Game[]): Game[] => {
    const filteredGameSlugs = useFilteredGameSlugsMemo(games);

    return useMemo(() => {
        return games.filter((g) => filteredGameSlugs.includes(g.slug));
    }, [filteredGameSlugs, games]);
};

const useFilteredGameSlugsMemo = (games: Game[]): string[] => {
    const [dashboardConfig] = useDashboardConfiguration();

    return useMemo(() => {
        const { hidden = [], visible = [] } = dashboardConfig.games ?? {};
        const newGamesStrategy = dashboardConfig.preferences?.newGamesStrategy;

        const explicitlyVisible = games.filter((g) => visible.includes(g.slug));
        const unspecified = games.filter((g) => ![...hidden, ...visible].includes(g.slug));

        const filteredGames = explicitlyVisible;

        if (newGamesStrategy === NewGameStrategy.ShowOnEvent)
            unspecified.forEach((g) => {
                if (
                    g.nextSeason?.start?.confirmed ||
                    inGracePeriod(g?.currentSeason?.start?.startDate)
                ) {
                    filteredGames.push(g);
                }
            });
        else if (newGamesStrategy === NewGameStrategy.Show) {
            filteredGames.concat(explicitlyVisible);
        }

        return filteredGames.map((g) => g.slug);
    }, [dashboardConfig.games, dashboardConfig.preferences?.newGamesStrategy, games]);
};
