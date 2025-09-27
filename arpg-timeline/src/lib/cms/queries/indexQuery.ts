import { PortableTextBlock, SanityImageAssetDocument } from "next-sanity";

import { GameCategory, GameTag } from "../gameTags";

export const indexQuery = `{
  "games": *[_type == "game"]{
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
    steam
  },
  "seasons": *[_type == "season"]{
    name,
    "game": game->slug.current,
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

  "liveStreamsOnTwitch": *[_type == "liveStreamTwitch"]{
    "game": game->slug.current,
    "platform": platform->_id,
    date,
    name,
    "slug": slug.current
  },
  "twitchChannels": *[_type == "liveStreamPlatformTwitch"]{
    "game": game->slug.current,
    category,
    channel
  },
  "toast": *[_type == "toast"] | order(order asc)[0]{
    title,
    description,
    withLogo,
    duration,
    order
  }
}`;

export interface Game {
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
    logo?: SanityImageAssetDocument;
    steam?: SteamData;
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
export interface Season {
    name: string;
    game: string;
    url?: string;
    logo?: SanityImageAssetDocument;
    patchNotesUrl?: string;
    start?: SeasonStartDateInfo;
    end?: SeasonEndDateInfo;
}
export interface LiveStreamOnTwitch {
    game: string;
    platform: string;
    date: string;
    name: string;
    slug: string;
}
export interface TwitchChannel {
    game: string;
    category?: string;
    channel?: string;
}
export interface Toast {
    title: string;
    description?: PortableTextBlock[];
    withLogo?: boolean;
    duration?: number;
    order: number;
}
export interface IndexQueryResult {
    games: Game[];
    seasons: Season[];
    liveStreamsOnTwitch: LiveStreamOnTwitch[];
    twitchChannels: TwitchChannel[];
    toast?: Toast;
}
export interface SteamData {
    appId?: number | null;
}
