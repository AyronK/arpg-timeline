import "@/components/Timeline/Timeline.css";

import { useTheme } from "@/components/ThemeProvider";
import { INTL_LOCAL_DATETIME } from "@/lib/date";
import Chart from "react-google-charts";
import { useBreakpoint } from "@/hooks/useBreakpoint";
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
        (new Date().getTime() - new Date(event.startDate).getTime()) /
          (1000 * 60 * 60 * 24),
      )
    : 0;

  const left = Math.max(
    Math.floor(
      (new Date(event.endDate).getTime() - new Date().getTime()) /
        (1000 * 60 * 60 * 24),
    ),
    0,
  );

  const lasts = Math.floor(
    (new Date(event.endDate).getTime() - new Date(event.startDate).getTime()) /
      (1000 * 60 * 60 * 24),
  );

  const launchesIn = running < 0 ? -running : 0;

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
  const titleWrapper = `<div class="space-y-2"><p class="font-medium text-base leading-none">${event.game}</p><p class="text-sm text-muted-foreground">${event.name}</p></div>`;

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

const todaysEntrySelector = `.chart g rect:last-of-type[fill="#303a50"]`;

export const Timeline = ({ events }: { events: TimelineEvent[] }) => {
  const parentRef = useRef<HTMLDivElement | null>(null);
  const { theme, getPreference } = useTheme();
  const { isMd } = useBreakpoint("md");
  const options =
    TIMELINE_OPTIONS[theme === "system" ? getPreference() : theme];

  if (events.length < 3) {
    return null;
  }

  return (
    <div
      ref={parentRef}
      className="relative overflow-x-auto overflow-y-hidden pb-2 md:pb-1"
      style={{
        height:
          Math.min((events.length / 2) * 40 + 96, isMd ? 296 : 216) + "px",
      }}
    >
      <Chart
        chartEvents={[
          {
            eventName: "ready",
            callback: () => {
              const todaysElement = document.querySelector(todaysEntrySelector);
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
        className="chart w-[200%] md:w-full"
        options={options}
        chartType="Timeline"
        data={[
          TIMELINE_COLUMNS,
          ...events.map((e) => {
            return [
              isMd ? e.game : (e.gameShort ?? e.game),
              e.name ? (isMd ? `${e.game} - ${e.name}` : e.name) : "",
              timelinePopover(e),
              new Date(e.startDate),
              new Date(e.endDate),
            ];
          }),
          ["⁠", "Today", todaysPopover(), new Date(), new Date()],
        ]}
        height={isMd ? 296 : 216 + "px"}
      />
    </div>
  );
};
