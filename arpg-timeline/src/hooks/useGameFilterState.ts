import { startTransition, useCallback, useEffect, useRef, useState } from "react";

import { Game } from "@/lib/cms/games.types";
import { GameFilterCategory } from "@/lib/cms/gameTags";
import { getUrlExcludesToPersist, resolveExcludedSlugs } from "@/lib/filters/filterState";
import { sa_event } from "@/lib/sa_event";
import {
    clearStoredFilters,
    getStoredFilters,
    setStoredFilters,
} from "@/lib/storage/gameFiltersStorage";
import { getUrlFilters, updateUrlFilters } from "@/lib/url/gameFiltersUrl";

const hasNoFeaturedRecord = () => getStoredFilters()?.category !== "featured";

export const useGameFilterState = (
    games: Game[],
    category: GameFilterCategory,
    searchParams: URLSearchParams,
) => {
    const initializeFilters = useCallback(() => {
        const stored = getStoredFilters();
        const urlExcludes = getUrlFilters(searchParams);

        const toPersist = getUrlExcludesToPersist({ category, stored, urlExcludes });
        if (toPersist) {
            setStoredFilters({ excludedSlugs: toPersist, category: "featured" });
        }

        return resolveExcludedSlugs({ category, games, stored, urlExcludes });
    }, [category, games, searchParams]);

    const [excludedSlugs, setExcludedSlugs] = useState<string[]>(initializeFilters);
    const [isPreset, setIsPreset] = useState(hasNoFeaturedRecord);

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
                setIsPreset(hasNoFeaturedRecord());
                setIsInitialized(true);
            });
            isInitializedRef.current = true;
            prevCategoryRef.current = category;
            prevSearchParamsRef.current = searchParams;
        }
    }, [category, searchParams, initializeFilters]);

    const updateFilters = useCallback(
        (newExcludedSlugs: string[]) => {
            if (category !== "featured") return;

            setExcludedSlugs(newExcludedSlugs);
            setIsPreset(false);
            setStoredFilters({ excludedSlugs: newExcludedSlugs, category: "featured" });
            updateUrlFilters(newExcludedSlugs);
        },
        [category],
    );

    const resetToPreset = useCallback(() => {
        if (category !== "featured") return;

        clearStoredFilters();
        if (getUrlFilters(searchParams).length > 0) updateUrlFilters([]);
        setExcludedSlugs(resolveExcludedSlugs({ category, games, stored: null, urlExcludes: [] }));
        setIsPreset(true);
        sa_event("filters_reset_to_featured");
    }, [category, games, searchParams]);

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
        isPreset,
        isInitialized,
        toggleGameFilter,
        toggleGroupFilter,
        updateFilters,
        resetToPreset,
    };
};
