"use client";
import React, { useEffect, useState } from "react";

import {
    INTL_LOCAL_DATE,
    INTL_LOCAL_DATETIME,
    INTL_LOCAL_DATETIME_LONG,
    INTL_UTC_DATETIME,
    INTL_UTC_DATETIME_LONG,
} from "@/lib/date";

interface LocalDateProps {
    utcDate: string;
    dateOnly?: boolean;
    longDate?: boolean;
}

const LocalDate: React.FC<LocalDateProps> = ({ utcDate, dateOnly, longDate }) => {
    const [localDate, setLocalDate] = useState<string | null>(null);

    useEffect(() => {
        const date = new Date(utcDate);
        setLocalDate(
            dateOnly
                ? INTL_LOCAL_DATE.format(date)
                : longDate
                  ? INTL_LOCAL_DATETIME_LONG.format(date)
                  : INTL_LOCAL_DATETIME.format(date),
        );
    }, [dateOnly, longDate, utcDate]);

    return (
        <span className="text-nowrap" suppressHydrationWarning>
            {localDate
                ? localDate
                : `${longDate ? INTL_UTC_DATETIME_LONG.format(new Date(utcDate)) : INTL_UTC_DATETIME.format(new Date(utcDate))} UTC`}
        </span>
    );
};

export default LocalDate;
