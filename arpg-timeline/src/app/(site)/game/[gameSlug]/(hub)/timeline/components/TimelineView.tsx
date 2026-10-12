"use client";

import { SanityImageAssetDocument } from "next-sanity";
import { ReactNode, useId, useMemo, useState } from "react";

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
    header: ReactNode;
    aside: ReactNode;
}

export const TimelineView = ({
    entries,
    gameLogo,
    game,
    emptyText,
    header,
    aside,
}: TimelineViewProps) => {
    const switchId = useId();
    const [showSideEvents, setShowSideEvents] = useState(true);
    const hasSideEvents = entries.some((e) => e.isSideEvent);

    const groups = useMemo(
        () => groupByYear(showSideEvents ? entries : entries.filter((e) => !e.isSideEvent)),
        [entries, showSideEvents],
    );

    // CTAs go on the first upcoming main season, only while no upcoming start date is confirmed
    const upcomingMain = entries.filter((e) => e.status === "upcoming" && !e.isSideEvent);
    // No calendar/bot prompts for dormant games
    const ctaEntryId =
        game.isDormant || upcomingMain.some((e) => e.startDate) ? undefined : upcomingMain[0]?.id;

    const tocHeadings = useMemo(
        () => groups.map((g) => ({ id: `year-${g.key}`, text: g.label, level: 2 as const })),
        [groups],
    );

    return (
        <>
            {/* Same grid as the hub Overview: main column | sidebar */}
            <div className="grid gap-4 md:gap-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-x-12">
                <div className="min-w-0">
                    {header}
                    {entries.length === 0 ? (
                        <p className="text-muted-foreground">{emptyText}</p>
                    ) : (
                        <>
                            {hasSideEvents && (
                                <div className="mb-2 flex items-center justify-end gap-2">
                                    <label
                                        htmlFor={switchId}
                                        className="text-muted-foreground text-sm"
                                    >
                                        Show side events
                                    </label>
                                    <Switch
                                        id={switchId}
                                        checked={showSideEvents}
                                        onCheckedChange={setShowSideEvents}
                                    />
                                </div>
                            )}
                            <SeasonTimeline
                                groups={groups}
                                gameLogo={gameLogo}
                                game={game}
                                ctaEntryId={ctaEntryId}
                            />
                        </>
                    )}
                </div>

                <aside>
                    {/* Support card first so it sits at the same height on every hub tab */}
                    <div className="flex flex-col gap-4 md:gap-6 lg:sticky lg:top-12">
                        {aside}
                        <div className="hidden xl:block">
                            <ArticleToc headings={tocHeadings} variant="sidebar" />
                        </div>
                    </div>
                </aside>
            </div>
            <ArticleToc headings={tocHeadings} variant="bottom" />
        </>
    );
};
