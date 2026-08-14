"use client";
import { useEffect, useState } from "react";

import { DAY } from "@/lib/date";
import { inGracePeriod } from "@/lib/games/sortBySeasons";

const WEEK = DAY * 7;

const computeShouldEmphasize = (
    nextSeasonStartDate: string | null | undefined,
    nextSeasonConfirmed: boolean | null | undefined,
    currentSeasonStartDate: string | null | undefined,
    currentSeasonEndDate: string | null | undefined,
): boolean => {
    // Persists through the grace period, so players hunting for the new season's builds right
    // after launch still see it emphasized, not just in the run-up to the start date.
    if (inGracePeriod(currentSeasonStartDate, currentSeasonEndDate)) {
        return true;
    }
    if (!nextSeasonConfirmed || !nextSeasonStartDate) {
        return false;
    }
    const msUntilStart = new Date(nextSeasonStartDate).getTime() - Date.now();
    return msUntilStart >= 0 && msUntilStart < WEEK;
};

/**
 * Whether the "Builds" footer button should be visually emphasized: the next season's date is
 * confirmed (exact time may still be unknown) and under a week away, or the current season is
 * still within its grace period after launch. Polls like `useInGracePeriod` since this is a
 * time-based condition that needs to update without new props arriving.
 */
export const useEmphasizeBuilds = (
    nextSeasonStartDate: string | null | undefined,
    nextSeasonConfirmed: boolean | null | undefined,
    currentSeasonStartDate: string | null | undefined,
    currentSeasonEndDate: string | null | undefined,
): boolean => {
    const [shouldEmphasize, setShouldEmphasize] = useState(false);

    useEffect(() => {
        const check = () =>
            setShouldEmphasize(
                computeShouldEmphasize(
                    nextSeasonStartDate,
                    nextSeasonConfirmed,
                    currentSeasonStartDate,
                    currentSeasonEndDate,
                ),
            );
        check();
        const interval = setInterval(check, 10_000);
        return () => clearInterval(interval);
    }, [nextSeasonStartDate, nextSeasonConfirmed, currentSeasonStartDate, currentSeasonEndDate]);

    return shouldEmphasize;
};
