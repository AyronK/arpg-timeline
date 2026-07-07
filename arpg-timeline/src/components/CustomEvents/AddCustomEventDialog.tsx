"use client";

import { Plus } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

import { CustomEvent } from "@/types/customEvent";
import { Button } from "@/ui/Button";
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from "@/ui/Command";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/ui/Dialog";

interface UpcomingGameResult {
    id: number;
    name: string;
    date: string;
    imageUrl: string | null;
}

const SEARCH_DEBOUNCE_MS = 300;

export const AddCustomEventDialog = ({ onAdd }: { onAdd: (event: CustomEvent) => void }) => {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [results, setResults] = useState<UpcomingGameResult[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    const [selected, setSelected] = useState<UpcomingGameResult | null>(null);
    const [startDate, setStartDate] = useState("");
    const [error, setError] = useState<string | null>(null);
    const searchContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!query.trim() || selected) {
            setResults([]);
            return;
        }

        setIsSearching(true);
        const timeout = setTimeout(async () => {
            try {
                const response = await fetch(
                    `/api/internal/igdb/upcoming-games?q=${encodeURIComponent(query)}`,
                );
                if (!response.ok) throw new Error("Search failed");
                const data = await response.json();
                setResults(data.games ?? []);
            } catch {
                setResults([]);
            } finally {
                setIsSearching(false);
            }
        }, SEARCH_DEBOUNCE_MS);

        return () => clearTimeout(timeout);
    }, [query, selected]);

    useEffect(() => {
        if (!dropdownOpen) return;

        const handlePointerDown = (event: PointerEvent) => {
            if (!searchContainerRef.current?.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener("pointerdown", handlePointerDown);
        return () => document.removeEventListener("pointerdown", handlePointerDown);
    }, [dropdownOpen]);

    const handleSelect = useCallback((game: UpcomingGameResult) => {
        setDropdownOpen(false);
        setError(null);
        setSelected(game);
        setStartDate(game.date);
    }, []);

    const resetState = useCallback(() => {
        setQuery("");
        setResults([]);
        setSelected(null);
        setStartDate("");
        setError(null);
        setDropdownOpen(false);
    }, []);

    const handleOpenChange = (nextOpen: boolean) => {
        setOpen(nextOpen);
        if (!nextOpen) resetState();
    };

    const handleSubmit = () => {
        if (!selected || !startDate) return;
        onAdd({
            id: crypto.randomUUID(),
            name: selected.name,
            imageUrl: selected.imageUrl,
            startDate,
            createdAt: new Date().toISOString(),
        });
        handleOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <button
                    type="button"
                    className="bg-card hover:bg-accent order-last flex flex-col items-center justify-center gap-2 rounded-md border border-dashed p-6 text-center transition-colors"
                >
                    <Plus className="h-5 w-5" />
                    <span className="text-sm font-medium">Add Custom Event</span>
                    <span className="text-muted-foreground hidden text-xs lg:block">
                        Track any upcoming game release on your dashboard
                    </span>
                </button>
            </DialogTrigger>
            <DialogContent className="min-h-[300px]">
                <DialogHeader>
                    <DialogTitle>Add Custom Event</DialogTitle>
                    <DialogDescription>
                        Search for an upcoming game to track its release date on your dashboard.
                    </DialogDescription>
                </DialogHeader>

                {!selected ? (
                    <div ref={searchContainerRef} className="relative">
                        <Command shouldFilter={false} className="overflow-visible">
                            <CommandInput
                                placeholder="Search upcoming games..."
                                value={query}
                                onValueChange={(value) => {
                                    setQuery(value);
                                    setDropdownOpen(true);
                                }}
                                onFocus={() => setDropdownOpen(true)}
                                onKeyDown={(event) => {
                                    if (event.key === "Escape") setDropdownOpen(false);
                                }}
                            />
                            {/* TODO: clicking a result with the mouse closes this dropdown without
                                selecting it (keyboard selection via arrow keys + Enter works fine).
                                Root cause not yet found - tried removing Radix Popover in favor of
                                this plain absolutely-positioned dropdown, didn't fix it either.
                                Workaround for now: use the keyboard to pick a result. */}
                            {dropdownOpen && (isSearching || query.trim()) && (
                                <div className="bg-popover text-popover-foreground border-foreground/35 absolute inset-x-0 top-full z-50 mt-1 rounded-md border shadow-xl">
                                    <CommandList>
                                        {isSearching && (
                                            <div className="text-muted-foreground p-4 text-sm">
                                                Searching...
                                            </div>
                                        )}
                                        {!isSearching && results.length === 0 && (
                                            <CommandEmpty>No upcoming games found.</CommandEmpty>
                                        )}
                                        {results.map((game) => (
                                            <CommandItem
                                                key={game.id}
                                                value={String(game.id)}
                                                onSelect={() => handleSelect(game)}
                                            >
                                                {game.imageUrl ? (
                                                    <Image
                                                        src={game.imageUrl}
                                                        alt={game.name}
                                                        width={28}
                                                        height={28}
                                                        className="rounded-sm object-cover"
                                                    />
                                                ) : (
                                                    <div className="bg-muted h-7 w-7 shrink-0 rounded-sm" />
                                                )}
                                                <span>{game.name}</span>
                                            </CommandItem>
                                        ))}
                                    </CommandList>
                                </div>
                            )}
                        </Command>
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-3">
                            {selected.imageUrl ? (
                                <Image
                                    src={selected.imageUrl}
                                    alt={selected.name}
                                    width={56}
                                    height={56}
                                    className="rounded-sm object-cover"
                                />
                            ) : (
                                <div className="bg-muted h-14 w-14 shrink-0 rounded-sm" />
                            )}
                            <div className="flex flex-col gap-1">
                                <span className="font-medium">{selected.name}</span>
                                <button
                                    type="button"
                                    className="text-muted-foreground w-fit text-left text-xs underline"
                                    onClick={() => setSelected(null)}
                                >
                                    Choose a different game
                                </button>
                            </div>
                        </div>
                        <label className="flex flex-col gap-1.5 text-sm">
                            Release date
                            <input
                                type="date"
                                required
                                value={startDate}
                                onChange={(event) => setStartDate(event.target.value)}
                                className="border-input bg-background rounded-md border px-3 py-2 text-sm"
                            />
                        </label>
                    </div>
                )}

                {error && <p className="text-destructive text-sm">{error}</p>}

                <DialogFooter>
                    <Button type="button" disabled={!selected || !startDate} onClick={handleSubmit}>
                        Add Event
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
