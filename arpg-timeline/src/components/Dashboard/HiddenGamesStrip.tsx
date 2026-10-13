"use client";

import { useHasMounted } from "@react-hooks-library/core";
import { useEffect, useState } from "react";

import { useGameFilterContext } from "@/contexts/GameFilterContext";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import { useOpenFiltersFromHiddenMarker } from "@/hooks/useOpenFiltersFromHiddenMarker";
import { getStripEntries, getStripTimeLabel, HiddenGame } from "@/lib/filters/filterState";
import { cn } from "@/lib/utils";

import { HiddenGamesPopover } from "./HiddenGamesPopover";

const useChipCap = () => {
    const { isXl } = useBreakpoint("xl");
    const { is2xl } = useBreakpoint("2xl");
    const { isLg } = useBreakpoint("lg");
    return is2xl ? 4 : isXl ? 3 : isLg ? 2 : 1;
};

// True while the row has content scrolled out past its right edge
const useOverflowsRight = (el: HTMLElement | null) => {
    const [overflows, setOverflows] = useState(false);
    useEffect(() => {
        if (!el) return;
        const update = () => setOverflows(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
        update();
        const observer = new ResizeObserver(update);
        observer.observe(el);
        el.addEventListener("scroll", update, { passive: true });
        return () => {
            observer.disconnect();
            el.removeEventListener("scroll", update);
        };
    }, [el]);
    return overflows;
};

export const HiddenGamesStrip = () => {
    const { hiddenGamesSummary, isHiddenStripEnabled } = useGameFilterContext();
    const openFilters = useOpenFiltersFromHiddenMarker();
    const cap = useChipCap();
    const [row, setRow] = useState<HTMLDivElement | null>(null);
    const overflowsRight = useOverflowsRight(row);
    // Breakpoints, stored filters and the strip switch are only known in the browser
    const hasMounted = useHasMounted();

    if (
        !hasMounted ||
        !hiddenGamesSummary ||
        hiddenGamesSummary.hiddenCount === 0 ||
        !isHiddenStripEnabled
    )
        return null;

    const { chips, more, moreLabel } = getStripEntries(hiddenGamesSummary, cap);
    if (chips.length === 0 && !moreLabel) return null;

    return (
        <div
            ref={setRow}
            className={cn(
                "text-muted-foreground flex min-w-0 scrollbar-none flex-nowrap items-center justify-between gap-2 overflow-x-auto text-xs whitespace-nowrap lg:justify-end lg:overflow-visible",
                overflowsRight &&
                    "[mask-image:linear-gradient(to_right,black_85%,transparent)] lg:[mask-image:none]",
            )}
        >
            {chips.length > 0 && <span className="shrink-0">Filtered out:</span>}
            {chips.map((entry) => (
                <HiddenGamesPopover
                    key={entry.game.slug}
                    entry={entry}
                    eventProps={{ entry: "chip", game: entry.game.slug }}
                    triggerClassName="group hover:bg-accent/50 hover:text-accent-foreground flex shrink-0 items-center gap-2 rounded-full border px-2.5 py-0.5 transition-[color,box-shadow]"
                    trigger={<StripChip entry={entry} now={hiddenGamesSummary.now} />}
                />
            ))}
            {moreLabel && (
                <button
                    type="button"
                    onClick={() =>
                        openFilters({
                            entry: chips.length > 0 ? "more" : "all",
                            count: more.length,
                        })
                    }
                    className="hover:bg-accent/50 hover:text-accent-foreground shrink-0 cursor-pointer rounded-full border border-transparent px-1.5 py-0.5 transition-[color,box-shadow]"
                >
                    {moreLabel}
                </button>
            )}
        </div>
    );
};

const StripChip = ({ entry, now }: { entry: HiddenGame; now: number }) => (
    <>
        <span className="text-foreground/80 group-hover:text-accent-foreground">
            {entry.game.name}
        </span>
        <span className="opacity-70">{getStripTimeLabel(entry, now)}</span>
    </>
);
