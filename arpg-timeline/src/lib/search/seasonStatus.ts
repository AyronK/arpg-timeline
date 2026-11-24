import { capitalizeFirstChar } from "@/lib/capitalizeFirstChar";
import { Game } from "@/lib/cms/games.types";
import { DAY, HOUR } from "@/lib/date";

const plural = (count: number, unit: string) => `${count} ${unit}${count === 1 ? "" : "s"}`;

const formatDuration = (ms: number) =>
    ms < DAY
        ? plural(Math.max(1, Math.ceil(ms / HOUR)), "hour")
        : plural(Math.floor(ms / DAY), "day");

const toTime = (date: string | null | undefined) => (date ? Date.parse(date) : NaN);

export const getSeasonStatusText = (game: Game, now: number): string => {
    if (game.isDormant) {
        return "No recent updates";
    }

    const keyword = game.seasonKeyword || "season";
    const nextStart = toTime(game.nextSeason?.start?.startDate);
    if (game.nextSeason?.start?.confirmed && nextStart > now) {
        return `Next ${keyword} starts in ${formatDuration(nextStart - now)}`;
    }

    const currentStart = toTime(game.currentSeason?.start?.startDate);
    const currentEnd = toTime(game.currentSeason?.end?.endDate);
    if (currentStart <= now && !(currentEnd <= now)) {
        if (now - currentStart < 2 * DAY) {
            return `${capitalizeFirstChar(keyword)} started ${formatDuration(now - currentStart)} ago`;
        }
        return game.currentSeason?.end?.confirmed
            ? `${capitalizeFirstChar(keyword)} ends in ${formatDuration(currentEnd - now)}`
            : `${capitalizeFirstChar(keyword)} in progress`;
    }

    if (game.isComingSoon) {
        return "Coming soon";
    }
    return game.nextSeason ? `Next ${keyword} not announced` : "No seasons";
};
