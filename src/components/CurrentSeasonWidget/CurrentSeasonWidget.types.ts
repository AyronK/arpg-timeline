import { ReactNode } from "react";

export type CurrentSeasonChip = "over" | "now" | "live";

export type CurrentSeasonWidgetProps = React.HTMLAttributes<HTMLDivElement> & {
  readonly chip: CurrentSeasonChip;
  readonly progressStart?: ReactNode | undefined;
  readonly progress: number;
  readonly progressEnd?: ReactNode | undefined;
  readonly url?: string | undefined;
  readonly name: string;
  readonly srGameSeason: string;
  readonly srCurrentSeason: string;
  readonly srSeasonStart: string;
  readonly srSeasonEnd: string;
  readonly footer?: ReactNode | undefined;
};
