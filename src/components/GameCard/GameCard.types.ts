import { ReactNode } from "react";
import { CurrentSeasonWidgetProps } from "@/components/CurrentSeasonWidget";
import { NextSeasonWidgetProps } from "@/components/NextSeasonWidget";

export type Game = {
  readonly name: string;
  readonly shortName: string | null;
  readonly official: boolean;
  readonly url: string | null;
  readonly logo: ReactNode;
  readonly currentSeason: CurrentSeasonWidgetProps | null;
  readonly nextSeason: NextSeasonWidgetProps | null;
};

export type GameCardTestProps = TestProps<{
  now?: Date;
  timeLeft?: number;
}>;

export type GameCardProps = GameCardTestProps & Game;
