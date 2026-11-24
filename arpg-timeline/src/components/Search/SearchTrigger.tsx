"use client";

import { Search } from "lucide-react";
import { useSyncExternalStore } from "react";

import { prefetchSearchIndex } from "@/lib/search/loadSearchIndex";
import { cn } from "@/lib/utils";
import { Button } from "@/ui/Button";
import { Kbd } from "@/ui/Kbd";

import { preloadSearchPalette, useSearch } from "./SearchProvider";

export const SEARCH_TRIGGER_ATTRIBUTE = "data-search-trigger";

const subscribeNoop = () => () => {};
const isApplePlatform = () => /Mac|iPhone|iPad|iPod/.test(navigator.userAgent);

const prefetch = () => {
    preloadSearchPalette();
    prefetchSearchIndex();
};

interface SearchTriggerProps {
    variant: "pill" | "icon";
    className?: string;
}

export const SearchTrigger = ({ variant, className }: SearchTriggerProps) => {
    const { setOpen } = useSearch();
    const isApple = useSyncExternalStore(subscribeNoop, isApplePlatform, () => null);

    const triggerProps = {
        type: "button" as const,
        "aria-label": "Search games and pages",
        "aria-haspopup": "dialog" as const,
        [SEARCH_TRIGGER_ATTRIBUTE]: "",
        onClick: () => setOpen(true),
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
                "font-ui border-foreground/15 bg-muted/60 text-muted-foreground hover:bg-accent hover:text-foreground focus-visible:ring-ring flex h-9 cursor-pointer items-center gap-2 rounded-full border pr-1.5 pl-3 text-sm transition-colors focus-visible:ring-2 focus-visible:outline-hidden",
                className,
            )}
        >
            <Search className="h-4 w-4 shrink-0" />
            <span className="flex-1 text-left whitespace-nowrap">Search games, pages...</span>
            <Kbd className={cn("w-13 rounded-full", isApple === null && "invisible")}>
                {isApple ? "⌘" : "Ctrl"} K
            </Kbd>
        </button>
    );
};
