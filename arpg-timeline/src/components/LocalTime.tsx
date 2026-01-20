"use client";
import React, { useMemo } from "react";

import { cn } from "@/lib/utils";

interface LocalTimeProps {
    utcTime: string;
    format?: "12h" | "24h";
}

const LocalTime: React.FC<LocalTimeProps> = ({ utcTime, format = "12h" }) => {
    const localTime = useMemo(() => {
        const date = new Date(utcTime);
        const options: Intl.DateTimeFormatOptions = {
            hour: "numeric",
            minute: "2-digit",
            hour12: format === "12h",
        };
        return date.toLocaleTimeString([], options);
    }, [utcTime, format]);

    const fallbackTime = useMemo(() => {
        return new Date(utcTime).toLocaleTimeString([], {
            hour: "numeric",
            minute: "2-digit",
            hour12: format === "12h",
            timeZone: "UTC",
        });
    }, [utcTime, format]);

    return (
        <span className={cn("text-nowrap")} suppressHydrationWarning>
            {localTime || `${fallbackTime} UTC`}
        </span>
    );
};

export default LocalTime;
