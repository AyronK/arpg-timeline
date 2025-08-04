"use client";

import { useEffect } from "react";

import { sa_event } from "@/lib/sa_event";

export const SimpleAnalytics = () => {
    useEffect(() => {
        const listener = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const saClickSource = target.dataset.saClick;
            if (!saClickSource) {
                return;
            }

            sa_event(`${saClickSource}-click`);
        };

        document.addEventListener("click", listener);

        return () => document.removeEventListener("click", listener);
    }, []);

    return null;
};
