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
