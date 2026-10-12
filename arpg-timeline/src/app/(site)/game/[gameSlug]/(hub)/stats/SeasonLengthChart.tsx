import { SeasonTerms } from "@/lib/seasonTerms";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/ui/Tooltip";

import { formatMonthYear } from "../../hub";
import type { SeasonDuration } from "../../types";
import type { RunningSeason } from "../../utils";
import { buildDayTicks, scaleCeiling, yearStarts } from "./lengthChart";
import { YearAxis } from "./YearAxis";

// Equal-width full-height column is the hit target; the bar inside is capped at 24px
const columnClassName =
    "group focus-visible:ring-ring flex h-full min-w-0 flex-1 cursor-default items-end justify-center focus-visible:ring-2 focus-visible:outline-none";
const barClassName = "w-full max-w-6 rounded-t-[4px]";
const keyItemClassName = "grid grid-cols-[1rem_minmax(0,1fr)] items-start gap-x-2";
// One text line tall (text-sm), so the swatch centres on the first line
const swatchCellClassName = "flex h-5 items-center justify-center";

// Break in the bar near the top, value above it
const ClipMark = ({ days }: { days: number }) => (
    <>
        <span aria-hidden className="bg-card absolute inset-x-0 top-2 h-[3px]" />
        <span
            aria-hidden
            className="text-muted-foreground absolute -top-4 left-1/2 -translate-x-1/2 text-xs whitespace-nowrap tabular-nums"
        >
            {days}
        </span>
    </>
);

// One bar per finished season in launch order; the running season is the outlined last bar
export const SeasonLengthChart = ({
    durations,
    running,
    median,
    terms,
}: {
    durations: SeasonDuration[];
    running: RunningSeason | null;
    median: number | null;
    terms: SeasonTerms;
}) => {
    if (durations.length === 0) return null;

    const seasons = [...durations].sort(
        (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
    );
    const barCount = seasons.length + (running ? 1 : 0);
    // Far outliers don't set the scale; they're drawn clipped with their value on top
    const ticks = buildDayTicks(
        Math.max(scaleCeiling(seasons.map((s) => s.duration)), running?.daysSoFar ?? 0),
    );
    const top = ticks[ticks.length - 1];
    const yPercent = (days: number) => Math.min(days / top, 1) * 100;

    return (
        <figure className="flex flex-col gap-3">
            <figcaption className="text-muted-foreground text-sm">
                Length of every finished {terms.one}, in days.
            </figcaption>

            {/* Headroom for clipped bars' value labels */}
            <div
                className={cn(
                    "grid grid-cols-[auto_minmax(0,1fr)] gap-x-2",
                    seasons.some((s) => s.duration > top) && "mt-4",
                )}
            >
                {/* Y axis: days */}
                <div className="text-muted-foreground relative h-48 text-right text-xs tabular-nums md:h-64">
                    {/* Reserves the column width for the widest tick */}
                    <span className="invisible">{top}</span>
                    {ticks.map((t) => (
                        <span
                            key={t}
                            className="absolute right-0 translate-y-1/2"
                            style={{ bottom: `${yPercent(t)}%` }}
                        >
                            {t}
                        </span>
                    ))}
                </div>

                <div className="relative h-48 md:h-64">
                    {ticks.map((t) => (
                        <div
                            key={t}
                            aria-hidden
                            className={cn(
                                "absolute inset-x-0 border-t",
                                t === 0 ? "border-foreground/25" : "border-foreground/10",
                            )}
                            style={{ bottom: `${yPercent(t)}%` }}
                        />
                    ))}

                    {/* 1px gaps on phones so 40+ bars still fit */}
                    <div className="absolute inset-0 flex items-end gap-px sm:gap-[2px]">
                        {seasons.map((s, i) => (
                            <Tooltip key={i}>
                                <TooltipTrigger asChild>
                                    <div
                                        tabIndex={0}
                                        aria-label={`${s.name}: ${s.duration} days`}
                                        className={columnClassName}
                                    >
                                        <div
                                            className={cn(
                                                barClassName,
                                                "bg-foreground/35 group-hover:bg-foreground/60 group-focus-visible:bg-foreground/60 relative transition-colors",
                                            )}
                                            style={{ height: `${yPercent(s.duration)}%` }}
                                        >
                                            {s.duration > top && <ClipMark days={s.duration} />}
                                        </div>
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent side="top">
                                    <p className="font-semibold">{s.name}</p>
                                    <p>
                                        {s.duration} days · started {formatMonthYear(s.startDate)}
                                    </p>
                                </TooltipContent>
                            </Tooltip>
                        ))}
                        {running && (
                            <div className={columnClassName} aria-hidden>
                                <div
                                    className={cn(
                                        barClassName,
                                        "border-2 border-b-0 border-sky-500",
                                    )}
                                    style={{ height: `${yPercent(running.daysSoFar)}%` }}
                                />
                            </div>
                        )}
                    </div>

                    {median !== null && (
                        <div
                            aria-hidden
                            className="border-foreground/70 pointer-events-none absolute inset-x-0 border-t-2 border-dashed"
                            style={{ bottom: `${yPercent(median)}%` }}
                        />
                    )}
                </div>

                {/* X axis: launch year under the first season of each year */}
                <div />
                <YearAxis years={yearStarts(seasons.map((s) => s.startDate))} barCount={barCount} />
            </div>

            {/* Key: labels live here so nothing covers the bars. Swatches sit in a fixed column
                level with the first line, so wrapped text stays aligned. */}
            <div className="text-muted-foreground flex flex-wrap gap-x-5 gap-y-1 text-sm">
                {median !== null && (
                    <p className={keyItemClassName}>
                        <span className={swatchCellClassName} aria-hidden>
                            <span className="border-foreground/70 w-4 border-t-2 border-dashed" />
                        </span>
                        <span>median {median} days</span>
                    </p>
                )}
                {running && (
                    <p className={keyItemClassName}>
                        <span className={swatchCellClassName} aria-hidden>
                            <span className="h-3.5 w-3 rounded-t-[3px] border-2 border-sky-500" />
                        </span>
                        <span>
                            Running: {running.name}{" "}
                            <span className="whitespace-nowrap">
                                · {running.daysSoFar} {running.daysSoFar === 1 ? "day" : "days"} so
                                far
                            </span>
                        </span>
                    </p>
                )}
            </div>
        </figure>
    );
};
