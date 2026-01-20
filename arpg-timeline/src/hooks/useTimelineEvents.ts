import { TimelineEvent } from "@/components/Timeline/Timeline.types";
import { Game } from "@/lib/cms/games.types";

export const useTimelineEvents = (games: Game[]) => {
    const filteredGames = [
        ...games.filter((g) => !g.isComingSoon),
        ...games.filter((g) => g.isComingSoon),
    ];
    return filteredGames
        .filter((g) => !g.isDormant)
        .reduce((prev: TimelineEvent[], g: Game) => {
            const next = [...prev];

            if (g.currentSeason?.start?.startDate) {
                const startDate = new Date(g.currentSeason.start.startDate);
                let endDate = g.currentSeason.end?.endDate
                    ? new Date(g.currentSeason.end.endDate)
                    : undefined;

                if (!endDate || endDate < startDate) {
                    endDate = new Date(new Date(startDate).getTime() + 120 * 24 * 50 * 60 * 1000);
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

            const nextStartDate = new Date(g?.nextSeason?.start?.startDate ?? next?.[-1]?.endDate);
            const nextEndDate = new Date(g?.nextSeason?.end?.endDate ?? next?.[-1]?.endDate);

            next.push({
                name: g.nextSeason?.name ?? "",
                game: g.name,
                startDate: nextStartDate,
                startDateNotice: g?.nextSeason?.start?.overrideText,
                endDate:
                    g?.nextSeason?.end?.endDate && nextEndDate > nextStartDate
                        ? nextEndDate
                        : new Date(
                              nextStartDate.getTime() +
                                  (g.averageSeasonDuration ?? 120) * 24 * 60 * 60 * 1000,
                          ),
                endDateNotice: g?.nextSeason?.end?.overrideText ?? "",
                startDateConfirmed: g.nextSeason?.start?.confirmed ?? false,
                endDateConfirmed: g.nextSeason?.end?.confirmed ?? false,
            } satisfies TimelineEvent);
            return next;
        }, [] as TimelineEvent[]);
};
