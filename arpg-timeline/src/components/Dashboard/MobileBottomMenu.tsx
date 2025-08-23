"use client";
import { Description } from "@radix-ui/react-toast";
import { ChartGantt, Filter, Share2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { title } from "process";
import { useEffect, useState } from "react";

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
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/ui/DropdownMenu";

import { Filters } from "../FiltersDialog";
import { DashboardConfig } from "./DashboardConfig";
import { DashboardSelector } from "./DashboardSelector";

type MobileBottomMenuProps = {
    filtersProps: GameFiltersProps;
    dashboard: DashboardTag;
    onLoadingChange: (loading: boolean) => void;
    shownGames: number;
    totalGames: number;
};

export function MobileBottomMenu({
    filtersProps,
    dashboard,
    onLoadingChange,
    shownGames,
    totalGames,
}: MobileBottomMenuProps) {
    const { isMd } = useBreakpoint("md");
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: "ARPG Timeline",
                    text: `Check out this ARPG timeline dashboard: ${dashboard}`,
                    url: window.location.href,
                });
            } catch (error) {
                if (error instanceof Error && error.name !== "AbortError") {
                    console.error("Error sharing:", error);
                }
            }
        } else {
            navigator.clipboard.writeText(window.location.href);
        }
    };

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
            <div className="fixed right-0 bottom-0 left-0 z-[60] md:hidden">
                <div
                    className={`transition-all duration-300 ease-in-out ${
                        isVisible ? "translate-none" : "pointer-events-none translate-y-[96px]"
                    }`}
                >
                    <div className="relative">
                        <div className="bg-background border-t border-slate-500">
                            <div className="flex items-center justify-between p-2">
                                <div className="flex flex-1 justify-around">
                                    <Button variant={"ghost"} asChild className="px-2 2xl:px-4">
                                        <Link
                                            href={"discord TODO"}
                                            rel="external noopener noreferrer"
                                            target="_blank"
                                            data-sa-click="click"
                                        >
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="flex flex-col items-center gap-1 text-gray-300 hover:bg-transparent hover:text-blue-400"
                                            >
                                                <Image
                                                    src="/assets/discord-logo.svg"
                                                    className="h-5 w-5 brightness-200 grayscale-100"
                                                    alt="Discord logo"
                                                    width={20}
                                                    height={20}
                                                />
                                                <span className="text-[0.65rem] leading-2 font-medium">
                                                    Discord
                                                </span>
                                            </Button>
                                        </Link>
                                    </Button>
                                    <Button variant={"ghost"} asChild className="px-2 2xl:px-4">
                                        <Link
                                            href={"patreon TODO"}
                                            rel="noopener"
                                            target="_blank"
                                            data-sa-click="patron"
                                        >
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="flex flex-col items-center gap-1 text-gray-300 hover:bg-transparent hover:text-blue-400"
                                            >
                                                <Image
                                                    src="/assets/patreon-logo.png"
                                                    className="h-5 w-5 brightness-200 grayscale-100"
                                                    alt="Patreon logo"
                                                    width={22}
                                                    height={22}
                                                />
                                                <span className="text-[0.65rem] leading-2 font-medium">
                                                    Donate
                                                </span>
                                            </Button>
                                        </Link>
                                    </Button>
                                </div>

                                <div className="w-20" />

                                <div className="flex flex-1 justify-around">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={handleShare}
                                        className="flex flex-col items-center gap-1 text-gray-300 hover:bg-transparent hover:text-blue-400"
                                    >
                                        <Share2 className="h-5 w-5" />
                                        <span className="text-[0.65rem] leading-2 font-medium">
                                            Share
                                        </span>
                                    </Button>
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
                                                <div className="relative">
                                                    <Filter className="h-5 w-5" />
                                                    {filtersProps.gameFilters.length !==
                                                        filtersProps.activeFilters.length && (
                                                        <div className="bg-warning absolute -top-1 -right-1 h-2 w-2 rounded-full"></div>
                                                    )}
                                                </div>
                                                <span className="text-[0.65rem] leading-2 font-medium">
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
                                                onGroupCheckedChange={
                                                    filtersProps.toggleGroupFilter
                                                }
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

                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                            <DropdownMenu>
                                <DropdownMenuContent
                                    className="w-screen rounded-b-none! border-2 border-slate-500 bg-gray-800 p-2 pb-6! shadow-2xl"
                                    side="top"
                                    align="center"
                                    sideOffset={-32}
                                    collisionPadding={0}
                                >
                                    <div className="mb-2 text-center">
                                        <h3 className="text-sm font-medium text-white">
                                            Select Dashboard
                                        </h3>
                                    </div>
                                    <DashboardSelector
                                        dashboard={dashboard}
                                        onLoadingChange={onLoadingChange}
                                        isMobile
                                    />
                                </DropdownMenuContent>
                                <DropdownMenuTrigger asChild>
                                    <Button className="flex h-11 w-11 rotate-45 transform flex-col items-center justify-center border-2 border-slate-500 bg-gray-800 hover:bg-gray-700">
                                        <div className="-rotate-45 transform">
                                            {(() => {
                                                const config = DashboardConfig[dashboard];
                                                const IconComponent = config?.icon;
                                                return IconComponent ? (
                                                    <IconComponent className="h-6 w-6 text-white" />
                                                ) : (
                                                    <ChartGantt className="h-6 w-6 text-white" />
                                                );
                                            })()}
                                        </div>
                                    </Button>
                                </DropdownMenuTrigger>
                            </DropdownMenu>
                            <div className="absolute top-full left-1/2 mt-3 -translate-x-1/2 text-center">
                                <div className="text-xs font-medium text-nowrap text-gray-300">
                                    {shownGames} of {totalGames}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
