import { TimelineEvent } from "@/components/Timeline/Conts";
import { Game } from "@/lib/cms/games.types";

export const useTimelineEvents = (games: Game[]) => {
  return games.reduce((prev: TimelineEvent[], g: Game) => {
    const next = [...prev];

    if (g.currentSeason?.start?.startDate) {
      const startDate = new Date(g.currentSeason.start.startDate);
      let endDate = g.currentSeason.end?.endDate
        ? new Date(g.currentSeason.end.endDate)
        : undefined;

      if (!endDate || endDate < startDate) {
        endDate = new Date(
          new Date(g.currentSeason.start.startDate).getTime() +
            120 * 24 * 50 * 60 * 1000,
        );
      }

      next.push({
        name: g.currentSeason.name ?? "",
        game: g.name,
        startDate: startDate,
        startDateNotice: g.currentSeason.start.overrideText,
        endDate: endDate,
        endDateNotice: g?.currentSeason?.end?.overrideText,
        startDateConfirmed: g.currentSeason.start.confirmed ?? false,
        endDateConfirmed: g.currentSeason.end?.confirmed ?? false,
      } satisfies TimelineEvent);
    } else if (g.nextSeason?.start?.startDate) {
      next.push({
        name: "",
        game: g.name,
        startDate: new Date(g.nextSeason.start.startDate),
        startDateNotice: g?.nextSeason.start.overrideText,
        endDate: new Date(g.nextSeason.start.startDate),
        endDateNotice: "n/a",
        startDateConfirmed: g.nextSeason.start.confirmed ?? false,
        endDateConfirmed: false,
      } satisfies TimelineEvent);
    } else {
      next.push({
        name: "",
        game: g.name,
        startDate: new Date(),
        startDateNotice: "n/a",
        endDate: new Date(),
        startDateConfirmed: false,
        endDateConfirmed: false,
      } satisfies TimelineEvent);
    }

    if (g.nextSeason?.start?.startDate) {
      next.push({
        name: g.nextSeason.name ?? "",
        game: g.name,
        startDate: new Date(
          g?.nextSeason?.start.startDate ?? g.currentSeason?.end?.endDate,
        ),
        startDateNotice: g?.nextSeason?.start.overrideText,
        endDate: new Date(
          new Date(g.nextSeason.start.startDate).getTime() +
            120 * 24 * 50 * 60 * 1000,
        ),
        endDateNotice: g?.nextSeason?.end?.overrideText ?? "",
        startDateConfirmed: g.nextSeason.start.confirmed ?? false,
        endDateConfirmed: g.nextSeason.end?.confirmed ?? false,
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
        startDateConfirmed: false,
        endDateConfirmed: false,
      } satisfies TimelineEvent);
    } else {
      next.push({
        name: "",
        game: g.name,
        startDate: new Date(),
        startDateNotice: "n/a",
        endDate: new Date(),
        endDateNotice: "n/a",
        startDateConfirmed: false,
        endDateConfirmed: false,
      } satisfies TimelineEvent);
    }
    return next;
  }, [] as TimelineEvent[]);
};
