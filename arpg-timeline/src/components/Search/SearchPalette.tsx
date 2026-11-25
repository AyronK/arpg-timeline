"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { ArrowLeft, ArrowRight, CalendarPlus, Eye, Globe, Search, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { KeyboardEvent, ReactNode, useEffect, useId, useMemo, useRef, useState } from "react";

import { CalendarSubscribeDialog } from "@/components/CalendarSubscribeDialog";
import {
    COMMUNITY_LAUNCHER_MODAL_STORAGE_KEY,
    CommunityWebsiteModal,
} from "@/components/CommunityWebsiteModal";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import { HIGHLIGHT_PARAM, highlightGameCard } from "@/hooks/useHighlightGame";
import {
    formatGameMeta,
    getDatelessDescription,
    getSeasonDescription,
} from "@/lib/search/gameMeta";
import { loadSearchIndex } from "@/lib/search/loadSearchIndex";
import { SearchMatch } from "@/lib/search/match";
import {
    getItemHref,
    getItemKey,
    isCommunity,
    isItemExternal,
    prepareSearch,
    runSearch,
    SearchItem,
} from "@/lib/search/searchEntries";
import { getSeasonStatusText } from "@/lib/search/seasonStatus";
import {
    isEntryAvailable,
    MOBILE_CHIP_IDS,
    STATIC_ENTRIES,
    StaticEntry,
} from "@/lib/search/staticEntries";
import { DashboardSearch, SearchGame } from "@/lib/search/types";
import { cn } from "@/lib/utils";
import { Dialog, DialogClose, DialogOverlay, DialogPortal, DialogTitle } from "@/ui/Dialog";
import { toast } from "@/ui/hooks/useToast";

import { GameTile, IconTile, RowAction, SearchResultRow } from "./SearchResultRow";
import { SEARCH_TRIGGER_ATTRIBUTE } from "./SearchTrigger";

type GameLinkItem = Extract<SearchItem, { kind: "game-link" }>;

const getGameLinkLabel = ({ game, link }: GameLinkItem) =>
    link === "calendar"
        ? "Subscribe to calendar"
        : isCommunity(game)
          ? "Project website"
          : "Official website";

const isCommunityWarningDismissed = () =>
    localStorage.getItem(COMMUNITY_LAUNCHER_MODAL_STORAGE_KEY) === "true";

const NO_ACTIVE_INDEX = -1;
const MAX_QUERY_LENGTH = 64;
const HISTORY_MARKER = "searchSheet";

const MOBILE_CHIPS = MOBILE_CHIP_IDS.map((id) => STATIC_ENTRIES.find((entry) => entry.id === id)!);

const CHIP_CLASS_NAME =
    "border-foreground/20 text-muted-foreground hover:text-foreground inline-flex h-8 shrink-0 cursor-pointer items-center gap-1.5 rounded-full border px-3 text-xs font-medium whitespace-nowrap";

const NO_RESULTS_ACTION_CLASS_NAME =
    "border-foreground/20 hover:border-foreground/40 text-muted-foreground hover:text-foreground focus-visible:ring-ring inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-md border px-3 text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:outline-hidden";

const ResultRow = ({
    match: { item, matchedAlias, highlight },
    dashboard,
    now,
    action,
    onNavigate,
    onClose,
    onCommand,
    onGameLink,
    ...rowProps
}: {
    match: SearchMatch<SearchItem>;
    dashboard: DashboardSearch | null;
    now: number;
    action: RowAction | null;
    id: string;
    isActive: boolean;
    replace: boolean;
    onHover: () => void;
    onNavigate: () => void;
    onClose: () => void;
    onCommand: (entry: StaticEntry) => void;
    onGameLink: (item: GameLinkItem) => void;
}) => {
    if (item.kind === "game") {
        const detail = dashboard?.details.get(item.game.slug);
        const description = detail
            ? getSeasonDescription(item.game, getSeasonStatusText(detail.game, now))
            : getDatelessDescription(item.game);
        return (
            <SearchResultRow
                {...rowProps}
                onNavigate={onNavigate}
                href={getItemHref(item)}
                title={item.game.name}
                meta={formatGameMeta(item.game, description, matchedAlias)}
                action={action}
                tile={<GameTile name={item.game.name} logoSrc={item.game.logoSrc} />}
                highlight={highlight}
            />
        );
    }
    if (item.kind === "game-link") {
        const isWebsite = item.link === "website";
        const isDirect = isWebsite && !isCommunity(item.game);
        return (
            <SearchResultRow
                {...rowProps}
                external={isDirect}
                onNavigate={isDirect ? onClose : () => onGameLink(item)}
                href={isDirect ? getItemHref(item) : null}
                title={`${item.game.name}: ${getGameLinkLabel(item)}`}
                meta={isWebsite ? "Opens in a new tab" : "Season dates in your calendar"}
                tile={<IconTile icon={isWebsite ? Globe : CalendarPlus} />}
                highlight={null}
            />
        );
    }
    const { entry } = item;
    return (
        <SearchResultRow
            {...rowProps}
            external={entry.external}
            onNavigate={
                entry.command ? () => onCommand(entry) : entry.external ? onClose : onNavigate
            }
            href={entry.command ? null : getItemHref(item)}
            title={entry.title}
            meta={entry.description}
            tile={<IconTile icon={entry.icon} iconSrc={entry.iconSrc} />}
            highlight={highlight}
        />
    );
};

const focusVisibleTrigger = (e: Event) => {
    e.preventDefault();
    const triggers = document.querySelectorAll<HTMLElement>(`[${SEARCH_TRIGGER_ATTRIBUTE}]`);
    Array.from(triggers)
        .find((trigger) => trigger.offsetParent !== null)
        ?.focus({ preventScroll: true });
};

const useSearchGames = (open: boolean, providedGames?: SearchGame[]) => {
    const [loadedGames, setLoadedGames] = useState<SearchGame[] | null>(null);
    const [hasFailed, setHasFailed] = useState(false);

    useEffect(() => {
        if (!open || providedGames) {
            return;
        }
        let isActive = true;
        loadSearchIndex()
            .then((index) => {
                if (isActive) {
                    setLoadedGames(index.games);
                    setHasFailed(false);
                }
            })
            .catch(() => isActive && setHasFailed(true));
        return () => {
            isActive = false;
        };
    }, [open, providedGames]);

    return { games: providedGames ?? loadedGames, hasFailed };
};

const useCloseOnBrowserBack = (isActive: boolean, onClose: () => void) => {
    const onCloseRef = useRef(onClose);
    const isReleasedRef = useRef(false);
    const isActiveRef = useRef(isActive);
    const afterCloseRef = useRef<(() => void) | null>(null);

    useEffect(() => {
        onCloseRef.current = onClose;
        isActiveRef.current = isActive;
    });

    useEffect(() => {
        if (!isActive) {
            return;
        }
        isReleasedRef.current = false;
        window.history.pushState({ ...window.history.state, [HISTORY_MARKER]: true }, "");
        const onPopState = () => {
            if (!window.history.state?.[HISTORY_MARKER]) {
                onCloseRef.current();
            }
        };
        window.addEventListener("popstate", onPopState);
        return () => {
            window.removeEventListener("popstate", onPopState);
            const afterClose = afterCloseRef.current;
            afterCloseRef.current = null;
            if (!isReleasedRef.current && window.history.state?.[HISTORY_MARKER]) {
                if (afterClose) {
                    window.addEventListener("popstate", afterClose, { once: true });
                }
                window.history.back();
            } else {
                afterClose?.();
            }
        };
    }, [isActive]);

    const release = () => {
        isReleasedRef.current = true;
    };
    const runAfterClose = (callback: () => void) => {
        if (isActiveRef.current) {
            afterCloseRef.current = callback;
        } else {
            requestAnimationFrame(callback);
        }
    };
    return { release, runAfterClose };
};

interface PaletteBodyProps {
    games: SearchGame[] | null;
    hasFailed: boolean;
    isSheet: boolean;
    dashboard: DashboardSearch | null;
    onNavigate: () => void;
    onClose: () => void;
    onCloseThen: (callback: () => void) => void;
    onOpenCalendar: (game: SearchGame) => void;
    onConfirmCommunityLink: (href: string) => void;
}

const PaletteBody = ({
    games,
    hasFailed,
    isSheet,
    dashboard,
    onNavigate,
    onClose,
    onCloseThen,
    onOpenCalendar,
    onConfirmCommunityLink,
}: PaletteBodyProps) => {
    const router = useRouter();
    const [query, setQuery] = useState("");
    const [activeIndex, setActiveIndex] = useState(NO_ACTIVE_INDEX);
    const inputRef = useRef<HTMLInputElement>(null);
    const baseId = useId();
    const listboxId = `${baseId}-listbox`;
    const optionId = (index: number) => `${baseId}-option-${index}`;

    const [now] = useState(Date.now);
    const groups = useMemo(
        () =>
            runSearch(prepareSearch(games), query, {
                canOpenFilters: dashboard?.category === "featured",
                isVisible: (item) =>
                    item.kind === "game" &&
                    dashboard?.details.get(item.game.slug)?.status.kind === "visible",
            }),
        [games, query, dashboard],
    );
    const mobileChips = MOBILE_CHIPS.filter((entry) =>
        isEntryAvailable(entry, dashboard?.category === "featured"),
    );

    const runCommand = (entry: StaticEntry) => {
        if (entry.command === "open-filters") {
            onCloseThen(() => dashboard?.openFilters());
        }
    };

    const runGameLink = (item: GameLinkItem) => {
        if (item.link === "calendar") {
            onCloseThen(() => onOpenCalendar(item.game));
            return;
        }
        const href = getItemHref(item);
        if (isCommunityWarningDismissed()) {
            window.open(href, "_blank", "noopener,noreferrer");
            onClose();
            return;
        }
        onCloseThen(() => onConfirmCommunityLink(href));
    };

    const navigateTo = (href: string) => {
        onNavigate();
        if (isSheet) {
            router.replace(href);
        } else {
            router.push(href);
        }
    };

    const getAction = (item: SearchItem): RowAction | null => {
        const detail = item.kind === "game" ? dashboard?.details.get(item.game.slug) : null;
        if (!detail || detail.status.kind === "visible" || item.kind !== "game") {
            return null;
        }
        const { game } = item;
        if (detail.status.kind === "hidden") {
            return {
                label: "Show",
                description: `Hidden by your filters. Show ${game.name} on the dashboard`,
                hint: "show on dashboard",
                icon: Eye,
                run: () =>
                    onCloseThen(() => {
                        dashboard?.showGame(game.slug);
                        highlightGameCard(game.slug);
                        toast({ title: `${game.name} is now on your dashboard`, duration: 3000 });
                    }),
            };
        }
        return {
            label: "Full Catalog",
            description: `Not on this tab. Show ${game.name} in the Full Catalog`,
            hint: "show in Full Catalog",
            icon: ArrowRight,
            run: () => navigateTo(`/dashboard/all?${HIGHLIGHT_PARAM}=${game.slug}`),
        };
    };

    const results = useMemo(() => groups.flatMap((group) => group.results), [groups]);
    const safeIndex = Math.min(activeIndex, results.length - 1);
    const activeResult = results[safeIndex];
    const activeAction = activeResult ? getAction(activeResult.item) : null;
    const hasQuery = query.trim().length > 0;

    useEffect(() => {
        document
            .getElementById(`${baseId}-option-${safeIndex}`)
            ?.scrollIntoView({ block: "nearest" });
    }, [baseId, safeIndex]);

    const openItem = (item: SearchItem, inNewTab: boolean) => {
        if (item.kind === "entry" && item.entry.command) {
            runCommand(item.entry);
            return;
        }
        if (item.kind === "game-link" && (item.link === "calendar" || isCommunity(item.game))) {
            runGameLink(item);
            return;
        }
        if (inNewTab || isItemExternal(item)) {
            window.open(getItemHref(item), "_blank", "noopener,noreferrer");
            if (!inNewTab) {
                onClose();
            }
            return;
        }
        navigateTo(getItemHref(item));
    };

    const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        const count = results.length;
        if (e.key === "ArrowDown" && count) {
            e.preventDefault();
            setActiveIndex((safeIndex + 1) % count);
        } else if (e.key === "ArrowUp" && count) {
            e.preventDefault();
            setActiveIndex(safeIndex < 0 ? count - 1 : (safeIndex - 1 + count) % count);
        } else if (e.key === "Enter" && e.shiftKey && activeAction) {
            e.preventDefault();
            activeAction.run();
        } else if (e.key === "Enter" && activeResult) {
            e.preventDefault();
            openItem(activeResult.item, e.metaKey || e.ctrlKey);
        }
    };

    const hasNoResults = hasQuery && !!games && results.length === 0;
    const status = !hasQuery
        ? null
        : hasFailed
          ? "Couldn't load games. Close and try again."
          : !games
            ? "Loading games..."
            : null;

    const announcement =
        !hasQuery || !games
            ? ""
            : results.length === 0
              ? "No results"
              : `${results.length} ${results.length === 1 ? "result" : "results"}`;

    const groupOffsets = groups.map((_, groupIndex) =>
        groups.slice(0, groupIndex).reduce((count, group) => count + group.results.length, 0),
    );

    const clearSearch = () => {
        setQuery("");
        setActiveIndex(NO_ACTIVE_INDEX);
        inputRef.current?.focus();
    };

    const searchField: ReactNode = (
        <div
            className={cn(
                "border-foreground/20 bg-background/60 focus-within:border-foreground/40 flex items-center gap-2 rounded-md border px-3 transition-colors",
                isSheet && "min-w-0 flex-1",
            )}
        >
            <Search className="text-muted-foreground h-4 w-4 shrink-0" />
            <input
                ref={inputRef}
                autoFocus
                type="search"
                role="combobox"
                aria-label="Search games and pages"
                aria-expanded={results.length > 0}
                aria-controls={listboxId}
                aria-autocomplete="list"
                aria-activedescendant={activeResult ? optionId(safeIndex) : undefined}
                autoComplete="off"
                autoCapitalize="off"
                spellCheck={false}
                enterKeyHint="search"
                maxLength={MAX_QUERY_LENGTH}
                placeholder="Search games and more…"
                value={query}
                onChange={(e) => {
                    setQuery(e.target.value);
                    setActiveIndex(e.target.value.trim() ? 0 : NO_ACTIVE_INDEX);
                }}
                onKeyDown={onKeyDown}
                className="placeholder:text-muted-foreground h-11 flex-1 bg-transparent text-base outline-hidden md:text-sm [&::-webkit-search-cancel-button]:hidden"
            />
        </div>
    );

    return (
        <>
            {isSheet ? (
                <div className="border-foreground/10 flex items-center gap-1 border-b py-2 pr-3 pl-1">
                    <DialogTitle className="sr-only">Search</DialogTitle>
                    <DialogClose
                        aria-label="Close search"
                        className="text-muted-foreground hover:text-foreground focus-visible:ring-ring grid h-10 w-10 shrink-0 cursor-pointer place-content-center rounded-md transition-colors focus-visible:ring-2 focus-visible:outline-hidden"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </DialogClose>
                    {searchField}
                </div>
            ) : (
                <>
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex flex-col gap-0.5">
                            <DialogTitle className="font-heading text-foreground text-base font-medium">
                                Search
                            </DialogTitle>
                            <p className="text-muted-foreground text-xs">
                                Games by name or short name, like poe2 or d4, plus site pages
                            </p>
                        </div>
                        <DialogClose
                            aria-label="Close search"
                            className="text-muted-foreground hover:text-foreground focus-visible:ring-ring cursor-pointer rounded-sm p-1 transition-colors focus-visible:ring-2 focus-visible:outline-hidden"
                        >
                            <X className="h-4 w-4" />
                        </DialogClose>
                    </div>
                    {searchField}
                </>
            )}

            {isSheet && (
                <div className="flex shrink-0 [scrollbar-width:none] gap-2 overflow-x-auto px-3 py-2 [&::-webkit-scrollbar]:hidden">
                    {mobileChips.map((entry) => {
                        const chipContent = (
                            <>
                                <entry.icon className="h-3.5 w-3.5" />
                                {entry.shortTitle ?? entry.title}
                            </>
                        );
                        return entry.command ? (
                            <button
                                key={entry.id}
                                type="button"
                                onClick={() => runCommand(entry)}
                                className={CHIP_CLASS_NAME}
                            >
                                {chipContent}
                            </button>
                        ) : (
                            <Link
                                key={entry.id}
                                href={entry.href}
                                replace
                                prefetch={false}
                                onClick={onNavigate}
                                className={CHIP_CLASS_NAME}
                            >
                                {chipContent}
                            </Link>
                        );
                    })}
                </div>
            )}

            <div
                id={listboxId}
                role="listbox"
                aria-label="Search results"
                className={cn(
                    "overflow-x-hidden overflow-y-auto",
                    isSheet
                        ? "min-h-0 flex-1 px-3 pt-1 pb-[calc(1rem+env(safe-area-inset-bottom))]"
                        : "-mx-1 max-h-[380px] px-1",
                )}
            >
                {groups.map((group, groupIndex) => {
                    const labelId = `${baseId}-${group.id}`;
                    return (
                        <div
                            key={group.id}
                            role="group"
                            aria-labelledby={labelId}
                            className="flex flex-col gap-1.5 not-first:mt-4"
                        >
                            <div
                                id={labelId}
                                role="presentation"
                                className="text-muted-foreground pb-0.5 text-xs font-semibold tracking-wider uppercase"
                            >
                                {group.label}
                            </div>
                            {group.results.map((match, resultIndex) => {
                                const index = groupOffsets[groupIndex]! + resultIndex;
                                return (
                                    <ResultRow
                                        key={getItemKey(match.item)}
                                        match={match}
                                        id={optionId(index)}
                                        isActive={index === safeIndex}
                                        replace={isSheet}
                                        onHover={() => setActiveIndex(index)}
                                        dashboard={dashboard}
                                        now={now}
                                        action={getAction(match.item)}
                                        onNavigate={onNavigate}
                                        onClose={onClose}
                                        onCommand={runCommand}
                                        onGameLink={runGameLink}
                                    />
                                );
                            })}
                        </div>
                    );
                })}
                {hasNoResults && (
                    <div className="flex flex-col items-center gap-1 py-6 text-center text-sm">
                        <p className="text-foreground w-full truncate">
                            No results for &quot;{query.trim()}&quot;
                        </p>
                        <p className="text-muted-foreground text-xs">
                            Try a short name like d4 or poe2. Can&apos;t find your game? Request it
                            on Discord.
                        </p>
                        <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
                            <button
                                type="button"
                                onClick={clearSearch}
                                className={NO_RESULTS_ACTION_CLASS_NAME}
                            >
                                Clear search
                            </button>
                            <Link
                                href={process.env.NEXT_PUBLIC_DISCORD_URL}
                                rel="noopener noreferrer nofollow"
                                target="_blank"
                                className={NO_RESULTS_ACTION_CLASS_NAME}
                            >
                                <Image
                                    unoptimized
                                    src="/assets/third-party/discord-logo.svg"
                                    className="h-3.5 w-3.5 brightness-200 grayscale-100"
                                    alt=""
                                    width={14}
                                    height={14}
                                />
                                Request on Discord
                            </Link>
                        </div>
                    </div>
                )}
                {status && (
                    <p className="text-muted-foreground py-6 text-center text-sm">{status}</p>
                )}
            </div>

            <div aria-live="polite" className="sr-only">
                {announcement}
            </div>

            {!isSheet && (
                <p className="text-muted-foreground text-xs pointer-coarse:hidden">
                    Use arrows to move, Enter to open
                    {activeAction ? `, Shift+Enter to ${activeAction.hint}` : ""}, Esc to close
                </p>
            )}
        </>
    );
};

export interface SearchPaletteProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    games?: SearchGame[];
    dashboard?: DashboardSearch | null;
}

const SearchPalette = ({
    open,
    onOpenChange,
    games: providedGames,
    dashboard = null,
}: SearchPaletteProps) => {
    const { games, hasFailed } = useSearchGames(open, providedGames ?? dashboard?.games);
    const { isMd } = useBreakpoint("md");
    const isSheet = !isMd;
    const close = () => onOpenChange(false);
    const sheetHistory = useCloseOnBrowserBack(open && isSheet, close);
    const afterDialogCloseRef = useRef<(() => void) | null>(null);
    const [calendarGame, setCalendarGame] = useState<SearchGame | null>(null);
    const [communityHref, setCommunityHref] = useState<string | null>(null);

    return (
        <>
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogPortal>
                    <DialogOverlay className="z-[70] bg-black/60 backdrop-blur-sm motion-reduce:data-[state=closed]:animate-none motion-reduce:data-[state=open]:animate-none" />
                    <DialogPrimitive.Content
                        aria-describedby={undefined}
                        onCloseAutoFocus={(e) => {
                            focusVisibleTrigger(e);
                            const afterClose = afterDialogCloseRef.current;
                            afterDialogCloseRef.current = null;
                            afterClose?.();
                        }}
                        className={cn(
                            "bg-card text-card-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed z-[70] flex flex-col duration-150 focus-visible:outline-hidden motion-reduce:data-[state=closed]:animate-none motion-reduce:data-[state=open]:animate-none",
                            isSheet
                                ? "inset-0 h-dvh w-full pt-[env(safe-area-inset-top)]"
                                : "border-foreground/20 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 top-[10vh] left-1/2 w-[calc(100%-2rem)] max-w-[560px] -translate-x-1/2 gap-4 overflow-hidden rounded-lg border-2 p-6 shadow-2xl",
                        )}
                    >
                        <PaletteBody
                            games={games}
                            hasFailed={hasFailed}
                            isSheet={isSheet}
                            dashboard={dashboard}
                            onNavigate={() => {
                                sheetHistory.release();
                                close();
                            }}
                            onClose={close}
                            onCloseThen={(callback) => {
                                if (isSheet) {
                                    sheetHistory.runAfterClose(callback);
                                } else {
                                    afterDialogCloseRef.current = callback;
                                }
                                close();
                            }}
                            onOpenCalendar={setCalendarGame}
                            onConfirmCommunityLink={setCommunityHref}
                        />
                    </DialogPrimitive.Content>
                </DialogPortal>
            </Dialog>
            <CalendarSubscribeDialog
                open={!!calendarGame}
                onOpenChange={(isOpen) => !isOpen && setCalendarGame(null)}
                gameSlug={calendarGame?.slug}
                gameName={calendarGame?.name}
            />
            <CommunityWebsiteModal
                open={!!communityHref}
                onOpenChange={() => setCommunityHref(null)}
                onConfirm={() => {
                    if (communityHref) {
                        window.open(communityHref, "_blank", "noopener,noreferrer");
                    }
                    setCommunityHref(null);
                }}
            />
        </>
    );
};

export default SearchPalette;
