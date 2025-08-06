import { useMemo } from "react";

import { addMonthsWithFraction } from "../helpers/addMonthsWithFraction";
import { trimEventsToWindow } from "../helpers/trimEventsToWindow";
import { DEFAULT_FUTURE_MONTHS, DEFAULT_PAST_MONTHS } from "../Timeline";
import { TimelineEvent } from "../Timeline.types";

export const useTimelineData = (events: TimelineEvent[]) => {
    const min = useMemo(() => addMonthsWithFraction(new Date(), DEFAULT_PAST_MONTHS), []);
    const max = useMemo(() => addMonthsWithFraction(new Date(), DEFAULT_FUTURE_MONTHS), []);
    const filteredEvents = useMemo(() => trimEventsToWindow(events, min, max), [events, min, max]);

    return useMemo(() => {
        if (filteredEvents.length === 0) {
            return {
                gameGroups: [],
                minDate: new Date(),
                maxDate: new Date(),
                totalDays: 0,
            };
        }

        const dates = filteredEvents.flatMap((e) => [e.startDate, e.endDate]);
        const minDate = new Date(Math.min(...dates.map((d) => d.getTime())));
        const maxDate = new Date(Math.max(...dates.map((d) => d.getTime())));
        const totalDays = Math.ceil(
            (maxDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24),
        );

        const grouped = filteredEvents.reduce<Record<string, TimelineEvent[]>>(
            (acc, event: TimelineEvent) => {
                if (!acc[event.game]) {
                    acc[event.game] = [];
                }
                acc[event.game].push(event);
                return acc;
            },
            {},
        );

        const gameGroups = Object.entries(grouped).map(([game, gameEvents]) => ({
            game,
            events: gameEvents.sort((a, b) => a.startDate.getTime() - b.startDate.getTime()),
        }));

        return { gameGroups, minDate, maxDate, totalDays };
    }, [filteredEvents]);
};
