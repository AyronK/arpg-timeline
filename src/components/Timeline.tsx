import React, { useCallback, useEffect, useRef } from "react";
import Gantt from "ayronk-frappe-gantt";
import { useTheme } from "./ThemeProvider";
import { cn } from "@/lib/utils";

const dateTimeFormatOptions: Intl.DateTimeFormatOptions = {
  month: "short",
  day: "numeric",
  hourCycle: "h24",
  hour: "numeric",
  minute: "numeric",
};

const locale = "en-US";
const localDateTimeIntl = new Intl.DateTimeFormat(
  locale,
  dateTimeFormatOptions,
);

export interface TimelineEvent {
  id: string;
  name: string;
  start: Date;
  end: Date;
  progress: number | undefined;
}
function parseToValidId(str) {
  // Replace spaces and special characters with hyphens
  let id = str.replace(/[^a-zA-Z0-9-_]/g, "-");

  // Remove leading and trailing hyphens
  id = id.replace(/^-+|-+$/g, "");

  // Ensure the id starts with a letter
  if (/^[^a-zA-Z]/.test(id)) {
    id = "id-" + id;
  }

  return id;
}

export const Timeline = ({ events }: { events: TimelineEvent[] }) => {
  const { theme } = useTheme();
  const gantt = useRef<Gantt>();
  const containerRef = useCallback((ref: HTMLDivElement) => {
    const tasks: Gantt.Task[] = events.map((e) => ({
      ...e,
      id: parseToValidId(e.name),
      dependencies: "",
      start: e.start.toISOString(),
      end:
        e.end?.toISOString() ??
        new Date(e.start.getTime() + 90 * 24 * 50 * 60 * 1000).toISOString(),
      progress: e.progress ?? 0,
    }));
    if (!gantt.current) {
      gantt.current = new Gantt(ref, tasks, {
        readonly: true,
        scroll_to: "today",
        view_mode: "Month",
        today_button: false,
        highlight_weekend: false,
        popup: function (task: Gantt.Task) {
          const days = Math.floor(
            (new Date().getTime() - new Date(task.start).getTime()) /
              (1000 * 60 * 60 * 24),
          );
          return days > 0
            ? `
              <div class="shadow-md -m-[10px] p-2 border">
                <span class="text-md mb-1 font-semibold">${task.name}</span>
                <p>Running for ${days} days</p>
                <p>${task.progress.toFixed(0)}% completed!</p>
              </div>
            `
            : `
            <div class="shadow-md -m-[10px] p-2 border">
              <span class="text-md mb-1 font-semibold">${task.name}</span>
              <p>Starts ${localDateTimeIntl.format(new Date(task.start))}</p>              
            </div>
          `;
        },
      });
    } else {
      gantt.current?.refresh(tasks);
    }
  }, []);

  useEffect(() => {
    const tasks: Gantt.Task[] = events.map((e) => ({
      ...e,
      id: parseToValidId(e.name),
      dependencies: "",
      start: e.start.toISOString(),
      end:
        e.end?.toISOString() ??
        new Date(e.start.getTime() + 90 * 24 * 50 * 60 * 1000).toISOString(),
      progress: e.progress ?? 0,
    }));
    gantt.current?.refresh(tasks);
  }, [events]);

  return (
    <div
      ref={containerRef}
      className={cn("gantt-target", { "gantt-dark": theme === "dark" })}
    />
  );
};
