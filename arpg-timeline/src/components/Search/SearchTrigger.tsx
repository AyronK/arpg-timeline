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
    variant: "field" | "icon";
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
                "group border-foreground/20 hover:border-foreground/40 focus-visible:border-foreground/60 focus-visible:ring-ring flex h-9 w-56 cursor-pointer items-center gap-2 rounded-t-sm border-b px-1 text-left transition-colors focus-visible:ring-2 focus-visible:outline-hidden 2xl:w-72",
                className,
            )}
        >
            <Search className="text-muted-foreground group-hover:text-foreground h-4 w-4 shrink-0 transition-colors" />
            <span className="text-muted-foreground flex-1 truncate text-sm">
                Search games and more…
            </span>
            <span
                className={cn(
                    "text-muted-foreground hidden w-11 shrink-0 text-right text-xs 2xl:block",
                    isApple === null && "invisible",
                )}
            >
                {isApple ? "⌘ K" : "Ctrl K"}
            </span>
        </button>
    );
};
