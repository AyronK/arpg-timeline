const KEY_PREFIX = "arpg-timeline-embed-consent-";
const CHANGE_EVENT = "arpg-timeline-embed-consent-change";

export const getEmbedConsent = (providerId: string): boolean => {
    if (typeof window === "undefined") return false;
    try {
        return localStorage.getItem(KEY_PREFIX + providerId) === "1";
    } catch {
        return false;
    }
};

export const setEmbedConsent = (providerId: string, allowed: boolean): void => {
    if (typeof window === "undefined") return;
    try {
        if (allowed) localStorage.setItem(KEY_PREFIX + providerId, "1");
        else localStorage.removeItem(KEY_PREFIX + providerId);
        window.dispatchEvent(new Event(CHANGE_EVENT));
    } catch {
        // Silently fail if storage is not available
    }
};

export const subscribeToEmbedConsent = (onChange: () => void): (() => void) => {
    window.addEventListener(CHANGE_EVENT, onChange);
    window.addEventListener("storage", onChange);
    return () => {
        window.removeEventListener(CHANGE_EVENT, onChange);
        window.removeEventListener("storage", onChange);
    };
};
