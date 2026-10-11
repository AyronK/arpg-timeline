"use client";

import { SanityImageAssetDocument } from "next-sanity";
import { useId, useMemo, useState } from "react";

import { ArticleToc } from "@/components/articles/ArticleToc";
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

    const tocHeadings = useMemo(
        () => groups.map((g) => ({ id: `year-${g.key}`, text: g.label, level: 2 as const })),
        [groups],
    );

    if (entries.length === 0) {
        return <p className="text-muted-foreground">{emptyText}</p>;
    }

    return (
        <>
            {hasSideEvents && (
                <div className="mb-2 flex items-center justify-end gap-2">
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
            <SeasonTimeline groups={groups} gameLogo={gameLogo} game={game} />
            <aside className="absolute top-0 right-full bottom-0 mr-8 hidden w-48 @[1792px]:block">
                <div className="sticky top-12">
                    <ArticleToc headings={tocHeadings} variant="sidebar" />
                </div>
            </aside>
            <ArticleToc
                headings={tocHeadings}
                variant="bottom"
                bottomHideClass="@[1792px]:hidden"
            />
        </>
    );
};
