import { ChartWrapperOptions } from "react-google-charts";

export interface TimelineEvent {
  name: string;
  game: string;
  gameShort: string;
  startDate: Date;
  startDateNotice?: string | null;
  endDate: Date;
  endDateNotice?: string | null;
}

export const TIMELINE_OPTIONS: Record<string, ChartWrapperOptions["options"]> =
  {
    light: {
      timeline: {
        groupByRowLabel: true,
        showRowLabels: true,
      },
      avoidOverlappingGridLines: false,
      backgroundColor: "#ffffff",
      colors: ["#cbd5e1", "#6ee7b7"],
      allowHtml: true,
      alternatingRowStyle: false,
    },
    dark: {
      timeline: {
        groupByRowLabel: true,
        showRowLabels: true,
      },
      avoidOverlappingGridLines: false,
      backgroundColor: "#181f2f",
      colors: ["#303a50", "#065f46"],
      allowHtml: true,
      alternatingRowStyle: false,
    },
  };
