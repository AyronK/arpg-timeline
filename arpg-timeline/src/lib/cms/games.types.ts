import { SanityImageAssetDocument } from "next-sanity";

import { GameCategory, GameTag } from "./gameTags";

export type GameStream = {
    gameSlug: string;
    gameName: string;
    platform: string;
    date: string;
    name: string;
    gameLogo: SanityImageAssetDocument;
    slug: string;
    twitchChannel: string;
    isLiveSoon: boolean;
};
export type GameStatistics = {
    steam?: { currentPlayers: number; appId: number; isComingSoon?: boolean } | null;
};
export type Game = {
    _updatedAt: string;
    _createdAt: string;
    name: string;
    shortName: string | null | undefined;
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
    categories?: GameCategory[];
    tags?: GameTag[];
};

export type Season = {
    _updatedAt: string;
    start?: SeasonStart | null | undefined;
    end?: SeasonEnd | null | undefined;
    url?: string | null | undefined;
    patchNotesUrl?: string | null | undefined;
    name: string | null | undefined;
    logo?: SanityImageAssetDocument;
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
