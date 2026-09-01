"use client";

import { useEffect, useState } from "react";

const ACTIVE_OFFSET = 120;

export function useActiveHeading(ids: string[]): string | null {
    const key = ids.join("|");
    const [active, setActive] = useState<string | null>(ids[0] ?? null);

    useEffect(() => {
        if (ids.length === 0) return;

        let frame = 0;
        const compute = () => {
            frame = 0;
            let current = ids[0] ?? null;
            for (const id of ids) {
                const el = document.getElementById(id);
                if (!el) continue;
                if (el.getBoundingClientRect().top - ACTIVE_OFFSET <= 0) current = id;
                else break;
            }
            const atBottom =
                window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
            setActive(atBottom ? ids[ids.length - 1] : current);
        };

        const onScroll = () => {
            if (!frame) frame = requestAnimationFrame(compute);
        };

        compute();
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll);
        return () => {
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onScroll);
            if (frame) cancelAnimationFrame(frame);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [key]);

    return active;
}
