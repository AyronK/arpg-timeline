import { useEffect, useRef } from "react";

import { Game } from "@/lib/cms/games.types";
import { GameFilterCategory } from "@/lib/cms/gameTags";
import { sa_event } from "@/lib/sa_event";

export const useGameFiltersAnalytics = (
    excludedSlugs: string[],
    filteredGames: Game[],
    category: GameFilterCategory,
    defaultExcludedSlugs: string[],
) => {
    const hasFiredInitial = useRef(false);

    useEffect(() => {
        if (!hasFiredInitial.current) {
            hasFiredInitial.current = true;
            const defaultExcludedSet = new Set(defaultExcludedSlugs);
            const sortedVisible = filteredGames
                .slice()
                .sort((a, b) => a.slug.localeCompare(b.slug));
            sa_event("page-load-games", {
                dashboard: category,
                visible_default: sortedVisible
                    .filter((g) => !defaultExcludedSet.has(g.slug))
                    .map((g) => g.slug)
                    .join(","),
                visible_custom: sortedVisible
                    .filter((g) => defaultExcludedSet.has(g.slug))
                    .map((g) => g.slug)
                    .join(","),
                hidden_default: excludedSlugs
                    .filter((s) => defaultExcludedSet.has(s))
                    .sort()
                    .join(","),
                hidden_custom: excludedSlugs
                    .filter((s) => !defaultExcludedSet.has(s))
                    .sort()
                    .join(","),
            });
            return;
        }
    }, [excludedSlugs, filteredGames, category, defaultExcludedSlugs]);
};
