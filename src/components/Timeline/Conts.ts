import { ChartWrapperOptions } from "react-google-charts";

export interface TimelineEvent {
  name: string;
  game: string;
  startDate: Date;
  startDateConfirmed: boolean;
  startDateNotice?: string | null;
  endDate: Date;
  endDateConfirmed: boolean;
  endDateNotice?: string | null;
}

export const TIMELINE_OPTIONS: ChartWrapperOptions["options"] = {
  timeline: {
    groupByRowLabel: true,
    showRowLabels: true,
  },
  avoidOverlappingGridLines: false,
  backgroundColor: "#17171c",
  colors: ["#054161", "#054735"],
  allowHtml: true,
  alternatingRowStyle: false,
  fontFamily: "Times New Roman",
};
