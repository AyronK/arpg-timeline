import { Description } from "@radix-ui/react-toast";
import { Filter, Newspaper, X } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { GameFiltersProps } from "@/components/GameFilters";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import { GameFilterCategory } from "@/lib/cms/gameTags";
import { cn } from "@/lib/utils";
import { Button } from "@/ui/Button";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/ui/Drawer";

import { Filters } from "../FiltersDialog";

const title = "Choose your games";

interface MobileBottomMenuFiltersProps {
    filtersProps: GameFiltersProps;
    category: GameFilterCategory;
    isFiltersDisabled?: boolean;
    onDrawerOpenChange: (open: boolean) => void;
}

export function MobileBottomMenuFilters({
    filtersProps,
    isFiltersDisabled = false,
    onDrawerOpenChange,
}: MobileBottomMenuFiltersProps) {
    const { isMd } = useBreakpoint("md");
    const searchParams = useSearchParams();

    const currentParams = searchParams.toString();
    const newsHref = currentParams ? `/games/news?${currentParams}` : "/games/news";

    return (
        <div className="flex flex-1 justify-around">
            <Link
                href={newsHref}
                className={cn(
                    "flex flex-col items-center gap-1 text-gray-300 hover:bg-transparent hover:text-blue-400",
                )}
                data-sa-click="news"
            >
                <Newspaper className="h-5 w-5" />
                <span className="text-[0.65rem] leading-2 font-medium">News</span>
            </Link>
            <Drawer direction={isMd ? "right" : "bottom"} onOpenChange={onDrawerOpenChange}>
                <DrawerTrigger asChild>
                    <Button
                        variant="ghost"
                        size="sm"
                        disabled={isFiltersDisabled}
                        className="flex flex-col items-center gap-1 text-gray-300 hover:bg-transparent hover:text-blue-400"
                        data-sa-click="filters"
                    >
                        <div className="relative">
                            <Filter className="h-5 w-5" />
                            {filtersProps.gameFilters.length !==
                                filtersProps.activeFilters.length &&
                                !isFiltersDisabled && (
                                    <div className="bg-warning absolute -top-1 -right-1 h-2 w-2 rounded-full"></div>
                                )}
                        </div>
                        <span className="text-[0.65rem] leading-2 font-medium">Filters</span>
                    </Button>
                </DrawerTrigger>
                <DrawerContent className={!isMd ? "left-0" : undefined}>
                    <DrawerDescription className="sr-only">Filters dialog</DrawerDescription>
                    <DrawerHeader className="border-border border-b pt-3! pb-3">
                        <DrawerTitle>{title}</DrawerTitle>
                        <DrawerDescription asChild>
                            <Description />
                        </DrawerDescription>
                    </DrawerHeader>
                    <div className="overflow-y-auto pt-3">
                        <Filters
                            checked={filtersProps.activeFilters}
                            filters={filtersProps.gameFilters}
                            onCheckedChange={filtersProps.toggleGameFilter}
                            onGroupCheckedChange={filtersProps.toggleGroupFilter}
                            disabled={isFiltersDisabled}
                        />
                    </div>
                    <DrawerFooter className="bg-background absolute right-0 bottom-0 left-0 z-50 h-14 border-t border-slate-500 p-0!">
                        <DrawerClose asChild>
                            <Button className="h-14! flex-1" variant="ghost">
                                <X className="mr-2 h-4 w-4" />
                                Close
                            </Button>
                        </DrawerClose>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </div>
    );
}
