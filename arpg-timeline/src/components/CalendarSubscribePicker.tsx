"use client";

import { CalendarPlus, ChevronDown, Layers } from "lucide-react";
import { SanityImageAssetDocument } from "next-sanity";
import { useMemo, useState, useSyncExternalStore } from "react";

import { CalendarSubscribeDialog } from "@/components/CalendarSubscribeDialog";
import { CtaBannerContent, getCtaBannerClassName } from "@/components/CtaBanner";
import { SanityImage } from "@/components/SanityImage";
import { getGameFilterGroup } from "@/hooks/useGameFiltersData";
import { GameCategory } from "@/lib/cms/gameTags";
import { sa_event } from "@/lib/sa_event";
import { cn } from "@/lib/utils";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/ui/Collapsible";

const ALL = "all";

export type CalendarGameOption = {
    name: string;
    slug: string;
    logo?: SanityImageAssetDocument | null;
    categories?: GameCategory[] | null;
};

// Opens a game's dialog from ?game=slug so other pages can deep-link here
const noopSubscribe = () => () => {};
const getGameParam = () => new URLSearchParams(window.location.search).get("game");

// Mirrors the tiles in FiltersDialog, but each one opens the subscribe dialog
const GameTile = ({ game, onClick }: { game: CalendarGameOption; onClick: () => void }) => (
    <button
        type="button"
        onClick={onClick}
        aria-label={`Subscribe to ${game.name}`}
        className="group bg-card hover:border-foreground/20 relative flex h-28 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border-2 p-2 shadow-sm shadow-neutral-950/80 transition-all duration-200 select-none md:h-36"
    >
        <CalendarPlus className="text-muted-foreground absolute top-2 right-2 h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100" />
        <div className="h-14 w-14 overflow-hidden rounded-md lg:h-20 lg:w-20">
            {game.logo ? (
                <SanityImage
                    loading="lazy"
                    src={game.logo}
                    alt=""
                    width={256}
                    height={256}
                    objectFit="contain"
                    className="h-full w-full"
                />
            ) : (
                <div className="text-muted-foreground flex h-full w-full items-center justify-center text-xs">
                    {game.name.charAt(0)}
                </div>
            )}
        </div>
        <span className="text-center text-xs leading-tight font-medium">{game.name}</span>
    </button>
);

export const CalendarSubscribePicker = ({ games }: { games: CalendarGameOption[] }) => {
    const presetSlug = useSyncExternalStore(noopSubscribe, getGameParam, () => null);
    const [openSlug, setOpenSlug] = useState<string | null>(null);
    const [presetDismissed, setPresetDismissed] = useState(false);

    const activeSlug =
        openSlug ??
        (!presetDismissed && games.some((g) => g.slug === presetSlug) ? presetSlug : null);
    const activeGame = games.find((g) => g.slug === activeSlug);

    const groups = useMemo(() => {
        const byGroup = new Map<string, { priority: number; games: CalendarGameOption[] }>();
        for (const g of games) {
            const { group, groupPriority } = getGameFilterGroup(g.categories);
            const entry = byGroup.get(group) ?? { priority: groupPriority, games: [] };
            entry.games.push(g);
            byGroup.set(group, entry);
        }
        return [...byGroup.entries()].sort((a, b) => a[1].priority - b[1].priority);
    }, [games]);

    const open = (slug: string) => {
        sa_event("calendar_subscribe_opened", { game: slug });
        setOpenSlug(slug);
    };

    return (
        <div className="flex flex-col gap-4 md:gap-8">
            <div
                role="button"
                tabIndex={0}
                onClick={() => open(ALL)}
                onKeyDown={(e) => {
                    if (e.key !== "Enter" && e.key !== " ") return;
                    e.preventDefault();
                    open(ALL);
                }}
                data-sa-click="calendar-page-all-games"
                className={cn(getCtaBannerClassName("white"), "cursor-pointer")}
            >
                <CtaBannerContent
                    icon={<Layers className="m-auto h-5 w-5 opacity-70 md:h-6 md:w-6" />}
                    title="All games"
                    description={`Every season and stream from all ${games.length} games, including new ones as they're added.`}
                    actionLabel="Subscribe"
                    color="white"
                />
            </div>

            {groups.map(([group, { games: groupGames }], i) => (
                // Collapsible on mobile only; always expanded from md up
                <Collapsible key={group} defaultOpen={i === 0} className="group/section">
                    <CollapsibleTrigger className="flex w-full cursor-pointer items-center gap-2 py-1 text-left md:pointer-events-none">
                        <h3 className="text-lg font-semibold">{group}</h3>
                        <span className="text-muted-foreground text-sm">{groupGames.length}</span>
                        <ChevronDown className="text-muted-foreground ml-auto h-5 w-5 transition-transform group-data-[state=open]/section:rotate-180 md:hidden" />
                    </CollapsibleTrigger>
                    <CollapsibleContent
                        forceMount
                        className="data-[state=closed]:hidden md:data-[state=closed]:block"
                    >
                        <div className="grid auto-rows-fr grid-cols-2 gap-3 pt-4 sm:grid-cols-4 xl:grid-cols-8">
                            {groupGames.map((g) => (
                                <GameTile key={g.slug} game={g} onClick={() => open(g.slug)} />
                            ))}
                        </div>
                    </CollapsibleContent>
                </Collapsible>
            ))}

            <CalendarSubscribeDialog
                open={activeSlug !== null}
                onOpenChange={(isOpen) => {
                    if (isOpen) return;
                    setOpenSlug(null);
                    setPresetDismissed(true);
                }}
                gameSlug={activeGame?.slug}
                gameName={activeGame?.name}
            />
        </div>
    );
};
