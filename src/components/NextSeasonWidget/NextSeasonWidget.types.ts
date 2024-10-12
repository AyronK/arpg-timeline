import { ReactNode } from "react";

export type NextSeasonWidgetProps = React.HTMLAttributes<HTMLDivElement> & {
  readonly startLabel?: ReactNode | undefined;
  readonly timer?: ReactNode | undefined;
  readonly url?: string | undefined;
  readonly name: string;
  readonly srGameSeason: string;
  readonly srNextSeason: string;
  readonly srSeasonStart: string;
  readonly action?: ReactNode | undefined;
};
