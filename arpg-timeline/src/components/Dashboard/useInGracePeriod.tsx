"use client";
import { useEffect, useState } from "react";

import { inGracePeriod } from "@/lib/games/sortBySeasons";

export const useInGracePeriod = (startDate: string | null | undefined, endDate?: string | null) => {
    const [isInGracePeriod, setIsInGracePeriod] = useState(false);

    useEffect(() => {
        const checkGracePeriod = () => {
            setIsInGracePeriod(inGracePeriod(startDate, endDate));
        };
        checkGracePeriod();
        const interval = setInterval(checkGracePeriod, 10_000);
        return () => clearInterval(interval);
    }, [startDate, endDate]);

    return isInGracePeriod;
};
