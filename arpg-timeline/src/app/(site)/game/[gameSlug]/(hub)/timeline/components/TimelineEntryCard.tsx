import { SanityImageAssetDocument } from "next-sanity";

import { SanityImage } from "@/components/SanityImage";
import { ChipColorMap } from "@/components/SeasonWidget";
import { Content } from "@/hoc/GameToSeasonWidget/Content";
import { Game } from "@/lib/cms/games.types";
import { cn } from "@/lib/utils";
import { addUTMParameters } from "@/lib/utm";
import { Chip } from "@/ui/Chip";

import { PatchNotesLink, SeasonBadgeRow, SeasonTitle } from "../../../components/SeasonCardParts";
import { SideEventChip } from "../../../components/SideEventChip";
import { formatApproxMonths, TimelineEntry } from "../timeline";
import { LocalStartDate } from "./LocalStartDate";
import { NextSeasonCtas } from "./NextSeasonCtas";

interface TimelineEntryCardProps {
    entry: TimelineEntry;
    gameLogo: SanityImageAssetDocument;
    align: "left" | "right";
    game?: Game;
    showCtas?: boolean;
}

const STATUS_CHIP: Partial<Record<TimelineEntry["status"], { label: string; className: string }>> =
    {
        live: { label: "Now", className: "bg-sky-800 border border-transparent" },
        upcoming: { label: "Next", className: "bg-emerald-800 border border-transparent" },
    };

// Game copy whose current season is this entry; null when its end is unknown (no progress to show)
const buildLiveGame = (game: Game, entry: TimelineEntry): Game | null => {
    const next = game.nextSeason;
    const nextMainStart =
        !entry.isSideEvent && next?.start?.confirmed && !next.isSideEvent
            ? next.start.startDate
            : null;
    const endDate = entry.endDate?.toISOString() ?? nextMainStart;
    if (!endDate || !entry.startDate) return null;

    return {
        ...game,
        currentSeason: {
            _id: entry.id,
            _updatedAt: "",
            name: entry.name,
            url: entry.url,
            patchNotesUrl: entry.patchNotesUrl,
            isSideEvent: entry.isSideEvent,
            start: { startDate: entry.startDate.toISOString(), confirmed: true },
            end: { endDate, confirmed: !!entry.endDate },
        },
    };
};

const DORMANT_LATEST_CHIP = { label: "Latest", className: ChipColorMap.dormant };

export const TimelineEntryCard = ({
    entry,
    gameLogo,
    align,
    game,
    showCtas,
}: TimelineEntryCardProps) => {
    // Dormant games: the newest entry is the last update, not something running now
    const isDormantLatest = !!game?.isDormant && entry.status === "live";
    const chip = isDormantLatest ? DORMANT_LATEST_CHIP : STATUS_CHIP[entry.status];
    const duration =
        entry.durationDays !== null
            ? formatApproxMonths(entry.durationDays)
            : entry.status === "live" && !isDormantLatest
              ? "Ongoing"
              : null;

    const selector =
        game && entry.status === "live" && entry.id === game.currentSeason?._id
            ? "current"
            : game && entry.status === "upcoming" && entry.id === game.nextSeason?._id
              ? "next"
              : null;
    // A league running alongside the current event gets its own progress, like the parsed current
    const liveContent =
        !selector && game && entry.status === "live" && !isDormantLatest && entry.startDate
            ? buildLiveGame(game, entry)
            : null;
    const contentGame = selector ? game : liveContent;
    const contentSelector = selector ?? (liveContent ? "current" : null);
    // Links on every running or upcoming card, like the Overview Now/Next cards
    const isActive = entry.status !== "past" && !isDormantLatest;
    const showPatchNotes = !!entry.patchNotesUrl && isActive;
    const showUrl = !!entry.url && isActive;

    const withUtm = (campaign: string, url: string) =>
        addUTMParameters({
            utm_source: "arpg-timeline",
            utm_medium: "link",
            utm_campaign: campaign,
            utm_content: game?.slug ?? "",
        })(url);

    const chips = (chip || entry.isSideEvent) && (
        <>
            {chip && (
                <Chip className={cn(chip.className, "min-w-12 text-center")}>{chip.label}</Chip>
            )}
            {entry.isSideEvent && <SideEventChip />}
        </>
    );
    const patchNotes = game && showPatchNotes && (
        <PatchNotesLink
            href={withUtm("patch-notes", entry.patchNotesUrl!)}
            isOfficial={game.isOfficial}
            saClick={`${entry.name}-patch-notes`}
        />
    );

    return (
        <div
            className={cn(
                "bg-card text-card-foreground flex flex-col gap-3 rounded-lg border p-3 md:p-4",
                entry.status === "live" && !isDormantLatest && "border-sky-500/50",
                entry.status === "upcoming" && "border-emerald-500/50",
            )}
        >
            {(chips || patchNotes) && <SeasonBadgeRow chips={chips} action={patchNotes} />}
            {/* Logo on the centre-line side; text always reads left to right like the Overview cards */}
            <div
                className={cn(
                    "flex items-center gap-3 md:gap-4",
                    align === "left" && "md:flex-row-reverse",
                )}
            >
                <div className="grid h-14 w-14 shrink-0 place-items-center md:h-24 md:w-24">
                    <SanityImage
                        loading="lazy"
                        src={entry.logo ?? gameLogo}
                        alt={`${entry.name} logo`}
                        width={96}
                        height={96}
                        objectFit="contain"
                        className="h-full w-full"
                    />
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                    <SeasonTitle
                        as="h3"
                        title={entry.name}
                        href={game && showUrl ? withUtm("season-link", entry.url!) : null}
                        isOfficial={!!game?.isOfficial}
                        className="text-base break-words md:text-lg"
                        saClick={`${entry.name}-season-link`}
                    />
                    <div className="text-muted-foreground text-sm">
                        <span className="text-foreground font-medium">
                            {entry.localizeStart && entry.startDate ? (
                                <LocalStartDate
                                    utcDate={entry.startDate.toISOString()}
                                    fallback={entry.startLabel}
                                />
                            ) : (
                                entry.startLabel
                            )}
                        </span>
                        {duration && <span>{` · ${duration}`}</span>}
                    </div>
                    {showCtas && (
                        <p className="text-muted-foreground text-xs">
                            Get updates via the buttons below.
                        </p>
                    )}
                </div>
            </div>
            {contentGame && contentSelector && (
                <div className="flex flex-col gap-2">
                    <Content
                        game={contentGame}
                        selector={contentSelector}
                        hidePatchNotes
                        progressTextBelow
                    />
                </div>
            )}
            {game && showCtas && <NextSeasonCtas gameSlug={game.slug} gameName={game.name} />}
        </div>
    );
};
