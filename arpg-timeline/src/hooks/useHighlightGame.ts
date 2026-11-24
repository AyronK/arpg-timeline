import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

import { parseToValidHtmlId } from "@/lib/parseToValidHtmlId";

export const HIGHLIGHT_PARAM = "highlight";

const HIGHLIGHT_MS = 1600;
const MAX_WAIT_FRAMES = 120;

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
        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        card.scrollIntoView({ block: "center", behavior: reduceMotion ? "auto" : "smooth" });
        card.dataset.highlighted = "";
        window.setTimeout(() => delete card.dataset.highlighted, HIGHLIGHT_MS);
    };

    frame = requestAnimationFrame(tryHighlight);
    return () => cancelAnimationFrame(frame);
};

export const useHighlightGame = () => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const slug = searchParams.get(HIGHLIGHT_PARAM);

    useEffect(() => {
        if (!slug) {
            return;
        }
        const cancel = highlightGameCard(slug);
        const params = new URLSearchParams(searchParams.toString());
        params.delete(HIGHLIGHT_PARAM);
        const query = params.toString();
        router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
        return cancel;
    }, [slug, searchParams, pathname, router]);
};
