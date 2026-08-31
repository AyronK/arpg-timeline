"use client";

import { useSyncExternalStore } from "react";

const noop = () => () => {};

const format = (iso: string, timeZone?: string) =>
    new Intl.DateTimeFormat(timeZone ? "en-US" : undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
        ...(timeZone ? { timeZone } : {}),
    }).format(new Date(iso));

/**
 * Renders a UTC ISO timestamp in the visitor's own locale + timezone. The SSR /
 * first-paint value is a deterministic UTC render (so hydration matches); after
 * mount it switches to the browser's locale. `<time dateTime>` keeps the UTC ISO
 * for crawlers.
 */
export const ArticleDate = ({ iso }: { iso: string }) => {
    const isClient = useSyncExternalStore(
        noop,
        () => true,
        () => false,
    );

    return (
        <time dateTime={iso} suppressHydrationWarning>
            {isClient ? format(iso) : format(iso, "UTC")}
        </time>
    );
};
