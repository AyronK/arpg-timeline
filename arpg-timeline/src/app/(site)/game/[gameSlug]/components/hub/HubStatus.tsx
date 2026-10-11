"use client";

import { useHasMounted } from "@react-hooks-library/core";

import { buildHubStatus } from "../../hub";

type StatusGame = Parameters<typeof buildHubStatus>[0];

const formatDate = (iso: string) => {
    const date = new Date(iso);
    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        ...(date.getFullYear() !== new Date().getFullYear() && { year: "numeric" }),
    });
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

    return <p className={className}>{buildHubStatus(game, new Date(), formatDate).join(" · ")}</p>;
};
