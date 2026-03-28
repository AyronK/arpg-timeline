const STORAGE_KEY = "arpg-timeline-game-filters";
const ANALYTICS_STORAGE_KEY = "arpg-timeline-game-filters-custom-filters-seen";

export interface GameFiltersStorage {
    excludedSlugs: string[];
    category: string;
}

export const getCustomFiltersSeen = (): boolean => {
    if (typeof window === "undefined") return false;
    try {
        return localStorage.getItem(ANALYTICS_STORAGE_KEY) === "1";
    } catch {
        return false;
    }
};

export const setCustomFiltersSeen = (): void => {
    if (typeof window === "undefined") return;
    try {
        localStorage.setItem(ANALYTICS_STORAGE_KEY, "1");
    } catch {
        // Silently fail if storage is not available
    }
};

export const getStoredFilters = (): GameFiltersStorage | null => {
    if (typeof window === "undefined") return null;

    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : null;
    } catch {
        return null;
    }
};

export const setStoredFilters = (filters: GameFiltersStorage): void => {
    if (typeof window === "undefined") return;

    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filters));
        localStorage.removeItem(ANALYTICS_STORAGE_KEY);
    } catch {
        // Silently fail if storage is not available
    }
};

export const clearStoredFilters = (): void => {
    if (typeof window === "undefined") return;

    try {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(ANALYTICS_STORAGE_KEY);
    } catch {
        // Silently fail if storage is not available
    }
};
