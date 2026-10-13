"use client";

import { useSearchParams } from "next/navigation";
import { SanityImageAssetDocument } from "next-sanity";
import {
    createContext,
    ReactNode,
    Suspense,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";

import { useGameFiltersAnalytics } from "@/hooks/useGameFiltersAnalytics";
import { useGameFiltersData } from "@/hooks/useGameFiltersData";
import { useGameFilterState } from "@/hooks/useGameFilterState";
import { Game } from "@/lib/cms/games.types";
import { GameFilterCategory } from "@/lib/cms/gameTags";
import { parseGamesFromSanity } from "@/lib/cms/parseGamesFromSanity";
import { SanityGame } from "@/lib/cms/queries/indexQuery";
import { getHiddenGamesSummary, HiddenGamesSummary } from "@/lib/filters/filterState";
import { sa_event } from "@/lib/sa_event";
import {
    getStoredHiddenStripEnabled,
    setStoredHiddenStripEnabled,
} from "@/lib/storage/filterOnboardingStorage";

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
    updateFilters: (excludedSlugs: string[]) => void;
    activeFilters: string[];
    filteredGames: Game[];
    totalGames: number;
    shownGames: number;
    category: GameFilterCategory;
    // Null off Featured and while loading, where nothing is hidden
    hiddenGamesSummary: HiddenGamesSummary | null;
    isFiltersOpen: boolean;
    setFiltersOpen: (open: boolean) => void;
    resetToPreset: () => void;
    isHiddenStripEnabled: boolean;
    setHiddenStripEnabled: (enabled: boolean) => void;
}

const GameFilterContext = createContext<GameFilterContextType | undefined>(undefined);

interface GameFilterProviderProps {
    children: ReactNode;
    games: SanityGame[];
    category: GameFilterCategory;
}

export const useTimeBasedKey = (targetTimestamp: number) => {
    const [key, setKey] = useState(0);
    const refreshTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const timeUntilRefresh = targetTimestamp - Date.now();

        if (timeUntilRefresh <= 0) {
            return;
        }

        refreshTimeoutRef.current = setTimeout(() => {
            setKey((v) => v + 1);
        }, timeUntilRefresh);

        return () => {
            if (refreshTimeoutRef.current) {
                clearTimeout(refreshTimeoutRef.current);
            }
        };
    }, [targetTimestamp]);

    return key;
};

export const GameFilterProvider = ({ children, games, category }: GameFilterProviderProps) => {
    const parsedGames = useMemo(() => parseGamesFromSanity({ games }), [games]);

    const seasons = useMemo(() => {
        return games.flatMap((g) => g.recentSeasons);
    }, [games]);

    const nextDate = useMemo(
        () =>
            [...seasons.map((s) => s.start?.startDate), ...seasons.map((s) => s.end?.endDate)]
                .filter((d) => !!d && new Date(d).getTime() >= new Date().getTime())
                .sort((a, b) => new Date(a!).getTime() - new Date(b!).getTime())[0],
        [seasons],
    );

    const refreshTimestamp = useMemo(
        () => (nextDate ? new Date(nextDate).getTime() : 0),
        [nextDate],
    );
    const key = useTimeBasedKey(refreshTimestamp);

    return (
        <Suspense
            key={key}
            fallback={
                <div className="after:bg-background relative animate-pulse after:absolute after:inset-0 after:rounded-md">
                    <GameFilterContext.Provider
                        value={{
                            gameFilters: [],
                            toggleGameFilter: () => {},
                            toggleGroupFilter: () => {},
                            updateFilters: () => {},
                            activeFilters: [],
                            filteredGames: parsedGames,
                            totalGames: games.length,
                            shownGames: games.length,
                            category,
                            hiddenGamesSummary: null,
                            isFiltersOpen: false,
                            setFiltersOpen: () => {},
                            resetToPreset: () => {},
                            isHiddenStripEnabled: true,
                            setHiddenStripEnabled: () => {},
                        }}
                    >
                        {children}
                    </GameFilterContext.Provider>
                </div>
            }
        >
            <UnsafeGameFilterProvider games={parsedGames} category={category}>
                {children}
            </UnsafeGameFilterProvider>
        </Suspense>
    );
};

type UnsafeGameFilterProviderProps = Omit<
    GameFilterProviderProps,
    "games" | "seasons" | "twitchChannels"
> & {
    games: Game[];
};

const UnsafeGameFilterProvider = ({ children, games, category }: UnsafeGameFilterProviderProps) => {
    const searchParams = useSearchParams();

    const {
        excludedSlugs,
        isPreset,
        toggleGameFilter,
        toggleGroupFilter,
        updateFilters,
        resetToPreset,
    } = useGameFilterState(games, category, searchParams);
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);
    // Every entry point opens Filters through here, so adoption counts include all of them
    const setFiltersOpen = useCallback((open: boolean) => {
        if (open) sa_event("filters_opened");
        setIsFiltersOpen(open);
    }, []);
    const [isHiddenStripEnabled, setIsHiddenStripEnabled] = useState(getStoredHiddenStripEnabled);

    const setHiddenStripEnabled = useCallback((enabled: boolean) => {
        setIsHiddenStripEnabled(enabled);
        setStoredHiddenStripEnabled(enabled);
        if (!enabled) sa_event("hidden_markers_disabled");
    }, []);
    // Ticks so strip countdowns and just-started chips stay current
    const [now, setNow] = useState(Date.now);
    useEffect(() => {
        const interval = setInterval(() => setNow(Date.now()), 60_000);
        return () => clearInterval(interval);
    }, []);
    const { gameFilters, getFilteredGames } = useGameFiltersData(games);

    const filteredGames = useMemo(() => {
        return getFilteredGames(excludedSlugs, category);
    }, [getFilteredGames, excludedSlugs, category]);

    useGameFiltersAnalytics(excludedSlugs, filteredGames, category);

    const activeFilters = useMemo(() => {
        return games.map((g) => g!.slug!).filter((s) => !excludedSlugs.includes(s!));
    }, [games, excludedSlugs]);

    const hiddenGamesSummary = useMemo(
        () =>
            category === "featured"
                ? getHiddenGamesSummary({ games, excludedSlugs, isPreset, now })
                : null,
        [category, games, excludedSlugs, isPreset, now],
    );

    const value = useMemo<GameFilterContextType>(
        () => ({
            gameFilters,
            toggleGameFilter,
            toggleGroupFilter,
            updateFilters,
            filteredGames,
            activeFilters,
            shownGames: filteredGames.length,
            totalGames: games.length,
            category,
            hiddenGamesSummary,
            isFiltersOpen,
            setFiltersOpen,
            resetToPreset,
            isHiddenStripEnabled,
            setHiddenStripEnabled,
        }),
        [
            hiddenGamesSummary,
            isFiltersOpen,
            setFiltersOpen,
            resetToPreset,
            isHiddenStripEnabled,
            setHiddenStripEnabled,
            gameFilters,
            toggleGameFilter,
            toggleGroupFilter,
            updateFilters,
            filteredGames,
            activeFilters,
            games.length,
            category,
        ],
    );

    return <GameFilterContext.Provider value={value}>{children}</GameFilterContext.Provider>;
};

export const useGameFilterContext = () => {
    const context = useContext(GameFilterContext);
    if (context === undefined) {
        throw new Error("useGameFilterContext must be used within a GameFilterProvider");
    }
    return context;
};
