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
    <div className="fixed right-8 bottom-8 z-50 xl:sticky xl:top-0 xl:order-first xl:col-span-full xl:h-0">
        <div className="xl:absolute xl:top-6 xl:-right-16">
            <ErrorBoundary fallback={<WidgetDiedFallback />}>
                <FiltersDialog
                    checked={activeFilters}
                    filters={gameFilters}
                    onCheckedChange={toggleGameFilter}
                    onGroupCheckedChange={toggleGroupFilter}
                />
            </ErrorBoundary>
        </div>
    </div>
);
