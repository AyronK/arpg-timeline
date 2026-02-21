import { Game, SeasonEnd } from "@/lib/cms/games.types";
import { IndexQueryResult, SanitySeason } from "@/lib/cms/queries/indexQuery";

import { processGamesWithGracePeriodAndSort } from "./processGamesWithGracePeriodAndSort";

const DEFAULT_SEASON_OFFSET = 120 * 24 * 50 * 60 * 1000;

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

export const getAverageSeasonDuration = (seasons: SanitySeason[]): number | undefined => {
    const validDurations: number[] = [];
    const mainSeasons = seasons.filter((s) => !s.isSideEvent);

    for (const season of mainSeasons) {
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
        return undefined;
    }

    const totalDuration = validDurations.reduce((sum, duration) => sum + duration, 0);
    return totalDuration / validDurations.length;
};

export const parseGamesFromSanity = (data: Pick<IndexQueryResult, "games">): Game[] => {
    const games = data.games.map((g) => {
        const game: Game = {
            _id: g._id,
            _updatedAt: g._updatedAt,
            _createdAt: g._createdAt,
            name: g.name,
            slug: g.slug,
            seasonKeyword: g.seasonKeyword ?? "",
            url: g.url ?? "",
            group: g.group ?? "",
            logo: g.logo,
            currentSeason: undefined,
            nextSeason: undefined,
            twitchCategory: undefined,
            averageSeasonDuration: undefined,
            categories: g.categories ?? [],
            tags: g.tags ?? [],
            shortName: g.shortName ?? "",
            isDormant: g.isDormant ?? false,
            isComingSoon: g.isComingSoon ?? false,
            isOfficial: !g.categories?.includes("community"),
        };
        const gameTwitch = g.twitchChannel;

        game.twitchCategory = gameTwitch?.category ?? null;

        const gameSeasons = g.recentSeasons.sort(
            (a, b) => b?.start?.startDate?.localeCompare(a?.start?.startDate ?? "") ?? 0,
        );

        const hasLatestSeasonStarted =
            new Date().getTime() > new Date(gameSeasons[0]?.start?.startDate ?? "").getTime();

        game.currentSeason = hasLatestSeasonStarted ? gameSeasons[0] : gameSeasons[1];

        const defaultSeasonOffset = g.averageSeasonDuration ?? DEFAULT_SEASON_OFFSET;
        const days =
            g.averageSeasonDuration && Math.ceil(g.averageSeasonDuration / (1000 * 60 * 60 * 24));
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
                  _id: game.currentSeason._id,
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

        if (
            game.currentSeason?.end?.endDate &&
            game.nextSeason?.start?.startDate &&
            !game.currentSeason.end.confirmed
        ) {
            game.currentSeason.end.endDate = game.nextSeason.start.startDate;
        }

        return game;
    });

    return processGamesWithGracePeriodAndSort(games);
};
