import ClientOnlyVisibleWrapper from "@/components/ClientOnlyVisibleWrapper";
import LocalTime from "@/components/LocalTime";

import { StatisticsSectionProps } from "../types";
import { StatisticsCard } from "./StatisticsCard";

export const StatisticsSection = ({
    game,
    statistics,
    oldestSeasonInfo,
}: StatisticsSectionProps) => (
    <div className="mb-6 md:mb-8">
        <div className="bg-card text-card-foreground rounded-lg border p-4 md:p-6">
            <h2 className="font-heading mb-3 text-lg md:mb-4 md:text-xl">Statistics</h2>
            <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-5">
                <StatisticsCard
                    value={
                        typeof game.averageSeasonDuration === "number"
                            ? `${Math.round(game.averageSeasonDuration / (1000 * 60 * 60 * 24))} days`
                            : "N/A"
                    }
                    label="Average Duration"
                />
                <StatisticsCard
                    value={
                        statistics.averagePerYear === "N/A"
                            ? "N/A"
                            : (() => {
                                  const avg = parseFloat(statistics.averagePerYear);
                                  const floor = Math.floor(avg);
                                  const ceil = Math.ceil(avg);
                                  return floor === ceil ? `${floor}` : `${floor}-${ceil}`;
                              })()
                    }
                    label="Average Per Year"
                />
                <StatisticsCard
                    className="col-span-full md:col-span-1"
                    value={
                        statistics.usualStartTime === "N/A" ? (
                            "N/A"
                        ) : (
                            <div className="mx-auto h-8">
                                <ClientOnlyVisibleWrapper>
                                    <div>
                                        <LocalTime utcTime={statistics.usualStartTime} />
                                    </div>
                                </ClientOnlyVisibleWrapper>
                            </div>
                        )
                    }
                    label="Usual Start Time"
                    subValue={"(local timezone)"}
                />
                <StatisticsCard
                    value={statistics.maxDuration.days}
                    label="Max Duration"
                    subValue={statistics.maxDuration.name}
                />
                <StatisticsCard
                    value={statistics.minDuration.days}
                    label="Min Duration"
                    subValue={statistics.minDuration.name}
                />
            </div>
            <div className="text-muted-foreground mt-4 text-center text-xs">{oldestSeasonInfo}</div>
        </div>
    </div>
);
