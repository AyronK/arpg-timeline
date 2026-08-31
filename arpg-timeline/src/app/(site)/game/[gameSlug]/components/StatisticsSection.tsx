import ClientOnlyVisibleWrapper from "@/components/ClientOnlyVisibleWrapper";
import LocalStartDay from "@/components/LocalStartDay";
import LocalTime from "@/components/LocalTime";
import { buildSeasonTerms, SeasonTerms } from "@/lib/seasonTerms";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/ui/Tabs";

import { GameStatistics, StatisticsSectionProps } from "../types";
import { StatisticsCard } from "./StatisticsCard";

const formatPerYear = (averagePerYear: string) => {
    if (averagePerYear === "N/A") return "N/A";
    const avg = parseFloat(averagePerYear);
    const floor = Math.floor(avg);
    const ceil = Math.ceil(avg);
    return floor === ceil ? `${floor}` : `${floor}-${ceil}`;
};

const groupHeadingClass = "text-muted-foreground mb-3 text-xs font-medium tracking-wide uppercase";

const StatisticsGroups = ({
    statistics,
    terms,
}: {
    statistics: GameStatistics;
    terms: SeasonTerms;
}) => {
    const {
        minDuration,
        maxDuration,
        medianDuration,
        durationStdDev,
        averagePerYear,
        averageDurationDays,
        confirmedStartDates,
        usualStartTime,
    } = statistics;

    const hasRange = minDuration.days !== null && maxDuration.days !== null;

    return (
        <>
            <section>
                <h4 className={groupHeadingClass}>{terms.One} length</h4>
                <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-4">
                    <StatisticsCard
                        value={averageDurationDays ?? "N/A"}
                        unit={averageDurationDays !== null ? "days" : undefined}
                        label="Average"
                        info={`Typical ${terms.one} length across every finished ${terms.one}.`}
                    />
                    <StatisticsCard
                        value={medianDuration ?? "N/A"}
                        unit={medianDuration !== null ? "days" : undefined}
                        label="Median"
                        info={`Half of past ${terms.many} were shorter than this, half were longer.`}
                    />
                    <StatisticsCard
                        value={durationStdDev !== null ? `±${durationStdDev}` : "N/A"}
                        unit={durationStdDev !== null ? "days" : undefined}
                        label="Spread"
                        info={`How much ${terms.one} length varies from one ${terms.one} to the next.`}
                    />
                    <StatisticsCard
                        value={hasRange ? `${minDuration.days}-${maxDuration.days}` : "N/A"}
                        unit={hasRange ? "days" : undefined}
                        label="Range"
                        info={
                            hasRange ? (
                                <>
                                    Shortest: {minDuration.name} ({minDuration.days} days)
                                    <br />
                                    Longest: {maxDuration.name} ({maxDuration.days} days)
                                </>
                            ) : undefined
                        }
                    />
                </div>
            </section>

            <section className="mt-6 border-t pt-5">
                <h4 className={groupHeadingClass}>Schedule</h4>
                <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3">
                    <StatisticsCard
                        className="col-span-2 sm:col-span-1"
                        value={formatPerYear(averagePerYear)}
                        unit={averagePerYear !== "N/A" ? "/ year" : undefined}
                        label={`New ${terms.many} a year`}
                        subValue="on average"
                        info={`Based on the gaps between past ${terms.one} starts.`}
                    />
                    <StatisticsCard
                        value={
                            confirmedStartDates.length === 0 ? (
                                "N/A"
                            ) : (
                                <span className="block h-8">
                                    <ClientOnlyVisibleWrapper>
                                        <LocalStartDay utcDates={confirmedStartDates} />
                                    </ClientOnlyVisibleWrapper>
                                </span>
                            )
                        }
                        label="Usual launch day"
                        subValue="your timezone"
                        info={`Weekday past ${terms.many} launched on most often, in your time.`}
                    />
                    <StatisticsCard
                        value={
                            usualStartTime === "N/A" ? (
                                "N/A"
                            ) : (
                                <span className="block h-8">
                                    <ClientOnlyVisibleWrapper>
                                        <LocalTime utcTime={usualStartTime} />
                                    </ClientOnlyVisibleWrapper>
                                </span>
                            )
                        }
                        label="Usual launch time"
                        subValue="your timezone"
                        info={`Time of day past ${terms.many} launched most often, in your time.`}
                    />
                </div>
            </section>
        </>
    );
};

const captionClass = "text-muted-foreground mt-4 text-center text-xs";

const tabsListClass = "border-border bg-background shrink-0 border";
const tabsTriggerClass =
    "transition-colors hover:data-[state=inactive]:text-foreground data-[state=active]:bg-accent data-[state=active]:text-foreground dark:data-[state=active]:bg-accent";

export const StatisticsSection = ({
    game,
    statistics,
    recentStatistics,
    recentSeasonCount = 3,
    oldestSeasonInfo,
}: StatisticsSectionProps) => {
    const terms = buildSeasonTerms(game.seasonKeyword);

    if (!recentStatistics) {
        return (
            <div className="bg-card text-card-foreground h-full rounded-lg border p-4 md:p-6">
                <h2 className="font-heading mb-3 text-lg md:text-xl">{terms.One} statistics</h2>
                <h3 className="sr-only">All-time {terms.one} statistics</h3>
                <StatisticsGroups statistics={statistics} terms={terms} />
                <div className={captionClass}>{oldestSeasonInfo}</div>
            </div>
        );
    }

    return (
        <div className="bg-card text-card-foreground h-full rounded-lg border p-4 md:p-6">
            <Tabs defaultValue="all-time">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <h2 className="font-heading text-lg md:text-xl">{terms.One} statistics</h2>
                    <TabsList className={tabsListClass}>
                        <TabsTrigger className={tabsTriggerClass} value="all-time">
                            All {terms.many}
                        </TabsTrigger>
                        <TabsTrigger className={tabsTriggerClass} value="recent">
                            Last {recentSeasonCount} {terms.many}
                        </TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="all-time" forceMount className="data-[state=inactive]:hidden">
                    <h3 className="sr-only">All-time {terms.one} statistics</h3>
                    <StatisticsGroups statistics={statistics} terms={terms} />
                    <div className={captionClass}>{oldestSeasonInfo}</div>
                </TabsContent>

                <TabsContent value="recent" forceMount className="data-[state=inactive]:hidden">
                    <h3 className="sr-only">
                        Last {recentSeasonCount} {terms.many} statistics
                    </h3>
                    <StatisticsGroups statistics={recentStatistics} terms={terms} />
                    <div className={captionClass}>
                        Based on the {recentSeasonCount} most recently recorded {terms.many}.
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
};
