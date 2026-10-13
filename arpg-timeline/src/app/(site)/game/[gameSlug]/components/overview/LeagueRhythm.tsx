"use client";

import { ReactNode } from "react";

import ClientOnlyVisibleWrapper from "@/components/ClientOnlyVisibleWrapper";
import LocalStartDay from "@/components/LocalStartDay";
import LocalTime from "@/components/LocalTime";
import { SeasonTerms } from "@/lib/seasonTerms";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/ui/Tabs";

import { RhythmTile } from "../../overview";
import { cardClassName } from "./OverviewCard";

export interface RhythmData {
    length: RhythmTile | null;
    perYear: RhythmTile | null;
    confirmedStartDates: string[];
    usualStartTime: string;
}

const Tile = ({ value, text }: { value: ReactNode; text: string }) => (
    <div className="bg-background/40 rounded-md border p-4">
        {/* Body font: the heading font's decimal point nearly disappears ("~3.5" reads "~35") */}
        <p className="text-lg font-semibold tabular-nums">{value}</p>
        <p className="text-muted-foreground mt-1 text-sm">{text}</p>
    </div>
);

const Tiles = ({
    data,
    terms,
    recentCount,
}: {
    data: RhythmData;
    terms: SeasonTerms;
    recentCount?: number;
}) => (
    <div className="grid gap-4 sm:grid-cols-3 md:gap-6">
        {data.length && <Tile {...data.length} />}
        {data.perYear && <Tile {...data.perYear} />}
        {data.confirmedStartDates.length > 0 && data.usualStartTime !== "N/A" && (
            <Tile
                value={
                    <ClientOnlyVisibleWrapper>
                        <span>
                            <LocalStartDay utcDates={data.confirmedStartDates} />,{" "}
                            <LocalTime utcTime={data.usualStartTime} />
                        </span>
                    </ClientOnlyVisibleWrapper>
                }
                text={
                    recentCount
                        ? `is when the last ${recentCount} ${terms.many} usually launched, in your time zone.`
                        : `is when most past ${terms.many} launched, in your time zone.`
                }
            />
        )}
    </div>
);

const triggerClassName =
    "hover:data-[state=inactive]:text-foreground data-[state=active]:bg-accent data-[state=active]:text-foreground dark:data-[state=active]:bg-accent transition-colors";

export const LeagueRhythm = ({
    all,
    recent,
    allCount,
    recentCount,
    terms,
    gameSlug,
    footer,
}: {
    all: RhythmData;
    recent?: RhythmData;
    allCount: number;
    recentCount: number;
    terms: SeasonTerms;
    gameSlug: string;
    footer?: ReactNode;
}) => {
    const title = <h2 className="font-heading text-lg">{terms.One} rhythm</h2>;

    return (
        <section className={cardClassName}>
            {recent ? (
                <Tabs defaultValue="all" className="gap-4">
                    <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
                        {title}
                        <TabsList className="border-border bg-background border">
                            <TabsTrigger
                                value="all"
                                className={triggerClassName}
                                data-sa-click={`${gameSlug}-rhythm-all`}
                            >
                                All {allCount} {terms.many}
                            </TabsTrigger>
                            <TabsTrigger
                                value="recent"
                                className={triggerClassName}
                                data-sa-click={`${gameSlug}-rhythm-recent`}
                            >
                                Last {recentCount}
                            </TabsTrigger>
                        </TabsList>
                    </div>
                    <TabsContent value="all">
                        <Tiles data={all} terms={terms} />
                    </TabsContent>
                    <TabsContent value="recent">
                        <Tiles data={recent} terms={terms} recentCount={recentCount} />
                    </TabsContent>
                </Tabs>
            ) : (
                <>
                    <div className="mb-4">{title}</div>
                    <Tiles data={all} terms={terms} />
                </>
            )}
            {footer && <div className="mt-4">{footer}</div>}
        </section>
    );
};
