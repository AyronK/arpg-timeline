"use client";

import { useHasMounted } from "@react-hooks-library/core";

import { buildHubStatusLines } from "../../hub";

type StatusGame = Parameters<typeof buildHubStatusLines>[0];

// Non-breaking spaces keep "Dec 11" together when the line wraps
const formatDate = (iso: string) => {
    const date = new Date(iso);
    return date
        .toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            ...(date.getFullYear() !== new Date().getFullYear() && { year: "numeric" }),
        })
        .replace(/ /g, "\u00a0");
};

// Time-dependent, so rendered after mount to avoid stale ISR text.
export const HubStatus = ({ game }: { game: StatusGame }) => {
    const hasMounted = useHasMounted();
    const className = "text-muted-foreground text-sm";

    if (!hasMounted) {
        return (
            <p className={className} aria-hidden>
                &nbsp;
            </p>
        );
    }

    // Current and next each get a line on mobile; one "·" line from md up
    return (
        <p className={className}>
            {buildHubStatusLines(game, new Date(), formatDate).map((line, i) => (
                <span key={i} className="block md:inline">
                    {i > 0 && <span className="hidden md:inline"> · </span>}
                    {line.join(" · ")}
                </span>
            ))}
        </p>
    );
};
