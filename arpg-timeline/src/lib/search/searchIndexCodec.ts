import { GameCategory } from "@/lib/cms/gameTags";

import { SearchGame, SearchIndex } from "./types";

export type EncodedSearchGame = [
    slug: string,
    name: string,
    shortName: string,
    group: string,
    logoSrc: string,
    categories: GameCategory[],
    flags: number,
];

export type EncodedSearchIndex = EncodedSearchGame[];

export const LOGO_RENDER_SIZE = 40;

export const DORMANT_FLAG = 1;
export const COMING_SOON_FLAG = 2;

export const decodeSearchIndex = (rows: EncodedSearchIndex): SearchIndex => ({
    games: rows.map(([slug, name, shortName, group, logoSrc, categories, flags]): SearchGame => ({
        slug,
        name,
        shortName: shortName || null,
        group: group || null,
        logoSrc: logoSrc || null,
        categories,
        isDormant: !!(flags & DORMANT_FLAG),
        isComingSoon: !!(flags & COMING_SOON_FLAG),
    })),
});
