import { Description } from "@radix-ui/react-toast";
import { Filter, Share2, X } from "lucide-react";

import { GameFiltersProps } from "@/components/GameFilters";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import { useShareAction } from "@/hooks/useShareAction";
import { GameFilterCategory } from "@/lib/cms/gameTags";
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
    category,
    isFiltersDisabled = false,
    onDrawerOpenChange,
}: MobileBottomMenuFiltersProps) {
    const { isMd } = useBreakpoint("md");
    const { handleShare } = useShareAction(null, {
        utm_source: "arpg-timeline",
        utm_medium: "mobile_menu",
        utm_campaign: "share",
        utm_content: category,
    });

    return (
        <div className="flex flex-1 justify-around">
            <Button
                variant="ghost"
                size="sm"
                onClick={() => handleShare()}
                className="flex flex-col items-center gap-1 text-gray-300 hover:bg-transparent hover:text-blue-400"
                data-sa-click="share"
            >
                <Share2 className="h-5 w-5" />
                <span className="text-[0.65rem] leading-2 font-medium">Share</span>
            </Button>
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
                    <DrawerFooter className="bg-background absolute right-0 bottom-0 left-0 h-14 border-t border-slate-500 p-0!">
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
