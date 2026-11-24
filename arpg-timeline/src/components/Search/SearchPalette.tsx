"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Search, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { KeyboardEvent, useEffect, useId, useMemo, useRef, useState } from "react";

import { toGameCandidate } from "@/lib/search/aliases";
import { formatGameMeta, getDatelessDescription } from "@/lib/search/gameMeta";
import { loadSearchIndex } from "@/lib/search/loadSearchIndex";
import { prepareCandidates, PreparedCandidate, searchCandidates } from "@/lib/search/match";
import { SearchGame } from "@/lib/search/types";
import { Dialog, DialogClose, DialogOverlay, DialogPortal, DialogTitle } from "@/ui/Dialog";

import { GameResultRow } from "./SearchResultRow";
import { SEARCH_TRIGGER_ATTRIBUTE } from "./SearchTrigger";

const GAME_LIMIT = 6;

const preparedGames = new WeakMap<SearchGame[], PreparedCandidate<SearchGame>[]>();

const getPreparedGames = (games: SearchGame[]) => {
    let prepared = preparedGames.get(games);
    if (!prepared) {
        prepared = prepareCandidates(games.map(toGameCandidate));
        preparedGames.set(games, prepared);
    }
    return prepared;
};

const NO_RESULTS_ACTION_CLASS_NAME =
    "border-foreground/20 hover:border-foreground/40 text-muted-foreground hover:text-foreground focus-visible:ring-ring inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-md border px-3 text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:outline-hidden";

const gameHref = (game: SearchGame) => `/game/${game.slug}`;

const focusVisibleTrigger = (e: Event) => {
    e.preventDefault();
    const triggers = document.querySelectorAll<HTMLElement>(`[${SEARCH_TRIGGER_ATTRIBUTE}]`);
    Array.from(triggers)
        .find((trigger) => trigger.offsetParent !== null)
        ?.focus();
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

interface PaletteBodyProps {
    games: SearchGame[] | null;
    hasFailed: boolean;
    onClose: () => void;
}

const PaletteBody = ({ games, hasFailed, onClose }: PaletteBodyProps) => {
    const router = useRouter();
    const [query, setQuery] = useState("");
    const [activeIndex, setActiveIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const baseId = useId();
    const listboxId = `${baseId}-listbox`;
    const groupLabelId = `${baseId}-games`;
    const optionId = (index: number) => `${baseId}-option-${index}`;

    const results = useMemo(
        () => (games ? searchCandidates(getPreparedGames(games), query).slice(0, GAME_LIMIT) : []),
        [games, query],
    );
    const safeIndex = Math.min(activeIndex, results.length - 1);
    const activeResult = results[safeIndex];
    const hasQuery = query.trim().length > 0;

    useEffect(() => {
        document
            .getElementById(`${baseId}-option-${safeIndex}`)
            ?.scrollIntoView({ block: "nearest" });
    }, [baseId, safeIndex]);

    const openGame = (game: SearchGame, inNewTab: boolean) => {
        if (inNewTab) {
            window.open(gameHref(game), "_blank", "noopener");
            return;
        }
        router.push(gameHref(game));
        onClose();
    };

    const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        const count = results.length;
        if (e.key === "ArrowDown" && count) {
            e.preventDefault();
            setActiveIndex((safeIndex + 1) % count);
        } else if (e.key === "ArrowUp" && count) {
            e.preventDefault();
            setActiveIndex((safeIndex - 1 + count) % count);
        } else if (e.key === "Enter" && activeResult) {
            e.preventDefault();
            openGame(activeResult.item, e.metaKey || e.ctrlKey);
        }
    };

    const hasNoResults = hasQuery && !!games && results.length === 0;
    const status = hasFailed
        ? "Couldn't load games. Close and try again."
        : !hasQuery
          ? "Type a game name or a short name like poe2."
          : !games
            ? "Loading games..."
            : null;

    const announcement =
        !hasQuery || !games
            ? ""
            : results.length === 0
              ? "No results"
              : `${results.length} ${results.length === 1 ? "result" : "results"}`;

    const clearSearch = () => {
        setQuery("");
        setActiveIndex(0);
        inputRef.current?.focus();
    };

    return (
        <>
            <div className="flex items-start justify-between gap-4">
                <div className="flex flex-col gap-0.5">
                    <DialogTitle className="font-heading text-foreground text-base font-medium">
                        Find a game
                    </DialogTitle>
                    <p className="text-muted-foreground text-xs">
                        Search by name or short name, like poe2 or d4
                    </p>
                </div>
                <DialogClose
                    aria-label="Close search"
                    className="text-muted-foreground hover:text-foreground focus-visible:ring-ring cursor-pointer rounded-sm p-1 transition-colors focus-visible:ring-2 focus-visible:outline-hidden"
                >
                    <X className="h-4 w-4" />
                </DialogClose>
            </div>

            <div className="border-foreground/20 bg-background/60 focus-within:border-foreground/40 flex items-center gap-2 rounded-md border px-3 transition-colors">
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
                    placeholder="Search games, pages..."
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setActiveIndex(0);
                    }}
                    onKeyDown={onKeyDown}
                    className="placeholder:text-muted-foreground h-11 flex-1 bg-transparent text-base outline-hidden md:text-sm [&::-webkit-search-cancel-button]:hidden"
                />
            </div>

            <div
                id={listboxId}
                role="listbox"
                aria-label="Search results"
                className="-mx-1 max-h-[380px] overflow-y-auto px-1"
            >
                {results.length > 0 && (
                    <div
                        role="group"
                        aria-labelledby={groupLabelId}
                        className="flex flex-col gap-1.5"
                    >
                        <div
                            id={groupLabelId}
                            role="presentation"
                            className="text-muted-foreground pb-0.5 text-xs font-semibold tracking-wider uppercase"
                        >
                            Games
                        </div>
                        {results.map((result, index) => (
                            <GameResultRow
                                key={result.item.slug}
                                id={optionId(index)}
                                href={gameHref(result.item)}
                                name={result.item.name}
                                meta={formatGameMeta(
                                    result.item,
                                    getDatelessDescription(result.item),
                                    result.matchedAlias,
                                )}
                                logoSrc={result.item.logoSrc}
                                highlight={result.highlight}
                                isActive={index === safeIndex}
                                onHover={() => setActiveIndex(index)}
                                onNavigate={onClose}
                            />
                        ))}
                    </div>
                )}
                {hasNoResults && (
                    <div className="flex flex-col items-center gap-1 py-6 text-center text-sm">
                        <p className="text-foreground">No results for &quot;{query.trim()}&quot;</p>
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

            <p className="text-muted-foreground text-xs pointer-coarse:hidden">
                Use arrows to move, Enter to open, Esc to close
            </p>
        </>
    );
};

export interface SearchPaletteProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    games?: SearchGame[];
}

const SearchPalette = ({ open, onOpenChange, games: providedGames }: SearchPaletteProps) => {
    const { games, hasFailed } = useSearchGames(open, providedGames);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogPortal>
                <DialogOverlay className="bg-black/60 backdrop-blur-sm motion-reduce:data-[state=closed]:animate-none motion-reduce:data-[state=open]:animate-none" />
                <DialogPrimitive.Content
                    aria-describedby={undefined}
                    onCloseAutoFocus={focusVisibleTrigger}
                    className="bg-card text-card-foreground border-foreground/20 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[10vh] left-1/2 z-50 flex w-[calc(100%-2rem)] max-w-[560px] -translate-x-1/2 flex-col gap-4 overflow-hidden rounded-lg border-2 p-4 shadow-2xl duration-150 focus-visible:outline-hidden motion-reduce:data-[state=closed]:animate-none motion-reduce:data-[state=open]:animate-none md:p-6"
                >
                    <PaletteBody
                        games={games}
                        hasFailed={hasFailed}
                        onClose={() => onOpenChange(false)}
                    />
                </DialogPrimitive.Content>
            </DialogPortal>
        </Dialog>
    );
};

export default SearchPalette;
