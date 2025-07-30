import { SanityImageAssetDocument } from "next-sanity";

import { MinifiedId } from "../config/DashboardConfig";

export type GameStream = {
    gameSlug: string;
    gameName: string;
    platform: string;
    date: string;
    name: string;
    gameLogo: SanityImageAssetDocument;
    slug: string;
    twitchChannel: string;
};

export type Game = {
    minifiedId: MinifiedId;
    name: string;
    shortName: string | null | undefined;
    official: boolean;
    isDormant: boolean;
    isComingSoon: boolean;
    slug: string;
    seasonKeyword: string;
    url: string | null | undefined;
    group: string | null | undefined;
    logo: SanityImageAssetDocument;
    currentSeason?: Season | null | undefined;
    nextSeason?: Season | null | undefined;
    twitchCategory: string | null | undefined;
    averageSeasonDuration: number | null;
};

export type Season = {
    start?: SeasonStart | null | undefined;
    end?: SeasonEnd | null | undefined;
    url?: string | null | undefined;
    patchNotesUrl?: string | null | undefined;
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
