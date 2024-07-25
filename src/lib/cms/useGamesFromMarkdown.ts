import { Game } from "@/lib/cms/games.types";
import { HOUR } from "@/lib/date";
import { inGracePeriod, sortBySeasons } from "@/lib/games/sortBySeasons";

export const useGamesFromMarkdown = (data: Queries.IndexPageQuery) => {
  return data.allMarkdownRemark.edges
    .map((e) => e.node.frontmatter as Game)
    .map((g) => {
      if (!g?.nextSeason?.startDate) {
        return g;
      }
      const nextStartDate = new Date(g.nextSeason.startDate);
      const now = new Date();
      if (nextStartDate.getTime() < now.getTime()) {
        return { ...g, currentSeason: g.nextSeason, nextSeason: null };
      }
      return g;
    })
    .map((g) => {
      if (
        g?.currentSeason?.startDate &&
        inGracePeriod(g?.currentSeason?.startDate)
      ) {
        const diff =
          new Date().getTime() - new Date(g.currentSeason.startDate).getTime();
        return {
          ...g,
          currentSeason: {
            ...g.currentSeason,
            justStarted: true,
            startDateNotice:
              diff < 2 * HOUR
                ? "Just started"
                : `Started ${(diff / HOUR).toFixed(0)} hours ago`,
            endDateNotice: " ",
          },
        } as Game;
      }
      return g as Game;
    })
    .sort(sortBySeasons);
};
