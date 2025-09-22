export interface GameResponse {
    slug: string;
    name: string;
    seasonKeyword: string | undefined;
}

export interface GamesApiResponse {
    games: GameResponse[];
}

export interface SeasonDateInfo {
    startDate: string | null;
}

export interface SeasonEndDateInfo {
    endDate: string | null;
}

export interface SeasonInfo {
    name: string;
    game: string;
    url: string | null;
    patchNotesUrl: string | null;
    start: SeasonDateInfo;
    end: SeasonEndDateInfo | null;
}

export interface GameSeasonsApiResponse {
    current?: SeasonInfo;
    next?: SeasonInfo;
}

export interface GameSeasonEntry {
    game: string;
    current?: SeasonInfo;
    next?: SeasonInfo;
}

export interface AllSeasonsApiResponse {
    seasons: GameSeasonEntry[];
}

export interface ApiErrorResponse {
    error: string;
}
