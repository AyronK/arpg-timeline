"use client";

import { Description } from "@radix-ui/react-toast";
import { Filter, Settings } from "lucide-react";
import { title } from "process";

import { GameFiltersProps } from "@/components/GameFilters";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import { DashboardTag } from "@/lib/cms/gameTags";
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
import { DashboardSelector } from "./DashboardSelector";

type MobileBottomMenuProps = {
    dashboard: DashboardTag;
    onLoadingChange: (loading: boolean) => void;
    filtersProps: GameFiltersProps;
};

export function MobileBottomMenu({
    filtersProps,
    dashboard,
    onLoadingChange,
}: MobileBottomMenuProps) {
    const { isMd } = useBreakpoint("md");
    return (
        <>
            <div className="fixed right-0 bottom-0 left-0 z-50 md:hidden">
                <div className="bg-background border-t">
                    <div className="flex items-center justify-around p-2">
                        <Drawer direction={isMd ? "right" : "bottom"}>
                            <DrawerTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="flex h-auto flex-col items-center gap-1 px-3 py-2"
                                >
                                    <Settings className="h-5 w-5" />
                                    <span className="text-xs">Dashboard</span>
                                </Button>
                            </DrawerTrigger>
                            <DrawerContent className={!isMd ? "left-0" : undefined}>
                                <DrawerHeader>
                                    <DrawerTitle>Select Dashboard</DrawerTitle>
                                </DrawerHeader>
                                <div className="mt-auto flex flex-col gap-6 overflow-auto px-6 pb-24">
                                    <DashboardSelector
                                        dashboard={dashboard}
                                        onLoadingChange={onLoadingChange}
                                        isMobile
                                    />
                                </div>
                                <DrawerFooter className="absolute right-0 bottom-0 md:relative">
                                    <div className="ml-auto md:mr-auto md:ml-0">
                                        <DrawerClose asChild>
                                            <Button
                                                className="shadow-md shadow-black md:shadow-none"
                                                variant="outline"
                                            >
                                                Close
                                            </Button>
                                        </DrawerClose>
                                    </div>
                                </DrawerFooter>
                            </DrawerContent>
                        </Drawer>

                        <Drawer direction={isMd ? "right" : "bottom"}>
                            <DrawerTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="flex h-auto flex-col items-center gap-1 px-3 py-2"
                                >
                                    <Filter className="h-5 w-5" />
                                    <span className="text-xs">Filters</span>
                                </Button>
                            </DrawerTrigger>
                            <DrawerContent className={!isMd ? "left-0" : undefined}>
                                <DrawerDescription className="sr-only">
                                    Filters dialog
                                </DrawerDescription>
                                <DrawerHeader>
                                    <DrawerTitle>{title}</DrawerTitle>
                                    <DrawerDescription asChild>
                                        <Description />
                                    </DrawerDescription>
                                </DrawerHeader>
                                <Filters
                                    checked={filtersProps.activeFilters}
                                    filters={filtersProps.gameFilters}
                                    onCheckedChange={filtersProps.toggleGameFilter}
                                    onGroupCheckedChange={filtersProps.toggleGroupFilter}
                                />
                                <DrawerFooter className="absolute right-0 bottom-0 md:relative">
                                    <div className="ml-auto md:mr-auto md:ml-0">
                                        <DrawerClose asChild>
                                            <Button
                                                className="shadow-md shadow-black md:shadow-none"
                                                variant="outline"
                                            >
                                                Close
                                            </Button>
                                        </DrawerClose>
                                    </div>
                                </DrawerFooter>
                            </DrawerContent>
                        </Drawer>
                    </div>
                </div>
            </div>
        </>
    );
}
