import { startTransition, useCallback, useEffect, useRef, useState } from "react";

import { Game } from "@/lib/cms/games.types";
import { GameFilterCategory } from "@/lib/cms/gameTags";
import {
    GameFiltersStorage,
    getStoredFilters,
    setStoredFilters,
} from "@/lib/storage/gameFiltersStorage";
import { getUrlFilters, updateUrlFilters } from "@/lib/url/gameFiltersUrl";

export const useGameFilterState = (
    games: Game[],
    category: GameFilterCategory,
    searchParams: URLSearchParams,
) => {
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
        const stored = getStoredFilters();
        const urlFilters = getUrlFilters(searchParams);

        let initialFilters: string[];

        if (stored && stored.category === category) {
            initialFilters = stored.excludedSlugs;
        } else if (urlFilters.length > 0) {
            initialFilters = urlFilters;
            const storageData: GameFiltersStorage = {
                excludedSlugs: urlFilters,
                category,
            };
            setStoredFilters(storageData);
        } else {
            initialFilters = getDefaultExcludedSlugs();
        }

        return initialFilters;
    }, [category, searchParams, getDefaultExcludedSlugs]);

    const [excludedSlugs, setExcludedSlugs] = useState<string[]>(() => {
        const stored = getStoredFilters();
        const urlFilters = getUrlFilters(searchParams);

        let initialFilters: string[];

        if (stored && stored.category === category) {
            initialFilters = stored.excludedSlugs;
        } else if (urlFilters.length > 0) {
            initialFilters = urlFilters;
            const storageData: GameFiltersStorage = {
                excludedSlugs: urlFilters,
                category,
            };
            setStoredFilters(storageData);
        } else {
            if (category === "featured") {
                initialFilters = games
                    .filter(
                        (g) =>
                            !g.categories?.includes("seasonal") &&
                            !g.categories?.includes("early-access") &&
                            !g.nextSeason?.start?.confirmed,
                    )
                    .map((g) => g.slug!)
                    .filter(Boolean);
            } else {
                initialFilters = [];
            }
        }

        return initialFilters;
    });

    const prevCategoryRef = useRef(category);
    const prevSearchParamsRef = useRef(searchParams);
    const isInitializedRef = useRef(false);
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        const categoryChanged = prevCategoryRef.current !== category;
        const searchParamsChanged = prevSearchParamsRef.current !== searchParams;

        if (!isInitializedRef.current || categoryChanged || searchParamsChanged) {
            const newFilters = initializeFilters();
            startTransition(() => {
                setExcludedSlugs(newFilters);
                setIsInitialized(true);
            });
            isInitializedRef.current = true;
            prevCategoryRef.current = category;
            prevSearchParamsRef.current = searchParams;
        }
    }, [category, searchParams, initializeFilters]);

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
        isInitialized,
        toggleGameFilter,
        toggleGroupFilter,
        updateFilters,
    };
};
