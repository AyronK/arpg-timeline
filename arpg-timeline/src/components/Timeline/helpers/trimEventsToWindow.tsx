import { MIN_EVENT_DURATION_HOURS } from "../Timeline";
import { TimelineEvent } from "../Timeline.types";

export const trimEventsToWindow = (
    events: TimelineEvent[],
    minDate: Date,
    maxDate: Date,
): TimelineEvent[] => {
    return events
        .map((event) => {
            const startDate =
                event.startDate < minDate
                    ? minDate
                    : event.startDate > maxDate
                      ? maxDate
                      : event.startDate;

            const endDate =
                event.endDate < minDate
                    ? minDate
                    : event.endDate > maxDate
                      ? maxDate
                      : event.endDate;

            if (endDate < startDate) return null;
            return { ...event, startDate, endDate };
        })
        .filter(
            (e): e is TimelineEvent =>
                e !== null &&
                e.startDate < maxDate &&
                e.endDate.getTime() - e.startDate.getTime() >
                    1000 * 60 * 60 * MIN_EVENT_DURATION_HOURS,
        );
};
