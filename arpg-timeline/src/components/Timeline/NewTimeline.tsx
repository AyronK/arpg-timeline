import { Expand, Shrink } from "lucide-react";
import React, { useMemo, useState } from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/ui/Button";

import { TimelineEvent } from "./Const";

const DEFAULT_PAST_MONTHS = -3;
const DEFAULT_FUTURE_MONTHS = 6;
const MIN_EVENT_DURATION_HOURS = 24;
const MIN_BAR_WIDTH_PERCENT = 0.5;

const addMonthsWithFraction = (date: Date, months: number): Date => {
    const whole = Math.trunc(months);
    const fraction = months - whole;
    const result = new Date(date);

    result.setMonth(result.getMonth() + whole);

    if (fraction !== 0) {
        const daysInMonth = new Date(result.getFullYear(), result.getMonth() + 1, 0).getDate();
        const addDays = Math.round(daysInMonth * fraction);
        result.setDate(result.getDate() + addDays);
    }

    return result;
};

const trimEventsToWindow = (
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

const useTimelineData = (events: TimelineEvent[]) => {
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

        const grouped = filteredEvents.reduce(
            (acc, event) => {
                if (!acc[event.game]) {
                    acc[event.game] = [];
                }
                acc[event.game].push(event);
                return acc;
            },
            {} as Record<string, TimelineEvent[]>,
        );

        const gameGroups = Object.entries(grouped).map(([game, gameEvents]) => ({
            game,
            events: gameEvents.sort((a, b) => a.startDate.getTime() - b.startDate.getTime()),
        }));

        return { gameGroups, minDate, maxDate, totalDays };
    }, [filteredEvents]);
};

interface MonthMarkerProps {
    marker: {
        date: Date;
        position: number;
        label: string;
    };
    index: number;
}

const MonthMarker: React.FC<MonthMarkerProps> = ({ marker, index }) => (
    <div
        key={index}
        className="group absolute top-0 flex h-full items-center not-md:even:hidden first-of-type:left-0!"
        suppressHydrationWarning
        style={{ left: `${marker.position}%` }}
    >
        <div className="h-full w-px" />
        <div className="text-card-foreground font-heading ml-2 text-xs text-nowrap group-first-of-type:ml-0">
            {marker.label}
        </div>
    </div>
);

interface EventBarProps {
    event: TimelineEvent;
    index: number;
    allEvents: TimelineEvent[];
    startPos: number;
    width: number;
}

const EventBar: React.FC<EventBarProps> = ({ event, index, allEvents, startPos, width }) => {
    const isNextConfirmed =
        event.startDate.getTime() > new Date().getTime() &&
        event.startDateConfirmed &&
        (allEvents.length - 1 === index || !allEvents[allEvents.length - 1].startDateConfirmed);

    const isNextEventConfirmed = allEvents[index + 1]?.startDateConfirmed;

    const barClasses = cn("relative z-10 h-5 rounded bg-sky-900 shadow-sm", {
        "z-20": index === 0,
        "z-30 rounded-l-none rounded-tr-2xl rounded-br-xs bg-emerald-900 ring ring-emerald-600":
            isNextConfirmed,
        "border border-dashed border-emerald-900/75 bg-emerald-900/25": !event.startDateConfirmed,
        "bg-sky-900/50": isNextEventConfirmed,
    });

    const barStyle = {
        left: `${startPos}%`,
        right: startPos + width > 99 ? 0 : undefined,
        width: startPos + width > 99 ? undefined : `${Math.max(width, MIN_BAR_WIDTH_PERCENT)}%`,
        position: "absolute" as const,
        borderTopLeftRadius: startPos === 0 ? 0 : undefined,
        borderBottomLeftRadius: startPos === 0 ? 0 : undefined,
        borderTopRightRadius: startPos + width > 99 ? 0 : undefined,
        borderBottomRightRadius: startPos + width > 99 ? 0 : undefined,
    };

    return (
        <div className={barClasses} style={barStyle} suppressHydrationWarning>
            <div className="absolute inset-0 flex items-center justify-center">
                <span
                    className="font-heading text-foreground flex flex-row flex-nowrap text-center text-xs text-nowrap text-ellipsis drop-shadow-sm"
                    title={`${event.game}: ${event.name}`}
                >
                    {index === 1 ? (
                        <>
                            {event.game}
                            <span className="not-md:hidden">: {event.name}</span>
                        </>
                    ) : (
                        event.game
                    )}
                </span>
            </div>
        </div>
    );
};

interface GameRowProps {
    group: {
        game: string;
        events: TimelineEvent[];
    };
    getPositionPercent: (date: Date) => number;
    getEventWidth: (event: TimelineEvent) => number;
}

const GameRow: React.FC<GameRowProps> = ({ group, getPositionPercent, getEventWidth }) => (
    <div className="relative h-8">
        <div className="absolute top-0 right-0 left-0 flex h-full items-center">
            {group.events.map((event, index) => (
                <EventBar
                    key={`${event.game}-${event.name}-${index}`}
                    event={event}
                    index={index}
                    allEvents={group.events}
                    startPos={getPositionPercent(event.startDate)}
                    width={getEventWidth(event)}
                />
            ))}
        </div>
    </div>
);

export const GanttChart: React.FC<{ events: TimelineEvent[] }> = ({ events }) => {
    const [expanded, setExpanded] = useState(false);
    const { gameGroups, minDate, maxDate, totalDays } = useTimelineData(events);

    const getPositionPercent = (date: Date): number => {
        const daysSinceStart = Math.floor(
            (date.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24),
        );
        return (daysSinceStart / totalDays) * 100;
    };

    const getEventWidth = (event: TimelineEvent): number => {
        const startPos = getPositionPercent(event.startDate);
        const endPos = getPositionPercent(event.endDate);
        return endPos - startPos;
    };

    const getMonthMarkers = (): Array<{ date: Date; position: number; label: string }> => {
        const markers = [];
        const current = new Date(minDate);

        while (current <= maxDate) {
            const position = getPositionPercent(current);

            if (position >= 0 && position <= 100) {
                const showYear =
                    (current.getMonth() === minDate.getMonth() &&
                        current.getFullYear() === minDate.getFullYear()) ||
                    (current.getFullYear() > minDate.getFullYear() && current.getMonth() === 0);

                const label =
                    current.getMonth() === new Date().getMonth()
                        ? "Today"
                        : current.toLocaleDateString("en-US", {
                              month: showYear ? undefined : "short",
                              year: showYear ? "numeric" : undefined,
                          });

                markers.push({ date: new Date(current), position, label });
            }

            current.setMonth(current.getMonth() + 1);
        }

        return markers;
    };

    return (
        <>
            <Button
                variant="ghost"
                size="icon"
                aria-label={expanded ? "Collapse" : "Expand"}
                className="absolute top-1 right-1"
                onClick={() => setExpanded((prev) => !prev)}
            >
                {expanded ? <Shrink className="h-4 w-4" /> : <Expand className="h-4 w-4" />}
            </Button>

            <div
                className={cn("max-h-full w-full overflow-y-hidden", {
                    "max-h-[152px]": !expanded,
                })}
            >
                <div className="relative overflow-hidden">
                    <div className="border-card-foreground/75 relative h-6 border-b">
                        {getMonthMarkers().map((marker, index) => (
                            <MonthMarker key={index} marker={marker} index={index} />
                        ))}
                    </div>

                    <div className="divide-card-foreground/50 bg-background divide-y">
                        {gameGroups.map((group, index) => (
                            <GameRow
                                key={`${group.game}-${index}`}
                                group={group}
                                getPositionPercent={getPositionPercent}
                                getEventWidth={getEventWidth}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};
