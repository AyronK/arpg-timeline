import { useEffect, useRef } from "react";

import { Game } from "@/lib/cms/games.types";
import { sa_event } from "@/lib/sa_event";

export const useGameFiltersAnalytics = (
    excludedSlugs: string[],
    filteredGames: Game[],
    searchParam: string[],
) => {
    const hasFiredInitial = useRef(false);

    useEffect(() => {
        if (!hasFiredInitial.current) {
            hasFiredInitial.current = true;
            sa_event("page-load-games", {
                visible: filteredGames
                    .sort((a, b) => a.slug.localeCompare(b.slug))
                    .map((g) => g.slug)
                    .join(","),
                hidden: excludedSlugs.slice().sort().join(","),
            });
            return;
        }

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
