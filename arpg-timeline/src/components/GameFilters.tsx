"use client";

import ErrorBoundary from "@/components/ErrorBoundary";
import { FiltersDialog } from "@/components/FiltersDialog";
import { WidgetDiedFallback } from "@/components/WidgetDiedFallback";
import { useGameFilters } from "@/hooks/dashboardConfig/GameFiltersContext";

export const GameFilters = () => {
    const { filteredGames, filters, setGameFilter, setGroupFilter } = useGameFilters();
    return (
        <div className="fixed right-8 bottom-8 z-50 xl:sticky xl:top-0 xl:order-first xl:col-span-full xl:h-0">
            <div className="xl:absolute xl:top-6 xl:-right-16">
                <ErrorBoundary fallback={<WidgetDiedFallback />}>
                    <FiltersDialog
                        checked={filteredGames.map((f) => f.slug)}
                        filters={filters}
                        onCheckedChange={setGameFilter}
                        onGroupCheckedChange={setGroupFilter}
                    />
                </ErrorBoundary>
            </div>
        </div>
    );
};
