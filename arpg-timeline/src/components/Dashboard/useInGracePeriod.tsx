"use client";
import { useEffect, useState } from "react";

import { DAY } from "@/lib/date";

export const GRACE_PERIOD = DAY * 2;

export const useInGracePeriod = (startDate: string | null | undefined) => {
    const [isInGracePeriod, setIsInGracePeriod] = useState(false);

    useEffect(() => {
        const checkGracePeriod = () => {
            if (!startDate) {
                setIsInGracePeriod(false);
                return;
            }
            setIsInGracePeriod(Date.now() - new Date(startDate).getTime() < GRACE_PERIOD);
        };
        checkGracePeriod();
        const interval = setInterval(checkGracePeriod, 10_000);
        return () => clearInterval(interval);
    }, [startDate]);

    return isInGracePeriod;
};
