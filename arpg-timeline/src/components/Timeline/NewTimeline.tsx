import { useBreakpoint } from "@/hooks/useBreakpoint";
import { cn } from "@/lib/utils";
import { Button } from "@/ui/Button";
import { Slider } from "@/ui/Slider";
import { useHasMounted } from "@react-hooks-library/core";
import { Expand, Shrink } from "lucide-react";

import React, { useState, useMemo } from "react";

interface TimelineEvent {
    name: string;
    game: string;
    startDate: Date;
    startDateConfirmed: boolean;
    startDateNotice?: string | null;
    endDate: Date;
    endDateConfirmed: boolean;
    endDateNotice?: string | null;
}

function trimEventsToWindow(events: TimelineEvent[], minDate: Date, maxDate: Date) {
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
            (e) =>
                e !== null &&
                e.startDate < maxDate &&
                e.endDate.getTime() - e.startDate.getTime() > 1000 * 60 * 60 * 24,
        );
}
function addMonthsWithFraction(date: Date, months: number): Date {
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
}

export const GanttChart = ({ events }: { events: TimelineEvent[] }) => {
    const hasMounted = useHasMounted();
    const [range, setRange] = useState(4);
    const isMd = useBreakpoint("md");
    const [expanded, setIsExpanded] = useState(false);
    const breakpointFactor = useMemo(() => (isMd ? 1 : 20), [isMd]);
    const min = useMemo(
        () => addMonthsWithFraction(new Date(), -(range / breakpointFactor)),
        [range, isMd],
    );
    const max = useMemo(
        () => addMonthsWithFraction(new Date(), range / breakpointFactor),
        [range, isMd],
    );
    const filteredEvents = useMemo(() => trimEventsToWindow(events, min, max), [min, max]);

    const { gameGroups, minDate, maxDate, totalDays } = useMemo(() => {
        if (filteredEvents.length === 0)
            return { minDate: new Date(), maxDate: new Date(), totalDays: 0 };

        const dates = filteredEvents.flatMap((e) => [e.startDate, e.endDate]);
        const min = new Date(Math.min(...dates.map((d) => d.getTime())));
        const max = new Date(Math.max(...dates.map((d) => d.getTime())));

        const diffTime = max.getTime() - min.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

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

        return { gameGroups, minDate: min, maxDate: max, totalDays: diffDays };
    }, [filteredEvents]);

    const getPositionPercent = (date: Date) => {
        const daysSinceStart = Math.floor(
            (date.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24),
        );
        return (daysSinceStart / totalDays) * 100;
    };

    const getEventWidth = (event: TimelineEvent) => {
        const startPos = getPositionPercent(event.startDate);
        const endPos = getPositionPercent(event.endDate);
        return endPos - startPos;
    };

    const getMonthMarkers = () => {
        const markers = [];
        const current = new Date(minDate);
        while (current <= maxDate) {
            const position = getPositionPercent(current);
            if (position >= 0 && position <= 100) {
                const showYear =
                    (current.getMonth() === minDate.getMonth() &&
                        current.getFullYear() === minDate.getFullYear()) ||
                    (current.getFullYear() > minDate.getFullYear() && current.getMonth() === 0);
                markers.push({
                    date: new Date(current),
                    position,
                    label:
                        current.getMonth() === new Date().getMonth()
                            ? "Today"
                            : current.toLocaleDateString("en-US", {
                                  month: showYear ? undefined : "short",
                                  year: showYear ? "numeric" : undefined,
                              }),
                });
            }
            current.setMonth(current.getMonth() + 1);
        }
        return markers;
    };

    if (!hasMounted) {
        return null;
    }

    return (
        <>
            <Slider
                className="absolute top-4 right-12 h-4 w-xs max-w-1/3"
                value={[range / breakpointFactor]}
                max={18 / breakpointFactor}
                min={3 / breakpointFactor}
                step={1 / breakpointFactor}
                onValueChange={([value]) => setRange(value)}
                aria-description="Timeline scale"
            />
            <Button
                variant={"ghost"}
                size="icon"
                aria-label="Expand"
                className="absolute top-1 right-1"
                onClick={() => setIsExpanded((v) => !v)}
            >
                {expanded ? <Shrink className="h-4 w-4" /> : <Expand className="h-4 w-4" />}
            </Button>
            <div
                className={cn("max-h-full w-full overflow-y-hidden transition-all", {
                    "max-h-[152px]": !expanded,
                })}
            >
                <div className="relative overflow-hidden">
                    {/* Timeline Header */}
                    <div className="border-card-foreground/75 relative h-6 border-b">
                        {getMonthMarkers().map((marker, index) => (
                            <div
                                key={index}
                                className="group absolute top-0 flex h-full items-center not-md:even:hidden first-of-type:left-0!"
                                style={{ left: `${marker.position}%` }}
                            >
                                <div className="h-full w-px"></div>
                                <div className="text-card-foreground font-heading ml-2 text-xs text-nowrap group-first-of-type:ml-0">
                                    {marker.label}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Events */}
                    <div className="divide-card-foreground/50 bg-background divide-y">
                        {gameGroups?.flatMap((group, index) => (
                            <div key={index} className="relative h-8">
                                <div className="absolute top-0 right-0 left-0 flex h-full items-center px-2">
                                    {group.events.map((event, index, all) => {
                                        const startPos = getPositionPercent(event.startDate);
                                        const width = getEventWidth(event);

                                        const isNextConfirmed =
                                            event.startDate.getTime() > new Date().getTime() &&
                                            event.startDateConfirmed &&
                                            (all.length - 1 === index ||
                                                !all[all.length - 1].startDateConfirmed);
                                        // todo fix border radius when two next to each other

                                        return (
                                            <div
                                                className={cn(
                                                    `relative z-10 h-6 rounded bg-sky-900 shadow-sm`,
                                                    {
                                                        "z-20": index === 0,
                                                        "z-30 rounded-l-none rounded-tr-2xl rounded-br-xs bg-emerald-900 ring ring-emerald-500":
                                                            isNextConfirmed,
                                                        "border border-dashed border-emerald-900/75 bg-emerald-900/25":
                                                            !event.startDateConfirmed,
                                                    },
                                                )}
                                                style={{
                                                    left: `${startPos}%`,
                                                    width: `${Math.max(width, 0.5)}%`,
                                                    position: "absolute",
                                                    borderTopLeftRadius:
                                                        startPos === 0 ? 0 : undefined,
                                                    borderBottomLeftRadius:
                                                        startPos === 0 ? 0 : undefined,
                                                    borderTopRightRadius:
                                                        startPos + width >= 100 ? 0 : undefined,
                                                    borderBottomRightRadius:
                                                        startPos + width >= 100 ? 0 : undefined,
                                                }}
                                            >
                                                {/* Event name inside bar */}
                                                <div className="absolute inset-0 flex items-center justify-center px-2">
                                                    <span
                                                        className="font-heading text-foreground flexflex-nowrap flex flex-row text-center text-xs text-nowrap text-ellipsis drop-shadow-sm"
                                                        title={`${event.game}: ${event.name}`}
                                                    >
                                                        {index === 1 && range <= 6 ? (
                                                            <>
                                                                {event.game}
                                                                <span className="not-md:hidden">
                                                                    : {event.name}
                                                                </span>
                                                            </>
                                                        ) : (
                                                            event.game
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

