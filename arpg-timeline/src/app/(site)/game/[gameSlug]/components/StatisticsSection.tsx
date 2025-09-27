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
                    value={`${game.averageSeasonDuration || "N/A"} days`}
                    label="Average Duration"
                />
                <StatisticsCard value={statistics.averagePerYear} label="Average Per Year" />
                <StatisticsCard
                    className="col-span-full md:col-span-1"
                    value={
                        statistics.usualStartTime === "N/A" ? (
                            "N/A"
                        ) : (
                            <div className="mx-auto h-8 max-w-1/3">
                                <ClientOnlyVisibleWrapper>
                                    <div>
                                        <LocalTime utcTime={statistics.usualStartTime} />
                                    </div>
                                </ClientOnlyVisibleWrapper>
                            </div>
                        )
                    }
                    label="Usual Start Time"
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
