"use client";

import { useSearchParams } from "next/navigation";
import { SanityImageAssetDocument } from "next-sanity";
import {
    createContext,
    ReactNode,
    Suspense,
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
import { SanityGame, SanitySeason, SanityTwitchChannel } from "@/lib/cms/queries/indexQuery";

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
    games: SanityGame[];
    seasons: SanitySeason[];
    twitchChannels: SanityTwitchChannel[];
    category: GameFilterCategory;
}

export const useTimeBasedKey = (targetDate: Date) => {
    const [key, setKey] = useState(0);
    const refreshTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const now = new Date();
        const timeUntilRefresh = targetDate.getTime() - now.getTime();

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
    }, [targetDate]);

    return key;
};

export const GameFilterProvider = ({
    children,
    games,
    category,
    seasons,
    twitchChannels,
}: GameFilterProviderProps) => {
    const parsedGames = useMemo(
        () => parseGamesFromSanity({ games, seasons, twitchChannels }),
        [games, seasons, twitchChannels],
    );

    const nextDate = useMemo(
        () =>
            [...seasons.map((s) => s.start?.startDate), ...seasons.map((s) => s.end?.endDate)]
                .filter((d) => !!d && new Date(d).getTime() >= new Date().getTime())
                .sort((a, b) => new Date(a!).getTime() - new Date(b!).getTime())[0],
        [seasons],
    );

    const key = useTimeBasedKey(nextDate ? new Date(nextDate) : new Date());

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
                            activeFilters: [],
                            filteredGames: parsedGames,
                            totalGames: games.length,
                            shownGames: games.length,
                            category,
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

    return <GameFilterContext.Provider value={value}>{children}</GameFilterContext.Provider>;
};

export const useGameFilterContext = () => {
    const context = useContext(GameFilterContext);
    if (context === undefined) {
        throw new Error("useGameFilterContext must be used within a GameFilterProvider");
    }
    return context;
};
