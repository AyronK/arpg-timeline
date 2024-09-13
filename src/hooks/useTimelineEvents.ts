import { TimelineEvent } from "@/components/Timeline/Conts";
import { Game } from "@/lib/cms/games.types";

export const useTimelineEvents = (games: Game[]) => {
  return games.reduce((prev: TimelineEvent[], g: Game) => {
    const next = [...prev];

    if (g.currentSeason?.startDate) {
      next.push({
        name: g.currentSeason.title ?? "",
        game: g.name,
        startDate: new Date(g.currentSeason.startDate),
        startDateNotice: g.currentSeason.startDateNotice,
        endDate: new Date(g.currentSeason.endDate ?? "Invalid Date"),
        endDateNotice: g?.currentSeason?.endDateNotice,
      } satisfies TimelineEvent);
    } else if (g.nextSeason?.startDate) {
      next.push({
        name: "",
        game: g.name,
        startDate: new Date(g.nextSeason.startDate),
        startDateNotice: g?.nextSeason.startDateNotice,
        endDate: new Date(g.nextSeason.startDate),
        endDateNotice: "n/a",
      } satisfies TimelineEvent);
    } else {
      next.push({
        name: "",
        game: g.name,
        startDate: new Date(),
        startDateNotice: "n/a",
        endDate: new Date(),
        endDateNotice: "n/a",
      } satisfies TimelineEvent);
    }

    if (g.nextSeason?.startDate) {
      next.push({
        name: g.nextSeason.title ?? "",
        game: g.name,
        startDate: new Date(g?.nextSeason?.startDate ?? "Invalid Date"),
        startDateNotice: g?.nextSeason?.startDateNotice,
        endDate: new Date(
          new Date(g.nextSeason.startDate).getTime() +
            120 * 24 * 50 * 60 * 1000,
        ),
        endDateNotice: g?.nextSeason?.endDateNotice ?? "",
      } satisfies TimelineEvent);
    } else if (g.currentSeason?.endDate) {
      next.push({
        name: g.nextSeason?.title ?? "",
        game: g.name,
        startDate: new Date(g.currentSeason?.endDate),
        startDateNotice: g?.nextSeason?.startDateNotice,
        endDate: new Date(
          new Date(g.currentSeason?.endDate).getTime() +
            120 * 24 * 50 * 60 * 1000,
        ),
        endDateNotice: g.nextSeason?.endDateNotice ?? "",
      } satisfies TimelineEvent);
    } else {
      next.push({
        name: "",
        game: g.name,
        startDate: new Date(),
        startDateNotice: "n/a",
        endDate: new Date(),
        endDateNotice: "n/a",
      } satisfies TimelineEvent);
    }
    return next;
  }, [] as TimelineEvent[]);
};
