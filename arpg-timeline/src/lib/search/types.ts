import { GameCategory } from "@/lib/cms/gameTags";

export interface SearchGame {
    slug: string;
    name: string;
    shortName: string | null;
    group: string | null;
    logoSrc: string | null;
    categories: GameCategory[];
    isDormant: boolean;
    isComingSoon: boolean;
}

export interface SearchIndex {
    games: SearchGame[];
}
