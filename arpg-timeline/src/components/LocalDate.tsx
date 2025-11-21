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

const LocalDate: React.FC<LocalDateProps> = ({ utcDate, dateOnly, longDate }) => {
    const localDate = useMemo(() => {
        const date = new Date(utcDate);
        return dateOnly
            ? INTL_LOCAL_DATE.format(date)
            : longDate
              ? INTL_LOCAL_DATETIME_LONG.format(date)
              : INTL_LOCAL_DATETIME.format(date);
    }, [dateOnly, longDate, utcDate]);

    const fallbackDate = useMemo(() => {
        const date = new Date(utcDate);
        return longDate ? INTL_UTC_DATETIME_LONG.format(date) : INTL_UTC_DATETIME.format(date);
    }, [longDate, utcDate]);

    return (
        <span className={cn("text-nowrap")} suppressHydrationWarning>
            {localDate || `${fallbackDate} UTC`}
        </span>
    );
};

export default LocalDate;
