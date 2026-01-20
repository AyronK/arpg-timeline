import { GameCategory } from "@/lib/cms/gameTags";

export interface GameResponse {
    lastModified: string;
    slug: string;
    name: string;
    seasonKeyword: string | undefined;
    categories?: GameCategory[];
}

export interface GamesApiResponse {
    games: GameResponse[];
}

export interface SeasonInfo {
    id: string;
    lastModified: string;
    name: string;
    game: string;
    url: string | null;
    patchNotesUrl: string | null;
    start: string | null;
    end: string | null;
}

export interface GameSeasonsApiResponse {
    current?: SeasonInfo | null;
    next?: SeasonInfo | null;
}

export interface GameSeasonEntry {
    game: string;
    current?: SeasonInfo | null;
    next?: SeasonInfo | null;
}

export interface AllSeasonsApiResponse {
    seasons: GameSeasonEntry[];
}

export interface ApiErrorResponse {
    error: string;
}
