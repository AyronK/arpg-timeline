import { SanityImageAssetDocument } from "next-sanity";

import { Game as CMSGame } from "@/lib/cms/games.types";
import { SteamNewsItem } from "@/lib/steam/getSteamNews";

export interface GamePageProps {
    params: Promise<{ gameSlug: string }>;
}

export interface SeasonDuration {
    duration: number;
    name: string;
}

export interface GameStatistics {
    averagePerYear: string;
    usualStartTime: string;
    maxDuration: { days: string; name: string };
    minDuration: { days: string; name: string };
}

export interface LocalSeason {
    game?: string;
    start?: { startDate?: string; confirmed?: boolean };
    end?: { endDate?: string; confirmed?: boolean };
    name?: string;
}

export interface StatisticsCardProps {
    value: string;
    label: string;
    subValue?: string | null;
    className?: string;
}

export interface QuickLinksSectionProps {
    game: CMSGame;
    gameSlug: string;
    steamAppId?: number | null;
}

export interface PlatformIntegrationSectionProps {
    steamAppId?: number | null;
    gameNews: SteamNewsItem[];
}

export interface ArchivalSeason {
    name: string;
    startDate: Date;
    endDate: Date | null;
    duration: number | null;
    url?: string;
    patchNotesUrl?: string;
    logo?: SanityImageAssetDocument;
}

export interface ArchivalSeasonsSectionProps {
    seasons: ArchivalSeason[];
    gameLogo: SanityImageAssetDocument;
}

export interface GameHeaderSectionProps {
    game: CMSGame;
    gameSlug: string;
    steamAppId?: number | null;
}

export interface StatisticsSectionProps {
    game: CMSGame;
    statistics: GameStatistics;
    oldestSeasonInfo: string;
}
