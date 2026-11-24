"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { KeyboardEvent, useEffect, useId, useMemo, useState } from "react";

import { toGameCandidate } from "@/lib/search/aliases";
import { loadSearchIndex } from "@/lib/search/loadSearchIndex";
import { prepareCandidates, PreparedCandidate, searchCandidates } from "@/lib/search/match";
import { SearchGame } from "@/lib/search/types";
import { Dialog, DialogClose, DialogOverlay, DialogPortal, DialogTitle } from "@/ui/Dialog";
import { Kbd } from "@/ui/Kbd";

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

    const status = hasFailed
        ? "Couldn't load games. Close and try again."
        : !hasQuery
          ? "Type a game name or a short name like poe2."
          : !games
            ? "Loading games..."
            : results.length === 0
              ? `No results for "${query.trim()}"`
              : null;

    const announcement =
        hasQuery && games ? `${results.length} ${results.length === 1 ? "result" : "results"}` : "";

    return (
        <>
            <div className="flex items-center gap-2 border-b px-3">
                <Search className="text-muted-foreground h-4 w-4 shrink-0" />
                <input
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
                    className="placeholder:text-muted-foreground h-12 flex-1 bg-transparent text-base outline-hidden md:text-sm [&::-webkit-search-cancel-button]:hidden"
                />
                <DialogClose className="cursor-pointer" aria-label="Close search">
                    <Kbd>Esc</Kbd>
                </DialogClose>
            </div>

            <div
                id={listboxId}
                role="listbox"
                aria-label="Search results"
                className="max-h-[380px] overflow-y-auto p-2"
            >
                {results.length > 0 && (
                    <div role="group" aria-labelledby={groupLabelId}>
                        <div
                            id={groupLabelId}
                            role="presentation"
                            className="text-muted-foreground px-3 pt-1 pb-1.5 text-[11px] font-semibold tracking-wider uppercase"
                        >
                            Games
                        </div>
                        {results.map((result, index) => (
                            <GameResultRow
                                key={result.item.slug}
                                id={optionId(index)}
                                href={gameHref(result.item)}
                                name={result.item.name}
                                highlight={result.highlight}
                                isActive={index === safeIndex}
                                onHover={() => setActiveIndex(index)}
                                onNavigate={onClose}
                            />
                        ))}
                    </div>
                )}
                {status && (
                    <p className="text-muted-foreground px-3 py-6 text-center text-sm">{status}</p>
                )}
            </div>

            <div aria-live="polite" className="sr-only">
                {announcement}
            </div>

            <div className="text-muted-foreground flex items-center gap-4 border-t px-3 py-2 text-xs">
                <span className="flex items-center gap-1">
                    <Kbd>↑</Kbd>
                    <Kbd>↓</Kbd>
                    navigate
                </span>
                <span className="flex items-center gap-1">
                    <Kbd>↵</Kbd>
                    open
                </span>
                <span className="flex items-center gap-1">
                    <Kbd>Esc</Kbd>
                    close
                </span>
            </div>
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
                    className="font-ui bg-card text-card-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[10vh] left-1/2 z-50 flex w-[calc(100%-2rem)] max-w-[560px] -translate-x-1/2 flex-col overflow-hidden rounded-xl border shadow-2xl duration-150 focus-visible:outline-hidden motion-reduce:data-[state=closed]:animate-none motion-reduce:data-[state=open]:animate-none"
                >
                    <DialogTitle className="sr-only">Search</DialogTitle>
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
