const STORAGE_KEY = "arpg-timeline-game-filters";

export interface GameFiltersStorage {
    excludedSlugs: string[];
    category: string;
}

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
    } catch {
        // Silently fail if storage is not available
    }
};

export const clearStoredFilters = (): void => {
    if (typeof window === "undefined") return;

    try {
        localStorage.removeItem(STORAGE_KEY);
    } catch {
        // Silently fail if storage is not available
    }
};
