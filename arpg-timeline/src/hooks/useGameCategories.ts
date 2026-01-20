import { useMemo } from "react";

import { Game } from "@/lib/cms/games.types";

export const useGameCategories = (games: Game[]) => {
    const categorizedGames = useMemo(() => {
        const activeGames = games.filter((g) => !g.isDormant && !g.isComingSoon);
        const comingSoonGames = games.filter((g) => g.isComingSoon);
        const dormantGames = games
            .filter((g) => g.isDormant)
            .map((g) => ({ ...g, nextSeason: null }));

        return {
            activeGames,
            comingSoonGames,
            dormantGames,
            allGames: [...activeGames, ...comingSoonGames, ...dormantGames],
        };
    }, [games]);

    return categorizedGames;
};
