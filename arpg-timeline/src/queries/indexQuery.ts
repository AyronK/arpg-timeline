import { PortableTextBlock, SanityImageAssetDocument } from "next-sanity";

export const indexQuery = `{
  "games": *[_type == "game"]{
    "slug":slug.current,
    name,
    shortName,
    official,
    seasonKeyword,
    url,
    group,
    "logo": logo.asset->{
      _id,
      url      
    }
  },
  "seasons": *[_type == "season"]{
    name,
    "game": game->slug.current,
    url,
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
  "faq": *[_type == "faq"] | order(order asc){
    title,
    content,
    order
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
    official?: boolean;
    seasonKeyword?: string;
    url?: string;
    group?: string;
    logo?: SanityImageAssetDocument;
}

export interface SeasonDateInfo {
    startDate?: string;
    confirmed?: boolean;
    overrideText?: string;
    additionalText?: string;
}

export interface Season {
    name: string;
    game: string;
    url?: string;
    start?: SeasonDateInfo;
    end?: SeasonDateInfo;
}

export interface Faq {
    title: string;
    content: PortableTextBlock[];
    order: number;
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
    faq: Faq[];
    liveStreamsOnTwitch: LiveStreamOnTwitch[];
    twitchChannels: TwitchChannel[];
    toast?: Toast;
}
