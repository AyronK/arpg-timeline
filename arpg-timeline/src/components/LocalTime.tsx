"use client";
import React, { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

interface LocalTimeProps {
    utcTime: string;
    format?: "12h" | "24h";
}

const LocalTime: React.FC<LocalTimeProps> = ({ utcTime, format = "12h" }) => {
    const [localTime, setLocalTime] = useState<string | null>(null);

    useEffect(() => {
        const date = new Date(utcTime);
        const options: Intl.DateTimeFormatOptions = {
            hour: "numeric",
            minute: "2-digit",
            hour12: format === "12h",
        };
        setLocalTime(date.toLocaleTimeString([], options));
    }, [utcTime, format]);

    return (
        <span className={cn("text-nowrap", { "sr-only": !localTime })} suppressHydrationWarning>
            {localTime ||
                `${new Date(utcTime).toLocaleTimeString([], {
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: format === "12h",
                    timeZone: "UTC",
                })} UTC`}
        </span>
    );
};

export default LocalTime;
