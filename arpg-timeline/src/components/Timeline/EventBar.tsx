"use client";

import { FC, useMemo } from "react";

import { cn } from "@/lib/utils";

import { MIN_BAR_WIDTH_PERCENT } from "./Timeline";
import { EventBarProps } from "./Timeline.types";

export const EventBar: FC<EventBarProps> = ({ event, index, allEvents, startPos, width }) => {
    const isNextConfirmed = useMemo(
        () =>
            event.startDate.getTime() > new Date().getTime() &&
            event.startDateConfirmed &&
            (allEvents.length - 1 === index || !allEvents[allEvents.length - 1].startDateConfirmed),
        [allEvents, event.startDate, event.startDateConfirmed, index],
    );

    const barStyle = useMemo(
        () => ({
            left: `${startPos}%`,
            right: startPos + width > 99 ? 0 : undefined,
            width: startPos + width > 99 ? undefined : `${Math.max(width, MIN_BAR_WIDTH_PERCENT)}%`,
            position: "absolute" as const,
            borderTopLeftRadius: startPos === 0 ? 0 : undefined,
            borderBottomLeftRadius: startPos === 0 ? 0 : undefined,
            borderTopRightRadius: startPos + width > 99 ? 0 : undefined,
            borderBottomRightRadius: startPos + width > 99 ? 0 : undefined,
        }),
        [startPos, width],
    );

    return (
        <div
            className={cn("relative bottom-0 z-5 h-3 bg-sky-900 shadow-sm", {
                "z-10": index === 0,
                "z-20 rounded-tr-2xl rounded-br-xs bg-emerald-900 ring ring-emerald-500":
                    isNextConfirmed,
                "rounded-tr-2xl border border-dashed border-emerald-800/75 bg-emerald-900/25":
                    !event.startDateConfirmed,
            })}
            style={barStyle}
            suppressHydrationWarning
            title={
                !event.startDateConfirmed
                    ? `[PRESUMED] ${event.game}: ${event.name}`
                    : `${event.game}: ${event.name}`
            }
        />
    );
};
