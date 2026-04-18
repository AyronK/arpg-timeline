const PING_KEY = "arpg-timeline-filter-ping-seen";
const HINT_KEY = "arpg-timeline-filter-hint-dismissed";
const ONBOARDING_KEY = "arpg-timeline-onboarding-seen";
const VISIT_COUNT_KEY = "arpg-timeline-visit-count";

export const ONBOARDING_VISIT_THRESHOLD = 3;

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

export const getOnboardingSeen = (): boolean => {
    if (typeof window === "undefined") return true;
    try {
        return localStorage.getItem(ONBOARDING_KEY) === "1";
    } catch {
        return true;
    }
};

export const setOnboardingSeen = (): void => {
    if (typeof window === "undefined") return;
    try {
        localStorage.setItem(ONBOARDING_KEY, "1");
    } catch {
        // Silently fail if storage is not available
    }
};

export const getVisitCount = (): number => {
    if (typeof window === "undefined") return 0;
    try {
        return parseInt(localStorage.getItem(VISIT_COUNT_KEY) ?? "0", 10);
    } catch {
        return 0;
    }
};

export const incrementVisitCount = (): number => {
    if (typeof window === "undefined") return 0;
    try {
        const current = parseInt(localStorage.getItem(VISIT_COUNT_KEY) ?? "0", 10);
        const next = current + 1;
        localStorage.setItem(VISIT_COUNT_KEY, String(next));
        return next;
    } catch {
        return 0;
    }
};
