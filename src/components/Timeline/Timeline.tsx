import "@/components/Timeline/Timeline.css";

import { DAY, INTL_LOCAL_DATETIME } from "@/lib/date";
import Chart from "react-google-charts";
import { useRef } from "react";
import { TimelineEvent, TIMELINE_OPTIONS } from "@/components/Timeline/Conts";

const TIMELINE_COLUMNS = [
  { type: "string", id: "Game" },
  { type: "string", id: "Name" },
  { type: "string", role: "tooltip" },
  { type: "date", id: "Start" },
  { type: "date", id: "End" },
];

const getEventPeriods = (event: TimelineEvent) => {
  const running = event.startDate
    ? Math.floor(
        (new Date().getTime() - new Date(event.startDate).getTime()) / DAY,
      )
    : 0;

  const left = Math.max(
    Math.floor(
      (new Date(event.endDate).getTime() - new Date().getTime()) / DAY,
    ),
    0,
  );

  const lasts = Math.floor(
    (new Date(event.endDate).getTime() - new Date(event.startDate).getTime()) /
      DAY,
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
  const titleWrapper = `<div class="space-y-1"><p class="font-medium text-xl leading-none font-heading">${event.game}</p><p class="text-sm font-heading">${event.name}</p></div>`;

  if (running < 0) {
    return `
      <div class="${popoverClass}">
        ${titleWrapper}
        <div class="${labelsWrapperClass}">
            <div class="grid grid-cols-3 items-center gap-2">
                <span class="font-bold">Start date</span><span class="col-span-2">${INTL_LOCAL_DATETIME.format(new Date(event.startDate))}</span>
            </div>
          <div class="grid grid-cols-3 items-center gap-2">
              <span class="font-bold">Launches in</span><span class="col-span-2">${launchesIn} day(s)</span>
          </div>
        </div>
      </div>
    `;
  }

  return `
    <div class="${popoverClass}">
      ${titleWrapper}
      <div class="${labelsWrapperClass}">
          <div class="grid grid-cols-3 items-center gap-2">
              <span class="font-bold">End date</span><span class="col-span-2">${INTL_LOCAL_DATETIME.format(new Date(event.endDate))}</span>
          </div>
          <div class="grid grid-cols-3 items-center gap-2">
              <span class="font-bold">${left > 0 ? "Running" : "Lasted"}</span><span class="col-span-2">${left > 0 ? running : lasts} day(s)</span>
          </div>
          <div class="grid grid-cols-3 items-center gap-2">
              <span class="font-bold">Remaining</span><span class="col-span-2">${Math.max(left, 0)} day(s)</span>
          </div>
      </div>
    </div>
  `;
};

const TODAYS_ENTRY_SELECTOR = `.chart g rect:last-of-type[fill="#303a50"]`;
const ROW_HEIGHT = 40;
const CARD_OFFSET = 96;
const CHART_MAX_HEIGHT = 5 * ROW_HEIGHT + CARD_OFFSET;

export const Timeline = ({ events }: { events: TimelineEvent[] }) => {
  const parentRef = useRef<HTMLDivElement | null>(null);
  const options = TIMELINE_OPTIONS;
  const containerHeight = Math.min(
    (events.length / 2) * ROW_HEIGHT + CARD_OFFSET,
    CHART_MAX_HEIGHT,
  );

  if (events.length < 3) {
    return null;
  }

  return (
    <div
      ref={parentRef}
      className="relative overflow-x-auto overflow-y-hidden"
      style={{
        height: `${containerHeight}px`,
      }}
    >
      <Chart
        chartEvents={[
          {
            eventName: "ready",
            callback: () => {
              const todaysElement = document.querySelector(
                TODAYS_ENTRY_SELECTOR,
              );
              if (parentRef.current && todaysElement) {
                console.log(
                  todaysElement.getBoundingClientRect().left -
                    parentRef.current.getBoundingClientRect().left,
                );
                parentRef.current.scroll({
                  left:
                    todaysElement.getBoundingClientRect().left -
                    parentRef.current.getBoundingClientRect().left -
                    parentRef.current.clientWidth / 2,
                });
              }
            },
          },
        ]}
        className="chart w-[300%] md:w-full"
        options={options}
        chartType="Timeline"
        data={[
          TIMELINE_COLUMNS,
          ...events.map((e) => {
            return [
              e.game,
              e.name ? `${e.game} - ${e.name}` : "",
              timelinePopover(e),
              new Date(e.startDate),
              new Date(e.endDate),
            ];
          }),
          ["⁠", "Today", todaysPopover(), new Date(), new Date()],
        ]}
        height={`${CHART_MAX_HEIGHT}px`}
      />
    </div>
  );
};
