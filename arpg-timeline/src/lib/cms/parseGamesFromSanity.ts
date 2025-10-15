import { Game, SeasonEnd } from "@/lib/cms/games.types";
import { IndexQueryResult, SanitySeason } from "@/lib/cms/queries/indexQuery";

import { processGamesWithGracePeriodAndSort } from "./processGamesWithGracePeriodAndSort";

const DEFAULT_SEASON_OFFSET = 120 * 24 * 50 * 60 * 1000;

const getAverageSeasonDuration = (seasons: SanitySeason[]): number | null => {
    const validDurations: number[] = [];

    for (const season of seasons) {
        if (season.start?.startDate && season.end?.endDate) {
            const startDate = new Date(season.start.startDate);
            const endDate = new Date(season.end.endDate);

            if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
                const durationMs = endDate.getTime() - startDate.getTime();

                if (durationMs > 0) {
                    validDurations.push(durationMs);
                }
            }
        }
    }

    if (validDurations.length < 3) {
        return null;
    }

    const totalDuration = validDurations.reduce((sum, duration) => sum + duration, 0);
    return totalDuration / validDurations.length;
};

const roundToNearest7Or30 = (value: number) => {
    const roundToNearest = (val: number, multiple: number) => Math.round(val / multiple) * multiple;
    const diffTo7 = Math.abs(value - roundToNearest(value, 7));
    const diffTo30 = Math.abs(value - roundToNearest(value, 30));
    return diffTo7 < diffTo30 ? roundToNearest(value, 7) : roundToNearest(value, 30);
};
const formatAverageDuration = (days: number) => {
    if (days < 30) {
        return `${days} days`;
    } else if (days < 90) {
        const weeks = Math.round(days / 7);
        return `${weeks} weeks`;
    } else if (days < 356) {
        const months = Math.round(days / 30);
        return `${months} months`;
    } else {
        const years = Math.round(days / 366);
        return `${years} years`;
    }
};

const adjustOffsetIfTooSoon = (time: number, offset: number): number => {
    const now = Date.now();
    const tentativeEnd = time;
    return tentativeEnd <= now || tentativeEnd - now < offset * 0.1 ? offset * 0.1 : 0;
};

const calculateSimulatedDate = (date: string | undefined | null, offset: number): string => {
    const time = new Date(date ?? "").getTime();
    const adjustedOffset = adjustOffsetIfTooSoon(time, offset) + offset;
    return new Date(time + adjustedOffset).toISOString();
};

const adjustDateIfTooSoon = (date: string | undefined | null, offset: number): string => {
    const time = new Date(date ?? "").getTime();
    const adjustedOffset = adjustOffsetIfTooSoon(time, offset);
    return new Date(time + adjustedOffset).toISOString();
};

export const parseGamesFromSanity = (
    data: Pick<IndexQueryResult, "games" | "seasons" | "twitchChannels">,
): Game[] => {
    const games = data.games.map((g) => {
        const game = { ...g } as Game;
        const gameTwitch = data.twitchChannels.find((e) => e?.game === g.slug);

        game.twitchCategory = gameTwitch?.category ?? null;

        const gameSeasons = data.seasons
            .filter((e) => e?.game === g.slug)
            .sort((a, b) => b?.start?.startDate?.localeCompare(a?.start?.startDate ?? "") ?? 0);

        const hasLatestSeasonStarted =
            new Date().getTime() > new Date(gameSeasons[0]?.start?.startDate ?? "").getTime();

        game.currentSeason = hasLatestSeasonStarted ? gameSeasons[0] : gameSeasons[1];

        const averageSeasonDuration = getAverageSeasonDuration(gameSeasons);
        const defaultSeasonOffset = averageSeasonDuration ?? DEFAULT_SEASON_OFFSET;
        const days =
            averageSeasonDuration && Math.ceil(averageSeasonDuration / (1000 * 60 * 60 * 24));
        game.averageSeasonDuration = days && roundToNearest7Or30(days);

        if (game.currentSeason && !game.currentSeason.end?.endDate) {
            game.currentSeason.end ??= {} as SeasonEnd;
            game.currentSeason.end.endDate = calculateSimulatedDate(
                game.currentSeason.start?.startDate,
                defaultSeasonOffset,
            );
        }

        game.nextSeason = hasLatestSeasonStarted
            ? {
                  _updatedAt: game.currentSeason._updatedAt,
                  name: `Next ${g.seasonKeyword}`,
                  start: {
                      confirmed: false,
                      startDate:
                          game.currentSeason?.end?.endDate ??
                          calculateSimulatedDate(
                              game.currentSeason?.start?.startDate,
                              defaultSeasonOffset,
                          ),
                      overrideText: game.currentSeason?.end?.overrideText?.length
                          ? game.currentSeason?.end?.overrideText
                          : "To be announced",
                  },
                  end: {
                      confirmed: false,
                      endDate:
                          game.currentSeason?.end?.endDate ??
                          calculateSimulatedDate(
                              game.currentSeason?.start?.startDate,
                              defaultSeasonOffset,
                          ),
                  },
              }
            : gameSeasons[0];

        if (game.currentSeason && !game.currentSeason.end) {
            game.currentSeason.end = {
                confirmed: false,
                endDate: calculateSimulatedDate(
                    game.currentSeason.start?.startDate,
                    defaultSeasonOffset,
                ),
            };
        }

        if (
            game.currentSeason?.end &&
            game.averageSeasonDuration &&
            !game.currentSeason.end.confirmed &&
            !game.currentSeason.end.overrideText
        ) {
            game.currentSeason.end.overrideText = `Avg. ${formatAverageDuration(game.averageSeasonDuration)}`;
        }

        if (game.currentSeason && !game.currentSeason.end?.endDate) {
            game.currentSeason.end!.endDate = calculateSimulatedDate(
                game.currentSeason.start?.startDate,
                defaultSeasonOffset,
            );
        }

        if (game.nextSeason && !game.nextSeason.end) {
            game.nextSeason.end = {
                confirmed: false,
                endDate: calculateSimulatedDate(
                    game.nextSeason.start?.startDate,
                    defaultSeasonOffset,
                ),
            };
        }

        if (game.nextSeason && !game.nextSeason.end?.endDate) {
            game.nextSeason.end!.endDate = calculateSimulatedDate(
                game.nextSeason.start?.startDate ?? (game.currentSeason?.end?.endDate as string),
                defaultSeasonOffset,
            );
        }
        if (game.currentSeason?.end?.endDate && !game.currentSeason.end.confirmed) {
            game.currentSeason.end.endDate = adjustDateIfTooSoon(
                game.currentSeason.end?.endDate,
                defaultSeasonOffset,
            );
        }

        if (game.nextSeason?.start?.startDate && !game.nextSeason.start.confirmed) {
            game.nextSeason.start.startDate = adjustDateIfTooSoon(
                game.nextSeason.start?.startDate,
                defaultSeasonOffset,
            );
        }

        return game;
    });

    return processGamesWithGracePeriodAndSort(games);
};
