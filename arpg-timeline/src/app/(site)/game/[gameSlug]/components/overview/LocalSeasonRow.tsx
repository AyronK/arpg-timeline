"use client";

import { useHasMounted } from "@react-hooks-library/core";

import { formatSeasonRow } from "../../overview";
import { ArchivalSeason } from "../../types";

// Server renders UTC; the browser's local dates replace it after mount, as on Timeline.
export const LocalSeasonRow = ({
    season,
}: {
    season: Pick<ArchivalSeason, "startDate" | "endDate" | "duration">;
}) => {
    const hasMounted = useHasMounted();
    return <>{formatSeasonRow(season, hasMounted)}</>;
};
