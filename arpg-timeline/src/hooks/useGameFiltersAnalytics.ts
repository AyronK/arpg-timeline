import { useEffect } from "react";

import { Game } from "@/lib/cms/games.types";
import { sa_event } from "@/lib/sa_event";

export const useGameFiltersAnalytics = (
    excludedSlugs: string[],
    filteredGames: Game[],
    searchParam: string[],
) => {
    useEffect(() => {
        for (const i in excludedSlugs) {
            if (Object.prototype.hasOwnProperty.call(filteredGames, i)) {
                const element = excludedSlugs[i];
                sa_event(`game-hidden--${element}`);
            }
        }

        if (filteredGames.length > 0) {
            sa_event("games-visible", {
                games: filteredGames
                    .sort((a, b) => a.slug.localeCompare(b.slug))
                    .map((g) => g.slug)
                    .join(","),
            });
        }
    }, [excludedSlugs, filteredGames, searchParam]);
};
