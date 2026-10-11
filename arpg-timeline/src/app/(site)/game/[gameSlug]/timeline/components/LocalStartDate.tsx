"use client";

import { useHasMounted } from "@react-hooks-library/core";

const LOCAL_DATE = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
});

// Server renders the UTC fallback; the browser's local date replaces it after mount.
export const LocalStartDate = ({ utcDate, fallback }: { utcDate: string; fallback: string }) => {
    const hasMounted = useHasMounted();

    return <>{hasMounted ? LOCAL_DATE.format(new Date(utcDate)) : fallback}</>;
};
