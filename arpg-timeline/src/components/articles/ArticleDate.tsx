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

// Renders in the visitor's locale/timezone; deterministic UTC on the server so
// hydration matches. `<time dateTime>` keeps the raw ISO for crawlers.
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
