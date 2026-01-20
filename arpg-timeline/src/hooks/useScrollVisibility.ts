import { useEffect, useState } from "react";

interface UseScrollVisibilityOptions {
    threshold: number;
    hideThreshold: number;
    isDrawerOpen?: boolean;
}

export function useScrollVisibility({
    threshold = 100,
    hideThreshold = 150,
    isDrawerOpen = false,
}: UseScrollVisibilityOptions) {
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    useEffect(() => {
        let ticking = false;

        const handleScroll = () => {
            if (!ticking && !isDrawerOpen) {
                requestAnimationFrame(() => {
                    const currentScrollY = window.scrollY;

                    if (currentScrollY > lastScrollY && currentScrollY > hideThreshold) {
                        setIsVisible(false);
                    } else if (currentScrollY < lastScrollY || currentScrollY < threshold) {
                        setIsVisible(true);
                    }

                    setLastScrollY(currentScrollY);
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, [lastScrollY, isDrawerOpen, threshold, hideThreshold]);

    const forceVisible = () => setIsVisible(true);

    return { isVisible, forceVisible };
}
