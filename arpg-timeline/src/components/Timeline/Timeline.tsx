"use client";

import "@/components/Timeline/Timeline.css";

import { Expand, Shrink } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import Chart from "react-google-charts";

import { TIMELINE_OPTIONS, TimelineEvent } from "@/components/Timeline/Const";
import { DAY, INTL_LOCAL_DATETIME } from "@/lib/date";
import { Button } from "@/ui/Button";
import { Slider } from "@/ui/Slider";

const TIMELINE_COLUMNS = [
    { type: "string", id: "Game" },
    { type: "string", id: "Name" },
    { type: "string", role: "tooltip" },
    { type: "date", id: "Start" },
    { type: "date", id: "End" },
];

const getEventPeriods = (event: TimelineEvent) => {
    const running = event.startDate
        ? Math.floor((new Date().getTime() - new Date(event.startDate).getTime()) / DAY)
        : 0;

    const left = Math.max(
        Math.floor((new Date(event.endDate).getTime() - new Date().getTime()) / DAY),
        0,
    );

    const lasts = Math.floor(
        (new Date(event.endDate).getTime() - new Date(event.startDate).getTime()) / DAY,
    );

    const launchesIn = Math.max(running < 0 ? -running - 1 : 0, 0);

    return { running, left, lasts, launchesIn };
};

const todaysPopover = () => {
    const popoverClass =
        "z-50 grid gap-4 overflow-hidden rounded-md border bg-popover p-2 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2";
    return `<div class="${popoverClass}">Today</div>`;
};

const timelinePopover = (event: TimelineEvent) => {
    if (!event.name) {
        return "";
    }

    const { running, lasts, launchesIn, left } = getEventPeriods(event);

    const popoverClass =
        "z-50 grid gap-4 overflow-hidden rounded-md border bg-popover p-2 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2";
    const labelsWrapperClass = "grid gap-1";
    const titleWrapper = `<div class="space-y-1"><p class="font-medium text-base md:text-xl leading-none font-heading">${event.game}</p><p class="text-xs md:text-sm font-heading">${event.name}</p></div>`;

    if (running < 0) {
        return `
      <div class="${popoverClass}">
        ${titleWrapper}
        ${
            event.startDateConfirmed
                ? `
          <div class="${labelsWrapperClass}"> 
            <div class="grid grid-cols-3 items-center gap-2">
                <span class="font-bold">Start date</span><span class="col-span-2">${INTL_LOCAL_DATETIME.format(new Date(event.startDate))}</span>
            </div>
            <div class="grid grid-cols-3 items-center gap-2">
                <span class="font-bold">Launches in</span><span class="col-span-2">${launchesIn} day(s)</span>
            </div>
          </div>`
                : (event.startDateNotice ?? "To be announced")
        }
      </div>
    `;
    }

    return `
    <div class="${popoverClass}">
      ${titleWrapper}
      <div class="${labelsWrapperClass}">
        ${
            event.endDateConfirmed
                ? `
          <div class="grid grid-cols-3 items-center gap-2">
              <span class="font-bold">End date</span><span class="col-span-2">${INTL_LOCAL_DATETIME.format(new Date(event.endDate))}</span>
          </div>
          <div class="grid grid-cols-3 items-center gap-2">
              <span class="font-bold">${left > 0 ? "Running" : "Lasted"}</span><span class="col-span-2">${left > 0 ? running : lasts} day(s)</span>
          </div>
          ${
              left > 0
                  ? `          
          <div class="grid grid-cols-3 items-center gap-2">
              <span class="font-bold">Remaining</span><span class="col-span-2">${Math.max(left, 0)} day(s)</span>
          </div>`
                  : ""
          }
          `
                : `
          <div class="grid grid-cols-3 items-center gap-2">
              <span class="font-bold">${left > 0 ? "Running" : "Lasted"}</span><span class="col-span-2">${left > 0 ? Math.max(running, 1) : lasts} day(s)</span>
          </div>`
        }
      </div>
    </div>
  `;
};

const TODAYS_ENTRY_SELECTOR = `.chart g rect:last-of-type[fill="#054161"]`;
const ROW_HEIGHT = 40;
const CARD_OFFSET = 96;
const CHART_MAX_HEIGHT = 5 * ROW_HEIGHT + CARD_OFFSET;

function trimEventsToWindow(events: TimelineEvent[], minDate: Date, maxDate: Date) {
    return events
        .map((event) => {
            const startDate =
                event.startDate < minDate
                    ? minDate
                    : event.startDate > maxDate
                      ? maxDate
                      : event.startDate;
            const endDate =
                event.endDate < minDate
                    ? minDate
                    : event.endDate > maxDate
                      ? maxDate
                      : event.endDate;

            if (endDate < startDate) return null;

            return { ...event, startDate, endDate };
        })
        .filter((e) => e !== null);
}

function addMonthsWithFraction(date: Date, months: number): Date {
    const whole = Math.trunc(months);
    const fraction = months - whole;

    const result = new Date(date);
    result.setMonth(result.getMonth() + whole);

    if (fraction !== 0) {
        const daysInMonth = new Date(result.getFullYear(), result.getMonth() + 1, 0).getDate();
        const addDays = Math.round(daysInMonth * fraction);
        result.setDate(result.getDate() + addDays);
    }

    return result;
}

export const Timeline = ({ events }: { events: TimelineEvent[] }) => {
    const parentRef = useRef<HTMLDivElement | null>(null);
    const [expanded, setIsExpanded] = useState(false);
    const [range, setRange] = useState(1);
    const [ready, setReady] = useState(false);

    const maxAvailableRange = useMemo(() => {
        const now = new Date();
        const latestEnd = events.reduce((latest, e) => {
            const end = new Date(e.endDate);
            return end > latest ? end : latest;
        }, now);
        const diffMonths =
            (latestEnd.getFullYear() - now.getFullYear()) * 12 +
            (latestEnd.getMonth() - now.getMonth()) -
            1;
        return Math.max(1, diffMonths);
    }, [events]);
    const timelineData = useMemo(() => {
        const now = new Date();
        const min = addMonthsWithFraction(now, -range);
        const max = addMonthsWithFraction(now, range);
        const options = {
            ...TIMELINE_OPTIONS,
        };

        if (events.length < 3) {
            return null;
        }

        const trimmed = trimEventsToWindow(events, min, max);
        const containerHeight = Math.min(
            (events.length / 2) * ROW_HEIGHT + CARD_OFFSET,
            CHART_MAX_HEIGHT,
        );

        const data = [
            TIMELINE_COLUMNS,
            ...trimmed.map((e) => {
                return [
                    e.game,
                    e.startDate === e.endDate ? "" : e.game ? `${e.game} - ${e.name}` : "",
                    timelinePopover(e),
                    new Date(e.startDate),
                    new Date(e.endDate),
                ];
            }),
            ["⁠", "Today", todaysPopover(), new Date(), new Date()],
        ];

        return { data, options, containerHeight };
    }, [events, range]);

    if (!timelineData) {
        return null;
    }

    const { data, options, containerHeight } = timelineData;

    return (
        <>
            {ready && (
                <Slider
                    className="absolute top-4 right-12 h-4 w-xs max-w-1/3"
                    value={[range]}
                    max={maxAvailableRange}
                    min={2}
                    step={0.5}
                    onValueChange={([value]) => setRange(value)}
                    aria-description="Timeline scale"
                />
            )}
            {ready && (
                <Button
                    variant={"ghost"}
                    size="icon"
                    aria-label="Expand"
                    className="absolute top-1 right-1"
                    onClick={() => setIsExpanded((v) => !v)}
                >
                    {expanded ? <Shrink className="h-4 w-4" /> : <Expand className="h-4 w-4" />}
                </Button>
            )}
            <div
                ref={parentRef}
                className="relative overflow-x-auto overflow-y-hidden"
                style={{
                    height: expanded
                        ? `${(events.length / 2) * ROW_HEIGHT + 3 * ROW_HEIGHT}px`
                        : `${containerHeight}px`,
                }}
            >
                <Chart
                    chartEvents={[
                        {
                            eventName: "ready",
                            callback: () => {
                                const todaysElement = document.querySelector(TODAYS_ENTRY_SELECTOR);
                                if (parentRef.current && todaysElement) {
                                    const left =
                                        todaysElement.getBoundingClientRect().left -
                                        parentRef.current.getBoundingClientRect().left -
                                        parentRef.current.clientWidth / 2;
                                    if (left > 0) {
                                        parentRef.current.scroll({
                                            left,
                                        });
                                    }
                                }
                                setReady(true);
                            },
                        },
                    ]}
                    className="chart w-[300%] md:w-full"
                    options={options}
                    chartType="Timeline"
                    data={data}
                    height={"100%"}
                />
            </div>
        </>
    );
};
