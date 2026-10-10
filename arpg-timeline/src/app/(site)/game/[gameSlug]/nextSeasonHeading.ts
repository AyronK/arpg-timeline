import { Game } from "@/lib/cms/games.types";

import { formatUtcDateTime, isNextSeasonConfirmed } from "./metadata";

export function buildNextSeasonHeading(game: Game, now: Date = new Date()): string | null {
    const nextSeason = game.nextSeason;
    if (!nextSeason?.name) return null;

    if (isNextSeasonConfirmed(game, now)) {
        const formattedDate = formatUtcDateTime(
            nextSeason.start!.startDate!,
            nextSeason.start!.timeUnknown,
        );
        return `Next ${game.seasonKeyword}: ${nextSeason.name} – starts ${formattedDate}`;
    }

    return `Next ${game.seasonKeyword}: ${game.nextSeason?._id !== game.currentSeason?._id ? nextSeason.name : "To be announced"}`;
}
