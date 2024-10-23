import { ReactNode } from "react";

export type SeasonChip = "over" | "next" | "now" | "live";

export type CurrentSeasonWidgetProps = React.HTMLAttributes<HTMLDivElement> & {
  readonly chip: SeasonChip;
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
