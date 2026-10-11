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

// Same grid as ArticleLayout: year navigation | main column | aside.
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
    const ctaEntryId = upcomingMain.some((e) => e.startDate) ? undefined : upcomingMain[0]?.id;

    const tocHeadings = useMemo(
        () => groups.map((g) => ({ id: `year-${g.key}`, text: g.label, level: 2 as const })),
        [groups],
    );

    return (
        <>
            <div className="xl:grid xl:grid-cols-[1fr_minmax(0,55rem)_1fr] xl:gap-x-8">
                <aside className="hidden xl:col-start-1 xl:row-start-1 xl:block xl:justify-self-end">
                    <div className="sticky top-12 ml-24 w-48">
                        <ArticleToc headings={tocHeadings} variant="sidebar" />
                    </div>
                </aside>

                <div className="mx-auto w-full max-w-[55rem] min-w-0 xl:col-start-2 xl:row-start-1">
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

                <aside className="mt-10 xl:col-start-3 xl:row-start-1 xl:mt-0 xl:justify-self-start">
                    <div className="xl:sticky xl:top-12 xl:w-72">{aside}</div>
                </aside>
            </div>
            <ArticleToc headings={tocHeadings} variant="bottom" />
        </>
    );
};
