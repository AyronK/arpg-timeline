import { SanityImageAssetDocument } from "next-sanity";

import { GuardedExternalLink } from "@/components/GuardedExternalLink";
import { SanityImage } from "@/components/SanityImage";
import { Content } from "@/hoc/GameToSeasonWidget/Content";
import { Game } from "@/lib/cms/games.types";
import { buildSeasonTerms } from "@/lib/seasonTerms";
import { cn } from "@/lib/utils";
import { addUTMParameters } from "@/lib/utm";
import { Chip } from "@/ui/Chip";

import { formatApproxMonths, TimelineEntry } from "../timeline";

interface TimelineEntryCardProps {
    entry: TimelineEntry;
    gameLogo: SanityImageAssetDocument;
    align: "left" | "right";
    game?: Game;
}

const STATUS_CHIP: Partial<Record<TimelineEntry["status"], { label: string; className: string }>> =
    {
        live: { label: "Now", className: "bg-sky-800 border border-transparent" },
        upcoming: { label: "Next", className: "bg-emerald-800 border border-transparent" },
    };

const linkClassName = "text-card-foreground hover:text-card-foreground/80 text-sm hover:underline";

export const TimelineEntryCard = ({ entry, gameLogo, align, game }: TimelineEntryCardProps) => {
    const chip = STATUS_CHIP[entry.status];
    const duration =
        entry.durationDays !== null
            ? formatApproxMonths(entry.durationDays)
            : entry.status === "live"
              ? "Ongoing"
              : null;

    const selector =
        game && entry.status === "live" && entry.id === game.currentSeason?._id
            ? "current"
            : game && entry.status === "upcoming" && entry.id === game.nextSeason?._id
              ? "next"
              : null;
    const nextHasPatchNotes =
        selector === "next" && !!game?.nextSeason?.start?.confirmed && !!game.nextSeason.start.startDate;
    const showPatchNotes = !!entry.patchNotesUrl && selector !== null && !nextHasPatchNotes;
    const showUrl = !!entry.url && selector !== null;

    const withUtm = (campaign: string, url: string) =>
        addUTMParameters({
            utm_source: "arpg-timeline",
            utm_medium: "link",
            utm_campaign: campaign,
            utm_content: game?.slug ?? "",
        })(url);

    return (
        <div
            className={cn(
                "bg-card text-card-foreground flex flex-col gap-3 rounded-lg border p-3 md:p-4",
                entry.status === "live" && "border-sky-500/50",
            )}
        >
            <div
                className={cn(
                    "flex items-center gap-3 md:gap-4",
                    align === "left" && "md:flex-row-reverse md:text-right",
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
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <div
                        className={cn(
                            "flex flex-wrap items-center gap-2",
                            align === "left" && "md:justify-end",
                        )}
                    >
                        <h3 className="font-heading text-base leading-tight break-words md:text-lg">
                            {entry.name}
                        </h3>
                        {chip && <Chip className={cn(chip.className, "min-w-12 text-center")}>{chip.label}</Chip>}
                        {entry.isSideEvent && (
                            <span className="text-foreground font-heading rounded-md border border-rose-400/75 bg-rose-400/15 px-1 py-[1px] text-xs leading-4 font-semibold select-none">
                                side event
                            </span>
                        )}
                    </div>
                    <div className="text-muted-foreground text-sm">
                        <span className="text-foreground font-medium">{entry.startLabel}</span>
                        {duration && <span>{` · ${duration}`}</span>}
                    </div>
                </div>
            </div>
            {game && selector && (
                <div className="flex flex-col gap-2 text-left">
                    <Content game={game} selector={selector} />
                </div>
            )}
            {game && (showUrl || showPatchNotes) && (
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-left">
                    {showUrl && (
                        <GuardedExternalLink
                            href={withUtm("season-link", entry.url!)}
                            isOfficial={game.isOfficial}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={linkClassName}
                            data-sa-click={`${entry.name}-season-link`}
                        >
                            {buildSeasonTerms(game.seasonKeyword).One} page
                        </GuardedExternalLink>
                    )}
                    {showPatchNotes && (
                        <GuardedExternalLink
                            href={withUtm("patch-notes", entry.patchNotesUrl!)}
                            isOfficial={game.isOfficial}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={linkClassName}
                            data-sa-click={`${entry.name}-patch-notes`}
                        >
                            Patch notes
                        </GuardedExternalLink>
                    )}
                </div>
            )}
        </div>
    );
};
