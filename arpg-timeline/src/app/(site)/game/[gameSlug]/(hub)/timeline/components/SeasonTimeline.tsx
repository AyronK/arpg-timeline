import { SanityImageAssetDocument } from "next-sanity";

import { Game } from "@/lib/cms/games.types";
import { cn } from "@/lib/utils";

import { TimelineGroup, TimelineStatus } from "../timeline";
import { TimelineEntryCard } from "./TimelineEntryCard";

const DOT_COLOR: Record<TimelineStatus, string> = {
    live: "border-sky-500",
    upcoming: "border-emerald-500",
    past: "border-muted-foreground",
};

interface SeasonTimelineProps {
    groups: TimelineGroup[];
    gameLogo: SanityImageAssetDocument;
    game?: Game;
    ctaEntryId?: string;
    latestEntryId?: string;
    cadenceHint?: string | null;
}

export const SeasonTimeline = ({
    groups,
    gameLogo,
    game,
    ctaEntryId,
    latestEntryId,
    cadenceHint,
}: SeasonTimelineProps) => {
    let index = 0;

    return (
        <div className="relative w-full">
            <div
                aria-hidden
                className="bg-border absolute top-0 bottom-0 left-3 w-px -translate-x-1/2 lg:left-1/2"
            />
            {groups.map((group) => (
                <section key={group.key} id={`year-${group.key}`} aria-label={group.label}>
                    <h2 className="py-2 pl-10 lg:pl-0 lg:text-center">
                        <span className="bg-background font-heading text-muted-foreground inline-block rounded-md border px-3 py-1 text-sm md:text-base">
                            {group.label}
                        </span>
                    </h2>
                    <ol className="space-y-4 pb-4 md:space-y-6">
                        {group.entries.map((entry) => {
                            // Next starts on the right, Now on the left
                            const left = index++ % 2 === 1;
                            return (
                                <li
                                    key={entry.id}
                                    className="reveal-on-scroll relative pl-10 lg:grid lg:grid-cols-2 lg:gap-x-12 lg:pl-0"
                                >
                                    <span
                                        aria-hidden
                                        className={cn(
                                            "bg-background absolute top-6 left-3 size-3 -translate-x-1/2 rounded-full border-2 lg:left-1/2",
                                            DOT_COLOR[entry.status],
                                        )}
                                    />
                                    <div className={left ? "lg:col-start-1" : "lg:col-start-2"}>
                                        <TimelineEntryCard
                                            entry={entry}
                                            gameLogo={gameLogo}
                                            game={game}
                                            showCtas={entry.id === ctaEntryId}
                                            isDormantLatest={entry.id === latestEntryId}
                                            cadenceHint={cadenceHint}
                                            align={left ? "left" : "right"}
                                        />
                                    </div>
                                </li>
                            );
                        })}
                    </ol>
                </section>
            ))}
        </div>
    );
};
