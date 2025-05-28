import ErrorBoundary from "@/components/ErrorBoundary";
import { FiltersDialog } from "@/components/FiltersDialog";
import { WidgetDiedFallback } from "@/components/WidgetDiedFallback";

export const GameFilters = ({
  activeFilters,
  gameFilters,
  toggleGameFilter,
  toggleGroupFilter,
}: {
  gameFilters: {
    label: string;
    value: string;
    group: string;
  }[];
  toggleGameFilter: (slug: string, value: boolean) => void;
  toggleGroupFilter: (group: string, value: boolean) => void;
  activeFilters: string[];
}) => (
  <div className="fixed right-8 bottom-8 z-50 xl:sticky xl:top-0 xl:right-0 xl:left-0 xl:h-0">
    <div className="xl:absolute xl:-right-4 xl:ml-auto xl:translate-x-full xl:translate-y-[16px]">
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
