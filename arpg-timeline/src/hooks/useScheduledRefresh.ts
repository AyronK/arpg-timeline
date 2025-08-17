import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

interface UseScheduledRefreshOptions {
    /** The target date/time when the refresh should occur */
    targetDate: Date;
    /** Optional callback to execute before refresh (called 5 seconds early) */
    onBeforeRefresh?: () => void;
    /** Optional callback to execute at refresh */
    onRefresh?: () => void;
}

/**
 * Custom hook that automatically refreshes the page at a specified date/time
 * using Next.js router.refresh()
 */
export const useScheduledRefresh = ({
    targetDate,
    onBeforeRefresh,
    onRefresh,
}: UseScheduledRefreshOptions) => {
    const router = useRouter();
    const beforeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const refreshTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const now = new Date();
        const timeUntilRefresh = targetDate.getTime() - now.getTime();

        if (timeUntilRefresh <= 0) {
            return;
        }

        const timeUntilBeforeCallback = timeUntilRefresh - 2000;
        if (timeUntilBeforeCallback > 0) {
            beforeTimeoutRef.current = setTimeout(() => {
                onBeforeRefresh?.();
            }, timeUntilBeforeCallback);
        } else {
            onBeforeRefresh?.();
        }

        refreshTimeoutRef.current = setTimeout(() => {
            onRefresh?.();
            router.refresh();
        }, timeUntilRefresh);

        return () => {
            if (beforeTimeoutRef.current) {
                clearTimeout(beforeTimeoutRef.current);
            }
            if (refreshTimeoutRef.current) {
                clearTimeout(refreshTimeoutRef.current);
            }
        };
    }, [targetDate, router, onBeforeRefresh, onRefresh]);

    useEffect(() => {
        return () => {
            if (beforeTimeoutRef.current) {
                clearTimeout(beforeTimeoutRef.current);
            }
            if (refreshTimeoutRef.current) {
                clearTimeout(refreshTimeoutRef.current);
            }
        };
    }, []);

    return {
        /** Time remaining until refresh in milliseconds */
        getTimeRemaining: () => {
            const now = new Date();
            return Math.max(0, targetDate.getTime() - now.getTime());
        },

        /** Cancel the scheduled refresh */
        cancel: () => {
            if (beforeTimeoutRef.current) {
                clearTimeout(beforeTimeoutRef.current);
                beforeTimeoutRef.current = null;
            }
            if (refreshTimeoutRef.current) {
                clearTimeout(refreshTimeoutRef.current);
                refreshTimeoutRef.current = null;
            }
        },
    };
};
