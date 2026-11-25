import { Game } from "@/lib/cms/games.types";
import { GameCategory, GameFilterCategory } from "@/lib/cms/gameTags";

import { DashboardStatus } from "./dashboardStatus";

export interface SearchGame {
    slug: string;
    name: string;
    shortName: string | null;
    group: string | null;
    logoSrc: string | null;
    categories: GameCategory[];
    isDormant: boolean;
    isComingSoon: boolean;
    url: string | null;
}

export interface SearchIndex {
    games: SearchGame[];
}

export interface DashboardSearch {
    category: GameFilterCategory;
    games: SearchGame[];
    details: Map<string, { game: Game; status: DashboardStatus }>;
    openFilters: () => void;
    showGame: (slug: string) => void;
}
