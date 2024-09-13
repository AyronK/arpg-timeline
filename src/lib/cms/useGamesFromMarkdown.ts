import { Game } from "@/lib/cms/games.types";
//import { HOUR } from "@/lib/date";
//import { inGracePeriod, sortBySeasons } from "@/lib/games/sortBySeasons";

export const useGamesFromMarkdown = (data: Queries.IndexPageQuery) => {
  return data.games.edges
    .map((e) => e.node.frontmatter as Game)
    .map((g) => {
      const gameSeasons = data.seasons.edges.map(e=>e.node.frontmatter).filter(e=>e?.game === g.name).sort((a,b)=> b?.start?.startDate?.localeCompare(a?.start?.startDate ?? "") ?? 0);
      const hasLatestSeasonStarted = new Date().getTime() > new Date(gameSeasons[0]?.start?.startDate ?? "").getTime();
      const currentSeason = hasLatestSeasonStarted ? gameSeasons[0] : gameSeasons[1];
      const nextSeason = hasLatestSeasonStarted ? {name: `Next ${g.seasonKeyword}`, start: { startDate:new Date(
        new Date(gameSeasons[0]?.start?.startDate ?? "").getTime() + 120 * 24 * 50 * 60 * 1000,
      ),}} : gameSeasons[0]

      console.log(currentSeason, nextSeason)
      return []});
    //   if (!g?.nextSeason?.startDate) {
    //     return g;
    //   }
    //   const nextStartDate = new Date(g.nextSeason.startDate);
    //   const now = new Date();
    //   if (nextStartDate.getTime() < now.getTime()) {
    //     return {
    //       ...g,
    //       currentSeason: {
    //         ...g.nextSeason,
    //         endDate: new Date(
    //           new Date(g.nextSeason.startDate).getTime() +
    //             120 * 24 * 50 * 60 * 1000,
    //         ),
    //       },
    //       nextSeason: {
    //         startDate:
    //           new Date(g.nextSeason.startDate).getTime() +
    //           120 * 24 * 50 * 60 * 1000,
    //         title: `Next ${g.seasonKeyword} TBA`,
    //       },
    //     };
    //   }
    //   return g;
    // })
    // .map((g) => {
    //   if (
    //     g?.currentSeason?.startDate &&
    //     inGracePeriod(g?.currentSeason?.startDate)
    //   ) {
    //     const diff =
    //       new Date().getTime() - new Date(g.currentSeason.startDate).getTime();
    //     return {
    //       ...g,
    //       currentSeason: {
    //         ...g.currentSeason,
    //         justStarted: true,
    //         startDateNotice:
    //           diff < 2 * HOUR
    //             ? "Just started"
    //             : `Started ${(diff / HOUR).toFixed(0)} hours ago`,
    //         endDateNotice: " ",
    //       },
    //     } as Game;
    //   }
    //   return g as Game;
    // })
    // .sort(sortBySeasons);
};
