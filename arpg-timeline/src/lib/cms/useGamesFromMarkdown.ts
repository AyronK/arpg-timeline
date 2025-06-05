/* eslint-disable @typescript-eslint/no-explicit-any */
// TODO FIX ANY
import { Game } from "@/lib/cms/games.types";
import { HOUR } from "@/lib/date";
import { inGracePeriod, sortBySeasons } from "@/lib/games/sortBySeasons";

export const useGamesFromMarkdown = (data: any): Game[] => {
    return data.games.edges
        .map((e: any) => e.node.frontmatter as Game)
        .map((g: any) => {
            const game = { ...g } as Game;

            const gameTwitch = data.twitchChannels.edges
                .map((e: any) => e.node.frontmatter)
                .find((e: any) => e?.game === g.slug);

            game.twitchCategory = gameTwitch?.category ?? null;

            const gameSeasons = data.seasons.edges
                .map((e: any) => e.node.frontmatter)
                .filter((e: any) => e?.game === g.name)
                .sort(
                    (a: any, b: any) =>
                        b?.start?.startDate?.localeCompare(a?.start?.startDate ?? "") ?? 0,
                );

            const hasLatestSeasonStarted =
                new Date().getTime() > new Date(gameSeasons[0]?.start?.startDate ?? "").getTime();

            game.currentSeason = hasLatestSeasonStarted ? gameSeasons[0] : gameSeasons[1];

            if (game.currentSeason && !game.currentSeason.end?.endDate) {
                game.currentSeason.end ??= {} as any;
                game.currentSeason!.end!.endDate = new Date(
                    new Date(game.currentSeason?.start?.startDate as any).getTime() +
                        120 * 24 * 50 * 60 * 1000, // TODO replace with avg of previous events duration
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
                                      120 * 24 * 50 * 60 * 1000, // TODO replace with avg of previous events duration
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
                                      120 * 24 * 50 * 60 * 1000, // TODO replace with avg of previous events duration
                              ).toISOString(),
                      },
                  }
                : gameSeasons[0];

            if (game.currentSeason && !game.currentSeason.end) {
                game.currentSeason.end = {
                    confirmed: false,
                    endDate: new Date(
                        new Date(game.currentSeason.start?.startDate ?? "").getTime() +
                            120 * 24 * 50 * 60 * 1000, // TODO replace with avg of previous events duration
                    ).toISOString(),
                };
            }

            if (game.currentSeason && !game.currentSeason.end?.endDate) {
                game.currentSeason!.end!.endDate = new Date(
                    new Date(game.currentSeason.start?.startDate ?? "").getTime() +
                        120 * 24 * 50 * 60 * 1000, // TODO replace with avg of previous events duration
                ).toISOString();
            }

            if (game.nextSeason && !game.nextSeason.end) {
                game.nextSeason.end = {
                    confirmed: false,
                    endDate: new Date(
                        new Date(game.nextSeason.start?.startDate ?? "").getTime() +
                            120 * 24 * 50 * 60 * 1000, // TODO replace with avg of previous events duration
                    ).toISOString(),
                };
            }

            if (game.nextSeason && !game.nextSeason.end?.endDate) {
                game.nextSeason!.end!.endDate = new Date(
                    new Date(
                        game.nextSeason.start?.startDate ??
                            (game.currentSeason?.end?.endDate as any),
                    ).getTime() +
                        120 * 24 * 50 * 60 * 1000, // TODO replace with avg of previous events duration
                ).toISOString();
            }

            return game;
        })
        .map((g: any) => {
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
