"use client";

import { Plus, Star, X } from "lucide-react";
import Link from "next/link";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

import { HIGHLIGHT_PARAM } from "@/hooks/useHighlightGame";
import { getFeaturedExcludes, setFeaturedVisibility } from "@/lib/filters/filterState";
import { getStoredFilters, setStoredFilters } from "@/lib/storage/gameFiltersStorage";
import { cn } from "@/lib/utils";
import { toast } from "@/ui/hooks/useToast";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/ui/Tooltip";

type HubGame = { gameSlug: string; gameName: string; featuredPreset: string[] };

const HubGameContext = createContext<HubGame | null>(null);

export const HubGameProvider = ({ children, ...value }: HubGame & { children: ReactNode }) => (
    <HubGameContext.Provider value={value}>{children}</HubGameContext.Provider>
);

const rowClassName =
    "bg-card border-foreground/20 flex w-full items-center gap-3 rounded-lg border p-3";

const readIsShown = (slug: string, preset: string[]) =>
    !getFeaturedExcludes(getStoredFilters(), preset).includes(slug);

export const DashboardToggle = () => {
    const hubGame = useContext(HubGameContext);
    const [isShown, setIsShown] = useState<boolean | null>(null);

    useEffect(() => {
        if (!hubGame) return;
        const sync = () => setIsShown(readIsShown(hubGame.gameSlug, hubGame.featuredPreset));
        sync();
        window.addEventListener("storage", sync);
        return () => window.removeEventListener("storage", sync);
    }, [hubGame]);

    if (!hubGame) return null;
    const { gameSlug, gameName, featuredPreset } = hubGame;

    const setShown = (next: boolean) => {
        const excludes = getFeaturedExcludes(getStoredFilters(), featuredPreset);
        setStoredFilters({
            excludedSlugs: setFeaturedVisibility(excludes, gameSlug, next),
            category: "featured",
        });
        setIsShown(next);
        toast({
            title: next
                ? `${gameName} is now on your dashboard`
                : `${gameName} is hidden from your dashboard`,
            duration: 3000,
        });
    };

    if (isShown) {
        return (
            <div className={rowClassName}>
                <Star className="size-4 shrink-0 fill-current" aria-hidden />
                <span className="min-w-0 flex-1 text-xs leading-tight">
                    <span className="text-foreground block font-medium">
                        On your{" "}
                        <Link
                            href={`/?${HIGHLIGHT_PARAM}=${gameSlug}`}
                            data-sa-click={`${gameSlug}-hub-dashboard-open`}
                            className="underline underline-offset-2"
                        >
                            dashboard
                        </Link>
                    </span>
                    <span className="text-muted-foreground">Shown on the home page</span>
                </span>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <button
                            type="button"
                            onClick={() => setShown(false)}
                            aria-label={`Remove ${gameName} from your dashboard`}
                            data-sa-click={`${gameSlug}-hub-dashboard-hide`}
                            className="text-muted-foreground hover:text-foreground hover:bg-accent focus-visible:ring-ring -m-1 shrink-0 cursor-pointer rounded-md p-1 transition-colors focus-visible:ring-2 focus-visible:outline-hidden"
                        >
                            <X className="size-3.5" aria-hidden />
                        </button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">Remove from dashboard</TooltipContent>
                </Tooltip>
            </div>
        );
    }

    return (
        <button
            type="button"
            onClick={() => setShown(true)}
            disabled={isShown === null}
            data-sa-click={`${gameSlug}-hub-dashboard-show`}
            className={cn(
                rowClassName,
                "group hover:border-foreground/40 cursor-pointer text-left transition-all hover:shadow-sm",
                isShown === null && "invisible",
            )}
        >
            <Star className="size-4 shrink-0" aria-hidden />
            <span className="min-w-0 flex-1 text-xs leading-tight">
                <span className="text-foreground block font-medium">Add to dashboard</span>
                <span className="text-muted-foreground">Show it on the home page</span>
            </span>
            <Plus
                className="text-muted-foreground group-hover:text-foreground size-3.5 shrink-0 transition-colors"
                aria-hidden
            />
        </button>
    );
};
