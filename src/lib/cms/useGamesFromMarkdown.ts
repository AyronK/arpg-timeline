import { Game } from "@/lib/cms/games.types";
import { HOUR } from "@/lib/date";
import { inGracePeriod, sortBySeasons } from "@/lib/games/sortBySeasons";

export const useGamesFromMarkdown = (data: Queries.IndexPageQuery): Game[] => {
  return data.games.edges
    .map((e) => e.node.frontmatter as Game)
    .map((g) => {
      const game = { ...g };
      const gameSeasons = data.seasons.edges
        .map((e) => e.node.frontmatter)
        .filter((e) => e?.game === g.name)
        .sort(
          (a, b) =>
            b?.start?.startDate?.localeCompare(a?.start?.startDate ?? "") ?? 0,
        );

      const hasLatestSeasonStarted =
        new Date().getTime() >
        new Date(gameSeasons[0]?.start?.startDate ?? "").getTime();

      game.currentSeason = hasLatestSeasonStarted
        ? gameSeasons[0]
        : gameSeasons[1];

      game.nextSeason = hasLatestSeasonStarted
        ? {
            name: `Next ${g.seasonKeyword}`,
            start: {
              confirmed: false,
              startDate: new Date(
                new Date(gameSeasons[0]?.start?.startDate ?? "").getTime() +
                  120 * 24 * 50 * 60 * 1000, // TODO replace with avg of previous events duration
              ).toString(),
              overrideText: "To be announced",
            },
            end: {
              confirmed: false,
              endDate: new Date(
                new Date(gameSeasons[0]?.start?.startDate ?? "").getTime() +
                  240 * 24 * 50 * 60 * 1000, // TODO replace with avg of previous events duration
              ).toString(),
            },
          }
        : gameSeasons[0];

      if (game.currentSeason && !game.currentSeason.end) {
        game.currentSeason.end = {
          confirmed: false,
          endDate: new Date(
            new Date(game.currentSeason.start?.startDate ?? "").getTime() +
              120 * 24 * 50 * 60 * 1000, // TODO replace with avg of previous events duration
          ).toString(),
        };
      }

      if (game.currentSeason && !game.currentSeason.end?.endDate) {
        game.currentSeason!.end!.endDate = new Date(
          new Date(game.currentSeason.start?.startDate ?? "").getTime() +
            120 * 24 * 50 * 60 * 1000, // TODO replace with avg of previous events duration
        ).toString();
      }

      if (game.nextSeason && !game.nextSeason.end) {
        game.nextSeason.end = {
          confirmed: false,
          endDate: new Date(
            new Date(game.nextSeason.start?.startDate ?? "").getTime() +
              120 * 24 * 50 * 60 * 1000, // TODO replace with avg of previous events duration
          ).toString(),
        };
      }

      if (game.nextSeason && !game.nextSeason.end?.endDate) {
        game.nextSeason!.end!.endDate = new Date(
          new Date(game.nextSeason.start?.startDate ?? "").getTime() +
            120 * 24 * 50 * 60 * 1000, // TODO replace with avg of previous events duration
        ).toString();
      }

      return game;
    })
    .map((g) => {
      if (
        g?.currentSeason?.start?.startDate &&
        inGracePeriod(g.currentSeason.start.startDate)
      ) {
        const diff =
          new Date().getTime() -
          new Date(g.currentSeason.start.startDate).getTime();
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
