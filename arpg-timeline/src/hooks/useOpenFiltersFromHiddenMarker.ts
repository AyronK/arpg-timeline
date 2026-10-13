import { useCallback } from "react";

import { useGameFilterContext } from "@/contexts/GameFilterContext";
import { sa_event } from "@/lib/sa_event";

export const useOpenFiltersFromHiddenMarker = () => {
    const { setFiltersOpen } = useGameFilterContext();
    return useCallback(
        (eventProps: Record<string, string | number>) => {
            sa_event("hidden_marker_opened", eventProps);
            setFiltersOpen(true);
        },
        [setFiltersOpen],
    );
};
