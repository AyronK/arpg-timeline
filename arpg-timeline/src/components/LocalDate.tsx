"use client";
import React, { useMemo } from "react";

import {
    INTL_LOCAL_DATE,
    INTL_LOCAL_DATETIME,
    INTL_LOCAL_DATETIME_LONG,
    INTL_UTC_DATETIME,
    INTL_UTC_DATETIME_LONG,
} from "@/lib/date";
import { cn } from "@/lib/utils";

interface LocalDateProps {
    utcDate: string;
    dateOnly?: boolean;
    longDate?: boolean;
}

function getOrdinal(n: number): string {
    const v = n % 100;
    if (v >= 11 && v <= 13) return "th";
    switch (n % 10) {
        case 1:
            return "st";
        case 2:
            return "nd";
        case 3:
            return "rd";
        default:
            return "th";
    }
}

function formatWithOrdinal(date: Date, formatter: Intl.DateTimeFormat): string {
    return formatter
        .formatToParts(date)
        .map((part) => {
            if (part.type === "day") {
                const day = parseInt(part.value, 10);
                return `${day}${getOrdinal(day)}`;
            }
            return part.value;
        })
        .join("");
}

const LocalDate: React.FC<LocalDateProps> = ({ utcDate, dateOnly, longDate }) => {
    const localDate = useMemo(() => {
        const date = new Date(utcDate);
        const formatter = dateOnly
            ? INTL_LOCAL_DATE
            : longDate
              ? INTL_LOCAL_DATETIME_LONG
              : INTL_LOCAL_DATETIME;
        return formatWithOrdinal(date, formatter);
    }, [dateOnly, longDate, utcDate]);

    const fallbackDate = useMemo(() => {
        const date = new Date(utcDate);
        const formatter = longDate ? INTL_UTC_DATETIME_LONG : INTL_UTC_DATETIME;
        return formatWithOrdinal(date, formatter);
    }, [longDate, utcDate]);

    return (
        <span className={cn("text-nowrap")} suppressHydrationWarning>
            {localDate || `${fallbackDate} UTC`}
        </span>
    );
};

export default LocalDate;
