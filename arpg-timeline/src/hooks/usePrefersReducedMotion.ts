import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

const subscribe = (onChange: () => void) => {
    const media = window.matchMedia(QUERY);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
};

export const usePrefersReducedMotion = () =>
    useSyncExternalStore(
        subscribe,
        () => window.matchMedia(QUERY).matches,
        () => false,
    );
