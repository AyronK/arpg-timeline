import { ImageDataLike } from "gatsby-plugin-image";

export type GameStream = {
  readonly gameSlug: string;
  readonly gameName: string;
  readonly platform: string;
  readonly date: string;
  readonly name: string;
  readonly gameLogo: ImageDataLike;
  readonly slug: string;
  readonly twitchChannel: string;
};

export type Game = {
  readonly name: string;
  readonly shortName: string | null;
  readonly official: boolean;
  readonly slug: string;
  readonly seasonKeyword: string;
  readonly url: string | null;
  readonly group: string | null;
  readonly logo: ImageDataLike;
  readonly currentSeason: Season | null;
  readonly nextSeason: Season | null;
  twitchCategory: string | null;
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
