import { useEffect } from "react";

import { Game } from "@/lib/cms/games.types";
import { GameFilterCategory } from "@/lib/cms/gameTags";
import { sa_event } from "@/lib/sa_event";
import {
    getCustomFiltersSeen,
    getStoredFilters,
    setCustomFiltersSeen,
} from "@/lib/storage/gameFiltersStorage";

export const useGameFiltersAnalytics = (
    excludedSlugs: string[],
    filteredGames: Game[],
    category: GameFilterCategory,
) => {
    useEffect(() => {
        if (category !== "featured" || getCustomFiltersSeen()) {
            return;
        }

        const isDefault = getStoredFilters() === null;
        const sortedHidden = excludedSlugs.slice().sort();
        const sortedVisible = filteredGames
            .slice()
            .sort((a, b) => a.slug.localeCompare(b.slug))
            .map((g) => g.slug);

        sa_event("filter-customization", {
            isDefault,
            visible: sortedVisible.join(","),
            hidden: sortedHidden.join(","),
        });

        setCustomFiltersSeen();
    }, [excludedSlugs, filteredGames, category]);
};
