import { useTheme } from "@/components/ThemeProvider";
import { INTL_LOCAL_DATETIME } from "@/lib/date";
import Chart from "react-google-charts";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import { drawVerticalLineHighlightingToday } from "@/lib/google-charts/utils";
import {
  getTodaysXCoordinate,
  TIMELINE_OPTIONS,
  TimelineEvent,
} from "@/lib/google-charts/timeline";

const TIMELINE_COLUMNS = [
  { type: "string", id: "Game" },
  { type: "string", id: "Name" },
  { type: "string", role: "tooltip" },
  { type: "date", id: "Start" },
  { type: "date", id: "End" },
];

const timelinePopover = (event: TimelineEvent) => {
  if (!event.name) {
    return "";
  }

  const running = event.startDate
    ? Math.floor(
        (new Date().getTime() - new Date(event.startDate).getTime()) /
          (1000 * 60 * 60 * 24),
      )
    : NaN;
  const left = Math.floor(
    (new Date(event.endDate).getTime() - new Date().getTime()) /
      (1000 * 60 * 60 * 24),
  );

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
              <span class="font-bold">Remaining</span><span class="col-span-2">${-running} day(s)</span>
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
              <span class="font-bold">Running</span><span class="col-span-2">${running} day(s)</span>
          </div>
          <div class="grid grid-cols-3 items-center gap-2">
              <span class="font-bold">Remaining</span><span class="col-span-2">${left} day(s)</span>
          </div>
      </div>
    </div>
  `;
};

export const Timeline = ({ events }: { events: TimelineEvent[] }) => {
  const { theme } = useTheme();
  const { isMd } = useBreakpoint("md");
  const options = TIMELINE_OPTIONS[theme];

  return (
    <div className="relative overflow-x-auto overflow-y-hidden pb-2 md:pb-1">
      <Chart
        chartEvents={[
          {
            eventName: "ready",
            callback: ({ chartWrapper }) =>
              drawVerticalLineHighlightingToday(
                getTodaysXCoordinate(chartWrapper.getDataTable()),
              ),
          },
        ]}
        className="chart w-[400%] md:w-full"
        options={options}
        chartType="Timeline"
        data={[
          TIMELINE_COLUMNS,
          ...events.map((e) => {
            return [
              isMd ? e.game : e.gameShort ?? e.game,
              e.name ? (isMd ? `${e.game} - ${e.name}` : e.name) : "",
              timelinePopover(e),
              new Date(e.startDate),
              new Date(e.endDate),
            ];
          }),
        ]}
        height="214px"
      />
    </div>
  );
};
