import { Game } from "@/lib/cms/games.types";
import { HOUR } from "@/lib/date";

export const GRACE_PERIOD = HOUR * 84;

export const inGracePeriod = (startDate: string | null | undefined, endDate?: string | null) => {
    if (!startDate) {
        return false;
    }
    const now = new Date().getTime();
    if (endDate && now >= new Date(endDate).getTime()) {
        return false;
    }
    return now - new Date(startDate).getTime() < GRACE_PERIOD;
};

export const isOver = (endDate: string | null | undefined) => {
    if (!endDate) {
        return false;
    }
    return new Date().getTime() - new Date(endDate).getTime() > 0;
};

export const compareDates = (dateA?: string | null, dateB?: string | null) => {
    if (dateA && dateB) return new Date(dateA).getTime() - new Date(dateB).getTime();
    if (dateA) return -1;
    if (dateB) return 1;
    return 0;
};

export const sortBySeasons = (a: Game, b: Game) => {
    const isSeasonOver = (game: Game) =>
        game.nextSeason?.start?.startDate === game.nextSeason?.end?.endDate &&
        game.currentSeason?.end?.endDate &&
        isOver(game.currentSeason.end.endDate);

    const isInGracePeriod = (game: Game) =>
        game.currentSeason?.start?.startDate &&
        inGracePeriod(game.currentSeason.start.startDate, game.currentSeason?.end?.endDate);

    const aOver = isSeasonOver(a);
    const bOver = isSeasonOver(b);

    if (aOver !== bOver) return aOver ? 1 : -1;

    const aGrace = isInGracePeriod(a);
    const bGrace = isInGracePeriod(b);

    if (aGrace !== bGrace) return aGrace ? -1 : 1;

    const nextStartCompare = compareDates(
        a.nextSeason?.start?.startDate,
        b.nextSeason?.start?.startDate,
    );
    if (nextStartCompare !== 0) return nextStartCompare;

    return compareDates(a.currentSeason?.end?.endDate, b.currentSeason?.end?.endDate);
};
