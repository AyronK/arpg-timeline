"use client";

import { FC, useCallback, useMemo } from "react";

import { GameRow } from "./GameRow";
import { useTimelineData } from "./hooks/useTimelineData";
import { MonthMarker } from "./MonthMarker";
import { TimelineEvent } from "./Timeline.types";

export const DEFAULT_PAST_MONTHS = -3;
export const DEFAULT_FUTURE_MONTHS = 6;
export const MIN_EVENT_DURATION_HOURS = 24;
export const MIN_BAR_WIDTH_PERCENT = 0.5;

export const Timeline: FC<{ events: TimelineEvent[] }> = ({ events }) => {
    const { gameGroups, minDate, maxDate, totalDays } = useTimelineData(events);

    const getPositionPercent = useCallback(
        (date: Date): number => {
            const daysSinceStart = Math.floor(
                (date.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24),
            );
            return (daysSinceStart / totalDays) * 100;
        },
        [minDate, totalDays],
    );

    const getEventWidth = (event: TimelineEvent): number => {
        const startPos = getPositionPercent(event.startDate);
        const endPos = getPositionPercent(event.endDate);
        return endPos - startPos;
    };

    const monthMarkers = useMemo(() => {
        const markers = [];
        const current = new Date(minDate);

        while (current <= maxDate) {
            const position = getPositionPercent(current);

            if (position >= 0 && position <= 100) {
                const showYear =
                    (current.getMonth() === minDate.getMonth() &&
                        current.getFullYear() === minDate.getFullYear()) ||
                    (current.getFullYear() > minDate.getFullYear() && current.getMonth() === 0);

                const label = current.toLocaleDateString("en-US", {
                    month: showYear ? undefined : "short",
                    year: showYear ? "numeric" : undefined,
                });

                markers.push({ date: new Date(current), position, label });
            }

            current.setMonth(current.getMonth() + 1);
        }

        return markers;
    }, [getPositionPercent, maxDate, minDate]);

    return (
        <div className="max-h-full w-full overflow-x-hidden overflow-y-scroll">
            <div className="relative">
                <div className="border-card-foreground/75 bg-card sticky top-0 z-50 h-6 border-b">
                    {monthMarkers.map((marker, index) => (
                        <MonthMarker key={index} marker={marker} index={index} />
                    ))}
                </div>
                <div className="absolute inset-0">
                    <div
                        className="border-destructive/50 absolute top-6 bottom-0 z-40 w-1 border-l"
                        style={{ left: `${getPositionPercent(new Date())}%` }}
                    />
                </div>
                <div className="border-card-foreground/25 divide-card-foreground/50 bg-background divide-y border-r border-b border-l">
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
    );
};
