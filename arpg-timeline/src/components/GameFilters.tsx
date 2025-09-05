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
};

export const GameFilters = ({
    activeFilters,
    gameFilters,
    toggleGameFilter,
    toggleGroupFilter,
    disabled = false,
}: GameFiltersProps) => (
    <div className="">
        <ErrorBoundary fallback={<WidgetDiedFallback />}>
            <FiltersDialog
                checked={activeFilters}
                filters={gameFilters}
                onCheckedChange={toggleGameFilter}
                onGroupCheckedChange={toggleGroupFilter}
                disabled={disabled}
            />
        </ErrorBoundary>
    </div>
);
