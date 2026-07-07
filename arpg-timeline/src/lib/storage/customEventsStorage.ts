import { CustomEvent } from "@/types/customEvent";

const STORAGE_KEY = "arpg-timeline-custom-events";

export const getCustomEvents = (): CustomEvent[] => {
    if (typeof window === "undefined") return [];

    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch {
        return [];
    }
};

const setCustomEvents = (events: CustomEvent[]): void => {
    if (typeof window === "undefined") return;

    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
    } catch {
        // Silently fail if storage is not available
    }
};

export const addCustomEvent = (event: CustomEvent): CustomEvent[] => {
    const events = [...getCustomEvents(), event];
    setCustomEvents(events);
    return events;
};

export const removeCustomEvent = (id: string): CustomEvent[] => {
    const events = getCustomEvents().filter((event) => event.id !== id);
    setCustomEvents(events);
    return events;
};
