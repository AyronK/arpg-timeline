"use client";

import { SanityImageAssetDocument } from "next-sanity";
import { useId, useMemo, useState } from "react";

import { Game } from "@/lib/cms/games.types";
import { Switch } from "@/ui/Switch";

import { groupByYear, TimelineEntry } from "../timeline";
import { SeasonTimeline } from "./SeasonTimeline";

interface TimelineViewProps {
    entries: TimelineEntry[];
    gameLogo: SanityImageAssetDocument;
    game: Game;
    emptyText: string;
}

export const TimelineView = ({ entries, gameLogo, game, emptyText }: TimelineViewProps) => {
    const switchId = useId();
    const [showSideEvents, setShowSideEvents] = useState(true);
    const hasSideEvents = entries.some((e) => e.isSideEvent);

    const groups = useMemo(
        () => groupByYear(showSideEvents ? entries : entries.filter((e) => !e.isSideEvent)),
        [entries, showSideEvents],
    );

    if (entries.length === 0) {
        return <p className="text-muted-foreground">{emptyText}</p>;
    }

    return (
        <>
            <div className="mb-2 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
                {groups.length > 1 ? (
                    <a
                        href={`#year-${groups[groups.length - 1]!.key}`}
                        className="text-muted-foreground hover:text-foreground text-sm hover:underline"
                    >
                        Jump to oldest
                    </a>
                ) : (
                    <span />
                )}
                {hasSideEvents && (
                    <div className="flex items-center gap-2">
                        <label htmlFor={switchId} className="text-muted-foreground text-sm">
                            Show side events
                        </label>
                        <Switch
                            id={switchId}
                            checked={showSideEvents}
                            onCheckedChange={setShowSideEvents}
                        />
                    </div>
                )}
            </div>
            <SeasonTimeline groups={groups} gameLogo={gameLogo} game={game} />
        </>
    );
};
