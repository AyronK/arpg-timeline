"use client";

import { Check, Copy, Layers } from "lucide-react";
import Image from "next/image";
import { SanityImageAssetDocument } from "next-sanity";
import { ReactNode, useCallback, useMemo, useState, useSyncExternalStore } from "react";

import { SanityImage } from "@/components/SanityImage";
import { getGameFilterGroup } from "@/hooks/useGameFiltersData";
import { GameCategory } from "@/lib/cms/gameTags";
import { sa_event } from "@/lib/sa_event";
import { cn } from "@/lib/utils";
import { Button } from "@/ui/Button";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL;
const ALL = "all";

export type CalendarGameOption = {
    name: string;
    slug: string;
    logo?: SanityImageAssetDocument | null;
    categories?: GameCategory[] | null;
};

const feedUrl = (slug: string) =>
    slug === ALL ? `${SITE_URL}/calendar/subscribe` : `${SITE_URL}/calendar/subscribe/${slug}`;

// Preselect from ?game=slug so game pages can deep-link here
const noopSubscribe = () => () => { };
const getGameParam = () => new URLSearchParams(window.location.search).get("game");

const toWebcal = (url: string) => url.replace(/^https?:/, "webcal:");

const GameLogo = ({ game, className }: { game?: CalendarGameOption; className?: string }) => (
    <div className={cn("grid shrink-0 place-content-center overflow-hidden rounded-md", className)}>
        {!game ? (
            <Layers className="text-muted-foreground m-auto h-1/2 min-h-6 w-1/2 min-w-6" />
        ) : game.logo ? (
            <SanityImage
                loading="lazy"
                src={game.logo}
                alt=""
                width={128}
                height={128}
                objectFit="contain"
                className="h-full w-full"
            />
        ) : (
            <span className="text-muted-foreground text-xs">{game.name.charAt(0)}</span>
        )}
    </div>
);

// Mirrors the tiles in FiltersDialog, but single-select
const GameTile = ({
    game,
    selected,
    onSelect,
}: {
    game?: CalendarGameOption;
    selected: boolean;
    onSelect: () => void;
}) => (
    <button
        type="button"
        role="radio"
        aria-checked={selected}
        onClick={onSelect}
        className={cn(
            "group relative flex h-28 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border-2 p-2 transition-all duration-200 select-none md:h-36",
            selected ? "bg-card shadow-sm shadow-neutral-950/80" : "hover:border-foreground/10",
        )}
    >
        {selected && (
            <span className="bg-foreground text-background absolute top-1.5 right-1.5 grid h-4 w-4 place-content-center rounded-full">
                <Check className="h-3 w-3" strokeWidth={3} />
            </span>
        )}
        <GameLogo game={game} className="h-14 w-14 lg:h-20 lg:w-20" />
        <span
            className={cn(
                "text-center text-xs leading-tight font-medium transition-all duration-200",
                selected ? "text-primary" : "text-muted-foreground",
            )}
        >
            {game?.name ?? "All games"}
        </span>
    </button>
);

const AppLink = ({
    href,
    icon,
    label,
    onClick,
}: {
    href: string;
    icon: ReactNode;
    label: string;
    onClick: () => void;
}) => (
    <Button asChild variant="ghost" size="sm" className="gap-2">
        <a
            href={href}
            target={href.startsWith("webcal:") ? undefined : "_blank"}
            rel="noopener noreferrer nofollow"
            onClick={onClick}
        >
            {icon}
            {label}
        </a>
    </Button>
);

export const CalendarSubscribePicker = ({ games }: { games: CalendarGameOption[] }) => {
    const presetSlug = useSyncExternalStore(noopSubscribe, getGameParam, () => null);
    const [picked, setSelected] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    const selected = picked ?? (games.some((g) => g.slug === presetSlug) ? presetSlug! : ALL);

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

    const selectedGame = games.find((g) => g.slug === selected);
    const url = feedUrl(selected);
    const calendarName = selectedGame
        ? `arpg-timeline.com | ${selectedGame.name}`
        : "arpg-timeline.com";

    const track = useCallback(
        (app: string) => sa_event("calendar_subscribe_action", { game: selected, app }),
        [selected],
    );

    const handleCopy = useCallback(async () => {
        await navigator.clipboard.writeText(url);
        track("copy");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }, [url, track]);

    return (
        <div role="radiogroup" aria-label="Calendar feed" className="flex flex-col gap-6">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 xl:grid-cols-8">
                <GameTile selected={selected === ALL} onSelect={() => setSelected(ALL)} />
            </div>
            {groups.map(([group, { games: groupGames }]) => (
                <div key={group} className="flex flex-col gap-4">
                    <h3 className="text-lg font-semibold">{group}</h3>
                    <div className="grid auto-rows-fr grid-cols-2 gap-3 sm:grid-cols-4 xl:grid-cols-8">
                        {groupGames.map((g) => (
                            <GameTile
                                key={g.slug}
                                game={g}
                                selected={selected === g.slug}
                                onSelect={() => setSelected(g.slug)}
                            />
                        ))}
                    </div>
                </div>
            ))}

            <div className="bg-card/95 sticky bottom-4 z-20 flex flex-col gap-3 rounded-lg border p-3 shadow-lg shadow-neutral-950/80 backdrop-blur md:flex-row md:items-center md:gap-4 md:p-4">
                <div className="flex min-w-0 flex-1 items-center gap-3">
                    <div className="flex min-w-0 flex-col">
                        <span className="text-muted-foreground text-xs">Subscribe to</span>
                        <span className="font-heading truncate">
                            {selectedGame?.name ?? "All games"}
                        </span>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
                    <AppLink
                        href={`https://calendar.google.com/calendar/render?cid=${encodeURIComponent(toWebcal(url))}`}
                        onClick={() => track("google")}
                        label="Google"
                        icon={
                            <Image
                                src="/assets/third-party/google-calendar-logo.png"
                                alt=""
                                width={16}
                                height={16}
                            />
                        }
                    />
                    <AppLink
                        href={toWebcal(url)}
                        onClick={() => track("webcal")}
                        label="Apple"
                        icon={
                            <Image
                                unoptimized
                                src="/assets/third-party/apple-logo.svg"
                                alt=""
                                width={12}
                                height={16}
                            />
                        }
                    />
                    <AppLink
                        href={`https://outlook.live.com/calendar/0/addfromweb?url=${encodeURIComponent(url)}&name=${encodeURIComponent(calendarName)}`}
                        onClick={() => track("outlook")}
                        label="Outlook"
                        icon={
                            <Image
                                src="/assets/third-party/outlook-logo.png"
                                alt=""
                                width={16}
                                height={16}
                            />
                        }
                    />
                    <Button onClick={handleCopy} variant="ghost" size="sm" className="gap-2">
                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        {copied ? "Copied" : "Copy iCal link"}
                    </Button>
                </div>
            </div>
        </div>
    );
};
