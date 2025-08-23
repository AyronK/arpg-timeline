"use client";

import { useEffect, useState } from "react";

import { Description } from "@radix-ui/react-toast";
import { Filter, ChartGantt } from "lucide-react";
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
    filtersProps: GameFiltersProps;
    dashboard: DashboardTag;
    onLoadingChange: (loading: boolean) => void;
};

export function MobileBottomMenu({
    filtersProps,
    dashboard,
    onLoadingChange,
}: MobileBottomMenuProps) {
    const { isMd } = useBreakpoint("md");
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    useEffect(() => {
        let ticking = false;

        const handleScroll = () => {
            if (!ticking && !isDrawerOpen) {
                requestAnimationFrame(() => {
                    const currentScrollY = window.scrollY;

                    if (currentScrollY > lastScrollY && currentScrollY > 150) {
                        setIsVisible(false);
                    } else if (currentScrollY < lastScrollY || currentScrollY < 100) {
                        setIsVisible(true);
                    }

                    setLastScrollY(currentScrollY);
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, [lastScrollY, isDrawerOpen]);

    const handleDrawerOpenChange = (open: boolean) => {
        setIsDrawerOpen(open);
        if (open) {
            setIsVisible(true);
        }
    };

    return (
        <>
            <div className="fixed right-0 bottom-0 left-0 z-50 md:hidden">
                <div
                    className={`bg-popover border-t shadow-xl transition-all duration-300 ease-in-out ${
                        isVisible ? "translate-none" : "pointer-events-none translate-y-full"
                    }`}
                >
                    <div className={`flex items-center justify-around px-12 py-1`}>
                        <Drawer
                            direction={isMd ? "right" : "bottom"}
                            onOpenChange={handleDrawerOpenChange}
                        >
                            <DrawerTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="flex h-10 flex-col items-center gap-0.5 px-2 py-1"
                                >
                                    <ChartGantt className="h-4 w-4" />
                                    <span className="text-[0.65rem]">Dashboard</span>
                                </Button>
                            </DrawerTrigger>
                            <DrawerContent className={!isMd ? "left-0" : undefined}>
                                <DrawerHeader className="pb-3">
                                    <DrawerTitle>Select Dashboard</DrawerTitle>
                                </DrawerHeader>
                                <div className="flex flex-col gap-3 overflow-auto px-4 pb-20">
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

                        <Drawer
                            direction={isMd ? "right" : "bottom"}
                            onOpenChange={handleDrawerOpenChange}
                        >
                            <DrawerTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="flex h-10 flex-col items-center gap-0.5 px-2 py-1"
                                >
                                    <Filter className="h-4 w-4" />
                                    <span className="text-[0.65rem]">Game Filter</span>
                                </Button>
                            </DrawerTrigger>
                            <DrawerContent className={!isMd ? "left-0" : undefined}>
                                <DrawerDescription className="sr-only">
                                    Filters dialog
                                </DrawerDescription>
                                <DrawerHeader className="pb-3">
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
