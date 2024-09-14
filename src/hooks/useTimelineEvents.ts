import { TimelineEvent } from "@/components/Timeline/Conts";
import { Game } from "@/lib/cms/games.types";

export const useTimelineEvents = (games: Game[]) => {
  return games.reduce((prev: TimelineEvent[], g: Game) => {
    const next = [...prev];

    if (g.currentSeason?.start?.startDate) {
      next.push({
        name: g.currentSeason.name ?? "",
        game: g.name,
        startDate: new Date(g.currentSeason.start.startDate),
        startDateNotice: g.currentSeason.start.overrideText,
        endDate: new Date(g.currentSeason.end?.endDate ?? "Invalid Date"),
        endDateNotice: g?.currentSeason?.end?.overrideText,
      } satisfies TimelineEvent);
    } else if (g.nextSeason?.start?.startDate) {
      next.push({
        name: "",
        game: g.name,
        startDate: new Date(g.nextSeason.start.startDate),
        startDateNotice: g?.nextSeason.start.overrideText,
        endDate: new Date(g.nextSeason.start.startDate),
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

    if (g.nextSeason?.start?.startDate) {
      next.push({
        name: g.nextSeason.name ?? "",
        game: g.name,
        startDate: new Date(g?.nextSeason?.start.startDate ?? "Invalid Date"),
        startDateNotice: g?.nextSeason?.start.overrideText,
        endDate: new Date(
          new Date(g.nextSeason.start.startDate).getTime() +
            120 * 24 * 50 * 60 * 1000,
        ),
        endDateNotice: g?.nextSeason?.end?.overrideText ?? "",
      } satisfies TimelineEvent);
    } else if (g.currentSeason?.end?.endDate) {
      next.push({
        name: g.nextSeason?.name ?? "",
        game: g.name,
        startDate: new Date(g.currentSeason?.end?.endDate),
        startDateNotice: g?.nextSeason?.start?.overrideText,
        endDate: new Date(
          new Date(g.currentSeason?.end?.endDate).getTime() +
            120 * 24 * 50 * 60 * 1000,
        ),
        endDateNotice: g.nextSeason?.end?.overrideText ?? "",
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
