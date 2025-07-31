"use client";
import { createContext, PropsWithChildren, useCallback, useContext, useMemo } from "react";

import { Game, GameFilter } from "@/lib/cms/games.types";
import { useDashboardConfiguration } from "@/lib/config/DashboardConfigurationProvider";

import { byLabel, mapGameToFilter } from "../../GameFilterHelpers";
import { useFilteredGameSlugs } from "./useFilteredGameSlugs";

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
    const [config] = useDashboardConfiguration();
    return !!config ? (
        <ClientGameFiltersContextProvider games={games}>
            {children}
        </ClientGameFiltersContextProvider>
    ) : (
        children
    );
};

const ClientGameFiltersContextProvider = ({
    children,
    games,
}: PropsWithChildren<{ games: Game[] }>) => {
    const [config, updateConfig] = useDashboardConfiguration();
    const filteredGameSlugs = useFilteredGameSlugs(games);

    const isGameIncluded = useCallback(
        (g: Game): boolean => filteredGameSlugs.includes(g.slug),
        [filteredGameSlugs],
    );

    const filteredGames = useMemo(() => games.filter(isGameIncluded), [games, isGameIncluded]);
    const filters = useMemo<GameFilter[]>(() => games.map(mapGameToFilter).sort(byLabel), [games]);

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
