import { Game, SeasonEnd } from "@/lib/cms/games.types";
import { HOUR } from "@/lib/date";
import { inGracePeriod, sortBySeasons } from "@/lib/games/sortBySeasons";
import { IndexQueryResult } from "@/queries/indexQuery";

export const parseGamesFromSanity = (data: IndexQueryResult): Game[] => {
    return data.games
        .map((g) => {
            const game = { ...g } as Game;

            const gameTwitch = data.twitchChannels.find((e) => e?.game === g.slug);

            game.twitchCategory = gameTwitch?.category ?? null;

            const gameSeasons = data.seasons
                .filter((e) => e?.game === g.slug)
                .sort((a, b) => b?.start?.startDate?.localeCompare(a?.start?.startDate ?? "") ?? 0);

            const hasLatestSeasonStarted =
                new Date().getTime() > new Date(gameSeasons[0]?.start?.startDate ?? "").getTime();

            game.currentSeason = hasLatestSeasonStarted ? gameSeasons[0] : gameSeasons[1];

            if (game.currentSeason && !game.currentSeason.end?.endDate) {
                game.currentSeason.end ??= {} as SeasonEnd;
                game.currentSeason.end.endDate = new Date(
                    new Date(game.currentSeason.start?.startDate ?? "").getTime() +
                        120 * 24 * 50 * 60 * 1000,
                ).toISOString();
            }

            game.nextSeason = hasLatestSeasonStarted
                ? {
                      name: `Next ${g.seasonKeyword}`,
                      start: {
                          confirmed: false,
                          startDate:
                              game.currentSeason?.end?.endDate ??
                              new Date(
                                  new Date(game.currentSeason?.start?.startDate ?? "").getTime() +
                                      120 * 24 * 50 * 60 * 1000,
                              ).toISOString(),
                          overrideText: game.currentSeason?.end?.overrideText?.length
                              ? game.currentSeason?.end?.overrideText
                              : "To be announced",
                      },
                      end: {
                          confirmed: false,
                          endDate:
                              game.currentSeason?.end?.endDate ??
                              new Date(
                                  new Date(game.currentSeason?.start?.startDate ?? "").getTime() +
                                      120 * 24 * 50 * 60 * 1000,
                              ).toISOString(),
                      },
                  }
                : gameSeasons[0];

            if (game.currentSeason && !game.currentSeason.end) {
                game.currentSeason.end = {
                    confirmed: false,
                    endDate: new Date(
                        new Date(game.currentSeason.start?.startDate ?? "").getTime() +
                            120 * 24 * 50 * 60 * 1000,
                    ).toISOString(),
                };
            }

            if (game.currentSeason && !game.currentSeason.end?.endDate) {
                game.currentSeason.end!.endDate = new Date(
                    new Date(game.currentSeason.start?.startDate ?? "").getTime() +
                        120 * 24 * 50 * 60 * 1000,
                ).toISOString();
            }

            if (game.nextSeason && !game.nextSeason.end) {
                game.nextSeason.end = {
                    confirmed: false,
                    endDate: new Date(
                        new Date(game.nextSeason.start?.startDate ?? "").getTime() +
                            120 * 24 * 50 * 60 * 1000,
                    ).toISOString(),
                };
            }

            if (game.nextSeason && !game.nextSeason.end?.endDate) {
                game.nextSeason.end!.endDate = new Date(
                    new Date(
                        game.nextSeason.start?.startDate ??
                            (game.currentSeason?.end?.endDate as string),
                    ).getTime() +
                        120 * 24 * 50 * 60 * 1000,
                ).toISOString();
            }

            return game;
        })
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
        .sort(sortBySeasons);
};
