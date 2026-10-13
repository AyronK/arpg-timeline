"use client";

import { EyeOff } from "lucide-react";
import Link from "next/link";
import { ReactNode, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import LocalDate from "@/components/LocalDate";
import { useGameFilterContext } from "@/contexts/GameFilterContext";
import { HiddenGame } from "@/lib/filters/filterState";
import { sa_event } from "@/lib/sa_event";
import { cn } from "@/lib/utils";

const GAP = 6;
const VIEWPORT_MARGIN = 8;
const footerActionClassName =
    "hover:text-foreground text-muted-foreground w-full cursor-pointer underline-offset-2 hover:underline";

const TITLE = "Hidden by filters";

type HiddenGamesPopoverProps = {
    entry: HiddenGame;
    trigger: ReactNode;
    triggerClassName?: string;
    // Sent with hidden_marker_opened
    eventProps: Record<string, string | number>;
};

export const HiddenGamesPopover = ({
    entry,
    trigger,
    triggerClassName,
    eventProps,
}: HiddenGamesPopoverProps) => {
    const { setFiltersOpen } = useGameFilterContext();
    const [open, setOpen] = useState(false);
    const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const panelRef = useRef<HTMLDivElement>(null);

    const close = () => setOpen(false);

    const handleClick = () => {
        if (open) return close();
        setPos(null);
        setOpen(true);
        sa_event("hidden_marker_opened", eventProps);
    };

    // Below the trigger, flipped above when it would overflow, clamped to the viewport
    useLayoutEffect(() => {
        if (!open) return;
        const t = triggerRef.current?.getBoundingClientRect();
        const p = panelRef.current?.getBoundingClientRect();
        if (!t || !p) return;
        // clientWidth/Height exclude the scrollbar
        const { clientWidth, clientHeight } = document.documentElement;
        const below = t.bottom + GAP;
        const top =
            below + p.height > clientHeight - VIEWPORT_MARGIN && t.top - GAP - p.height > 0
                ? t.top - GAP - p.height
                : below;
        const left = Math.min(
            Math.max(t.left + t.width / 2 - p.width / 2, VIEWPORT_MARGIN),
            clientWidth - p.width - VIEWPORT_MARGIN,
        );
        setPos({ top, left });
    }, [open]);

    useEffect(() => {
        if (!open) return;
        const isInside = (target: EventTarget | null) =>
            target instanceof Node &&
            (triggerRef.current?.contains(target) || panelRef.current?.contains(target));
        const onPointerDown = (e: PointerEvent) => !isInside(e.target) && setOpen(false);
        const onScroll = (e: Event) => !isInside(e.target) && setOpen(false);
        const onKeyDown = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
        document.addEventListener("pointerdown", onPointerDown);
        document.addEventListener("scroll", onScroll, { capture: true, passive: true });
        document.addEventListener("keydown", onKeyDown);
        return () => {
            document.removeEventListener("pointerdown", onPointerDown);
            document.removeEventListener("scroll", onScroll, { capture: true });
            document.removeEventListener("keydown", onKeyDown);
        };
    }, [open]);

    return (
        <>
            <button
                ref={triggerRef}
                type="button"
                aria-expanded={open}
                aria-haspopup="dialog"
                className={cn("cursor-pointer", triggerClassName)}
                onClick={handleClick}
            >
                {trigger}
            </button>
            {open &&
                createPortal(
                    <div
                        ref={panelRef}
                        role="dialog"
                        aria-label={TITLE}
                        style={pos ?? { top: 0, left: 0, visibility: "hidden" }}
                        className="bg-popover text-popover-foreground fixed z-[90] flex w-max max-w-[min(18rem,calc(100vw-1rem))] min-w-48 flex-col gap-2 rounded-md border p-3 text-sm shadow-lg"
                    >
                        <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
                            <EyeOff className="h-3.5 w-3.5" />
                            {TITLE}
                        </div>
                        <HiddenGameRow entry={entry} />
                        <div className="border-muted grid grid-cols-2 gap-3 border-t pt-2 text-center text-xs">
                            <Link
                                href={`/game/${entry.game.slug}`}
                                className={footerActionClassName}
                                aria-label={`View ${entry.game.name} overview`}
                                data-sa-click="hidden-popover-overview"
                            >
                                Overview
                            </Link>
                            <button
                                type="button"
                                onClick={() => {
                                    close();
                                    setFiltersOpen(true);
                                }}
                                className={footerActionClassName}
                            >
                                Edit filters
                            </button>
                        </div>
                    </div>,
                    document.body,
                )}
        </>
    );
};

// Same start text as the grid's next-season widget
const StartText = ({ entry: { game, startedAt } }: { entry: HiddenGame }) => {
    if (startedAt !== null)
        return (
            <>
                Started <LocalDate utcDate={new Date(startedAt).toISOString()} dateOnly />
            </>
        );
    const start = game.nextSeason?.start;
    if (start?.confirmed && start.startDate)
        return start.overrideText || <LocalDate utcDate={start.startDate} dateOnly />;
    // || so empty CMS strings fall through too
    return start?.overrideText || game.currentSeason?.end?.overrideText || "To be announced";
};

const HiddenGameRow = ({ entry }: { entry: HiddenGame }) => (
    <div className="flex min-w-0 flex-col">
        <span className="font-medium break-words">{entry.game.name}</span>
        <span className="text-muted-foreground text-xs">
            {!entry.game.isDormant && (
                <>
                    <StartText entry={entry} />
                    {" · "}
                </>
            )}
            {entry.reason}
        </span>
    </div>
);
