import { Game } from "@/lib/cms/games.types";

export function formatUtcDateTime(startDate: string, timeUnknown?: boolean | null): string {
    const date = new Date(startDate);
    const month = date.toLocaleString("en-US", { month: "short", timeZone: "UTC" });
    const day = date.getUTCDate();
    const year = date.getUTCFullYear();

    if (timeUnknown) {
        return `${month} ${day}, ${year}`;
    }

    const hours = String(date.getUTCHours()).padStart(2, "0");
    const minutes = String(date.getUTCMinutes()).padStart(2, "0");
    return `${month} ${day}, ${year} ${hours}:${minutes} UTC`;
}

function isNextSeasonConfirmedWithTime(game: Game): boolean {
    return !!(
        game.nextSeason?.name &&
        game.nextSeason?.start?.startDate &&
        game.nextSeason?.start?.confirmed &&
        !game.nextSeason?.start?.timeUnknown &&
        new Date(game.nextSeason.start.startDate) > new Date()
    );
}

function isNextSeasonConfirmed(game: Game): boolean {
    return !!(
        game.nextSeason?.name &&
        game.nextSeason?.start?.startDate &&
        game.nextSeason?.start?.confirmed &&
        new Date(game.nextSeason.start.startDate) > new Date()
    );
}

export function buildGamePageTitle(game: Game): string {
    if (isNextSeasonConfirmedWithTime(game)) {
        const formattedDate = formatUtcDateTime(
            game.nextSeason!.start!.startDate!,
            game.nextSeason!.start!.timeUnknown,
        );
        return `${game.name} – ${game.nextSeason!.name} starts ${formattedDate} | aRPG Timeline`;
    }
    return `${game.name} Updates | aRPG Timeline`;
}

export function buildGamePageDescription(game: Game): string {
    const base = `Track ${game.name} ${game.seasonKeyword}s and updates. Get countdowns, start dates, and never miss a ${game.name} ${game.seasonKeyword} launch.`;

    if (isNextSeasonConfirmed(game)) {
        const formattedDate = formatUtcDateTime(
            game.nextSeason!.start!.startDate!,
            game.nextSeason!.start!.timeUnknown,
        );
        return `Track ${game.name} ${game.seasonKeyword}s and updates. Next ${game.seasonKeyword}: ${game.nextSeason!.name} (starts ${formattedDate}). Get countdowns, start dates, and never miss a ${game.name} ${game.seasonKeyword} launch.`;
    }

    if (
        game.currentSeason?.name &&
        game.currentSeason?.start?.startDate &&
        game.currentSeason?.start?.confirmed
    ) {
        const formattedDate = formatUtcDateTime(
            game.currentSeason.start.startDate,
            game.currentSeason.start.timeUnknown,
        );
        return `Track ${game.name} ${game.seasonKeyword}s and updates. Current ${game.seasonKeyword}: ${game.currentSeason.name} (started ${formattedDate}). Get countdowns, start dates, and never miss a ${game.name} ${game.seasonKeyword} launch.`;
    }

    return base;
}

export function buildGamePageOgTitle(game: Game): string {
    if (isNextSeasonConfirmedWithTime(game)) {
        const formattedDate = formatUtcDateTime(
            game.nextSeason!.start!.startDate!,
            game.nextSeason!.start!.timeUnknown,
        );
        return `${game.name} – ${game.nextSeason!.name} starts ${formattedDate}`;
    }
    return `${game.name} Season Tracker`;
}

export function buildGamePageOgDescription(game: Game): string {
    if (isNextSeasonConfirmed(game)) {
        return `Track ${game.name} seasons and get countdowns for upcoming content. Next ${game.seasonKeyword}: ${game.nextSeason!.name}.`;
    }
    if (game.currentSeason?.name) {
        return `Track ${game.name} seasons and get countdowns for upcoming content. Current ${game.seasonKeyword}: ${game.currentSeason.name}.`;
    }
    return `Track ${game.name} seasons and get countdowns for upcoming content.`;
}
