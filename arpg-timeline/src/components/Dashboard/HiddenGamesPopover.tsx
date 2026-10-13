"use client";

import { EyeOff } from "lucide-react";
import { ReactNode, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import LocalDate from "@/components/LocalDate";
import { SanityImage } from "@/components/SanityImage";
import { useGameFilterContext } from "@/contexts/GameFilterContext";
import { HiddenGame } from "@/lib/filters/filterState";
import { sa_event } from "@/lib/sa_event";
import { cn } from "@/lib/utils";
import { Button } from "@/ui/Button";

const GAP = 6;
const VIEWPORT_MARGIN = 8;

type HiddenGamesPopoverProps = {
    title: string;
    entries: HiddenGame[];
    trigger: ReactNode;
    triggerClassName?: string;
    // Sent with hidden_marker_opened
    eventProps: Record<string, string | number>;
    onHideStrip?: () => void;
    onPeek?: (slug: string) => void;
};

export const HiddenGamesPopover = ({
    title,
    entries,
    trigger,
    triggerClassName,
    eventProps,
    onHideStrip,
    onPeek,
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
                        aria-label={title}
                        style={pos ?? { top: 0, left: 0, visibility: "hidden" }}
                        className="bg-popover text-popover-foreground fixed z-[90] flex w-72 max-w-[calc(100vw-1rem)] flex-col gap-2 rounded-md border p-3 text-sm shadow-lg"
                    >
                        <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
                            <EyeOff className="h-3.5 w-3.5" />
                            {title}
                        </div>
                        <ul className="flex max-h-64 flex-col gap-2 overflow-y-auto">
                            {entries.map((entry) => (
                                <HiddenGameRow
                                    key={entry.game.slug}
                                    entry={entry}
                                    onPeek={
                                        onPeek &&
                                        (() => {
                                            close();
                                            onPeek(entry.game.slug);
                                        })
                                    }
                                />
                            ))}
                        </ul>
                        <div className="flex items-center justify-between border-t pt-2 text-xs">
                            <FooterButton
                                onClick={() => {
                                    close();
                                    setFiltersOpen(true);
                                }}
                            >
                                Edit filters
                            </FooterButton>
                            {onHideStrip && (
                                <FooterButton
                                    onClick={() => {
                                        close();
                                        onHideStrip();
                                    }}
                                >
                                    Hide this strip
                                </FooterButton>
                            )}
                        </div>
                    </div>,
                    document.body,
                )}
        </>
    );
};

const HiddenGameRow = ({
    entry: { game, reason, confirmed },
    onPeek,
}: {
    entry: HiddenGame;
    onPeek?: () => void;
}) => {
    const startDate = game.isDormant ? null : game.nextSeason?.start?.startDate;
    return (
        <li className="flex items-center gap-2">
            <div className="relative h-8 w-8 shrink-0 opacity-70 grayscale">
                {game.logo && <SanityImage src={game.logo} alt="" fill objectFit="contain" />}
            </div>
            <div className="flex min-w-0 flex-1 flex-col">
                <span className="truncate font-medium">{game.name}</span>
                <span className="text-muted-foreground text-xs">
                    {startDate && (
                        <>
                            {!confirmed && "Est. "}
                            <LocalDate utcDate={startDate} dateOnly />
                            {" · "}
                        </>
                    )}
                    {reason}
                </span>
            </div>
            {onPeek && (
                <Button size="sm" variant="outline" className="h-7 px-2 text-xs" onClick={onPeek}>
                    Show here
                </Button>
            )}
        </li>
    );
};

const FooterButton = ({ onClick, children }: { onClick: () => void; children: ReactNode }) => (
    <button
        type="button"
        onClick={onClick}
        className="hover:text-foreground text-muted-foreground underline-offset-2 hover:underline"
    >
        {children}
    </button>
);
