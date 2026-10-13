"use client";

// PROTOTYPE(hidden-markers): variant G, preset chip + starting-soon strip; see docs/features/hidden-games-surfacing
import { useHasMounted } from "@react-hooks-library/core";
import { EyeOff, Star } from "lucide-react";
import { ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

import LocalDate from "@/components/LocalDate";
import { PrototypeSwitcher } from "@/components/PrototypeSwitcher";
import { SanityImage } from "@/components/SanityImage";
import { useGameFilterContext } from "@/contexts/GameFilterContext";
import { useDashboardImageLoadingOptimization } from "@/hooks/useDashboardImageLoadingOptimization";
import { Game, GameStatistics } from "@/lib/cms/games.types";
import { getStoredFilters } from "@/lib/storage/gameFiltersStorage";
import { cn } from "@/lib/utils";
import { Button } from "@/ui/Button";

import { GameTile, gridOrderClass } from "./Games";

export const HIDDEN_MARKER_VARIANTS = ["G"] as const;
export type HiddenMarkerVariant = (typeof HIDDEN_MARKER_VARIANTS)[number];

export const HIDDEN_PROTOTYPE_HEADER_SLOT = "hidden-prototype-header-slot";
const SOON_WINDOW_DAYS = 30;

const hiddenReason = (g: Game) => {
    if (g.isDormant) return "Dormant";
    if (g.categories?.includes("community")) return "Community";
    if (
        !g.categories?.includes("seasonal") &&
        !g.categories?.includes("early-access") &&
        !g.nextSeason?.start?.confirmed
    )
        return "No confirmed season";
    return "Hidden by your filters";
};

const openFiltersDialog = () => {
    const btn = Array.from(document.querySelectorAll("button")).find(
        (b) => b.textContent?.trim().startsWith("Filters") && b.offsetParent !== null,
    );
    btn?.click();
};

const daysUntil = (iso: string) =>
    Math.ceil((new Date(iso).getTime() - Date.now()) / (1000 * 60 * 60 * 24));

const startsWithin = (g: Game, days: number) => {
    const start = g.nextSeason?.start?.startDate;
    if (!start) return false;
    const d = daysUntil(start);
    return d >= 0 && d <= days;
};

const byStart = (a: Game, b: Game) =>
    a.nextSeason!.start!.startDate!.localeCompare(b.nextSeason!.start!.startDate!);

const HiddenPopover = ({
    games,
    title,
    onPeek,
    onHideMarkers,
    trigger,
    className,
}: {
    games: Game[];
    title: string;
    onPeek: (slugs: string[]) => void;
    onHideMarkers: () => void;
    trigger: ReactNode;
    className?: string;
}) => {
    const [open, setOpen] = useState(false);
    const [pos, setPos] = useState({ top: 0, left: 0 });
    const triggerRef = useRef<HTMLButtonElement>(null);
    const panelRef = useRef<HTMLDivElement>(null);
    const closeTimer = useRef<NodeJS.Timeout | null>(null);

    const place = () => {
        const r = triggerRef.current?.getBoundingClientRect();
        if (!r) return;
        const width = 288;
        setPos({
            top: r.bottom + 6,
            left: Math.min(
                Math.max(r.left + r.width / 2 - width / 2, 8),
                window.innerWidth - width - 8,
            ),
        });
    };

    const show = () => {
        if (closeTimer.current) clearTimeout(closeTimer.current);
        place();
        setOpen(true);
    };
    const scheduleClose = (e: React.PointerEvent) => {
        if (e.pointerType !== "mouse") return;
        closeTimer.current = setTimeout(() => setOpen(false), 200);
    };

    useEffect(() => {
        if (!open) return;
        const onDown = (e: PointerEvent) => {
            const t = e.target as Node;
            if (triggerRef.current?.contains(t) || panelRef.current?.contains(t)) return;
            setOpen(false);
        };
        const onScroll = () => setOpen(false);
        document.addEventListener("pointerdown", onDown);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => {
            document.removeEventListener("pointerdown", onDown);
            window.removeEventListener("scroll", onScroll);
        };
    }, [open]);

    return (
        <>
            <button
                ref={triggerRef}
                type="button"
                aria-label={title}
                className={cn("cursor-pointer", className)}
                onPointerEnter={(e) => e.pointerType === "mouse" && show()}
                onPointerLeave={scheduleClose}
                onClick={() => (open ? setOpen(false) : show())}
            >
                {trigger}
            </button>
            {open &&
                createPortal(
                    <div
                        ref={panelRef}
                        style={{ top: pos.top, left: pos.left }}
                        onPointerEnter={() =>
                            closeTimer.current && clearTimeout(closeTimer.current)
                        }
                        onPointerLeave={scheduleClose}
                        className="bg-popover text-popover-foreground fixed z-[90] flex w-72 flex-col gap-2 rounded-md border p-3 text-sm shadow-lg"
                    >
                        <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
                            <EyeOff className="h-3.5 w-3.5" />
                            {title}
                        </div>
                        <ul className="flex max-h-64 flex-col gap-2 overflow-y-auto">
                            {games.map((g) => (
                                <li key={g.slug} className="flex items-center gap-2">
                                    <div className="relative h-8 w-8 shrink-0 opacity-70 grayscale">
                                        {g.logo && (
                                            <SanityImage
                                                src={g.logo}
                                                alt=""
                                                fill
                                                objectFit="contain"
                                            />
                                        )}
                                    </div>
                                    <div className="flex min-w-0 flex-1 flex-col">
                                        <span className="truncate font-medium">{g.name}</span>
                                        <span className="text-muted-foreground text-xs">
                                            {g.nextSeason?.start?.startDate ? (
                                                <>
                                                    {g.nextSeason.start.confirmed ? "" : "Est. "}
                                                    <LocalDate
                                                        utcDate={g.nextSeason.start.startDate}
                                                        dateOnly
                                                    />
                                                    {" · "}
                                                </>
                                            ) : null}
                                            {hiddenReason(g)}
                                        </span>
                                    </div>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="h-7 px-2 text-xs"
                                        onClick={() => {
                                            onPeek([g.slug]);
                                            setOpen(false);
                                        }}
                                    >
                                        Show here
                                    </Button>
                                </li>
                            ))}
                        </ul>
                        <div className="flex items-center justify-between border-t pt-2 text-xs">
                            <button
                                className="hover:text-foreground text-muted-foreground underline-offset-2 hover:underline"
                                onClick={() => {
                                    setOpen(false);
                                    openFiltersDialog();
                                }}
                            >
                                Edit filters
                            </button>
                            <button
                                className="hover:text-foreground text-muted-foreground underline-offset-2 hover:underline"
                                onClick={() => {
                                    setOpen(false);
                                    onHideMarkers();
                                }}
                            >
                                Hide this strip
                            </button>
                        </div>
                    </div>,
                    document.body,
                )}
        </>
    );
};

const MiniLogo = ({ game, className }: { game: Game; className?: string }) => (
    <span
        className={cn(
            "bg-background relative block shrink-0 rounded-full border opacity-70 grayscale transition group-hover:opacity-100 group-hover:grayscale-0",
            className,
        )}
    >
        {game.logo && (
            <SanityImage src={game.logo} alt="" fill objectFit="contain" className="p-px" />
        )}
    </span>
);

const HeaderSlot = ({ children }: { children: ReactNode }) => {
    const isMounted = useHasMounted();
    const target = isMounted ? document.getElementById(HIDDEN_PROTOTYPE_HEADER_SLOT) : null;
    return target ? createPortal(children, target) : null;
};

const PresetChip = ({ hiddenCount }: { hiddenCount: number }) => {
    const isPreset = getStoredFilters() === null;
    return (
        <button
            onClick={openFiltersDialog}
            className="border-primary/40 bg-primary/5 hover:bg-primary/10 text-foreground flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium"
        >
            {isPreset && <Star className="text-primary h-3.5 w-3.5" />}
            {isPreset ? "Featured preset" : "Custom filters"}
            <span className="text-muted-foreground font-normal">· {hiddenCount} hidden</span>
        </button>
    );
};

const SoonStrip = ({
    hidden,
    onPeek,
    onHideStrip,
}: {
    hidden: Game[];
    onPeek: (slugs: string[]) => void;
    onHideStrip: () => void;
}) => {
    const soon = hidden.filter((g) => startsWithin(g, SOON_WINDOW_DAYS)).sort(byStart);
    const others = hidden.filter((g) => !soon.includes(g));
    const popoverProps = { onPeek, onHideMarkers: onHideStrip };

    return (
        <HeaderSlot>
            <div className="text-muted-foreground flex flex-wrap items-center gap-x-2 gap-y-1.5 pt-1 text-xs">
                <PresetChip hiddenCount={hidden.length} />
                {soon.length > 0 && <span>Starting soon among hidden:</span>}
                {soon.map((g) => (
                    <HiddenPopover
                        key={g.slug}
                        games={[g]}
                        title="Hidden by filters"
                        {...popoverProps}
                        className="group hover:border-foreground/40 hover:text-foreground flex items-center gap-2 rounded-full border py-0.5 pr-2.5 pl-0.5"
                        trigger={
                            <>
                                <MiniLogo game={g} className="h-6 w-6" />
                                <span className="text-foreground/80">{g.shortName || g.name}</span>
                                <span className="opacity-70">
                                    in {g.nextSeason?.start?.confirmed ? "" : "~"}
                                    {daysUntil(g.nextSeason!.start!.startDate!)}d
                                </span>
                            </>
                        }
                    />
                ))}
                {others.length > 0 && (
                    <HiddenPopover
                        games={others}
                        title={`${others.length} more hidden by filters`}
                        {...popoverProps}
                        className="hover:text-foreground underline-offset-2 hover:underline"
                        trigger={
                            <span>
                                {soon.length > 0
                                    ? `+${others.length} more`
                                    : `${others.length} games`}
                            </span>
                        }
                    />
                )}
            </div>
        </HeaderSlot>
    );
};

const PeekLabel = () => (
    <span className="bg-background/90 text-muted-foreground absolute top-2 left-1/2 z-10 -translate-x-1/2 rounded-full border px-2 py-0.5 text-[10px] tracking-wide uppercase">
        Hidden by filters · until reload
    </span>
);

export const HiddenGamesPrototype = ({
    variant,
    statistics,
}: {
    variant: HiddenMarkerVariant;
    statistics: Record<string, GameStatistics>;
}) => {
    const { categoryGames = [], excludedSlugs = [], category } = useGameFilterContext();
    const { shouldLoadImage } = useDashboardImageLoadingOptimization();
    const [peeked, setPeeked] = useState<Set<string>>(new Set());
    const [stripOn, setStripOn] = useState(true);

    const { shown, hidden } = useMemo(() => {
        const excluded = new Set(category === "all" ? [] : excludedSlugs);
        const ordered = [
            ...categoryGames.filter((g) => !g.isDormant && !g.isComingSoon),
            ...categoryGames.filter((g) => g.isComingSoon),
            ...categoryGames.filter((g) => g.isDormant).map((g) => ({ ...g, nextSeason: null })),
        ];
        return {
            shown: ordered.filter((g) => !excluded.has(g.slug) || peeked.has(g.slug)),
            hidden: ordered.filter((g) => excluded.has(g.slug) && !peeked.has(g.slug)),
        };
    }, [categoryGames, excludedSlugs, category, peeked]);

    return (
        <>
            {shown.map((game, idx) => (
                <div key={game.slug} className={cn(gridOrderClass(idx), "relative")}>
                    {peeked.has(game.slug) && <PeekLabel />}
                    <div className={cn("flex w-full", peeked.has(game.slug) && "opacity-80")}>
                        <GameTile
                            game={game}
                            statistics={statistics}
                            loadEager={shouldLoadImage(idx)}
                        />
                    </div>
                </div>
            ))}
            {stripOn && hidden.length > 0 && (
                <SoonStrip
                    hidden={hidden}
                    onPeek={(slugs) => setPeeked((p) => new Set([...p, ...slugs]))}
                    onHideStrip={() => setStripOn(false)}
                />
            )}
            <PrototypeSwitcher
                variants={[{ key: variant, name: "Preset chip + soon strip" }]}
                current={variant}
                status={
                    <span className="flex items-center gap-2">
                        hidden {hidden.length} · peeked {peeked.size} · strip{" "}
                        {stripOn ? "on" : "off"}
                        {(!stripOn || peeked.size > 0) && (
                            <button
                                className="underline"
                                onClick={() => {
                                    setStripOn(true);
                                    setPeeked(new Set());
                                }}
                            >
                                reset
                            </button>
                        )}
                    </span>
                }
            />
        </>
    );
};
