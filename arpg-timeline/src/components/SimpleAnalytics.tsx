"use client";

import { useEffect } from "react";

import { sa_event } from "@/lib/sa_event";

export const SimpleAnalytics = () => {
    useEffect(() => {
        if (typeof document === "undefined") {
            return;
        }

        const listener = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const saClickSource = target.dataset.saClick;
            if (!saClickSource) {
                return;
            }

            sa_event(`${saClickSource}-click`);
        };

        document.addEventListener("click", listener);

        return () => {
            if (typeof document !== "undefined") {
                document.removeEventListener("click", listener);
            }
        };
    }, []);

    return null;
};
