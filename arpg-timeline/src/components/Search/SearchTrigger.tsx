"use client";

import { Search } from "lucide-react";
import { useSyncExternalStore } from "react";

import { prefetchSearchIndex } from "@/lib/search/loadSearchIndex";
import { cn } from "@/lib/utils";
import { Button } from "@/ui/Button";

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
                "group bg-card text-card-foreground border-foreground/20 hover:border-foreground/40 focus-visible:border-foreground/60 flex h-9 cursor-pointer items-center gap-2.5 rounded-md border-2 pr-2 pl-3 transition-colors focus-visible:outline-hidden",
                className,
            )}
        >
            <Search className="text-muted-foreground group-hover:text-foreground h-4 w-4 shrink-0 transition-colors" />
            <span className="font-heading text-sm font-medium">Search</span>
            <span
                className={cn(
                    "text-muted-foreground bg-foreground/10 w-13 rounded-sm px-1.5 py-0.5 text-center text-[11px] font-medium",
                    isApple === null && "invisible",
                )}
            >
                {isApple ? "⌘ K" : "Ctrl K"}
            </span>
        </button>
    );
};
