"use client";

import { SanityImageAssetDocument } from "next-sanity";

import ErrorBoundary from "@/components/ErrorBoundary";
import { FiltersDialog } from "@/components/FiltersDialog";
import { WidgetDiedFallback } from "@/components/WidgetDiedFallback";

export type GameFiltersProps = {
    gameFilters: {
        label: string;
        value: string;
        group: string;
        logo?: SanityImageAssetDocument;
    }[];
    toggleGameFilter: (slug: string, value: boolean) => void;
    toggleGroupFilter: (group: string, value: boolean) => void;
    activeFilters: string[];
    disabled?: boolean;
    isFiltersOpen: boolean;
    setFiltersOpen: (open: boolean) => void;
};

export const GameFilters = ({
    activeFilters,
    gameFilters,
    toggleGameFilter,
    toggleGroupFilter,
    disabled = false,
    isFiltersOpen,
    setFiltersOpen,
}: GameFiltersProps) => (
    <div className="">
        <ErrorBoundary fallback={<WidgetDiedFallback />}>
            <FiltersDialog
                checked={activeFilters}
                filters={gameFilters}
                onCheckedChange={toggleGameFilter}
                onGroupCheckedChange={toggleGroupFilter}
                disabled={disabled}
                open={isFiltersOpen}
                onOpenChange={setFiltersOpen}
            />
        </ErrorBoundary>
    </div>
);
