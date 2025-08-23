"use client";

import { useEffect, useState } from "react";

import { Description } from "@radix-ui/react-toast";
import { Filter, ChartGantt, Home, Settings, Search } from "lucide-react";
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
                    className={`transition-all duration-300 ease-in-out ${
                        isVisible ? "translate-none" : "pointer-events-none translate-y-[96px]"
                    }`}
                >
                    <div className="relative">
                        <div className="border-t border-gray-700 bg-gray-900">
                            <div className="flex items-center justify-around px-4 py-3">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="flex flex-col items-center gap-1 text-gray-300 hover:bg-transparent hover:text-blue-400"
                                >
                                    <Home className="h-5 w-5" />
                                    <span className="text-[0.65rem] font-medium">Home</span>
                                </Button>

                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="flex flex-col items-center gap-1 text-gray-300 hover:bg-transparent hover:text-blue-400"
                                >
                                    <Search className="h-5 w-5" />
                                    <span className="text-[0.65rem] font-medium">Search</span>
                                </Button>

                                <div className="w-16" />

                                <Drawer
                                    direction={isMd ? "right" : "bottom"}
                                    onOpenChange={handleDrawerOpenChange}
                                >
                                    <DrawerTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="flex flex-col items-center gap-1 text-gray-300 hover:bg-transparent hover:text-blue-400"
                                        >
                                            <Filter className="h-5 w-5" />
                                            <span className="text-[0.65rem] font-medium">
                                                Filters
                                            </span>
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

                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="flex flex-col items-center gap-1 text-gray-300 hover:bg-transparent hover:text-blue-400"
                                >
                                    <Settings className="h-5 w-5" />
                                    <span className="text-[0.65rem] font-medium">Settings</span>
                                </Button>
                            </div>
                        </div>

                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                            <Drawer
                                direction={isMd ? "right" : "bottom"}
                                onOpenChange={handleDrawerOpenChange}
                            >
                                <DrawerTrigger asChild>
                                    <Button className="flex h-11 w-11 rotate-45 transform flex-col items-center justify-center border-2 border-gray-600 bg-gray-800 hover:bg-gray-700">
                                        <div className="-rotate-45 transform">
                                            <ChartGantt className="h-5 w-5 text-white" />
                                        </div>
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
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
