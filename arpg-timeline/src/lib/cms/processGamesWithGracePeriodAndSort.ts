import { HOUR } from "../date";
import { inGracePeriod, sortBySeasons } from "../games/sortBySeasons";
import { Game } from "./games.types";

export const processGamesWithGracePeriodAndSort = (games: Game[]): Game[] => {
    return games
        .map((g) => {
            if (
                g?.currentSeason?.start?.startDate &&
                inGracePeriod(g.currentSeason.start.startDate)
            ) {
                const diff =
                    new Date().getTime() - new Date(g.currentSeason.start.startDate).getTime();
                return {
                    ...g,
                    currentSeason: {
                        ...g.currentSeason,
                        start: {
                            ...g.currentSeason.start,
                            justStarted: true,
                            overrideText:
                                diff < 2 * HOUR
                                    ? "Just started"
                                    : `Started ${(diff / HOUR).toFixed(0)} hours ago`,
                        },
                    },
                } as Game;
            }
            return g as Game;
        })
        .sort((a, b) => {
            const aDate = a.nextSeason?.start?.startDate
                ? new Date(a.nextSeason.start.startDate).getTime()
                : 0;
            const bDate = b.nextSeason?.start?.startDate
                ? new Date(b.nextSeason.start.startDate).getTime()
                : 0;
            return aDate - bDate;
        })
        .sort(sortBySeasons);
};
