const PING_KEY = "arpg-timeline-filter-ping-seen";
const HINT_KEY = "arpg-timeline-filter-hint-dismissed";

export const getFilterPingSeen = (): boolean => {
    if (typeof window === "undefined") return true;
    try {
        return localStorage.getItem(PING_KEY) === "1";
    } catch {
        return true;
    }
};

export const setFilterPingSeen = (): void => {
    if (typeof window === "undefined") return;
    try {
        localStorage.setItem(PING_KEY, "1");
    } catch {
        // Silently fail if storage is not available
    }
};

export const getFilterHintDismissed = (): boolean => {
    if (typeof window === "undefined") return true;
    try {
        return localStorage.getItem(HINT_KEY) === "1";
    } catch {
        return true;
    }
};

export const setFilterHintDismissed = (): void => {
    if (typeof window === "undefined") return;
    try {
        localStorage.setItem(HINT_KEY, "1");
    } catch {
        // Silently fail if storage is not available
    }
};
