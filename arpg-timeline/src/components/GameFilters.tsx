"use client";

import ErrorBoundary from "@/components/ErrorBoundary";
import { FiltersDialog } from "@/components/FiltersDialog";
import { WidgetDiedFallback } from "@/components/WidgetDiedFallback";

export type GameFiltersProps = {
    gameFilters: {
        label: string;
        value: string;
        group: string;
    }[];
    toggleGameFilter: (slug: string, value: boolean) => void;
    toggleGroupFilter: (group: string, value: boolean) => void;
    activeFilters: string[];
};

export const GameFilters = ({
    activeFilters,
    gameFilters,
    toggleGameFilter,
    toggleGroupFilter,
}: GameFiltersProps) => (
    <div className="">
        <ErrorBoundary fallback={<WidgetDiedFallback />}>
            <FiltersDialog
                checked={activeFilters}
                filters={gameFilters}
                onCheckedChange={toggleGameFilter}
                onGroupCheckedChange={toggleGroupFilter}
            />
        </ErrorBoundary>
    </div>
);
