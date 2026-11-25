"use client";

import { Search } from "lucide-react";
import { MouseEvent, useSyncExternalStore } from "react";

import { prefetchSearchIndex } from "@/lib/search/loadSearchIndex";
import { cn } from "@/lib/utils";
import { Button } from "@/ui/Button";

import { preloadSearchPalette, useOptionalSearch } from "./SearchProvider";

export const SEARCH_TRIGGER_ATTRIBUTE = "data-search-trigger";

let clickedTrigger: HTMLElement | null = null;

export const takeClickedTrigger = () => {
    const trigger = clickedTrigger;
    clickedTrigger = null;
    return trigger;
};

const subscribeNoop = () => () => {};
const isApplePlatform = () => /Mac|iPhone|iPad|iPod/.test(navigator.userAgent);

const prefetch = () => {
    preloadSearchPalette();
    prefetchSearchIndex();
};

interface SearchTriggerProps {
    variant: "field" | "icon";
    className?: string;
}

export const SearchTrigger = ({ variant, className }: SearchTriggerProps) => {
    const search = useOptionalSearch();
    const isApple = useSyncExternalStore(subscribeNoop, isApplePlatform, () => null);

    if (!search) {
        return null;
    }

    const triggerProps = {
        type: "button" as const,
        "aria-label": "Search games and pages",
        "aria-haspopup": "dialog" as const,
        [SEARCH_TRIGGER_ATTRIBUTE]: "",
        onClick: (e: MouseEvent<HTMLButtonElement>) => {
            clickedTrigger = e.currentTarget;
            search.setOpen(true);
        },
        onPointerEnter: prefetch,
        onFocus: prefetch,
    };

    if (variant === "icon") {
        return (
            <Button
                {...triggerProps}
                variant="ghost"
                size="icon"
                className={cn("h-10 w-10", className)}
            >
                <Search className="h-5 w-5" />
            </Button>
        );
    }

    return (
        <button
            {...triggerProps}
            className={cn(
                "group border-foreground/20 hover:border-foreground/40 focus-visible:border-foreground/60 focus-visible:ring-ring @container flex h-9 cursor-pointer items-center gap-2 rounded-t-sm border-b px-1 text-left transition-colors focus-visible:ring-2 focus-visible:outline-hidden",
                className,
            )}
        >
            <Search className="text-muted-foreground group-hover:text-foreground h-4 w-4 shrink-0 transition-colors" />
            <span className="text-muted-foreground flex-1 truncate text-sm">
                Search games and more…
            </span>
            <span
                className={cn(
                    "text-muted-foreground hidden w-11 shrink-0 text-right text-xs @min-[16rem]:block pointer-coarse:hidden!",
                    isApple === null && "invisible",
                )}
            >
                {isApple ? "⌘ K" : "Ctrl K"}
            </span>
        </button>
    );
};
