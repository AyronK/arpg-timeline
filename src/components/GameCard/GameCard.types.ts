import { ReactNode } from "react";

export type Game = {
  readonly name: string;
  readonly shortName: string | null;
  readonly official: boolean;
  readonly slug: string;
  readonly seasonKeyword: string;
  readonly url: string | null;
  readonly group: string | null;
  readonly logo: ReactNode;
  readonly currentSeason: Season | null;
  readonly nextSeason: Season | null;
};

export type Season = {
  start: SeasonStart | null;
  end: SeasonEnd | null;
  readonly url?: string | null;
  readonly name: string | null;
};

export type BaseSeasonDate = {
  confirmed: boolean | null;
  overrideText?: string | null;
  additionalText?: string | null;
};

export type SeasonStart = BaseSeasonDate & {
  justStarted?: boolean | null;
  startDate: string | null;
};

export type SeasonEnd = BaseSeasonDate & {
  endDate: string | null;
};

export type GameCardTestProps = TestProps<{
  now?: Date;
  timeLeft?: number;
}>;

export type GameCardProps = GameCardTestProps & Game;
