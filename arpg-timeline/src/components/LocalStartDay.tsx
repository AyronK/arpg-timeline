"use client";
import React, { useMemo } from "react";

import { cn } from "@/lib/utils";

interface LocalStartDayProps {
    utcDates: string[];
}

const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const mostCommonWeekday = (dates: string[], useUTC: boolean): string | null => {
    const counts = new Array<number>(7).fill(0);

    for (const value of dates) {
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) continue;
        counts[useUTC ? date.getUTCDay() : date.getDay()]++;
    }

    let bestIndex = -1;
    let bestCount = 0;
    counts.forEach((count, index) => {
        if (count > bestCount) {
            bestCount = count;
            bestIndex = index;
        }
    });

    return bestIndex === -1 ? null : WEEKDAYS[bestIndex];
};

const LocalStartDay: React.FC<LocalStartDayProps> = ({ utcDates }) => {
    const localDay = useMemo(() => mostCommonWeekday(utcDates, false), [utcDates]);
    const fallbackDay = useMemo(() => mostCommonWeekday(utcDates, true), [utcDates]);

    return (
        <span className={cn("text-nowrap")} suppressHydrationWarning>
            {localDay ?? fallbackDay ?? "N/A"}
        </span>
    );
};

export default LocalStartDay;
