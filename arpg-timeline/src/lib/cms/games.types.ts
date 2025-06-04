/* eslint-disable @typescript-eslint/no-explicit-any */
// TODO fix images

export type GameStream = {
    gameSlug: string;
    gameName: string;
    platform: string;
    date: string;
    name: string;
    gameLogo: any;
    slug: string;
    twitchChannel: string;
};

export type Game = {
    name: string;
    shortName: string | null;
    official: boolean;
    slug: string;
    seasonKeyword: string;
    url: string | null;
    group: string | null;
    logo: any;
    currentSeason: Season | null;
    nextSeason: Season | null;
    twitchCategory: string | null;
};

export type Season = {
    start: SeasonStart | null;
    end: SeasonEnd | null;
    url?: string | null;
    name: string | null;
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
