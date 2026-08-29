import ClientOnlyVisibleWrapper from "@/components/ClientOnlyVisibleWrapper";
import LocalStartDay from "@/components/LocalStartDay";
import LocalTime from "@/components/LocalTime";

import { StatisticsSectionProps } from "../types";
import { StatisticsCard } from "./StatisticsCard";

const formatPerYear = (averagePerYear: string) => {
    if (averagePerYear === "N/A") return "N/A";
    const avg = parseFloat(averagePerYear);
    const floor = Math.floor(avg);
    const ceil = Math.ceil(avg);
    return floor === ceil ? `${floor}` : `${floor}-${ceil}`;
};

const groupHeadingClass = "text-muted-foreground mb-3 text-xs font-medium tracking-wide uppercase";

export const StatisticsSection = ({
    game,
    statistics,
    oldestSeasonInfo,
}: StatisticsSectionProps) => {
    const {
        minDuration,
        maxDuration,
        medianDuration,
        durationStdDev,
        averagePerYear,
        confirmedStartDates,
    } = statistics;

    const averageDurationDays =
        typeof game.averageSeasonDuration === "number"
            ? Math.round(game.averageSeasonDuration / (1000 * 60 * 60 * 24))
            : null;

    const hasRange = minDuration.days !== null && maxDuration.days !== null;

    return (
        <div className="bg-card text-card-foreground h-full rounded-lg border p-4 md:p-6">
            <h2 className="font-heading mb-4 text-lg md:text-xl">Seasonal Statistics</h2>

            <section>
                <h3 className={groupHeadingClass}>Season length</h3>
                <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-4">
                    <StatisticsCard
                        value={averageDurationDays ?? "N/A"}
                        unit={averageDurationDays !== null ? "days" : undefined}
                        label="Average"
                        info="Mean length of all completed seasons - the total days played divided by the number of seasons."
                    />
                    <StatisticsCard
                        value={medianDuration ?? "N/A"}
                        unit={medianDuration !== null ? "days" : undefined}
                        label="Median"
                        info="The middle season length - half of seasons ran shorter, half ran longer. Less skewed by outliers than the average."
                    />
                    <StatisticsCard
                        value={durationStdDev !== null ? `±${durationStdDev}` : "N/A"}
                        unit={durationStdDev !== null ? "days" : undefined}
                        label="Spread"
                        info="Standard deviation - how far season lengths typically stray from the average."
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
                <h3 className={groupHeadingClass}>Cadence</h3>
                <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3">
                    <StatisticsCard
                        className="col-span-2 sm:col-span-1"
                        value={formatPerYear(averagePerYear)}
                        unit={averagePerYear !== "N/A" ? "/ year" : undefined}
                        label="Seasons per year"
                        subValue="on average"
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
                        label="Usual start day"
                        subValue="local timezone"
                    />
                    <StatisticsCard
                        value={
                            statistics.usualStartTime === "N/A" ? (
                                "N/A"
                            ) : (
                                <span className="block h-8">
                                    <ClientOnlyVisibleWrapper>
                                        <LocalTime utcTime={statistics.usualStartTime} />
                                    </ClientOnlyVisibleWrapper>
                                </span>
                            )
                        }
                        label="Usual start time"
                        subValue="local timezone"
                    />
                </div>
            </section>

            <div className="text-muted-foreground mt-4 text-center text-xs">{oldestSeasonInfo}</div>
        </div>
    );
};
