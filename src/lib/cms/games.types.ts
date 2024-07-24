import { ImageDataLike } from "gatsby-plugin-image";

export type Game = {
  readonly title: string;
  readonly shortName: string | null;
  readonly official: boolean;
  readonly slug: string;
  readonly seasonKeyword: string;
  readonly url: string | null;
  readonly group: string | null;
  readonly logo: ImageDataLike;
  readonly currentSeason: CurrentSeason;
  readonly nextSeason: NextSeason;
};

export type Season = {
  readonly endDate: string | null;
  readonly endDateNotice: string | null;
  readonly startDate: string | null;
  readonly startDateNotice: string | null;
  readonly url: string | null;
  readonly title: string | null;
};

export type NextSeason = Season & {
  readonly showCountdown: boolean | null;
};

export type CurrentSeason = Season & {
  readonly justStarted: boolean | null;
};
