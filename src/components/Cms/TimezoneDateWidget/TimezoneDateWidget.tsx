import React from "react";
import { TimezoneDateControl } from "@/components/Cms/TimezoneDateWidget/Elements/TimezoneDateControl";

export type WidgetControlProps = {
  onChange: (v: string) => void;
  value: string;
  classNameWrapper: string;
};
type WidgetPreviewProps = { value: string };

const TimezoneDatePreview: React.FC<WidgetPreviewProps> = ({ value }) => {
  return <div>{value}</div>;
};

export const TimezoneDateWidget = {
  name: "timezoneDate",
  controlComponent: TimezoneDateControl,
  previewComponent: TimezoneDatePreview,
};

