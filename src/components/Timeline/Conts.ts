import { ChartWrapperOptions } from "react-google-charts";

export interface TimelineEvent {
  name: string;
  game: string;
  startDate: Date;
  startDateNotice?: string | null;
  endDate: Date;
  endDateNotice?: string | null;
}

export const TIMELINE_OPTIONS: ChartWrapperOptions["options"] = {
  timeline: {
    groupByRowLabel: true,
    showRowLabels: true,
  },
  avoidOverlappingGridLines: false,
  backgroundColor: "#17171c",
  colors: ["#64748b", "#005410"],
  allowHtml: true,
  alternatingRowStyle: false,
};
