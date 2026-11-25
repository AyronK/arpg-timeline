import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

import { parseToValidHtmlId } from "@/lib/parseToValidHtmlId";

export const HIGHLIGHT_PARAM = "highlight";

const HIGHLIGHT_MS = 1600;
const MAX_WAIT_FRAMES = 120;
const SCROLL_FALLBACK_MS = 1000;

export const getGameCardId = (slug: string) => parseToValidHtmlId(`game-card-${slug}`);

export const highlightGameCard = (slug: string) => {
    let frame = 0;
    let attempts = 0;

    const tryHighlight = () => {
        const card = document.getElementById(getGameCardId(slug));
        if (!card) {
            if (++attempts < MAX_WAIT_FRAMES) {
                frame = requestAnimationFrame(tryHighlight);
            }
            return;
        }
        const flash = () => {
            card.dataset.highlighted = "";
            window.setTimeout(() => delete card.dataset.highlighted, HIGHLIGHT_MS);
        };
        const { top, bottom } = card.getBoundingClientRect();
        if (top >= 0 && bottom <= window.innerHeight) {
            flash();
            return;
        }
        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        card.scrollIntoView({ block: "center", behavior: reduceMotion ? "auto" : "smooth" });
        if (reduceMotion) {
            flash();
            return;
        }
        let hasFlashed = false;
        const flashOnce = () => {
            if (!hasFlashed) {
                hasFlashed = true;
                window.removeEventListener("scrollend", flashOnce);
                flash();
            }
        };
        window.addEventListener("scrollend", flashOnce, { once: true });
        window.setTimeout(flashOnce, SCROLL_FALLBACK_MS);
    };

    frame = requestAnimationFrame(tryHighlight);
    return () => cancelAnimationFrame(frame);
};

export const useHighlightGame = () => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const slug = searchParams.get(HIGHLIGHT_PARAM);
    const cancelRef = useRef<(() => void) | null>(null);

    useEffect(() => () => cancelRef.current?.(), []);

    useEffect(() => {
        if (!slug) {
            return;
        }
        // Not cancelled by the param removal below, only by a newer highlight or unmount
        cancelRef.current?.();
        cancelRef.current = highlightGameCard(slug);
        const params = new URLSearchParams(searchParams.toString());
        params.delete(HIGHLIGHT_PARAM);
        const query = params.toString();
        router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    }, [slug, searchParams, pathname, router]);
};
