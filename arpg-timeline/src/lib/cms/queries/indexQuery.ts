import { PortableTextBlock, SanityImageAssetDocument } from "next-sanity";

import { GameCategory, GameTag } from "../gameTags";

export const indexQuery = `{
  "games": *[_type == "game"]{
    _id,
    _updatedAt,
    _createdAt,
    "slug":slug.current,
    name,
    shortName,
    isDormant,
    isComingSoon,
    seasonKeyword,
    url,
    group,
    "categories": coalesce(categories, []),
    "tags": coalesce(tags, []),
    "logo": logo.asset->{
      _id,
      url      
    },
    steam,
    "latestLiveStream": *[_type == "liveStreamTwitch" && ^._id == game._ref]
      | order(date desc)[0]{
      _updatedAt,
      _createdAt,
      "platform": platform->_id,
      date,
      name,
      "slug": slug.current
    },
    "recentSeasons": *[_type == "season" && ^._id == game._ref] 
      | order(start.startDate desc)[0..1]{
      _id,
      _updatedAt,
      _createdAt,
      name,
      url,
      "logo": logo.asset->{
        _id,
        url      
      },
      patchNotesUrl,
      start {
        startDate,
        confirmed,
        overrideText,
        additionalText
      },
      end {
        endDate,
        confirmed,
        overrideText,
        additionalText
      } 
    },
    "twitchChannel": *[_type == "liveStreamPlatformTwitch" && ^._id == game._ref]{
      category,
      channel
    }[0]
  },
  "seasons": *[_type == "season"]{
    _id,
    _updatedAt,
    _createdAt,
    name,
    "game": game->slug.current,
    url,
    "logo": logo.asset->{
      _id,
      url      
    },
    patchNotesUrl,
    isSideEvent,
    start {
      startDate,
      confirmed,
      overrideText,
      additionalText
    },
    end {
      endDate,
      confirmed,
      overrideText,
      additionalText
    }
  },
  "toast": *[_type == "toast"] | order(order asc)[0]{
    title,
    description,
    withLogo,
    duration,
    order
  }
}`;

export const gameDetailsQuery = `{
  "games": *[_type == "game"]{
    _id,
    _updatedAt,
    _createdAt,
    "slug":slug.current,
    name,
    shortName,
    isDormant,
    isComingSoon,
    seasonKeyword,
    url,
    group,
    "categories": coalesce(categories, []),
    "tags": coalesce(tags, []),
    "logo": logo.asset->{
      _id,
      url      
    },
    steam,
    "recentSeasons": *[_type == "season" && ^._id == game._ref] 
      | order(start.startDate desc)[0..1]{
      _id,
      _updatedAt,
      _createdAt,
      name,
      url,
      "logo": logo.asset->{
        _id,
        url      
      },
      patchNotesUrl,
      start {
        startDate,
        confirmed,
        overrideText,
        additionalText
      },
      end {
        endDate,
        confirmed,
        overrideText,
        additionalText
      }
    }
  },
  "seasons": *[_type == "season"]{
    _id,
    _updatedAt,
    _createdAt,
    name,
    "game": game->slug.current,
    url,
    "logo": logo.asset->{
      _id,
      url      
    },
    patchNotesUrl,
    isSideEvent,
    start {
      startDate,
      confirmed,
      overrideText,
      additionalText
    },
    end {
      endDate,
      confirmed,
      overrideText,
      additionalText
    }
  },
  "twitchChannels": *[_type == "liveStreamPlatformTwitch"] {
    "game": game->slug.current,
    category,
    channel
  },
}`;

export interface SanityDocumentBase {
    _id: string;
    _updatedAt: string;
    _createdAt: string;
}

export interface SanityGame extends SanityDocumentBase {
    slug: string;
    name: string;
    shortName?: string;
    isDormant?: boolean;
    isComingSoon?: boolean;
    seasonKeyword?: string;
    url?: string;
    group?: string;
    categories?: GameCategory[];
    tags?: GameTag[];
    logo: SanityImageAssetDocument;
    steam?: SteamData;
    recentSeasons: SanitySeason[];
    latestLiveStream?: SanityLiveStreamOnTwitch | null;
    twitchChannel?: SanityTwitchChannel | null;
    averageSeasonDuration?: number;
}

export interface SeasonStartDateInfo {
    startDate?: string;
    confirmed?: boolean;
    overrideText?: string;
    additionalText?: string;
}
export interface SeasonEndDateInfo {
    endDate?: string;
    confirmed?: boolean;
    overrideText?: string;
    additionalText?: string;
}
export interface SanitySeason extends SanityDocumentBase {
    name: string;
    game: string;
    url?: string;
    logo?: SanityImageAssetDocument;
    patchNotesUrl?: string;
    isSideEvent?: boolean;
    start?: SeasonStartDateInfo;
    end?: SeasonEndDateInfo;
}
export interface SanityLiveStreamOnTwitch extends SanityDocumentBase {
    game: string;
    platform: string;
    date: string;
    name: string;
    slug: string;
}
export interface SanityTwitchChannel {
    game: string;
    category?: string;
    channel?: string;
}
export interface SanityToast {
    title: string;
    description?: PortableTextBlock[];
    withLogo?: boolean;
    duration?: number;
    order: number;
}
export interface IndexQueryResult {
    games: SanityGame[];
    seasons: SanitySeason[];
    toast?: SanityToast;
}
export interface SteamData {
    appId?: number | null;
}

export interface GameDetailsQueryResult {
    games: SanityGame[];
    seasons: SanitySeason[];
    twitchChannels: SanityTwitchChannel[];
}
