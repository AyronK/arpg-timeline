import { useCallback, useEffect, useRef, useState } from "react";

import { GameFilterCategory } from "@/lib/cms/gameTags";
import { Game } from "@/lib/cms/games.types";
import {
    getStoredFilters,
    setStoredFilters,
    GameFiltersStorage,
} from "@/lib/storage/gameFiltersStorage";
import { getUrlFilters, updateUrlFilters } from "@/lib/url/gameFiltersUrl";

export const useGameFilterState = (
    games: Game[],
    category: GameFilterCategory,
    searchParams: URLSearchParams,
) => {
    const [excludedSlugs, setExcludedSlugs] = useState<string[]>([]);
    const isInitializedRef = useRef(false);

    const getDefaultExcludedSlugs = useCallback(() => {
        if (category === "featured") {
            return games
                .filter(
                    (g) =>
                        !g.categories?.includes("seasonal") &&
                        !g.categories?.includes("early-access") &&
                        !g.nextSeason?.start?.confirmed,
                )
                .map((g) => g.slug!)
                .filter(Boolean);
        }
        return [];
    }, [category, games]);

    const initializeFilters = useCallback(() => {
        if (isInitializedRef.current) return;

        const stored = getStoredFilters();
        const urlFilters = getUrlFilters(searchParams);

        let initialFilters: string[];

        if (stored && stored.category === category) {
            initialFilters = stored.excludedSlugs;
        } else if (urlFilters.length > 0) {
            initialFilters = urlFilters;
        } else {
            initialFilters = getDefaultExcludedSlugs();
        }

        setExcludedSlugs(initialFilters);
        isInitializedRef.current = true;
    }, [category, searchParams, getDefaultExcludedSlugs]);

    useEffect(() => {
        initializeFilters();
    }, [initializeFilters]);

    const updateFilters = useCallback(
        (newExcludedSlugs: string[]) => {
            setExcludedSlugs(newExcludedSlugs);

            const storageData: GameFiltersStorage = {
                excludedSlugs: newExcludedSlugs,
                category,
            };

            setStoredFilters(storageData);
            updateUrlFilters(newExcludedSlugs);
        },
        [category],
    );

    const toggleGameFilter = useCallback(
        (slug: string, value: boolean) => {
            const newExcludedSlugs = value
                ? excludedSlugs.filter((s) => s !== slug)
                : [...excludedSlugs, slug];

            updateFilters(newExcludedSlugs);
        },
        [excludedSlugs, updateFilters],
    );

    const toggleGroupFilter = useCallback(
        (group: string, value: boolean) => {
            const groupSlugs = games
                .filter((g) => {
                    const gameGroup = g.categories?.includes("early-access")
                        ? "Early Access"
                        : g.categories?.includes("community")
                          ? "Community"
                          : g.categories?.includes("seasonal")
                            ? "Seasonal"
                            : "Non-Seasonal";
                    return gameGroup === group;
                })
                .map((g) => g.slug!)
                .filter(Boolean);

            const newExcludedSlugs = value
                ? excludedSlugs.filter((s) => !groupSlugs.includes(s))
                : [...new Set([...excludedSlugs, ...groupSlugs])];

            updateFilters(newExcludedSlugs);
        },
        [excludedSlugs, games, updateFilters],
    );

    return {
        excludedSlugs,
        isInitialized: isInitializedRef.current,
        toggleGameFilter,
        toggleGroupFilter,
        updateFilters,
    };
};
