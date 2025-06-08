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
    shortName: string | null | undefined;
    official: boolean;
    slug: string;
    seasonKeyword: string;
    url: string | null | undefined;
    group: string | null | undefined;
    logo: any;
    currentSeason?: Season | null | undefined;
    nextSeason?: Season | null | undefined;
    twitchCategory: string | null | undefined;
};

export type Season = {
    start?: SeasonStart | null | undefined;
    end?: SeasonEnd | null | undefined;
    url?: string | null | undefined;
    name: string | null | undefined;
};

export type BaseSeasonDate = {
    confirmed?: boolean | null | undefined;
    overrideText?: string | null | undefined;
    additionalText?: string | null | undefined;
};

export type SeasonStart = BaseSeasonDate & {
    justStarted?: boolean | null | undefined;
    startDate?: string | null | undefined;
};

export type SeasonEnd = BaseSeasonDate & {
    endDate?: string | null | undefined;
};
